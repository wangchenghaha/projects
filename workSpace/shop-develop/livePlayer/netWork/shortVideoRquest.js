const config = require('../../src/config.js');
import { request } from '../../utils/request.js'

const domain = config.domain //后台接口主机地址


// 短视频分页列表数据
const getShortVideoListApi = `${domain}/api/shortVideo/list?`
// 视频详情
const getShortVideoDetailApi = `${domain}/api/shortVideo/getDetail?`
// 点赞短视频
const priseApi = `${domain}/api/shortVideo/priseOnce`
// 分享一次短视频
const shareVideoApi = `${domain}/api/shortVideo/share?`

function getShortVideoList(params){
    wx.showLoading({
        title: 'Loading...', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      // console.log(`请求地址:${getShortVideoListApi}${params}`)
      return new Promise((resolve, reject)=>{
        request({ url:`${getShortVideoListApi}${params}`}).then(res=>{
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
function getShortVideoDetail(id,openId){
  wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    console.log(`请求地址:${getShortVideoDetailApi}id=${id}&openId=${openId}`)
    return new Promise((resolve, reject)=>{
      request({ url:`${getShortVideoDetailApi}id=${id}&openId=${openId}`}).then(res=>{
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
function priseShortVideo(jsonObject){
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  return new Promise((resolve,reject)=>{
    request({
      url: `${priseApi}`,
      method: 'POST',
      data: jsonObject
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

function shareVideo(videoId){
  wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    console.log(`请求地址:${shareVideoApi}videoId=${videoId}`)
    return new Promise((resolve, reject)=>{
      request({ url:`${shareVideoApi}videoId=${videoId}`}).then(res=>{
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
export{
    getShortVideoList,
    getShortVideoDetail,
    priseShortVideo,
    shareVideo
}