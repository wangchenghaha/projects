import { request } from '../../../utils/request.js'
import { URL, KEYSTORAGE } from '../../../src/const.js'

// 获取宠物列表
function getPetList() {
    return new Promise(((resolve, reject) => {
      request({
        url: URL.GETPETLIST,
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
  }

// 查询用户积分信息
function queryUserPoints(_openid) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.QUERYUSERPOINTS,
      data: {
        openId: _openid
      }
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

// 宠物选择
function petSelect(_data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL.PETSELECT,
      data: _data
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

function addUserPoints(_data){
  return new Promise(((resolve, reject) => {
    request({
      url: URL.ADDUSERPOINTS,
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
    getPetList,
    queryUserPoints,
    addUserPoints,
    petSelect
}

