
var app = getApp();
import { URL, KEYSTORAGE } from '../src/const.js'
import { brand } from '../config/brand'
import { channel } from '../config/main'
function getnowTime() {
  var date = new Date();
  return date.getTime();
  
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + date.getHours() + seperator2 + date.getMinutes()
    + seperator2 + date.getSeconds();
  return currentdate;
};


function tongji(_url, _prevPage, _sku){

  var _openid = wx.getStorageSync('login_entiry').openid || wx.getStorageSync(KEYSTORAGE.openid) || '';
  var _os = wx.getStorageSync('systemData');
  var _user_info = wx.getStorageSync('user_info');
  var _login_token = wx.getStorageSync('token');
  var _wxSenceId = wx.getStorageSync('scene');


  var userData = {
    "browser": channel,//浏览器
    "channel": channel,//渠道H5,wechat
    "device": 'mobile',//设备
    "domainName": `${channel}-${brand}`,
    "openId": _openid ? _openid : '',
    "os": _os.system.split(' ')[0],//操作系统
    "phone": _user_info.phone ? _user_info.phone : '',
    "refer": _prevPage,//来源页面
    "resolution": (function () {
      var e = [_os.screenWidth, _os.screenHeight];
      return e.join("*");
    })(),//分辨率
    "sidToken": _login_token ? _login_token : "",
    "sku": _sku || '',
    "time": getnowTime(),
    "url": _url,
    "brand": brand,
    "wxSenceId":_wxSenceId
  };

  //导购分享参数添加
  var daogouList = wx.getStorageSync('daogouLists');
  var nowTimes = Date.now();
  if (daogouList && daogouList.length > 0) {
    var thisItem = daogouList[0];
    var runTime = parseInt((nowTimes - thisItem.times) / 1000);
    var day = Math.floor(runTime / 86400);
    if (day <= 15) {
      for (let k = 0; k < daogouList.length; k++) {
        userData[daogouList[k].key] = daogouList[k].value;
      };
    };
  };
  

  wx.request({
    url: URL.TRACK,
    data: userData,
    header: { "Content-Type": "application/json"},
    method: 'POST',
    success: function(){
    },
    fail: function (err) {
    },
    complete: function (res) {
    }
  })

};


module.exports = {
  tongji: tongji
}