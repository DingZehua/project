const config = {};
config.mysql = {
  host : '127.0.0.1',
  port : '3306',
  user : 'root',
  password : 'abc,123',
  database : 'db'
};
config.path = {
  root : '.',
  pc   : '/terminal/pc',
  mobile : '/terminal/mobile',
  server : '.'
}
// 如果要访问目录下的程序，请不要加上后缀名。
config.access = {
  allow : ['^/js/base.js$','^/js/structor.js$','^/js/base.js$','^/uploadFile',
            '^/js/dom.js$','^/js/myjs1.4.js$','^/' + config.path.pc + '/','^/upload/','^/test'],
  deny  : ['^/server.js$','^/$']
}
config[Symbol.for('server')] = {
  hostName : '192.168.0.14',
  port : '80'
}

config.defaultPage = {
  root : 'index.html',
  pc : 'index.html',
}

config.fileType = ['html','htm','php','jsp','asp','aspx'];

config.session_expired = 60 * 15;
/*
config.contentType = [
  'appliction/x-www-urlencoded',
  'multipart/from-data'
];
config.accept = [
  'text/html',
  'text/css',
  'text/plain',
  'appliction/javascript',
  'appliction/json',
  'image/'
];
*/

Object.freeze(config);

try{(module && (module.exports = config));}
catch(e){}