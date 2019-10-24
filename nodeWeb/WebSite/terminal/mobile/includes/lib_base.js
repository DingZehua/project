let lib_base = (function() {
  const lib_base = {};
  const config = require('./config');
  /**
   * @return {Object} Object
   */

  function parseQueryString(str) {
    if(!str) return {};
    str = str.replace(/^[?]/,'');
    let arr = str.split('&');
    let queryObj = {};
    for(let item of arr) {
      let [key,value] = item.split('=');
      queryObj[key] = value;
    }
    return queryObj;
  }

  
  function queryStringify(obj) {
    if(!obj) return '';
    return Object.entries(obj).reduce((str,[key,value]) => `${str}${key}=${value}&`,'?').slice(0,-1);
  }

  function getData(uri,data = '',type = 'GET') {
    return new Promise((res,rej) => {
      let url = config.host + uri;
      if(type === 'GET') {
        url += '?' + data;
      }
      wx.request({
        url,
        data,
        method : type,
        success : res,
        faild : rej
      })
    }) 
  }

  lib_base.parseQueryString = parseQueryString;
  lib_base.queryStringify = queryStringify;
  lib_base.getData = getData;

  return lib_base;
}());

try{(module && (module.exports = lib_base));}
catch(e){}