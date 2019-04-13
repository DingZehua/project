
let {path:configPath,access,defaultPage} = require('../config');
let rewrite = {};
let allow = new RegExp([...new Set(access.allow.filter(function(x){return x;}))]   // 排除掉空元素和重复元素
                            .join('|')   
                            .replace(/\\/g,''.padStart(2,'\\'))
                            .replace(/\//g,''.padStart(2,'\\//'))
                            .replace(/[.]/g,'[.]')
                            .replace(/[\[]([\\\.])[\]]/g,'.') ||
                            /[^\s\S]*/,'i'
                        );
let deny = new RegExp([...new Set(access.deny.filter(function(x){return x;}))]     // 排除掉空元素和重复元素
                        .join('|')   
                        .replace(/\\/g,''.padStart(2,'\\'))
                        .replace(/\//g,''.padStart(2,'\\//'))
                        .replace(/[.]/g,'[.]')
                        .replace(/[\[]([\\\.])[\]]/g,'.') ||
                        /[^\s\S]*/,'i'
                    );

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

try{(module && (module.exports = rewrite));}
catch(e){}