
let index = (function(args){
  let {fetchPOSTData,GET,sql,response : res,request : req ,GLOBALS,COOKIES,setCookie,SESSION} = args;
  let lib_base = require(GLOBALS.PHYSICAL_ROOT + '\\includes\\lib_base');
  let readPage = lib_base.readPage;
  let fileStat = lib_base.fileStat;
  return (async function(){

    if(!SESSION.userName) { SESSION.userName = 'ZhangSan'; }
    if(SESSION.isExist()) {
      console.log(SESSION.userName);
      SESSION.destroy();
      console.log(SESSION.isExist());
    }
    return await readPage(__dirname + '\\index.html');
  }());
})

try{(module && (module.exports = index));}
catch(e){}