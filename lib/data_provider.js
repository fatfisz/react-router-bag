import React from 'react';
import { RouterContext } from 'react-router';

import RequestData from './request_data';


const DataProvider = React.createClass({
  propTypes: {
    render: React.PropTypes.func,
    renderProps: React.PropTypes.object.isRequired,
    requestData: React.PropTypes.instanceOf(RequestData).isRequired,
  },

  childContextTypes: {
    requestData: React.PropTypes.instanceOf(RequestData).isRequired,
  },

  getDefaultProps() {
    return {
      render(props) {
        return <RouterContext {...props} />;
      },
    };
  },

  getChildContext() {
    return {
      requestData: this.props.requestData,
    };
  },

  componentDidMount() {
    this.props.requestData.rendered();
  },

  render() {
    const { renderProps, requestData } = this.props;
    const components = [...renderProps.components];

    renderProps.routes.forEach((route, index) => {
      if (!route.isDataRoute) {
        return;
      }

      const routeRequestData = requestData.get(route.label);

      if (!routeRequestData.ok) {
        if (routeRequestData.status === 404) {
          components[index] = route.notFoundComponent;
        } else {
          components[index] = route.errorComponent;
        }
      }
    });

    const newRenderProps = {
      ...renderProps,
      components,
    };

    return this.props.render(newRenderProps);
  },
});

export default DataProvider;
