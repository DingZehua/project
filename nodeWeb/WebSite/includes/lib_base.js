let lib_base = (function() {
  let {Promise : MyPromise,method:{leftParital}} = require('../js/base').base;
  let fs = require('fs');
  let queryString = require('querystring');
  let lib_base = {};
  let md5 = require('md5');

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
    // 自己设定的cookies
    let cookies = {};
    let count = 0;
    // 远程客户端发送过来的cookies
    let clientCookies = fetchCookies(req);
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
      clientKeys() {
        return Object.keys(clientCookies);
      },
      _build() {
        return this.keys().map((key) => {
          return `${key}=${cookies[key].value};${cookies[key].attr.join(';')}`;
        }).join(';');
      },
      // 删除远程客户端cookies
      removeClient(key) {
        if(cookies.hasOWnProperty(key)) {
          cookies[key].attr = ['Max-Age=0'];
        } else {
          this.set({key : ''},['Max-Age=0']);
        }
      },
      removeAllClient() {
        this.allCookieKeys().forEach((key) => {
          this.removeClient(key);
        },this);
      },
      allCookieKeys() {
        return Array.from(new Set([...this.keys(),...this.clientKeys()]));
      },
      has(hasKey) {
        return this.keys().some( (key) => key === hasKey);
      },
      hasAll(hasKey) {
        return this.allCookieKeys().some( (key) => key === hasKey);
      }
    }
  };

  function deepDelete(obj){
    for(var key in obj){
      if(typeof obj[key] !== 'string' && 
        !(obj[key] instanceof String) && 
        obj.hasOwnProperty(key)){
        deepDelete(obj[key]);
      }  
    }
    for(var key in obj){
      if(obj.hasOwnProperty(key)) {
        delete obj[key];
      }
    }
  }

  function buildSession_id() {
    return md5(md5(Math.random().toString()));
  }

  // 一旦调用，就算是注册session.
  function buildSession(SESS_ID,sessionSet,curTime,lifeTime) {
    // 一旦过期则销毁，不过期则续期.
    if(sessionSet.has(SESS_ID)) {
      if(sessionSet.userData[SESS_ID].expired > curTime) {
        sessionSet.userData[SESS_ID].expired = curTime + lifeTime * 1000;
      } else {
        sessionSet.destror(SESS_ID);
      }
    } 
    return new Proxy(sessionSet,{
      set(t,prop,value,receiver) {
        if(Reflect.get(t,prop,receiver)) {
          throw '不能定义内部属性名';
        }
        if(!t.userData[SESS_ID]) {
          t.add(SESS_ID);
        }
        return Reflect.set(t.userData[SESS_ID].data,prop,value,t.userData[SESS_ID].data);
      },
      get(t,prop,receiver) {
        if(Reflect.get(t,prop,receiver)) {
          if(typeof t[prop] === 'function') {
            return function() {
              return t[prop].apply(t,[SESS_ID,...arguments]);
            }
          } else {
            return t[prop];
          }
        }
        if(!t.isExist(SESS_ID)) { t.add(SESS_ID); }
        return Reflect.get(t.userData[SESS_ID].data,prop,t.userData[SESS_ID].data);
      }
    });
  }

  lib_base.readPage = readPage;
  lib_base.fileStat = fileStat;
  lib_base.fetchPOSTDataCurring = fetchPOSTDataCurring;
  lib_base.fetchCookies = fetchCookies;
  lib_base.fetchGETData = fetchGETData;
  lib_base.parseQueryString = parseQueryString;
  lib_base.setCookies = setCookies;
  lib_base.deepDelete = deepDelete;
  lib_base.buildSession_id = buildSession_id;
  lib_base.buildSession = buildSession;
  lib_base.md5 = md5;

  return lib_base;
}());

try{(module && (module.exports = lib_base));}
catch(e){}