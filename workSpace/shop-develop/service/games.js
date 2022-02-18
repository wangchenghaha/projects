import { request } from '../utils/request.js'
import { URL } from '../src/const.js'
import { wxShowToast } from '../utils/wxMethods'

// 积分变动（转盘消耗50积分，获赠500积分）
function getChangePoints(info) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.CHANGE_POINTS,
      method: 'POST',
      data: info
    }).then(res => {
      resolve(res)
    }).catch(err => {
      reject(new Error(err.msg))
    })
  })
}

// 电影票发送短信（废弃）
function getMovieTickt(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GET_MOVIE_TICKET,
      data: data,
    }).then(res => {
      if (res.code === 0) {
        resolve(res)
      } else {
        reject(new Error(res.msg))
      }
    }).catch((e) => { reject(new Error(e.msg)) })
  })

}

//奖品列表ZP_GETGOODS
function getZpGoods(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.ZP_GETGOODS,
      data: data,
    }).then(res => {
      if (res.code === 0) {
        resolve(res)
      } else {
        reject(new Error(res.msg))
      }
    }).catch((e) => { reject(new Error(e.msg)) })
  })

}
//中奖商品ZP_COMMODITY(会员日)
function getZpCommodity(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.ZP_COMMODITY,
      data: data,
    }).then(res => {
      if (res.code == 0) {
        resolve(res)
      } else {
        reject(new Error(res.msg))
      }
    }).catch((e) => { reject(new Error(e.msg)) })
  })

}

//中奖商品zp_HASORDER（通用四月）
function getZpHasOrder(data) {
  return new Promise((resolve, reject) => {
    request({
      header:{
        'content-type': 'application/json', // 请求体类型默认值
        token: wx.getStorageSync('token') || '', //请求凭证
        brand:getApp().config.brand //测试环境用到
      },
      url: URL.zp_HASORDER,
      data: data,
      method: 'POST',
    }).then(res => {
      if (res.code == 0) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch((e) => { reject(new Error(err)) })
  })

}


//中奖商品zp_HASORDER（季中抽奖）
function getMidSeason(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.zp_HASORDER,
      data: data,
      method: 'POST',
    }).then(res => {
      if (res.code == 0) {
        resolve(res)
      } else {
        reject(res)
      }
    }).catch((e) => { reject(new Error(err)) })
  })

}

//中奖商品zp_LIMILOTTERY（集赞）
function getZpLimi(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.zp_LIMILOTTERY,
      data: data,
    }).then(res => {
      if (res.code == 0) {
        resolve(res)
      } else {
        reject(new Error(res.msg))
      }
    }).catch((e) => { reject(new Error(e.msg)) })
  })

}


//集赞抽奖（判断是否有券）zp_COUPON
function getZpCoupon(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.zp_COUPON,
      data: data,
    }).then(res => {
      if (res.code == 0) {
        resolve(res)
      } else {
        reject(new Error(res.msg))
      }
    }).catch((e) => { reject(new Error(e.msg)) })
  })

}

//集赞抽奖（核销活动券）zp_HXCOUPON
function getZphxCoupon(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.zp_HXCOUPON,
      data: data,
      method: 'POST',
    }).then(res => {
      if (res.code == 0) {
        resolve(res)
      } else {
        reject(new Error(res.msg))
      }
    }).catch((e) => { reject(new Error(e.msg)) })
  })

}

//集赞 发短信卡密zp_SENDTICKET
function getZpSend(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.zp_SENDTICKET,
      data: data,
      method: 'POST',
    }).then(res => {
      if (res.code == 0) {
        resolve(res)
      } else {
        reject(new Error(res.msg))
      }
    }).catch((e) => { reject(new Error(e.msg)) })
  })

}

//jl专用核销券zp_JLDESTROYCOUPON
function getZpJLhxCoupon(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.zp_JLDESTROYCOUPON,
      data: data,
      method: 'POST',
    }).then(res => {
      if (res.code == 0) {
        resolve(res)
      } else {
        reject(new Error(res.msg))
      }
    }).catch((e) => { reject(new Error(e.msg)) })
  })

}


// 奖品列表
function getGiftList(_gameCode){
  return new Promise((resolve, reject)=>{
      request({
          url: URL.GETGIFTLIST,
          data:{
              gameCode: _gameCode
          }
      }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
          wxShowToast(res.msg)
          reject(new Error(e))
      }
      else{
          resolve(res.data)
      }
      }).catch((e)=>{
          let a = e.message?e.message:e.msg
          wxShowToast(a)
          reject(new Error(e))
      })
  })
}

// 开始抽奖
function startlottery(param){
  return new Promise((resolve, reject)=>{
      request({
          url: URL.STARTGAME,
          data: param
      }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
          wxShowToast(res.msg)
      }
      else{
          resolve(res.data)
      }
      }).catch((e)=>{
          let a = e.message?e.message:e.msg
          wxShowToast(a)
          reject(new Error(e))
      })
  })
}


// 中奖记录列表
function getGiftRecords(_gameCode){
  return new Promise((resolve, reject)=>{
      request({
          url: URL.GETGIFTRECORDS,
          data:{
              gameCode: _gameCode
          }
      }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
          wxShowToast(res.msg)
      }
      else{
          resolve(res.data)
      }
      }).catch((e)=>{
          let a = e.message?e.message:e.msg
          wxShowToast(a)
          reject(new Error(e))
      })
  })
}

// 通过手机好校验订单
function checkPhoneOrder(_param){
  wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve, reject)=>{
      request({
          url: URL.CHECKPHONE,
          data:{
            phone: _param
          }
      }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
          wxShowToast(res.msg)
      }
      else{
          resolve(res.data)
      }
      }).catch((e)=>{
          let a = e.message?e.message:e.msg
          wxShowToast(a)
          reject(new Error(e))
      })
  })
}


export {
  getChangePoints,
  getMovieTickt,
  getZpGoods,
  getZpCommodity,
  getZpHasOrder,
  getZpCoupon,
  getZphxCoupon,
  getZpLimi,
  getZpSend,
  getZpJLhxCoupon,
  getMidSeason,
  getGiftList,
  startlottery,
  getGiftRecords,
  checkPhoneOrder
}