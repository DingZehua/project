
let index = (function(args){
  let {fetchPOSTData,GET,sql,response : res,request : req ,GLOBALS,COOKIES,setCookie,SESSION,token} = args;
  let lib_base = require(GLOBALS.PHYSICAL_ROOT + '\\includes\\lib_base');
  let readPage = lib_base.readPage;
  let fileStat = lib_base.fileStat;
  const pageDir = __dirname + '\\';
  const fileName = __filename.split('\\').pop();
  const StaticPage = pageDir + fileName.split('.').shift() + '.html';
  const ejs = require('ejs');

  return (async function(){
    const {files,POST} = await fetchPOSTData(true);

    console.log(files,POST);

    const page = ejs.render(await readPage(StaticPage,'utf8'),{ updated : !files.length ? false : true });
    
    return page;
  }());
});

(typeof module ==='object' && (module.exports = index)) || '';