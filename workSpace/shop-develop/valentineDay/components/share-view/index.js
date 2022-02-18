// shopSubpackages/shopModule/components/share-view/index.js

import imgModel from "../../models/img.model";


Component({
  /**
   * 组件的属性列表
   */
  properties: {
    postBtn:{
      type:String,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgModel,
    navHeight: 0,
    translateY: '100%',
    authorize: true,
    canvasPalette: null,
    canvasImage: '',
  },

  lifetimes: {
    attached: function() {},
    detached: function() {},
  },

  /**
   * 组件的方法列表
   */
  methods: {
    show (config) {
      /**
       * 动画显示分享浮层
       * 获取navHeight，设置遮罩层top
       */
      this.setData({
        translateY: 0,
        navHeight: config.navHeight,
      })
    },
    shareFriend(){
      this.triggerEvent('customFriends');
    },
    handleCloseShare () {
      // 关闭分享浮层
      this.setData({
        translateY: '100%',
      })
    },
    handleCavas (config) {
      /**
       * 通知父级获取海报相关数据
       */
      this.setData({
        navHeight: config.navHeight,
      })
      let nickName = wx.getStorageSync('userInfo') ?  wx.getStorageSync('userInfo').nickName : null
      if(nickName == '微信用户'){
        wx.removeStorageSync('userInfo')
      }
      let userInfo = wx.getStorageSync('userInfo') ?  wx.getStorageSync('userInfo').avatarUrl : null
      console.info('&&&&&&&&&&&&&&&userInfo',userInfo)
        if(!userInfo){
          wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
              console.info('res',res)
              wx.setStorageSync('userInfo', res.userInfo);
                this.triggerEvent('customCanvas');
                this.handleCloseShare();
            }
          })
        }else{
          this.triggerEvent('customCanvas');
          this.handleCloseShare();
        }
      
    
    },
    setCanvas (canvasPalette) {
      // 显示海报
      console.info('canvasPalette',canvasPalette)
      this.setData({
        canvasPalette
      })
    },
    getCanvasImage (res) {
      /**
       * canvas画海报成功， 返回海报地址
       */
      console.log("getCanvasImage===", res.detail.path)
      this.setData({
        canvasImage: res.detail.path
      })
      wx.hideLoading()
    },

    handleSetting() {
      /**
       * 设置用户保存图片到相册的权限状态
       */
      this.setData({
        authorize: true
      })
    },
    
    getSettings(notshow) {
      /**
       * 获取用户保存图片到相册的权限
       * 若用户同意授权，下载图片
       * 若用户不同意授权，提示用户，且设置按钮状态为跳转权限设置页面按钮
       */
  
      let that = this;
      wx.showLoading({
        title: '获取授权中...',
        mask: true,
      })
      wx.getSetting({
        success(res) {
          console.log('已授权列表---------', res)
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() { //这里是用户同意授权后的回调
                wx.showLoading({
                  title: '图片保存中...',
                  mask: true,
                })
                that.downloadFile(that.data.canvasImage)
              },
              fail() { //这里是用户拒绝授权后的回调
                // console.log('拒绝授权')
                wx.showToast({
                  title: '您未允许授权下载，请重新点击设置相册权限',
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
            that.downloadFile(that.data.canvasImage)
          }
        },
        fail(err) {
          console.log('授权失败--------------')
        }
      })
    },
   
    // 下载图片
    downloadFile(tempFilePath, notShow) {
      const that = this;
      /**
       * 下载图片
       */
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: function (res) {
          wx.showToast({
            title: '保存图片成功',
            icon: 'success',
            duration: 400,
          })
          setTimeout(() => {
            that.handleClosePoster();
          }, 1000)
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
    handleClosePoster () {
      /**
       * 关闭海报浮层
       */
      this.triggerEvent('customFriends');

      this.setData({
        canvasImage: "",
      })
    }
  }
})