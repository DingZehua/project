
let page = (function(args){
  let {fetchPOSTData,GET,sql,response : res,request : req ,GLOBALS,COOKIES,SESSION} = args;
  let lib_base = require(GLOBALS.PHYSICAL_ROOT + '\\includes\\lib_base');
  let readPage = lib_base.readPage;
  let fileStat = lib_base.fileStat;
  return (async function(){
    let POST = await fetchPOSTData();
    console.log(POST,GET);
    return await readPage(__dirname + '\\login.html');
  }());
})

try{(module && (module.exports = page));}
catch(e){}