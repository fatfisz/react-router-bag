'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _on_enter = require('./on_enter');

var _on_enter2 = _interopRequireDefault(_on_enter);

function DataRoute(props) {
  return _react2['default'].createElement(_reactRouter.Route, props);
}

DataRoute.propTypes = _extends({}, _reactRouter.Route.propTypes, {
  getDataUrl: _react2['default'].PropTypes.func.isRequired,
  label: _react2['default'].PropTypes.string.isRequired,
  request: _react2['default'].PropTypes.func.isRequired,
  requestData: _react2['default'].PropTypes.object.isRequired
});

DataRoute.createRouteFromReactElement = function (element, parentRoute) {
  var newElement = _react2['default'].cloneElement(element, {
    isDataRoute: true,
    onEnter: function onEnter(nextState, replace, callback) {
      return (0, _on_enter2['default'])(element, nextState, replace, callback);
    }
  });
  return _reactRouter.Route.createRouteFromReactElement(newElement, parentRoute);
};

exports['default'] = DataRoute;
module.exports = exports['default'];
