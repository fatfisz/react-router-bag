import NotFoundError from 'not-found-error';


export default function onEnter(element, nextState, replace, callback) {
  const { getDataUrl, label, request, requestData } = element.props;

  if (global.window && requestData.firstRender) {
    return callback();
  }

  const url = getDataUrl(nextState);

  request({ url })
    .then((data) => {
      requestData.set(label, data);
    })
    .catch((err) => {
      const isNotFound = err instanceof NotFoundError;
      const status = isNotFound ? 404 : 500;

      if (!global.window && !isNotFound) {
        console.error(err.stack); // eslint-disable-line no-console
      }

      requestData.set(label, {
        status,
      });
      requestData.status = status;
    })
    .asCallback(callback);
}
