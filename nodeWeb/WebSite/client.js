/**
 * @param {String} url
 * @param {Object} url
 */

module.exports = async function(url,protocol = 'http') {
  protocol = protocol.match(/https?/) ? protocol : 'http';

  let client = null;
  if(protocol === 'http') {
    client = require('http');
  } else {
    client = require('https');
  }

  return new Promise((resolve,reject) => {
    const req = client.request(url,(res) => {
      let data = '';
      res.on('data',(chunk) => {
        data += chunk;
      });
      res.on('end',() => {
        resolve({error : null ,data});
      });
      res.on('error', (err) => {
        reject({error : err,data : null});
      });
    });
    req.end();
  });
}

let pipe = (() => {
  return (input) => {
    var funcs = [];
    var methods = {
    };
    methods.log = () => {
	  funcs.push(Math.log2);
      return methods;
    }
    methods.result = () => {
      return funcs.reduce( (pre,cur,i,arr) => {
        return cur(pre);
      },funcs.shift()(input))
    }
	return methods;
  }
})();

let bit = 0;

bit = ((quantity) => {
  const pGroup = [];
  const h = 1;
  let result = null;

  for(let i = 0; i < quantity; i++) {
    let p = h / quantity;

    pGroup[i] = p * Math.log2(p);
  }

  result = pGroup.reduce( (acc,cur) => {
    return acc - cur;
  },pGroup.shift() * -1);

  return Math.ceil(result);
})(128);

console.log(bit);
