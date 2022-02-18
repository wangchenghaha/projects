import {request} from '../utils/request.js'
import {URL, KEYSTORAGE} from '../src/const.js'

function saleStateSort(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SALESTATESORT,
      data: data
    }).then((res) => {
      res.code === 0 ? resolve(res):reject(new Error(res.msg));
    }).catch((e) => {
        reject(new Error(e.msg || e.message));
    });
  })
}
function salesView(guideId) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.SALESPERFORMANCEOVERVIEW}?shareBy=${guideId}`,
    }).then((res) => {
      res.code === 0 ? resolve(res.data):reject(new Error(res.msg));
    }).catch((e) => {
      reject(new Error(e.msg || e.message));
    });
  })
}
// 导购业绩
function getStaffSale(guideId) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.GET_STAFF_SALE}?shareBy=${guideId}`,
    }).then((res) => {
      res.code === 0 ? resolve(res.data):reject(new Error(res.msg));
    }).catch((e) => {
      reject(new Error(e.msg || e.message));
    });
  })
}
function shareTemplateState(guideId) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.SHARETEMPLATESTATE}?shareBy=${guideId}`,
    }).then((res) => {
      res.code === 0 ? resolve(res.data):reject(new Error(res.msg));
    }).catch((e) => {
      reject(new Error(e.msg || e.message));
    });
  })
}
function guideOrderList(data) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.GUIDEORDERLIST}`,
      data: data
    }).then((res) => {
      resolve(res)
    }).catch((e) => {
      reject(new Error(e.msg || e.message));
    });
  })
}

function getStaffSaleByTop(data) {
  return new Promise((resolve, reject) => {
    request({
      url: `${URL.STAFFSALEBYTOP}`,
      data: data
    }).then((res) => {
      res.code === 0 ? resolve(res.data):reject(new Error(res.msg));
    }).catch((e) => {
      reject(new Error(e.msg || e.message));
    });
  })
}

export {
  saleStateSort,
  salesView,
  guideOrderList,
  shareTemplateState,
  getStaffSale,
  getStaffSaleByTop
}