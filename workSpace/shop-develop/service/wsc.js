//优惠券业务模块

import { request } from '../utils/request.js'
import { URL, KEYSTORAGE, SUCCESS_STATUS } from '../src/const.js'
const brand = getApp().config.brand;
function getSendCoupon(memberno) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.SEND_COUPON}`
    }).then(res => {
      resolve(res[brand])
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}
function getCode(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.GET_CODE}`,
      data,
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res) : reject(new Error(res.msg))
    }).catch(err=>{
      reject(new Error(err.msg || err.message))
    })
  }))
}


export {
  getSendCoupon,
  getCode
}