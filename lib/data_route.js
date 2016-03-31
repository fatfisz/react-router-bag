import React from 'react';
import { Route } from 'react-router';

import onEnter from './on_enter';


function DataRoute(props) {
  return <Route {...props} />;
}

DataRoute.propTypes = {
  ...Route.propTypes,
  getDataUrl: React.PropTypes.func.isRequired,
  label: React.PropTypes.string.isRequired,
  request: React.PropTypes.func.isRequired,
  requestData: React.PropTypes.object.isRequired,
};

DataRoute.createRouteFromReactElement = (element, parentRoute) => {
  const newElement = React.cloneElement(element, {
    isDataRoute: true,
    onEnter(nextState, replace, callback) {
      return onEnter(element, nextState, replace, callback);
    },
  });
  return Route.createRouteFromReactElement(newElement, parentRoute);
};

export default DataRoute;
