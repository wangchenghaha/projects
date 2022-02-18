import { request } from '../../utils/request.js'
import {NIAN} from './const'

// 游戏时间范围
function getGameTime(){
    
  wx.showLoading({
    title: '加载中……', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
      return new Promise((resolve, reject)=>{
        request({
             url:NIAN.GETGAMETIME
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
// 查询用户
function searUserInfo(params){

    return new Promise((resolve, reject)=>{
      request({
           url:NIAN.SEARCHUSERINFO,
           data : params
        }).then(res=>{
        
        if(res.code != 0){
          wx.hideLoading();
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

  // 创建用户
  function createUser(params){
    return new Promise((resolve,reject)=>{
      request({
        url:NIAN.CREATUSERINFO,
        method: 'POST',
        data: params
      }).then(res=>{
        
        if(res.code != 0){
          wx.showToast({
            title: res.msg,
            icon: "none",
          })
          wx.hideLoading();
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
  // 获取生肖列表
  function searchZodiacList(params){
      
        return new Promise((resolve, reject)=>{
          request({
               url:NIAN.SEARCHZODIACLIST,
               data : params
            }).then(res=>{
            
            if(res.code != 0){
              wx.hideLoading();
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
  // 开盲盒
  function openbox(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url:NIAN.OPENBOX,
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
  // 打年兽
  function attack(params){
    // wx.showLoading({
    //   title: '加载中……', //提示的内容,
    //   mask: true, //显示透明蒙层，防止触摸穿透,
    //   success: res => {}
    // });
    return new Promise((resolve,reject)=>{
      request({
        url:NIAN.ATTACK,
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
  // 获取生肖列表
  function myprize(params){
      
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
        return new Promise((resolve, reject)=>{
          request({
               url:NIAN.MYPRIZE,
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
  // 大礼包
  function lastPrize(params){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve,reject)=>{
      request({
        url:NIAN.LASTPRIZE,
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
  // 助力
  function addZhuli(params){
    return new Promise((resolve,reject)=>{
      request({
        url:NIAN.ADDZHULI,
        method: 'POST',
        data: params
      }).then(res=>{

        if(res.code != 0){
          
          // wx.showToast({
          //   title: res.msg,
          //   icon: "none",
          // })
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
    getGameTime,
    searUserInfo,
    createUser,
    searchZodiacList,
    openbox,
    attack,
    myprize,
    lastPrize,
    addZhuli
  }