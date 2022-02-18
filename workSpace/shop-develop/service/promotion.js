//促销业务模块

import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'

// 查询促销规则列表
function ruleListBySku(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.RULELISTBYSKU,
      data: data,
      method:'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 查询促销商品
function promotionGoods(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GIFT_PAGE,
      data: data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

/**
 * 通过商品查促销
 * @param data = {colorCode,phone}
 * @returns {Promise<unknown>}
 */
function promotionByGoodsColor(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.RULES_BY_COLOR,
      data: data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
function promotionByGoodsColorList(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.RULES_BY_COLOR_LIST,
      data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
/**
 * 购物车查促销
 * @param data = {goodsList,phone}
 * @returns {Promise<unknown>}
 */
function promotionByCart(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.PROMOTION_CART,
      data: data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

/**
 * 提交订单查询订单赠品促销
 * @param data{skuList: [quantity:Number, sku: String]}
 * @returns {Promise<unknown>}
 */
function orderGift(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.ORDER_GIFT,
      data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

/**
 * 调用CRM给用户塞多个优惠券
 * @param data
 * @returns {Promise<unknown>}
 */
function addCoupons(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.ADD_COUPONS,
      data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
export {
  ruleListBySku,
  promotionGoods,
  promotionByGoodsColor,
  promotionByCart,
  promotionByGoodsColorList,
  orderGift,
  addCoupons
}
