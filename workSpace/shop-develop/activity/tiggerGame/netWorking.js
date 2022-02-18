const config = require('../../src/config');

const domain = `${config.domain}/rest/game/lottery` //后台接口主机地址

// const cdn = `https://mini.bestseller.com.cn` //测试环境
const cdn = config.cdn //正式环境

import { request } from '../../utils/request'


// 查询用户
const searchUserApi = `${domain}/userPoints/queryUserPoints?`
// 创建新用户
const createUserApi = `${domain}/userPoints/addUserPoints`
// 抽奖
const choujiangApi = `${domain}/doLottery?`
// 抽奖规则列表
const choujiangguizeApi = `${domain}/list?`
// 排行榜
const paihangbangApi = `${domain}/userPoints/userPointsRank?`
// 兑换奖品列表
const duihuanjiangpinApi = `${domain}/giftExchangeRule/list?`
// 生成好友助力二维码图片
const genQrApi = `${config.domain}/rest/pitayaGame/fans/genQrImg`
// 给好友助力
const addPointApi = `${domain}/fans/addPoint`
// 活动时间
const getActiviTimeApi = `${domain}/lotteryConfig/getActivityTime`
// 兑奖时间
const getDuijiangTimeApi = `${domain}/lotteryConfig/getExchangeTime`
// 兑奖
const duijiangApi = `${domain}/giftOrder/addGiftOrder`
// 兑奖记录
const duijiangjiluApi = `${domain}/giftOrder/list?`
// 手机号查询会员并注册
const queryAndRegisterApi = `${domain}/member/queryAndRegister`


// 查询用户
function searchUser(params){
  wx.removeStorageSync('lhjUser');
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ url:`${searchUserApi}${params}`}).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
          reject(res.msg)
        }
        else{
          if (res.data){
            wx.setStorageSync('lhjUser', res.data);
          }
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
  // 创建新用户
  function createUser(params){
    wx.removeStorageSync('lhjUser');
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url: `${createUserApi}`,
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
          wx.setStorageSync('lhjUser', res.data);
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
  // 抽奖
  function choujiang(params){
      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve, reject)=>{
        request({ url:`${choujiangApi}${params}`}).then(res=>{
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

  // 抽奖规则
  function choujiangguize(){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ url:`${choujiangguizeApi}`}).then(res=>{
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
  // 排行榜
  function paihangbang(){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ url:`${paihangbangApi}`}).then(res=>{
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
  // 兑换奖品
  function duihuanjiangpin(){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ url:`${duihuanjiangpinApi}`}).then(res=>{
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
  // qrcode
  function genQr(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url: `${genQrApi}`,
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
  // 给好友助力
  function addPoint(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url: `${addPointApi}`,
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
  // 获取活动时间
  function getActivityTime(){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ url:`${getActiviTimeApi}`}).then(res=>{
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
  // 获取兑奖时间
  function getDuijiangTime(){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ url:`${getDuijiangTimeApi}`}).then(res=>{
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
  // 兑奖
  function duijiang(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url: `${duijiangApi}`,
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
  // 兑奖记录
  function duijiangjilu(userid){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ url:`${duijiangjiluApi}userid=${userid}`}).then(res=>{
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
  // 手机号查询会员并注册
  function queryAndRegister(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url: `${queryAndRegisterApi}`,
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
  export{
    searchUser,
    createUser,
    choujiang,
    paihangbang,
    duihuanjiangpin,
    genQr,
    addPoint,
    cdn,
    getActivityTime,
    getDuijiangTime,
    duijiang,
    duijiangjilu,
    queryAndRegister
  }