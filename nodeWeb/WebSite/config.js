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
            '^/js/dom.js$','^/js/myjs1.4.js$','^' + config.path.pc + '/?','^/upload/','^/test','^/js/myjs1.5.js$'],
  deny  : ['^/server.js$','^/$']
}
// 网站配置参数
config[Symbol.for('server')] = {
  hostName : '192.168.0.14',
  port : '80'
}

// 默认页
config.defaultPage = {
  root : 'index.html',
  pc : 'index.html',
}

// app页面，本页面以及子页面都导向本页面例如,app为本页面,location/app、location/app/nav、location/app/nav/goods都导向location/app.
// 正则表达式或字符串
config.appPage = [
  config.path.pc + '/app/' + '[^/]*/?',config.path.pc + '/app'
];

// 该路径下的js文件不在服务器运行.
config.staticPage = [config.path.pc + '/js/'];

// 服务端处理程序.
config.activeFileType = ['html','htm','php','jsp','asp','aspx'];
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
  'image/x-icon',
  '*/*'
];
config.contentType.html = 'text/html';
config.contentType.css = 'text/css';
config.contentType.plain = 'text/plain';
config.contentType.script = 'appliction/javascript';
config.contentType.json = 'appliction/json';
config.contentType.unknow = '*/*';
config.contentType.octet = 'application/octet-stream';
config.contentType.txt = 'text/plain';
config.contentType.xIcon = 'image/x-icon';

config.token_expired = 60 * 5;
config.token_number = 2000;

config.fileMimeType = {
  'js' : 'text/javascript',
  'css' : config.contentType.css,
  'txt' :  config.contentType.txt,
  'html' : config.contentType.html,
  'json' : config.contentType.json,
};


Object.freeze(config);

try{(module && (module.exports = config));}
catch(e){}