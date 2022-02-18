import { request } from '../../utils/request.js'
import {URL} from "../../src/const";
// 获取心愿单列表
function wishGoodsList(brand) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.QUERY_SETTING,
      method: 'post',
      data:{brand}
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 删除心愿单商品
function wishGoodsRemove(data) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.DELETE_SETTING,
      method: 'post',
      data
    }).then(res=>{
      res.code === 0 ? resolve(res) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 生成心愿单
function generateWish(data) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.GENERATE_SETTING,
      method: 'post',
      data
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 查询心愿单
function wishDetail(data) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.QUERY_WISH,
      method: 'post',
      data
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
// 查询心愿单订单
function wishOrder(brand) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.QUERY_WISH_ORDER,
      method: 'post',
      data:{brand}
    }).then(res=>{
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch((e)=>{reject(new Error(e.msg || e.message))})
  })
}
export {
  wishGoodsList,
  wishGoodsRemove,
  generateWish,
  wishDetail,
  wishOrder
}