var collections = {};
collections.base = (function(){
  var base = {};
  base.method = {};

  let log = console.log.bind(console);

  if(Object.assign === undefined) {
    Object.assign = function(target) {
      if(target === undefined) {
        throw "Cannot be null or undefined to object";
      }
      for(var i = 1,len = arguments.length; i < len ; i++) {
        var source = arguments[i];
        for(var key in source) {
          if(source.hasOwnProperty(key))
            target[key] = source[key];
        }
      }
      return target;
    }
  }

  var heapSort = (function(){
    var ascend = function(a,b){
      return a < b;
    }

    var descend = function(a,b){
      return a > b;
    }

    var sort = function(arr,order) {
      sort.compare = !order ? ascend : descend ;
      for(var i = Math.floor(arr.length / 2 -1); i >= 0 ; i--) {
        adjust(i,arr.length,arr);
      }
      for(var index = arr.length - 1; index > -1 ; index--) {
        swap(0,index,arr);
        adjust(0,index,arr);
      }
      return arr;
    }

    var adjust = function(i,length,arr) {
      var temp = arr[i];
      for(var k = i * 2 + 1; k < length ; k = k*2 + 1) {
        if(k + 1 < length && sort.compare(arr[k],arr[k + 1])) {
          k++;
        }
        if(sort.compare(arr[i],arr[k])) {
          arr[i] = arr[k];
          arr[k] = temp;
          i = k;
        }
        else {
          break;
        }
      }
    }
    var swap = function(from,to,arr) {
      var temp = arr[from];
      arr[from] = arr[to];
      arr[to] = temp;
    }
    return sort;
  }());

  Object.defineProperty(Array.prototype,'heapSort',
    {
      value : function(order){
        heapSort(this,order);
        return this;
      },
      writable : true,
      configurable : true,
      enumerable : false
    });

  var extend = function(o,m){
    if(o == null || m == null) throw('object or method not undefined');
    for(var name in m){
      if(m.hasOwnProperty(name)){
        o[name] = m[name];
      }
    }
  }

  var inherit = function(o){
    if(o == null)
     throw new TypeError();
    if(Object.create)
     return Object.create(o);
    var f = function(){};
    f.prototype = o;
    return new f;
  }

  var hideAttr = function(o){
    var args = arguments;
    var keys = [];
    if(args.length > 1){
      keys = keys.concat(Array.prototype.splice.call(args,1));
    }
    else {
      keys = Object.getOwnPropertyNames(o);
    }
    
    keys.forEach(function(name){
      var descript = Object.getOwnPropertyDescriptor(o,name);
      // 跳过引擎自带的属性。
      if(descript.configurable){
        Object.defineProperty(o,name,{
          enumerable : false
        });
      }
    });
    return o;
  }

  var showAttr = function(o){
    var args = arguments;
    var keys = [];
    if(args.length > 1){
      keys = keys.concat(Array.prototype.splice.call(args,1));
    }
    else {
      keys = Object.getOwnPropertyNames(o);
    }
    
    keys.forEach(function(name){
      var descript = Object.getOwnPropertyDescriptor(o,name);
      // 跳过引擎自带的属性。
      if(descript.configurable){
        Object.defineProperty(o,name,{
          enumerable : true
        });
      }
    });
    return o;
  }


  function  defineSubclass(superclass,
                          constructor,
                          methods,
                          statics)
    {
    //建立子类的原型对象
    constructor.prototype = function(p){
      var f = function(){};
      f.prototype = p;
      return new f;
    }(superclass.prototype);

    constructor.prototype.constructor = constructor;

    //像对常规类一样复制方法和类属性
    if(methods){ 
      !function(p,ms){ 
        for(var name in ms){
          if(ms.hasOwnProperty(name)){
            p[name] = ms[name];
          }
        }
      }(constructor.prototype,methods);
    }

    if(statics){ 
      !function(p,ss){ 
        for(var name in ss){
          if(ss.hasOwnProperty(name)){
            p[name] = ss[name];
          }
        } 
      }(constructor,statics); 
    }

    Object.setPrototypeOf(constructor,superclass);

    return constructor;
  }

  //也可以通过父类构造函数的方法来做到这一点
  Function.prototype.extend = function(constructor,methods,statics){
    return defineSubclass(this,constructor,methods,statics);
  }

  var merge = function(p,o){
    for(var prop in o){
      if(!p.hasOwnProperty(prop)){
        p[prop] = o[prop];
      }
    }
    return p;
  }

  Function.prototype.merge = function(o){
    return merge(this.prototype,o);
  }

  !(function(){
    var propId = '|**ObjectId**|';
    Object.defineProperty(Object.prototype,'ObjectId',{
      get : getObjectID,
      configurable : false,
      enumerable : false
    });
    function getObjectID(){
      if(!(propId in this)){
        if(!Object.isExtensible(this)) throw new Error('This object is nonExtensible.');
        Object.defineProperty(this,propId,{
          value : Set._v2s.next++,
          enumerable : false,
          configurable : false
        });
      }
      return this[propId];
    }
  }());

  // 异常收集器
  var errorInfo = function(msg,value,type,cause,thClass,method,oThis){
    this.msg = (msg && msg.toString()) || '';
    this.value = value;
    this.valueType = (value && classOf(this.value)) || null;
    this.type = type;
    this.cause = cause;
    this.thClass = thClass || null;
    this.method = method || null;
    this.oThis = oThis || null;
    this.oThisConstructor = (isObject(oThis) && oThis.constructor) || null;
  }

  var typeHander = {
    isNumber : function(v){
      var val = parseFloat(v);
      return val === val;
    }
  }

  var enuConstr = function(){ throw new errorInfo('This is enumerable constructor');};

  var enumerable = function(nameToValues){
    var enumerable = function(){ throw new errorInfo('is enumerable object');};
    var proto = enumerable.prototype = {
      constructor : enumerable,
      toString    : function(){ return this.name; },
      valueOf     : function() { return this.value; },
      toJSON      : function() { return this.name; }
    }
    Object.defineProperty(enumerable,'values',{
      enumerable:false,
      value : [],
      configurable:false,
      writable:false
    });
    for(var name in nameToValues){
      var v = (function(p){
        var f = function(){};
        f.prototype = p;
        return new f();
      }(proto));
      v.name = name;
      v.value = nameToValues[name];
      enumerable[name] = v;
      enumerable.values.push(v);
    }

    Object.defineProperty(enumerable,'foreach',{
      enumerable:false,
      value : function(f,c){
        for (var i = 0; i < this.values.length; i++){
          f.call(c,this.values[i]);
        } 
      },
      configurable:false,
      writable:false
    });

    Object.defineProperty(enumerable,'__constructor',{
      enumerable:false,
      value : enuConstr,
      configurable:false,
      writable:false
    });
    return enumerable;
  }

  var ERR_ = enumerable({'PARAM':1,'VAL_UNDEFINED':2,'VIST_UNDEFINED':3,'OPER':4,'TYPE':5,'USE':6});
  // TODO:定义一个类，里面包含上面这两个类型的错误，并且包含变量，且包含变量的类型，构造函数，变量的值。
  // 组合错误:12,包含错误:1.2。
  // 暂不包含系统类的错误。

  var exceptionHandler = function(ERR_,methods,normal){
    if(!ERR_ || !ERR_.__constructor || ERR_.__constructor !== enuConstr){
      throw ERR_['TYPE'];
    }
    this.ERR_ = ERR_;
    this.errorType = Object.keys(ERR_);
    this.methods =  {};
    if(isFunction(normal)){
      this.normal = normal;
    }
    this.add(methods);
  }
  exceptionHandler.prototype = {
    constructor : exceptionHandler,
    normal      : function(){},
    change      : function(key,method){
      if(this.errorType.indexOf(key) > -1 && isFunction(method)){
        this.methods[key] = method;
        return true;
      }
      return false;
    },
    add : function(methods){
      if(!isObject(methods)){
        return false;
      }
      var keys = this.errorType;
      for(var i = 0,len = keys.length; i < len; i++){
        var key = keys[i];
        var method = methods[key];
        if(!this.change(key,method)){
          this.methods[key] = this.normal;
        };
      }
    }
  }
  // 异常处理器
  var exceptionClass = function(ERR_,methods,normal,constructor,oThis){
    this.constructor = constructor || null;
    exceptionHandler.apply(this,Array.prototype.slice.call(arguments,0,3));
    this.oThis = function(cxt){
      if(cxt) {
        if(this.constructor && this.constructor.prototype.isPrototypeOf(cxt)){
          oThis = cxt;
        }
        else{
          oThis = null;
        }
      }
      return oThis;
    }
  }

  exceptionHandler.extend(exceptionClass,{
    constructor : exceptionClass,
    exce        : function(value){
      var key = '';
      if(isChildClass(errorInfo,value)){
        if(value.type != null) // 处理type为undefined或者为null的情况。
          key = value.type.toString();
        else
          // 处理为null的情况。
          this.normal(errorInfo);
      }
      if(this.errorType.indexOf(key) > -1){
        return this.methods[key].call(this.oThis(),value);
      }
      throw value;
    }
  });

  /*
    combin class
    exceptionClass(new exceptionClass,attribute){
      this.handler = exceptionClass,
      this.attributes = attributes (foreach assign)
    }
  */

  var enumerableTree = function(nameToValues,node,parent,root){

    var obj = {};
    var name = (parent && parent._name) || 'enum';
    var enumerableHead = node || function(name){
      if(!enumerableHead.contains(name)){
        throw ERR_['VIST_UNDEFIEND'];
      }
      return enumerableHead[name];
    };

    Object.defineProperty(obj,name,{
      enumerable:true,
      configurable:false,
      set : function(nameToValues){
        // 处理树头在初次定义的情况。
        if(isEmpty(enumerableHead)){
          merge(enumerableHead,proto);
          // 添加私有构造函数属性。
          enumerableHead.__constructor = enuConstr;
          enumerableHead.contains = function(key) { return this.hasOwnProperty(key);};
          enumerableHead.values = [];
          hideAttr(enumerableHead);
          enumerableHead.prototype = proto;
          enumerableHead.prototype.constructor =  enumerableHead;
          enumerableHead._name = 'head';
          enumerableHead.value = 'head';
          hideAttr(enumerableHead,'_name','value');
        }
        enumerableHead.parent = parent || null;
        enumerableHead.root = root || null;

        
        enumerableHead.foreach = function(f,c){
          for (var i = 0; i < this.values.length; i++){
            f.call(c,this.values[i]);
          } 
        }
        hideAttr(enumerableHead,'parent','root','foreach');
        set(nameToValues);
      },
      get : function(){
        return enumerableHead;
      }
    });

    var proto  = {
      toString    : function() { return this._name; },
      valueOf     : function() { return this.value; },
      toJSON      : function() { return this._name; }
    }

    function set(nameToValues){
      if(!isObject(nameToValues) || isEmpty(nameToValues)){
        throw ERR_['TYPE'];
      }
      for(var name in nameToValues){
        !(function(proto){
          var enumerableChild = function(name){ 
            if(!enumerableChild.contains(name)){
              throw ERR_['VIST_UNDEFIEND'];
            }
            return enumerableChild[name];
          }
          merge(enumerableChild,proto);
          merge(enumerableChild.prototype,proto);
          // 添加私有构造函数属性。
          enumerableChild.__constructor = enuConstr;
          enumerableChild.prototype.constructor = root || enumerableHead;
          enumerableChild.contains = function(key) { return this.hasOwnProperty(key);};
          enumerableChild.values = [];

          hideAttr(enumerableChild);
          Object.defineProperty(enumerableHead,name /* for的name */,{
            enumerable : true,
            configurable : false,
            set : function(v){
              if(enumerableChild.values.length > 0){
                throw Error('The enumerable already set value');
              }
              // 将本层赋值给下一层节点。
              enumerableTree(v,enumerableChild,
                               enumerableHead,
                               root || enumerableHead);
            },
            get : function(){
              return enumerableChild;
            }
          });
          enumerableChild._name = name;
          enumerableChild.value = nameToValues[name];
          hideAttr(enumerableChild,'_name','value');
          enumerableHead.values.push(enumerableChild);
        }(proto));
      }
    }
    obj[name] = nameToValues; // 生成变量。
    return obj[name];
  }

  var Range = function(from,to){
    this.from = function(){
      return from;
    }
    this.to = function(){
      return to;
    }
  }
  Range.prototype = {
    constructor : Range,
    includes : function(x){
      return this.from() <= x && this.to() >= x;
    },
    foreach : function(f){
      for(var i = this.from(),max = this.to(); i <= max ; i++){
        f(i);
      }
    },
    toString : function(){
      return "(" + this.from() + "..." + this.to() + ")";
    }
  }

  var Set = function(){
    this.values = {};
    this.n = 0;
    this.add.apply(this,arguments);
  }

  Set.prototype = {
    constructor : Set,
    add : function(){
      for(var i = 0,len = arguments.length; i < len ; i++){
        var str = Set._v2s(arguments[i]);
        if(!this.values.hasOwnProperty(str)){
          this.values[str] = arguments[i];
          this.n++;
        }
      }
      return this;
    },
    contains : function(o){
      return this.values.hasOwnProperty(Set._v2s(o));
    },
    size : function(){
      return this.n;
    },
    remove : function(o){
      var str = Set._v2s(o);
      if(this.values.hasOwnProperty(str)){
        delete this.values[str];
        this.n--;
      }
    },
    foreach : function(f,c){
      for(var name in this.values){
        if(this.values.hasOwnProperty(name)){
          f.call(c,this.values[name]);
        }
      }
    }
  }

  Set._v2s = function(o){
    switch(o){
      case undefined : return 'u';
      case null      : return 'n';
      case false     : return 'f';
      case true      : return 't';
      default : switch(typeof o){
        case 'string' : return '"' + o;
        case 'number' : return '#' + o;
          default : return '@' + ObjectId(o);
      }
    }

    function ObjectId(o){
      var prop = '|**ObjectId**|';
      if(!o.hasOwnProperty(prop)){
        Object.defineProperty(o,prop,{
              value : Set._v2s.next++,
              enumerable : false,
              configurable : false
        });
      }
      return o[prop];
    }
  }

  Set._v2s.next = 100;

  function array(a,n){
    return Array.prototype.slice.call(a,n || 0);
  }

  function getArryNode(a,n){
    return array(a,n);
  }

  function ascend(a,b){
    return a - b;
  }
  function descend(a,b){
    return b - a;
  }

  var clealArr = function(arr){
    return arr.splice(0);
  }

  var compose = function(f,g,filter){
    return function(){
      if(filter && typeof filter === 'function'){
        if(!filter.apply(this,arguments)){
          throw new Error('params incorrect type');
        }
      }
      return f.call(this,g.apply(this,arguments));
    }
  }

  var classOf = function(o){
    return Object.prototype.toString.call(o).slice(8,-1);
  }

  var not = function(o){
    return !o;
  }

  var isBoolean = function(o){
    return classOf(o) === 'Boolean';
  }
  var isNumber = function(o){
    return classOf(o) === 'Number';
  }

  var isFunction = function(o){
    return classOf(o) === 'Function';
  }

  var isArray = function(o){
    return classOf(o) === 'Array';
  }

  var isString = function(o){
    return classOf(o) === 'String';
  }

  var isDate = function(o){
    return classOf(o) === 'Date';
  }

  var isObject = function(o){
    if(o === undefined || o === null) {
      return false;
    }
    return classOf(o) === 'Object';
  }

  var isInteger = function(n){
    if(!isNumber(n)){
      return false;
    }
    return n === Math.floor(n);
  }

  var isCanComputeVal = function(v){
    v = parseFloat(v);
    return v === v;
  }

  var isFloat = function(n){
    if(!isNumber(n)){
      return false;
    }
    return n !== Math.floor(n);
  };

  var parital = function(f){
    var args = array(arguments,1);
    return function(){
      var a = array(arguments);
      var i = 0,j = 0;
      // 这里如果还用args这个闭包变量的话，那么修改到的话，那下次还是用到修改到的值。
      var b = array(args);
      while(i < b.length){
        if(b[i] === undefined)
         b[i] = a[j++];
        i++;
      }
      return f.apply(this,b.concat(array(a,j)));
    }
  }

  var leftParital = function(f){
    var args = array(arguments,1);
    return function(){
      var a = array(arguments);
      return f.apply(this,args.concat(a));
    }
  }

  var rightParital = function(f){
    var args = array(arguments,1);
    return function(){
      var a = array(arguments);
      return f.apply(this,a.concat(args));
    }
  }

  // oThis是filter函数的上下文，也是设置属性的上下文。
  var privateSetget = function(value,proName,filter,oThis){
    var o = null;
    if(isFunction(filter)){
      if(!filter.apply(oThis || o,[value])){
        throw new TypeError('The value is it invalid type. value:' + value);
      }
    }
    
    (isObject(oThis) && (o = oThis)) || (o = {});
    if(isFunction(Object.defineProperty)){
        Object.defineProperty(oThis,proName,{
          set : set,
          get : get,
          enumerable : true,
          configurable : false
        })
    }
    else if(isFunction(o.__defineGetter__)){
      o.__defineGetter__(proName,get);
      o.__defineSetter__(proName,set);
    }
    else{
      o['get' + proName] = get;
      o['set' + proName] = set;
      o[proName] = value;
    }

    function get(){
      return value;
    }

    function set(v){
      
      if(isFunction(filter)){
        if(!filter.apply(oThis || o,[v])){
          throw new TypeError('The value is it invalid type');
        }
      }
      value = v;
    }
    return o;
  }

  var isEmpty = function(o){
    for(var key in o){
      if(o.hasOwnProperty(key))
        return !1;
    }
    return !0;
  }

  var intSplit = function(value){
    var arr = [];
    while(value){
      arr.unshift(value % 10);
      value = parseInt(value / 10)
    }
    return arr;
  }

  var strSplit = function(value){
    var arr = [];
    var i = value.length;
    while(i){
      arr.unshift(value.charAt(--i));
    }
    return arr;
  }
  
  var isChildClass = function(constructor,obj){
    return obj instanceof constructor;
  }

  hideAttr(Function.prototype);

  //抽象方法
  var AbstractMethod = function(){ throw new Error("This is abstract method"); };


  var Prom = (function(){
    const PENDING = Symbol('PENDING');
    const FULFILLED = Symbol('FULFILLED');
    const REJECTED = Symbol('REJECTED');
    const isFun = isFunction;
    let exception = function(){
      if(exception.list.length) {
        log('Please check the stack message before the first setTimeout.');
      }
      while(exception.list.length) {
        let except = exception.list.shift();
        setTimeout(function(){
          throw except;
        },0);
      }
      exceptionOut = null;
    }
    exception.list = [];
    let exceptionOut = null;
    class Prom {
      constructor (func){
        this.status = PENDING;
        this.queue = {[FULFILLED] : [],[REJECTED] : []};
        // indirect 为指向这个对象的Prom对象，inherit为使用then继承的子Prom对象
        this.childs = {inherit : [],indirect:[]}
        if(!isFun(func)) {
          throw new TypeError('1 param Invalid value. must is function');
        }
        let out = null;
        try {
          func(
            // success
            (function(value){
              if(this.status !== PENDING) return;
              this.status = FULFILLED;
              out = setTimeout(this.pcall.bind(this,value),0);
            }).bind(this),
            // failed
            (function(err) {
              if(this.status !== PENDING) return;
              this.status = REJECTED;
              out = setTimeout(this.pcall.bind(this,err),0,
                              err !== undefined ? err : new Error('Prom No corresponding handler')
                );
            }).bind(this)
          );
        }
        catch(e) {
          this.status = REJECTED;
          clearTimeout(out);
          setTimeout((function(err){
            this.pcall(err);
          }).bind(this),0,e);
        }
      }
      then(resolve,reject,parent,index) {
        this.queue[REJECTED].push(!isFun(reject) ? null : reject);
        this.queue[FULFILLED].push(!isFun(resolve) ? null : resolve);
        //保留本层的参数，给child使用。
        let last = this.queue[REJECTED].length - 1;
        this.childs.inherit.push(null);
        // 如果有父对象，那么更新状态，如果有子对象，那么也会更新到本对象的子对象。
        if(parent && parent.childs.inherit[index] === null) {
          // 如果继承对象没有执行这个方法，那么则不加进队列
          parent.childs.inherit[index] = this;
          this.status = parent.status;
        }
        let child = new Prom(function(){});
        let self = this;
        child.then = (function(){
          return (function(resolve,reject) {
            return Prom.prototype.then.apply(this,[resolve,reject,self,last]);
          }).bind(child)
        }());
        return child;
      }
      catch(reject) {
        return this.then(null,reject);
      }
      finally (callback){
        return this.then(function(val){
          callback();
          return val;
        },function(err){
          callback();
          throw err;
        });
      }
      done(onResolve,onReject){
        this.then(onResolve,onReject).catch(function(err){
          setTimeout(() => {throw err},0);
        });
      }
      pcall (param) {
        if(this.status === REJECTED) {
          this.onAll(param);
        }
        else if(param instanceof Prom) {
          if(param.status !== PENDING) {
            this.status = param.status;
            this.onAll(param);
          }
          else {
            this.status = PENDING;
            param.childs.indirect.push(this);
          }
        }
        else {
          this.onAll(param);
        }
      }
      onAll(param) {
        // 暂时将异常队列清除出去
        if(exceptionOut !== null) {
          clearTimeout(exceptionOut);
        }
        let originExceptionOut = exceptionOut;
        // 执行使用then函数生成的对象。
        this.queue[this.status].forEach(function(method,i,arr) {
          let child = this.childs.inherit[i];
          // 加入执行队列
          let value = null;
          try {
            if(this.status === REJECTED){
              if(!isFun(method)){
                throw(param);
              }
            }
            value = (isFun(method) && method(param)) || undefined;
            if(child){
              child.status = FULFILLED;
              child.pcall.call(child,value);
            }
            if(exceptionOut !== null) {
              exceptionOut = setTimeout(exception,0);
            }
          } catch(e) {
            if(child){
              child.status = REJECTED;
              child.pcall.call(child,e);
            }
            else {
              // 没有继承的子对象处理，那么加入异常队列。
              exception.list.push(e);
              exceptionOut = setTimeout(exception,0);
            }
          }
        },this);

        if(!this.queue[this.status].length && this.status === REJECTED) {
          exception.list.push(param);
          exceptionOut = setTimeout(exception,0);
        }
        // 执行指向这个指针的对象。
        this.childs.indirect.forEach(function(child,i){
          child.status = this.status;
          child.pcall.call(child,param);
        },this);
        // 将异常队列放在最后运行。
        if(exceptionOut !== null && exceptionOut === originExceptionOut) {
          exceptionOut = setTimeout(exception,0);
        }
      }
      static all(proms){
        return new Prom(function(s,f){
          let list = [];
          let err = {};
          let unInitErr = err;
          let count = 0;

          if(!Array.from(proms).length) {
            s([]);
            return;
          }
          for(let [i,p] of proms.entries()) {
            Prom.resolve(p).then(function(result){
              list.push(result);
              count++;
              if(count === proms.length) {
                s(list);
              }
            },function(e) {
              if(unInitErr === err) {
                err = e;
                f(e);
              }
            });
          }
        });
      }
      static resolve(val) {
        if (val instanceof Prom) {
          return val;
        } else if(val instanceof Object
               && isFun(val.then)) {
          return new Prom(val.then);
        } else if(val !== undefined) {
          return new Prom(function(resolve) {
            resolve(val);
          });
        } else {
          return new Prom(function(resolve) {
            resolve();
          });
        }
      }
      static reject(val) {
        return new Prom(function(resolve,reject) {
          reject(val);
        });
      }
      static race(ps) {
        return new Prom(function(resolve,reject) {
          let xxx = {v : null,time : Math.random()};
          let unInitVal = null;
          if(!Array.from(ps).length) {
            s([]);
            return;
          }
          Object.defineProperty(xxx,'value',{
            get : function() { log('get'); return this.v; },
            set : function(v) { log('set'); this.v = v; }
          })
          /*
          let valProxy = new Proxy(val,{
            set(target,prop,value) {
              log('set');
               Reflect.set(target,prop,value);
            }
          });
          */
          for(let [i,p] of ps.entries()) {
            Prom.resolve(p).then(function(result) { 
              if(xxx.value === null) {
                xxx.value = result;
                resolve(result);
              }
            },function(err) {
              log('error');
              if(xxx.value === unInitVal) {
                xxx.value = err;
                reject(err);
              }
            });
          }
        });
      }
    }
    return Prom;
  }());
    function co(gen) {
      let MyPromise = Prom;
      let cxt = this;
      let args = Array.prototype.slice(arguments,1);
    
      return new MyPromise(function(resolve,reject) {
        if(typeof gen === 'function') gen = gen.apply(cxt,args);
        if(!gen || typeof gen.next !== 'function') resolve(gen);
        success();
        function success(res) {
          let ret;
          try {
            ret = gen.next(res);
          } catch (e) {
            // 如果函数体内发出的错误，那么则直接退出。
            return reject(e);
          }
          next(ret);
        }
        function failed(err) {
          // 异步函数发出的错误。
          let ret;
          try {     // 如果是yield参数错误，或者是回调函数返回错误，那么抛出一个错误给Generato函数去处理。
            ret = gen.throw(err);// 如果给Generator捕获到，Generator继续执行下一条 yield语句.  
          } catch(e) {
            // 如果没有捕获到，那么则直接退出函数.
            return reject(e);
          }
          next(ret);
        }
    
        function next(ret) {
          // gen正常或异常运行结束时才执行父类节点的回调函数.
          if(ret.done) resolve(ret.value);
          let value = toPromise.call(cxt,ret.value); // 过滤原始值.
          if(value && isPromise(value)) value.then(success,failed); // 处理异步函数处理的结果
          else {
            failed(new TypeError(`
            传递给co函数的值不能是原始值,value : ${ret.value}
          `));
        }
        }
      });
    
      function toPromise(obj) {
        if(!obj) return obj;
        if(isPromise(obj)) { return obj; }
        if(isGenerator(obj) || isGeneratorObj(obj)) { return co.call(this,obj); }
        if(isThunkFunction(obj)) { return thunkFunction.call(this,obj); }
        if(Array.isArray(obj)) { return toArrayPromise.call(this,obj); };
        if(isSet(obj)) { return toSetPromise.call(this,obj); }
        if(isMap(obj)) { return toMapPromise.call(this,obj); }
        if(isObject(obj)) { return objectList.call(this,obj); }
        return obj;
      }
      
      function isSet(obj) {
        return 'object' === typeof obj && 
                typeof obj.has === 'function' && 
                typeof obj.delete === 'function' && 
                typeof obj.add === 'function' && 
                typeof obj.keys === 'function';
      }
  
      function isMap(obj) {
        return 'object' === typeof obj && 
                typeof obj.has === 'function' && 
                typeof obj.delete === 'function' && 
                typeof obj.set === 'function' && 
                typeof obj.keys === 'function';
      }
  
  
      function isPromise(obj) {
        return typeof obj.then === 'function' && typeof obj.catch === 'function';
      }
    
      function isGenerator(obj) {
        let constructor = obj.constructor;
        if('function' !== typeof constructor) return false;
        if(constructor.name === 'GeneratorFunction') return true;
        return isGeneratorObj(constructor.prototype);
      }
    
      function isGeneratorObj(obj) {
        return typeof obj.next === 'function' && typeof obj.throw === 'function';
      }
    
      function isObject(obj) {
        let prototype = Object.getPrototypeOf(obj);
        return prototype.constructor === Object;
      }
    
      function isThunkFunction(obj) {
        return typeof obj === 'function';
      }
  
      /**
       * 返回`MyPromise`对象.
       * @param Function
       * @return MyPromise
       * @api private
       */
      function thunkFunction(obj) {
        return new MyPromise(function(resolve,reject){
          obj.call(this,function(err,data) {
            if(err) { reject(err); }
            else { 
              data = arguments.length > 2 ? Array.prototype.slice.call(arguments,1) : data;
              resolve(data);
             }
          });
        });
      };
  
      function toArrayPromise(obj) {
        return MyPromise.all(obj.map(toPromise,this));
      }
  
      function objectList(obj) {
        let keys = Object.keys(obj);
        let results = {};
        let promises = [];
        for(let i = 0,len = keys.length; i < len ; i++) {
          let value = toPromise.call(this,keys[i]);
          if(value && isPromise(value)) promises.push(defer.call(this,results,value,keys[i]));
          else { results[keys[i]] = obj[keys[i]]; }
        }
        return MyPromise.all(promises.then(function() {
          return results;
        }));
      }
      /**
       * 
       * @param {Set} Set 
       * @api private
       * @return MyPromise.all
       */
      function toSetPromise(obj) {
        let resultSets = [];
        let arrSet = [...obj];
        let promises = [];
        for(let i = 0,len = arrSet.length; i < len;i++) {
          if(isPromise(arrSet[i])) { promises.push(defer.call(this,arrSet,arrSet[i],i)) }
          else { resultSets[i] = arrSet[i]; }
        }
        return MyPromise.all(promises).then(function() {
          return new Set([resultSets]);
        });
      }
  
      function toMapPromise(obj) {
        let resultMaps = [];
        let i = 0;
        let promises = [];
        obj.forEach(function(v,key){
          if(isPromise(v)) { promises.push(defer.call(this,resultMaps,v,i)) }
          else { resultMaps[i] = v; }
          i++;
        });
        return MyPromise.all().then(function() {
          let m = new Map();
          let i = 0;
          obj.forEach(function(v,key){
            m.set(key,resultMaps[i]);
            i++;
          });
          return m;
        })
      }
      function defer(obj,promise,key) {
        return promise.then(function(data){
          return obj[key] = data;
        });
      }
    }

  base.enumerable = enumerable;
  base.enumerableTree = enumerableTree;
  base.Range = Range;
  base.Set = Set;
  base.exceptionHandler = exceptionHandler;
  base.exceptionClass = exceptionClass;
  base.errorInfo = errorInfo;
  base.Promise = Prom;

  base.method.isBoolean = isBoolean;
  base.method.isFunction = isFunction;
  base.method.isArray = isArray;
  base.method.isString = isString;
  base.method.isDate = isDate;
  base.method.isFloat = isFloat;
  base.method.isEmpty = isEmpty;
  base.method.inherit = inherit;
  base.method.extend = extend;
  base.method.AbstractMethod = AbstractMethod;
  base.method.typeHander = typeHander;
  base.method.merge = merge;
  base.method.defineSubclass = defineSubclass;
  base.method.array = array;
  base.method.getArryNode = getArryNode;
  base.method.ascend = ascend;
  base.method.descend = descend;
  base.method.clealArr = clealArr;
  base.method.compose = compose;
  base.method.parital = parital;
  base.method.leftParital = leftParital;
  base.method.rightParital = rightParital;
  base.method.isInteger = isInteger;
  base.method.isObject = isObject;
  base.method.privateSetget = privateSetget;
  base.method.isCanComputeVal = isCanComputeVal;
  base.method.intSplit = intSplit;
  base.method.strSplit = strSplit;
  base.method.isChildClass = isChildClass;
  base.method.hideAttr = hideAttr;
  base.method.showAttr = showAttr;
  base.method.heapSort = heapSort;
  base.method.log = log;
  base.method.co = co;

  base.CONST = {};
  base.CONST.ERR_ = ERR_;
  return base;
}());
try{(module && (module.exports = collections));}
catch(e){}
