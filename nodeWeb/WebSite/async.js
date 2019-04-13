let colls = require('./js/base');
let MyPromise = colls.base.Promise;
let fs = require('fs');
let {log,co} = colls.base.method;
const UTF8 = 'utf-8';
const {mysql : config,configPath,access} = require('./config');
const mysql = require('mysql');
let path = require('path');

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

/**
 * @param {config} obj
 */

class mysqlDB  {
  constructor (config) {
    let sql = mysql;
    this.con = sql.createConnection(config);
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
  /**
   * 
   * @param {sql} mysqlSyntax
   * @return {MyPromise} MyPromise
   */
  queryProm(str) {
    let self = this;
    return new MyPromise(function(resolve,reject) {
      self.con.query(str,function(err,data) {
        if(err) { reject(err); }
        else { resolve(data); }
      });
    });
  }
  endProm () {
    let self = this;
    return new MyPromise(function(resolve,reject) {
      self.con.end(function(err) {
        if(err) { reject(err); }
        else { resolve(); }
      });
    });
  }
}

let sql = new mysqlDB(config);

(() => {
  /*
  async function f() {
    let gen = function * () {
      yield '1';
      yield '2';
      yield '3';
    }
    return autoRun(gen);
  }

  async function autoRun(asyncIterator) {
    let ag = asyncIterator();
    let results = [];
    while(1) {
      let {done,value} = await ag.next();
      if(done) break;
      results.push(value);
    }
    return results;
  }

  f().then((res) => {
    log(res);
  });
  */

  async function * asyncGetData() {
    let results = [];
    while(1) {
      try {
        results.push(await sql.queryProm(`select * from ecs_users where user_id = ${yield}`));
      } catch(e) { break; };
    }
    return results;
  }

  async function * gen() {
    function * g() {
      yield '1';
      yield '2';
      yield '3';
      yield '4';
    }
    yield * g();
  }

  let g = gen();
  log(g.next());

})();
