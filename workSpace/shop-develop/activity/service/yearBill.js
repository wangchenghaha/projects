import { request } from '../../utils/request.js'
import {YEARBILL} from './const'

// 年度账单数据
function getYearBill(params){
    
  wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
      return new Promise((resolve, reject)=>{
        request({
             url:YEARBILL.YEARBILLAPI,
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
// 转发发券
function sendCouphon(params){
    
      return new Promise((resolve, reject)=>{
        request({
             url:YEARBILL.SENDCOUPHON,
             data : params
          }).then(res=>{
          
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
          let a = e.message?e.message:e.msg
          wx.showToast({
            title: a,
            icon: "none",
          })
          reject(new Error(a))
        })
      })
}
  export {
    getYearBill,
    sendCouphon
  }