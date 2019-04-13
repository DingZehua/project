let fileType = ['html','htm','php','jsp','asp','aspx'];
let rewrite = require('./includes/lib_access');
let url = require('url');
let lib_base = require('./includes/lib_base');

let router = (function(args) {
  let {request : req, response : res,sql,GLOBALS,config} = args;
  let defaultPage = config.defaultPage.root;
  let setCookie = lib_base.setCookies(req);

  // 立即运行。
  return (async function() {
    // 对每一个请求进行处理。
    let urlObj = url.parse(req.url);
    // 路径重写
    let pathName = rewrite.rewritePath(urlObj.pathname);

    let accept = req.headers.accept.split(',')[0];
    let [contentType = null,boundary = null] = (req.headers.contentType && req.headers.contentType.split('; ')) || [];

    // SESSION COOKIES GET POST
    let fetchCookies = lib_base.fetchCookies;
    let fetchGETData = lib_base.fetchGETData;
    let fetchPOSTData = lib_base.fetchPOSTDataCurring(req,contentType,boundary);
    let readPage = lib_base.readPage;
    let fileStat = lib_base.fileStat;

    if(req.method === 'GET' || req.method === 'POST') {
      if(!contentType) {
        // 处理普通访问
        if(accept === '*/*') contentType = 'text/html';
        else { contentType = accept; }
      } else {
        // AJAX
        if(accept === '*/*' || accept === 'appliction/json') {
          contentType = 'appliction/json';
          // 表单访问
        } else {
          if(contentType === 'multipart/form-data') {
            return {
              status : 404,
              page : '404 - 暂不支持文件上传',
              contentType : 'text/plain'
            };
          }
          contentType = 'text/html';
        }
      }
    } else {
      return {
        status : 404,
        page : '404 - 不支持此方法的调用',
        contentType : 'text/plain'
      };;
    }

    
    let data = null;
    let status = 200;

    let paths = [];
    let fileName;
    let script,suffix;
    if(pathName !== '/') {
      ([,...paths] = pathName.split('/'));
      fileName = paths.pop();
      // /path/ /path
      if(fileName !== '') {
        ({suffix,script} = splitFileName(fileName));
      } else {
        suffix = null;
        script = paths.pop();
      }
    } else {
      ({script,suffix} = splitFileName(defaultPage));
    }


    let moduleName = `${GLOBALS.PHYSICAL_ROOT}\\${paths.join('\\')}\\${script}`;
    let fullFileName = moduleName + ('.' + suffix || '');
    // 查看后缀名是不是后台语言后缀
    if(suffix && fileType.some((v) => v === suffix) || !suffix) {
      try {
        // 加载文档.
        data = await require(moduleName)({
            fetchPOSTData:fetchPOSTData,
            GET : fetchGETData(urlObj.query),
            COOKIES : fetchCookies(req),
            sql,
            response : res,
            request : req,
            GLOBALS,
            setCookie
        });
        status = 200;
      } catch(e) {
        if(e instanceof Error && 
          e.message.search('Cannot find module') > -1) {
          //TODO:读取文件
          let {stat,err} = await fileStat(fullFileName);
          if(err ||!stat.isFile()) {
            data = '404 - 访问丢失了';
            status = 404;
            contentType = 'text/plain';
          } else {
            data = await readPage(fullFileName);
          }
          // 如果脚本没有处理上传文件的程序，那么则抛出的错误。
        } else if(e === Symbol.for('POST_EXCEPTION')) {
          data = '404 - 该站点不支持文件上传';
          status = 404;
          contentType = 'text/plain';
        } else {
          throw (e);
        }
      }
    } else {
      let {stat,err} = await fileStat(fullFileName);
      if(err ||!stat.isFile()) {
        data = '404 - 访问丢失了';
        status = 404;
      } else {
        data = await readPage(fullFileName);
      }
      contentType = 'text/plain';
    }

    // data模板操作。
    
    return {data,status,contentType,cookies : setCookie._build()};
  })();
  
  function splitFileName(fileName) {
    let result = {};
    let lastIndex = fileName.lastIndexOf('.');
    if(lastIndex > 0) {
      result.script = fileName.slice(0,lastIndex);
      result.suffix = fileName.slice(lastIndex + 1);
    } else {
      result.script = fileName;
      result.suffix = null;
    }
    return result;
  }

});

try{(module && (module.exports = router));}
catch(e){}