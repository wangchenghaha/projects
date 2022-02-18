// valentineDay/pages/listen/index.js
const audioContext = wx.createInnerAudioContext()
import mainService from '../../../base/main.js';
import pathModel from '../../models/path.model';
import Utils from '../../services/util'
import Fetch from '../../services/fetch'
import Urls from '../../services/url'
import dataModel from '../../models/dataInfo.model';
import Poster from '../../bargain/pallete'; // 海报
let _lastTime = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    recordData: 'wxfile://tmp_57c17e15540e524dc9d2abf61604a20e0d54043f65b98012.mp3',
    pwdValue: '',
    coverImg: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=2880224465,1005554661&fm=26&gp=0.jpg',
    comData: {},
    zhufuArr: [],
    pwdModel: false,
    playStatus: false,
    navHeight: wx.getSystemInfoSync().windowHeight * 2 + 'rpx',
    isScan:0,
    type:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu()
    console.info('好友落地页', options)
    // options.scene = "ac_id%3D3%26ch_id%3D13%26s_id%3D78"
    let isScan = options.scene ? Utils.getRouteObjByStrOfSunQr(options.scene) : false
    console.info('isScan',isScan)
    if(isScan){
      console.info('扫码进入')
      this.getGiftData(isScan)
      return
    }
    
    if(options && options.s_id){
      this.data.s_id = options.s_id
    }
    let data = dataModel.data
    let zhufuArr = data.blessing_text.split('|')
    this.setData({
      comData: data,
      zhufuArr,
      isScan:1
    })

   
  },
  handleShare(e) {
    this.data.type = 2
    this.throttle(() => {
      if (wx.getStorageSync('soundData')) {
        this.selectComponent("#comp-share").handleCavas({
          navHeight: this.data.navHeight,
        })
      } else {
        this.setData({
          pwdModel: true
        })
      }
    },1000)()
  },
  throttle(fn, gapTime) {
    if (gapTime == null || gapTime == undefined) {
        gapTime = 1000
    }
    return function() {
        let _nowTime = +new Date()
        if (_nowTime - _lastTime > gapTime || !_lastTime) {
            fn()
            _lastTime = _nowTime
        }
    }
    },
  handleCanvasPoster() {
    Fetch({
      url: Urls.love_share,
      loading:true,
      data: {
        ac_id: wx.getStorageSync('ac_id'),
        user_id:this.data.comData.user_id,
        type:'3',
        sound_id:this.data.comData.sound_id,
      }
    }).then(res => {
      let { errcode, data } = res
      if(errcode == 0){
        console.info('res$$$$$$$$$$$$',res)
       this.getQrcode().then(res=>{
         console.info('res',res)
         wx.showLoading({
          title: '生成中',
        })
        let canvasPalette = new Poster().palette({
          avatar: wx.getStorageSync('userInfo').avatarUrl || '',
          username: wx.getStorageSync('userInfo').nickName || '',
          shareText:this.data.comData.valentine.poster_title,
          toBg:this.data.comData.valentine.set_receiver_input_img,
          name:this.data.comData.friend_name,
          product_pic: this.data.comData.heart_card_url,
          zhufuyu1:this.data.zhufuArr[0],
          zhufuyu2:this.data.zhufuArr[1],
          qrcodeMy: res.url,
          logo: this.data.comData.valentine.logo_img,
          info:this.data.comData.valentine.postmark_img,
        })
        this.selectComponent("#comp-share").setCanvas(canvasPalette)
       })
      
      }
    })
  },
  getQrcode(){
    return new Promise((resolve,reject)=>{
      Fetch({
        url: Urls.love_giftCard,
        loading: true,
        method: 'POST',
        data: {
          ac_id: wx.getStorageSync('ac_id'),
          ch_id: wx.getStorageSync('ch_id'),
          s_id: this.data.s_id
        }
      }).then(res => {
        let { errcode, data, errmsg } = res
        if (errcode == 0) {
          console.info('获取贺卡二维码', data)
          resolve(data)
        } else {
          mainService.toast(errmsg)
        }
      })
    })
  },
  getGiftData(par){
    Fetch({
      url: Urls.love_giftView,
      loading: true,
      method: 'POST',
      data: {
        ac_id:par.ac_id,
        ch_id: par.ch_id,
        s_id:par.s_id
      }
    }).then(res => {
      let { errcode, data, errmsg } = res
      if (errcode == 0) {
        let zhufuArr = data.blessing_text.split('|')
        this.setData({
          isScan:2,
          comData: data,
          zhufuArr
        })
      } else {
        mainService.toast(errmsg)
      }
    })

  },
  close() {
    this.setData({
      pwdModel: false
    })
  },
  sure() {
    Fetch({
      url: Urls.love_pwd,
      loading: true,
      method: 'POST',
      data: {
        sound_pwd: this.data.pwdData,
        user_id: this.data.comData.user_id,
        sound_id: this.data.comData.sound_id
      }
    }).then(res => {
      let { errcode, data, errmsg } = res
      if (errcode == 0) {
        console.info('res&&&&&&&&&&&&&&', data)
        wx.setStorageSync('soundData', data.url)
        this.setData({
          pwdModel: false
        })
        if(this.data.type == 1){
          this.recordingAndPlaying(data.url);
        }else if(this.data.type == 2){
          this.handleShare();
        }
      } else {
        wx.showToast({
          title: errmsg,
          icon:'none'
        })
      }
    })

  },
  setPwd(e) {
    this.setData({
      pwdData: e.detail.value
    })
  },
  myPlay() {

    wx.redirectTo({
      url: `${pathModel.vd_index}?ac_id=${wx.getStorageSync('ac_id')}&ch_id=${wx.getStorageSync('ch_id')}`,
    })
    // mainService.link(`${pathModel.vd_index}?ac_id=${wx.getStorageSync('ac_id')}&ch_id=${wx.getStorageSync('ch_id')}`, 1)
  },
  play() {
    this.data.type = 1
    if(this.data.isScan == 2){ //贺卡进入，直接播放
      this.recordingAndPlaying(this.data.comData.sound_recording_url);
    }else{
      if (wx.getStorageSync('soundData')) {
        this.recordingAndPlaying(wx.getStorageSync('soundData'));
  
      } else {
        this.setData({
          pwdModel: true
        })
      }
    }
    
  },
  jumpTo() {
    
    let navType = Utils.isTabPage(decodeURIComponent(this.data.comData.valentine.lover_gift_url)) ? 3 : 0;
    // mainService.link(decodeURIComponent(this.data.comData.valentine.lover_gift_url), navType)
    let giftUrl = decodeURIComponent(this.data.comData.valentine.lover_gift_url);
    if(navType){
      wx.switchTab({
        url: giftUrl,
      })
    }else{
      wx.navigateTo({
        url: giftUrl,
      })
    }
  },
  startRecord() {
    this.setData({
      maskIsShow: true
    })
  },
  // 密码值
  pwdInput(e) {
    console.info(e)
    this.setData({
      pwdValue: e.detail.value
    })
  },
  tell() {
    wx.navigateTo({
      url: `${pathModel.vd_index}`,
    })
    // mainService.link(pathModel.vd_index)
  },
  gift() {
    wx.switchTab({
      url: `${pathModel.shop_onShop}`,
    })
    // mainService.link(pathModel.shop_onShop, 3)

  },
  //录音播放
  recordingAndPlaying: function (url) {
    let _this = this
    if (this.data.playStatus) return
    if (wx.setInnerAudioOption) {

      wx.setInnerAudioOption({
    
        obeyMuteSwitch: false,
    
        autoplay: true
    
      })
    
    }else {
    
      myaudio.obeyMuteSwitch = false;
    
      myaudio.autoplay = true;
    
    }
    _this.setData({ playStatus:true, listenTime: 0 })
    audioContext.src = url
    audioContext.play()
    
    audioContext.onStop(() => {
      console.log('onStop=====================')
      clearTimeout(this.timeOut)
      this.timeOut = null
      _this.setData({ playStatus: false })
    })
    audioContext.onEnded(() => {
      console.log('onEnded=====================')
      clearTimeout(this.timeOut)
      this.timeOut = null
      _this.setData({ playStatus: false})
    })

  },
  onHide: function () {
    wx.removeStorageSync('soundData')

  },

  onShareAppMessage: function () {
    return {
      title: this.data.comData.valentine.share_title,
      path:`${pathModel.vd_index}?ac_id=${wx.getStorageSync('ac_id')}&ch_id=${wx.getStorageSync('ch_id')}`,
      imageUrl: this.data.comData.valentine.card_img, 
    }
  }
})