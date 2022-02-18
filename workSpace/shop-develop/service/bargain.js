// 砍价业务
import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
const app = getApp();

// 获取砍价商品列表
function getBargainList(pid) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL.GETBARGAINLIST,
        data: { pid },
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


// 获取砍价商品详情
function getBargainGoodDetail(_goodsCode) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL.GETBARGAINGOODDETAIL,
        data: {
            goodsCode: _goodsCode,
            pid: app.config.barginCode
        },
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


// 创建砍价列表
function createBargainOrder(_data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.CREATEBARGAUNORDER,
      data: _data,
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

// 获取砍价商品详情
function getBargainOrderList() {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.GETBARGAINORDERLIST,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

// 获取砍价订单详情
function getBargainOrderDetail(_orderId) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.GETBARGAINORDERDETAIL,
      data: {
        id: _orderId,
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

// 获取砍价订单详情
function bargainOrderTimeOut(_orderId) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.BARGAINTIMEOUT,
      data: {
        bargainOrderId: _orderId,
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

// 获取砍价订单详情
function getBargainShare(bargainDetail) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.BARGAINSHARE,
      data:  bargainDetail,
      method: 'POST'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

// 获取砍价订单详情
function getBargainRecodeList(_orderId) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.BARGAINRECODELIST,
      data: {
        bargainOrderId: _orderId,
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

// 获取砍价订单详情
function getBargainSuccessList(_orderId) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.BARGAINSUCCESSLIST
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

// 改变订单支付状态
function changePayStatus(_orderId) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.CHANGEPAYSTATUS,
      data: {
        bargainOrderId: _orderId,
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

export{
    getBargainList,
    getBargainGoodDetail,
    createBargainOrder,
    getBargainOrderList,
    getBargainOrderDetail,
    bargainOrderTimeOut,
    getBargainShare,
    getBargainRecodeList,
    getBargainSuccessList,
    changePayStatus
}
