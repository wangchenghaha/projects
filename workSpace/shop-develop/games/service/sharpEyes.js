import { request } from '../../utils/request.js'
import {SHARPEYES} from './const'
import { wxShowToast } from '../../utils/wxMethods'
const app = getApp();

// 游戏时间范围
function getGameConfig(){
    
    wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve, reject)=>{
        request({
            url:SHARPEYES.GETGAMECONFIG
          }).then(res=>{
          wx.hideLoading();
          if(res.code != 0){
            wxShowToast(res.msg)
          }
          else{
            resolve(res.data)
          }
        }).catch((e)=>{
          wx.hideLoading();
          let a = e.message?e.message:e.msg
          wxShowToast(a)
          reject(new Error(a))
        })
      })
}


// 查询用户
function getUserInfo(_openId){

      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve, reject)=>{
        request({
             url:SHARPEYES.GETUSERINFO,
             data : {
              openid: _openId,
             }
          }).then(res=>{
          wx.hideLoading();
          if(res.code != 0){
            wxShowToast(res.msg)
          }
          else{
            resolve(res.data)
          }
        }).catch((e)=>{
          wx.hideLoading();
          let a = e.message?e.message:e.msg
          wxShowToast(a)
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
        url:SHARPEYES.CREATEUSER,
        method: 'POST',
        data: params
      }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wxShowToast(res.msg)
        }
        else{
          resolve(res.data)
        }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wxShowToast(a)
        reject(new Error(a))
      })
    })
  }

// 分享的用户
function friendHelp(params){
  wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url:SHARPEYES.ADDHELP,
      method: 'POST',
      data: params
    }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
        wxShowToast(res.msg)
        reject(new Error(res.msg))
      }
      else{
        resolve(res.data)
      }
    }).catch((e)=>{
      wx.hideLoading();
      let a = e.message?e.message:e.msg
      wxShowToast(a)
      reject(new Error(a))
    })
  })
}

// 游戏结束
function endGame(params){
    wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
    });
    return new Promise((resolve, reject)=>{
    request({
            url:SHARPEYES.GAMEOVER,
            data : params,
            method:'POST'
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          noticeMsg(res.msg)
          // reject(res.msg)
        }
        else{
          resolve(res.data)
        }
    }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        noticeMsg(res.msg)
        reject(new Error(a))
    })
    })
}
// 优惠券列表
function getCouponList(params){
    wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
    });
    return new Promise((resolve, reject)=>{
        request({
            url:SHARPEYES.GETCOUPONLIST,
            data : params
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wxShowToast(res.msg)
        }
        else{
            resolve(res.data)
        }
        }).catch((e)=>{
          wx.hideLoading();
          let a = e.message?e.message:e.msg
          wxShowToast(a)
          reject(new Error(a))
        })
    })
}


// 获取用户优惠券列表
function getUserCouponList(params){
  wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
  });
  return new Promise((resolve, reject)=>{
      request({
          url:SHARPEYES.GETUSERCOUPONLIST,
          data : params
      }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
        wxShowToast(res.msg)
      }
      else{
          resolve(res.data)
      }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wxShowToast(a)
        reject(new Error(a))
      })
  })
}


// 获取卡片列表
function getCardList(params){
  wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
  });
  return new Promise((resolve, reject)=>{
      request({
          url:SHARPEYES.GETUSERCARD,
          data : params
      }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
        wxShowToast(res.msg)
      }
      else{
          resolve(res.data)
      }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wxShowToast(a)
        reject(new Error(a))
      })
  })
}

// 兑换优惠券
function changeCoupon(params){
  wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
  });
  return new Promise((resolve, reject)=>{
      request({
          header:{
            'content-type': 'application/json', // 请求体类型默认值
            token: wx.getStorageSync('token') || '', //请求凭证
            brand:getApp().config.brand, //测试环境用到
            utmMedium: getUtm().utmMedium,
            utmSource: getUtm().utmSource,
            utmTerm: getUtm().utmTerm,
            utmCampaign: getUtm().utmCampaign 
          },
          url:SHARPEYES.EXCHANGECOUPON,
          data : params,
          method: 'POST'
      }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
        wxShowToast(res.msg)
      }
      else{
          resolve(res.data)
      }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wxShowToast(a)
        reject(new Error(a))
      })
  })
}

// 开大奖
function openBigGif(params){
  wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
  });
  return new Promise((resolve, reject)=>{
      request({
          header:{
            'content-type': 'application/json', // 请求体类型默认值
            token: wx.getStorageSync('token') || '', //请求凭证
            brand:getApp().config.brand, //测试环境用到
            utmMedium: getUtm().utmMedium,
            utmSource: getUtm().utmSource,
            utmTerm: getUtm().utmTerm,
            utmCampaign: getUtm().utmCampaign 
          },
          url:SHARPEYES.OPENBIGGIFT,
          data : params,
          method: 'POST'
      }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
        wxShowToast(res.msg)
      }
      else{
          resolve(res.data)
      }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wxShowToast(a)
        reject(new Error(a))
      })
  })
}





function noticeMsg(msg){
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        wx.navigateTo({
          url: '/games/sharpEyes/main/main'
        })
      }
    });
 }

 function getUtm(){
  let utmData = wx.getStorageSync('daogouLists');
  let json = {}
  if(utmData && utmData.length){
    utmData.forEach(item => {
      if(item.key && item.key.startsWith('utm')){
        json[item.key] = item.value;
      }
    })
  }
  return json;
 }
 

export {
    getGameConfig,
    getUserInfo,
    createUser,
    friendHelp,
    endGame,
    getCouponList,
    getUserCouponList,
    getCardList,
    changeCoupon,
    openBigGif
}      