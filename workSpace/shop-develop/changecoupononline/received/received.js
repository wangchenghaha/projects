
import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import img from '../imgmodel/imgmodel'
const config = require('../../src/config.js')
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
  data: {
    authorize: true,
    showrule : false,
    card : img.card,
    copycont : img.copycont
  },
  onShow: function () {
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: config.title
    })
  },
  onLoad(options) {
    
  },
  getSettings() {
    let that = this;
    wx.showLoading({
      title: '获取授权中...',
      mask: true,
    })
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() { //这里是用户同意授权后的回调
              wx.showLoading({
                title: '图片保存中...',
                mask: true,
              })
              console.log(that.data)
              that.downloadFile(that.data.card)
            },
            fail() { //这里是用户拒绝授权后的回调
              // console.log('拒绝授权')
              wx.showToast({
                title: '拒绝授权',
                icon: 'none',
                duration: 2000
              })
              that.setData({
                authorize: false
              })
            }
          })
        } else {
          wx.showLoading({
            title: '图片保存中...',
            mask: true,
          })
          that.downloadFile(that.data.card)
        }
      },
      fail(err) {
        console.log('授权失败--------------')
      }
    })
  },
  handleSetting(e) {
    let writePhotosAlbum = e.detail.authSetting['scope.writePhotosAlbum']
    if(writePhotosAlbum) {
      this.setData({
        authorize : true
      })
    }
  },
  downloadFile(tempFilePath) {
    console.log(tempFilePath)
    let _this = this
    wx.downloadFile({
          url: tempFilePath,
          success (res) {
              if (res.statusCode === 200) {
                  // that.bgImgPath = res.tempFilePath// 背景图
                  _this.saveimg(res.tempFilePath)
              }
          }
    })
  },
  saveimg(url) {
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success: function (res) {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
          duration: 400,
        })
      },
      fail: function (err) {
        wx.showToast({
          title: '保存失败',
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  copyBtn (e) {
    var _this = this;
    wx.setClipboardData({
     //准备复制的数据
      data: _this.data.copycont,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
        });
      },
      fail(err) {
        wx.showToast({
          title: err,
        });
      }
    });
  },

})