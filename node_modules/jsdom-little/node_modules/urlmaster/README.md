urlmaster
=========

Overview
--------
urlmaster is a library to wotk with arbitrary URLs. It can:

* Generate all types of URLs
* Resolve URLs
* Test URLs


Installation
------------
Installation is fairly straightforward, just install the npm module:

    npm install urlmaster


Usage
-----
First step, as with any node package, is to require it:

````JavaScript
var um = require('urlmaster');
````
### Generate Single URL
To generate a URL, you call um.generate():

````JavaScript
var url = um.generate(opts,config); // returns a URL string, e.g. "http://github.com/deitch/urlmaster"
````

The options 'opts' determines what components to include in the URL. All options are binary true/false, and the default for every option is false. The names of the options are not the commonly used names, although those are given below, but the official URL components given in http://tools.ietf.org/html/rfc3986

* scheme: whether or not not include a scheme (also known as a protocol) in the generated URL
* auth: whether or not to include an authority (also know as host) in the generated URL
* path: whether or not to include a path component in the generated URL
* relativePath: whether the path should be a relative path (true) or absolute path (false, the default). Ignored if path is false.
* dotsPath: whether or not the path should include multiple varieties of dots in the path, e.g. /./a/b/.././e/f/../ Ignore if path is false.
* query: whether or not to include a query string, e.g. ?foo=bar
* frag: whether or not to include a fragment (also known as hash) in the generated URL, e.g. #section2

The optional 'config' sets what the URL components should be. For example, if you set {scheme:true}, then urlmaster's default scheme is 'http'. If you prefer it use 'https', set it in the config. If you set an element in the config, but then do not set its option to be true, it will be ignored. 'opts' determines what is included; 'config' determines what the actual string is, if it is included by 'opts'. The following are valid config; all are of type String.

* scheme: scheme to use. Can end in a ':' character per the RFC, or um.generate() will add it for you. Default: 'http'
* auth: auth to use. Can start with '//' per the RFC or um.generate() will add it for you. Default: 'www.atomicinc.com'
* path: path component to use. Can start with '/' (absolute) or without (relative); um.generate() will do the right thing and remove/add it based on the 'relativePath' option. Default: '/a/b'
* query: query component to use. Can start with '?' per RFC, or um.generate() will add it for you. Default: '?foo=bar'
* frag: fragment component to use. Can start with '#' per RFC, or um.generate() will add it for you. Default: '#abc'

### Generate All URLs
If you want to generate all possible combinations of URLs (with/without scheme, with/without host, with/without path, with/without dots, etc.), urlmaster will do it for you. It will create all possible variants of 'opts' for um.generate(), remove duplicates, and return every unique URL.

````JavaScript
var urls = um.generateAll(config,stringOnly); // returns array
````

The option 'config' is identical to 'config' for um.generate() above.

The function returns an array of objects. Each object is the options 'opts' that generated the particular, with the property 'url' added that contains the URL string.

If you don't want all of the opts options back, just an array of strings, set the parameter 'stringOnly' to true, and it will return an array of strings, just the URLs.

### Resolve
Resolve is the basic functionality provided by browsers and node's URL library. However, this code will resolve any URL according to the RFC, including arrays and arrays of arrays, and can handle resolve() like a browser, with document location, base and reference.

````JavaScript
var resolved = um.resolve(base,reference); // resolves reference relative to base, assuming base is either document base href or properly resolved
var resolve = um.resolve(locn,base,reference); // first resolves base relative to locn, then reference relative to resolved base
````

um.resolve() is smart enough to handle multiple cases.

#### Base & Reference
* if base and reference are both Strings, then return a resolved String
* if base is a String and reference is an array of Strings, then return an array of resolved Strings: every reference according to the base
* if base is an array of Strings and reference is a String, then return an array of resolved Strings: the single reference according to each base
* if the base is an array of Strings and reference is an array of Strings, then return an array of arrays of Strings: each array in the outside array is all of the references resolved according to its base.

To understand the last case, let us assume:

````JavaScript
base = ['http://www.google.com/','http://www.yahoo.com','http://www.msn.com'];
ref = ['/a','/b','/c'];
urls = um.resolve(base,ref);
````

Then the resulting array urls will contain:

````JavaScript
[
['http://www.google.com/a','http://www.google.com/b','http://www.google.com/c'],
['http://www.yahoo.com/a','http://www.yahoo.com/b','http://www.yahoo.com/c'],
['http://www.msn.com/a','http://www.msn.com/b','http://www.msn.com/c']
]
````

base **must** be a valid, complete URL that could be resolved by any browser/curl/wget. If it is not, the result is always 'null'. If you need to check an incomplete base, e.g. if your document has the following:

````html4
<base href="a/b"></base>
````

Then you should do one of the following two equivalent things:

* resolve the base first relative to the document location: um.resolve(um.resolve(locn,base),ref);
* use the three-argument version: um.resolve(locn,base,href);


#### Locn, Base & Reference

