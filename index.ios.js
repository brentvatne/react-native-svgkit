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

var SvgExample = React.createClass({
  render() {
    return <Wave />;
  }
});

AppRegistry.registerComponent('SvgExample', () => SvgExample);
