'use strict';

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelper(o, allowArrayLike) {
  var it;

  if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) {
    if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
      if (it) o = it;
      var i = 0;

      var F = function () {};

      return {
        s: F,
        n: function () {
          if (i >= o.length) return {
            done: true
          };
          return {
            done: false,
            value: o[i++]
          };
        },
        e: function (e) {
          throw e;
        },
        f: F
      };
    }

    throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var normalCompletion = true,
      didErr = false,
      err;
  return {
    s: function () {
      it = o[Symbol.iterator]();
    },
    n: function () {
      var step = it.next();
      normalCompletion = step.done;
      return step;
    },
    e: function (e) {
      didErr = true;
      err = e;
    },
    f: function () {
      try {
        if (!normalCompletion && it.return != null) it.return();
      } finally {
        if (didErr) throw err;
      }
    }
  };
}

// import {select, selectAll, mouse} from 'd3-selection'
// import 'd3-selection-multi'
// import {scaleOrdinal,scaleLinear} from 'd3-scale'
// import {min as d3Min, max as d3Max, bisector} from 'd3-array'
// import {drag} from 'd3-drag'
// import {axisLeft, axisBottom} from 'd3-axis'
// import {format} from 'd3-format'
// import {curveBasis, curveLinear, line, area as d3Area, symbol, symbolTriangle} from 'd3-shape'
// import {
//     schemeAccent,
//     schemeDark2,
//     schemeSet2,
//     schemeCategory10,
//     schemeSet3,
//     schemePaired
// } from 'd3-scale-chromatic'
// (function (factory, window) {
// 
//     // define an AMD module that relies on 'leaflet'
//     if (typeof define === 'function' && define.amd) {
//         define(['leaflet'], factory);
// 
//         // define a Common JS module that relies on 'leaflet'
//     } else if (typeof exports === 'object') {
//         if (typeof window !== 'undefined' && window.L) {
//             module.exports = factory(L);
//         } else {
//             module.exports = factory(require('leaflet'));
//         }
//     }
// 
//     // attach your plugin to the global 'L' variable
//     if (typeof window !== 'undefined' && window.L) {
//         window.L.Control.Heightgraph = factory(L);
//     }
// }(function (L) {
L.Control.Heightgraph = L.Control.extend({
  options: {
    position: "bottomright",
    width: 800,
    height: 280,
    margins: {
      top: 10,
      right: 30,
      bottom: 55,
      left: 50
    },
    mappings: undefined,
    expand: true,
    expandControls: true,
    translation: {},
    expandCallback: undefined,
    xTicks: undefined,
    yTicks: undefined,
    highlightStyle: undefined,
    graphStyle: undefined
  },
  _defaultTranslation: {
    distance: "Distance",
    elevation: "Elevation",
    segment_length: "Segment length",
    type: "Type",
    legend: "Legend"
  },
  _init_options: function _init_options() {
    this._margin = this.options.margins;
    this._width = this.options.width;
    this._height = this.options.height;
    this._mappings = this.options.mappings;
    this._svgWidth = this._width - this._margin.left - this._margin.right;
    this._svgHeight = this._height - this._margin.top - this._margin.bottom;
    this._highlightStyle = this.options.highlightStyle || {
      color: 'red'
    };
    this._graphStyle = this.options.graphStyle || {};
    this._dragCache = {};
  },
  onAdd: function onAdd(map) {
    var container = this._container = L.DomUtil.create("div", "heightgraph");
    L.DomEvent.disableClickPropagation(container);

    if (this.options.expandControls) {
      var buttonContainer = this._button = L.DomUtil.create('div', "heightgraph-toggle", container);
      var link = L.DomUtil.create("a", "heightgraph-toggle-icon", buttonContainer);
      var closeButton = this._closeButton = L.DomUtil.create("a", "heightgraph-close-icon", container);
    }

    this._showState = false;
    this._selectedAttributeIdx = 0;

    this._initToggle();

    this._init_options(); // Note: this._svg really contains the <g> inside the <svg>


    this._svg = d3.select(this._container).append("svg").attr("class", "heightgraph-container").attr("width", this._width).attr("height", this._height).append("g").attr("transform", "translate(" + this._margin.left + "," + this._margin.top + ")");
    if (this.options.expand) this._expand();
    return container;
  },
  onRemove: function onRemove(map) {
    this._removeMarkedSegmentsOnMap();

    this._container = null;
    this._svg = undefined;
  },

  /**
   * add Data from geoJson and call all functions
   * @param {Object} data
   */
  addData: function addData(data) {
    this._addData(data);
  },

  /**
  * Internal function. Overloads public addData().
  * Call with resize = true when resizing instead of actually adding data.
  * TODO: this should be refactored to avoid calling addData on resize
  * @param data
  * @param resize
  * @private
  */
  _addData: function _addData(data) {
    var resize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

    if (this._svg !== undefined) {
      this._svg.selectAll("*").remove();
    }

    this._selectedAttributeIdx = resize ? this._selectedAttributeIdx : 0;

    this._removeMarkedSegmentsOnMap();

    this._resetDrag(true);

    this._data = data;

    this._init_options();

    this._prepareData();

    this._calculateElevationBounds();

    this._appendScales();

    this._appendGrid();

    if (Object.keys(data).length !== 0) {
      this._createChart(this._selectedAttributeIdx);
    }

    this._createSelectionBox();
  },
  resize: function resize(size) {
    if (size.width) this.options.width = size.width;
    if (size.height) this.options.height = size.height; // Resize the <svg> along with its container

    d3.select(this._container).selectAll("svg").attr("width", this.options.width).attr("height", this.options.height); // Re-add the data to redraw the chart.

    this._addData(this._data, true);
  },
  _initToggle: function _initToggle() {
    if (!L.Browser.touch) {
      L.DomEvent.disableClickPropagation(this._container);
    } else {
      L.DomEvent.on(this._container, 'click', L.DomEvent.stopPropagation);
    }

    if (this.options.expandControls) {
      L.DomEvent.on(this._button, 'click', this._expand, this);
      L.DomEvent.on(this._closeButton, 'click', this._expand, this);
    }
  },
  _dragHandler: function _dragHandler() {
    //we don´t want map events to occur here
    d3.event.preventDefault();
    d3.event.stopPropagation();
    this._gotDragged = true;

    this._drawDragRectangle();
  },

  /**
   * Draws the currently dragged rectangle over the chart.
   */
  _drawDragRectangle: function _drawDragRectangle() {
    if (!this._dragStartCoords) {
      return;
    }

    var dragEndCoords = this._dragCurrentCoords = this._dragCache.end = d3.mouse(this._background.node());
    var x1 = Math.min(this._dragStartCoords[0], dragEndCoords[0]),
        x2 = Math.max(this._dragStartCoords[0], dragEndCoords[0]);

    if (!this._dragRectangle && !this._dragRectangleG) {
      var g = d3.select(this._container).select("svg").select("g");
      this._dragRectangleG = g.append("g");
      this._dragRectangle = this._dragRectangleG.append("rect").attr("width", x2 - x1).attr("height", this._svgHeight).attr("x", x1).attr('class', 'mouse-drag').style("fill", "grey").style("opacity", 0.5).style("pointer-events", "none");
    } else {
      this._dragRectangle.attr("width", x2 - x1).attr("x", x1);
    }
  },

  /**
   * Removes the drag rectangle
   * @param {boolean} skipMapFitBounds - whether to zoom the map back to the total extent of the data
   */
  _resetDrag: function _resetDrag(skipMapFitBounds) {
    if (this._dragRectangleG) {
      this._dragRectangleG.remove();

      this._dragRectangleG = null;
      this._dragRectangle = null;

      if (skipMapFitBounds !== true) {
        // potential performance improvement:
        // we could cache the full extend when addData() is called
        var fullExtent = this._calculateFullExtent(this._areasFlattended);

        if (fullExtent) this._map.fitBounds(fullExtent);
      }
    }
  },

  /**
   * Handles end of drag operations. Zooms the map to the selected items extent.
   */
  _dragEndHandler: function _dragEndHandler() {
    if (!this._dragStartCoords || !this._gotDragged) {
      this._dragStartCoords = null;
      this._gotDragged = false;

      this._resetDrag();

      return;
    }

    var item1 = this._findItemForX(this._dragStartCoords[0]),
        item2 = this._findItemForX(this._dragCurrentCoords[0]);

    this._fitSection(item1, item2);

    this._dragStartCoords = null;
    this._gotDragged = false;
  },
  _dragStartHandler: function _dragStartHandler() {
    d3.event.preventDefault();
    d3.event.stopPropagation();
    this._gotDragged = false;
    this._dragStartCoords = this._dragCache.start = d3.mouse(this._background.node());
  },

  /*
   * Calculates the full extent of the data array
   */
  _calculateFullExtent: function _calculateFullExtent(data) {
    if (!data || data.length < 1) {
      return null;
    }

    var full_extent = new L.latLngBounds(data[0].latlng, data[0].latlng);
    data.forEach(function (item) {
      if (!full_extent.contains(item.latlng)) {
        full_extent.extend(item.latlng);
      }
    });
    return full_extent;
  },

  /**
   * Make the map fit the route section between given indexes.
   */
  _fitSection: function _fitSection(index1, index2) {
    var start = Math.min(index1, index2),
        end = Math.max(index1, index2);
    var ext;

    if (start !== end) {
      ext = this._calculateFullExtent(this._areasFlattended.slice(start, end + 1));
    } else if (this._areasFlattended.length > 0) {
      ext = [this._areasFlattended[start].latlng, this._areasFlattended[end].latlng];
    }

    if (ext) this._map.fitBounds(ext);
  },

  /**
   * Expand container when button clicked and shrink when close-Button clicked
   */
  _expand: function _expand() {
    if (this.options.expandControls !== true) {
      // always expand, never collapse
      this._showState = false;
    }

    if (!this._showState) {
      d3.select(this._button).style("display", "none");
      d3.select(this._container).selectAll('svg').style("display", "block");
      d3.select(this._closeButton).style("display", "block");
    } else {
      d3.select(this._button).style("display", "block");
      d3.select(this._container).selectAll('svg').style("display", "none");
      d3.select(this._closeButton).style("display", "none");
    }

    this._showState = !this._showState;

    if (typeof this.options.expandCallback === "function") {
      this.options.expandCallback(this._showState);
    }
  },

  /**
   * Removes the svg elements from the d3 chart
   */
  _removeChart: function _removeChart() {
    if (this._svg !== undefined) {
      // remove areas
      this._svg.selectAll("path.area").remove(); // remove top border


      this._svg.selectAll("path.border-top").remove(); // remove legend


      this._svg.selectAll(".legend").remove(); // remove horizontal Line


      this._svg.selectAll(".lineSelection").remove();

      this._svg.selectAll(".horizontalLine").remove();

      this._svg.selectAll(".horizontalLineText").remove();
    }
  },

  /**
   * Creates a random int between 0 and max
   */
  _randomNumber: function _randomNumber(max) {
    return Math.round(Math.random() * (max - 0));
  },

  /**
   * Prepares the data needed for the height graph
   */
  _prepareData: function _prepareData() {
    this._coordinates = [];
    this._elevations = [];
    this._cumulatedDistances = [];

    this._cumulatedDistances.push(0);

    this._categories = [];
    var data = this._data;
    var colorScale;

    if (this._mappings === undefined) {
      colorScale = d3.scale.ordinal().range(["#7fc97f", "#beaed4", "#fdc086", "#ffff99", "#386cb0", "#f0027f", "#bf5b17", "#666666"]);
    }

    for (var y = 0; y < data.length; y++) {
      var cumDistance = 0;
      this._categories[y] = {
        info: {
          id: y,
          text: data[y].properties.summary
        },
        distances: [],
        attributes: [],
        geometries: [],
        legend: {}
      };
      var i = void 0,
          cnt = 0;
      var usedColors = {};

      for (i = 0; i < data[y].features.length; i++) {
        // data is redundant in every element of data which is why we collect it once
        var altitude = void 0,
            ptA = void 0,
            ptB = void 0,
            ptDistance = void 0;
        var geometry = [];
        var coordsLength = data[y].features[i].geometry.coordinates.length; // save attribute types related to blocks

        var attributeType = data[y].features[i].properties.attributeType; // check if mappings are defined, otherwise random colors

        var text = void 0,
            color = void 0;

        if (this._mappings === undefined) {
          if (attributeType in usedColors) {
            text = attributeType;
            color = usedColors[attributeType];
          } else {
            text = attributeType;
            color = colorScale(i);
            usedColors[attributeType] = color;
          }
        } else {
          text = this._mappings[data[y].properties.summary][attributeType].text;
          color = this._mappings[data[y].properties.summary][attributeType].color;
        }

        var attribute = {
          type: attributeType,
          text: text,
          color: color
        };

        this._categories[y].attributes.push(attribute); // add to legend


        if (!(attributeType in this._categories[y].legend)) {
          this._categories[y].legend[attributeType] = attribute;
        }

        for (var j = 0; j < coordsLength; j++) {
          ptA = new L.LatLng(data[y].features[i].geometry.coordinates[j][1], data[y].features[i].geometry.coordinates[j][0]);
          altitude = data[y].features[i].geometry.coordinates[j][2]; // add elevations, coordinates and point distances only once
          // last point in feature is first of next which is why we have to juggle with indices

          if (j < coordsLength - 1) {
            ptB = new L.LatLng(data[y].features[i].geometry.coordinates[j + 1][1], data[y].features[i].geometry.coordinates[j + 1][0]);
            ptDistance = ptA.distanceTo(ptB) / 1000; // calculate distances of specific block

            cumDistance += ptDistance;

            if (y === 0) {
              this._elevations.push(altitude);

              this._coordinates.push(ptA);

              this._cumulatedDistances.push(cumDistance);
            }

            cnt += 1;
          } else if (j === coordsLength - 1 && i === data[y].features.length - 1) {
            if (y === 0) {
              this._elevations.push(altitude);

              this._coordinates.push(ptB);
            }

            cnt += 1;
          } // save the position which corresponds to the distance along the route.


          var position = void 0;

          if (j === coordsLength - 1 && i < data[y].features.length - 1) {
            position = this._cumulatedDistances[cnt];
          } else {
            position = this._cumulatedDistances[cnt - 1];
          }

          geometry.push({
            altitude: altitude,
            position: position,
            x: ptA.lng,
            y: ptA.lat,
            latlng: ptA,
            type: text,
            areaIdx: i
          });
        }

        this._categories[y].distances.push(cumDistance);

        this._categories[y].geometries.push(geometry);
      }

      if (y === data.length - 1) {
        this._totalDistance = cumDistance;
      }
    }
  },

  /**
   * calculates minimum and maximum values for the elevation scale drawn with d3
   */
  _calculateElevationBounds: function _calculateElevationBounds() {
    var max = d3.max(this._elevations);
    var min = d3.min(this._elevations);
    var range = max - min;
    this._elevationBounds = {
      min: range < 10 ? min - 10 : min - 0.1 * range,
      max: range < 10 ? max + 10 : max + 0.1 * range
    };
  },

  /**
   * Creates a marker on the map while hovering
   * @param {Object} ll: actual coordinates of the route
   * @param {Number} height: height as float
   * @param {string} type: type of element
   */
  _showMapMarker: function _showMapMarker(ll, height, type) {
    var layerPoint = this._map.latLngToLayerPoint(ll);

    var normalizedY = layerPoint.y - 75;

    if (!this._mouseHeightFocus) {
      var heightG = d3.select(".leaflet-overlay-pane svg").append("g");
      this._mouseHeightFocus = heightG.append('svg:line').attr('class', 'height-focus line').attr('x2', '0').attr('y2', '0').attr('x1', '0').attr('y1', '0');
      this._mouseHeightFocusLabel = heightG.append("g").attr('class', 'height-focus label');
      this._mouseHeightFocusLabelRect = this._mouseHeightFocusLabel.append("rect").attr('class', 'bBox');
      this._mouseHeightFocusLabelTextElev = this._mouseHeightFocusLabel.append("text").attr('class', 'tspan');
      this._mouseHeightFocusLabelTextType = this._mouseHeightFocusLabel.append("text").attr('class', 'tspan');
      var pointG = this._pointG = heightG.append("g").attr("class", "height-focus circle");
      pointG.append("svg:circle").attr("r", 5).attr("cx", 0).attr("cy", 0).attr("class", "height-focus circle-lower");
    }

    this._mouseHeightFocusLabel.style("display", "block");

    this._mouseHeightFocus.attr("x1", layerPoint.x).attr("x2", layerPoint.x).attr("y1", layerPoint.y).attr("y2", normalizedY).style("display", "block");

    this._pointG.attr("transform", "translate(" + layerPoint.x + "," + layerPoint.y + ")").style("display", "block");

    this._mouseHeightFocusLabelRect.attr("x", layerPoint.x + 3).attr("y", normalizedY).attr("class", 'bBox');

    this._mouseHeightFocusLabelTextElev.attr("x", layerPoint.x + 5).attr("y", normalizedY + 12).text(height + " m").attr("class", "tspan mouse-height-box-text");

    this._mouseHeightFocusLabelTextType.attr("x", layerPoint.x + 5).attr("y", normalizedY + 24).text(type).attr("class", "tspan mouse-height-box-text");

    var maxWidth = this._dynamicBoxSize("text.tspan")[1]; // box size should change for profile none (no type)


    var maxHeight = type === "" ? 12 + 6 : 2 * 12 + 6;
    d3.selectAll('.bBox').attr("width", maxWidth + 10).attr("height", maxHeight);
  },

  /**
   * Creates the elevation profile
   */
  _createChart: function _createChart(idx) {
    var areas = this._categories.length === 0 ? [] : this._categories[idx].geometries;
    this._areasFlattended = [].concat.apply([], areas);

    for (var i = 0; i < areas.length; i++) {
      this._appendAreas(areas[i], idx, i);
    }

    this._createFocus();

    this._appendBackground();

    this._createBorderTopLine();

    this._createLegend();

    this._createHorizontalLine();
  },

  /**
   *  Creates focus Line and focus box while hovering
   */
  _createFocus: function _createFocus() {
    var boxPosition = this._elevationBounds.min;
    var textDistance = 15;

    if (this._focus) {
      this._focus.remove();

      this._focusLineGroup.remove();
    }

    this._focus = this._svg.append("g").attr("class", "focusbox"); // background box

    this._focusRect = this._focus.append("rect").attr("x", 3).attr("y", -this._y(boxPosition)).attr("display", "none"); // text line 1

    this._focusDistance = this._focus.append("text").attr("x", 7).attr("y", -this._y(boxPosition) + textDistance).attr("id", "heightgraph.distance").text(this._getTranslation('distance') + ':'); // text line 2

    this._focusHeight = this._focus.append("text").attr("x", 7).attr("y", -this._y(boxPosition) + 2 * textDistance).attr("id", "heightgraph.height").text(this._getTranslation('elevation') + ':'); // text line 3

    this._focusBlockDistance = this._focus.append("text").attr("x", 7).attr("y", -this._y(boxPosition) + 3 * textDistance).attr("id", "heightgraph.blockdistance").text(this._getTranslation('segment_length') + ':'); // text line 4

    this._focusType = this._focus.append("text").attr("x", 7).attr("y", -this._y(boxPosition) + 4 * textDistance).attr("id", "heightgraph.type").text(this._getTranslation('type') + ':');
    this._areaTspan = this._focusBlockDistance.append('tspan').attr("class", "tspan");
    this._typeTspan = this._focusType.append('tspan').attr("class", "tspan");

    var height = this._dynamicBoxSize(".focusbox text")[0];

    d3.selectAll('.focusbox rect').attr("height", height * textDistance + textDistance / 2).attr("display", "block");
    this._focusLineGroup = this._svg.append("g").attr("class", "focusLine");
    this._focusLine = this._focusLineGroup.append("line").attr("y1", 0).attr("y2", this._y(this._elevationBounds.min));
    this._distTspan = this._focusDistance.append('tspan').attr("class", "tspan");
    this._altTspan = this._focusHeight.append('tspan').attr("class", "tspan");
  },

  /**
   *  Creates horizontal Line for dragging
   */
  _createHorizontalLine: function _createHorizontalLine() {
    var self = this;
    this._horizontalLine = this._svg.append("line").attr("class", "horizontalLine").attr("x1", 0).attr("x2", this._width - this._margin.left - this._margin.right).attr("y1", this._y(this._elevationBounds.min)).attr("y2", this._y(this._elevationBounds.min)).style("stroke", "black");
    this._elevationValueText = this._svg.append("text").attr("class", "horizontalLineText").attr("x", this._width - this._margin.left - this._margin.right - 20).attr("y", this._y(this._elevationBounds.min) - 10).attr("fill", "black"); //triangle symbol as controller

    var jsonTriangle = [{
      "x": this._width - this._margin.left - this._margin.right + 7,
      "y": this._y(this._elevationBounds.min),
      "color": "black",
      "type": d3.svg.symbol().type("triangle-up"),
      "angle": -90,
      "size": 100
    }];

    var dragstart = function dragstart(d) {
      d3.select(this).raise().classed("active", true);
      d3.select(".horizontalLine").raise().classed("active", true);
    };

    var dragged = function dragged(d) {
      var maxY = self._svgHeight;
      var eventY = d3.mouse(self._container)[1] - 10;
      d3.select(this).attr("transform", function (d) {
        return "translate(" + d.x + "," + (eventY < 0 ? 0 : eventY > maxY ? maxY : eventY) + ") rotate(" + d.angle + ")";
      });
      d3.select(".horizontalLine").attr("y1", eventY < 0 ? 0 : eventY > maxY ? maxY : eventY).attr("y2", eventY < 0 ? 0 : eventY > maxY ? maxY : eventY);

      if (eventY >= maxY) {
        self._highlightedCoords = [];
      } else {
        self._highlightedCoords = self._findCoordsForY(eventY);
      }

      d3.select(".horizontalLineText").attr("y", eventY <= 10 ? 0 : eventY > maxY ? maxY - 10 : eventY - 10).text(d3.format(".0f")(self._y.invert(eventY < 0 ? 0 : eventY > maxY ? maxY : eventY)) + " m");

      self._removeMarkedSegmentsOnMap();

      self._markSegmentsOnMap(self._highlightedCoords);
    };

    var dragend = function dragend(d) {
      d3.select(this).classed("active", false);
      d3.select(".horizontalLine").classed("active", false);

      self._removeMarkedSegmentsOnMap();

      self._markSegmentsOnMap(self._highlightedCoords);
    };

    var horizontalDrag = this._svg.selectAll(".horizontal-symbol").data(jsonTriangle).enter().append("path").attr("class", "lineSelection").attr("d", d3.svg.symbol().type(function (d) {
      return d.type;
    }).size(function (d) {
      return d.size;
    })).attr("transform", function (d) {
      return "translate(" + d.x + "," + d.y + ") rotate(" + d.angle + ")";
    }).attr("id", function (d) {
      return d.id;
    }).style("fill", function (d) {
      return d.color;
    }).call(d3.behavior.drag().on("dragstart", dragstart).on("drag", dragged).on("dragend", dragend));
  },

  /**
   * Highlights segments on the map above given elevation value
   */
  _markSegmentsOnMap: function _markSegmentsOnMap(coords) {
    if (coords) {
      if (coords.length > 1) {
        // some other leaflet plugins can't deal with multi-Polylines very well
        // therefore multiple single polylines are used here
        this._markedSegments = L.featureGroup();

        var _iterator = _createForOfIteratorHelper(coords),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var linePart = _step.value;
            L.polyline(linePart, _objectSpread2(_objectSpread2({}, this._highlightStyle), {
              interactive: false
            })).addTo(this._markedSegments);
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this._markedSegments.addTo(this._map).bringToFront();
      } else {
        this._markedSegments = L.polyline(coords, this._highlightStyle).addTo(this._map);
      }
    }
  },

  /**
   * Remove the highlighted segments from the map
   */
  _removeMarkedSegmentsOnMap: function _removeMarkedSegmentsOnMap() {
    if (this._markedSegments !== undefined) {
      this._map.removeLayer(this._markedSegments);
    }
  },

  /**
   * Defines the ranges and format of x- and y- scales and appends them
   */
  _appendScales: function _appendScales() {
    var shortDist = Boolean(this._totalDistance <= 10);
    this._x = d3.scale.linear().range([0, this._svgWidth]);
    this._y = d3.scale.linear().range([this._svgHeight, 0]);

    this._x.domain([0, this._totalDistance]);

    this._y.domain([this._elevationBounds.min, this._elevationBounds.max]);

    this._xAxis = d3.svg.axis().scale(this._x).orient("bottom");

    if (shortDist === true) {
      this._xAxis.tickFormat(function (d) {
        return d3.format(".2f")(d) + " km";
      });
    } else {
      this._xAxis.tickFormat(function (d) {
        return d3.format(".0f")(d) + " km";
      });
    }

    this._xAxis.ticks(this.options.xTicks ? Math.pow(2, this.options.xTicks) : Math.round(this._svgWidth / 75), "s");

    this._yAxis = d3.svg.axis().scale(this._y).orient("left").tickFormat(function (d) {
      return d + " m";
    });

    this._yAxis.ticks(this.options.yTicks ? Math.pow(2, this.options.yTicks) : Math.round(this._svgHeight / 30), "s");
  },

  /**
   * Appends a background and adds mouse handlers
   */
  _appendBackground: function _appendBackground() {
    var background = this._background = d3.select(this._container).select("svg").select("g").append("rect").attr("width", this._svgWidth).attr("height", this._svgHeight).style("fill", "none").style("stroke", "none").style("pointer-events", "all").on("mousemove.focusbox", this._mousemoveHandler.bind(this)).on("mouseout.focusbox", this._mouseoutHandler.bind(this));

    if (L.Browser.android) {
      background.on("touchstart.drag", this._dragHandler.bind(this)).on("touchstart.drag", this._dragStartHandler.bind(this)).on("touchstart.focusbox", this._mousemoveHandler.bind(this));
      L.DomEvent.on(this._container, 'touchend', this._dragEndHandler, this);
    } else {
      background.on("mousemove.focusbox", this._mousemoveHandler.bind(this)).on("mouseout.focusbox", this._mouseoutHandler.bind(this)).on("mousedown.drag", this._dragStartHandler.bind(this)).on("mousemove.drag", this._dragHandler.bind(this));
      L.DomEvent.on(this._container, 'mouseup', this._dragEndHandler, this);
    }
  },

  /**
   * Appends a grid to the graph
   */
  _appendGrid: function _appendGrid() {
    this._svg.append("g").attr("class", "grid").attr("transform", "translate(0," + this._svgHeight + ")").call(this._make_x_axis().tickSize(-this._svgHeight, 0, 0).ticks(Math.round(this._svgWidth / 75)).tickFormat(""));

    this._svg.append("g").attr("class", "grid").call(this._make_y_axis().tickSize(-this._svgWidth, 0, 0).ticks(Math.round(this._svgHeight / 30)).tickFormat(""));

    this._svg.append('g').attr("transform", "translate(0," + this._svgHeight + ")").attr('class', 'x axis').call(this._xAxis);

    this._svg.append('g').attr("transform", "translate(-2,0)").attr('class', 'y axis').call(this._yAxis);
  },

  /**
   * Appends the areas to the graph
   */
  _appendAreas: function _appendAreas(block, idx, eleIdx) {
    var c = this._categories[idx].attributes[eleIdx].color;
    var self = this;
    var area = this._area = d3.svg.area().x(function (d) {
      var xDiagonalCoordinate = self._x(d.position);

      d.xDiagonalCoordinate = xDiagonalCoordinate;
      return xDiagonalCoordinate;
    }).y0(this._svgHeight).y1(function (d) {
      return self._y(d.altitude);
    }).interpolate("linear");
    this._areapath = this._svg.append("path").attr("class", "area");

    this._areapath.datum(block).attr("d", this._area).attr("stroke", c);

    for (var attrName in this._graphStyle) {
      this._areapath.style(attrName, this._graphStyle[attrName]);
    }

    this._areapath.style("fill", c).style("pointer-events", "none");
  },
  // grid lines in x axis function
  _make_x_axis: function _make_x_axis() {
    return d3.svg.axis().scale(this._x).orient("bottom");
  },
  // grid lines in y axis function
  _make_y_axis: function _make_y_axis() {
    return d3.svg.axis().scale(this._y).orient("left");
  },

  /**
   * Appends a selection box for different blocks
   */
  _createSelectionBox: function _createSelectionBox() {
    var self = this;
    var svg = d3.select(this._container).select("svg");
    var width = this._width - this._margin.right,
        height = this._height - this._margin.bottom;
    var verticalItemPosition = height + this._margin.bottom / 2 + 6;
    var jsonTriangles = [{
      "x": width - 25,
      "y": verticalItemPosition + 3,
      "color": "#000",
      "type": d3.svg.symbol().type("triangle-up"),
      "id": "leftArrowSelection",
      "angle": 0
    }, {
      "x": width - 10,
      "y": verticalItemPosition,
      "color": "#000",
      "type": d3.svg.symbol().type("triangle-up"),
      "id": "rightArrowSelection",
      "angle": 180
    }]; // Use update pattern to update existing symbols in case of resize

    var selectionSign = svg.selectAll(".select-symbol").data(jsonTriangles); // remove any existing selection first

    selectionSign.remove(); // select again

    selectionSign = svg.selectAll(".select-symbol").data(jsonTriangles); // then add only if needed

    if (self._data.length > 1) {
      var selectionSignWithPath = selectionSign.enter().append("path");
      [selectionSignWithPath, selectionSign].forEach(function (item) {
        item.attr("class", "select-symbol").attr("d", d3.svg.symbol().type(function (d) {
          return d.type;
        })).attr("transform", function (d) {
          return "translate(" + d.x + "," + d.y + ") rotate(" + d.angle + ")";
        }).attr("id", function (d) {
          return d.id;
        }).style("fill", function (d) {
          return d.color;
        }).on("mousedown", function (d) {
          if (d.id === "rightArrowSelection") arrowRight();
          if (d.id === "leftArrowSelection") arrowLeft(); // fake a drag event from cache values to keep selection

          self._gotDragged = true;
          self._dragStartCoords = self._dragCache.start;
          self._dragCurrentCoords = self._dragCache.end;
        });
      });
    }

    var chooseSelection = function chooseSelection(id) {
      if (self._selectionText) self._selectionText.remove(); // after cleaning up, there is nothing left to do if there is no data

      if (self._categories.length === 0) return;
      var type = self._categories[id].info;
      var data = [{
        "selection": type.text
      }];
      self._selectionText = svg.selectAll('selection_text').data(data).enter().append('text').attr("x", width - 35).attr("y", verticalItemPosition + 4).text(function (d) {
        return d.selection;
      }).attr("class", "select-info").attr("id", "selectionText").attr("text-anchor", "end");
    };

    var length = this._categories.length;
    var id = this._selectedAttributeIdx;
    chooseSelection(id);

    var arrowRight = function arrowRight() {
      var idx = self._selectedAttributeIdx += 1;

      if (idx === self._categories.length) {
        self._selectedAttributeIdx = idx = 0;
      }

      chooseSelection(idx);

      self._removeChart();

      self._removeMarkedSegmentsOnMap();

      self._createChart(idx);
    };

    var arrowLeft = function arrowLeft() {
      var idx = self._selectedAttributeIdx -= 1;

      if (idx === -1) {
        self._selectedAttributeIdx = idx = self._categories.length - 1;
      }

      chooseSelection(idx);

      self._removeChart();

      self._removeMarkedSegmentsOnMap();

      self._createChart(idx);
    };
  },

  /**
   * Creates and appends legend to chart
   */
  _createLegend: function _createLegend() {
    var _this = this;

    var self = this;
    var data = [];

    if (this._categories.length > 0) {
      for (var item in this._categories[this._selectedAttributeIdx].legend) {
        data.push(this._categories[this._selectedAttributeIdx].legend[item]);
      }
    }

    var height = this._height - this._margin.bottom;
    var verticalItemPosition = height + this._margin.bottom / 2;
    var leg = [{
      "text": this._getTranslation("legend")
    }];
    var legendRectSize = 7;
    var legendSpacing = 7;

    var legend = this._svg.selectAll(".hlegend-hover").data(data).enter().append("g").attr("class", "legend").style("display", "none").attr("transform", function (d, i) {
      var height = legendRectSize + legendSpacing;
      var offset = height * 2;
      var horizontal = legendRectSize - 15;
      var vertical = i * height - offset;
      return "translate(" + horizontal + "," + vertical + ")";
    });

    var legendRect = legend.append('rect').attr('class', 'legend-rect').attr('x', 15).attr('y', 6 * 6).attr('width', 6).attr('height', 6);

    if (Object.keys(this._graphStyle).length !== 0) {
      for (var attrName in this._graphStyle) {
        legendRect.style(attrName, this._graphStyle[attrName]);
      }

      legendRect.style('stroke', function (d, i) {
        return d.color;
      }).style('fill', function (d, i) {
        return d.color;
      });
    } else {
      legendRect.style('stroke', 'black').style('fill', function (d, i) {
        return d.color;
      });
    }

    legend.append('text').attr('class', 'legend-text').attr('x', 30).attr('y', 6 * 7).text(function (d, i) {
      var textProp = d.text;
      self._boxBoundY = (height - 2 * height / 3 + 7) * i;
      return textProp;
    });

    var legendHover = this._svg.selectAll('.legend-hover').data(leg).enter().append('g').attr('class', 'legend-hover');

    this._showLegend = false;
    legendHover.append('text').attr('x', 15).attr('y', verticalItemPosition).attr('text-anchor', "start").text(function (d, i) {
      return d.text;
    }).on('mouseover', function () {
      d3.selectAll('.legend').style("display", "block");
    }).on('mouseleave', function () {
      if (!_this._showLegend) {
        d3.selectAll('.legend').style("display", "none");
      }
    }).on('click', function () {
      _this._showLegend = !_this._showLegend;
    });
  },

  /**
  * calculates the margins of boxes
  * @param {String} className: name of the class
  * @return {array} borders: number of text lines, widest range of text
  */
  _dynamicBoxSize: function _dynamicBoxSize(className) {
    var widths = [];
    d3.selectAll(className).each(function (datum, index) {
      widths.push(this.getBoundingClientRect().width);
    });
    var maxWidth = d3.max(widths);
    return [widths.length, maxWidth];
  },

  /**
   * Creates top border line on graph
   */
  _createBorderTopLine: function _createBorderTopLine() {
    var self = this;
    var data = this._areasFlattended;
    var borderTopLine = d3.svg.line().x(function (d) {
      var x = self._x;
      return x(d.position);
    }).y(function (d) {
      var y = self._y;
      return y(d.altitude);
    }).interpolate("basis");

    this._svg.append("svg:path").attr("d", borderTopLine(data)).attr('class', 'border-top');
  },

  /*
   * Handles the mouseout event when the mouse leaves the background
   */
  _mouseoutHandler: function _mouseoutHandler() {
    for (var _i = 0, _arr = ['_focusLine', '_focus', '_pointG', '_mouseHeightFocus', '_mouseHeightFocusLabel']; _i < _arr.length; _i++) {
      var param = _arr[_i];

      if (this[param]) {
        this[param].style('display', 'none');
      }
    }
  },

  /*
   * Handles the mouseout event and clears the current point info.
   * @param {int} delay - time before markers are removed in milliseconds
   */
  mapMouseoutHandler: function mapMouseoutHandler() {
    var _this2 = this;

    var delay = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1000;

    if (this.mouseoutDelay) {
      window.clearTimeout(this.mouseoutDelay);
    }

    this.mouseoutDelay = window.setTimeout(function () {
      _this2._mouseoutHandler();
    }, delay);
  },

  /*
   * Handles the mouseover the map and displays distance and altitude level.
   * Since this does a lookup of the point on the graph
   * the closest to the given latlng on the provided event, it could be slow.
   */
  mapMousemoveHandler: function mapMousemoveHandler(event) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$showMapMarker = _ref.showMapMarker,
        showMapMarker = _ref$showMapMarker === void 0 ? true : _ref$showMapMarker;

    if (this._areasFlattended === false) {
      return;
    } // initialize the vars for the closest item calculation


    var closestItem = null; // large enough to be trumped by any point on the chart

    var closestDistance = 2 * Math.pow(100, 2); // consider a good enough match if the given point (lat and lng) is within
    // 1.1 meters of a point on the chart (there are 111,111 meters in a degree)

    var exactMatchRounding = 1.1 / 111111;

    var _iterator2 = _createForOfIteratorHelper(this._areasFlattended),
        _step2;

    try {
      for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
        var item = _step2.value;
        var latDiff = event.latlng.lat - item.latlng.lat;
        var lngDiff = event.latlng.lng - item.latlng.lng; // first check for an almost exact match; it's simple and avoid further calculations

        if (Math.abs(latDiff) < exactMatchRounding && Math.abs(lngDiff) < exactMatchRounding) {
          this._internalMousemoveHandler(item, showMapMarker);

          break;
        } // calculate the squared distance from the current to the given;
        // it's the squared distance, to avoid the expensive square root


        var distance = Math.pow(latDiff, 2) + Math.pow(lngDiff, 2);

        if (distance < closestDistance) {
          closestItem = item;
          closestDistance = distance;
        }
      }
    } catch (err) {
      _iterator2.e(err);
    } finally {
      _iterator2.f();
    }

    if (closestItem) this._internalMousemoveHandler(closestItem, showMapMarker);
  },

  /*
   * Handles the mouseover the chart and displays distance and altitude level
   */
  _mousemoveHandler: function _mousemoveHandler(d, i, ctx) {
    var coords = d3.mouse(this._svg.node());

    var item = this._areasFlattended[this._findItemForX(coords[0])];

    if (item) this._internalMousemoveHandler(item);
  },

  /*
   * Handles the mouseover, given the current item the mouse is over
   */
  _internalMousemoveHandler: function _internalMousemoveHandler(item) {
    var showMapMarker = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    var areaLength;
    var alt = item.altitude,
        dist = item.position,
        ll = item.latlng,
        areaIdx = item.areaIdx,
        type = item.type;
    var boxWidth = this._dynamicBoxSize(".focusbox text")[1] + 10;

    if (areaIdx === 0) {
      areaLength = this._categories[this._selectedAttributeIdx].distances[areaIdx];
    } else {
      areaLength = this._categories[this._selectedAttributeIdx].distances[areaIdx] - this._categories[this._selectedAttributeIdx].distances[areaIdx - 1];
    }

    if (showMapMarker) {
      this._showMapMarker(ll, alt, type);
    }

    this._distTspan.text(" " + dist.toFixed(1) + ' km');

    this._altTspan.text(" " + alt + ' m');

    this._areaTspan.text(" " + areaLength.toFixed(1) + ' km');

    this._typeTspan.text(" " + type);

    this._focusRect.attr("width", boxWidth);

    this._focusLine.style("display", "block").attr('x1', this._x(dist)).attr('x2', this._x(dist));

    var xPositionBox = this._x(dist) - (boxWidth + 5);
    var totalWidth = this._width - this._margin.left - this._margin.right;

    if (this._x(dist) + boxWidth < totalWidth) {
      this._focus.style("display", "initial").attr("transform", "translate(" + this._x(dist) + "," + this._y(this._elevationBounds.min) + ")");
    }

    if (this._x(dist) + boxWidth > totalWidth) {
      this._focus.style("display", "initial").attr("transform", "translate(" + xPositionBox + "," + this._y(this._elevationBounds.min) + ")");
    }
  },

  /*
   * Finds a data entry for a given x-coordinate of the diagram
   */
  _findItemForX: function _findItemForX(x) {
    var bisect = d3.bisector(function (d) {
      return d.position;
    }).left;

    var xInvert = this._x.invert(x);

    return bisect(this._areasFlattended, xInvert);
  },

  /*
   * Finds data entries above a given y-elevation value and returns geo-coordinates
   */
  _findCoordsForY: function _findCoordsForY(y) {
    var bisect = function bisect(b, yInvert) {
      //save indexes of elevation values above the horizontal line
      var list = [];

      for (var i = 0; i < b.length; i++) {
        if (b[i].altitude >= yInvert) {
          list.push(i);
        }
      } //split index list into coherent blocks of coordinates


      var newList = [];
      var start = 0;

      for (var j = 0; j < list.length - 1; j++) {
        if (list[j + 1] !== list[j] + 1) {
          newList.push(list.slice(start, j + 1));
          start = j + 1;
        }
      }

      newList.push(list.slice(start, list.length)); //get lat lon coordinates based on indexes

      for (var k = 0; k < newList.length; k++) {
        for (var l = 0; l < newList[k].length; l++) {
          newList[k][l] = b[newList[k][l]].latlng;
        }
      }

      return newList;
    };

    var yInvert = this._y.invert(y);

    return bisect(this._areasFlattended, yInvert);
  },

  /*
   * Checks the user passed translations, if they don't exist, fallback to the default translations
   */
  _getTranslation: function _getTranslation(key) {
    if (this.options.translation[key]) return this.options.translation[key];
    if (this._defaultTranslation[key]) return this._defaultTranslation[key];
    console.error("Unexpected error when looking up the translation for " + key);
    return 'No translation found';
  }
});

L.control.heightgraph = function (options) {
  return new L.Control.Heightgraph(options);
}; //     return L.Control.Heightgraph
// }, window))
