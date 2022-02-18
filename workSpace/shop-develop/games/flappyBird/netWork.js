const config = require('../../src/config');

const domain = `${config.domain}/rest/game/flop` //后台接口主机地址

// const cdn = `https://mini.bestseller.com.cn` //测试环境


import { request } from '../../utils/request'

function getUtm(){
  let utmData = wx.getStorageSync('daogouLists');
  let json = {}
  if(utmData && utmData.length){
    utmData.forEach(item => {
      if(item.key && item.key.startsWith('utm')){
        json[item.key] = item.value;
      }
    })
  }
  return json;
 }

// 获取游戏配置
const getGameConfigApi = `${domain}/config?`
// 查询用户信息
const searchUserInfoApi = `${domain}/user/get?`
// 创建用户信息
const createUserInfoApi = `${domain}/user/add`
// 领取大礼包
const openBigGifApi = `${domain}/user/openBigGift`
// 查询优惠券列表
const getCouponListApi = `${domain}/coupon`
// 兑换优惠券
const duihuanCouponApi = `${domain}/user/couponExchange`
// 我的优惠券列表
const myCouponListApi = `${domain}/user/coupon?`
// 获取任务列表
const getRenwuListApi = `${domain}/task`
// 完成任务
const finishRenwuApi = `${domain}/user/taskFinish`
// 用户完成的任务列表
const myFinishRenwuListApi = `${domain}/user/task?`
// 游戏结束
const endGameApi = `${domain}/user/gameOver`
// 好友助力
const helpApi = `${domain}/user/helpAdd`


