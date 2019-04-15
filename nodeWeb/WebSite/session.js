const deepDelete = require('./includes/lib_base').deepDelete;
class Session {
  // 生存时间默认15分钟。
  constructor(expired = 1000 * 60 * 15) {
    this.userData = {};
    this.expired = expired * 1000;
  }
  add(SESS_ID) {
    if(this.has(SESS_ID)) return;
    this.userData[SESS_ID] = {
      expired : new Date().getTime() + this.expired,
      data    : {}
    };
  }
  destroy(SESS_ID) {
    deepDelete(this.userData[SESS_ID]);
    delete this.userData[SESS_ID];
  }
  /**
   * 
   * @param {String} SESS_ID 
   */
  has(SESS_ID) {
    return this.userData.hasOwnProperty(SESS_ID);
  }
  hasUserData(SESS_ID,key) {
    if(this.has(SESS_ID)) { return false; }
    return this.userData[SESS_ID].data.hasOwnProperty(key);
  }
  static expired(SESS_ID,sessionSet,curTIME) {
    if(!sessionSet.has(SESS_ID)) return null;
    return sessionSet.userData[SESS_ID].expired < curTIME;
  }
  isExist(SESS_ID) {
    return this.has(SESS_ID);
  }
}

try{(module && (module.exports = Session));}
catch(e){}