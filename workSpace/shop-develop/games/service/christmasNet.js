import { request } from '../../utils/request.js'
import {CHRISTMAS} from './const'

// 游戏时间范围
function getGameTime(){
    
    wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve, reject)=>{
        request({
             url:CHRISTMAS.GETGAMETIME
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
function searUserInfo(params,bol){

  if (bol){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
  }
    return new Promise((resolve, reject)=>{
      request({
           url:CHRISTMAS.SEARCHUSERINFO,
           data : params
        }).then(res=>{
        
          if (bol){
            wx.hideLoading();
          }
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
        
        if (bol){
          wx.hideLoading();
        }
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
        url:CHRISTMAS.CREATUSERINFO,
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
  // 好友助力列表
  function searchZhuli(params,bol){
  
    if (bol){
      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });

    }
      return new Promise((resolve, reject)=>{
        request({
             url:CHRISTMAS.HELPLIST,
             data : params
          }).then(res=>{
          
            if (bol){
              wx.hideLoading();
            }

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
          if (bol){
            wx.hideLoading();
          }
          
          let a = e.message?e.message:e.msg
          wx.showToast({
            title: a,
            icon: "none",
          })
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
               url:CHRISTMAS.OPENBOX,
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
    // 游戏开始
    function startGame(params){
    
        wx.showLoading({
          title: '加载中……', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return new Promise((resolve, reject)=>{
          request({
               url:CHRISTMAS.STARTGAME,
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
      // 游戏结束
      function endGame(params){
      
          wx.showLoading({
            title: '加载中……', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
          return new Promise((resolve, reject)=>{
            request({
                 url:CHRISTMAS.ENDGAME,
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
        // 优惠券列表
        function getCouponList(params){
        
            wx.showLoading({
              title: '加载中……', //提示的内容,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
            return new Promise((resolve, reject)=>{
              request({
                   url:CHRISTMAS.YHQLIST,
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
          // 领取优惠券
          function getCouphon(params){
            wx.showLoading({
              title: '加载中……', //提示的内容,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
            return new Promise((resolve,reject)=>{
              request({
                url:CHRISTMAS.LINGQUYHQ,
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
          // 兑换记录
          function duijiangjilu(params){
          
              wx.showLoading({
                title: '加载中……', //提示的内容,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
              return new Promise((resolve, reject)=>{
                request({
                     url:CHRISTMAS.DUIHUANJILU,
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
            // 助力
            function addZhuli(params){
              wx.showLoading({
                title: '加载中……', //提示的内容,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
              return new Promise((resolve,reject)=>{
                request({
                  url:CHRISTMAS.ZHULI,
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
  export {
    getGameTime,
    searUserInfo,
    createUser,
    searchZhuli,
    kaiqibaoxiang,
    startGame,
    endGame,
    getCouponList,
    getCouphon,
    duijiangjilu,
    addZhuli
  }