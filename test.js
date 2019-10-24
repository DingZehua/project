/*const http =require('http');

const server = http.createServer((req,res) => {
  let body = '';
  req.setEncoding('utf-8');

  req.on('data',(chunk) => {
    body += chunk;
  });

  req.on('end', () => {
    try {
      const data = JSON.parse(body);

      res.write(typeof data);
      res.end();
    } catch(er) {
      res.statusCode = 400;
      return res.end(`error : ${er.message}`);
    }
  })
})

server.listen(80,'192.168.0.14');

function writeOneMill(writer,data,encoding,callback) {
  let i = 1000000;
  write();
  function write() {
    let notStop = true;
    do {
      i--;
      if(i === 0) {
        writer.write(data,encoding,callback);
        writer.end();
      } else {
        nostStop = writer.write(data,encoding);
      }
    } while(i > 0 && notStop);
  }

  console.log('stop run');

  if(i > 0) {
    writer.once('drain',write);
  }
}
/*

const fs = require('fs');
const file = fs.createWriteStream('big.file');

for(let i=0; i<= 1e6; i++) {
  file.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n');
}

file.end();



const fs = require('fs');

const ws = fs.createWriteStream('big.file');

ws.on('finish',function() {
  console.log('write End Event');
})

let data = '1234567891234567891sdsdfgsdfgsdfgsdfgs1sdsdfgsdfgsdfgsdfg1sdsdfgsdfgsdfgsdfg1sdsdfgsdfgsdfgsdfg1sdsdfgsdfgsdfgsdfg1sdsdfgsdfgsdfgsdfg1sdsdfgsdfgsdfgsdfgdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfgsdfg2345678912sdfgsdfgsdfg3456789123456789123456789123456789123456789123456789123456789123456789123456789123456789123456789';

writeOneMill(ws,data,'utf-8',function(err){ console.log('write End'); })




const {PassThrough,Writable} = require('stream');
// readableFlowing
// 双向流
const pass = new PassThrough();
const writable = new Writable('file.txt');

//pass.pause();

pass.pipe(writable);
pass.unpipe()

pass.on('data',(chunk) => {
  console.log(chunk.toString());
});
pass.write('ok');

pass.resume();
*/
let md5 = require('md5');

let users = [
  md5(Math.random() + '' + Math.random()),
  md5(Math.random() + '' + Math.random()),
  md5(Math.random() + '' + Math.random())
]

let user = users[0];

const _SESSION = {
};

const SESSION = new Proxy(_SESSION,{
  set(t,prop,value,receiver) {
    if(!Reflect.get(t,user)){
      Reflect.set(t,user,{});
    }
    return Reflect.set(t[user],prop,value,t[user]);
  },
  get(t,prop,receiver) {
    if(!Reflect.get(t,user)){
      Reflect.set(t,user,{});
    }
    return Reflect.get(t[user],prop,t[user]);
  }
});

SESSION.user = 'zhangsan';

console.log(SESSION.user);

user = users[1];

console.log(SESSION.user = 'liSi');

user = users[0];

console.log(SESSION);

console.log();