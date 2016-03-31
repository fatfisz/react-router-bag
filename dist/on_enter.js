'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports['default'] = onEnter;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _notFoundError = require('not-found-error');

var _notFoundError2 = _interopRequireDefault(_notFoundError);

function onEnter(element, nextState, replace, callback) {
  var _element$props = element.props;
  var getDataUrl = _element$props.getDataUrl;
  var label = _element$props.label;
  var request = _element$props.request;
  var requestData = _element$props.requestData;

  if (global.window && requestData.firstRender) {
    return callback();
  }

  var url = getDataUrl(nextState);

  request({ url: url }).then(function (data) {
    requestData.set(label, data);
  })['catch'](function (err) {
    var isNotFound = err instanceof _notFoundError2['default'];
    var status = isNotFound ? 404 : 500;

    if (!global.window && !isNotFound) {
      console.error(err.stack); // eslint-disable-line no-console
    }

    requestData.set(label, {
      status: status
    });
    requestData.status = status;
  }).asCallback(callback);
}

module.exports = exports['default'];
