
let index = (function(args){
  let {fetchPOSTData,GET,sql,response : res,request : req ,GLOBALS,COOKIES,setCookie,SESSION,token} = args;
  let lib_base = require(GLOBALS.PHYSICAL_ROOT + '\\includes\\lib_base');
  let readPage = lib_base.readPage;
  let fileStat = lib_base.fileStat;
  const pageDir = __dirname + '\\';
  const fileName = __filename.split('\\').pop();
  const StaticPage = pageDir + fileName.split('.').shift() + '.html';

  return (async function(){
    return await readPage(StaticPage);
  }());
});

(typeof module ==='object' && (module.exports = index)) || '';