/**
 * @providesModule Svg
 * @flow
 */

'use strict';

var createReactIOSNativeComponentClass = require('createReactIOSNativeComponentClass');
var ReactIOSViewAttributes = require('ReactIOSViewAttributes');
var merge = require('merge');
var React = require('react-native');
var ReactChildren = require('ReactChildren');

var {
  View,
  PropTypes,
  StyleSheet,
} = React;

var Svg = React.createClass({
  propTypes: {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  },

  statics: {
    Path: (path) => {
      var { fill, stroke, strokeWidth, strokeMiterLimit, d, transform } = path.props;
      return `<path fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" d="${d}" transform="${transform}"/>`
    },
    Line: (line) => {
      var { x1, x2, y1, y2, style } = path.props;
      return `<path fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" d="${d}" transform="${transform}"/>`
    }
  },

  getInitialState() {
    return { data: "" }
  },

  serialize(el) {
    return Svg[el.type.displayName](el);
  },

  stateFromChildren() {
    var data = `<svg xmlns="http://www.w3.org/2000/svg" width="${this.props.width}px" height="${this.props.height}px">`;

    ReactChildren.forEach(this.props.children, (child) => {
      data = data + this.serialize(child);
    });

    data = data + "</svg>"
    return data;
  },

  render() {
    var nativeProps = {
      style: this.props.style,
      originalWidth: this.props.width,
      originalHeight: this.props.height,
      forceUpdate: this.props.forceUpdate,
    };

    if (this.props.source) {
      nativeProps.src = this.props.source.uri;
    } else {
      nativeProps.data = this.stateFromChildren();
    }

    return <RNSvg {...nativeProps} />
  },
});

var RNSvg = createReactIOSNativeComponentClass({
  validAttributes: merge(ReactIOSViewAttributes.UIView, {src: true, data: true, originalWidth: true, originalHeight: true, forceUpdate: true}),
  uiViewClassName: 'RNSvg',
});

module.exports = Svg;
