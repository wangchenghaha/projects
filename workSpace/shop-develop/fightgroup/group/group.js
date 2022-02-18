import main from '../utils/utils'
import API from '../api/index'
import fetch from '../sever/index'
import Poster from './pallete'
import img from '../model/img-model'
const config = require('../../src/config.js')
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;


Page({
  data: {
      brand,
      bigPhone : main.judgeBigScreen(),
      showrule : false,
      showalert : false,
      avterlist : [],
      avterNum : 0,
      showposter : false,
      imageurl : '',
      imgok : false,
      canvas: {},
      authorize: true,
      token : '',
      showoption : {
        type : 1,
        show : false,
        alerttext : '',
        btntext : ''
      },
      joinNum : 0,
      couponlist : img.couponlist,
      imgmodel : {
        groupbg_s : img.groupbg_s,
        groupbg : img.groupbg,
        unknow : img.unknow,
        groupcardbg : img.groupcardbg,
        jointip : img.jointip
      },
      basecolor : img.basecolor
  },
  onShow: function () {
  },
  onLoad(options) {
    this.setData({
      avterlist : new Array(2),
      avterNum :  2,
    })
    if(!options.token) {
      // wx.redirectTo({
      //     url: '/fightgroup/index/index'
      // })
      wx.showToast({
        title: '缺少token',
        icon: 'none'
      })
      return
    }
    this.setData({
      token : options.token
    })
    this.info()
  },
  registerFormSubmit2(e) {
    // if(e.detail.formId) {
    //   main.debounce(this.formId(e.detail.formId),500)
    // }
  },
  requestSubscribeMessage() {
    wx.requestSubscribeMessage({
      tmplIds: ['5kk7ZMmPcGJuH1Los9aK2ieHS8BtxI6A8YspiVSBWDU', 'VCfKSpXiIuNDruG9IhlqNBpokRAXxbsc9mwy0GtdMRo', 'GWnGF1SwiIkkoAXEwUmK3M9F9HH91D8ZQ0vag6aVvdM'],
      success (res) {},
      fail(err) {},
      complete(res) {
        console.log(res)
      }
    })
  },
  onReady: function () {
    wx.setNavigationBarTitle({
      title: config.title
    })
  },
  //上传formid
  formId(form_id) {
    fetch({url: API.formId,data:{form_id}}).then(res => {
    })
  },
  //拼团详情
  info() {
    fetch({url: API.info,data:{token:this.data.token}}).then(res => {
      console.log('res',res)
      let { data,errcode } = res
      if(errcode == 0) {
        if(data.is_end) {
          wx.redirectTo({
              url: `/fightgroup/coupon/coupon?token=${this.data.token}`
          })
          return
        }else{
          if(data.list.length) {
            let avterlist = [...this.data.avterlist]
            data.list.forEach((item,index) => {
              avterlist[index] = item
            })
            this.setData({
              avterlist,
              joinNum : data.list.length
            })
          }
        }
      }else if(errcode == 201) {
        this.endfun()
      }
    })
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
  clicksure(obj) {
    obj.detail.success && obj.detail.success();
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
  shareRecord() {
    fetch({url: API.shareRecord,data:{token:this.data.token}}).then(res => {})
  },
  miniqrcode() {
    fetch({url: API.miniqrcode,data:{token:this.data.token}}).then(res => {
      let {data,errcode} = res
      if(errcode == 0) {
        let obj = {
          bg : img.postershare,
          qc : data.qrcode_url
        }
        this.startDraw(obj)
      }
    })
  },
  shareposter() {
    this.miniqrcode()
  },
  closeposter() {
    this.setData({
      showposter : false
    })
  },
  catchclick() {

  },
  onShareAppMessage() {
    this.shareRecord()
    return main.baseshare(this.data.token)
  }
})