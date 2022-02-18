//支付业务模块

import { request } from '../utils/request.js'
import { URL, KEYSTORAGE } from '../src/const.js'
const app = getApp();
//支付
function payment(data) {
  return new Promise((resolve, reject) => {
    request( {
      url: URL.MINIPAYMENT,
      data: data,
    }).then( res =>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch(e=>{
      reject(new Error(e.msg || e.message))
    })
  })
}
function paymentNew(data) {
	return new Promise((resolve, reject) => {
		request( {
			url: URL.PAYMENT_NEW,
			data: data,
		}).then( res =>{
			res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
		}).catch(e=>{
			reject(new Error(e.msg || e.message))
		})
	})
}
function wxRequestPayment(data) {
  const {timeStamp = '', nonceStr = '',signType = '',  paySign = '', payPrice = '', bigorderCode = '', ticket= ''} = data;
  getApp().wxPaymentReport(bigorderCode, 'pay', payPrice);
  return new Promise(((resolve, reject) => {
    wx.requestPayment({
      timeStamp,
      nonceStr,
      signType,
      paySign,
      ticket,
      package: data.package,
      success(res){
        /*
      * {errMsg: "requestPayment:ok", code: 0} 成功
      * {errMsg: "requestPayment:fail cancel", code: 1} 失败
      * */
        resolve(Object.assign(res, {code: 0}));
        app.wxPaymentReport(bigorderCode, 'payed', payPrice);
      },
      fail(err){
        resolve(Object.assign(err, {code: 1}));
        app.wxPaymentReport(bigorderCode, 'cancel_pay', payPrice);
      }
    })
  }))
}

/**
 * 会员储值卡查询
 * @param crmId
 * @returns {Promise<unknown>}
 */
function storedValueCard(crmId) {
  return new Promise((resolve, reject) => {
    request( {
      url: URL.STORED_VALUE_CARD,
      data: { crmId },
    }).then( res =>{
      res.code === 0 ? resolve(res.data): reject(res.msg.message || '接口出错')
    }).catch(e=>{
      reject(new Error(e.msg || e.message))
    })
  })
}

/**
 * 发起储值卡支付（根据官网订单号发起支付，储值卡核销）
 * @param bigOrderCode
 * @returns {Promise<unknown>}
 */
function svCardPayByOrderCode(bigOrderCode) {
  return new Promise((resolve, reject) => {
    request( {
      url: URL.SV_CARD_PAY_BY_ORDER_CODE,
      data: { bigOrderCode },
    }).then( res =>{
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch(e=>{
      reject(new Error(e.msg || e.message))
    })
  })
}
export {
  payment,
	paymentNew,
  wxRequestPayment,
  storedValueCard,
  svCardPayByOrderCode
}
