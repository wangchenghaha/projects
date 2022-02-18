import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'

// 创建点亮优惠券活动
function createLightCoupon(lightCoupon) {
    return new Promise((resolve, reject) => {
      request({
        url: URL.CREATE_LIGHTCOUPON,
        data: lightCoupon,
        method: 'POST'
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    })
}


// 查询点亮优惠券活动
function getLightCoupons(_id) {
    return new Promise((resolve, reject) => {
      request({
        url: URL.GETLIGHTCOUPONS,
        data: {
            id: _id
        },
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    })
}



// 点亮优惠券
function lightCoupons(lightCoupon) {
    return new Promise((resolve, reject) => {
      request({
        url: URL.LIGHTCOUPON,
        data: lightCoupon,
        method: 'POST'
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    })
}

// 点亮优惠券
function getLightCouponList() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETLIGHTCOUPONLIST,
      data: {
        openid: wx.getStorageSync(KEYSTORAGE.openid),
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}


// 点亮优惠券
function getLightCouponSuccessList() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETLIGHTCOUPONSUCCESSLIST,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}

// FOL创建点亮优惠券活动
function createExpandCoupon(_data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.CREATEEXPADNDCOUPON,
      data: _data,
      method: 'POST'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}

// FOL查询用户膨胀券
function getExpandCoupon(_opendid){
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETEXPADNDCOUPON,
      data: {
        creatorOpenid:_opendid ,
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}

// FOL点亮膨胀券
function lightExpandCoupon(_data){
  return new Promise((resolve, reject) => {
    request({
      url: URL.LIGHTUPEXPADNDCOUPON,
      data: _data,
      method: 'POST'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}

// 用户领券记录
function expandCouponList(){
  return new Promise((resolve, reject) => {
    request({
      url: URL.EXPANDCOUPONLUST,
      data:{
        openid: wx.getStorageSync(KEYSTORAGE.openid),
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}

// 点亮成功好友列表
function lightSuccessList(_opendid){
  return new Promise((resolve, reject) => {
    request({
      url: URL.LIGHTSUCCESSLIST,
      data:{
        openid: _opendid,
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  })
}


export{
    createLightCoupon,
    getLightCoupons,
    lightCoupons,
    getLightCouponList,
    getLightCouponSuccessList,
    createExpandCoupon,
    getExpandCoupon,
    lightExpandCoupon,
    expandCouponList,
    lightSuccessList
}