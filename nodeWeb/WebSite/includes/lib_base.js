let lib_base = (function() {
  let {Promise : MyPromise,method:{leftParital}} = require('../js/base').base;
  let fs = require('fs');
  let queryString = require('querystring');
  let lib_base = {};
  let md5 = require('md5');
  let config = require('../config');
  let isArr = arr => Array.isArray(arr);

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
        if(contentType === config.formSubmitType.mul) {
          throw Symbol.for('POST_EXCEPTION');
        }
        req.once('data',(chunk) => {
          post += chunk;
        });
      } else {
        req.once('data',(chunk) => {
          post += chunk;
        });

        // 处理文件和post数据
        if(contentType === config.formSubmitType.mul) {
          ([,boundary] = boundary.split('boundary='));
          req.setEncoding('binary');
        }
      }
      return new MyPromise(function(resolve) {
        req.on('end',() => {
          // 在这里出错，将会在全局出错。
          resolve();
        });
      }).then(() => {
        if(!getFile) return queryString.parse(post);
          else {
            // 通过ajax访问时可以没有contentType的.
            if(contentType) {
              let data = dataSplit(post,boundary);
              ({post,files} = data);
            }
            return {POST:post,files};
          }
      });
    });

    function dataSplit(postdata,boundary) {
      let dataChunks = postdata.toString().split(`--${boundary}`);
      let dataList = {post:{},files:[]};
      //祛除掉收尾，如果是空数组，那么表示没有传数据.
      dataChunks.splice(-1);
      dataChunks.splice(0,1);
      dataChunks.forEach((chunk) => {
        let [attri,data] = chunk.split('\r\n\r\n');
        attri = attri.slice(2);
        let [formAttri,contentType = null] = attri.split('\r\n');
        // 获得表单属性
        let [,name,fileName = null] = formAttri.split('; ');
        // 获得表单key/value
        if(!contentType) {
          // 对文本进行转换
          dataList.post[Buffer.from(name.slice(6,-1),'binary').toString('utf-8')] = Buffer.from(data.slice(0,-2),'binary').toString('utf-8'); 
        } else {
          /* 取得文件 */
          let fileType = contentType.split(': ')[1];
          fileName = fileName.slice(10,-1);
          if(fileName !== '' /* && fileType !== config.contentType.octet */) {
            if(fileType === config.contentType.plain) {
              data = Buffer.from(data,'binary').toString('utf-8');
            }
            // 加入文件集合
            // 如果是文件，不用剔除最后两个字符.
            dataList.files.push({
              fileName : fileName.split('\\').pop(),
              data,
              length : data.length
            });
          }
        }
      });
      return dataList;
    }

  };

  // 获取Cookeie
  function fetchCookies(req) {
    let Cookies = {};
    req.headers.cookie && req.headers.cookie.split(';').forEach(function( Cookie ) {
      var parts = Cookie.split('=');
      Cookies[ parts[ 0 ].trim() ] = ( parts[ 1 ] || '' ).trim();
    });
    return Cookies;
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
        if(!t.isExist(SESS_ID)) { t.add(SESS_ID); }
        return Reflect.get(t.userData[SESS_ID].data,prop,t.userData[SESS_ID].data);
      },
      deleteProperty(t,p) {
        if(!t.has(SESS_ID)) return false;
        return Reflect.deleteProperty(t.userData[sessionSet],p);
      },
      defineProperty(t,p,attr) {
        if(!t.has(SESS_ID)) throw 'session未创建';
        return Reflect.defineProperty(t.userData[SESS_ID],p,attr);
      },
      has(t,p) {
        if(!t.has(SESS_ID)) return false;
        return Reflect.has(t.userData[SESS_ID],p);
      },
      isExtensible(t) {
        if(!t.has(SESS_ID)) throw 'session未创建';
        return Reflect.isExtensible(t.userData[SESS_ID]);
      },
      getOwnPropertyDescriptor(t,p) {
        if(!t.has(SESS_ID)) throw 'session未创建';
        return Reflect.getOwnPropertyDescriptor(t.userData[SESS_ID],p);
      },
      getPrototypeOf(t){
        if(!t.has(SESS_ID)) throw 'session未创建';
        return Reflect.getPrototypeOf(t.userData[SESS_ID]);
      },
      ownKeys(t) {
        if(!t.has(SESS_ID)) throw 'session未创建';
        return Reflect.ownKeys(t.userData[SESS_ID]);
      },
      preventExtensions(t) {
        if(!t.has(SESS_ID)) throw 'session未创建';
        Object.preventExtensions(t.userData[SESS_ID]);
        return true;
      },
      setPrototypeOf(t,v) {
        if(!t.has(SESS_ID)) throw 'session未创建';
        if(Reflect.isExtensible(t.userData[SESS_ID])) {
          throw '对象不可拓展';
        } else {
          return Reflect.setPrototypeOf(t,v);
        }
      }
    });
  }

  function createToken(token_number = 200,expired = 5 * 60) {
    if(!token_number) {
      throw 'token_number 不能为空或为0';
    }
    let tokens = {};
    let count = Symbol('count');
    let destror = Symbol('destroy');
    let canCreate = Symbol('canCreate');
    
    tokens[count] = 0;
    expired *= 1000;
    tokens[destror] = function(SESS_ID) {
      if(this.hasOwnProperty(SESS_ID)) {
        deepDelete(this[SESS_ID]);
        delete this[SESS_ID];
      }
      return true;
    }

    tokens[canCreate] = function() {
      return this[count] < token_number;
    }


    let waitQueue = [];
    let intervalClearTime = 50;

    function clearToken() { 
      let runging = false;
      let clearG = (function * (){
        while(1) {
          yield runging;
          if(!runging) {
            let {time,delay} = yield;
            //在这里加一个yield如果可以执行，那么会执行到这里。
            //这里往下执行
            runging = true;
            let SESS_IDs = Object.keys(tokens);
            let tokenlen = SESS_IDs.length
            
            if(tokenlen < token_number) {
              allocate();
            }

            if(delay !== undefined) {
              setTimeout(bound,delay);
            } else {
              bound();
            }

            function bound() {
              clearTake(
                // 清理过期token.
                function(i) {
                  console.log(i,SESS_IDs.length);
                  let SESS_ID = (SESS_IDs[i]);
                  if(tokens[SESS_ID].expired < time) {
                    tokens[destror](SESS_ID);
                    tokenlen--;
                  }
                },
                allocate,SESS_IDs.length);
            }

            // 通知消息队列
            function allocate() {
              // 可以创建token的用户。
              tokens[count] = tokenlen;
              while(tokenlen < token_number) {
                if(!waitQueue.length) {
                  break;
                }
                setTimeout(waitQueue.shift(),0,true);
                tokens[count]++;
              }
              // 保证token不超出范围，清理多余剩余的队列，并下发失败的通知.
              while(waitQueue.length) {
                if(!waitQueue.length) {
                  break;
                }
                setTimeout(waitQueue.shift(),0,false);
              }
              runging = false;
            }
          } else {
            yield;
          }
        }
      }());
      clearG.next();
      return clearG;
      function clearTake(clearMethod,callback,length,i = 0) {
        let m = new Date().getMilliseconds();
        do {
          clearMethod(i);
          i++;
        }while(new Date().getMilliseconds() - m < 25 && i < length);
        // 切割任务，以防止阻塞执行堆栈.
        if(i < length) {
          setTimeout(clearTake,0,clearMethod,callback,length,i);
        } else {
          callback();
        }
      }
    }

    const clearTokenGen = clearToken();

    return function(SESS_ID,token = Symbol(),url,GET,time){
      // 用重定向放在url里面。
      return {
        // 只有token一致且不过期才能使用.
        isExist() {
          if(!tokens.hasOwnProperty(SESS_ID)) {
            return false;
          }
          // 防止伪造token
          if(tokens[SESS_ID].token === token){
            if(tokens[SESS_ID].expired > time) {
              tokens[SESS_ID].expired = time + expired;
              return true;
            } else {
              this.destror();
            }
          }
          return false;
        },
        canCreate() {
          return tokens[count] < token_number;
        },
        destror () {
          tokens[destror](SESS_ID);
          tokens[count]--;
          return true;
        },
        /**
         * @param  {String} token
         * @return {Boolean} boolean
         */
        create() {
          if(this.isExist()) {
            return true;
          }
          if(!this.canCreate()) return false;
          tokens[SESS_ID] = {
            expired : new Date().getTime() + expired,
            token   : md5(Math.random()) 
          };
          tokens[count]++;
          token = tokens[SESS_ID].token;
          return true;
        },
        revisit() {
          GET.token = token;
          throw {
            url : (url || '/') + queryStringify(GET),
            status : 302,
            [Symbol.for('REDIRECT')] : true
          };
        },
        get(){
          return !this.isExist() ? null : token;
        },
        /**
         * @param {String} token
         * @return {Promise} Promise
         */
        async mustCreate(count = 3) {
          if(this.create()) return true;
          // 尝试获取token.
          let self = this;
          let i = 0;
          function next() {
            return new MyPromise((resolve) => {
              if(i < count) {
                waitQueue.push(function(res) { 
                  i++;
                  if(res) {
                    resolve(self.create());
                  } else {
                    resolve(next());
                  };
                });
                // 清理任务不在运行，才可清理.
                if(!clearTokenGen.next().value) {
                  if(count - i === count) {
                    clearTokenGen.next({time});
                  } else {
                    clearTokenGen.next(new Date().getTime(),{time,delay : intervalClearTime * i});
                  }
                } else {
                  // 忽略这次执行.
                  clearTokenGen.next();
                }
              } else {
                resolve(false);
              }
            });
          }
          return next();
        }
      };
    };
  }
  
  function queryStringify(obj) {
    if(!obj) return '';
    return Object.entries(obj).reduce((str,[key,value]) => `${str}${key}=${value}&`,'?').slice(0,-1);
  }

  /**
   * @api public
   * @param {Array} pathMap 
   * @return {RegExp}
   */

  function accessPath(pathMap) {
    if(!isArr(pathMap)) {
      throw TypeError('pathMap must a Array type');
    }

    return new RegExp(pathMap.join('|')   
                      .replace(/\\/g,''.padStart(2,'\\'))
                      .replace(/\//g,''.padStart(2,'\\//'))
                      .replace(/[.]/g,'[.]')
                      .replace(/[\[]([\\\.])[\]]/g,'.') ||
                      /[^\s\S]*/,'i');
  }

  /**
   * @api public
   * @param {Array} arr 
   * @return {RegExp}
   */

  function uniquePath(arr) {
    return accessPath([...new Set(arr.filter(function(x){return x;}))])
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
  lib_base.queryStringify = queryStringify;
  lib_base.createToken = createToken;
  lib_base.accessPath = accessPath;
  lib_base.uniquePath = uniquePath;

  return lib_base;
}());

try{(module && (module.exports = lib_base));}
catch(e){}