// socialAdvertising/crossIndustryCooperation/crossIndustryCooperation.js
import { checkAuthSetting, authorize, openAuthor, getImageInfo, saveImageToPhotosAlbum } from '../../service/saveImg';
const app = getApp();
const brand = app.config.brand;
import { splitImg } from '../../utils/utils'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgBaseUrl: splitImg(''),
    isIphoneX: app.globalData.isIPhoneX,
    brandName: app.config.appName,
    randomMilli: Math.random(),
    showCube: false,
    activityDes: `❗️点击⬇️对话框回复【1】，扫码即可进入ONLY官方社群，群内有腾讯视频卡、精美礼品、超值秒杀～\n还有更多惊喜福利等你来领！`,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>.       isIphoneX=${this.data.isIphoneX} `)
    app.setUtmOptions(options);
    let { delivery_id } = options
    console.log(`>>>>>>>>>>>   delivery_id ==${delivery_id} `)
    this.deliveryId = delivery_id
    wx.hideShareMenu();
    let list = []
    let listBottom = []
    for (let i = 1; i <= 6; i++) {
      list.push({
        picUrl: `${this.data.imgBaseUrl}/social_group_top_banner_0${i}0.jpg`,
      });
    }
    for (let i = 1; i <= 5; i++) {
      listBottom.push({
        picUrl: `${this.data.imgBaseUrl}/social_group_bottom_banner_0${i}0.jpg`,
      })
    }
    this.setData({
      swiperImgList: list,
      swiperImgListBottom: listBottom,
      qrCodeImgUrl: `${this.data.imgBaseUrl}social_group_qrcode_bar.jpg`
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  onCouponClick: function (e) {
    console.log(`onCouponClick----- deliveryId =${this.deliveryId}`)
    wx.navigateTo({
      url: `/pages/whitePage/whitePage?channel=channel5e86fa88f2dfc&delivery_id=${this.deliveryId}`,
      success: (result) => {
        console.log(`onCouponClick----- successs`)
      },
      fail: () => {
        console.log(`onCouponClick----- fail`)
      },
      complete: () => {
        console.log(`onCouponClick----- complete`)
      }
    });
  },


  onGotoShopClick: function (e) {
    wx.navigateTo({
      url: '/store/storelist/storelist?tpl_id=106&&tag_id=174',
      success: (result) => {
        console.log(`onGotoShopClick----- successs`)
      },
      fail: () => {
        console.log(`onGotoShopClick----- fail`)
      },
      complete: () => {
        console.log(`onGotoShopClick----- complete`)
      }
    });
  },

  onIndexClick: function (ev) {
    wx.navigateTo({
      url: `/socialAdvertising/landing/landing?adMode=MODE_B`,
      success: (result) => {
        console.log(`onIndexClick----- success`)
      },
      fail: () => { },
      complete: () => { }
    });
  },

  onQRCodeLongPress: function (e) {
    let that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: function () {
              that._performSaveQRCode()
            },
            fail: function (res) {
              wx.showModal({
                title: '提示',
                content: "小程序需要您的微信授权保存图片，是否重新授权？",
                showCancel: true,
                cancelText: "否",
                confirmText: "是",
                success: function (res2) {
                  if (res2.confirm) { //用户点击确定'
                    wx.openSetting({
                      success: (res3) => {
                        if (res3.authSetting['scope.writePhotosAlbum']) {
                          //已授权
                          that._performSaveQRCode()
                        } else {
                          wx.showToast({
                            title: '未授权',
                          });
                        }
                      }
                    })
                  } else {
                    wx.showToast({
                      title: '未授权',
                    });
                  }
                }
              });
            }
          })
        } else {
          that._performSaveQRCode()
        }
      }
    })

  },

  _performSaveQRCode: function (e) {
    wx.getImageInfo({
      src: this.data.qrCodeImgUrl,
      success: (res) => {
        let path = res.path;
        wx.saveImageToPhotosAlbum({
          filePath: path,
          success(res) {
            wx.showModal({
              title: '提示',
              content: '保存成功',
              showCancel: false,
            });
            console.log(`saveImageToPhotosAlbum----- success`)
          },
          fail: (res) => {
            wx.showModal({
              title: '提示',
              content: '保存失败',
              showCancel: false,
            });
            console.log(`saveImageToPhotosAlbum----- fail`)
            console.log(res)
          }
        })
      },
      fail: (res) => {
        console.log(`getImageInfo----- fail`)
        console.log(res)
      }
    })
  }

})