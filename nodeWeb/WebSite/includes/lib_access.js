
let {path:configPath,access,defaultPage} = require('../config');
let lib_base = require('./lib_base');
let rewrite = {};
let allow = lib_base.uniquePath(access.allow);   // 排除掉空元素和重复元素 
let deny = lib_base.uniquePath(access.deny);     // 排除掉空元素和重复元素


function rewritePath(pathName) {
  if(deny.test(pathName) || !allow.test(pathName)) {
    pathName = configPath.pc + pathName;
  }
  if(pathName === configPath.pc + '/') {
    pathName += defaultPage.pc;
  }
  return pathName;
}

rewrite.rewritePath = rewritePath;
rewrite.allow = allow;
rewrite.deny = deny;

try{(module && (module.exports = rewrite));}
catch(e){}