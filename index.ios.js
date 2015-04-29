'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  AlertIOS,
} = React;

var Svg = require('./Svg');
var Path = require('./Path');
var TimerMixin = require('react-timer-mixin');
var ReactLogo = require('./ReactLogo');
var Wave = require('./Wave');
var Chart = require('./Chart');
var D3Chart = require('./D3Chart');

var getRefByNodeHandle = (handle, refs) => {
  var result;

  Object.keys(refs).forEach((refKey) => {
    if (refs[refKey].getNodeHandle() === handle) {
      result = refs[refKey];
    }
  })

  return result;
}

var SvgExample = React.createClass({
  nextInput(e) {
    var ref = getRefByNodeHandle(e.target, this.refs);
    ref.focus();
  },

  render() {
    // return <D3Chart />;
    // Uncomment out to try others
    // return <Wave />;
    // return <ReactLogo />;
    return <Chart />;
  }
});

AppRegistry.registerComponent('SvgExample', () => SvgExample);
