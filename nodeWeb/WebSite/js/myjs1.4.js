var namespace = function () {
  getEle.call(this);
  if (typeof HTMLElement !== 'undefined') {
    (function (_this) {
      if (typeof HTMLElement.getIdEle === 'undefined') {
        HTMLElement.prototype.getClassEles = _this.chaining_getClass;
        HTMLElement.prototype.getTagNameEles = _this.chaining_getTag;
      }
    }(this));
  }
  this.remove_myGetEle = function () {
    delete HTMLElement.prototype.getClassEles;
    delete HTMLElement.prototype.getTagNameEles;
  };
  this.constructor = namespace;
  this.css = {
    'removeClassName': function (str, ClassName) {
      var strArr = str.split(' ');
      var returnStr = '';
      for (var i = 0; i < strArr.length; i++) {
        if (strArr[i] !== ClassName) {
          if (returnStr !== '') {
            returnStr = strArr[i];
          }
          else {
            returnStr += ' ' + strArr[i];
          }
        }
      }
      return returnStr;
    },
    'removeClass': function (obj, ClassName) {
      try {
        obj.classList.remove(ClassName);
      }
      catch (e) {
        obj.className = this.removeClassName(obj.className, ClassName);
      }
    },
    'addClass': function (obj, ClassName) {
      try {
        obj.classList.add(ClassName);
      }
      catch (e) {
        obj.className += ' ' + ClassName;
      }
    },
    'removeAttr': function (ele, attrName) {
      ele.removeAttribute(attrName);
    },
    'disable_ele': function (ele) {
      ele.disabled = 'disabled';
    },
    'enable_ele': function (ele) {
      this.removeAttr(ele, 'disabled');
    }
  };
  this.size = {
    'swb': function (ele) {
      try { return ele.clientWidth; }//获取内容的宽度，包含border的宽度
      catch (e) { console.log(e); }
    },
    'shb': function (ele) {
      try { return ele.clientHeight; }//获取内容的高度，包含border的宽度
      catch (e) { console.log(e); }
      //window对象:不包括浮动元素[float]
    },
    'sw': function (ele) {
      try { return ele.offsetWidth; }//获取内容的宽度(不包括隐藏)，包含border的宽度
      catch (e) { console.log(e); }
    },
    'sh': function (ele) {
      try { return ele.offsetHeight; }//获取内容的高度(不包括隐藏)，包含border的宽度
      catch (e) { console.log(e); }
    },
    'cw': function (ele) {
      try { return ele.scrollWidth; }//获取标签内的宽度
      catch (e) { console.log(e); }
    },
    'ch': function (ele) {
      try { return ele.scrollHeight; }//获取标签内的高度
      catch (e) { console.log(e); }
    },
    'spt': function () {
      try { return window.screenTop; }//获取浏览器顶部的坐标
      catch (e) { console.log(e); }
    },
    'spl': function () {
      try { return window.screenLeft; }//获取浏览器左部的坐标
      catch (e) { console.log(e); }
    },
    'ht': function (ele) {
      try { return ele.scrollTop; }//获取隐藏的高
      catch (e) { console.log(e); }
    },
    'hl': function (ele) {
      try { return ele.scrollLeft; }//获取隐藏的右边
      catch (e) { console.log(e); }
    },
    'sah': function () {
      try { return window.screen.availHeight; }//屏幕可用工作区高度
      catch (e) { console.log(e); }
    },
    'saw': function () {
      try { return window.screen.availWidth; }//屏幕可用工作区宽度
      catch (e) { console.log(e); }
    }
  };
  this.common = {
    'remove_string': function (value) {
      return value.replace(/[^0-9]+/, '');
    },
    'check_number': function (value) {
      return /^[0-9]+[.]?[0-9]*$/.test(value);
    },
    'empty': function (obj) {
      if (obj === undefined) {
        return true;
      }
      if (typeof obj === 'object') {
        if (obj === null) {
          return true;
        }
        if (typeof obj.length === 'number') {
          if (obj.length > 0) {
            return false
          }
          return true;
        }
        for (var key in obj) {
          return false;
        }
        return true;
      }
      if (typeof obj === 'string') {
        if (obj !== '' && obj !== '0' && obj !== 'null' && obj !== 'undefined') {
          return false;
        }
        return true;
      }
      if (obj.constructor === Number) {
        if (obj === 0 || isNaN(obj)) {
          return true;
        }
      }
      return false;
    },
    'getIdEle': function (id) {
      return document.getElementById(id);
    },
    'getClassEles': function (className) {
      if (typeof document.getElementsByClassName !== 'undefined') {
        return document.getElementsByClassName(className);
      }
      else {
        var classNodes = Array();
        var dom = this.getTagNameEles('*');
        for (var i = 0; i < dom.length; i++) {
          if (dom[i].className.indexOf(className) > -1) {
            classNodes.push(dom[i]);
          }
        }
        return classNodes;
      }
    },
    'getClassEle': function (className) {
      return this.getClassEles(className)[0];
    },
    'getNameEles': function (Name) {
      return document.getElementsByName(Name);
    },
    'getNameEle': function (Name) {
      return this.getNameEles(Name)[0];
    },
    'getTagNameEles': function (TagName) {
      return document.getElementsByTagName(TagName);
    },
    'getTagNameEle': function (TagName) {
      return this.getTagNameEles(TagName)[0];
    },
    'getThisEle': function (ele, _event) {
      _event = this.getEvent(_event);
      if (ele !== window) {
        return ele;
      }
      else {
        ele = _event.srcElement || _event.target;
        return ele;
      }
    },
    'getTarget': function (_event) {
      return _event.srcElement || _event.target;
    },
    'get_pre': function (el) {
      var node = el.previousSibling;
      return node.nodeName !== '#text' ? node : node.previousSbiling;
    },
    'get_next': function (el) {
      var node = el.nextSibling;
      return node.nodeName !== '#text' ? node : node.nextSibling;
    },
    'get_text': function (el) {
      return el.innerText || el.textContent;
    },
    'g': function (str) {
      if (!/[#.>:@]|\s/.test(str)) {
        return document.getElementById(str);
      }
      else if (/^[#][a-zA-Z0-9_\-]+$/.test(str)) {
        return document.querySelector(str);
      }
      else {
        str = str.replace(/@/g, '');
        return document.querySelectorAll(str);
      }
    },
    '$': function (str) { return this.g(str); },
    'RemoveArrDuplicate': function (arr) {
      for (var i = 0; i < arr.length; i++) {
        for (var j = i; j < arr.length; j++) {
          var nextJ = j + 1;
          if (nextJ >= arr.length) {
            break;
          }
          else {
            if (arr[i] === arr[nextJ]) {
              arr.splice(nextJ, 1);
              j--;
            }
          }
        }
      }
      return arr;
    },
    'createNode': function (EleName, id, className, text) {
      var Node = document.createElement(EleName);
      var id = id || '';
      var className = className || '';
      if (!this.empty(text)) {
        this.appendNode(Node, this.createTextNode(text));
      }
      Node.id = id;
      Node.className = className;
      return Node;
    },
    'createTextNode': function (text) {
      return document.createTextNode(text);
    },
    'addTag': function (ele, eleName, id, className) {
      ele.appendChild(this.createNode(eleName, id, className));
    },
    'appendNode': function (ele, childNode) {
      (childNode !== undefined && childNode !== null) ? ele.appendChild(childNode) : '';
    },
    'BeforeNode': function (el, child, i) {
      var i = i || 0;
      el.insertBefore(child, this.getChildNodes(el)[i]);
    },
    'getParentEle': function (obj) {
      return obj.parentNode || obj.parentElement;
    },
    'getChildNodes': function (obj, text_node_delete) {
      var text_node_delete = typeof text_node_delete === 'boolean' ? text_node_delete : false;
      var objNodes = obj.childNodes;
      if (text_node_delete) {
        this.deleteTextEle(obj, objNodes);
      }
      return objNodes;
    },
    'getTableEle': function (ele, section) {
      if (typeof ele !== 'object') {
        return false;
      }
      if (ele === '[object HTMLTableElement]') {
        section = section || 'tbody';
        var table = ele.getElementsByTagName(section)[0];
        return table;
      }
    },
    'getTableRowsEle': function (ele, section) {
      section = section || 'tbody';
      if (typeof ele !== 'object') {
        return false;
      }
      if (typeof ele === '[object HTMLTableElement]') {
        ele = this.getTableEle(ele, section);
      }
      if (typeof ele === '[object HTMLTableSectionElement]') {
        return this.getChildNodes(ele, true);
      }
      if (typeof ele === '[object NodeList]') {
        return ele;
      }
    },
    'deleteTextEle': function (parent, childs) {
      if (childs === undefined) {
        childs = this.getChildNodes(parent);
      }
      for (var i = 0; i < childs.length; i++) {
        if (childs[i].nodeName === '#text') {
          parent.removeChild(childs[i]);
          i--;
        }
      }
    },
    'remove_childNode': function (parent, child) {
      parent.removeChild(child);
    },
    'ele_delete': function (ele) {
      var parent = this.getParentEle(ele);
      parent.removeChild(ele);
    },
    'deep_ele_delete': function (el) {
      var cns = this.getChildNodes(el);
      for (var i = (cns.length - 1); i > 0; i--) {
        if (cns[i].nodeName !== '#text') {
          this.deep_ele_delete(cns[i]);
        }
        else {
          this.ele_delete(cns[i]);
        }
      }
      this.ele_delete(el);
    },
    'ajax': function (data, url, callback, sendType, dataName, async) {
      if (!url) { return; }
      var sendType = sendType ? sendType.toUpperCase() : 'GET';
      var async = async || true;
      var callback = callback || function () { };
      var xmlhttp = null;
      if (window.XMLHttpRequest) { xmlhttp = new XMLHttpRequest(); }
      else { xmlhttp = new ActiveXObject('Microsolft.XMLHTTP'); }

      var sendData = '';
      if (typeof data === 'string' || typeof data === 'number') {
        if (dataName === void 0 || typeof dataName !== 'string' || dataName === '') { sendData = 'jsonData' + '=' + data; }
        else { sendData = dataName + '=' + data; }
      }
      else {
        if (dataName === void 0 || typeof dataName !== 'string' || dataName === '') {
          for (var key in data) {
            sendData += '&' + key + '=' + data[key];
          }
        }
        else {
          for (var key in data) {
            sendData += '&' + dataName + '[' + key + ']=' + data[key];
          }
        }
        sendData[0] = '';
      }
      if (sendType === 'GET') {
        if (url.indexOf('?') < 0) { url += '?' + sendData; }
        else { url += '&' + sendData; }
      }

      xmlhttp.open(sendType, url, async);
      if (sendType === 'POST') {
        xmlhttp.setRequestHeader('accept', 'appliction/json');
        xmlhttp.repsonseType = 'json';
      }

      if (sendType === 'POST') xmlhttp.send(sendData);
      else xmlhttp.send();

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState === 4) {
          if (xmlhttp.status === 414) {
            throw ('url length size exceed limit');
          }
          else if (xmlhttp.status === 200) {
            callback instanceof Function ? callback.call(xmlhttp, xmlhttp.responseText) : '';
          }
        }
      }
      return xmlhttp;
    },
    'ajax_send': function (type, dataType, jsonData, uri, F_success, _async, F_error) {
      _async = typeof _async !== 'undefined' ? _async : true;
      type = typeof type !== undefined ? type : 'post';
      dataType = typeof dataType !== undefined ? dataType : 'text';
      F_error = typeof F_error !== undefined ? F_error : function () { alert('error') };
      var result;
      result = $.ajax({
        'type': type,
        'dataType': dataType,
        'data': { 'jsonData': jsonData },
        'url': uri,
        'success': F_success,
        'error': F_error,
        'async': _async
      });
      return result;
    },
    'ajax_post_send': function (jsonData, uri, F_success, _async) {
      var result;
      _async = typeof _async !== 'undefined' ? _async : true;
      //result =  this.ajax_send('post','text',jsonData,uri,F_success,_async);
      result = this.ajax(jsonData, uri, F_success, 'POST', '', _async);
      return result.responseText;
    },
    'ajax_get_send': function (jsonData, uri, F_success, _async) {
      var result;
      _async = typeof _async !== 'undefined' ? _async : true;
      //result =   this.ajax_send('get','text',jsonData,uri,F_success,_async);
      result = this.ajax(jsonData, uri, F_success, 'GET', '', _async);
      return result.responseText;
    },

    'bind_arr_event': function (ele, event_name, F_Object) {
      if (typeof ele === undefined || event_name === '') {
        return false;
      }

      if ((ele.constructor === NodeList || ele instanceof Object) && typeof ele.length !== 'undefined') {
        for (var i = 0; i < ele.length; i++) {
          this.bind_event(ele[i], event_name, F_Object);
        }
      }
      else {
        this.bind_event(ele, event_name, F_Object);
      }
    },
    'bind_event': function (obj, event_name, F_Object, capture_bool) {
      //IE10会保留 addEventListener 和 attachEvent
      if (typeof obj === 'undefined' || obj === null)
        return false;
      var capture_bool = typeof capture_bool === 'boolean' ? capture_bool : false;
      if (typeof obj.addEventListener !== 'undefined') {
        obj.addEventListener(event_name, F_Object, capture_bool);
      }
      else {
        obj.attachEvent('on' + event_name, F_Object);
      }
    },
    bind: function (obj, event_name, F_Object, capture_bool) {
      this.bind_event.apply(this, Array.prototype.slice.call(arguments, 0));
    },
    'freed_event': function (obj, event_name, F_Object, capture_bool) {
      if (typeof obj === undefined || obj === null) return false;
      capture_bool = typeof capture_bool === 'boolean' ? capture_bool : false;
      if (typeof obj.removeEventListener !== 'undefined') {
        obj.removeEventListener(event_name, F_Object, capture_bool);
      }
      else {
        obj.detachEvent('on' + event_name, F_Object);
      }
    },
    'freed_arr_event': function (ele, event_name, F_Object, capture_bool) {
      if ((ele == '[object NodeList]' || ele instanceof Object) && typeof ele.length !== 'undefined') {
        for (var i = 0; i < ele.length; i++) {
          this.freed_event(ele[i], event_name, F_Object, capture_bool);
        }
      }
      else {
        this.freed_event(ele, event_name, F_Object, capture_bool);
      }
    },
    'getEvent': function (e) {
      e = e || window.event;
      return e;
    },
    'stop_event_conduct': function (e) {
      if (typeof e === 'object' && e.stopPropagation) {
        e.stopPropagation();
      }
      else {
        e.cancelBubble = true;
      }
    },
    'stop_default_event': function (e) {
      if (e.preventDefault instanceof Function) {
        e.preventDefault();
      }
      if (e.returnValue !== undefined) {
        e.returnValue = false;
      }
    },
    'toJSON': function (data) {
      var jsonData = JSON.stringify(data);
      return jsonData;
    },
    'JSONtoObj': function (jsonData) {
      return JSON.parse(jsonData);
    },
    'sort': function (obj, filed_name) {
      var image_obj = this.JSONtoObj(this.toJSON(obj));
      var arr_obj = [];
      var temp_item = [];
      var cnt = 0;
      for (var key in image_obj) {
        arr_obj[cnt] = {};
        arr_obj[cnt]['key'] = key;
        arr_obj[cnt]['sort'] = image_obj[key][filed_name];
        delete obj[key];
        cnt++;
      }

      for (var i = 0, len = arr_obj.length; i < len; i++) {
        if ((i + 1) === len)
          break;
        for (var j = i + 1; j < len; j++) {
          var a = arr_obj[i]['sort'] * 1;
          var b = arr_obj[j]['sort'] * 1;
          if (a < b) {
            temp_item = arr_obj[i];
            arr_obj[i] = arr_obj[j];
            arr_obj[j] = temp_item;
          }
        }
      }
      for (var i = 0, len = arr_obj.length; i < len; i++) {
        obj[arr_obj[i]['key']] = image_obj[arr_obj[i]['key']];
      }
    },
    'get_uri_param': function (name) {
      name = name || '';
      var uri = window.location.search.replace('?', '');
      if (uri === '' || name === '') {
        return false;
      }
      var exp = new RegExp('([?]?)([&]?)(' + name + ')([=])([^&]*)');
      var paramArr = exp.exec(uri);
      var param = paramArr !== null && paramArr !== '' ? paramArr[paramArr.length - 1] : false;
      return param;
    },
    'change_uri_param': function (name, replace_param) {
      var param = this.get_uri_param(name);
      if (param)
        window.location.search = window.location.search.replace(name + '=' + param, name + '=' + replace_param);
    },
    'deep_delete_var': function (obj) {
      for (var key in obj) {
        if (!(obj[key] instanceof HTMLElement)
          && typeof obj[key] !== 'string'
          && !(obj[key] instanceof String)) {
          this.deep_delete_var(obj[key]);
        }
      }
      for (var key in obj) {
        delete obj[key];
      }
    },
    'scrollTo': function (el, left, top) {
      var left = left || 0;
      var top = top || 0;
      if (typeof el.scrollTo === 'function') {
        el.scrollTo(left, top);
        return;
      }
      el.scrollLeft = left;
      el.scrollTop = top;
    },
    'is_standard_attr': function (el, att) {
      if (el === void 0 || att === void 0 || att.NodeType === 2) return;
      var tag = this.createNode(el.nodeName);
      return (tag[att] !== void 0 || tag.getAttribute(att) !== null);
    }
  };
};
var getEle = function () {
  this.chaining_getClass = function (ClassName) {
    return this instanceof HTMLElement ? this.getElementsByClassName(ClassName) : undefined;
  };
  this.chaining_getTag = function (tagName) {
    return this instanceof HTMLElement ? this.getElementsByTagName(tagName) : undefined;
  };
}

