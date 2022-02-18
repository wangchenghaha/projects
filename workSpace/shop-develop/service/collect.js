import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
const config = require('../src/config.js');
const app = getApp();
/**
 * 收集用户行为
 * @param {unionId} _unionId 
 * @param {openId} _openId 
 * @param {员工编号} _shareBy 
 * @param {店铺代码} _shareByShop 
 * @param {事件名称} _eventName 
 * @param {null} _eventValue 
 * @param {LocalStroge值} _utm_source 
 * @param {同上} _utm_medium 
 * @param {同上} _utm_campaign 
 * @param {同上} _utm_term 
 */
function collectData(_unionId, _openId, _shareBy, _shareByShop, _eventName, _eventValue, _utm_source, _utm_medium, _utm_campaign, _utm_term, _utm_wx_scene){
    return new Promise(((resolve, reject) => {
        request({
          url: URL.COLLECTDATA,
          data:{
            "unionId": _unionId, 
            "openId" : _openId,
            "shareBy" : _shareBy, 
            "shareByShop" : _shareByShop, 
            "eventName" : _eventName,
            "eventValue" : _eventValue,
            "utm_source" : _utm_source, 
            "utm_medium" : _utm_medium, 
            "utm_campaign" : _utm_campaign, 
            "utm_term" : _utm_term, 
            "utm_wx_scene": _utm_wx_scene,
            "brand": config.brand,
          },
          method: 'POST',
        }).then(res => {
          res.code === 0 ? resolve(res.msg) : reject(new Error(res.msg));
        }).catch(err=>{
          reject(new Error(err.msg))
        })
      }))
}
function collectData2(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.COLLECTDATA,
      data: data,
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.msg) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}

function wxUserActions(data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.WX_USERACTIONS ,
      data: {
        'brand': config.brand,
        'openId': wx.getStorageSync("wxOpenID"),
        'actionList': data
      },
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.msg) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}

export{
  collectData,
  collectData2,
  wxUserActions
}
