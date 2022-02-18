const config = require('../../src/config.js');

const cdn = config.cdn //cdn
const domain = config.domain //后台接口主机地址
const brand = config.brand
import { request } from '../../utils/request.js'


// 获取actionID
const getActionIDApi = `${domain}/api/coupon/getActivityByActionId?`
// 商品详情
const getJsonApi = `${domain}/detail/${brand}/` 
// 获取地址信息
const addressApi = `${domain}/api/member/addressGet`

// 订单对应的优惠券列表
const orderCouponListApi = `${domain}/rest/h5Promotion/listBySku`
// 保存订单Api
const orderSaveApi = `${domain}/orderNew/orderSave`
const checkCouponApi = `${domain}/rest/coupon/list`

// 获取商品详情页拼团数据
function getActionID(actionid){
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url:`${getActionIDApi}actionid=${actionid}`
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
  // 获取商品json数据
  function getJson(sku9){
      wx.showLoading({
        title: 'Loading...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve,reject)=>{
        request({
          url:`${getJsonApi}${sku9}.json`
        }).then(res=>{
          wx.hideLoading();
          res.status == 200 ? resolve(res.data) : reject(new Error(res.msg))
          if(res.status != 200){
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

// 获取地址
function getAddress(){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve, reject)=>{
    request({ url:`${addressApi}`}).then(res=>{
      wx.hideLoading();
      res.code == 0 ? resolve(res.data) : reject(new Error(res.msg));
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
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
// 订单对应的优惠券
function getOrderCoupon(jsonData){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve, reject)=>{
    request({ 
      url:`${orderCouponListApi}`,
      method: 'POST',
      data: jsonData
    }).then(res=>{
      wx.hideLoading();
      res.code == 0 ? resolve(res.data) : reject(new Error(res.msg));
      if(res.code != 0){
        wx.showToast({
          title: res.msg,
          icon: "none",
        })
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
  // 保存订单
  function orderSave(params){
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url: `${orderSaveApi}`,
        method: 'POST',
        data: params
      }).then(res=>{
        wx.hideLoading();
        res.code == 0 ? resolve(res.data) : reject(new Error(res.msg));
        if(res.code != 0){
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
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
  // 检测名下是否有对应的券
  function checkCoupon(params){
      wx.showLoading({
        title: 'Loading...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve,reject)=>{
        request({
          url:`${checkCouponApi}`,
          method: 'POST',
          data: params
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
      getActionID,
      getJson,
      getAddress,
      getOrderCoupon,
      orderSave,
      checkCoupon
  }