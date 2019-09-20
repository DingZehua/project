let rewrite = require('./includes/lib_access');
let url = require('url');
let lib_base = require('./includes/lib_base');

let router = (function(args) {
  let {request : req, response : res,sql,GLOBALS,config,sessionSet,tokens} = args;
  let defaultPage = config.defaultPage.root;
  let setCookie = lib_base.setCookies(req);
  let staticPage = config.staticPage.map(path => path.replace(/\//g,'\\'));

  
  // 立即运行。
  return (async function() {
    // 对每一个请求进行处理。
    let urlObj = url.parse(req.url);
    // 路径重写
    let pathName = rewrite.rewritePath(urlObj.pathname);

    let accept = (req.headers.accept && req.headers.accept.split(',').shift()) || config.contentType.plain;
    let [contentType = null,boundary = null] = (req.headers['content-type'] && req.headers['content-type'].split('; ')) || [];
    // SESSION COOKIES GET POST
    const COOKIES = lib_base.fetchCookies(req);
    const GET = lib_base.fetchGETData(urlObj.query);
    let fetchPOSTData = lib_base.fetchPOSTDataCurring(req,contentType,boundary);
    let readPage = lib_base.readPage;
    let fileStat = lib_base.fileStat;
  
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
    let header = {};

    if(pathName !== '/') {
      ([,...paths] = pathName.split('/'));
      fileName = paths.pop();
      // /path/ /path
      if(fileName === '') {
        fileName = paths.pop();
      } 
      ({suffix,script} = splitFileName(fileName));
    } else {
      ({script,suffix} = splitFileName(defaultPage));
    }

    // TODO:对非网页进行操作
    let moduleName = `${GLOBALS.PHYSICAL_ROOT}\\${paths.join('\\')}\\${script}`;
    let fullFileName = moduleName + (suffix !== null ? '.' + suffix : '');
    // 检测脚本类型.
    const isActivePage = (function(){
            return !!(
              staticPage.every(path => !(moduleName.indexOf(path) > -1)) 
              && !(rewrite.allow.test(urlObj.pathname))
            ); 
          })();

    // 查看后缀名是不是后台语言后缀
    // 如果是程序文件，优先处理，但是访问不到则访问对应文件。
    if(suffix && config.activeFileType.some((v) => v === suffix) || // 运行服务端脚本.
      !suffix && isActivePage) { // 阻止非服务端的脚本运行.
      try {
        let SESS_ID = null;
        if(!COOKIES.SESS_ID) {
          SESS_ID = lib_base.buildSession_id();
        } else {
          SESS_ID = COOKIES.SESS_ID;
        }

        const SESSION = lib_base.buildSession(SESS_ID,sessionSet,GLOBALS.curTIME,config.session_expired);
        setCookie.set({SESS_ID},config.session_expired);
        // 加载文档.
        data = await require(moduleName)({
            fetchPOSTData,
            GET,
            COOKIES,
            sql,
            response : res,
            request : req,
            GLOBALS,
            setCookie,
            SESSION,
            token : tokens(SESS_ID,GET.token,urlObj.pathname,GET,GLOBALS.curTIME),
        });
      } catch(e) {  
        // 处理非程序文件
        if(e instanceof Error && 
          e.message.search('Cannot find module') > -1) {
          //TODO:读取文件
          let {stat,err} = await fileStat(fullFileName);
          if(err ||!stat.isFile()) {
            ({data,status} = status_404('404 - 访问丢失了'));
            contentType = config.contentType.plain;
          } else {
            generalFileName = fullFileName;
          }
          // 如果脚本没有处理上传文件的程序，那么则抛出的错误。
        } else if(e === Symbol.for('POST_EXCEPTION')) {
          ({data,status} = status_404('404 - 该页面不支持文件上传'));
          contentType = config.contentType.plain;
        // 处理重定向.
        } else if(e && e[Symbol.for('REDIRECT')]) {
          data = '重定向中...';
          status = e.status;
          header['Location'] = e.url;
          // 捕捉不到对应的处理程序.
        } else {
          throw (e);
        }
      }
    } else {
      let {stat,err} = await fileStat(fullFileName);
      if(err ||!stat.isFile()) {
        ({data,status} = status_404('404 - 访问丢失了 - 未能找到文件'));
      } else {
        if(isActivePage && suffix === 'js') { // 阻止访问服务端脚本.
          ({data,status} = status_404('404 - 访问丢失了 - 服务端脚本'));
        } else {
          // 处理非程序文件
          generalFileName = fullFileName;
        }
        if(suffix && config.fileMimeType[suffix]) {
          // 设置文件对应的mime格式.
          contentType = config.fileMimeType[suffix];
        } else {
          contentType = config.contentType.plain;
        }
      }
    }
    //如果是表单提交那么则回成网页模式
    if(config.formSubmitType.some(type => type === contentType)) {
      contentType = config.contentType.html;
    }

    header['set-Cookie'] = setCookie._build();
    header['content-type'] = contentType + ';charset=utf-8;';

    // TODO:data模板操作。
    return {data,status,header,generalFileName};
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

  function status_404(msg) {
    return {
      data : msg,
      status : '404'
    }
  }

  
});

try{(module && (module.exports = router));}
catch(e){}