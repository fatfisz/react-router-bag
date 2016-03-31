'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));
var reactRouter = require('react-router');
var NotFoundError = _interopDefault(require('not-found-error'));

var babelHelpers = {};

babelHelpers.createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

babelHelpers._extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

babelHelpers.classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
var privateData = new WeakMap();

var RequestData = (function () {
  function RequestData() {
    var labelled = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    var status = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
    babelHelpers.classCallCheck(this, RequestData);

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

  babelHelpers.createClass(RequestData, [{
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

RequestData.fromStringified = function (stringified) {
  var labelled = JSON.parse(stringified);
  var requestData = new RequestData();
  var data = privateData.get(requestData);

  babelHelpers._extends(data, {
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

    return React.createElement(Component, babelHelpers._extends({}, props, state));
  }

  BagConnector.displayName = 'BagConnector<' + componentName + '>';

  BagConnector.contextTypes = {
    requestData: React.PropTypes.instanceOf(RequestData).isRequired
  };

  return BagConnector;
}

var DataProvider = React.createClass({
  displayName: 'DataProvider',

  propTypes: {
    render: React.PropTypes.func,
    renderProps: React.PropTypes.object.isRequired,
    requestData: React.PropTypes.instanceOf(RequestData).isRequired
  },

  childContextTypes: {
    requestData: React.PropTypes.instanceOf(RequestData).isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      render: function render(props) {
        return React.createElement(reactRouter.RouterContext, props);
      }
    };
  },

  getChildContext: function getChildContext() {
    return {
      requestData: this.props.requestData
    };
  },

  componentDidMount: function componentDidMount() {
    this.props.requestData.rendered();
  },

  render: function render() {
    var _props = this.props;
    var renderProps = _props.renderProps;
    var requestData = _props.requestData;

    var components = [].concat(renderProps.components);

    renderProps.routes.forEach(function (route, index) {
      if (!route.isDataRoute) {
        return;
      }

      var routeRequestData = requestData.get(route.label);

      if (!routeRequestData.ok) {
        if (routeRequestData.status === 404) {
          components[index] = route.notFoundComponent;
        } else {
          components[index] = route.errorComponent;
        }
      }
    });

    var newRenderProps = babelHelpers._extends({}, renderProps, {
      components: components
    });

    return this.props.render(newRenderProps);
  }
});

var DataScriptContainer = React.createClass({
  displayName: 'DataScriptContainer',

  contextTypes: {
    requestData: React.PropTypes.instanceOf(RequestData).isRequired
  },

  shouldComponentUpdate: function shouldComponentUpdate() {
    return false;
  },

  render: function render() {
    var stringified = this.context.requestData.getJSON();

    return React.createElement('script', {
      id: 'data-script-container',
      type: 'application/json',
      dangerouslySetInnerHTML: { __html: stringified }
    });
  }
});

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
    var isNotFound = err instanceof NotFoundError;
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

function DataRoute(props) {
  return React.createElement(reactRouter.Route, props);
}

DataRoute.propTypes = babelHelpers._extends({}, reactRouter.Route.propTypes, {
  getDataUrl: React.PropTypes.func.isRequired,
  label: React.PropTypes.string.isRequired,
  request: React.PropTypes.func.isRequired,
  requestData: React.PropTypes.object.isRequired
});

DataRoute.createRouteFromReactElement = function (element, parentRoute) {
  var newElement = React.cloneElement(element, {
    isDataRoute: true,
    onEnter: function onEnter$$(nextState, replace, callback) {
      return onEnter(element, nextState, replace, callback);
    }
  });
  return reactRouter.Route.createRouteFromReactElement(newElement, parentRoute);
};

function IndexDataRoute(props) {
  return React.createElement(reactRouter.IndexRoute, props);
}

IndexDataRoute.propTypes = babelHelpers._extends({}, reactRouter.IndexRoute.propTypes, {
  getDataUrl: React.PropTypes.func.isRequired,
  label: React.PropTypes.string.isRequired,
  request: React.PropTypes.func.isRequired,
  requestData: React.PropTypes.object.isRequired
});

IndexDataRoute.createRouteFromReactElement = function (element, parentRoute) {
  var newElement = React.cloneElement(element, {
    isDataRoute: true,
    onEnter: function onEnter$$(nextState, replace, callback) {
      return onEnter(element, nextState, replace, callback);
    }
  });
  return reactRouter.IndexRoute.createRouteFromReactElement(newElement, parentRoute);
};

function reportNotFound() {
  this.requestData.status = 404;
}

exports.connectBag = connectBag;
exports.DataProvider = DataProvider;
exports.DataScriptContainer = DataScriptContainer;
exports.DataRoute = DataRoute;
exports.IndexDataRoute = IndexDataRoute;
exports.reportNotFound = reportNotFound;
exports.RequestData = RequestData;