collections.base.convert = (function(){
  var convert = {};
  var base = collections.base;
  var upperNumber = base.enumerable({'0':'零','1':'壹','2':'贰',
                                '3':'叁','4':'肆','5':'伍',
                                '6' :'陆','7':'柒','8':'捌','9':'玖'});
  var digit = base.enumerable({'-1':'角','-2':'分',
                          '1':'元','2':'拾','3':'佰','4':'仟','5':'万','6':'拾','7':'佰','8':'仟','9':'亿'});

  var englishNumber = base.enumerable({'.':'point','1' :'one','2':'two',
                                       '3':'three' ,'4':'four','5':'five','6':'six','7':'seven',
                                      '8':'eight','9':'nine','0':'zero'});
  var mathSign = base.enumerable({ '(' : 'left_parenthese' , ')' : 'right_parenthese',
                                  '+' : 'add','-' : 'subtract','*':'muliply','/':'divide',
                                  '=' : 'enter'
  });
  var ToupperNumber = function(values){
    this.set(values);
  }

  ToupperNumber.upperNumber = upperNumber;
  ToupperNumber.digit = digit;
  ToupperNumber.limit = 1000000000;

  ToupperNumber.prototype = {
    constructor : ToupperNumber,
    toString    : function(){
      var values = this.values;//Number
      var result = '';
      var strList = (Math.abs(values) + '').split('.');
      result = this._intTo(strList[0].split('').reverse());
      
      if(strList[1]){
        result += this._floatTo(strList[1].split(''));
      }

      return result !== '' ? (values > 0 ? result : '负' + result) : '零元';
    },
    set : function(v){
      this.values = v;
      return this;
    },
    get : function(){
      return this.values;
    },
    _intTo : function(_int){

      if(_int.length === 1 && _int[0] == '0'){ return ''; }
      
      var result = [];

      for(var i = 0, len = _int.length; i < len ; i++){
          var digitIndex = i + 1;
          result[i] = ToupperNumber.upperNumber[_int[i]];
          result[i] += ToupperNumber.digit[digitIndex];
        }
      return result.reverse().join('');
    },
    _floatTo : function(_float){
      if(_float.length === 1 && _float[0]  == '0'){ return ''; }

      var result = [];

      for(var i = 0, len = _float.length; i < len ; i++){
          var digitIndex = - (i + 1);
          result[i] = ToupperNumber.upperNumber[_float[i]];
          result[i] += ToupperNumber.digit[digitIndex];
        }
      
      return result.join('');
    },
    limit : function(v){
      return ToupperNumber.limit > v;
    } 
  }

  var FilterNumber = function(values){
    this.set(values);
  }

  ToupperNumber.extend(FilterNumber,{
    set : function(values){
      if(!values){ throw new Error('values is undefined'); }

      var v = parseFloat(values);

      if(v !== v){ throw new Error('values not Number'); }

      v = +(v.toFixed(2));//Number
      
      if(!this.Range.includes(v)) { throw new Error('exceed limit. Range:' + this.Range.toString()); }

      ToupperNumber.prototype.set.call(this,v) ;
      return this;
    },
    Range : new Range(-ToupperNumber.limit,ToupperNumber.limit)
  });

  var ToupperNumberSubClass = function(superClass,filter){
    var constructor = superClass.extend(function(){ 
      superClass.apply(this,arguments);
    },
    {
      set : function(v){

        if(!filter(v) || superClass.limit(v)){ throw new Error('values is filter'); }
        return superClass.prototype.set.apply(this,arguments);
      }
    });
    return constructor;
  }


  convert.englishNumber = englishNumber;
  convert.ToupperNumber = ToupperNumber;
  convert.ToupperNumberSubClass = ToupperNumberSubClass;
  convert.mathSign = mathSign;
  return convert;
}());