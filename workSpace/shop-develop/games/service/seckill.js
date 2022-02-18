import { request } from '../../utils/request.js'
import {SECKILL} from './const'


// 查询用户
function getSeckillList(){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({
           url:SECKILL.GETSECKILLLIST
        }).then(res=>{
        wx.hideLoading();
        if(res.code != 0){
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
        }
        else{
          resolve(res.data)
        }
      }).catch((e)=>{
        wx.hideLoading();
        let a = e.message?e.message:e.msg
        wx.showModal({
            title: '提示',
            content: a,
            showCancel: false,
            success: function (res) {
               wx.switchTab({url: '/pages/index/index'})
            }
        });
        reject(new Error(a))
      })
    })
  }

export{
    getSeckillList
}