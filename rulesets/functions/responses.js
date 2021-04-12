module.exports = (responseObjects) => { // eslint-disable-line consistent-return
  /**
   * Loop through the response objects
   */
  const okOrDefault = Object.keys(responseObjects)
    .filter((key) => key.match(/2[0-9]{2}|default/));

  if (okOrDefault.length === 0) {
    return [{ message: 'Both 2xx operations and default are missing' }];
  }
};