* if locn, base & reference are all Strings, then return a resolved string
* if locn is a String and base is a String, and reference is an array of Strings, then resolve base relative to locn, then return an array of resolved Strings: every reference according to the resolved base
* if locn is a String, base is an array of Strings, and reference is a String, then resolve each base relative to the locn, and resolve the reference according to each resolved base, returning an array of Strings as long as the base array
* if locn is an array of Strings, and base and reference are Strings, then resolve base relative to each locn in the array, and then resolve the reference according to each resolved base, returning an array of Strings as long as the locn array
* if locn is a String, and base and reference are both arrays of Strings, then resolve each base relative to the locn, then resolve each reference according to each resolved location, returning an array of arrays of Strings. This is identical to the last case in um.resolve(base,reference) with base and reference both arrays.
* if locn and base are both arrays of Strings, and reference is a String, then resolve each base relative to each locn, and then resolve the reference according to each resolved base, returning an array of arrays. 
* if locn, base and reference are all arrays of Strings, then resolve each base relative to each locn, and then resolve each reference according to each resolved base, returning an array of arrays.

Note that um.resolve(locn,base,ref) is identical to um.resolve(um.resolve(locn,base),ref)


#### Incomplete Base
A base should always be a valid complete URL, including scheme/protocol and authority/host. However, it is possible to resolve against an incomplete base. For example:

````html4
<head>
 <base href="/a/b#123"/>
</head>
````

In the above example, there is no scheme and no authority. Fortunately, the specification explains how to resolve such a URL at http://www.w3.org/html/wg/drafts/html/master/infrastructure.html#base-urls

To summarize:

* First, resolve the base (if any) against the document's location URL. This gives the document base URL.
* Second, resolve any anchor href URL against the document base URL.

In other words, we never resolve an anchor tag against the base href URL, but rather against the document base URL, which is given by first resolving the base tag URL against the document's location URL.

Since a document's address can never be anything other than a valid complete URL, eventually all hrefs that are resolved, must resolve to a valid URL.

To support this behaviour correctly, the first argument to um.resolve() must always be a valid complete URL with scheme and authority. 


### Resolve With Tracking
What happens if you need not only to resolve, but also need to track how you got there? This is most often used in testing. It isn't enough to known that resolving '/a' relative to a base of 'http://www.google.com' gives 'http://www.google.com/a', but you need the results to show the inputs as well. 

A variant on resolve() will give it to you:

````JavaScript
locn = 'http://www.example.com/here';
base = ['http://www.google.com/','http://www.yahoo.com','http://www.msn.com'];
ref = ['/a','/b','/c'];
urls = um.resolveTrack(base,ref); // two argument mode
urls = um.resolveTrack(locn,base,ref); // three argument mode
````

The result, in this case, will always be an array of arrays. Each array is a tuple of [base, reference, resolved]:

````JavaScript
[
['http://www.google.com','/a','http://www.google.com/a'],
['http://www.google.com','/b','http://www.google.com/b'],
// etc.
]
````

resolveTrack is smart enough to handle simple strings as well:

````JavaScript
urls = um.resolveTrack('http://www.google.com','/a'); // two-argument mode
// returns ['http://www.google.com','/a','http://www.google.com/a']
urls = um.resolveTrack('http://www.google.com','/foo/base','a'); // three-argument mode
// returns ['http://www.google.com','/foo/base','a','http://www.google.com/foo/a']
````

### Generate a Test Set
And if you want a test set of all variants of two different URLs and their expected resolution results?

````JavaScript
expected = um.resolveAll();
````

The result 'expected' will be an array of URLs, identical to those provided by um.resolveTrack(base,ref), where base and ref are provided by two different runs of um.generateAll(). The following are equivalent:

````JavaScript
expected = um.resolveAll(); 

// is identical to 

expected = um.resolveTrack(
'http://www.because.com/the/end',
 um.generateAll({scheme:"http",auth:'www.why.com',path:'/a/b',query:'?foo=bar',frag:'#abc'}),
 um.generateAll({scheme:"https",auth:'www.not.com',path:'/q/r',query:'?when=now',frag:'#xyz'})
);

````

To generate a test set from the command-line (Unix/Linux/BSD/Mac only), after npm install:

    node_modules/.bin/urlmasterset > some_output_file.json

### A funny thing about empty paths
According to the RFC at http://tools.ietf.org/html/rfc3986#section-3.3, if the path is empty (path-abempty), then it is valid as "" or "/". So both http://tools.ietf.org and http://tools.ietf.org/ are equally legitimate paths. 

urlmaster had to pick one or the other (with or without slashes) to be consistent. So urlmaster **always** treats empty paths as '/'. However, one some platforms or libraries, you may get results you want to test, and if urlmaster gives http://tools.ietf.org/ then you want http://tools.ietf.org to be treated as legitimate (and vice-versa).

To solve this problem, urlmaster adds two methods:

````JavaScript
url = um.addPathEmpty(url);
url = em.clearPathEmpty(url);
````

As you would expect, `um.addPathEmpty(url)` takes a url as a string, and, if it contains an empty path of "" (with or without host, scheme, query, hash, whatever), then it replaces the empty path with "/" and returns the modified URL.

Similarly, `um.clearEmptyPath(url)` takes a url as a string, and, if it contains an empty path of "/" (with or without host, scheme, query, hash, whatever), then it replaces the empty path "/" with "" and returns the modified URL.
