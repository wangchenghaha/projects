//小程序业务模块
import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
import { brand } from '../config/brand'
const config = require('../src/config');
function getIndexPage(){
  return new Promise((resolve, reject)=>{
    request({ url: URL.MAINJSON}).then(res=>{
      resolve(res.data)
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}
const homePage = () => {
  let terrace = 'wxMini';
  const pages = getCurrentPages();
  const route = pages[pages.length -1].route;
  if(route === 'activity/previewHome/previewHome'){
    terrace = 'previewMini'
  }
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.HOME}?terrace=${terrace}`
    }).then(res => {
      if(res.code === 0){
        resolve(res.data)
        wx.setStorageSync(KEYSTORAGE.HOME_DATA_TIME, Date.now());
      }else{
        reject(new Error(res.msg))
      }
    }).catch(err => reject(new Error(err.msg)))
  }))
};
function getPrevewPage(){
  return new Promise((resolve, reject)=>{
    request({ url:URL.PREVEW_JSON}).then(res=>{
      resolve(res.data)
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}
function sendTmpInfo(data) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.SENDTMPINFO,
      data: data,
      method: 'post'
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}
function unionIdToOpenId(data) {
  // 0 未关注
  return new Promise((resolve, reject) => {
    request({
      url: URL.UNIONIDTOOPENID,
      data: data
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
function unionIdBindOpenId(data) {
  // 0 未关注
  return new Promise((resolve, reject) => {
    request({
      url: URL.UNIONIDBINDOPENID,
      data: data
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
function getUnionId(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETUNIONID,
      data: data
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
function getMiniOpenid(code, brand) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.GETMINIOPENID}?js_code=${code}&brand=${brand}`,
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
function getPopupVoucher() {
  return new Promise((resolve, reject)=>{
    request({ url:URL.POPUPVOUCHER}).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}
function sendWxCoupon(openId) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.SEND_WX_COUPON,
      data: { openId },
      method: 'post'
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}
function saveFormId(data) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.SAVE_FORM_ID,
      data: {
        brand: brand,
        appid: data.appid || '',
        openid: wx.getStorageSync(KEYSTORAGE.openid),
        formId: data.formId || ''
      },
      method: 'post'
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}
// 潮流资讯列表
function getFashionList(data){
  return new Promise((resolve, reject)=>{
    request({
      url:URL.FASHION_LIST,
      data,
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
function fashionDetail(newsId) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.FASHION_LIST_CONTENT,
      data: {
        brand,
        newsId,
      },
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
function saveSubscribe(data) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.SAVE_SUBSCRIBE,
      data,
      method: 'post'
    }).then(res=>{
      res.errcode === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}

/**
 *
 * @param data
 * @returns {Promise<unknown>}
 */
function miniLink(data) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.MINI_LINK,
      data,
    }).then(res=>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}

export {
  getIndexPage,
  sendTmpInfo,
  unionIdToOpenId,
  getUnionId,
  getMiniOpenid,
  unionIdBindOpenId,
  getPopupVoucher,
  sendWxCoupon,
  getFashionList,
  saveFormId,
  fashionDetail,
  saveSubscribe,
  getPrevewPage,
  homePage,
  miniLink
}
