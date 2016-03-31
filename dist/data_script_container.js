'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _request_data = require('./request_data');

var _request_data2 = _interopRequireDefault(_request_data);

var DataScriptContainer = _react2['default'].createClass({
  displayName: 'DataScriptContainer',

  contextTypes: {
    requestData: _react2['default'].PropTypes.instanceOf(_request_data2['default']).isRequired
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    return false;
  },

  render: function render() {
    var stringified = this.context.requestData.getJSON();

    return _react2['default'].createElement('script', {
      id: 'data-script-container',
      type: 'application/json',
      dangerouslySetInnerHTML: { __html: stringified }
    });
  }
});

exports['default'] = DataScriptContainer;
module.exports = exports['default'];
