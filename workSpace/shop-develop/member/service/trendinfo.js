
import { request } from '../../utils/request.js'
import { URL_TRENDINFO, KEYSTORAGE } from '../service/const.js'

// 获取潮流咨询列表
function bindVistor(_data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL_TRENDINFO.BINDVISITOR,
      data: _data,
      method: 'POST'
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}


// 获取潮流咨询列表
function getTrendList(_data) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL_TRENDINFO.TRENDINFOLIST,
        data: _data
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}

// 获取潮流咨询列表(旧接口)
function getTrendListTwo(_data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL_TRENDINFO.TRENDINFOLISTTWO,
      data: _data,
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}



// 潮流资讯详情
function getTrendDetail(_data) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL_TRENDINFO.TRENDINFODETAIL,
        data: _data
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


// 潮流咨询关注
function trendFocus(_data) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL_TRENDINFO.TRENDINFOFOCUS,
        data: _data
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


//  潮流咨询点赞
function trendPraise(_data) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL_TRENDINFO.TRENDINFOPAISE,
        data: _data
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


// 潮流咨询取消关注
function trendCancelFoucs(_data) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL_TRENDINFO.TRENDINFOCANCELFOCUS,
        data: _data
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


// 潮流咨询取消点赞
function trendCancelPraise(_data) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL_TRENDINFO.TRENDINFOCANCELPRAISE,
        data: _data
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


// 编辑用户信息
function trendEditUser() {
    return new Promise(((resolve, reject) => {
      request({
        url: URL_TRENDINFO.TRENDINFOEDITUSER,
        data: _data,
        method: 'POST'
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


// 潮流咨询访客中心
function trendVisitor(userId) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL_TRENDINFO.TRENDINFOVISTORCENTER,
        data: {
          visitorId: userId
        },
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
}


// 潮流咨询作者中心
function trendAutorCenter(_data) {
  return new Promise(((resolve, reject) => {
    request({
      url: URL_TRENDINFO.TRENDINFOAUTORCENTER,
      data: _data
    }).then(res => {
      res.code === 0 ? resolve(res.data) : reject(res.msg);
    }).catch(err=>{
      reject(new Error(err.msg))
    })
  }))
}

export{
    bindVistor,
    getTrendList,
    getTrendListTwo,
    getTrendDetail,
    trendFocus,
    trendPraise,
    trendCancelFoucs,
    trendCancelPraise,
    trendEditUser,
    trendVisitor,
    trendAutorCenter
}