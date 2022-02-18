import {request} from '../utils/request.js'
import {URL, KEYSTORAGE} from '../src/const.js'

// 导购上传视频
function saVideoAdd (data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SAVIDEO_ADD,
      data,
      method:'post',
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// 获取员工信息
function getUserInfo(param) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.SAVIDEO_GETUSERINFO,
      data: param
    }).then(res=>{
      if(res.code === 0){
        resolve(res.data)
      }
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}

// 分页显示导购视频上传列表
function getPage(param) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.SAVIDEO_PAGE,
      data: param,
      // method:'post',
    }).then(res=>{
      if(res.code === 0){
        resolve(res.data)
      }
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}

// 删除导购视频
function getDelete(param) {
  return new Promise((resolve, reject)=>{
    request({
      url: `${URL.SAVIDEO_DELETE}?id=${param}`,
      // url: URL.SAVIDEO_DELETE,
      // data: {id = param},
      method: 'DELETE'
    }).then(res=>{
      if(res.code === 0){
        resolve(res.data)
      }
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}

// 根据id获取上传视频详情
function getDetail(param) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.SAVIDEO_DETAIL,
      data: param
    }).then(res=>{
      if(res.code === 0){
        resolve(res.data)
      }
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}

// 增加人气
function clickTime(param) {
  return new Promise((resolve, reject)=>{
    request({
      url:URL.SAVIDEO_CLICKTIME,
      data: param
    }).then(res=>{
      if(res.code === 0){
        resolve(res.data)
      }
    }).catch((e)=>{reject(new Error(e.msg))})
  })
}


export {
  saVideoAdd,
  getUserInfo,
  getPage,
  getDelete,
  getDetail,
  clickTime
}