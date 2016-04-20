# react-native-svgkit

Render SVG images or write your own in-line and animate them, fun! Uses
SVGKit. Formerly known as react-native-svgkit, but this now belongs to a
library that is actually under active development: see [magicmight's
react-native-svg](https://github.com/magicismight/react-native-art-svg).

## How to use it

- `npm i react-native-svgkit --save`
- `cd node_modules/react-native-svgkit/Libraries/ && git clone git@github.com:SVGKit/SVGKit.git)`
- Then add RNSVg.Xcodeproj to your Libraries, and libRNSvg.a to your
  linked binaries.
- Also add `libxmyl2.2.dylib` (`libxml2.2.tbd` for iOS9) to your linked binaries.
- `var Svg = require('react-native-svgkit'); var Path = Svg.Path`

## Examples

[Wave.js](https://github.com/brentvatne/react-native-svgkit/blob/master/Wave.js) and [ReactLogo.js](https://github.com/brentvatne/react-native-svg/blob/master/ReactLogo.js) for examples!

[![Example code result](https://raw.githubusercontent.com/brentvatne/react-native-svgkit/master/line.gif)](https://github.com/brentvatne/react-native-svg/blob/master/Wave.js) [![Example code result](https://raw.githubusercontent.com/brentvatne/react-native-svg/master/logo.gif)](https://github.com/brentvatne/react-native-svg/blob/master/ReactLogo.js)


[![Example code result](https://raw.githubusercontent.com/brentvatne/react-native-svgkit/master/chart-example.png)](https://github.com/brentvatne/react-native-svg/blob/master/Chart.js)
*This chart renders from a source file, but I'm sure that a backend could be made for [d3/xkcd](http://dan.iel.fm/xkcd/) to do this for us live*

Uses [SVGKit](https://github.com/SVGKit/SVGKit) to do all of the hard work.

## TODO (probably never going to happen unless you want to do it)

- Hit detection and events on individual SVG composites (Path, Line, etc)
- Component for every SVG element: ‘circle’, ‘ellipse’, ‘line’,
  ‘polygon’, ‘polyline’, ‘rect’, [etc..](http://www.w3.org/TR/SVG/intro.html)
- Load source over HTTP
- Look at performance..
- Add animations to morph from one svg to another [like this](https://github.com/alexk111/SVG-Morpheus)
- Add support for "drawing" animations [like this](https://github.com/maxwellito/vivus)
