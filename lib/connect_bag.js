import React from 'react';

import RequestData from './request_data';


function getComponentName(Component) {
  if (typeof Component === 'string') {
    return Component;
  }

  return Component.displayName || Component.name || 'anonymous';
}

function getState(requestData, mapping, keys) {
  const result = {};

  keys.forEach((key) => {
    const targetKey = mapping[key];
    result[key] = requestData.get(targetKey);
  });

  return result;
}

export default function connectBag(Component, mapping) {
  if (process.env.NODE_ENV !== 'production' &&
      typeof Component !== 'function' && typeof Component !== 'string') {
    // eslint-disable-next-line no-console
    throw new Error('Expected Component to be a string (for built-in components) or a class/function (for composite components).');
  }

  if (process.env.NODE_ENV !== 'production' &&
      (typeof mapping !== 'object' || mapping === null)) {
    // eslint-disable-next-line no-console
    throw new Error('Expected mapping to be an object.');
  }

  const componentName = getComponentName(Component);
  const keys = Object.keys(mapping);

  keys.forEach((key) => {
    const targetKey = mapping[key];

    if (targetKey === true) {
      mapping[key] = key;
      return;
    }

    if (process.env.NODE_ENV !== 'production' && typeof targetKey !== 'string') {
      // eslint-disable-next-line no-console
      console.error(`Warning: The value of the ${key} property should be either "true" or a string, got ${targetKey}.`);
    }
  });

  function BagConnector(props, context) {
    const state = getState(context.requestData, mapping, keys);

    return React.createElement(Component, { ...props, ...state });
  }

  BagConnector.displayName = `BagConnector<${componentName}>`;

  BagConnector.contextTypes = {
    requestData: React.PropTypes.instanceOf(RequestData).isRequired,
  };

  return BagConnector;
}
