let rewrite = require('./includes/lib_access');
let url = require('url');
let lib_base = require('./includes/lib_base');

let router = (function(args) {
  let {request : req, response : res,sql,GLOBALS,config,sessionSet} = args;
  let defaultPage = config.defaultPage.root;
  let setCookie = lib_base.setCookies(req);

  // 立即运行。
  return (async function() {
    // 对每一个请求进行处理。
    let urlObj = url.parse(req.url);
    // 路径重写
    let pathName = rewrite.rewritePath(urlObj.pathname);

    let accept = (req.headers.accept && req.headers.accept.split(',')[0]) || config.contentType.plain;
    let [contentType = null,boundary = null] = (req.headers['content-type'] && req.headers['content-type'].split('; ')) || [];
    // SESSION COOKIES GET POST
    const COOKIES = lib_base.fetchCookies(req);
    const GET = lib_base.fetchGETData(urlObj.query);
    let fetchPOSTData = lib_base.fetchPOSTDataCurring(req,contentType,boundary);
    let readPage = lib_base.readPage;
    let fileStat = lib_base.fileStat;
    // TODO:判断SESS_ID
    let SESS_ID = null;
    if(!COOKIES.SESS_ID) {
      SESS_ID = lib_base.buildSession_id();
    } else {
      SESS_ID = COOKIES.SESS_ID;
    }

    const SESSION = lib_base.buildSession(SESS_ID,sessionSet,GLOBALS.curTIME,config.session_expired);

    // 取得访问方法和accept.
    if(req.method === 'GET' || req.method === 'POST') {
      if(!contentType) {
        // 处理普通访问
        if(accept === config.contentType.unknow) contentType = config.contentType.html;
        else { contentType = accept; }
      } else {
        // AJAX
        if(accept === config.contentType.unknow || accept === config.contentType.json) {
          contentType = config.contentType.json;
        }
      }
    } else {
      return {
        status : 404,
        page : '404 - 不支持此方法的调用',
        contentType : config.contentType.plain
      };;
    }

    let data = null;
    let status = 200;
    let paths = [];
    let fileName;
    let script,suffix;
    let generalFileName = null;

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

    // TODO:对非网页进行操作
    let moduleName = `${GLOBALS.PHYSICAL_ROOT}\\${paths.join('\\')}\\${script}`;
    let fullFileName = moduleName + ('.' + suffix || '');
    // 查看后缀名是不是后台语言后缀
    // 如果是程序文件，优先处理，但是访问不到则访问对应文件。
    if(suffix && config.fileType.some((v) => v === suffix) || !suffix) {
      try {
        // 加载文档.
        data = await require(moduleName)({
            fetchPOSTData:fetchPOSTData,
            GET,
            COOKIES,
            sql,
            response : res,
            request : req,
            GLOBALS,
            setCookie,
            SESSION
        });
      } catch(e) {
        if(e instanceof Error && 
          e.message.search('Cannot find module') > -1) {
          //TODO:读取文件
          let {stat,err} = await fileStat(fullFileName);
          if(err ||!stat.isFile()) {
            data = '404 - 访问丢失了';
            status = 404;
            contentType = config.contentType.plain;
          } else {
            // 处理非程序文件
            generalFileName = fullFileName;
          }
          // 如果脚本没有处理上传文件的程序，那么则抛出的错误。
        } else if(e === Symbol.for('POST_EXCEPTION')) {
          data = '404 - 该页面不支持文件上传';
          status = 404;
          contentType = config.contentType.plain;
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
        // 处理非程序文件
        generalFileName = fullFileName;
      }
      contentType = config.contentType.plain;
    }

    //如果是表单提交那么则回成网页模式
    if(config.formSubmitType.some((type) => { return type === contentType; })) {
      contentType = config.contentType.html;
    }

    setCookie.set({SESS_ID},config.session_expired);
    // TODO:data模板操作。
    return {data,status,contentType,cookies : setCookie._build(),generalFileName};
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