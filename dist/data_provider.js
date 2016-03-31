'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRouter = require('react-router');

var _request_data = require('./request_data');

var _request_data2 = _interopRequireDefault(_request_data);

var DataProvider = _react2['default'].createClass({
  displayName: 'DataProvider',

  propTypes: {
    render: _react2['default'].PropTypes.func,
    renderProps: _react2['default'].PropTypes.object.isRequired,
    requestData: _react2['default'].PropTypes.instanceOf(_request_data2['default']).isRequired
  },

  childContextTypes: {
    requestData: _react2['default'].PropTypes.instanceOf(_request_data2['default']).isRequired
  },

  getDefaultProps: function getDefaultProps() {
    return {
      render: function render(props) {
        return _react2['default'].createElement(_reactRouter.RouterContext, props);
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

    var newRenderProps = _extends({}, renderProps, {
      components: components
    });

    return this.props.render(newRenderProps);
  }
});

exports['default'] = DataProvider;
module.exports = exports['default'];
