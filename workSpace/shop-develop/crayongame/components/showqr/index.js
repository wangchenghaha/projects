
Component({
  properties: {
    showImage: {
      type: Boolean,
      value: true
    },
    posterCatch: {
      type: String,
      value: ''
    }
  },
  observers: {
    showImage(value) {
      if (value) {
        this.setData({
          animate: true
        }, () => {
          setTimeout(() => {
            this.setData({
              modalActive: true
            })
          }, 110)
        })
      }
    }
  },

  data: {
    animate: false,
    modalActive: false
  },

  methods: {
    stop() {
      return false
    },
    hideModal() {
      this.setData({
        modalActive: false
      }, () => {
        setTimeout(() => {
          this.setData({
            animate: false
          }, () => {
            setTimeout(() => {
              this.triggerEvent('handleHide')
            }, 110)
          })
        }, 210)
      })
    },
    // 下载图片
    downloadFile(tempFilePath) {
      const me = this
      wx.saveImageToPhotosAlbum({
        filePath: tempFilePath,
        success: function (res) {
          wx.showToast({
            title: '保存图片成功',
            icon: 'success',
            duration: 2000,
            success: function () {
              setTimeout(() => {
                me.hideModal()
              }, 2400)
            }
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
                that.saveImage()
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
            that.saveImage()
          }
        }
      })
    },
    saveImage() {
      const me = this
      let imgUrl = me.data.posterCatch
      // 本地文件b不需要下载
      me.downloadFile(imgUrl)
    },
  }
})
