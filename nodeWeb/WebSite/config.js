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
            '^/js/dom.js$','^/js/myjs1.4.js$','^' + config.path.pc + '/?','^/upload/','^/test'],
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
// Session生存时间不能过于太短，不然token会造成无限成定向.
// 安全阈值不能低于1分钟。
// 以秒为单位.session持续时间.
config.session_expired = 60 * 15;

config.formSubmitType = [
  'application/x-www-form-urlencoded',
  'multipart/form-data'
];
config.formSubmitType['xwww'] = 'application/x-www-form-urlencoded';
config.formSubmitType.mul = 'multipart/form-data';
config.contentType = [
  'text/html',
  'text/css',
  'text/plain',
  'appliction/javascript',
  'appliction/json',
  'application/octet-stream',
  '*/*'
];
config.contentType.html = 'text/html';
config.contentType.css = 'text/css';
config.contentType.plain = 'text/plain';
config.contentType.script = 'appliction/javascript';
config.contentType.json = 'appliction/json';
config.contentType.unknow = '*/*';
config.contentType.octet = 'application/octet-stream';

config.token_expired = 60 * 5;
config.token_number = 2000;


Object.freeze(config);

try{(module && (module.exports = config));}
catch(e){}