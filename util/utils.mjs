'use strict';

const getParam = (options) => {
  const url = options.url || '';
  const prefix = options.pre || '';
  const regexBuild = `(?<=${prefix}\/)\\d*\\w*`
  const sample = /\d*\w*/;
  const regex = new RegExp(regexBuild);

  return regex.exec(url)?.[0];
}

const convertObjPropKeys = (c) => {
  const reqBody = {};
  for (const key in c) {
    if (Object.prototype.hasOwnProperty.call(c, key)) {
      const snakeKey = key.replace(
        /[A-Z]/g,
        char => `_${char.toLowerCase()}`
      );
      reqBody[snakeKey] = c[key];
    }
  }
  return reqBody;
}

export default {
  getParam,
  convertObjPropKeys
}