'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports['default'] = connectBag;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _request_data = require('./request_data');

var _request_data2 = _interopRequireDefault(_request_data);

function getComponentName(Component) {
  if (typeof Component === 'string') {
    return Component;
  }

  return Component.displayName || Component.name || 'anonymous';
}

function getState(requestData, mapping, keys) {
  var result = {};

  keys.forEach(function (key) {
    var targetKey = mapping[key];
    result[key] = requestData.get(targetKey);
  });

  return result;
}

function connectBag(Component, mapping) {
  if (process.env.NODE_ENV !== 'production' && typeof Component !== 'function' && typeof Component !== 'string') {
    // eslint-disable-next-line no-console
    throw new Error('Expected Component to be a string (for built-in components) or a class/function (for composite components).');
  }

  if (process.env.NODE_ENV !== 'production' && (typeof mapping !== 'object' || mapping === null)) {
    // eslint-disable-next-line no-console
    throw new Error('Expected mapping to be an object.');
  }

  var componentName = getComponentName(Component);
  var keys = Object.keys(mapping);

  keys.forEach(function (key) {
    var targetKey = mapping[key];

    if (targetKey === true) {
      mapping[key] = key;
      return;
    }

    if (process.env.NODE_ENV !== 'production' && typeof targetKey !== 'string') {
      // eslint-disable-next-line no-console
      console.error('Warning: The value of the ' + key + ' property should be either "true" or a string, got ' + targetKey + '.');
    }
  });

  function BagConnector(props, context) {
    var state = getState(context.requestData, mapping, keys);

    return _react2['default'].createElement(Component, _extends({}, props, state));
  }

  BagConnector.displayName = 'BagConnector<' + componentName + '>';

  BagConnector.contextTypes = {
    requestData: _react2['default'].PropTypes.instanceOf(_request_data2['default']).isRequired
  };

  return BagConnector;
}

module.exports = exports['default'];
