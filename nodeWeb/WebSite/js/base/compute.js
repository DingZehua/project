collections.base.compute = (function(){
  var compute = {};
  var base = collections.base;
  var AbstractMethod = collections.base.AbstractMethod;
  var stracture = collections.base.stracture;
  var struct = stracture.struct;
  var structSet = stracture.structSet;
  var filterStructSet = stracture.filterStructSet;
  var baseMethod = collections.base.method;

  // 最大值无法达到9(n)...,那么只能退一位，另一位是用给进位的。
  var max_digit = new base.Range(2,Number.MAX_SAFE_INTEGER.toString().length - 2);
  var intNumberRange = new base.Range(0,9);
  var overflowMax = new base.Range(0,Number.MAX_SAFE_INTEGER);
  var correctType = function(value){
    if(!baseMethod.isInteger(value)){ return false; }
    if(!this.range.includes(value)){ return false;}
    return true;
  }

  var overflowLimit = function(value){
    if(!baseMethod.isInteger(value)){ return false; }
    if(!overflowMax.includes(value)){ return false;}
    return true;
  }
  var add = function(value,selfValue,overflow){
    var temp = selfValue + value;
    if(temp >= 10){
      selfValue = temp - 10;
      overflow++;
    } else{
      selfValue += value;
    }
    return {
      value : selfValue,
      overflow : overflow
    };
  }

  var sub = function(value,selfValue,overflow){
    var temp = selfValue - value;
    if(temp < 0){
      selfValue = (selfValue + 10) - value;
      overflow--;
    } else{
      selfValue -= value;
    }
    return {
      value : selfValue,
      overflow : overflow
    };
  }

  var mul = function(value,selfValue,overflow){
    var temp = selfValue * value;
    overflow *= value;
    if(temp >= 10){
      selfValue = temp % 10;
      overflow += parseInt(temp / 10);
    } else{
      selfValue *= value;
    }
    return {
      value : selfValue,
      overflow : overflow
    };
  }

  var computeMehotd = baseMethod.parital(
    baseMethod.compose,
    function(obj){
      this.value = obj.value;
      this.overflow = obj.overflow;
    },
    undefined,
    correctType
    /*,value */);

  var intNumber = function(value){
    baseMethod.privateSetget(0,'overflow',overflowLimit,this);
    baseMethod.privateSetget(value,'value',this.correctType,this);

    this.add = function(v){
      return intNumber.prototype.add.call(this,v,this.value,this.overflow);
    }
    this.sub = function(v){
      return intNumber.prototype.sub.call(this,v,this.value,this.overflow);
    }
    this.mul = function(v){
      return intNumber.prototype.mul.call(this,v,this.value,this.overflow);
    }
  }

  intNumber.prototype = {
    constrcutor:intNumber,
    equal : function(that){
      if(that instanceof intNumber){
        return false;
      }
      if(that.overflow !== this.overflow) return false;
      if(that.value !== this.value) return false;
      return true;
    },
    add : computeMehotd(add),
    sub : computeMehotd(sub),
    mul : computeMehotd(mul),
    init : function(){
      this.value = 0;
      this.overflow = 0;
      return this;
    },
    range : intNumberRange,
    toString : function(){ return String(this.value);},
    valueOf  : function(){ return this.value;},
    correctType : correctType,
    assginTo : function(that){
      if(that instanceof intNumber){
        that.value = this.value;
        that.overflow = this.overflow;
      }
    },
    set : function(v){
      this.value = v;
    },
    get :function(){
      return this.value;
    }
  }

  // 只接受inteage类型，换成接受int和str类型,int类型不能超过Max_sale_value值
  // 要修改range的检测机制。
  var intNumbers = function(value,order,digit,overflow){
    this.values = [];
    baseMethod.privateSetget(overflow || 0,'overflow',overflowLimit,this);
    baseMethod.privateSetget(order || 0,'order',baseMethod.isInteger,this);
    
    if(!baseMethod.isInteger(digit) && digit > this.max_digit){
      throw new Error('digit exceed max value. range:' + this.max_digit.toString());
    }

    // 设置最大位数
    this.digit = Math.floor(digit) || 4;

    this.range = new base.Range(0,Math.pow(10,this.digit) - 1);
    
    if(!this.correctType(value)){
      throw new TypeError('The value must on Between '+ this.range.toString());
    }

    // 初始化位数
    !(function(oThis){
      var i = oThis.digit;
      while(i > 0){
        oThis.values.push(new intNumber(0,oThis.order,oThis.digit));
        i--;
      }
    }(this));
    this.set(value);
  }

  intNumbers.prototype = {
    constrcutor : intNumbers,
    digit : 0,
    equals : function(thatValue){
      // 比较
      try{
        this.foreach(function(v){
          if(v.equal(thatValue)){
            throw 'Fined';
          }
        });
        return false;
      }
      catch(msg){
        if(msg === 'Fined'){
          return true;
        }
        throw msg;
      }
    },
    foreach : function(f,oThis){
      // 遍历元素
      for(var i = 0,len = this.values.length;i < len ; i++){
        f.call(oThis,this.values[i],i,this.values);
      }
    },
    moveTo : function(start,to){
      // 在里面移动
      if(start === to) return;
      this.values.splice(to,0,this.values.splice(start,1)[0]);
    },
    remove : function(index){
      // 移除出去
      return this.values.splice(index,1);
    },
    set : function(value){
      if(!baseMethod.isCanComputeVal(value) || !this.correctType(value)){
        throw ' ' + value;
        return;
      }
      var arr = baseMethod.intSplit(value);
      var i = arr.length,j = this.digit;
      while(i > 0){
        this.values[--j].set(arr[--i]);
      }
      while(j > 0){
        this.values[--j].set(0);
      }
      // 设置变量 变成字符串，然后逐个设置。
    },
    get : function(){
      // 获取整个值.String
      return this.overflow > 0 ? this.overflow + this.toString() : this.toString().replace(/^[^1-9]*/,'') || '0';
    },
    assginTo   : function(){
      // 将自己的属性复制给别的对象
      if(that instanceof intNumbers){
        for(var i = 0,len = this.values.length; i < len ;i++){
          this.values[i].assginTo(that.values[i]);
        }
        that.overflow = this.overflow;
        that.order    = this.order;
      }
    },
    toValues : function(arr){
      // 设置每一个变量
      this.foreach(function(v,i){
        v.set(arr[i]);
      });
    },
    getValues : function(){
      // 获取只有数字的values，没有overFlow属性的数组。
      return this.values.map(function(v){
        return v.value;
      });
    },
    correctType : correctType,
    toString : function(){  
      return this.getValues().join('');
    },
    valueOf : function(){
      return parseInt(this.toString().replace(/^[^1-9]*/,'')) || 0;
    },
    // 自动会进位的加法
    add : function(value){
      // 做加法计算
      if(!this.correctType(value)){
        throw new TypeError('The value invalid type. value:' + value);
      }
      var arr = baseMethod.intSplit(value);
      var len = arr.length;
      this.values.reduceRight(function(overflow,b){
        // 留的上一位个位中的进位。
        b.add(overflow % 10);
        if(len > 0){
          b.add(arr[--len]);
        }
        b.overflow += parseInt(overflow / 10);
        // 如果前面有进1的话，那么则加到这里一起给下一位增加。
        return b.overflow;
      },0);
      // 如果这里要将前一次的overflow保留下来那么则用注释一段。
      /* this.overflow += this.values[0].overflow; */
      // 然后将<1>做一下修改。
      this.overflow += this.values[0].overflow;
      this.valuesOverflowZero();
      return this;
    },
    sub : function(value){
      // 做减法计算
      if(!this.correctType(value)){
        throw new TypeError('The value invalid type. value:' + value);
      }
      var arr = baseMethod.intSplit(value);
      var len = arr.length;
      try{
        // 给每一位相加,然后进位。
        this.values.reduceRight(function(overflow,b){
          b.sub(overflow);
          b.sub(arr[-len]);
          if(len === 0){
            throw 'sub';
          }
          return b.overflow;
        },0);
      }
      catch(e){
        if(e !== 'sub')
          throw e;
      }
      this.overflow = this.values[0].overflow;
      this.valuesOverflowZero();
      return this;
    },
    mul : function(value){
      // 做乘法计算

      var self = this;

      if(!this.correctType(value)){
        throw new TypeError('The value invalid type. value:' + value);
      }
      var arr = baseMethod.intSplit(value);
      
      while(arr.length < this.values.length){
        arr.unshift(0);
      }

      var product = [];
      !(function(self){
        var selfValue = +self; // 调用valueOf
        for(var i = 0,len = self.values.length; i < len ;i++){
          product[i] = new intNumbers(selfValue,self.order,self.digit,self.overflow);
        }
      }(this));

      //  乘数的长度。
      var i = arr.length;
      // 相乘所有的位数后就退出。
      var j = self.size();
      var k = j;
      while(i > 0){
        var mulvalue = arr[--i];
        product[--j].values.reduceRight(function(overflow,b){
          b.mul(mulvalue);
          b.add(overflow);
          return b.overflow;
        },0);
        // 溢出值也需要做乘法运算
        product[j].overflow *= mulvalue; 
        product[j].overflow += product[j].values[0].overflow;
        product[j].valuesOverflowZero();
      }
      // 将所有相乘累计叠加起来。
      product.reduceRight(function(a,b){
        // 去掉个位的值。
        var value = +(a.toString().slice(0,-1));
        // 和下一个的值的位数对齐。
        var overflow = a.overflow % 10;
        value += overflow * self.square();
        // 先把前一位的overflow保留下来，不然会给覆盖掉。
        /* begin <--1--> */
        b.add(value);
        // 降位，然后把溢出值加到下一个溢出值之中。
        b.overflow += parseInt(a.overflow / 10);
        /* end   <--1--> */
        return b;
      });

      
      // 将第一个进位的加在这里，以便合并运算。
      var sum = '0';
      var sumi = 0;
      do{
        sum = product[sumi].get();
        sumi++;
      }while(sum === '0' && sumi < this.size());
      var start = sumi;
      while(start < product.length){
        // 先以字符串的形式加在后面。
        sum += (product[start].values[k - 1].value + '');
        start++;
      }
      // 合并值，将最终值放在this对象中。
      if(sum.length <= this.size()){
        this.set(parseInt(sum));
        this.overflow = product[sumi - 1].overflow;
      }
      else{
        var strArr = baseMethod.strSplit(sum);
        var result = +(strArr.splice(-this.values.length).join(''));
        var resultfOverflow = +(strArr.join(''))
        this.set(result);
        this.overflow = resultfOverflow;
      }
      return this.get();
    },
    valuesOverflowZero : function(){
      this.foreach(function(v){
        v.overflow = 0;
      });
    },
    square : function(){
      return this.__square || (this.__square = Math.pow(10,this.digit - 1));
    },
    size : function(){
      return this.__size || (this.__size = this.values.length);
    },
    init : function(){
      this.foreach(function(v){
        v.value = 0;
        v.overflow = 0;
      });
      this.overflow = 0;
    },
    // 最大值无法达到9(n)...,那么只能退一位，另一位是用给进位的。
    max_digit : max_digit
  }

  var floatComp = function(){
    this.saveAge = 18;
    this.intValues = [];
    this.floatValue = [];
    var negative = false;
    // 可以用数组初始化
    this.getNegative = function(){
      return negative;
    };
    this.isFloat = false;
  }

  floatComp.prototype = {
    constrcutor : floatComp,
    append : function(){ 
      // float || int {{进，退,value},value:[value,value,value,value]}
      // backFloat
      // addInteage
    },
    beforeInset : function(){},
    add : function(){},
    sub : function(){},
    mul : function(){},
    div : function(){},
    mod : function(){},
    getIntValues : function(){
      // 获取只有数字的values，没有overFlow属性的数组。
    },
    getFloatValues : function(){
      // 获取只有数字的values，没有overFlow属性的数组。
    }
  }

  compute.intNumber = intNumber;
  compute.intNumbers = intNumbers;

  return compute;
}());

// 清除 多余的零，小数的还有整数的。--
// 用字符串，还有that.values,还有integer，还有arr,还有string类型,还有计算溢出值。
// 测试只有1位的时候有没有BUG。
// 只接受inteage类型，换成接受int和str类型,int类型不能超过Max_sale_value值。intNumbers类
// 要修改range的检测机制。intNumbers类

// （不一定要写）尝试写成自动长度类型。action(123,add,234)里面的values写成自动伸缩。