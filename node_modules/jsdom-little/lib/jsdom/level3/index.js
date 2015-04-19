module.exports.dom = {
  level3 : {
    core   : require("./core").dom.level3.core,
    xpath  : require("./xpath"),
    html   : require("./html").dom.level3.html,
  }
};

module.exports.dom.ls = require('./ls').dom.level3.ls;
