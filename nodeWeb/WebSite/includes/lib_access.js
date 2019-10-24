
let config = require('../config');
let lib_base = require('./lib_base');
let rewrite = {};
let {path:configPath,access,defaultPage} = config;
let allow = lib_base.uniquePath(access.allow);   // 排除掉空元素和重复元素 
let deny = lib_base.uniquePath(access.deny);     // 排除掉空元素和重复元素
let urlParse = require('querystring');

function rewritePath(pathName) {
  // 对url进行解码.
  pathName = urlParse.unescape(pathName);

  // 拒绝在未授权下对根目录进行访问。
  if(deny.test(pathName) || !allow.test(pathName)) {
    pathName = configPath.pc + pathName;
  }
  if(pathName === configPath.pc + '/') {
    pathName += defaultPage.pc;
  }

  //处理app页面
  config.appPage.every((path) => {
    if(typeof path === 'undefined' || path === '' || path === null ) {
      throw new Error('path 必须是一个不为空的字符串或是正则表达式');
    }
    let regStr = '';
    if(path instanceof RegExp) {
      regStr = `(.*)(${path.source})(.*)`;
    } else if(typeof path === 'string' || path instanceof String){
      regStr = `(.*)(${path.split('/').join('\\/')})(\\/?.*)`;
    } else {
      throw new Error('path 必须是一个不为空的字符串或是正则表达式');
    }
    
    let matchedArr = new RegExp(regStr,'g').exec(pathName);
    if(matchedArr) {
      pathName = matchedArr[1] + matchedArr[2];
      return false;
    }
    return true;
  });

  return pathName;
}

rewrite.rewritePath = rewritePath;
rewrite.allow = allow;
rewrite.deny = deny;

try{(module && (module.exports = rewrite));}
catch(e){}