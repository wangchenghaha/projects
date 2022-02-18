const config = require('../../src/config');

const domain = `${config.domain}/rest/activity/acActive/` //后台接口主机地址

// const cdn = `https://mini.bestseller.com.cn` //测试环境
const cdn = config.cdn //正式环境

import { request } from '../../utils/request'


// 查询用户
const searchUserApi = `${domain}findAcUser`
// 创建用户
const createUserApi = `${domain}addAcUser`
// 获取随机问题
const getAcQuestionApi = `${domain}getAcQuestion`
// 更新打卡
const updateFlashApi = `${domain}updateAcLog`
// 领奖
const lingjiangApi = `${domain}updateAcReceive`

// 查询用户
function searchUser(params){

    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({
           url:searchUserApi,
           data : params
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
          reject(res.msg)
        }
        else{
          resolve(res.data)
        }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wx.showToast({
          title: a,
          icon: "none",
        })
        reject(new Error(a))
      })
    })
  }

  // 创建用户
  function createUser(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url: createUserApi,
        method: 'POST',
        data: params
      }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
          reject(res.msg)
        }
        else{
          resolve(res.data)
        }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wx.showToast({
          title: a,
          icon: "none",
        })
        reject(new Error(a))
      })
    })
  }

// 获取随机问题
function getQuestion(params){

    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({
           url:getAcQuestionApi,
           data : params
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
          reject(res.msg)
        }
        else{
          resolve(res.data)
        }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wx.showToast({
          title: a,
          icon: "none",
        })
        reject(new Error(a))
      })
    })
  }
  // 更新打卡
  function updateFlash(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url: updateFlashApi,
        method: 'POST',
        data: params
      }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            cancelText: '取消'
          });
          reject(res.msg)
        }
        else{
          resolve(res.data)
        }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wx.showModal({
          title: '提示',
          content: a,
          showCancel: false,
          cancelText: '取消'
        });
        reject(new Error(a))
      })
    })
  }
  // 领奖
  function lingjiang(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url: lingjiangApi,
        method: 'POST',
        data: params
      }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wx.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
            cancelText: '取消'
          });
          reject(res.msg)
        }
        else{
          resolve(res.data)
        }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wx.showModal({
          title: '提示',
          content: a,
          showCancel: false,
          cancelText: '取消'
        });
        reject(new Error(a))
      })
    })
  }
  export{
    searchUser,
    createUser,
    getQuestion,
    updateFlash,
    lingjiang
  }