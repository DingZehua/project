let page = (function(args){
  // 尝试post 和 get
  let {fetchPOSTData,GET,sql,response : res,request : req ,GLOBALS,COOKIES,SESSION} = args;
  let lib_base = require(GLOBALS.PHYSICAL_ROOT + '\\includes\\lib_base');
  let readPage = lib_base.readPage;
  let fileStat = lib_base.fileStat;
  const pageDir = __dirname + '\\';
  return (async function(){
    let sqlQuery = GET['sql'];
    const data = await sql.query(sqlQuery);
    return await JSON.stringify(data);
  }());
})

try{(module && (module.exports = page));}
catch(e){}