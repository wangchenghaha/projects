//活动券业务模块

import {request} from '../../utils/request.js'
import {URL, KEYSTORAGE} from '../../src/const.js'

// 小红书列表
function redBookList(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.RED_BOOK_LIST,
      data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.msg))
    })
  }))
}
// 小红书详情
function redBookDetail(id) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.RED_BOOK_DETAIL}?id=${id}`,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.msg))
    })
  }))
}
function redBookAdd(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.RED_BOOK_ADD,
      data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.msg))
    })
  }))
}
function redBookRemove(id) {
  return new Promise(((resolve, reject) => {
    request({
      url: `${URL.RED_BOOK_REMOVE}?id=${id}`,
    }).then(res => {
      res.code === 0 ? resolve(res) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.msg))
    })
  }))
}
function redBookUpdate(data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.RED_BOOK_UPDATE,
      data,
      method: 'post'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(new Error(res.msg));
    }).catch(err => {
      reject(new Error(err.msg))
    })
  }))
}
export {
  redBookList,
  redBookDetail,
  redBookAdd,
  redBookRemove,
  redBookUpdate
}