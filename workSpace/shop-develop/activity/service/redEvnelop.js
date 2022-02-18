import { request } from '../../utils/request.js'
import {REDRAIN} from './const'
const app = getApp();

// 游戏时间范围
function getGameTime(){
    
    wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve, reject)=>{
        request({
             url:REDRAIN.GETACTIVITYTIME
          }).then(res=>{
          wx.hideLoading();
          if(res.code != 0){
            wx.showToast({
              title: res.msg,
              icon: "none",
            })
            // reject(res.msg)
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


// 查询用户
function searUserInfo(_openId){

      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve, reject)=>{
        request({
             url:REDRAIN.GETUSERINFO,
             data : {
                openId: _openId,
             }
          }).then(res=>{
          wx.hideLoading();
          if(res.code != 0){
            wx.showToast({
              title: res.msg,
              icon: "none",
            })
            // reject(res.msg)
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
        url:REDRAIN.CREATEUSER,
        method: 'POST',
        data: params
      }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
          // reject(res.msg)
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

// 分享的用户
function shareUser(params){
  wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url:REDRAIN.ADDHELP,
      method: 'POST',
      data: params
    }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
        reject(res.msg)
      }
      else{
        resolve(res.data)
      }
    }).catch((e)=>{
      wx.hideLoading();
      let a = e.message?e.message:e.msg
      reject(new Error(a))
    })
  })
}



// 打开宝箱
function kaiqibaoxiang(params){
    wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
    });
    return new Promise((resolve, reject)=>{
        request({
            url:REDRAIN.OPENBOX,
            data : params,
            method: 'POST' 
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
// 游戏开始
function startGame(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({
           url:REDRAIN.STARTGAME,
           data : params
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
// 游戏结束
function endGame(params){
    wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
    });
    return new Promise((resolve, reject)=>{
    request({
            url:REDRAIN.GAMEOVER,
            data : params
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
            url:REDRAIN.GETCOUPONLIST,
            data : params
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
            wx.showToast({
              title: res.msg,
              icon: "none",
            })
           // reject(res.msg)
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

// 分享券
function shareCoupon(params){
  wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
  });
  return new Promise((resolve, reject)=>{
      request({
          url:REDRAIN.SHARECOUPON,
          data : params,
          method: 'POST' 
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

function noticeMsg(msg){
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        wx.navigateTo({
          url: '/activity/redEnvelop/main/main'
        })
      }
    });
 }

export {
    getGameTime,
    searUserInfo,
    createUser,
    shareUser,
    kaiqibaoxiang,
    startGame,
    endGame,
    getCouponList,
    shareCoupon
}      