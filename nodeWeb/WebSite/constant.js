const POST_EXCEPTION = Symbol.for('POST_EXCEPTION');
const POST = Symbol.for('POST');
const GET  = Symbol.for('GET');
const COOKIES = Symbol.for('COOKIES');

const SECOND  = 1000;
const MINUTE  = 1000 * 60;
const HOURS   = MINUTE * 60;
const DAY     = HOURS * 24;
const YEAR    = DAY * 365;

const CONSTANT = {POST_EXCEPTION,POST,GET,COOKIES,time : {
  MINUTE,HOURS,DAY,YEAR,SECOND
}};

try{(module && (module.exports = CONSTANT));}
catch(e){}