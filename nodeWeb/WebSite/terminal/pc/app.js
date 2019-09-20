let page = (function(args){
  // 尝试post 和 get
  let {fetchPOSTData,GET,sql,response : res,request : req ,GLOBALS,COOKIES,SESSION} = args;
  let lib_base = require(GLOBALS.PHYSICAL_ROOT + '\\includes\\lib_base');
  let readPage = lib_base.readPage;
  let fileStat = lib_base.fileStat;
  const pageDir = __dirname + '\\';
  return (async function(){
    return await readPage(pageDir + 'app.html');
  }());
})

try{(module && (module.exports = page));}
catch(e){}