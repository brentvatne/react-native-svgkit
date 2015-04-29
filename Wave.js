'use strict';

function drawSine(t) {
  var path = `M ${0} ${Math.sin(t) * 100 + 120}`;
  var x, y;

  for (var i = 0; i <= 10; i += 0.5) {
    x = i * 50;
    y = Math.sin(t + x) * 100 + 120;
    path = path + ` L ${x} ${y}`
  }

  return path;
}


var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var Svg = require('./Svg');
var Path = require('./Path');
var TimerMixin = require('react-timer-mixin');

var Wave = React.createClass({
  mixins: [TimerMixin],

  getInitialState() {
    return {t: 0}
  },

  componentDidMount() {
    this.setInterval(this.updateTime, 16);
  },

  updateTime() {
    this.setState({t: this.state.t + 0.05});
  },

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
        <Svg width={500} height={500} style={{width: 320, height: 350}}
             forceUpdate={this.state.t.toString()}>
          <Path fill="none" stroke="#00D8FF" strokeWidth="3" strokeMiterlimit="10"
                d={drawSine(this.state.t)} />
        </Svg>
      </View>
    );
  }
});

module.exports = Wave;
