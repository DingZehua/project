collections.base.stracture = (function(){
  var stracture = {};
  var base = collections.base;
  var struct = function(value){
    this.pre = null;
    this.value = value;
    this.next = null;
  }
  struct.prototype = {
    constructor:struct,
    equals : function(that){
      return that === this.value;
    },
    toString : function(){ return '[object Struct]';},
    valueOf : function(){ return this.toString(); }
  }

  
  var structSet = function(){
    this.head = null;
    this.foot = null;
    this.n    = 0;
    this.add.apply(this,arguments);
  }
  base.method.extend(structSet.prototype,
  {
    add : function(){
      var args = arguments;
      var len = args.length;
      if(len > 0){
        if(!this.foot){
          this.foot = Array.prototype.splice.call(args,0,1)[0];
          this.head = this.foot;
          len--;
          this.n++;
        }
        while(len){
          this.foot.next = Array.prototype.splice.call(args,0,1)[0];
          this.foot.next.pre = this.foot;
          this.foot = this.foot.next;
          this.foot.next = null;
          this.n++;
          len--;
        }
      }
      return this;
    },
    size : function(){
      return this.n;
    },
    remove : function(){
      var selfNode = this.head;
      var args = arguments;
      for(var i = 0,len = args.length; i < len ; i++){
        var node = args[i];
        for(var selfNode = this.head; selfNode;selfNode = selfNode.next){
          if(selfNode === node) {
            if(node === this.head && this.head === this.foot){
              this.head = this.foot = null;
            }
            else if(node === this.head) {
              this.head = node.next;
              this.head.pre = null;
            }
            else if(node === this.foot){
              this.foot = node.pre;
              this.foot.next = null;
            }
            else{
              var pre = node.pre;
              var next = node.next;
              pre.next = next;
              next.pre = pre;
            }
            this.n--;
            node.pre = node.next = null;
            break;
          }
        }
        if(!this.head){
          break;
        }
      }

      return base.method.array(args);
    },
    contains : function(node){
      if(!(node instanceof struct) && !(node instanceof structSet))
        return false;
      for(var nextNode = this.head; nextNode;nextNode = nextNode.next){
        if(nextNode === node) return true;
      }
      return false;
    },
    // 遍历整个列表
    foreach : function(f,ctx){
      var node = this.head;
      while(node){
        f.call(ctx,node);
        // 防止remove函数移除掉头部之后无法指向下一个节点。
        if(node.next === null && node.pre === null && this.head !== node){
          node = this.head;
        }
        else{
          node = node.next;
        }
      }
    },
    replace : function(replaceNode,searchNode){
      if(this.head === null || !(this.contains(searchNode)))
        return this;
      if(this.haed === this.foot){
        this.haed = replaceNode;
        this.foot = replaceNode;
        replaceNode.pre = replaceNode.next = null;
      }
      else if(this.head === searchNode){
        replaceNode.next = this.head.next;
        this.head.next.pre = replaceNode;
        this.head = replaceNode;
        this.head.pre = null;
      }
      else if(this.foot === searchNode){
        replaceNode.pre = this.foot.pre;
        this.foot.pre.next = replaceNode;
        this.foot = replaceNode;
        this.foot.next = null;
      }
      else{
        searchNode.pre.next = replaceNode;
        replaceNode.pre = searchNode.pre;
        searchNode.next.pre = replaceNode;
        replaceNode.next = searchNode.next;
      }
      searchNode.pre = searchNode.next = null;
      return this;
    },
    insertBefore : function(insertNode,beforeNode){
      if(!beforeNode){
        // 如果相同那么有可能是节点或者都能是null
        if(this.head === this.foot){
          if(this.head === null){
            insertNode.pre = insertNode.next = null;
            this.head = this.foot = insertNode;
          }
          else{
            this.foot = insertNode;
            this.foot.pre = this.head;
            this.foot.next = null;
            this.head.next = this.foot;
          }
        }
        else{
          this.foot.next = insertNode;
          insertNode.pre = this.foot;
          this.foot = insertNode;
          insertNode.next = null;
        }
      }
      else{
        if(!this.contains(beforeNode))
          throw new Error('The node does not exists in the struct');
        if(this.head === this.foot){
          this.head = insertNode;
          this.head.pre = null;
          this.head.next = this.foot;
          this.foot.pre = this.head;
          this.foot.next = null;
        }
        else if(this.head === beforeNode){
          this.head.pre = insertNode;
          insertNode.next = this.head;
          insertNode.pre = null;
          this.head = insertNode;
        }
        else if(this.foot === beforeNode){
          this.foot.pre.next = beforeNode;
          beforeNode.pre = this.foot.pre;
          beforeNode.next = this.foot;
          this.foot.pre = beforeNode;
        }
        else{
          beforeNode.pre.next = insertNode;
          insertNode.pre = beforeNode.pre;
          insertNode.next = beforeNode;
          beforeNode.pre = insertNode;
        }
      }
      this.n++;
      return this;
    },
    append : function(node){
      this.insertBefore(node);
      return node;
    }
  });
  // 继承structSet的方法和构造函数。
  var filterStructSet = function(){
    this.nodes = [];
    //调用父类的构造函数
    //然后通过父类的构造函数回调到自己的add方法
    structSet.apply(this,arguments);
  }
  structSet.extend(filterStructSet,{
    add : function(){
      var args = arguments;
      for(var i = 0,len = args.length; i < len ; i++){
        if(!(args[i] instanceof struct) 
        && !(args[i] instanceof structSet)
        && !(args[i] instanceof filterStructSet)){
          throw new Error('object must is struct or structSet class. value:' + args[i]);
        }
      }
      //调用父类中的原型方法add
      structSet.prototype.add.apply(this,args);
      for(var j = 0,len = args.length; j < len;j++){
        this.nodes.push(args[j]);
      }
      return this;
    }
  });

  var tree = function(){
    // TODO:
  }

  stracture.struct = struct;
  stracture.structSet = structSet;
  stracture.filterStructSet = filterStructSet;

  return stracture;
}())

//检查方法中的返回值是否有问题。