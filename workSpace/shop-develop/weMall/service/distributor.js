//导购业务模块

import { request } from '../../utils/request.js'
import { URL, KEYSTORAGE } from '../../src/const.js'
/**
 * 分销订单统计
 * @param shareBy String
 * @returns {Promise<unknown>}
 */
function distributorOrder(shareBy) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.DISTRIBUTOR_ORDER}?shareBy=${shareBy}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(e=>{
      reject(new Error(e.message))
    })
  })
}

/**
 * 分销顾客统计
 * @param shareBy String
 * @returns {Promise<unknown>}
 */
function distributorCustomer(shareBy) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.DISTRIBUTOR_CUSTOMER}?shareBy=${shareBy}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(e=>{
      reject(new Error(e.message))
    })
  })
}
function distributorCustomerList(shareBy) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.DISTRIBUTOR_CUSTOMER_LIST}?shareBy=${shareBy}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(e=>{
      reject(new Error(e.message))
    })
  })
}

export {
  distributorOrder,
  distributorCustomer,
  distributorCustomerList
}