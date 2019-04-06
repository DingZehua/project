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
   * @param {sql} str 
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
  let autoRun = function(g) {
    return new MyPromise((resolve,reject) => {
      if(typeof g === 'function') g = g();
      if(!g || typeof g.next !== 'function') return resolve(g);
      success();
      function success(res) {
        let ret = null;
        try {
          ret = g.next(res);
        } catch(e) {
          return reject(e);
        }
        next(ret);
      }

      function failed(err) {
        let ret = null;
        try {
          ret = g.throw(err);
        } catch(e) {
          return reject(e);
        }
        next(ret);
      }
      function next(ret) {
        if(ret.done) return resolve(ret.value);
        MyPromise.resolve(ret.value).then(success,failed);
      }
    });
  }
  //let start = main();
  //autoRun(start);

  async function main() {
    /*
    let ids = ['50"','56','80','2'];
    let row = null;
    for(let item of ids) {
      try {
        log('select user_name from ecs_users where id = ' + item);
        [row] = await sql.queryProm('select * from ecs_users where user_id = ' + item);
        
        if(row) {
          break;
        }
      } catch(e) {log(e);}
    }
    
    log(JSON.stringify(row));

    let fns = [
    function sum1() {
      return 20 * 20;
    },
    function sum2() {
      throw Error('failed');
    },
    function sum3() {
      return 10 * 10;
    }
    ];
    */
    let getUserNames = ['50','60','51','62'].map((id) =>{ return sql.queryProm(`select user_name from ecs_users where user_id = ${id} ` ) })

    let print = getUserNames.reduce(
      function(pre,cur) {
        return pre.then(function(){
          return cur;
        }).then(function(text) {
          log(text);
        })
      },MyPromise.resolve(456)
    );
    
    
    //log(arr);

    //log(await print);
    
    //let userNames = await MyPromise.all(getUserNames);
    /*function(prom,preProm) {
        return prom.then(function(data) {
          return preProm.then(function(){
            return log(data);
          })
        });
      }
    
    //log('userNames:',userNames);

    let ret = null;

    let p = null;
    for(let i = 0; i < 3; i++) {
      p = MyPromise.resolve(p).then(function(compute){
        ret = compute;
        return fns[i]();
      });
    }
    return p.then(function(){return ret},function(){return ret});
    */
    //await sql.endProm();
    //return new MyPromise(function(s){s('end sql');});
  }
  main();
})();

/*
async function waitMsg(s) {
  return new MyPromise(function(res,rej){
    setTimeout(res,s);
  });
};

async function Print(ms,value) {
  await waitMsg(ms);
  log(value);
}

Print(50,'Hello World!~');

async function timeout(ms) {
  await new MyPromise(function(resolve) {
    setTimeout(resolve,ms);
  });
}

Print(50,'hello World!')

*/