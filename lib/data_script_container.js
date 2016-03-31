import React from 'react';

import RequestData from './request_data';


const DataScriptContainer = React.createClass({
  contextTypes: {
    requestData: React.PropTypes.instanceOf(RequestData).isRequired,
  },

  shouldComponentUpdate() {
    return false;
  },

  render() {
    const stringified = this.context.requestData.getJSON();

    return (
      <script
        id='data-script-container'
        type='application/json'
        dangerouslySetInnerHTML={{ __html: stringified }}
      />
    );
  },
});

export default DataScriptContainer;
