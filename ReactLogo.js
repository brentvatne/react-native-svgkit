'use strict';

var React = require('react-native');
var {
  StyleSheet,
  Text,
  View,
} = React;

var Svg = require('./Svg');
var Path = require('./Path');
var TimerMixin = require('react-timer-mixin');

var ReactLogo = React.createClass({
  mixins: [TimerMixin],

  getInitialState() {
    return {rotation: 0}
  },

  componentDidMount() {
    this.setInterval(this.updateRotation, 16);
  },

  updateRotation() {
    this.setState({rotation: this.state.rotation + 1});
  },

  scaleFn(n) {
    if (this.state.rotation < n) {
      return this.state.rotation / n;
    } else {
      return 1;
    }
  },

  render() {
    return (
      <View style={{flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center'}}>
        <Svg ref="svg" width={600} height={600} style={{width: 300, height: 350}} forceUpdate={this.state.rotation.toString()}>
          <Path
            transform={`rotate(${1 - this.state.rotation}, 300, 300), scale(${this.scaleFn(130)})`}
            fill="none" stroke="#00D8FF" strokeWidth="24" strokeMiterlimit="10" d="M299.529,197.628
            c67.356,0,129.928,9.665,177.107,25.907c56.844,19.569,91.794,49.233,91.794,76.093c0,27.991-37.041,59.503-98.083,79.728
            c-46.151,15.291-106.879,23.272-170.818,23.272c-65.554,0-127.63-7.492-174.29-23.441c-59.046-20.182-94.611-52.103-94.611-79.559
            c0-26.642,33.37-56.076,89.415-75.616C167.398,207.503,231.515,197.628,299.529,197.628z"/>
          <Path
            transform={`rotate(${this.state.rotation}, 300, 300), scale(${this.scaleFn(270)})`}
            fill="none" stroke="#00D8FF" strokeWidth="24" strokeMiterlimit="10" d="M210.736,248.922
            c33.649-58.348,73.281-107.724,110.92-140.48c45.35-39.466,88.507-54.923,111.775-41.505
            c24.248,13.983,33.042,61.814,20.067,124.796c-9.81,47.618-33.234,104.212-65.176,159.601
            c-32.749,56.788-70.25,106.819-107.377,139.272c-46.981,41.068-92.4,55.929-116.185,42.213
            c-23.079-13.31-31.906-56.921-20.834-115.233C153.281,368.316,176.758,307.841,210.736,248.922z"/>
          <Path
            transform={`rotate(${0.7 * this.state.rotation}, 300, 300), scale(${this.scaleFn(180)})`}
            fill="none" stroke="#00D8FF" strokeWidth="24" strokeMiterlimit="10" d="M210.821,351.482
            c-33.746-58.292-56.731-117.287-66.312-166.255c-11.544-58.999-3.382-104.109,19.864-117.566
            c24.224-14.024,70.055,2.244,118.14,44.94c36.356,32.28,73.688,80.837,105.723,136.173c32.844,56.733,57.461,114.209,67.036,162.582
            c12.117,61.213,2.309,107.984-21.453,121.74c-23.057,13.348-65.249-0.784-110.239-39.499
            C285.567,460.886,244.898,410.344,210.821,351.482z"/>
        </Svg>
      </View>
    );
  }
});

module.exports = ReactLogo;
