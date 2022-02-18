//service相关 业务模块

import {request} from '../utils/request.js'
import {URL} from '../src/const';

/**
 * 初始sdk
 */
function init() {
  return new Promise((resolve, reject) => {
    let token = wx.getStorageSync('token')
    if (!token) {
      request({
        url: URL.INIT,
        data: {
          channel: 5
        }
      })
        .then((response) => {
          if (response.code === 0) {
            wx.setStorageSync('token', response.data.token);
            resolve(response.data.token); //视图层需要的参数
          } else {
            reject(new Error(response.msg)); //视图层显示错误信息
          }
        })
        .catch((e) => {
          reject(new Error(e.msg || e.message)); //视图层显示错误信息
        });
    } else {
      //兼容代码，过几个月再删除(删除不影响)
      if (token && token.startsWith('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.')) {
        wx.setStorageSync('token', token.replace(/eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9./, ''))
      }
    }

  });
}

/**
 * 获取验证码
 */
function securityCode() {
  return new Promise((resolve, reject) => {
    request({
      url: URL.SECURITYCODE
    })
      .then((response) => {
        if (response.code === 0) {
          resolve(response.data.security); //视图层需要的参数
        } else {
          reject(new Error(response.msg)); //视图层显示错误信息
        }
      })
      .catch((e) => {
        reject(new Error(e.msg || e.message)); //视图层显示错误信息
      });
  });
}


export {
  init as initSDK,
  securityCode,
}