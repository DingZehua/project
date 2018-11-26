collections.base.Calculators = (function(){
  var base = collections.base;
  var Calculators = {};
  var AbstractMethod = collections.base.AbstractMethod;
  var stracture = collections.base.stracture;
  var struct = stracture.struct;
  var filterStructSet = stracture.filterStructSet;
  var baseMethod = collections.base.method;
  var eNum = collections.base.convert.englishNumber;
  var mathSign = collections.base.convert.mathSign;
  var errorInfo = base.errorInfo;
  var BASE_CONST = base.CONST;

  var CAL_ERROR = base.enumerable({'VALUE_UNDEFINED':1,'VALUE_ZERO':2,'VALUE_CORRECT':3,'METHOD_UNDEFINED':4,'STRUCT':5,})

  // 为两个值做计算的抽象类
  var AbstractClassOperation = function(){ throw new Error('This is abstract class.'); };
  AbstractClassOperation.prototype = {
    constructor : AbstractClassOperation,
    add : AbstractMethod,
    subtract : AbstractMethod,
    muliply : AbstractMethod,
    divide : AbstractMethod
  }

  AbstractClassOperation.merge(collections.base.method.typeHander);
  // 为两个值做计算的类
  var Operate = AbstractClassOperation.extend(
    function(){this.currect = this.empty;},
    {
      empty : function(){},
      currect : function(){},
      add : function(left ,right){
        for(var i = 0,len = arguments.length; i < len ; i++){
          if(!this.isNumber(arguments[i])) throw TypeError();
        }
        var square = 0;
        var a = [],b = [];
        if(Math.floor(left) !== left){
          a = (left + '').split('.');
          square += a[1].length;
        }
        if(Math.floor(right) !== right){
          b = (right + '').split('.');
          if(square < b[1].length)
            square = b[1].length;
        }
        var c = Math.pow(10,square);
        return ((left * c) + (right * c)) / c;
      },
      subtract : function(left ,right){
        for(var i = 0,len = arguments.length; i < len ; i++){
          if(!this.isNumber(arguments[i])) throw TypeError();
        }
        var square = 0;
        var a = [],b = [];
        if(Math.floor(left) !== left){
          a = (left + '').split('.');
          square += a[1].length;
        }
        if(Math.floor(right) !== right){
          b = (right + '').split('.');
          if(square < b[1].length)
            square = b[1].length;
        }
        var c = Math.pow(10,square);
        return ((left * c) - (right * c)) / c;
      },
      muliply : function(left ,right){
        for(var i = 0,len = arguments.length; i < len ; i++){
          if(!this.isNumber(arguments[i])) throw TypeError();
        }
        var square = 0;
        var a = '', b = '';
        if(Math.floor(left) !== left){
          a = (left + '').split('.');
          square += a[1].length;
          left = (a[0] * Math.pow(10,a[1].length)) + parseInt(a[1]);
        }
        if(Math.floor(right) !== right){
          b = (right + '').split('.');
          square += b[1].length;
          right = (b[0] * Math.pow(10,b[1].length)) + parseInt(b[1]);
        }
        return (left * right) / Math.pow(10,square); 
      },
      divide : function(left ,right){
        for(var i = 0,len = arguments.length; i < len ; i++){
          if(!this.isNumber(arguments[i])) throw TypeError();
        }

        if(right === 0){
          throw new errorInfo('divisor is it 0',right,
                    BASE_CONST.ERR_.PARAM,CAL_ERROR.VALUE_ZERO);
        }

        return left / right;
      },
      mod : function(left ,right){
        for(var i = 0,len = arguments.length; i < len ; i++){
          if(!this.isNumber(arguments[i])) throw TypeError();
        }
        var square = 0;
        var a = [],b = [];
        if(Math.floor(left) !== left){
          a = (left + '').split('.');
          square += a[1].length;
        }
        if(Math.floor(right) !== right){
          b = (right + '').split('.');
          if(square < b[1].length)
            square = b[1].length;
        }
        var c = Math.pow(10,square);
        return ((left * c) % (right * c)) / c;
      },
      xPowY : function(left,right){
        for(var i = 0,len = arguments.length; i < len ; i++){
          if(!this.isNumber(arguments[i])) throw TypeError();
        }
        if(right === 0 || right === -0) return 1;
        if(left < 0 && baseMethod.isFloat(right)){
          return -Math.pow(Math.abs(left),right);
        }
        return Math.pow(left,right);
      }
    }
  );
  
  //计算值状态码 0 重置状态，1为重新输入状态，2为继续输入状态
  var COMPUTE_STATUS_CODE = collections.base.enumerable({'AGAIN' : 0, 'FIRST' : 1 ,'LAST' : 2 });

  //计算值类
  var ComputeVal = function(){
    this.reset();
  }

  ComputeVal.STATUS_CODE = COMPUTE_STATUS_CODE;
  cvStatus = COMPUTE_STATUS_CODE;

  ComputeVal.prototype = {
    constructor : ComputeVal,
    reset : function(){
      this.value = '0';
      this.point = false;
      this.negative = false;
      this.status = ComputeVal.STATUS_CODE.AGAIN;
    },
    toString : function(){
      return this.value;
    },
    valueOf : function(){
      return Number(this.value);
    },
    toJSON : function(){
      return this.value;
    },
    assginTo : function(that){
      if(that instanceof ComputeVal){
        that.value = this.value;
        that.point = this.point;
        that.negative = this.negative;
      }
    },
    assginValue : function(that){
      if(that instanceof ComputeVal){
        this.value = that.value;
        this.point = that.point;
        this.negative = that.negative;
      }
    },
    get : function(){
      return this.valueOf();
    },
    set : function(v){
      var len = this.value.length;
      //处理点号
      if(v === "."){
        if(!this.point){
          this.value += v;
          this.point = !this.point;
        }
        else{
          if(this.value.slice(-1) === '.'){
            this.value = this.value.slice(0,len -1);
            this.point = !this.point;
          }
        }
      }
      //处理负号
      else if(v === "-"){
        if(this.value !== '0' && this.value !== '0.'){
          if(!this.negative){
            this.value = v + this.value;
            this.negative = true;
          }
          else{
            this.value = this.value.slice(1,len);
            this.negative = false;
          }
        }
      }
      //处理退格
      else if(v.toLowerCase() === 'b'){
        if(this.value === '0') return this;
        if(len === 1){
          this.value = '0';
        }
        else if(len === 2 && this.negative){
          this.reset();
        }
        else{
          if(this.point && this.value.slice(-1) === '.'){
            this.point = !this.point;
          }
          this.value = this.value.slice(0,len - 1);
        }
      }
      else{
        //排除掉数字以外的字符
        var ascII = v.charCodeAt();
        if(ascII >= 48 && ascII <= 57){
          if(this.value === '0') this.value = v;
          else this.value += v;
        }
      }
      this.status = ComputeVal.STATUS_CODE.LAST;
      return this;
    },
    // 当前方法不会改变变量的状态。
    toValue : function(v){
      if(v !== v
      || v === Infinity
      || v === -Infinity){ 
        throw new errorInfo('value not number.',v,
              BASE_CONST.ERR_.PARAM,CAL_ERROR.VALUE_CORRECT,
              arguments.callee,ComputeVal,this); 
      }
      var value = v + '';
      //计算结果查看是否有包含小数点或者是符号
      if(v < 0){this.negative = true;}
      else { this.negative = false; }
      if(Math.floor(v) !== v) { this.point = true; }
      else { this.point = false; }
      this.value = value;
      return this;
    },
    changedFirst : function(){
      this.status = ComputeVal.STATUS_CODE.FIRST;
    },
    changedAgain : function(){
      this.status = ComputeVal.STATUS_CODE.AGAIN;
    },
    changedLast  : function(){
      this.status = ComputeVal.STATUS_CODE.LAST;
    },
    valueStatus : function(){
      return this.status;
    }
  }

  var AbstractClassCalculator = function(){
    throw new Error('This Class is Abstract Class');
  }

  AbstractClassCalculator.prototype = {
    constructor : AbstractClassCalculator,
    arithmetic  : baseMethod.AbstractMethod,
    action      : baseMethod.AbstractMethod,
    setResult   : baseMethod.AbstractMethod,
    compute     : baseMethod.AbstractMethod,
    //读取寄存器
    memoryRead : function(){
      this.memory.assginTo(this.display);
      if(this.display !== this.result)
        this.display.changedFirst();
    },
    //清除寄存器
    memoryClear : function(){
      this.memory.reset();
    },
    //保存在寄存器
    memorySave : function() {
      this.display.assginTo(this.memory);
      this.memory.changedFirst();
    },
    //在寄存器里面做加法
    memoryAdd : function() {
      this.memory.toValue(
        this.oper.add(this.display.get(),
                      this.memory.get())
      );
    },
    //在寄存器里面做减法
    memorySubtract : function() {
      this.memory.toValue(
        this.oper.subtract(this.memory.get(),
                           this.display.get())
      );
    },
  };

  var mathMethods = {
    reciproc : function(value){
      var val = value;
      if(value === 0) { return; }

      var molecule = 1;       // 分子
      var denominator = val;  // 分母
      var negative = false;
      //查看缓存中是否存在，存在则调用出来； 解决反向运算无法还原本的值
      if(!arguments.callee['#' + val]){
        if(val < 0) {
          negative = true;
          denominator = Math.abs(val);
        }
        while(Math.floor(denominator) !== denominator){
          denominator *= 10;
          molecule    *= 10;
        }
        var temp = !negative ? molecule / denominator : (molecule / denominator) * -1;
        arguments.callee['#' + val] = temp;
        arguments.callee['#' + temp] = val;
      }
      return arguments.callee['#' + val];
    },
    sqrt : function(value){
      if(value === 0) 
        return;
      return  Math.sqrt(value);
    },
    tenPowN : function(value){
      return Math.pow(10,value);
    },
    xPow2  : function(value){
      return Math.pow(value,2);
    },
    xPow3  : function(value){
      return Math.pow(value,3);
    },
    log10 : function(value){
      if(value <= 0)
        throw new errorInfo('value must Greater than 0',value,
        BASE_CONST.ERR_['PARAM'],CAL_ERROR.VALUE_CORRECT,null,
        arguments.callee,mathMethods);
      return Math.log10(value);
    },
    sinh : function(value){
      return Math.sinh(value);
    },
    sin : function(value){
      return Math.sin(value);
    },
    cos : function(value){
      return Math.cos(value);
    },
    cosh : function(value){
      return Math.cosh(value);
    },
    tan : function(value){
      return Math.tan(value);
    },
    tanh : function(value){
      return Math.tanh(value);
    },
    convertToInt : function(value){
      return parseInt(value);
    },
    negative : function(value){
      return value * -1;
    },
    contains : function(key){
      return key in this;
    }
  }
  // 批量添加过滤规则。
  !(function(mathMethods){
    for(var name in mathMethods){
      if(mathMethods.hasOwnProperty(name) && name !== 'contains'){
        mathMethods[name] = (function(method){
          var original = method;
          return function(value){
            if(value !== value || value === Infinity || value === -Infinity) 
                throw new errorInfo('value is ' + value,value,
                BASE_CONST.ERR_['PARAM'],CAL_ERROR.VALUE_CORRECT,
                null,original,mathMethods);
              return original(value);
          }
        }(mathMethods[name]));
      }
    }
  }(mathMethods));

  // CalculatorClass
  var CalculatorV1 = function(leftSide, rightSide, result, memory, oper, set, maxCount){
    var cmpV = {
      leftSide : { value : leftSide, writable: false,configurable : false,enumerable : true },
      rightSide : { value : rightSide, writable: false,configurable : false,enumerable : true},
      result : { value : result, writable: false,configurable : false,enumerable : true},
      memory : { value : memory, writable: false,configurable : false,enumerable : true}
    }

    //左右操作符
    Object.defineProperties(this,cmpV);
    //计算函数
    this.oper = oper;
    // 当前输入的操作符
    this.input = leftSide;
    // 当前显示的操作符
    this.display = leftSide;
    // 寄存器
    this.memory = memory;
    //保存左右操作符
    this.set = set;
    this.set.add(leftSide,rightSide,result);
    //限制能显示的个数
    this.maxCount = maxCount || 18;
  }

  AbstractClassCalculator.extend(CalculatorV1,{
    //重置所有数据
    reset : function(){
      this.set.foreach(function(v){
        v.reset();
      });
      this.input = this.leftSide;
      this.display = this.leftSide;
      this.oper.currect = this.oper.empty;
    },
    //执行动作
    action : function(key){
      switch(key){
        case 'MR': this.memoryRead(); break;
        case 'MC': this.memoryClear(); break;
        case 'MS': this.memorySave(); break;
        case 'M+': this.memoryAdd(); break;
        case 'M-': this.memorySubtract(); break;
        case '+' : case '-' : case '*' : 
        case '/' : this.arithmetic(key); break;           // 设置符号
        case 'AC': this.reset();break;                    // 重置所有数据
        case '=' :
        case 'Enter' : this.setResult(); break;           // 计算结果
        case 'C' : case 'Escape' :
        case 'Esc' : this.setZero(); break;               // 设置为0
        case '←':
        case 'Backspace' : this.Backspace();break;        // 退格
        case '±' : this.negative();break;                 // 正负
        case '%' : this.percent(); break;                 // 百分比
        case '√' : this.sqrt();break;                     // 根号
        case '1/x' : this.reciproc();break;               // 倒数
        case '.' : case '0': case '1': case '2': case '3': case '4': 
        case '5' : case '6': case '7': case '8': case '9': this.setValue(key);break;
      }
      return this.display.toString();
    },
    //四则运算
    arithmetic : function(key){
      //如果为重置状态那么复制left的值
      if(this.input === this.leftSide 
      && this.rightSide.status === ComputeVal.STATUS_CODE.AGAIN
      || (this.leftSide.status === ComputeVal.STATUS_CODE.LAST 
      &&  this.rightSide.status === ComputeVal.STATUS_CODE.FIRST)) { 
        this.leftSide.assginTo(this.rightSide); 
        this.leftSide.changedFirst();
      }
      //如果为重写状态，并且result是last那么复制result的值
      else if(this.result.status === ComputeVal.STATUS_CODE.LAST
           && this.rightSide.status === ComputeVal.STATUS_CODE.FIRST) {
        this.result.assginTo(this.rightSide);
      }
      //如果是续写状态时，那么则计算该值
     if(this.rightSide.status === ComputeVal.STATUS_CODE.LAST){ 
       // 如果result 等于AGAIN那么计算left right ，否则 计算 right result
        if(this.result.status === ComputeVal.STATUS_CODE.AGAIN){
          this.compute();
        }
        else{
          this.compute(this.result);
        }
      }
      else{
        //如果是重新输入，那么则改为this.right
        this.display = this.rightSide;
      }
      //改写状态
      this.rightSide.changedFirst();
      this.input = this.rightSide;
      //选择四则运算函数
      switch(key){
        case '+' : this.oper.currect = this.oper.add; break;
        case '-' : this.oper.currect = this.oper.subtract; break;
        case '*' : this.oper.currect = this.oper.muliply; break;
        case '/' : this.oper.currect = this.oper.divide; break;
      }
    },
    // 使用等于号时
    setResult : function(){
      if(this.rightSide.status !== ComputeVal.STATUS_CODE.AGAIN){
        //将rightSide.status更改为重写状态，以防在重新选择符号时再次计算
        this.rightSide.changedFirst();
        //如果result为AGAIN状态，那么将计算left right值,否则计算result 和 right值.
        if(this.result.status === ComputeVal.STATUS_CODE.AGAIN){
          this.compute();
        }
        else{
          this.compute(this.result);
        }
      }
      this.input = this.leftSide;
      this.leftSide.changedFirst();
    },
    // 计算该值
    compute : function(leftSide){
      var leftSide = leftSide || this.leftSide;
      this.result.toValue(
        this.oper.currect(
          leftSide.get(),
          this.rightSide.get()
        )
      );
      //计算完之后result将变成LAST状态可以计算值。
      this.result.status = ComputeVal.STATUS_CODE.LAST;
      // 计算后将显示的权力转换到result对象上
      this.display = this.result;
    },
    // 百分比
    percent : function(){
      if(this.rightSide.status === ComputeVal.STATUS_CODE.AGAIN){
        this.setZero(); 
        return;
      }
      if(this.display === this.result){
        this.display.toValue(
        this.result.get() * this.rightSide.get() / 100
        );
        return;
      }
      else if(this.display === this.leftSide){
        this.display.toValue(
        this.leftSide.get() * this.rightSide.get() / 100
        );
      }
      else {
        if(this.result.status === ComputeVal.STATUS_CODE.AGAIN){
          this.display.toValue(
          this.leftSide.get() * this.rightSide.get() / 100
          );
        }
        else{
          this.display.toValue(
          this.result.get() * this.rightSide.get() / 100
          );
        }
      }
      this.display.changedFirst();
    }, 
    // 根号
    sqrt : function(){
      var val = this.display.valueOf();
      if(this.display.valueOf() === 0) 
        return;
      if(val !== val || val === Infinity || val === -Infinity) 
        throw new TypeError(' value is ' + val);
      this.display.toValue(
        Math.sqrt(this.display.valueOf())
      );
      if(this.display !== this.result)
        this.input.changedFirst();
    },
    // 正负号
    negative : function() {
      this.display.set('-');
    },
    Backspace : function(){
      //重写状态下不做退格操作
      if(this.display.status === ComputeVal.STATUS_CODE.FIRST){
        return;
      }
      if(this.display !== this.result)
        this.setValue('b');
    },
    setZero : function(){
      this.display.value = '0';
      if(this.display !== this.result)
        this.input.changedFirst();
    },
    setValue : function(key){
      // 如果为重写状态时，将值复制为0，并改写状态
      if(this.input.status === ComputeVal.STATUS_CODE.FIRST){ 
        this.input.reset();
        this.input.status = ComputeVal.STATUS_CODE.LAST; 
      }
      this.input.set(key);
      this.display = this.input;
      // 如果是left输入状态，那么将result变更为AGAIN状态
      if(this.input === this.leftSide) { this.result.reset(); }
    },
    // 倒数
    reciproc : function(){
      var val = this.display.valueOf();
      if(this.display.valueOf() === 0) 
        return;
      if(val !== val || val === Infinity || val === -Infinity) 
        throw new TypeError('input value is ' + val);

      var molecule = 1;       // 分子
      var denominator = val;  // 分母
      var negative = false;
      //查看缓存中是否存在，存在则调用出来； 解决反向运算无法还原本的值
      if(!arguments.callee['#' + val]){
        if(val < 0) {
          negative = true;
          denominator = Math.abs(val);
        }
        while(Math.floor(denominator) !== denominator){
          denominator *= 10;
          molecule    *= 10;
        }
        var temp = !negative ? molecule / denominator : (molecule / denominator) * -1;
        arguments.callee['#' + val] = temp;
        arguments.callee['#' + temp] = val;
      }
      this.display.toValue(arguments.callee['#' + val]);
      if(this.display !== this.result)
        this.input.changedFirst();
    }
  });


  var SIGN_GRADE = collections.base.enumerable({
    'add' : 2,'subtract':2,'muliply':1,'divide':1,'mod':1,'xPowY':1
  });

  var WORD_SIGN = collections.base.enumerable({
    'add' : '+','subtract':'-','muliply':'*','divide':'÷','mod':'mod','xPowY':'^'
  });

  // 加上数学函数名称
  var getDetailProcess = function(mathMethods,value){
    return mathMethods.reduce(
        function(a,b){
          return b + '(' + a + ')';
        },value
    );
  }

  // 计算数学函数
  var computeProcess = function(mathMethods,mathNames,value){
    return mathNames.reduce(
        function(value,name){
          if(!mathMethods.contains(name)){
            throw new errorInfo('This method not exists.',
                      name,BASE_CONST.ERR_['VIST_UNDEFINED'],
                      CAL_ERROR.METHOD_UNDEFINED,
                      filterStructSet,arguments.callee,this);
          }
          return mathMethods[name](value);
        },value
    );
  }

  var OneComVal = function(level,value){
    this.level = level || 0;
    this.mathNames = [];
    struct.call(this,new ComputeVal());
    value && this.value.toValue(value);
    // 这里添加数学函数列表功能，用泛型,或者用组合函数。
  }

  struct.extend(OneComVal,{
    toString      : function(){
      return getDetailProcess(this.mathNames,this.value.get());
    },
    valueOf       : function(){
      return computeProcess(this.mathMethods,
                            this.mathNames,
                            this.value.get()
                            );
    },
    get : function(){ return this.valueOf(); },
    set : function(key){this.value.set(key); },
    setZero : function(){
      this.value.reset();
      this.value.changedFirst();
      baseMethod.clealArr(this.mathNames);
    },
    assginTo : function(that){
      that.value.toValue(this.get());
    },
    reset : function(){
      this.value.reset();
    },
    changedFirst : function(){
      this.value.changedFirst();
    },
    toValue     : function(value){
      this.value.toValue(value);
    },
    mathMethods   : mathMethods
  });
  
  var ComSign = function(level,sign){
    this.level = level || 0;
    struct.call(this,sign);
  }
  struct.extend(ComSign,{toString : function(){return WORD_SIGN[this.value].value;}});

  var Calv2Engine = function(level,parent){
    this.oper = new Operate();
    this.level = level || 0;
    this.result = new OneComVal(this.level);
    this.signs = [];
    this.parent = parent || null;
    filterStructSet.apply(this,baseMethod.array(arguments,2));
  }

  filterStructSet.extend(Calv2Engine,
    {
      // 添加变量节点
      appendValue : function(value,oneCompV){
        if(this.foot && !(this.foot instanceof ComSign))
          throw new errorInfo('Please check foot node it is comsign Object.',
                this.foot,BASE_CONST.ERR_['OPER'],CAL_ERROR.STRUCT,
                filterStructSet,arguments.callee);
        var valueNode = oneCompV || this.createValue(value);
        this.add(valueNode);
        return valueNode;
      },
      //添加符号节点
      appendSign : function(comSign){
        if( this.head === null 
        || !(this.foot instanceof OneComVal) 
        && !(this.foot instanceof Calv2Engine))
          throw new errorInfo('Please check head and foot node is it null or ' + 'foot node it is comsign Object.',
                this.foot,BASE_CONST.ERR_['OPER'],CAL_ERROR.STRUCT,
                filterStructSet,arguments.callee);
        var signNode = this.createSign(comSign);
        this.add(signNode);
        this.signs.push(signNode);
        //调整计算顺序
        this.computeSort();
        return signNode;
      },
      //添加节点
      add : function(){
        filterStructSet.prototype.add.apply(this,arguments);
        return this;
      },
      // 添加子节点
      appendChildNode : function(oneComVal){
        if(oneComVal && !(oneComVal instanceof OneComVal) && !(oneComVal instanceof Calv2Engine))
          throw new errorInfo('parameter oneComVal must is OneComVal class.',
                    oneComVal,BASE_CONST.ERR_['OPER'],CAL_ERROR.STRUCT,
                    filterStructSet,arguments.callee);
          // 建立子节点，并添加到节点中,createChild后面两个参数是不做修改。
        this.add(this.createChild(this.level + 1,this,oneComVal));
        return this.foot;
      },
      // 按照加减乘除的先后顺序排序
      computeSort : function(){
        this.signs.sort(function(obj1,obj2){
          return baseMethod.ascend(obj1.value,obj2.value);
        });
        return this.signs;
      },
      // 将最后一个子节点添加到子节点
      upgrade : function(){
        if(!(this.foot instanceof OneComVal) && !(this.foot instanceof Calv2Engine))
          throw new errorInfo('foot not correct type.',
                  this.foot,BASE_CONST.ERR_['OPER'],CAL_ERROR.STRUCT,
                  filterStructSet,arguments.callee);
        this.foot.level = this.level + 1;
        this.remove(this.foot);
        this.appendChildNode(this.nodes.splice(-1)[0]);
      },
      // 计算
      compute : function(signNode){
        var left = signNode.pre,
            right = signNode.next;
        var leftComV = left,
            rightComV = right;
        if(left instanceof Calv2Engine){
          leftComV = left.allCompute();
        }
        if(right instanceof Calv2Engine){
          rightComV = right.allCompute();
        }
        var node = this.createValue();
            node.value.toValue(
              this.oper[signNode.value](
                leftComV.get(),rightComV.get()
              )
            );
        // 移除在链表上的节点，而不是移除变量对象。
        //this.replace(node,left).remove(right,signNode);
        this.insertBefore(node,left).remove(left,signNode,right);
        leftComV.value.changedFirst();
        rightComV.value.changedFirst();
        // return OneCompV
        return node;
      },
      // 整个公式计算
      allCompute : function(){
        // computeVal换成oneCompV对象
        // 保持整个公式有一个计算对象存在。
        var tempCompV = new ComputeVal();
        if(this.head === this.foot){
          if(this.head instanceof  Calv2Engine){
            // 如果只有一个子公式，那么则继续往下调用。
            tempCompV.toValue(
              this.head.allCompute().get()
            );
          }
          else if(this.head === null){
            this.add(this.createValue());
            tempCompV.toValue(this.head.get());
          }
          else if(this.head instanceof OneComVal){
            //只有一个值的时候，复制给临时变量，然后返复制给result。
            tempCompV.toValue(this.head.get());
          }
        }
        else{
          for(var i = 0,len = this.signs.length; i < len ; i++){
            this.compute(this.signs[i]);
          }
          tempCompV.toValue(this.head.get());
        }
        this.result.value.toValue(tempCompV.get());
        this.result.value.changedFirst();
        this.init();
        // return OneCompV
        return this.result;
      },
      //重新建立链表
      init : function(){
        // 调用父类方法
        this.foreach(this.remove,this);
        this.remove(this.result);
        //清空完毕之后再次恢复到初始状态
        for(var i = 0,len = this.nodes.length; i < len ; i++){
          this.append(this.nodes[i]);
        }
      },
      // 创建计算变量
      createValue : function(value){
        return new OneComVal(this.level,value);
      },
      // 创建运算符变量
      createSign : function(sign){
        return new ComSign(this.level,sign);
      },
      // 创建链表对象
      createChild : function(level,parent,Com){
        var level = level || this.level + 1;
        (Com) && (Com.level = level);
        return new Calv2Engine(level,parent,Com || new OneComVal(level));
      },
      reduceResult : function(){
        // 将公式里的值计算进去，然后清除掉。
        try{
          return this.result.value.toValue(
                 this.result.get()
                 ).get();
        }
        finally{
          baseMethod.clealArr(this.result.mathNames);
        }
      },
      footReset : function(){
        if(this.head === null 
        || this.foot instanceof ComSign){
          throw new errorInfo('foot node is incorrect type.',
                this.foot,BASE_CONST.ERR_['OPER'],CAL_ERROR.STRUCT,
                filterStructSet,arguments.callee);
        }
        this.remove(this.foot);
        this.nodes.splice(-1,1);
        return this.appendValue();
      },
      toString : function(){
        if(this.parent === null && this.head === this.foot
          && this.head instanceof OneComVal
          && this.head.value.status !== cvStatus.LAST
          // 这里要判断是否有公式，是因为在加入公式的时候会将状态设置为FIRST状态。
          && this.head.mathNames.length === 0
          && this.result.value.status !== cvStatus.AGAIN){
            return this.result.toString();
        }
        var detailProcess =  '';
        this.foreach(
          function(node){
            // 处理OneCompV节点。
            if(!Calv2Engine.prototype.isPrototypeOf(node)){
              // 在输入状态下不显示指数。
              if(node.value.status === cvStatus.LAST){
                detailProcess += node.value.toString();
              }
              else{
                detailProcess += node.toString();
              }
            }
            else{
            // 处理 Calv2Engine节点。
              var temp = node.toString();
              if(node.result.mathNames.length > 0){
                detailProcess += getDetailProcess(node.result.mathNames,temp);
              }
              else{
                detailProcess += '(' + node.toString() + ')';
              }
            }
          },this
        );
        return detailProcess;
      },
      valueOf  : function(){
        if(this.parent === null && this.head === this.foot
          && this.head instanceof OneComVal
          && this.head.value.status !== cvStatus.LAST
          && this.result.value.status !== cvStatus.AGAIN){
            return this.result.valueOf();
          }
        else{
          var resultNode = this.allCompute();
          /* return Number */
          return computeProcess(resultNode.mathMethods,
                                resultNode.mathNames,
                                resultNode.value.get());
        }
      },
      get : function(){
        return this.valueOf();
      },
      resetResult : function(){
        this.result.value.reset();
      }
    }
  );
  Calv2Engine.SIGN = SIGN_GRADE;
  Calv2Engine.ComVal = ComputeVal;
  
  // key值所调用的方法,所有的key要写成小写模式。
  var actionName = {
    'memory_clear'      : {'methodName':'memoryClear','value':null},
    'memory_read'       : {'methodName':'memoryRead','value':null},
    'memory_save'       : {'methodName':'memorySave','value':null},
    'memory_add'        : {'methodName':'memoryAdd','value':null},
    'memory_subtract'   : {'methodName':'memorySubtract','value':null},
    'backspace'         : {'methodName':'setValue','value':'b'},
    'allclear'          : {'methodName':'allClear','value':null},
    'clear'             : {'methodName':'clear','value':null},
    'negative'          : {'methodName':'addMath','value':'negative'},
    'sqrt'              : {'methodName':'addMath','value':'sqrt'},
    'divide'            : {'methodName':'arithmetic','value':SIGN_GRADE.divide},
    'muliply'           : {'methodName':'arithmetic','value':SIGN_GRADE.muliply},
    'subtract'          : {'methodName':'arithmetic','value':SIGN_GRADE.subtract},
    'add'               : {'methodName':'arithmetic','value':SIGN_GRADE.add},
    'xpowy'             : {'methodName':'arithmetic','value':SIGN_GRADE.xPowY},
    'mod'               : {'methodName':'arithmetic','value':SIGN_GRADE.mod},
    //'percent'           : {'methodName':'percent','value':null},
    'reciproc'          : {'methodName':'addMath','value':'reciproc'},
    'one'               : {'methodName':'setValue','value':'1'},
    'two'               : {'methodName':'setValue','value':'2'},
    'three'             : {'methodName':'setValue','value':'3'},
    'four'              : {'methodName':'setValue','value':'4'},
    'five'              : {'methodName':'setValue','value':'5'},
    'six'               : {'methodName':'setValue','value':'6'},
    'seven'             : {'methodName':'setValue','value':'7'},
    'eight'             : {'methodName':'setValue','value':'8'},
    'nine'              : {'methodName':'setValue','value':'9'},
    'zero'              : {'methodName':'setValue','value':'0'},
    'point'             : {'methodName':'setValue','value':'.'},
    'left_parenthese'   : {'methodName':'leftParenthese','value':null},
    'right_parenthese'  : {'methodName':'rightParenthese','value':null},
    'enter'             : {'methodName':'setResult','value':null},
    'tenpown'           : {'methodName':'addMath','value':'tenPowN'},
    'xpow2'             : {'methodName':'addMath','value':'xPow2'},
    'xpow3'             : {'methodName':'addMath','value':'xPow3'},
    'log10'             : {'methodName':'addMath','value':'log10'},
    'sinh'              : {'methodName':'addMath','value':'sinh'},
    'sin'               : {'methodName':'addMath','value':'sin'},
    'cosh'              : {'methodName':'addMath','value':'cosh'},
    'cos'               : {'methodName':'addMath','value':'cos'},
    'tanh'              : {'methodName':'addMath','value':'tanh'},
    'tan'               : {'methodName':'addMath','value':'tan'},
    'converttoint'      : {'methodName':'addMath','value':'convertToInt'},
    'pi'                : {'methodName':'pi','value':null}
  }

  var Active = function(key,methodName,value){
    this.key = key;
    this.methodName = methodName;
    this.value = value;
    Object.defineProperty(this,'defaultValue',{
      configurable : false,
      writable     : false,
      enumerable   : true,
      value        : this.value
    })
  }

  Active.prototype = {
    constructor : Active,
    active      : function(oThis){
      // 调用oThis对象中对应的方法，如果没有对应的方法则会发生，未捕获的错误。Uncaptured
      if(!oThis instanceof Object){
        throw new errorInfo('oThis must is a Object',
                  oThis,BASE_CONST.ERR_['OPER'],CAL_ERROR.VALUE_CORRECT,
                  Active,arguments.callee); 
      }
      if(!oThis[this.methodName] 
      || typeof oThis[this.methodName] !== 'function'){
        throw new errorInfo('This method has been not defined',
              this.methodName,BASE_CONST.ERR_['VIST_UNDEFINED'],CAL_ERROR.METHOD_UNDEFINED,
              Active,arguments.callee); 
      }
      var value = this.value;
      this.value = this.defaultValue;
      if(this.omit){
        return this.omit(value) ? 
        oThis[this.methodName](value) : 
        oThis[this.methodName]();
        //可以使用array.every和some函数
      }
      return oThis[this.methodName](value);
    }
  }

  //加个过滤函数，可以过滤类。

  var ActiveSet = function(){
    this.values = {};
    this.add.apply(this,arguments);
  }
  ActiveSet.prototype = {
    constructor : ActiveSet,
    add : function(){
      var args = arguments;
      if(args[0] && args[0] instanceof Active || null /* 更多的类方法 */){
        for(var i = 0,len = args.length; i < len; i++){
          var key = args[i].key;
          this.values[key] = args[i];
        }
      }
      else if(args[0] && args[0] instanceof Object){
        var obj = args[0];
        for(var key in obj){
          if(!args[0].hasOwnProperty(key)) continue;
          this.values[key] = new Active(key,obj[key].methodName,obj[key].value);
        }
      }
    },
    active : function(key,oThis){
      if(!this.contains(key)){
        // return false 或者报告异常
        throw new errorInfo('This key not exists on values',
              key,BASE_CONST.ERR_['VIST_UNDEFINED'],CAL_ERROR.METHOD_UNDEFINED,
              ActiveSet,arguments.callee);
      }
      // 如果key不在此列表中，那么则会获得undefined,而后会引发undefined.methodName调用对象的异常。
      var active = this.values[key];
      return Active.prototype.active.call(active,oThis);
    },
    foreach : function(f,cxt){
      for(var key in this.values){
        var value = this.values[key];
        if(this.values.hasOwnProperty(key)){
          f.call(cxt,value);
        }
      }
    },
    foreachActive : function(oThis){
      for(var key in this.values){
        var value = this.values[key];
        if(!args[0].hasOwnProperty(key)) continue;
        this.active(value.key,oThis);
      }
    },
    contains : function(key){
      return this.values.hasOwnProperty(key);
    }
  }
  
  // V2版本计算器。
  var CalculatorV2 = AbstractClassCalculator.extend(
    function CalculatorV2(maxCount){
      this.root = new Calv2Engine(0,null,new OneComVal());
      this.memory = new OneComVal();
      this.input = this.root.foot;
      this.display = this.input;
      this.oper = new Operate();
      this.cur = this.root;
      // 异常处理器
      this.exception = calv2Exception;
      this.exception.oThis(this);
      // 反馈结果
      this.result = {
        error   : false,
        process : '0',
        value   : '0',
        memory  : '0',
        level   : this.cur.level
      };
      // 限制能显示的个数
      // this.maxCount = maxCount || 18;
    },
    {
      // 入口函数。
      action : function(key) {
        // 用key值调用当前对象的属性或者是方法
        // 等价于以下的表达式this[key],this[active.methodName]
        key = this.ConverToWord(key); 
        try{
          if(!this.result.error){
            var value = '0';
            CalculatorV2.activeSet.active(key,this);
            // 处理在输入状态下小数点后面无法输入0.
            if(this.display.value.status !== cvStatus.LAST){
              value = this.display.get();
            }
            else{
              value = this.input.value.value;
            }

            // 如果结果是Infinity,那么这则直接报错。
            if(Math.abs(value) === Infinity){
              throw new errorInfo('Compute value is Infinity.',
                        value,BASE_CONST.ERR_.PARAM,CAL_ERROR.VALUE_CORRECT);
            }
            this.result.level = this.cur.level;
            this.result.value = value + ''; // 转换成字符串。
            this.result.error = false;
            this.result.memory = this.memory.value.value;
          }
          else{
            if(key === 'clear' || key === 'allclear'){
              CalculatorV2.activeSet.active(key,this);
            }
          }
        }
        catch(e){
          this.exception.exce(e);
        }
        this.result.process = this.root.toString();
        return this.result;
      },
      // 添加数学函数。
      addMath : function(name){
        var oneCompV = null;
        var curCal = this.cur;
        if(curCal.head === this.cur.foot
        && curCal.head instanceof OneComVal
        && curCal.head.value.status !== cvStatus.LAST
        && curCal.result.value.status !== cvStatus.AGAIN){
          oneCompV = curCal.result;
        }
        else{
          oneCompV = this.getOneCompV(curCal);
        }
        oneCompV.mathNames.push(name);

        this.display.value.changedFirst();
      },
      leftParenthese : function(){
        var curCal = this.cur;
        // 如果只剩下一个值，那么则取消oper中的运算符。
        if(curCal.nodes.length === 1 && curCal.head instanceof OneComVal){
          curCal.oper.currect = curCal.oper.empty;
        }

        // 这里必须是计算完之后才会将result的值赋值给headCompV
        // 要多一个计算函数，然后才能赋值过去。
        this.resultAssignHead();
        // 如果这个值是新建的话，也就是AGAIN状态的话，那么这清零，只有在四则运算之后新建的值才是AGAIN状态，其他情况下都是FIRST。
        if(curCal.foot && curCal.foot instanceof OneComVal){
          var footOneCV = curCal.foot;
          if(footOneCV.value.status === cvStatus.AGAIN){
            this.setZero();
          }
          this.input = footOneCV;
          this.display = this.input;
          // 将Last状态，修改成First状态，变成一个重新可以修改的状态。
          footOneCV.value.changedFirst();
          curCal.upgrade();
          // 将当前的计算公式权力转交给最后一个子公式。
          this.cur = curCal.foot;
        }
        else if(curCal.foot && curCal instanceof Calv2Engine){
          var footOneCal = curCal.foot;
          var ResultOneCV = footOneCal.result;
          // 如果此子公式已经计算过的话，那么则移除掉，然后再建立一个子公式。
          if(ResultOneCV.value.status === cvStatus.FIRST){
            curCal.remove(curCal.foot);
            // 将当前的计算公式权力转交给最后一个子公式。
            this.cur = curCal.appendChildNode();
            // 把显示权和输入权移交给最后一个ComV对象
            this.input = this.cur.head;
            this.display = this.input;
          }
        }
      },
      rightParenthese : function(){
        if(this.cur === this.root) return;
        this.cur.allCompute();
        this.display = this.cur.result;
        // 将公式计算权回退给父节点。
        this.cur = this.cur.parent;
      },
      setValue : function(key){
        // 如果最后一个是子公式，那么则删除这个子公式。
        if(this.cur.foot instanceof Calv2Engine){
          if(key === 'b') {
            return;
          }
          this.input = this.cur.footReset();
        }

        // 输入状态下，变量取得显示权。
        this.display = this.input;
        if(this.input.value.status === cvStatus.AGAIN 
        || this.input.value.status === cvStatus.FIRST){
          if(key === 'b'){
            return;
          }
          // 把mathNames释放掉。
          this.input.setZero();
        }
        // 输入完之后，重置result,不然toString将判定为结果状态，直接获取result的计算公式。
        this.cur.result.value.status = cvStatus.AGAIN;
        this.input.value.set(key);
      },
      arithmetic : function(SIGN){
        // 查询尾部是否是链表
        var curCal = this.cur;
        if(curCal.foot instanceof Calv2Engine){
          // 计算结果，然后放置在result中
          curCal.allCompute();
          // 添加符号
          curCal.appendSign(SIGN);
          curCal.appendValue().value.toValue(curCal.result.get());
          // 重新排列计算顺序
          curCal.computeSort();
          this.input = curCal.foot;
          this.display = this.input;
        }
        else{
          var footOneComV = curCal.foot;
          // 如果变量为首写或者是重置状态。
          if(footOneComV.value.status === cvStatus.AGAIN
          || footOneComV.value.status === cvStatus.FIRST
          && curCal.foot.mathNames.length < 1){
            if(curCal.head === curCal.foot){
              // 这里必须是计算完之后才会将result的值赋值给headCompV
              this.resultAssignHead();
              // 如果存在数学函数则计算。
              if(curCal.foot.mathNames.length > 0) {
                curCal.allCompute();
              }
              // 如果只有一个oneComV对象，那么则直接添加，符号和计算对象(oneCompV)
              var headOneComV = curCal.head;
              headOneComV.value.changedFirst();
              curCal.appendSign(SIGN);
              curCal.appendValue().value.toValue(headOneComV.get());
              this.input = curCal.foot;
              this.display = this.input;
            }
            else{
              //如果不指一个，那么则修改运算符
              var preSignNode = curCal.foot.pre;
              preSignNode.value = SIGN;
              curCal.computeSort();
            }
          }
          else{
            // 如果是续写状态，那么则计算结果
            // 计算结果，然后放置在result中
            curCal.allCompute();
            curCal.appendSign(SIGN);
            curCal.appendValue().value.toValue(curCal.result.get());
            curCal.computeSort();
            this.input = curCal.foot;
            this.display = this.input;
          }
          // 根目录只剩下一个，可以用于计算。
          this.cur.oper.currect = this.cur.oper[SIGN];
        }
      },
      setResult : function(){
        this.cur = this.root;
        var cur = this.cur;
        // -<1>-
        if(cur.nodes.length === 1 
        && cur.head instanceof OneComVal){
          // 如果当前是根目录，并且剩下一个值，那么则调用根目录第一个值还有跟根目录最后一个符号和
          // 根目录result做计算,如果没有符号，那么则不计算。
          if(cur.oper.currect !== cur.oper.empty){
            cur.result.value.toValue(
              cur.oper.currect(
                cur.result.get(),cur.head.get()
              )
            );
          }
          else if(this.display === this.input && this.display !== this.cur.result){
            cur.result.value.toValue(this.input.get());
            cur.footReset();
          }
          this.display = cur.result;
          // 如果result没有得到input权力的话那么只有1个ComputeV永远会和head运算，不管head输入什么。
          this.input = this.display;
          // 将公式里的值计算进去，然后清除掉。
          this.cur.reduceResult();
          // 处理计算器初始状态下，只有一位操作数，确认结果后，head.value还是LAST续写状态。
          this.cur.head.value.changedFirst();
          this.cur.result.value.changedFirst();
          return;
        }
        // -<1>-
        var tempCompV = new ComputeVal();
        this.cur.allCompute();
        if(this.cur.foot instanceof OneComVal){
          tempCompV.toValue(
            this.cur.foot.get()
          );
        }
        else if(this.cur.foot instanceof Calv2Engine){
          tempCompV.toValue(
            this.cur.foot.result.get()
          );
        }
        this.init().value.toValue(
          tempCompV.get()
        );
        this.cur.head.value.changedFirst();
        // 将公式里的值计算进去，然后清除掉。
        this.cur.reduceResult();
        // 之所以要把显示权放到，这里是因为在所有的nodes节点释放之后重新新建的，没有输入权。
        this.input = this.cur.result;
        this.display = this.input;
      },
      resultAssignHead : function(){
        if(this.display === this.cur.result
          && this.display.value.status !== cvStatus.AGAIN
          && this.cur.head.value.status !== cvStatus.LAST){
             this.cur.head.value.toValue(
              this.display.get()
            );
          this.cur.head.mathNames = baseMethod.clealArr(this.cur.result.mathNames);
        }
      },
      ConverToWord : function(key){
        // 将key转换成小写。
        key = key.toLowerCase();
        if(CalculatorV2.eNum[key]){
          // 将字符转换成英文单词
          var key = CalculatorV2.eNum[key].valueOf();
        }
        else if(CalculatorV2.mathSign[key]){
          // 将字符转换成英文单词
          var key = CalculatorV2.mathSign[key].valueOf();
        }
        return key;
      },
      getOneCompV : function(curCal){
        if(curCal.foot instanceof OneComVal){
          return curCal.foot;
        }
        else{
          return curCal.foot.result;
        }
      },
      // memory都是对display进行操作。
      memoryRead  : function(){
        this.cur.footReset();
        this.input = this.cur.foot;
        this.display = this.input;
        this.display.value.changedFirst();
        this.cur.result.value.changedAgain();
        AbstractClassCalculator.prototype.memoryRead.call(this);
      },
      memoryClear : function(){
        this.display.value.changedFirst();
        AbstractClassCalculator.prototype.memoryClear.call(this);
      },
      memorySave  : function(){
        this.display.value.changedFirst();
        AbstractClassCalculator.prototype.memorySave.call(this);
      },
      memoryAdd   : function(){
        this.display.value.changedFirst();
        AbstractClassCalculator.prototype.memoryAdd.call(this);
      },
      memorySubtract  : function(){
        this.display.value.changedFirst();
        AbstractClassCalculator.prototype.memorySubtract.call(this);
      },
      pi : function(){
        if(this.cur.foot instanceof Calv2Engine){
          this.input = this.cur.footReset();
        }
        this.display = this.input;
        this.display.value.value = Math.PI;
        this.display.value.changedFirst();
        // 输入权是result的时候不清空。
        if(this.display !== this.cur.result){
          this.cur.resetResult();
        }
      },
      setZero : function(){
        if(this.cur.foot instanceof Calv2Engine){
          this.input = this.cur.footReset();
        }
        this.display = this.input;
        this.display.value.value = '0';
        this.display.value.changedFirst();
        baseMethod.clealArr(this.display.mathNames);
      },
      // 初始化公式
      init : function(){
        this.cur = this.root;
        this.cur.foreach(this.cur.remove,this.cur);
        this.cur.nodes.splice(0);
        this.cur.signs.splice(0);
        return this.cur.appendValue();
      },
      // 清空计算公式。
      allClear : function(){
        this.resetResult();
        this.input = this.init();
        this.cur.resetResult();
        this.display = this.input;
        this.cur.oper.currect = this.cur.oper.empty;
      },
      // 清除当前变量。
      clear : function(){
        this.resetResult();
        this.cur.resetResult();
        this.setZero();
        if(this.cur.nodes.length === 1 && this.cur.head instanceof OneComVal){
          this.cur.oper.currect = this.cur.oper.empty;
        }
      },
      // 初始化反馈结果。
      resetResult : function(){
        this.result.error = false;
        this.result.value = '0';
        this.result.level = this.cur.level;
        this.result.process = '0';
        baseMethod.clealArr(this.cur.result.mathNames);
      }
    },
    {
      activeSet : new ActiveSet(actionName),
      eNum : eNum, // 数字转换成英文单词
      mathSign : mathSign, // 数学符号转换成英文单词
    }
  );

  // 处理计算器中的异常。
  var calv2Exception = new base.exceptionClass(BASE_CONST.ERR_,{
    // 这里的This指针指向CalculatorV2对象。
    'PARAM' : function(eInfo){
      this.result.error = true;
      if(eInfo.cause === CAL_ERROR.VALUE_CORRECT){
        if(Math.abs(eInfo.value) === Infinity){
          this.result.value = '超出最大计算值';
        }
        else if(eInfo.value === 0){
          this.result.value = '最后的操作数不能为0';
        }
        else if(isNaN(eInfo.value)){
          this.result.value = '计算结果错误';
        }
      }
      else if(eInfo.cause === CAL_ERROR.VALUE_ZERO){
        this.result.value = '除数不能为0';
      }
    },
    'VIST_UNDEFINED' : function(){
      console.log('功能尚未开发');
    }
  },function(eInfo){ throw eInfo;},CalculatorV2);

  Calculators.Operate = Operate;
  Calculators.AbstractClassOperation = AbstractClassOperation;
  Calculators.ComputeVal = ComputeVal;
  Calculators.CalculatorV1 = CalculatorV1;
  Calculators.Calv2Engine = Calv2Engine;
  Calculators.CalculatorV2 = CalculatorV2;

  return Calculators;
}());
