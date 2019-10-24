let colls = require('./js/base');
let MyPromise = colls.base.Promise;
let fs = require('fs');
let {log,co} = colls.base.method;
const UTF8 = 'utf-8';
const {mysql : config,configPath,access} = require('./config');
const mysql = require('mysql');

let thunkify = function(fn) {
  return function() {
    let args = [];
    for(let i = 0; i < arguments.length; i++) {
      args.push(arguments[i]);
    }
    let cxt = this;
    return function(callback) {
      let called;
      args.push(function() {
        if(called) return;
        called = true;
        callback.apply(null,arguments);  
      });
      try {
        fn.apply(cxt,args);
      } catch (e) {
        callback(e);
      }
    }
  }
};

function next(err,data) {
  // 获取下一步命令，注入数据。
  let result = g.next(data);
  if(!result.done) {
    result.value(next);
  }
}
//let queryThunkify = thunkify(con.query);

class mysqlDB  {
  constructor (config,next) {
    let sql = mysql;
    this.con = sql.createConnection(config);
    this.next = next;
    this.con.connect(function(){log('start mysql');});
    this._queryThunk = thunkify(this.con.query);
    this._end = thunkify(this.con.end);
  }
  queryThunk (str) {
    return this._queryThunk.call(this.con,str);
  }
  endThunk () {
    return this._end.call(this.con);
  }
  queryProm(str) {
    let self = this;
    return new MyPromise(function(resolve,reject) {
      self.con.query(str,function(err,data) {
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }
}

let path = require('path');

(() => {
  /*
  function next(err,data) {
    if(err) throw err;
    let result = start.next(data);
    if(!result.done) {
      result.value(next);
    }
  }

  function thunkToPromise(err,data) {
    if(err) start.throw(err);
    else { nextProm(data); }
  }

  function nextProm(data) {
    let result = start.next(data);
    if(result.done) return result.value; // 结束时传给最后一个Promise对象的then方法的返回值
    else {
      result.value.then(function(data) {
        nextProm(data);
      });
    }
  }
  //let start = main();
  let sql = new mysqlDB(config);
  function * main() {
    let user = yield sql.queryProm('select user_name,email from ecs_users where user_id = 79');
    let sets =  yield new Set([1,2,3,4,5,6]);
    
    let file = fs.createReadStream('data/list(201309).txt');
    let result = null;
    
    while(1) {
      let y = MyPromise.race([
        new MyPromise((resolve) => { log(file.once('data',function(data){resolve(data);})); }),
        new MyPromise((resolve) => {file.once('end',resolve)}),
        new MyPromise((resolve,reject) => file.once('error',reject))
      ]);
      result = yield y;
      
      file.removeAllListeners('data');
      file.removeAllListeners('end');
      file.removeAllListeners('error');
      if(!file.eventsCount) {break;}
    }
    log('end Generator');
    yield sql.endThunk();
  }
  co(main()).catch(function(e){log(e)});
  */
})();
