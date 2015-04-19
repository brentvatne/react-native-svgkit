'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
} = React;

var Svg = require('./Svg');
var Path = require('./Path');
var TimerMixin = require('react-timer-mixin');
var ReactLogo = require('./ReactLogo');
var Wave = require('./Wave');
var Chart = require('./Chart');
var D3Chart = require('./D3Chart');

var SvgExample = React.createClass({
  render() {
    return <D3Chart />;
  }
});

AppRegistry.registerComponent('SvgExample', () => SvgExample);