// 获取游戏配置
function getGameConfig(){
    wx.showLoading({
      title: '加载中……', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    return new Promise((resolve, reject)=>{
      request({
        header:{
          'content-type': 'application/json', // 请求体类型默认值
          token: wx.getStorageSync('token') || '', //请求凭证
          brand:getApp().config.brand, //测试环境用到
          utmMedium: getUtm().utmMedium,
          utmSource: getUtm().utmSource,
          utmTerm: getUtm().utmTerm,
          utmCampaign: getUtm().utmCampaign 
        },
         url:`${getGameConfigApi}`
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
  function searchUserInfo(params){
      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      return new Promise((resolve, reject)=>{
        request({
          header:{
            'content-type': 'application/json', // 请求体类型默认值
            token: wx.getStorageSync('token') || '', //请求凭证
            brand:getApp().config.brand, //测试环境用到
            utmMedium: getUtm().utmMedium,
            utmSource: getUtm().utmSource,
            utmTerm: getUtm().utmTerm,
            utmCampaign: getUtm().utmCampaign 
          },
           url:`${searchUserInfoApi}openid=${params}`
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
    // 创建用户
    function createUser(params){
        wx.showLoading({
          title: '加载中……', //提示的内容,
          mask: true, //显示透明蒙层，防止触摸穿透,
          success: res => {}
        });
        return new Promise((resolve,reject)=>{
          request({
            header:{
              'content-type': 'application/json', // 请求体类型默认值
              token: wx.getStorageSync('token') || '', //请求凭证
              brand:getApp().config.brand, //测试环境用到
              utmMedium: getUtm().utmMedium,
              utmSource: getUtm().utmSource,
              utmTerm: getUtm().utmTerm,
              utmCampaign: getUtm().utmCampaign 
            },
            url:createUserInfoApi,
            method: 'POST',
            data: params
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
            
            wx.showToast({
              title: a,
              icon: "none",
            })
            reject(new Error(a))
          })
        })
      }
      // 领取大礼包
      function openBigGif(params){
          wx.showLoading({
            title: '加载中……', //提示的内容,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
          return new Promise((resolve,reject)=>{
            request({
              header:{
                'content-type': 'application/json', // 请求体类型默认值
                token: wx.getStorageSync('token') || '', //请求凭证
                brand:getApp().config.brand, //测试环境用到
                utmMedium: getUtm().utmMedium,
                utmSource: getUtm().utmSource,
                utmTerm: getUtm().utmTerm,
                utmCampaign: getUtm().utmCampaign 
              },
              url:openBigGifApi,
              method: 'POST',
              data: params
            }).then(res=>{
              wx.hideLoading();
              if(res.code === 0){
                wx.showToast({
                  title: '领取成功',
                  icon: "none",
                })
                resolve(res.data) 
              } else{

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
        // 查询优惠券列表
        function getCouponList(){
            wx.showLoading({
              title: '加载中……', //提示的内容,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
            return new Promise((resolve, reject)=>{
              request({
                header:{
                  'content-type': 'application/json', // 请求体类型默认值
                  token: wx.getStorageSync('token') || '', //请求凭证
                  brand:getApp().config.brand, //测试环境用到
                  utmMedium: getUtm().utmMedium,
                  utmSource: getUtm().utmSource,
                  utmTerm: getUtm().utmTerm,
                  utmCampaign: getUtm().utmCampaign 
                },
                 url:`${getCouponListApi}`
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
          // 兑换优惠券
          function duihuanCoupon(params){
              wx.showLoading({
                title: '加载中……', //提示的内容,
                mask: true, //显示透明蒙层，防止触摸穿透,
                success: res => {}
              });
              return new Promise((resolve,reject)=>{
                request({
                  header:{
                    'content-type': 'application/json', // 请求体类型默认值
                    token: wx.getStorageSync('token') || '', //请求凭证
                    brand:getApp().config.brand, //测试环境用到
                    utmMedium: getUtm().utmMedium,
                    utmSource: getUtm().utmSource,
                    utmTerm: getUtm().utmTerm,
                    utmCampaign: getUtm().utmCampaign 
                  },
                  url:duihuanCouponApi,
                  method: 'POST',
                  data: params
                }).then(res=>{
                  wx.hideLoading();
                  if(res.code === 0){
                    wx.showToast({
                      title: '兑换成功',
                      icon: "none",
                    })
                    resolve(res.data)
                  } else{
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
            // 获取的我优惠券列表
            function myCouponList(params){
                wx.showLoading({
                  title: '加载中……', //提示的内容,
                  mask: true, //显示透明蒙层，防止触摸穿透,
                  success: res => {}
                });
                return new Promise((resolve, reject)=>{
                  request({
                    header:{
                      'content-type': 'application/json', // 请求体类型默认值
                      token: wx.getStorageSync('token') || '', //请求凭证
                      brand:getApp().config.brand, //测试环境用到
                      utmMedium: getUtm().utmMedium,
                      utmSource: getUtm().utmSource,
                      utmTerm: getUtm().utmTerm,
                      utmCampaign: getUtm().utmCampaign 
                    },
                     url:`${myCouponListApi}userId=${params}`
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
              // 获取任务列表
              function getRenwuList(){
                  wx.showLoading({
                    title: '加载中……', //提示的内容,
                    mask: true, //显示透明蒙层，防止触摸穿透,
                    success: res => {}
                  });
                  return new Promise((resolve, reject)=>{
                    request({
                      header:{
                        'content-type': 'application/json', // 请求体类型默认值
                        token: wx.getStorageSync('token') || '', //请求凭证
                        brand:getApp().config.brand, //测试环境用到
                        utmMedium: getUtm().utmMedium,
                        utmSource: getUtm().utmSource,
                        utmTerm: getUtm().utmTerm,
                        utmCampaign: getUtm().utmCampaign 
                      },
                       url:`${getRenwuListApi}`
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
                // 完成任务
                function finishRenwu(params){
                    wx.showLoading({
                      title: '加载中……', //提示的内容,
                      mask: true, //显示透明蒙层，防止触摸穿透,
                      success: res => {}
                    });
                    return new Promise((resolve,reject)=>{
                      request({
                        header:{
                          'content-type': 'application/json', // 请求体类型默认值
                          token: wx.getStorageSync('token') || '', //请求凭证
                          brand:getApp().config.brand, //测试环境用到
                          utmMedium: getUtm().utmMedium,
                          utmSource: getUtm().utmSource,
                          utmTerm: getUtm().utmTerm,
                          utmCampaign: getUtm().utmCampaign 
                        },
                        url:finishRenwuApi,
                        method: 'POST',
                        data: params
                      }).then(res=>{
                        wx.hideLoading();
                        if(res.code === 0){
                          resolve(res.data)
                        } else{
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
                  // 用户完成的任务列表
                  function myFinishRenwuList(params){
                      wx.showLoading({
                        title: '加载中……', //提示的内容,
                        mask: true, //显示透明蒙层，防止触摸穿透,
                        success: res => {}
                      });
                      return new Promise((resolve, reject)=>{
                        request({
                          header:{
                            'content-type': 'application/json', // 请求体类型默认值
                            token: wx.getStorageSync('token') || '', //请求凭证
                            brand:getApp().config.brand, //测试环境用到
                            utmMedium: getUtm().utmMedium,
                            utmSource: getUtm().utmSource,
                            utmTerm: getUtm().utmTerm,
                            utmCampaign: getUtm().utmCampaign 
                          },
                           url:`${myFinishRenwuListApi}userId=${params}`
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
                    // 兑换优惠券
                    function endGame(params){
                        wx.showLoading({
                          title: '加载中……', //提示的内容,
                          mask: true, //显示透明蒙层，防止触摸穿透,
                          success: res => {}
                        });
                        return new Promise((resolve,reject)=>{
                          request({
                            header:{
                              'content-type': 'application/json', // 请求体类型默认值
                              token: wx.getStorageSync('token') || '', //请求凭证
                              brand:getApp().config.brand, //测试环境用到
                              utmMedium: getUtm().utmMedium,
                              utmSource: getUtm().utmSource,
                              utmTerm: getUtm().utmTerm,
                              utmCampaign: getUtm().utmCampaign 
                            },
                            url:endGameApi,
                            method: 'POST',
                            data: params
                          }).then(res=>{
                            wx.hideLoading();
                            if(res.code === 0){
                              resolve(res.data)
                            } else{
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
                      // 好友助力
                      function help(params){
                          wx.showLoading({
                            title: '加载中……', //提示的内容,
                            mask: true, //显示透明蒙层，防止触摸穿透,
                            success: res => {}
                          });
                          return new Promise((resolve,reject)=>{
                            request({
                              header:{
                                'content-type': 'application/json', // 请求体类型默认值
                                token: wx.getStorageSync('token') || '', //请求凭证
                                brand:getApp().config.brand, //测试环境用到
                                utmMedium: getUtm().utmMedium,
                                utmSource: getUtm().utmSource,
                                utmTerm: getUtm().utmTerm,
                                utmCampaign: getUtm().utmCampaign 
                              },
                              url:helpApi,
                              method: 'POST',
                              data: params
                            }).then(res=>{
                              wx.hideLoading();
                              if(res.code === 0){
                                wx.showToast({
                                  title: '助力成功',
                                  icon: "none",
                                })
                                resolve(res.data)
                              } else{
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



  export{
    getGameConfig,
    searchUserInfo,
    createUser,
    openBigGif,
    getCouponList,
    duihuanCoupon,
    myCouponList,
    getRenwuList,
    finishRenwu,
    myFinishRenwuList,
    endGame,
    help
  }