
const config = require('../src/config');
// ../../src/config.js

const cdn = config.cdn //cdn
const domain = config.domain //后台接口主机地址
const brand = config.brand

import { request } from '../utils/request'

const help = `${domain}/rest/game/fission/help`
const helpers = `${domain}/rest/game/fission/helpers`
const creator = `${domain}/rest/game/fission/getCreator`

// 为Ta助力
function getHelp(dJson){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url: `${help}`,
      method: 'POST',
      data: dJson
    }).then(res=>{
      wx.hideLoading();
      res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch(e=>{
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
// 发起人的助力列表信息
function getHelpers(dJson){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url: `${helpers}`,
      method: 'POST',
      data: dJson
    }).then(res=>{
      wx.hideLoading();
      res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch(e=>{
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
// 查询发起人信息
function getCreator(dJson){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url: `${creator}`,
      data: dJson
    }).then(res=>{
      wx.hideLoading();
      res.code == 0 ? resolve(res.data) : reject(new Error(res.msg))
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
      }
    }).catch(e=>{
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
export{
  getHelp,
  getHelpers,
  getCreator
}