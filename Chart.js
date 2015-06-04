'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var Svg = require('./Svg');

var Chart = React.createClass({
  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center'}}>
        <Svg width={640} height={340} source={{uri: 'chart'}} style={{width: 640, height: 340}} />
      </View>
    );
  }
});

module.exports = Chart;
