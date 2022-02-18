//退款退单业务模块
import {request} from '../utils/request.js'
import {URL, KEYSTORAGE, SUCCESS_STATUS} from '../src/const.js'

function refundList(_currentPage) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.REFUNDLIST,
      data: {
        currentPage: _currentPage
      }
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 获取退货订单详情
function refundDetail(refundOrderCode) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.REFUND_DETAIL,
      data: {  refundOrderCode }
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

function refundApply(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.REFUND_APPLY,
      data,
      method:'post',
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
function submitWayBill(data) {
  let url = URL.SUBMIT_WAY_BILL;
  if(data.otherWay && data.otherWay === 'alipay'){
    url += '?itemType=2'
  }else{
    url += '?itemType=1'
  }
  return new Promise((resolve, reject) => {
    request({
      url,
      data,
      method:'post',
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
function refundStoreApply(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.REFUND_STORE_APPLY,
      data,
      method:'post',
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 退货门店列表
function refundStoreList(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.REFUND_STORE_LIST,
      data,
      method:'post',
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}


export {
  refundList,
  refundDetail,
  refundApply,
  submitWayBill,
  refundStoreApply,
  refundStoreList
}