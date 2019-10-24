
let index = (function(args){
  const {fetchPOSTData,GET,sql,response : res,request : req ,GLOBALS,COOKIES,setCookie,SESSION,token} = args;
  let lib_base = require(GLOBALS.PHYSICAL_ROOT + '\\includes\\lib_base');
  let readPage = lib_base.readPage;
  let fileStat = lib_base.fileStat;
  return (async function(){
    let data = null;
    if(GET.findType === 'list') {
      let size = GET.size ? GET.size : 20;
      let category_id = GET.category_id !== void 0 ? GET.category_id : 0;
      let page = GET.page ? GET.page : 1;
      let start = size * (page - 1);
      data = JSON.stringify(await 
        sql.queryProm(`SELECT goods_name as name,goods_thumb as img_url,goods_brief as brief FROM ecs_goods limit ${start},${size}`)
      );
      console.log(`SELECT goods_name as name,goods_thumb as img_url,goods_brief as brief FROM ecs_goods limit ${start},${size}`);
    }
    return data;
  }());
})

try{(module && (module.exports = index));}
catch(e){}