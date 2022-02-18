// 上传图片
import { request } from '../utils/request.js'
import { objToQuery } from '../utils/utils'
import { URL, KEYSTORAGE } from '../src/const.js'
import {wxShowToast} from "../utils/wxMethods";

function chooseFile(count) {
  return new Promise( (resolve, reject) => {
    wx.chooseImage({
      count: count || 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        resolve(res.tempFilePaths)
      },
      error(err){
        reject(new Error('choose file is failed'))
      }
    })
  })
}

function uploadFile(tempFilePaths, data) {
  let url = URL.UPLOADCONVERPICWITHMINICODE;
  if(data && data.guideId){
    url += objToQuery(data)
  }
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      // url: `${app.config.domain}/api/guide/uploadConverPic?guideId=${_daogouID}`, //开发者服务器 url
      url, //开发者服务器 url
      // url: URL.UPLOADCONVERPICWITHMINICODE, //开发者服务器 url
      filePath: Array.isArray(tempFilePaths)  ? tempFilePaths[0] : tempFilePaths,//要上传文件资源的路径
      name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
      header: {
        token: wx.getStorageSync('token'),
        'content-type': 'multipart/form-data'
      },
      formData: {}, //HTTP 请求中其他额外的 form data
      success: function (res) {
        console.log(res,'upload success****')
        if(res.statusCode === 200){
          if(res.data){
            let result = JSON.parse(res.data);
            result.code === 0 ? resolve(result.data) : reject(new Error(result.msg))
          }
        }
      },
      error: function(err){
        console.log(err,'upload error***')
        reject(new Error('upload file is failed'))
      }
    })
  });
}function uploadImage(tempFilePaths, data) {
  let url = URL.UPLOAD_IMAGE;
  if(data){
    url += objToQuery(data)
  }
  return new Promise((resolve, reject) => {
    wx.uploadFile({
      url, //开发者服务器 url
      filePath: tempFilePaths,//要上传文件资源的路径
      name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
      header: {
        token: wx.getStorageSync('token'),
        'content-type': 'multipart/form-data'
      },
      formData: {
        method: 'POST'   //请求方式
      }, //HTTP 请求中其他额外的 form data
      success: function (res) {
        console.log(res,'upload success****')
        if(res.statusCode === 200){
          if(res.data){
            let result = JSON.parse(res.data);
            result.code === 0 ? resolve(result.data) : reject(new Error(result.msg))
          }
        }
      },
      fail: function(err){
        console.log(err,'upload error***')
        reject(new Error('upload file is failed'))
      }
    })
  });
}
function compressImage(imgUrl, quality = 80) {
  return new Promise((resolve, reject) => {
    wx.compressImage({
      src: imgUrl, // 图片路径
      quality, // 压缩质量
      success(res){
        resolve(res.tempFilePath);
      },
      fail(err){
        reject(new Error(err.msg || err.message))
      }
    });
  })
}
function a() {
  wx.canvasToTempFilePath({
    x: 0,
    y: 0,
    width: canvasWidth,
    height: canvasHeight,
    canvasId: 'myCanvas',
    success: function(res) {
      wx.hideLoading();
      let pic = res.tempFilePath;
      _this.setData({pic})
    },
    fail(err){
      console.log(err,'保存失败');
      wxShowToast('合成失败');
    },
  });
}
export {
  uploadFile, chooseFile, uploadImage,compressImage
}