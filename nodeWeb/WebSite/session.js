const deepDelete = require('./includes/lib_base').deepDelete;
class Session {
  // 生存时间默认15分钟。
  constructor(expired = 1000 * 60 * 15) {
    this.userData = {};
    this.expired = expired * 1000;
    this._count = 0;
  }
  add(SESS_ID) {
    if(this.has(SESS_ID)) return;
    this.userData[SESS_ID] = {
      expired : new Date().getTime() + this.expired,
      data    : {}
    };
    this._count++;
  }
  destroy(SESS_ID) {
    deepDelete(this.userData[SESS_ID]);
    delete this.userData[SESS_ID];
    this._count--;
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
  isExist(SESS_ID) {
    return this.has(SESS_ID);
  }
  // 清除所有已过期的session,但不清除现有在运行的session.
  clearExpired(time,callback) {
    const self = this;
    const sessEntries = Object.entries(this.userData);
    let takeLength = sessEntries.length;

    const clearTake = () => {
      let mill = new Date().getMilliseconds();
      while(takeLength) {
        let [SESS_ID,{expired}] = sessEntries[--takeLength];
        if(expired < time) {
          self.destroy(SESS_ID);
        }

        if(new Date().getMilliseconds() - mill > 25) {
          setTimeout(clearTake,0);
          break;
        }
      }
      if(!takeLength) {
        callback();
      } 
    }
    clearTake();
  }
  static clearExpired(sessionSet) {
    let runing = false;
    let time = null;
    let g = (function*() {
      while(1) {
        time = yield;
        if(!runing) {
          runing = true;
          sessionSet.clearExpired(time,function() {
            runing = false;
            time = null;
            console.log('clear All finally');
          });
        }
      }
    }());
    g.next();
    return g;
  }
}

try{(module && (module.exports = Session));}
catch(e){}