namespace.prototype =
  {
    'EventHandler': function (modules)/*观察者模式*/ {
      this.handlers = {};
      this.add = function (type, handler) {
        if (typeof handler !== 'function') {
          return;
        }
        if (this.handlers[type] === undefined) {
          this.handlers[type] = [];
        }
        this.handlers[type].push(handler);
      }
      this.add_group = function (type, handers) {
        //检查是否在module中
        if (this.module !== this) {
          if (this.module[type] === undefined) {
            Object.assign(this.module, type, handers);
          }
        }
        if (handers !== undefined && typeof type === 'string') {
          if (handers instanceof Array) {
            for (var i = 0, len = handers.length; i < len; i++) {
              this.add(type, handers[i]);
            }
          }
          else if (handers instanceof Object) {
            for (var key in handers) {
              this.add(type, handers[key]);
            }
          }
        }
      };
      this.on = function (type) {
        if (this.handlers[type] !== undefined) {
          var Event = {
            type: type,
            target: this
          };
          if (this.handlers[type].length > 0) {
            var args = [];
            for (var i = 1, len = arguments.length; i < len; i++) {
              args[i - 1] = arguments[i];
            }
            for (var i = 0, len = this.handlers[type].length; i < len; i++) {
              var module;
              if (this.module === this || this.module[type] === undefined) {
                //事件内部-无法-调用新增加在事件中的对象
                module = this.handlers[type];
              }
              else {
                //事件内部-可以-调用新增加在事件中的对象
                module = this.module[type];
              }
              this.handlers[type][i].apply(module, args);
            }
          }
        }
      };
      this.handlers_exists = function (type) {
        return this.handlers[type] !== undefined;
      };
      this.on_all = function () {
        if (this.handlers !== undefined) {
          for (var type in this.handlers) {
            this.on(type, arguments);
          }
        }
      };
      this.out = function (type, handler) {
        if (this.handlers[type] === undefined) {
          return;
        }
        if (handler !== undefined) {
          for (var i = 0, len = this.handlers[type].length; i < len; i++) {
            var sources = this.handlers[type][i];
            if (sources === handler) {
              this.handlers[type].splice(i, 1);
              break;
            }
          }
          if (this.handlers[type].length < 1) {
            delete this.handlers[type];
          }
        }
        else {
          delete this.handlers[type];
        }
        console.log('remove success');
      };
      if (!!modules) {
        if (typeof modules !== 'object') {
          return false;
        }
        this.module = modules;
        !(function (modules) {
          for (var type in modules) {
            var module = modules[type];
            //__add为false表示不添加到事件管理器中
            if (typeof module === 'object' && (module['__add'] === undefined || module['__add'])) {
              this.add_group(type, module);
            }
          }
          modules['EventHandler'] = this;
        }.call(this, modules)
        );
      }
      else {
        this.module = this;
      }
    },
    'defineEvent': function (type, canBubble, cancelable)/*自定义事件*/ {
      this.ele = null;
      this.constructor = namespace;
      if (document.createEvent !== undefined) {
        //谷歌等内核
        var canBubble = canBubble || false;
        var cancelable = cancelable || false;
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent(type, canBubble, cancelable);
        this.fire = function () {
          this.ele.dispatchEvent(evt);
        }
        Object.defineProperty(this, "Event_name", {
          value: type,
          writable: false
        });
      }
      else {
        //对IE进行处理
        var propertychange = type + '_' + Math.random();
        this.fire = function () {
          this.ele[propertychange] = Math.random();
        }
        if (Object.defineProperty !== undefined) {
          Object.defineProperty(this, "Event_name", {
            value: 'propertychange',
            writable: false
          });
        }
        else {
          this.Event_name = 'propertychange';
        }
      }
      this.on = function (ele) {
        this.ele = ele;
        this.fire();
      }
    }
  }
var myns = new namespace();
var cm = myns.common;
var css = myns.css;
var size = myns.size;

//dom.querySelector

/*EventHandler接口*/
/*
//示例
var modules = function()
{
  var _self = this;
  var _global = null;
  this.obj_list_fun = {

  }
}
var eh = new myns.EventHandler(new modules());
*/









/*

if(window.localStorage !== void 0){
  var ls = window.localStorage;
  var ss = window.sessionStorage;
}

*/


//绑定 window.onload event中的srcElement 等于 document 







//css ie8获取单个css多个名称，用 css 里面的样式一个一个去对比
//获取CSS样式
//console.log(returnSize.currentStyle.width); ie
//console.log(window.getComputedStyle(returnSize).width); ie
/*
//获取css样式文件
var obj = document.styleSheets[0];
if( obj.cssRules ) {
    // 非IE [object CSSRuleList]
    rule = obj.cssRules[0];
} else {
    // IE [object CSSRuleList]
    rule = obj.rules[0];
}
*/
