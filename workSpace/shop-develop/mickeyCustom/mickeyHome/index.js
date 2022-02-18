//index.js
//获取应用实例
import main from "../base/mains.js"
import {urls} from "../base/url.js"
import API from '../api/index'


Page({
  data: {
    musicIsOpen:true,
    isBigScreen:false,
    helpAlert:false,
    homeTitleAnimation:"",
    loadImageList:[
      "https://alioss.woaap.com/bestseller/campaign2001/images/homeBg_big.jpg",
      "https://alioss.woaap.com/bestseller/campaign2001/images/goto_game.png",
      "https://alioss.woaap.com/bestseller/campaign2001/images/homeBg_sm.jpg",
      "https://alioss.woaap.com/bestseller/campaign2001/images/activity_rules.png",
      "https://alioss.woaap.com/bestseller/campaign2001/images/home_title.png",
      "https://alioss.woaap.com/bestseller/campaign2001/images/music_open.png",
      "https://alioss.woaap.com/bestseller/campaign2001/images/music_close.png",

    ],
    channel:"", //渠道信息
    shop_type:"",
  },
  onLoad: function (options) {
    let {scene, channel, shop_type} = options;
    this.setData({
      shop_type,
      channel,
    })
    if (scene){
      // "channel=9979&shop_type=SM"
      let str = decodeURIComponent(scene);
      let strArr = str.split("&");
      strArr.forEach(item => {
        let s = item.split("=");
        this.setData({
          [s[0]]:s[1],
        })
      })
    }
    
    wx.hideShareMenu()
    wx.getSystemInfo({
      success: (res) => {
        console.log(res.windowHeight, res.windowHeight * 2);
        this.setData({
          isBigScreen:res.windowHeight * 2 > 1208,
        })
      }
    })
    let openid = wx.getStorageSync('wxOpenID') || wx.getStorageSync('openid')
    let unionid = wx.getStorageSync('unionid')
    if(!openid || !unionid) {
      wx.navigateTo({
          url: '/pages/etoLogin/etoLogin'
      })
      return false
    }
    let is_new = wx.getStorageSync("mickeyIsNew");
    if(is_new === 0){
      main.link(`${urls.mickeyTiger}?channel=${this.data.channel}&shop_type=${this.data.shop_type}`, 1);
    }


    // main.request(API.is_hand, {}, "GET").then(res=>{
    //   let {errcode, errmsg, data} = res.data;
    //   if(errcode == 0){
    //     let {balance, is_new} = data;
    //     if(is_new == 0){
    //       main.link(urls.mickeyTiger, 1);
    //     } 
    //   }
    // })
  },
  imgLoadFinish(){
    this.setData({
      homeTitleAnimation:"animation: homeTitle 1.5s linear reverse;"
    })
    this.backMusic = wx.getBackgroundAudioManager()
    console.log(this.backMusic.paused, "音乐onload重新加载了");
    if(!this.backMusic.paused){
      this.music();
    }
  },
  music(){
    this.backMusic.title = 'title'
    this.backMusic.epname = 'epname'
    this.backMusic.singer = 'singer'
    this.backMusic.coverImgUrl = 'https://alioss.woaap.com/bestseller/campaign2001/images/home_title.png'
    this.backMusic.src = 'https://alioss.woaap.com/bestseller/campaign2001/BGM.mp3'
    this.backMusic.onEnded(()=>{
      this.music();
    })
    this.setData({
      musicIsOpen:true,
    })
  },
  musicPause(){
    this.backMusic.pause();
    this.setData({
      musicIsOpen:false,
    })
  },
  musicPlay(){
    console.log(this.backMusic, this.backMusic.src);
    if(!this.backMusic.src){
      this.music();
    } else {
      this.backMusic.play();
      this.setData({
        musicIsOpen:true,
      })
    }
  },
  onUnload(){
    this.backMusic.stop();
    this.setData({
      musicIsOpen:false,
    })
  },
  onHide(){
    this.backMusic.stop();
    this.setData({
      musicIsOpen:false,
    })
  },
  onShow(){
    this.backMusic = wx.getBackgroundAudioManager()
    console.log(this.backMusic.pause, this.backMusic.src, 'onshow');
    this.setData({
      musicIsOpen:!this.backMusic.paused
    })
  },
  catchtouchmove(){
    return;
  },
  closeAlert(){
    this.setData({
      helpAlert:false,
    })
  },
  gotoGame(){
    // main.showToast("活动暂未开始，敬请期待");
    // return;
    main.link(`${urls.mickeyTiger}?channel=${this.data.channel}&shop_type=${this.data.shop_type}`, 1);
  },
  gotoRules(){
    // main.showToast("活动暂未开始，敬请期待");
    // return;

    main.link(urls.mickeyRules + "?alertType=game");
  }
})
