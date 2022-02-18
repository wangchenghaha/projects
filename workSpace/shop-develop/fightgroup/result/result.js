import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import img from '../model/img-model'
import Poster from './pallete'
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
  data: {
    brand,
      bigPhone : main.judgeBigScreen(),
      showalert : false,
      token : '',
      showoption : {
        type : 1,
        show : false,
        alerttext : '',
        btntext : ''
      },
      couponlist : img.couponlist,
      imgmodel : {
        groupbg_s : img.groupbg_s,
        groupbg : img.groupbg,
        unknow : img.unknow,
        groupcardbg : img.groupcardbg,
        jointip : img.jointip,
        success:img.succes
      },
      basecolor:img.basecolor,
      showshareflag : false,
      imageurl : '',
      imgok : false,
      canvas: {},
      authorize: true
  },
  onShow: function () {
    
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: '组团详情'
    })
  },
  onLoad(options) {
    if(!options.token) {
      wx.showToast({
        title: '缺少参数',
        icon: 'none',
        duration: 2000
      })
      return
    }
    this.setData({
      token : options.token
    })
  },
  closeshareclick() {

  },
  closeshare() {
    this.setData({
      showshareflag : false
    })
  },
  showshare() {
    this.setData({
      showshareflag : true
    })
  },
  coupondetail() {
    fetch({url: API.isMember,data:{token:this.data.token}, needUnionid : true}).then(res => {
      wx.hideLoading();
      let {errcode,errmsg, data:{card_data,is_get_coupon} } = res
      if ( errcode === 0 ) {
        if(is_get_coupon) {  //已领过券
          let cardList = []
          card_data.forEach((item,index) => {
            cardList.push({
              cardId : item.card_id,
              code : item.code
            })
          })
          wx.openCard({
            cardList: cardList,
            success: function () {
              
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                icon: 'none'
              })
            }
          })
        }
      } else {
        wx.showModal({
          title: '提示',
          content:errmsg || '会员接口崩溃,再来一次呗！',
          showCancel: false
        })

      }
    })
  },
  endfun() {
    this.setData({
      showoption : {
        type : 1,
        show : true,
        alerttext : '您来晚了，活动已结束！',
        btntext : '我知道了',
        success() {
          wx.switchTab({
              url: '/pages/index/index'
          })
        }
      }
    })
  },
  onShareAppMessage() {
    this.setData({
      showshareflag : false
    })
    return main.baseshare()
  },



  startDraw(obj) {
    const me = this
    console.log('obj',obj)
    let poster = new Poster().palette(obj)
    me.setData({
      canvas: poster,
      showposter : true
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
              that.downloadFile(that.data.imageurl)
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
          that.downloadFile(that.data.imageurl)
        }
      },
      fail(err) {
        console.log('授权失败--------------')
      }
    })
  },
  // 获取权限
  getSetting() {
    const me = this
    wx.getSetting({
      success(resp) {
        if (resp.authSetting['scope.writePhotosAlbum']) {
          me.downloadFile(me.data.imageurl)
        }
      }
    })
  },
  // 下载图片
  downloadFile(tempFilePath) {
    wx.saveImageToPhotosAlbum({
      filePath: tempFilePath,
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
  downloadUrl(url) {
    return new Promise((resolve,reject) => {
      wx.downloadFile({
        url: url,
        success: (result) => {
          resolve(result)
        },
        fail: (err) => {
          reject(err)
        },
        complete: () => {}
      });
    })
  },
  onImgOK(res) {
    this.setData({
      imageurl: res.detail.path,
      imgok : true
    })
  },
  miniqrcode() {
    fetch({url: API.miniqrcode}).then(res => {
      let {data,errcode} = res
      if(errcode == 0) {
        let obj = {
          bg : img.posterbg,
          qc : data.qrcode_url
        }
        this.startDraw(obj)
      }
    })
  },
  shareposter() {
    this.setData({
      showshareflag:false
    })
    this.miniqrcode()
  },
  closeposter() {
    this.setData({
      showposter : false
    })
  },
  catchclick() {

  },
})