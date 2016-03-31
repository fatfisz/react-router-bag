import React from 'react';
import { IndexRoute } from 'react-router';

import onEnter from './on_enter';


function IndexDataRoute(props) {
  return <IndexRoute {...props} />;
}

IndexDataRoute.propTypes = {
  ...IndexRoute.propTypes,
  getDataUrl: React.PropTypes.func.isRequired,
  label: React.PropTypes.string.isRequired,
  request: React.PropTypes.func.isRequired,
  requestData: React.PropTypes.object.isRequired,
};

IndexDataRoute.createRouteFromReactElement = (element, parentRoute) => {
  const newElement = React.cloneElement(element, {
    isDataRoute: true,
    onEnter(nextState, replace, callback) {
      return onEnter(element, nextState, replace, callback);
    },
  });
  return IndexRoute.createRouteFromReactElement(newElement, parentRoute);
};

export default IndexDataRoute;
