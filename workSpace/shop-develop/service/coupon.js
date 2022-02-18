//活动券业务模块

import {request} from '../utils/request.js'
import {URL, KEYSTORAGE} from '../src/const.js'
const config = require('../src/config.js');

// 获取活动券
function getCoupon(memberno) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.GETCOUPON}?memberno=${memberno}`
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
// 获取活动券new
function getCouponList(memberno) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.GETCOUPONLIST}?memberno=${memberno}`
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
// 积分兑换活动券
function exchangeCoupon(_phone ,_voulist) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.EXCHANGECOUPON,
      data:{
        voulist:_voulist,
        phone: _phone
      },
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

function couponRestiction(_phone){
   return new Promise((resolve, reject) => {
     request({
       url: URL.COUPONRESTRICTION,
       data:{
         phone: _phone,
       }
     }).then(res => {
       resolve(res.code)
     }).catch(err =>{
       reject(new Error(err.msg))
     })
   })
}
// 订单也获取优惠券
function orderCouponList(phone, data) {
  return new Promise( (resolve, reject) => {
    request({
      url: `${URL.ORDERCOUPONLIST}?phone=${phone}`,
      data: data,
      method: 'post'
    }).then( res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch( err => {
      reject(new Error(err.msg || err.message))
    })
  })
}

/**
 * 兑换JL优惠券
 */
function exchangeJLCoupon(_phone, _voucherList){
  return new Promise( (resolve, reject) => {
    request({
      url: URL.EXCHANGEJLCOUPON ,
      data: {
        voulist: _voucherList
      },
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}

/*
* 获取优惠券状态
* {
*   couponCode：1-5060933117
*   couponId:3CR11802656
*   unionid
* }
* */
function getCouponStatus(data){
  let param = {
    unionid: wx.getStorageSync(KEYSTORAGE.unionid) || '',
  };
  Object.assign(param, data);
  return new Promise((resolve, reject) => {
    request({
      url: URL.GET_COUPON_STATUS,
      data: param
    }).then(res => {
      res.errcode === 0 ? resolve(res) : reject(new Error(res.errmsg));
    }).catch(err =>{
      reject(new Error(err.errmsg))
    })
  })
}
/*
* /queryNumCoupon
* */
function queryNumCoupon(couponNum, skuArr, orderAmount) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.QUERY_NUM_COUPON,
      data: {
        couponno: couponNum.trim(),
        channel: 'H5',
        brand: config.brand,
      },
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err =>{
      reject(new Error(err.msg))
    })
  })
}

// 商品详情页获取优惠券列表
function goodsDetailgetCouponList(_data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.GOODSDETAILCOUPONLIST,
      data: _data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err =>{
      reject(new Error(err.msg))
    })
  })
}

// 查看商品页优惠券抽奖记录
function queryGetCouponRecord(_data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.QUERYGETCOUPONRECORD,
      data: _data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err =>{
      reject(new Error(err.msg))
    })
  })
}

// 查看商品页优惠券抽奖记录
function queryWxCoupon(){
  return new Promise((resolve, reject) => {
    request({
      header:{
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand:getApp().config.brand //测试环境用到
      },
      url: URL.QUERYWXCOUPON,
      data: {
        openid:  wx.getStorageSync('openid'),
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err =>{
      reject(new Error(err.msg))
    })
  })
}

//发微信代金券活动（）
function sendWxCoupon(){
  return new Promise((resolve, reject) => {
    request({
      header:{
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand:getApp().config.brand //测试环境用到
      },
      url: URL.SENDWXCOUPON,
      data: {
        openid:  wx.getStorageSync('openid'),
        stockId: '9660501',
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res);
    }).catch(err =>{
      reject(new Error(err.msg))
    })
  })
}


// 发微信代金券活动single（all）
function sendWxCouponCustom(){
  return new Promise((resolve, reject) => {
    request({
      header:{
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand:getApp().config.brand //测试环境用到
      },
      url: URL.SENDWXCOUPONCUSTOM,
      data: {
        openid:  wx.getStorageSync('openid'),
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res);
    }).catch(err =>{
      reject(new Error(err.msg))
    })
  })
}



// 查询是否有微信代金券活动
function queryIsWxCoupon(){
  return new Promise((resolve, reject) => {
    request({
      header:{
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand:getApp().config.brand //测试环境用到
      },
      url: URL.QUERYISWXCOUPON,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res);
    }).catch(err =>{
      reject(new Error(err.msg))
    })
  })
}

// 查询是否有微信代金券活动
function sendCouponNotify(_data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.SENDCOUPONNOTIFY,
      data: _data,
      method: 'POST'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res);
    }).catch(err =>{
      reject(new Error(err.msg))
    })
  })
}

function sendNewUsercoupon(_data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.NEWUSERCOUPON,
      data: _data,
      method: 'POST'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res);
    }).catch(err =>{
      reject(new Error(err.msg))
    })
  })
}


export {
  getCoupon,
  exchangeCoupon,
  couponRestiction,
  getCouponList,
  orderCouponList,
  exchangeJLCoupon,
  getCouponStatus,
  queryNumCoupon,
  goodsDetailgetCouponList,
  queryGetCouponRecord,
  queryWxCoupon,
  sendWxCoupon,
  sendWxCouponCustom,
  queryIsWxCoupon,
  sendCouponNotify,
  sendNewUsercoupon
}
