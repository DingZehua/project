let log = console.log.bind(console);
/*let fs = require('fs');

var text = fs.createReadStream('HTML.txt','utf-8');

text.on('data',function(chunk){
  console.log(chunk);
});
text.on('end',function(){
  console.log('end');
});
text.on('error',function(error){
  console.log('error:' + error)
})


var ws3 = fs.createWriteStream('HTML.txt','utf-8');
ws3.write('asdf');
ws3.end();
console.log('reading...');
try{
 
}
catch(e){

}
/*
var ws = fs.createWriteStream('addText.txt');
var ws2 = fs.createWriteStream('readme.txt');
text.pipe(ws);
text.pipe(ws2);

var assert = require('assert');
assert.doesNotThrow(function(){
  //throw Error('wrong message');
},
'',
'符合预期');
let x = `
`;
console.log(x.length)
define()

let it = makeIterator(['a','b']);
for(let item of it) {
  log(item);
}

function makeIterator(array) {
  return {
    [Symbol.iterator] (){
      let nextIndex = 0;
      return {
      next : function(){
        return nextIndex < array.length ?
              { value : array[nextIndex++] , done : false } :
              { value : undefined , done : true};
        }
      }
    } 
  }
}
const obj = {
  [Symbol.iterator] (){
    return {
      next(){
        return {
          value : 1,
          done : true
        }
      }
    }
  }
}

class RangeIterator {
  constructor (from ,to) {
    this.from = from;
    this.to = to;
  }
  [Symbol.iterator]() {
    return this;
  }
  next(){
    let value = this.from;
    if(this.from < this.to) {
      this.from++;
      return {value : value,done:false};
    }
    else {
      return {value : undefined,done:true};
    }
  }
}
for(let item of new RangeIterator(0,40)) {
  log(item);
}
class Link {
  constructor (value) {
    this.value = value;
    this.next = null;
  }
  [Symbol.iterator] () {
    let currect = this;
    return {
      next(){
        if(currect) {
          let value = currect.value;
          currect = currect.next;
          return {
            value : value,
            done : false
          }
        }
        else {
          return {
            value : undefined,
            done  : true
          }
        } 
      }
    }
  }
}

let one = new Link(50);
one.next = new Link(20);
one.next.next = new Link(30);
for(let item of one) {
  log(item);
}


let obj = {
  data : ['hello','world'],
  [Symbol.iterator] (){
    let self = this;
    let index = 0;
    return {
      next() {
        if(index < self.data.length) {
          return {
            value : self.data[index++],
            done : false
          }
        } else {
          return {
            value : undefined,
            done : true
          }
        }
      }
    }
  }
}

for (let item of obj) {
  log(item);
}
*/

let arr1 = ['a','b','c'];
let arr2 = ['d','e','f'];
let arr3 = ['h','i','j'];

//let arr4 = arr1.concat(arr2,arr3);
let arr4 = [...arr1,...arr2,...arr3];
//log(arr4);
let [a,b,c,d,e,f] = [...arr1,...arr2];