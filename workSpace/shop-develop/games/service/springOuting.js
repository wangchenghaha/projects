import { request } from '../../utils/request.js'
import {SPRINGOUTING} from './const'
import { wxShowToast } from '../../utils/wxMethods'
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
             url:SPRINGOUTING.GETACTIVITYTIME
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
             url:SPRINGOUTING.GETUSERINFO,
             data : {
                openId: _openId,
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
        url:SPRINGOUTING.CREATEUSER,
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
      url:SPRINGOUTING.ADDHELP,
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



// 打开宝箱
function kaiqibaoxiang(params){
    wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
    });
    return new Promise((resolve, reject)=>{
        request({
            url:SPRINGOUTING.OPENBOX,
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
           url:SPRINGOUTING.STARTGAME,
           data : {
            userid: params
           }
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
            url:SPRINGOUTING.GAMEOVER,
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
            url:SPRINGOUTING.GETCOUPONLIST,
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


function noticeMsg(msg){
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function (res) {
        wx.navigateTo({
          url: '/activity/games/springOuting/index/index'
        })
      }
    });
 }

  // 世界排名
function worldRank(params){
  wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url:SPRINGOUTING.RANKLISTS,
      data: params
    }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
        wxShowToast(res.msg)}
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


 // 好友排名
function userRank(params){
  wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url:SPRINGOUTING.FRIENDSRANKS,
      method: 'POST',
      data: params
    }).then(res=>{
      wx.hideLoading();
      if(res.code != 0){
        wxShowToast(res.msg)}
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

// 领台阶数奖励 
function openStepsGift(params){
  wx.showLoading({
  title: '加载中……', //提示的内容,
  mask: true, //显示透明蒙层，防止触摸穿透,
  success: res => {}
  });
  return new Promise((resolve, reject)=>{
  request({
          url:SPRINGOUTING.OPENSTEPGIFT,
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

// 台阶数奖励领取记录
function stepsGiftRecords(params){
  wx.showLoading({
  title: '加载中……', //提示的内容,
  mask: true, //显示透明蒙层，防止触摸穿透,
  success: res => {}
  });
  return new Promise((resolve, reject)=>{
  request({
          url:SPRINGOUTING.OPENSTEPRECORDS,
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


export {
    getGameTime,
    getUserInfo,
    createUser,
    friendHelp,
    kaiqibaoxiang,
    startGame,
    endGame,
    getCouponList,
    openStepsGift,
    stepsGiftRecords,
    userRank,
    worldRank
}      