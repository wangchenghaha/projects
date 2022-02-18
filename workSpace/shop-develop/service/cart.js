//购物车业务模块

import { request } from '../utils/request.js'
import {URL, EVENTS, KEYSTORAGE} from '../src/const.js'
import {wxReportGoods} from '../utils/wxMethods';
import {chengfa} from "../utils/utils";

// 获取购物车列表
function getCartList(data) {
  return new Promise((resolve, reject)=>{
    request({
      url:'/rest/shopCart/getLists',
      data: data,
    }).then(res=>{
      if(res.code === 0){
        resolve(res)
      }else{
        reject(new Error(res.msg))
      }
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })

}
// 删除购物车商品
function shoppingDel(id) {
  return new Promise((resolve, reject) => {
    request({
      url: `/rest/shopCart/delete?id=${id}`,
    }).then(res=>{
      if(res.code === 0) {
        resolve(res.msg);
      }else {
        reject(new Error(res.msg));
      }
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}
// 添加商品到购物车
function shoppingAdd(data) {
  const { memberno = '', phone = ''} = wx.getStorageSync(KEYSTORAGE.crmInfo);
  Object.assign(data, {
    crmId: memberno,
    userPhone: phone,
    addPrice: data.price || '',   // Number  售价精确到分
  })
  return new Promise((resolve, reject) => {
    request({
      url: '/rest/shopCart/add',
      method:'POST',
      data: data,
    }).then(res=>{
      if(res.code === 0) {
        resolve(res);
      }else {
        reject(new Error(res.msg));
      }
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 添加商品到心愿单
function addSkuToWish(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.ADD_SKU_INTO_SETTING,
      method:'POST',
      data: data,
    }).then(res=>{
      res.code === 0 ? resolve(res) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
export {
  getCartList,
  shoppingDel,
  shoppingAdd,
  addSkuToWish
}
