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
  pc   : 'terminal/pc',
  mobile : 'terminal/mobile',
  server : '.'
}
config.access = {
  allow : ['^/js/base.js$','^/js/structor.js$','^/js/base.js$','^/js/base.js$','^/js/dom.js$','^/js/myjs1.4.js$','^/' + config.path.pc + '/'],
  deny  : ['^/server.js$','^/$']
}
config.server = {
  host : '192.168.0.14',
  port : '80'
}
try{(module && (module.exports = config));}
catch(e){}