/**
 * @providesModule Svg
 * @flow
 */

'use strict';

var React = require('react-native');
var ReactChildren = require('ReactChildren');

var {
  View,
  PropTypes,
  requireNativeComponent,
} = React;

var Svg = React.createClass({
  propTypes: {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
  },

  statics: {
    PathSerializer: (path) => {
      var { fill, stroke, strokeWidth, strokeMiterLimit, d, transform } = path.props;
      return `<path fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" d="${d}" transform="${transform}"/>`
    },
    LineSerializer: (line) => {
      var { x1, x2, y1, y2, style } = path.props;
      return `<path fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" d="${d}" transform="${transform}"/>`
    }
  },

  getInitialState() {
    return { data: "" }
  },

  serialize(el) {
    return Svg[el.type.displayName + 'Serializer'](el);
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
    } else if (this.props.data) {
      nativeProps.data = this.props.data;
    } else {
      nativeProps.data = this.stateFromChildren();
    }

    return <RNSvg {...nativeProps} />
  },
});

var RNSvg = requireNativeComponent('RNSvg', null);
Svg.Path = require('./Path');

module.exports = Svg;
