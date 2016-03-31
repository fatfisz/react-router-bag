/* eslint-env browser */
const privateData = new WeakMap();

export default class RequestData {
  constructor(labelled = {}, status = null) {
    privateData.set(this, {
      labelled,
      firstRender: true,
      dirty: true,
      stringified: null,
      status,
    });
  }

  rendered() {
    privateData.get(this).firstRender = false;
  }

  get firstRender() {
    return privateData.get(this).firstRender;
  }

  getJSON() {
    const data = privateData.get(this);

    if (data.dirty) {
      data.stringified = JSON.stringify(data.labelled);
      data.dirty = false;
    }

    return data.stringified;
  }

  get(key) {
    return privateData.get(this).labelled[key];
  }

  set(key, value) {
    const data = privateData.get(this);

    data.labelled[key] = value;
    data.dirty = true;
  }

  get status() {
    return privateData.get(this).status;
  }

  set status(value) {
    privateData.get(this).status = value;
  }
}

RequestData.fromStringified = function (stringified) {
  const labelled = JSON.parse(stringified);
  const requestData = new RequestData();
  const data = privateData.get(requestData);

  Object.assign(data, {
    labelled,
    dirty: false,
    stringified,
  });

  return requestData;
};

RequestData.fromDataScriptContainer = function () {
  const stringified = document.getElementById('data-script-container').textContent;

  return RequestData.fromStringified(stringified);
};
