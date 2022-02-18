//初始化业务模块

import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'

//初始化系统配置信息
function initConfig(){
  //标记企业微信
  let wxWorkInfo = wx.getSystemInfoSync();
  wx.setStorageSync('isWXWork', (wxWorkInfo && wxWorkInfo.environment) ? true : false);

}

//清除系统配置信息
function resetConfig(){
  wx.removeStorageSync(KEYSTORAGE.loginInfo);
  wx.removeStorageSync(KEYSTORAGE.token);
}

//开启授权页面
function requestPermission(){
  return new Promise((resolve,reject)=>{
    wx.getSetting({
      success: function(res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          resolve('授权成功');
          /*wx.getUserInfo({
            success: function(res) {
              console.log('授权成功',res.userInfo)
            }
          })*/
        }else{
          reject(new Error('授权失败fail'))
        }
      },
      fail: ()=>{
        reject(new Error('授权失败fail'))
      }
    })
  })
}
function getConfigJSON() {
  return new Promise((resolve, reject)=>{
    request({ url:URL.MINI_CONFIG}).then(res=>{
      resolve(res)
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}

function getExclusiveJSON() {
  return new Promise((resolve, reject)=>{
    request({ url:URL.EXCLUSIVEJSON}).then(res=>{
      resolve(res)
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}
// 备案信息
function keepRecordInfo() {
  return new Promise((resolve, reject) => {
    request({ url: URL.KEEP_RECORD_INFO }).then(res => {
      resolve(res)
    }).catch((e) => { reject(new Error(e.msg)) })
  })
}

// 微信订阅消息收集
function wxSubscribeCollection(_data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.WXSUBSCRIBECOLLECTION,
      data: {
        openid: wx.getStorageSync('openid'),
        templateIdMap: _data,
      },
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
function fileIsExist(url) {
  return new Promise( (resolve, reject) => {
    wx.request({
      url,
      success(res){
        resolve(res.statusCode !== 404)
      },
      fail(err){
        resolve(false)
      }
    })
  });
}


export {
  initConfig,
  resetConfig,
  requestPermission,
  getConfigJSON,
  getExclusiveJSON,
  wxSubscribeCollection,
  fileIsExist,
  keepRecordInfo
}