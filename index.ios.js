'use strict';

var React = require('react-native');
var { AppRegistry, } = React;

var ReactLogo = require('./ReactLogo');
var Wave = require('./Wave');
var Chart = require('./Chart');
var D3Chart = require('./D3Chart');

var SvgExample = React.createClass({
  render() {
    // Switch between other demos below
    return <Wave />;
    // return <D3Chart />;
    // return <ReactLogo />;
    // return <Chart />;
  }
});

AppRegistry.registerComponent('SvgExample', () => SvgExample);
