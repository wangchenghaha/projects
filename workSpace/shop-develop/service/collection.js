import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'

// 详情页添加删除收藏夹
function optionGoodsCollection(_data) {
    return new Promise(((resolve, reject) => {
      request({
        header:{
            'content-type': 'application/json', // 请求体类型默认值
            token: wx.getStorageSync('token') || '', //请求凭证
            brand:getApp().config.brand //测试环境用到
        },
        url: URL.ADDGOODSCOLLECTION,
        data: _data,
        method: 'POST',
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}

// 查询该商品是否添加过收藏夹
function isGoodsQuery(_data) {
    return new Promise(((resolve, reject) => {
      request({
        header:{
            'content-type': 'application/json', // 请求体类型默认值
            token: wx.getStorageSync('token') || '', //请求凭证
            brand:getApp().config.brand //测试环境用到
        },
        url: URL.ISGOODSQUERY,
        data: _data,
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}

// 查询收藏夹商品
function queryGoodsCollection(_data) {
    return new Promise(((resolve, reject) => {
      request({
        header:{
            'content-type': 'application/json', // 请求体类型默认值
            token: wx.getStorageSync('token') || '', //请求凭证
            brand:getApp().config.brand //测试环境用到
        },
        url: URL.QUERYGOODSCOLLECTION,
        data: _data,
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}

function deleteCollections(_data){
  return new Promise(((resolve, reject) => {
    request({
      header:{
          'content-type': 'application/json', // 请求体类型默认值
          token: wx.getStorageSync('token') || '', //请求凭证
          brand:getApp().config.brand //测试环境用到
      },
      url: URL.DELETECOLLECTION,
      data: _data,
      method: 'POST',
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

export {
    optionGoodsCollection,
    isGoodsQuery,
    queryGoodsCollection,
    deleteCollections
}

