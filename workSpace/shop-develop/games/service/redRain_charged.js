import { request } from '../../utils/request.js'
import {REDRAINCHARGED} from './const'

// 游戏配置
function getGameConfig(){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.GAMECONFIG
      }).then(res=>{
        wx.hideLoading();
        resolve(res)
      }).catch((e)=>{
        wx.hideLoading();
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
// 查询用户信息
function searchUserInfo(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.SEARCHUSERINFO,
        data:params
      }).then(res=>{
        wx.hideLoading();
        resolve(res)
      }).catch((e)=>{
        wx.hideLoading();
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
// 创建用户信息
function createUserInfo(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.CREATEUSER,
        data:params,
        method: 'POST'
      }).then(res=>{
        wx.hideLoading();
        resolve(res)
      }).catch((e)=>{
        wx.hideLoading();
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
function getGuizeJson(path){
  wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve, reject)=>{
    request({ url:path}).then(res=>{
      wx.hideLoading();
      resolve(res)
    }).catch((e)=>{
      wx.hideLoading();
      wx.showToast({
        title: '获取规则信息失败', //提示的内容,
        icon: 'none', //图标,
        duration: 2000, //延迟时间,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
    })
  })
}
// 我的奖品
function myPrize(params){
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.MYPRIZE,
        data:params
      }).then(res=>{
        resolve(res)
      }).catch((e)=>{
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
// 任务列表
function getTaskList(){
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.TASKLIST
      }).then(res=>{
        resolve(res)
      }).catch((e)=>{
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
// 完成的任务列表
function getSureTaskList(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.SURETASKLIST,
        data : params
      }).then(res=>{
        wx.hideLoading();
        resolve(res)
      }).catch((e)=>{
        wx.hideLoading();
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
// 完成任务
function finishTask(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.FINISHTASK,
        data:params,
        method: 'POST'
      }).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: res.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        resolve(res)
      }).catch((e)=>{
        wx.hideLoading();
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
// 游戏结束
function gameOver(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.GAMEOVER,
        data:params,
        method: 'POST'
      }).then(res=>{
        wx.hideLoading();
        resolve(res)
      }).catch((e)=>{
        wx.hideLoading();
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
// 助力
function help(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.HELP,
        data:params,
        method: 'POST'
      }).then(res=>{
        wx.hideLoading();
        wx.showToast({
          title: res.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        resolve(res)
      }).catch((e)=>{
        wx.hideLoading();
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
// 充能
function charged(params){
    return new Promise((resolve, reject)=>{
      request({ 
        url:REDRAINCHARGED.CHARGED,
        data:params,
        method: 'POST'
      }).then(res=>{
        resolve(res)
      }).catch((e)=>{
        wx.showToast({
          title: e.msg, //提示的内容,
          icon: 'none', //图标,
          duration: 2000, //延迟时间,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
      })
    })
}
  export {
    getGameConfig,
    searchUserInfo,
    createUserInfo,
    getGuizeJson,
    myPrize,
    getTaskList,
    getSureTaskList,
    finishTask,
    gameOver,
    help,
    charged
  }