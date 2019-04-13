let mysql = require('mysql');
let {Promise:MyPromise,method : { thunkify }} = require('../js/base').base;
let sql = {};
class mysqlDB  {
  constructor (config) {
    this.con = mysql.createConnection(config);
    this.con.connect(function(){console.log('start mysql');});
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
  updateProm(table = mustParam(),
              obj  = mustParam(),
              rule = mustParam()) {
    let sql = `update ${table} set ${Object.entries(obj)
              .map(([key,value]) => {
                return `${key} = '${value}'`;
              })} `;
    sql += ' ' + rule;
    return this.queryProm(sql);
  }
  insertProm(table = mustParam(),
             data  = mustParam()) {
    let sql = `insert into ${table} 
              (${Object.keys(data)}) 
              values(${Object.values(data).map( value => `'${value}'` )}`;
    return this.queryProm(sql);
  }
  /**
   * 
   * @param {*} tableName
   * @param {*} whereSyntax 
   */
  deleteProm(table = mustParam(),rule = mustParam()) {
    let sql = `delete FROM ${table} ${rule}`;
    return this.queryProm(sql);
  }
  /**
   * @return {Object} Object
   */
  getRow(sql) {
    if(sql.search(/\s+limit\s+\d+(,\d+)?/) < 0) {
      sql += ' limit 1';
    }
    return this.queryProm(sql).then((res) => res[0]);
  }
}

function mustParam() {
  throw Error('必须有赋值参数');
}

sql.mysql = mysqlDB;

try{(module && (module.exports = sql));}
catch(e){}