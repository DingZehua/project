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