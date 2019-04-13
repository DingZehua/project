let lib_base = (function() {
  let {Promise : MyPromise,method:{leftParital}} = require('../js/base').base;
  let fs = require('fs');
  let queryString = require('querystring');
  let lib_base = {};

  // 加载文件.
  function readPage(fileName,encode) {
    return new MyPromise(function(resolve,reject){
      fs.readFile(fileName,encode || null,function(err,data) {
        if(err) reject(err);
        else resolve(data);
      })
    });
  }
  // 文件状态
  function fileStat(fileName) {
    return new MyPromise(function(resolve,reject){
      fs.stat(fileName,function(err,stat) {
        resolve({stat,err});
      })
    });
  }

  /**
  * 
  * @return {Function} curring
  */
  let fetchPOSTDataCurring = function(req,contentType,boundary) {
    return leftParital(function(getFile) {
      let post = '';
      let files = [];
      // POST检测
      if(!getFile) {
        if(contentType === 'multipart/from-data') {
          throw Symbol.for('POST_EXCEPTION')
        }
        req.on('data',(chunk) => {
          post += chunk;
        });
      } else {
        // TODO:获取文件接口
      }
      return new MyPromise(function(resolve) {
        req.on('end',() => {
          if(!getFile)  resolve(queryString.parse(post));
          else resolve({post,files});
        });
      });
    })
  };

  // 获取Cookeie
  function fetchCookies(req) {
    let Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
      var parts = Cookie.split('=');
      Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    return Cookies || {};
  }

  // 获得GET
  function fetchGETData(query) {
    return queryString.parse(query);
  }

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

  //设置cookie
  let setCookies = function(req) {
    let cookies = {};
    let count = 0;
    let COOKIES = fetchCookies(req);
    return {
      set : function(obj,second,attr = []) {
        if(!obj) return false;
        if(!Array.isArray(attr)) throw TypeError('attr 必须是数组');
        attr = [`Max-Age=${second}`,...attr];
        for(let [key,value] of Object.entries(obj)) {
          cookies[key] = {value,attr};
          count++;
        }
        return this;
      },
      remove(key) {
        if(cookies.hasOwnProperty(key)) {
          count--;
          return delete cookies[key];
        }
        return false;
      },
      keys() {
        return Object.keys(cookies);
      },
      _build() {
        return this.keys().map((key) => {
          return `${key}=${cookies[key].value};` + cookies[key].attr.join(';');
        }).join(';');
      },
      removeClient(key) {
        if(cookies.hasOWnProperty(key)) {
          cookies[key].attr = ['Max-Age=0'];
        } else {
          this.set({key : ''},['Max-Age=0']);
        }
      },
      removeAllClient() {
        new Set([...Object.keys(cookies),...Object.keys(COOKIES)]).forEach((key) => {
          this.removeClient(key);
        },this);
      }
    }


  };



  lib_base.readPage = readPage;
  lib_base.fileStat = fileStat;
  lib_base.fetchPOSTDataCurring = fetchPOSTDataCurring;
  lib_base.fetchCookies = fetchCookies;
  lib_base.fetchGETData = fetchGETData;
  lib_base.parseQueryString = parseQueryString;
  lib_base.setCookies = setCookies;

  return lib_base;
}());

try{(module && (module.exports = lib_base));}
catch(e){}