/*
* wemember 模块
* */
import { request } from '../utils/request.js'
import { URL, SUCCESS_STATUS } from '../src/const.js'
import { brand } from '../config/brand'
const LOGIN_FAIL = 41001;// 请重新登陆
const config = require('../config/main')
/*
wemember获取sessionkey
* {
	"mobile":"18813068824",
	"key":"038f81e52cf55e9d344453dd6aca72e3"
}

* */
function sessionKey(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SESSION_KEY,
      data: data,
      method: 'post',
      header: {brand}
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// wemember查询是否企业手机号
function isEnterprisePhone(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.IS_ENTERPRISE_PHONE,
      data: data,
      method: 'post'
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// wemember是否登录
function isLoginWeMember(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.IS_LOGIN,
      data: data,
      method: 'post'
    }).then(res => {
      (res.code === SUCCESS_STATUS || res.code === LOGIN_FAIL) ? resolve(res) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

// wemember登录
function loginWeMember(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.LOGIN_WEMEMBER,
      data: data,
      method: 'post'
    }).then(res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 通过员工工号查询员工信息
function getSysUser(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GET_SYS_USER,
      data,
      method: 'post'
    }).then(res => {
      (res.errcode === SUCCESS_STATUS || res.errcode === '0') ? resolve(res.data) : reject(new Error(res.errmsg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
// 通过员工工号查询员工信息
function getDADetail(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.DA_DETAIL,
      data,
      method: 'post'
    }).then(res => {
      (res.errcode === SUCCESS_STATUS || res.errcode === '0') ? resolve(res) : reject(new Error(res.errmsg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
//  发送手机短信验证码
function sendMsg(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SEND_SMS,
      data,
      method: 'post',
    }).then(res => {
      (res.errcode === SUCCESS_STATUS || res.errcode === '0') ? resolve(res) : reject(new Error(res.errmsg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
/*
* key
* mobile
* device
* code
* da_number
*
* */
function weMemberLogin(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.WE_MEMBER_LOGIN,
      data,
      method: 'post',
      header: {brand: config.WE_MEMBER_BRAND[brand]}
    }).then(res => {
      (res.errcode === SUCCESS_STATUS || res.errcode === '0') ? resolve(res) : reject(new Error(res.errmsg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}
/*
*
* key: ''
* */
function weMemberOutLogin(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.WE_MEMBER_OUT_LOGIN,
      data,
      method: 'post',
    }).then(res => {
      (res.errcode === SUCCESS_STATUS || res.errcode === '0') ? resolve(res) : reject(new Error(res.errmsg))
    }).catch(e => {
      reject(new Error(e.msg || e.message))
    })
  })
}

/**
 * 获取企业微信code
 * @param data {"brand":"jj", code: ''}
 * @returns {Promise<unknown>}
 * @constructor
 */
function qYGetCode(data) {
	return new Promise((resolve, reject) => {
		request({
			url: URL.QY_SESSION_KEY,
			data,
			method: 'post',
		}).then(res => {
			(res.errcode === SUCCESS_STATUS || res.errcode === '0') ? resolve(res.data) : reject(new Error(res.errmsg))
		}).catch(e => {
			reject(new Error(e.msg || e.message))
		})
	})
}

/**
 * 企业微信wemember登录
 * @param data
 * @returns {Promise<unknown>}
 * @constructor
 */
function qYWEMemberLogin(data) {
	return new Promise((resolve, reject) => {
		request({
			url: URL.QY_WEMEMBER_LOGIN,
			data,
			method: 'post',
		}).then(res => {
			(res.errcode === SUCCESS_STATUS || res.errcode === '0') ? resolve(res) : reject(new Error(res.errmsg))
		}).catch(e => {
			reject(new Error(e.msg || e.message))
		})
	})
}
export {
  sessionKey,
  isEnterprisePhone,
  isLoginWeMember,
  loginWeMember,
  getSysUser,
  sendMsg,
  getDADetail,
  weMemberLogin,
  weMemberOutLogin,
	qYGetCode,
	qYWEMemberLogin,
  LOGIN_FAIL
}