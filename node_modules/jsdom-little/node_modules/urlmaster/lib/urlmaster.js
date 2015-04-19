/*jslint node:true */

var URL = require('url'), that, _resolve;
	/*
	RFC resolution cases from http://tools.ietf.org/html/rfc3986#section-5.2
	But much modified to fit the real world based on http://url.spec.whatwg.org/#parsing
	The primary differences are:
	1) Handling http:/q/r is turned into http://q/r (per the WHATWG) and not http:///q/r (per the RFC)
	2) Resolving http:/a/b/c relative to http://q/r becomes http://q/a/b/c (per the WHATWG) and not http:/a/b/c (per the RFC)
			This is that if the ref scheme === base scheme AND ref has no authority, then use the base host
	
	B = base of document
	R = URL we want to parse
	T = transformed (i.e. result)

	Everything is RFC unless explicitly indicated
	
	if (R.scheme) {
		T is R, subject to:
		- path removes dot segments
		- if B.scheme === R.scheme AND R.authority is empty, then T.authority = B.authority
		- if B.scheme !== R.scheme AND R.authority is empty AND R.path starts with / and exists, then convert first / into // and reparse
	} else if (R.authority) {
		T uses B.scheme
		T uses R.authority, R.path (remove dot segments), R.query
	} else {
		T uses B.scheme, B.authority
		if (! R.path) {
			T uses B.path; R.query else B.query
		} else if (R.path starts with '/' ) {
			// absolute path case
			T uses R.path and R.query (else blank, but NOT B.query)
		} else {
			// relative path case
			T uses merged path of R and B, subject to merged result removes dot segments
			T uses R.query (else blank but NOT B.query)
		}
	}
	T.fragment is R.fragment
		
	So what are our cases?
	The Base should be looked at as combinations of:
		- explicit base.href and without (should get base from doc)
		- with/without scheme
		- with/without authority (includes host and user:pass)
		- with/without path
		- with/without query
		- with/without fragment
	The Reference should be look at as combinations of:
		- with/without scheme
		- with/without authority (includes host and user:pass)
		- with/without path
		- with relative/absolute path
		- with/without dots in path
		- with/without query
		- with/without fragment

	Net result is that there are 2^6 = 64 Base combinations and 2^7 = 128 Reference combinations, for a total of
		2^7 * 2^6 = 2^13 = 8192 total combinations
		
	*/

	// generate all possible URLs
	var OPTS = ['scheme','auth','path','relativePath','dotsPath','query','frag'], len = OPTS.length;
	var resolveDots = function(url) {
		var input, output;
		url = url || "/";
		input = url.split('/');
		output = [];
		// if path was absolute?
		if (url.charAt(0) === '/') {
			output.push('');
		}
		// if there is only a slash?
		if (url.length === 1) {
			output.push('');
		}
		input.forEach(function(component){
			if (component === '..') {
				output.pop();
			} else if (component && component !== '.'){
				output.push(component);
			}
		});
		return(output.join('/'));
	};
	var mergePath = function(base,ref) {
		var ret = "";
		if (ref && (!base || base === "" || base === '/')) {
			ret = '/' + ref;
		} else {
			ret = base.substring(0,base.lastIndexOf('/')+1)+ref;
		}
		// always make sure that we start with a /
		if (ret[0] !== '/') {
			ret = '/' + ret;
		}
		return(ret);
	};
	var getAuth = function(a,h) {
		var t = "";
		t += (a?a+'@':'');
		t += (h||"");
		t = '//'+t;
		return(t);
	};
	_resolve = function(base,ref) {
		var b = URL.parse(base||"",true,true), r = URL.parse(ref||"",true,true), ret = "", t, isWinDrive = false;
		// base must always be valid - but even so, try to resolve it
		/*
		if (!base || base === "" || !b.protocol || b.protocol === "" || ((!b.host || b.host === "") && b.protocol !== "file:")) {
			ret = null;
		} else*/ if (r.protocol) {
			// if no r.host and r.protocol === b.protocol, then we use b.host per http://url.spec.whatwg.org/#scheme-state step 2.4
			// if not r.host and r.protocol !== b.protocol, then we use first part of path as host per http://url.spec.whatwg.org/#authority-second-slash-state 
			if (!r.host) {
				if (r.protocol && r.protocol === b.protocol) {
					ret = b.protocol + getAuth(b.auth,b.host) + resolveDots(r.path) + (r.hash||"");
				} else if (!r.pathname || r.pathname === '/'){
					ret = r.protocol + getAuth('','') + resolveDots('/') + r.search + (r.hash||"");
				} else {
					// reparse ref replacing first ':/' with '://' and ':' with '://'
					ret = _resolve(base,ref.replace(/:\/?/,'://'));
				}
			} else {
				// else we just use r as ret
				ret = r.protocol + getAuth(r.auth,r.host) + resolveDots(r.path) + (r.hash||"");
			}
		} else if (r.host) {
			ret = (b.protocol||"") + getAuth(r.auth,r.host)+resolveDots(r.path) + (r.hash||"");
		} else {
			ret = (b.protocol||"") + getAuth(b.auth,b.host);
			isWinDrive = b.pathname && b.pathname.length > 2 && b.pathname.match(/^\/[a-z]:/i);
			if (! r.pathname) {
				t = resolveDots(b.pathname);
				ret += t + (isWinDrive && t === b.pathname.substring(0,3) ? '/' : '') + (r.search||b.search||"");
			} else if (r.pathname[0] === '/' ) {
				// absolute path case
				t = resolveDots(r.path);
				// handle the special windows drive case http://url.spec.whatwg.org
				if (isWinDrive && !r.pathname.match(/^\/[a-z]:/i)) {
					ret += b.pathname.substring(0,3) + (t || '/');
					// if we only have the windows drive, trail a slash, like with a regular URL if there is no path at all
				} else {
					ret += t;
				}
				 
			} else {
				// relative path case
				ret += resolveDots(mergePath(b.pathname,r.pathname)) + (r.search || "");
			}
			ret += r.hash || "";
		}
		return(ret);
	};

	that = {
		// generate a url given the following options: yes/no scheme, yes/no auth, yes/no path, yes/no config, yes/no frag
		// in addition, the path can be relative/absolute, and can be with/without dots
		// finally, for tests, need to include extreme case of absolute path of '/'
		generate : function(opts,config) {
			var scheme = "http", auth = "www.atomicinc.com", path = "/a/b", dots = "/./c/d/.././e/../f", query = "?foo=bar", frag = "#abc";
			opts = opts || {};
			config = config || {};
			if (opts.scheme) {
				scheme = config.scheme || scheme;
				if (scheme.charAt(scheme.length-1) !== ":") {
					scheme += ":";
				}
			} else {
				scheme = "";
			}
			if (opts.auth) {
				auth = config.auth || auth;
				if (auth.substr(1,2) !== '//') {
					auth = '//' + auth;
				}
			} else {
				auth = "";
			}
			if (opts.path) {
				path = config.path || path;
			} else {
				path = "";
			}
			// can only do relative path if we have a path AND requested relativePath AND there is no authority
			//    irrelevant to discuss relative path when authority has changed
			if (opts.path && opts.relativePath && !opts.auth) {
				path = path.substring(1);
			}
			// can only do dots on path if we have a path
			if (opts.path && opts.dotsPath) {
				path = path + dots;
			}
			if (opts.query) {
				query = config.query || query;
				if (query && query.length > 0 && query.charAt(0) !== '?') {
					query = '?'+query;
				}
			} else {
				query = "";
			}
			if (opts.frag) {
				frag = config.frag || frag;
				if (frag && frag.length > 0 && frag.charAt(0) !== '#') {
					frag = '#'+frag;
				}
			} else {
				frag = "";
			}
			// sanely handle the distinction between path and auth
			if (auth && path && path.charAt(0) !== "/") {
				path = '/' + path;
			}
			return([scheme,auth,path,query,frag].join(""));
		},
		generateAll : function(config,stringOnly) {
			var tmp, ary, i, result = [], urllist = {}, addElm = function(elm){
				ary.push(elm === '0' ? false : true);
			}, saveOpt = function(key,pos) {
				tmp[key] = ary[pos];
			};
			for (i=0; i<Math.pow(2,len); i++) {
				ary = []; tmp = {};
				(i).toString(2).split('').forEach(addElm);
				while(ary.length < len) {
					ary.unshift(false);
				}
				OPTS.forEach(saveOpt);
				tmp.url = that.generate(tmp,config);
				if (!urllist[tmp.url]) {
					result.push(stringOnly?tmp.url:tmp);
				}
				urllist[tmp.url] = true;
			}
			// add the special '/' only case
			if (!urllist['/']) {
				// add special case of just '/'
				result.push(stringOnly?'/':{scheme:false,auth:false,path:true,relativePath:false,dotsPath:false,query:false,frag:false,url:'/'});
			}
			return(result);
		},
		resolve : function(locn,base,ref) {
			var ret, tmp;
			// are we in two-part mode?
			if (ref !== undefined) {
				ret = this.resolve(this.resolve(locn,base),ref);
			} else {
				ref = base || "";
				base = locn || "";
			
				if (typeof(base) === "string") {
					if (typeof(ref) === "string") {
						ret = _resolve(base,ref);
					} else {
						ret = [];
						ref = [].concat(ref||"");
						// resolve multiple ref for a single base
						ref.forEach(function(r){
							ret.push(_resolve(base,r));
						});
					}
				} else {
					base = [].concat(base||"");
					if (typeof(ref) === "string") {
						// resolve single ref for multiple base
						ret = [];
						base.forEach(function(b){
							ret.push(_resolve(b,ref));
						});
					} else {
						ret = [];
						ref = [].concat(ref||"");
						// resolve multiple ref for multiple base
						base.forEach(function(b){
							tmp = [];
							ref.forEach(function(r){
								tmp.push(_resolve(b,r));
							});
							ret.push(tmp);
						});
					}
				}
			}

			return(ret);
		},
		resolveTrack : function(locn,base,ref) {
			var ret, u, b;

			// first argument must always be a valid complete URL, whether 2-arg or 3-arg mode
			u = URL.parse(locn||"");
			if (!u || !u.protocol || u.protocol === "" || ((!u.host || u.host === "") && u.protocol !== "file:")) {
				ret = null;
			} else {
				if (ref === undefined) {
					ref = base || "";
					base = locn || "";
					locn = null;
				}
			
				if (typeof(base) === "string") {
					b = locn ? this.resolve(locn,base) : base;
					if (typeof(ref) === "string") {
						ret = [locn,base,ref,_resolve(b,ref)];
					} else {
						ret = [];
						ref = [].concat(ref||"");
						// resolve multiple ref for a single base
						ref.forEach(function(r){
							ret.push([locn,base,r,_resolve(b,r)]);
						});
					}
				} else {
					base = [].concat(base||"");
					if (typeof(ref) === "string") {
						// resolve single ref for multiple base
						ret = [];
						base.forEach(function(b){
							var r = locn ? that.resolve(locn,b) : b;
							ret.push([locn,b,ref,_resolve(r,ref)]);
						});
					} else {
						ret = [];
						ref = [].concat(ref||"");
						// resolve multiple ref for multiple base
						base.forEach(function(b){
							var l = locn ? that.resolve(locn,b) : b;
							ref.forEach(function(r){
								ret.push([locn,b,r,_resolve(l,r)]);
							});
						});
					}
				}
			}
			
			// is this 2-argument or 3-argument mode?
			return(ret);
		},
		resolveAll : function() {
			return(that.resolveTrack(
				'http://www.because.com/the/end',
			 that.generateAll({scheme:"http",auth:'www.why.com',path:'/a/b',query:'?foo=bar',frag:'#abc'},true),
			 that.generateAll({scheme:"https",auth:'www.not.com',path:'/q/r',query:'?when=now',frag:'#xyz'},true)
			));
		},
		// removes the slash from an empty path, turning it from '/' into ''
		clearPathEmpty: function(url) {
			var r = URL.parse(url||"");
			return((r.protocol||"") + getAuth(r.auth,r.host) + (r.pathname === '/'?"":(r.pathname||"")) + (r.search||"")+(r.hash||""));
		},
		// adds the slash to an empty path, turning it from '' into '/'
		addPathEmpty: function(url) {
			var r = URL.parse(url||"");
			return((r.protocol||"") + getAuth(r.auth,r.host) + ((r.pathname||"") === ''?"/":r.pathname) + (r.search||"")+(r.hash||""));
		}
	};
		
	module.exports = that;