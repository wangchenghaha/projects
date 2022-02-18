const config = require('../src/config.js');

console.log("-------------=-==========-===========-=", config);
const tdConNew = Object.assign({
    appName: config.appName,
    versionName: config.versionName,
    versionCode: config.versionCode,
    wxAppid: config.wxAppid, //
    getLocation: false, // 默认不获取用户位置
    autoOnPullDownRefresh: false, // 默认不统计下拉刷新数据
    autoOnReachBottom: false, // 默认不统计页面触底数据
    getUidUrl: 'https://dmp.bestseller.com.cn:2446/miniprogram-gateway/wechat', // 请确保已在小程序管理后台添加此域名
    requestUrl: 'https://dmp.bestseller.com.cn:2445/g/a' // 请确保已在小程序管理后台添加此域名
},
  config.tdNew
)

exports.config = tdConNew;
