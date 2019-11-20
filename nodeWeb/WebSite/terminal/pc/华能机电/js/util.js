!(function (Arr, Str, Date, Number, Object) {

  Object.classOf = function (o) {
    return classOf(o);
  }

  Object.prototype.classOf = function () {
    return classOf(this);
  }


  Object.isBoolean = function (o) {
    return classOf(o) === 'Boolean';
  }

  Object.prototype.isBoolean = function () {
    return classOf(this) === 'Boolean';
  }


  Object.isNumber = function (o) {
    return classOf(o) === 'Number';
  }

  Object.prototype.isNumber = function () {
    return classOf(this) === 'Number';
  }


  Object.isFunction = function (o) {
    return classOf(o) === 'Function';
  }

  Object.prototype.isFunction = function () {
    return classOf(this) === 'Function';
  }


  Object.isArray = function (o) {
    return classOf(o) === 'Array';
  }

  Object.prototype.isArray = function () {
    return classOf(this) === 'Array';
  }

  Arr.isArray = !Arr.isArray ? function (o) {
    return classOf(o) === 'Array';
  } : Arr.isArray;


  Object.isString = function (o) {
    return classOf(o) === 'String';
  }

  Object.prototype.isString = function () {
    return classOf(this) === 'String';
  }

  Str.isString = function (o) {
    return classOf(o) === 'String';
  }


  Object.isDate = function (o) {
    return classOf(o) === 'Date';
  }

  Object.prototype.isDate = function () {
    return classOf(this) === 'Date';
  }

  Date.isDate = function (o) {
    return classOf(o) === 'Date';
  }


  Object.isObject = function (o) {
    if (o === undefined || o === null || o !== o) {
      return false;
    }
    return classOf(o) === 'Object';
  }

  Object.prototype.isObject = function () {
    return Object.isObject(this);
  }


  Object.isInteger = function (n) {
    if (!Object.isNumber(n)) {
      return false;
    }
    return n === Math.floor(n);
  }

  Object.prototype.isInteger = function () {
    return Object.isInteger(this);
  }

  Object.isFloat = function (n) {
    if (Object.isNumber(n)) {
      return false;
    }
    return n !== Math.floor(n);
  };

  Object.prototype.isFloat = function (n) {
    return Object.isNumbe(this);
  };

  Number.isFloat = function (n) {
    return Object.isNumbe(n);
  };

  function classOf(o) {
    return Object.prototype.toString.call(o).slice(8, -1);
  }

  Arr.foreach = function forEach(a, fn, ctx) {
    if (Object.isUndef(a.length)) throw new Error('param 1 must a similar Array');
    let exit = 0;
    for (let i = 0, len = a.length; i < len; i++) {
      exit = fn.call(ctx || null, a[i], i, a);
  
      if (exit === null || exit === false)
        break;
    }
  }

  Arr.prototype.foreach = function() {
    return Arr.foreach(this);
  }
  
  Arr.$toArray = function $toArray(arr, a, b) {
    if (b >= 0) {
      b++;
    } else if (b < 0) {
      b = arr.length + 1 - b;
    } else {
      b = arr.length;
    }
    return Array.prototype.slice.call(arr, a || 0, b);
  }
  
  Object.isUndef = function isUndef(a) {
    return a === undefined || a === null;
  }

  Object.isDef = function isDef(a) {
    return !Object.isUndef(a);
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
      if(descript.configurable){
        Object.defineProperty(o,name,{
          enumerable : false
        });
      }
    });
    return o;
  }

  hideAttr(Arr);
  hideAttr(String);
  hideAttr(Date);
  hideAttr(Number);
  hideAttr(Object);
  hideAttr(Function);
  hideAttr(Arr.prototype);
  hideAttr(String.prototype);
  hideAttr(Date.prototype);
  hideAttr(Number.prototype);
  hideAttr(Object.prototype);
  hideAttr(Function.prototype);
}(Array, String, Date, Number, Object));
