let http = require('http');
let config = require('./config');
let {mysql : mysqlDB} = require('./includes/sql');
let log = console.log.bind(console.log);
let {[Symbol.for('server')] : serverConfig,mysql : mysqlConfig} = config;

// 创建服务器
let server = http.createServer();
server.on('request',main);
server.listen(serverConfig.port,serverConfig.hostName);
log(`http server runing at http://${serverConfig.hostName}`);

// mysql数据库
let sql = new mysqlDB(mysqlConfig);

// SESSION
const SESSION = {};

// 得到请求。
function main(req,res) {

  let {...GLOBALS} = require('./constant').time;
  GLOBALS.PHYSICAL_ROOT = process.cwd();          // 物理路径
  GLOBALS.TIME = new Date().getTime();

  
  async function response(request,response,sql,GLOBALS,config) {
    let {data,status,contentType,cookies} = await require('./router')({request,response,sql,GLOBALS,config});
    res.writeHead(status,{
      "content-type":`${contentType};charset=utf-8`,
      'Set-Cookie': cookies
    });
    res.write(data);
    res.end();
  }
  response(req,res,sql,GLOBALS,config).catch((err) => {
    log(err);
    res.writeHead(404);
    res.end('404');
  });
};