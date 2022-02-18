const config = require('../../src/config');

const domain = `${config.domain}/rest/game/jump` //后台接口主机地址

// const cdn = `https://mini.bestseller.com.cn` //测试环境


import { request } from '../../utils/request'


// 查询用户
const searchUserApi = `${domain}/queryUserPoints?`
// 创建新用户
const createUserApi = `${domain}/addUserPoints`
// 游戏活动时间
const activiGameTimeApi = `${domain}/getActivityTime`
// 获取优惠券列表
const getListCouponApi = `${domain}/listCoupon`
// 获取兑换记录
const duihuanjiluApi = `${domain}/couponRecords`
// 领取优惠券
const getCouponApi = `${domain}/getCoupon`
// 获取世界排行
const getWorldListApi = `${domain}/getWorldList`
// 获取好友排行
const getHaoyouListApi = `${config.domain}/rest/game/userRank`
// 助力
const addHelpApi = `${domain}/addHelp`
// 开始游戏
const startGameApi = `${domain}/gameStart`
// 游戏结束
const endGameApi = `${domain}/gameEnd`


// 查询用户
function searchUser(params){
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
  // 查询游戏活动时间
  function activiGameTime(){
      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve, reject)=>{
        request({ url:activiGameTimeApi}).then(res=>{
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
    // 获取优惠券列表
    function getCouponList(isFirst) {
      if (isFirst){
        wx.showLoading({
          title: '加载中……',
          mask: true
        });
      }
      return new Promise((resolve, reject) => {
        request({
          url: getListCouponApi
        }).then(res => {
          if (isFirst){
            wx.hideLoading();
          }
    
          if (res.code == 0){
            resolve(res.data)
          }
          else{
            wx.showToast({
              title: res.msg,
              icon: 'none'
            });
            reject(res.msg)
          }
    
        }).catch(e=>{
          if (isFirst){
            wx.hideLoading();
          }
          wx.showToast({
            title: e.msg,
            icon: 'none'
          });
          reject(e.msg)
        })
      })
    }
    // 兑奖记录
    function duijiangjilu(data,isFirst) {
      if (isFirst){
        wx.showLoading({
          title: '加载中……',
          mask: true
        });
      }
      return new Promise((resolve, reject) => {
        request({
          url: duihuanjiluApi,
          data
        }).then(res => {
          if (isFirst){
            wx.hideLoading();
          }
    
          if (res.code == 0){
            resolve(res.data)
          }
          else{
            wx.showToast({
              title: res.msg,
              icon: 'none'
            });
            reject(res.msg)
          }
    
        }).catch(e=>{
          if (isFirst){
            wx.hideLoading();
          }
          wx.showToast({
            title: e.msg,
            icon: 'none'
          });
          reject(e.msg)
        })
      })
    }
// 领取优惠券
function getCouphon(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
  return new Promise((resolve, reject) => {
    request({
      url: getCouponApi,
      data,
      method:'post'
    }).then(res => {
		wx.hideLoading();
	  if (res.code == 0){
      wx.showModal({
        title: '兑换成功',
        content: '会员中心->我的优惠券,查看使用',
        showCancel: false
      });
      resolve(res.data)
	  }
	  else{
      wx.showModal({
        title: '兑换失败',
        content: res.msg,
        showCancel: false
      });
		reject(res.msg)
		  
	  }
    }).catch(e => {
		wx.hideLoading();
    wx.showModal({
      title: '兑换失败',
      content: e.msg,
      showCancel: false
    });
		reject(e.msg)
    })
  })
}
// 获取世界排行
function getWorldList(isFirst) {
  if (isFirst){
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
  }
  return new Promise((resolve, reject) => {
    request({
      url: getWorldListApi
    }).then(res => {
      if (isFirst){
        wx.hideLoading();
      }

      if (res.code == 0){
        resolve(res.data.slice(0,10))
      }
      else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
        reject(res.msg)
      }

    }).catch(e=>{
      if (isFirst){
        wx.hideLoading();
      }
      wx.showToast({
        title: e.msg,
        icon: 'none'
      });
      reject(e.msg)
    })
  })
}
// 获取好友排行
function getHaoyouList(data,isFirst) {
  if (isFirst){
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
  }
  return new Promise((resolve, reject) => {
    request({
      url: getHaoyouListApi,
      data,
      method:'post'
    }).then(res => {
      if (isFirst){
        wx.hideLoading();
      }
	  if (res.code == 0){
      resolve(res.data.slice(0,10))
	  }
	  else{
		wx.showToast({
			title: res.msg,
			icon: 'none'
		});
		reject(res.msg)
		  
	  }
    }).catch(e => {
      if (isFirst){
        wx.hideLoading();
      }
		wx.showToast({
			title: e.msg,
			icon: 'none'
		});
		reject(e.msg)
    })
  })
}
// 助力
function addZhuli(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
  return new Promise((resolve, reject) => {
    request({
      url: addHelpApi,
      data,
      method:'post'
    }).then(res => {
		wx.hideLoading();
	  if (res.code == 0){
      resolve(res.data)
	  }
	  else{
      reject(res.msg)
		  
	  }
    }).catch(e => {
      console.log(`助力失败************`)
		wx.hideLoading();
		wx.showToast({
			title: e.msg,
			icon: 'none'
		});
    })
  })
}
// 开始游戏
function startGame(data) {
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
  return new Promise((resolve, reject) => {
    request({
      url: startGameApi,
      data
    }).then(res => {
      wx.hideLoading();

      if (res.code == 0){
        resolve(res.data)
      }
      else{
        wx.showToast({
          title: res.msg,
          icon: 'none'
        });
        reject(res.msg)
      }

    }).catch(e=>{
      wx.hideLoading();
      wx.showToast({
        title: e.msg,
        icon: 'none'
      });
      reject(e.msg)
    })
  })
}
// 游戏结束
function endGame(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
  return new Promise((resolve, reject) => {
    request({
      url: endGameApi,
      data
    }).then(res => {
		wx.hideLoading();
	  if (res.code == 0){
      resolve(res.data)
	  }
	  else{
		wx.showToast({
			title: res.msg,
			icon: 'none'
		});
		reject(res.msg)
		  
	  }
    }).catch(e => {
		wx.hideLoading();
		wx.showToast({
			title: e.msg,
			icon: 'none'
		});
		reject(e.msg)
    })
  })
}
  export{
    searchUser,
    createUser,
    activiGameTime,
    getCouponList,
    duijiangjilu,
    getCouphon,
    getWorldList,
    getHaoyouList,
    addZhuli,
    startGame,
    endGame
  }