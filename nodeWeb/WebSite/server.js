
process.on('uncaughtException',(err) => {
  console.log('Global error:',err);
});

let http = require('http');
let config = require('./config');
let {mysql : mysqlDB} = require('./includes/sql');
let log = console.log.bind(console.log);
let {[Symbol.for('server')] : serverConfig,mysql : mysqlConfig} = config;
let fs = require('fs');


// 创建服务器
let server = http.createServer();
server.on('request',main);
server.listen(serverConfig.port,serverConfig.hostName);
log(`http server runing at http://${serverConfig.hostName}`);

// mysql数据库
let sql = new mysqlDB(mysqlConfig);

// SESSION
const sessionSet = new (require('./session'))(config.session_expired);
const Session = sessionSet.constructor;
const sessionClearTake = Session.clearExpired(sessionSet);
// token
const tokens = require('./includes/lib_base').createToken(config.token_number,config.token_expired);
// 捕捉全局错误.

// 得到请求。
function main(req,res) {
  let {...GLOBALS} = require('./constant').time;
  GLOBALS.PHYSICAL_ROOT = process.cwd();          // 物理路径
  GLOBALS.curTIME = new Date().getTime();
  if(parseInt((Math.random() * 10)) === 1) {
    sessionClearTake.next(GLOBALS.curTIME);
  }


  async function response(request,response,sql,GLOBALS,config,sessionSet,tokens) {
    let {data,status,header,generalFileName} = await require('./router')({
      request,
      response,
      sql,
      GLOBALS,
      config,
      sessionSet,
      tokens
    });

    res.writeHead(status,header);
    if(data !== null) {
      res.write(data);
      res.end();
    } else {
      // 处理非脚本文件，例如:css,js和image图片.
      fs.createReadStream(generalFileName).pipe(res);
    }
    
  }
  response(req,res,sql,GLOBALS,config,sessionSet,tokens).catch((err) => {
    log('error:',err);
    res.writeHead(404);
    res.end('404');
  });
};
/*
* 
 * TODO:
 * --1.SESSION怎么销毁最有效率.
 * --2.非程序文件或找不到对应的处理程序的请求用pipe管道.
 * --3.文件下载功能. 
 * 3.1.怎么防止重复表单或文件.
 * 4.文件读取是瓶颈.
 */