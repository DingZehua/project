var collections = {};
collections.base = (function(){
  var base = {};
  base.method = {};

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

  base.enumerable = enumerable;
  base.enumerableTree = enumerableTree;
  base.Range = Range;
  base.Set = Set;
  base.exceptionHandler = exceptionHandler;
  base.exceptionClass = exceptionClass;
  base.errorInfo = errorInfo;

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

  base.CONST = {};
  base.CONST.ERR_ = ERR_;
  return base;
}());
try{(module && (module.exports = collections));}
catch(e){}
