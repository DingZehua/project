module.exports = async (code) => {
  const wxConfig = require('../wxConfig');
  const getIdUrl = "https://api.weixin.qq.com/sns/jscode2session";
  const fullUrl =  getIdUrl + '?' + 'appid=' + wxConfig.appid + '&' + 
                  'secret=' + wxConfig.appsecret + '&'+ 
                  'js_code=' + code + 
                  '&grant_type=authorization_code';
  return await require('../client')(fullUrl,'https');
};

