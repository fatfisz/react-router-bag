/* eslint-env browser */
'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var privateData = new WeakMap();

var RequestData = (function () {
  function RequestData() {
    var labelled = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var status = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    _classCallCheck(this, RequestData);

    privateData.set(this, {
      labelled: labelled,
      firstRender: true,
      dirty: true,
      stringified: null,
      status: status
    });
  }

  RequestData.prototype.rendered = function rendered() {
    privateData.get(this).firstRender = false;
  };

  RequestData.prototype.getJSON = function getJSON() {
    var data = privateData.get(this);

    if (data.dirty) {
      data.stringified = JSON.stringify(data.labelled);
      data.dirty = false;
    }

    return data.stringified;
  };

  RequestData.prototype.get = function get(key) {
    return privateData.get(this).labelled[key];
  };

  RequestData.prototype.set = function set(key, value) {
    var data = privateData.get(this);

    data.labelled[key] = value;
    data.dirty = true;
  };

  _createClass(RequestData, [{
    key: 'firstRender',
    get: function get() {
      return privateData.get(this).firstRender;
    }
  }, {
    key: 'status',
    get: function get() {
      return privateData.get(this).status;
    },
    set: function set(value) {
      privateData.get(this).status = value;
    }
  }]);

  return RequestData;
})();

exports['default'] = RequestData;

RequestData.fromStringified = function (stringified) {
  var labelled = JSON.parse(stringified);
  var requestData = new RequestData();
  var data = privateData.get(requestData);

  _extends(data, {
    labelled: labelled,
    dirty: false,
    stringified: stringified
  });

  return requestData;
};

RequestData.fromDataScriptContainer = function () {
  var stringified = document.getElementById('data-script-container').textContent;

  return RequestData.fromStringified(stringified);
};
module.exports = exports['default'];
