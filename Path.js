/**
 * @providesModule Path
 * @flow
 */

'use strict';

var createReactIOSNativeComponentClass = require('createReactIOSNativeComponentClass');
var ReactIOSViewAttributes = require('ReactIOSViewAttributes');
var merge = require('merge');
var React = require('react-native');

var {
  View,
  PropTypes,
  StyleSheet,
} = React;

var Path = React.createClass({
  propTypes: {
    fill: PropTypes.string,
    stroke: PropTypes.string,
    strokeWidth: PropTypes.string,
    strokeMiterLimit: PropTypes.string,
    d: PropTypes.string,
    transform: PropTypes.string,
  },

  render() {
    return <View />;
  },
});

module.exports = Path;
