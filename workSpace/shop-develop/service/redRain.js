/*
 * @Author: your name
 * @Date: 2020-06-05 14:39:16
 * @LastEditTime: 2020-07-15 17:23:11
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /FOL/service/redRain.js
 */ 
//导购业务模块

import { request } from '../utils/request.js'
import { URL } from '../src/const.js'
function searUserInfo(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYSEARCHUSERINFO,
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
// 创建用户
function createUser(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
  return new Promise((resolve, reject) => {
    request({
      url: URL.HBYCREATEUSER,
      data,
      method:'post'
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
// 获取好友助力列表
function searchZhuli(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYSEARCHZHULI,
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
// 游戏开始
function startGame(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYSTARTGAME,
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
			url: URL.HBYENDGAME,
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
// 获取优惠券列表
function getCouponList() {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYCOUPONLIST
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
// 获取活动时间
function getActionTime() {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYSEARCHACTIONTIME
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

// 领取优惠券
function getCouphon(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
  return new Promise((resolve, reject) => {
    request({
      url: URL.HBYGETCOUPON,
      data,
      method:'post'
    }).then(res => {
		wx.hideLoading();
	  if (res.code == 0){
		if(getApp().config.brand == 'VEROMODA'){
			  wx.showToast({
				  title: '兑换成功',
				  icon: 'none'
			  });
		}
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
// 兑奖记录
function duijiangjilu(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYDUIJIANGLIST,
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
// 助力
function addZhuli(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
  return new Promise((resolve, reject) => {
    request({
      url: URL.HBYZHULI,
      data,
      method:'post'
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
// 开启宝箱
function kaiqibaoxiang(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYKAIQIBX,
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
// 增加用户积分
function addUserNum(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYADDUSERJIFEN,
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
// 奖品兑换列表
function jpdhList(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYJPDHLIST,
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
// 任务列表
function taskList(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYTASKLIST,
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
// 用户完成的任务列表
function taskUserList(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYUSERTASKLIST,
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
// 完成任务
function wanchengTask(data) {
	wx.showLoading({
		title: '加载中……',
		mask: true
	});
	return new Promise((resolve, reject) => {
		request({
			url: URL.HBYWCTASK,
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
export {
	searUserInfo,
	createUser,
	searchZhuli,
	startGame,
	endGame,
	getCouponList,
	getCouphon,
	duijiangjilu,
	addZhuli,
	kaiqibaoxiang,
	getActionTime,
	addUserNum,
	jpdhList,
	taskList,
	taskUserList,
	wanchengTask
}