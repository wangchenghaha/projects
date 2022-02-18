//用户业务模块

import { request } from '../utils/request.js'
import {getUserinfo } from '../base/url'
import {URL, SUCCESS_STATUS, KEYSTORAGE} from '../src/const';
import { brand } from '../config/brand';
import { ETO_BRAND } from '../config/main';
const config = require('../src/config.js')
/**
 * 获取手机验证码
 */
function getCode(phone,securityValue) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETCODE,
      method:'POST',
      data: {
        phone: phone,
        securityValue: securityValue
      }
    })
    .then((response) => {
      if (response.code === 0) {
        resolve(response.msg); //视图层需要的参数
      } else {
        reject(new Error(response.msg)); //视图层显示错误信息
      }
    })
    .catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  });
}

/**
 * 登录
 */
function login(username,password,employeeNO) {

  let data = { username: username, password: password }

  //如果有员工号则最近
  if(employeeNO){
    Object.assign(data,{ employeeNO:employeeNO });
  }

  return new Promise((resolve, reject) => {
    request({
      url: URL.LOGIN,
      method: 'POST',
      data: data
    })
    .then((response) => {
      if (response.code === 0) {
        resolve(response.msg); //视图层需要的参数
      } else {
        reject(new Error(response.msg)); //视图层显示错误信息
      }
    })
    .catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  });
}

/*
* 会员中心轮播图素材
* */
function getMemberSwiper() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.GETMEMBERPICS,
    }).then((response) => {
      response.code === 0 ? resolve(response.data): reject(new Error(response.msg))
    }).catch((e) => {
      reject(new Error(e.msg || e.message)); //视图层显示错误信息
    });
  });
}
/*
* 获取CRM信息
* */
function getCRMInfo(data) {
  let param = {
    brand: ETO_BRAND[brand],
    unionId: wx.getStorageSync(KEYSTORAGE.unionid) || ''
  };
  let reqConfig = {
    url: URL.NEW_CRM_INFO,
    data: param,
    method: 'post',
  };
  data ? Object.assign(param, data) : '';
  return new Promise((resolve, reject) => {
    request(reqConfig).then(res => {
      (res.code === SUCCESS_STATUS || res.errcode === SUCCESS_STATUS) ? resolve(res.data) : reject(new Error(res.msg))
    })
  })
}
//获取地址
function getAddress() {
  return new Promise( (resolve, reject) => {
    request({
      url: URL.GETADDRESS,
    }).then( res => {
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch( err => {
      reject(new Error(err.msg || err.message))
    })
  })
}
//添加地址
function addAddress(data) {
  return new Promise( (resolve, reject) => {
    request({
      url: URL.ADDRESS_ADD,
      data,
      method: 'post'
    }).then( res => {
      res.code === 0 ? resolve(res.data): reject(new Error(res.msg))
    }).catch( err => {
      reject(new Error(err.msg || err.message))
    })
  })
}
// 删除
function delAddress(id) {
  return new Promise( (resolve, reject) => {
    request({
      url: URL.ADDRESS_DELETE,
      data: {addressId: id},
      method: 'post'
    }).then( res => {
      res.code === 0 ? resolve(res): reject(new Error(res.msg))
    }).catch( err => {
      reject(new Error(err.msg || err.message))
    })
  })
}
// 更新
function updateAddress(data) {
  return new Promise( (resolve, reject) => {
    request({
      url: URL.ADDRESS_UPDATE,
      data,
      method: 'post'
    }).then( res => {
      res.code === 0 ? resolve(res): reject(new Error(res.msg))
    }).catch( err => {
      reject(new Error(err.msg || err.message))
    })
  })
}
// 联系我们数据
function getContact() {
  return new Promise( (resolve, reject) => {
    request({
      url: URL.CONTACT_US,
    }).then( res => {
      resolve(res.data)
    }).catch( err => {
      reject(new Error(err.msg || err.message))
    })
  })
}
/*
*
* 判断是否会员  20190221 ---yxw
* data = {
*   openid: OpenId,
    unionid: UniondId,
    channel: this.data.channel,
    delivery_id: this.data.delivery_id,
    以下非必填
    nation: location.nation,
    province: location.province,
    city: location.city,
    district: location.district
*
* }
* */
function isMemberNew(data) {
  return new Promise( (resolve, reject) => {
    request({
      url: URL.IS_MEMBER,
      data,
    }).then( res => {
      resolve(res)
    }).catch( err => {
      reject(new Error(err.msg || err.message))
    })
  })
}
// JL修改会员信息
function updateCRMInfo(data) {
  return new Promise( (resolve, reject) => {
    request({
      url: URL.UPDATE_CRM_INFO,
      data,
      header: {
        token: wx.getStorageSync('token') || '',
        brand //测试环境用到
      },
      method: 'post'
    }).then( res => {
      res.code === SUCCESS_STATUS ? resolve(res.data) : reject(new Error(res.msg))
    }).catch( err => {
      reject(new Error(err.msg || err.message))
    })
  })
}

// 20200624----兑吧接口
function getFreeLogin(paramBean) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.DUIBAFREELOGIN,
      method: 'GET',
      data: paramBean
    })
      .then(response => {
        if (response.code == 0) {
          resolve(response);
        } else {
          reject(new Error(response.msg));
        }
      })
      .catch(e => {
        reject(new Error(e.msg));
      });
  });
}

/**
 * 积分变动通知原因
 * @param  data : {
 *   phone, brand, platform
 * }
 * @returns {Promise<unknown>}
 */
function queryPointsUpdReason(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.QUERY_POINTS_UPD_REASON,
      method: 'post',
      data
    }).then(response => {
      response.code === 0 ? resolve(response.data) : reject(new Error(response.msg));
    }).catch(e => {
      reject(new Error(e.msg));
    });
  });
}

function getPointRecord(data) {
  return new Promise((resolve, reject) => {
    request({
      url: URL.POINT_RECORD,
      method: 'post',
      data
    }).then(response => {
      response.code === 0 ? resolve(response.data) : reject(new Error(response.msg));
    }).catch(e => {
      reject(new Error(e.msg));
    });
  });
}

function getPointRule(){
  return new Promise((resolve, reject) => {
    request({ url: URL.POINT_RULE}).then(res => {
        resolve(res.list)
    }).catch((e) => { reject(new Error(e.msg)) })
  })
}


export {
  getCode,
  login,
  getMemberSwiper,
  getCRMInfo,
  getAddress,
  addAddress,
  delAddress,
  updateAddress,
  getContact,
  isMemberNew,
  updateCRMInfo,
  getFreeLogin,
  queryPointsUpdReason,
  getPointRecord,
  getPointRule
}