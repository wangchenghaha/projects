
import {EVENTS, KEYSTORAGE} from '../../../src/const'
import {splitGameImg} from '../../../utils/utils'
import events from "../../../src/events"
import { getGameTime, searUserInfo, createUser, shareUser, getCouponList} from '../../service/redEvnelop'
import {downloadFile} from '../../../service/saveImg'

const app = getApp();
let shareData = {};
let innerAudioContext;

const splashImgList = [
  {
    scale: 5622,
    img: splitGameImg('redEnvelop_six_new.jpg?v=1', 'redEnvelop'), // 375/603 iphone 7
    gifImg: splitGameImg('redEnvelop_six.gif', 'redEnvelop'), 
    forthPopTop: {
      txt1: '38%',
      txt2: '44%',
      txt3: '48%',
      button: '62%',
    }      
  },
  {
    scale: 4681,
    img: splitGameImg('redEnvelop_x_new.jpg?v=1', 'redEnvelop'),  // 375/724 iphoneX
    gifImg: splitGameImg('redEnvelop_x.gif', 'redEnvelop'), 
    getCouponTop:{
      area1: '32%',
      coupon: '42%',
      txt2: '54%',
      txt3: '56%',
      btn: '62%'
    },
    noCouponTop: {
      txt1: '38%',
      txt2: '44%',
      txt3: '48%',
      button: '60%'
    }   
  },
  {
    scale: 5064,
    img: splitGameImg('redEnvelop_x_new.jpg?v=1', 'redEnvelop'),  // 375/724 iphoneX
    gifImg: splitGameImg('redEnvelop_x.gif', 'redEnvelop'), 
    getCouponTop:{
      area1: '32%',
      coupon: '42%',
      txt2: '54%',
      txt3: '56%',
      btn: '62%'
    },
    noCouponTop: {
      txt1: '38%',
      txt2: '44%',
      txt3: '48%',
      button: '60%'
    }   
  },
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    redEnvelopBg: splitGameImg('redEnvelop_x_new.jpg?v=1', 'redEnvelop'),
    backImg: splitGameImg('backImg.png', 'redEnvelop'),
    musicImg: splitGameImg('music_start.png', 'redEnvelop'),
    startBtn: splitGameImg('redEnvelop_start.gif', 'redEnvelop'),
    hongBaoBtn: splitGameImg('redEnvelop_hongbao.png', 'redEnvelop'),
    ruleBtn: splitGameImg('redEnvelop_rule.png', 'redEnvelop'),
    isShowTModel: false,
    isRule: false,
    isCoupon: false,
    isMusicStart: true,
    contentInfo: [{text:'   1、在30秒内控制Mr.J接红包躲炸弹，每接到一个红包得到10枚金币，碰到炸弹减少5枚金币。金币累计越多，则礼券面额越大。'}, 
                  {text:'   2、每名用户活动期间内共有3次游戏机会，每次机会用完后，邀请两位好友助力可获得瓜分100元大额礼券资格。'},
                  {text:'   3、每位好友仅可给同一人助力一次，每人每天仅可给不同好友至多助力3次。'},
                  ],
    userData: {},
    backgroundImg: splitGameImg('pop_third.png', 'redEnvelop'),  
    closeImg: splitGameImg('close.png', 'redEnvelop'),  
    gameCount: 0,
    noCouponTop: {
                    txt1: '38%',
                    txt2: '44%',
                    txt3: '48%',
                    button: '60%'
                  },   
    getCouponTop: {
                    area1: '32%',
                    coupon: '42%',
                    txt2: '54%',
                    txt3: '56%',
                    btn: '62%'
                  },
    showPop: false,
    pop1: false,
    pop2: false,

    getCoupon: splitGameImg('getCoupon_bg.png', 'redEnvelop'),
    getCoupon2: splitGameImg('getCoupon_bg2.png', 'redEnvelop'),
    noCoupon:  splitGameImg('pop_forth.png', 'redEnvelop'),
    startGame:  splitGameImg('startGame.png', 'redEnvelop'),
    couponImg: splitGameImg('coup_50@2x.png', 'redEnvelop'),
    getBtn: splitGameImg('pop_second_btn.png', 'redEnvelop'),
    couponNum: '',
    couponList: []         
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
    shareData = options;
    wx.setStorageSync('redEvnelopmusic', this.data.isMusicStart)
    let isMusic = wx.getStorageSync('redEvnelopmusic')
    if(isMusic || this.data.isMusicStart){
      this.playMuisc();
    }
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
    this.getSystemInfo();
    if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
      app.navigateTo('member/login/login?game=true')
      return;
    }
    else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
      this.requestData();
    }
  
  },

    /**
   * 订阅的事件回调
   */
  handleEvent: function (event, type) {

    if (type == EVENTS.EVENT_GAMECRMINFO && event) {
        //  获取手机号成功
        this.requestData()
    } 
  },

 

  requestData() {
    this.setData({zhanweiView: false})
    getGameTime().then(e => {
      let endTime = new Date(e.activityEndTime.replace(/-/g, '/')).getTime()
      let startTime = new Date(e.activityStartTime.replace(/-/g, '/')).getTime()
      let curTimes = Date.parse(new Date());  
      if(curTimes < startTime || curTimes > endTime){
        wx.showModal({
          title: '提示',
          content: "不在活动时间范围内!",
          showCancel: false,
          success: function (res) {
            app.goBack();
          }
        });
        return;
      } else {
        this.userInfo()
      }
      
    })
   
  },

  userInfo() {
    let openID = wx.getStorageSync('wxOpenID');
    let {userData} = this.data
    searUserInfo(openID).then(res => {
      if (!res) {
        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)
        let phone = userInfo.phone
        if (phone.length == 12) {
          phone = phone.substr(0, 11)
        }

        // 创建用户
        let json = {
          phone: phone,
          openid: openID,
          nickName: wxInfo.nickName,
          facePic: wxInfo.avatarUrl,
          memberno: userInfo.memberno,
          crmCreatedTime: userInfo.joindate
        }
        
        createUser(json).then(res => {
          let openID = wx.getStorageSync('wxOpenID');
          if(shareData.userid && shareData.openid !== openID){
            this.shareUserOpen();
          }
          userData = res
          this.setData({userData})
        })

      } else {
        let openID = wx.getStorageSync('wxOpenID');
        if(shareData.userid && shareData.openid !== openID){
          this.shareUserOpen();
        }
        userData = res
        this.setData({userData})
      }
    })
  },

  shareUserOpen(){
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let openID = wx.getStorageSync('wxOpenID');
    let jsData = {
      friendOpenid: openID,
      nickName: wxInfo.nickName,
      friendFacePic: wxInfo.avatarUrl,
      gameid: shareData.gameid,
      userid: shareData.userid
    }
    shareUser(jsData).then(res =>{
      if(res){
        this.setData({
          showPop: true,
          pop1: true,
          pop2: false,
          friendAvatar: shareData.userAvatar,
          friendNick: shareData.userNick,
          couponImgShare: res.couponInfo.couponPic,
          couponNum: res.couponInfo.pointsRequire,
        })
      }
    }).catch(err =>{
      this.setData({
        showPop: true,
        pop1: false,
        pop2: true,
      })
    })
    
  },

  onClick: function(e){
     let type = e.currentTarget.dataset.type;
     switch(type){
       case 'startGame':
         if(!this.data.userData.gameCount || this.data.userData.gameCount <= 0){
            wx.showModal({
              title: '提示',
              content: "您的游戏次数已用尽！您可以前往附近JACK&JONES门店或官方小程序使用优惠券购物啦！",
              showCancel: false,
              success: function (res) {
                app.goBack();
              }
            });
            return;
         }
        let json = {
          gameCount: this.data.userData.gameCount,
          id: this.data.userData.id
        }
        wx.setStorageSync('redRainData', json);
        this.setData({
          showPop: false,
          pop2: false,
        })
         wx.navigateTo({
           url: '../game/game',
         })
         break;
      case 'hongBao':
        this.setData({
          isShowTModel: true,
          isCoupon: true,
          isRule: false,
        })
        getCouponList({userid: this.data.userData.id}).then(res => {
          this.setData({
            couponList: res
          })
        })
        break;
      case 'rule':
          this.setData({
            isShowTModel: true,
            isRule: true,
            isCoupon: false
          })
         break; 
      case 'close':
          this.setData({
            isShowTModel: false,
            isRule: false,
            isCoupon: false,
            showPop: false,
            pop1: false,
            pop2: false,
          })
          break;
      case 'openCoupon':
        let name = app.config.ETO_BRAND[app.config.brand];
        wx.navigateTo({
          url: '../../../member/myCouponList/myCouponList?name=' + name
        })
        break;
      case 'back':
        app.goBack();  
        break;
      case 'music':
        let {isMusicStart, musicImg} = this.data;
        isMusicStart = !isMusicStart;
        musicImg = isMusicStart ? splitGameImg('music_start.png', 'redEnvelop'): splitGameImg('music_close.png', 'redEnvelop')
        if(isMusicStart){
          this.playMuisc();
        }else{
          innerAudioContext.destroy();
        }
        wx.setStorageSync('redEvnelopmusic', isMusicStart)
        this.setData({
          isMusicStart, 
          musicImg
        })
        break;      
     }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    innerAudioContext.destroy();
  },

    /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    innerAudioContext.destroy();
  },


  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let redEnvelopBg = '', noCouponTop = '', getCouponTop = '', gifImg = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          redEnvelopBg = item.img
          noCouponTop = item.noCouponTop
          getCouponTop = item.getCouponTop
          gifImg = item.gifImg
        }
      });
      
      if(redEnvelopBg){
        that.setData({
          redEnvelopBg,
          noCouponTop,
          getCouponTop
        })
      }
      let backImg = wx.getStorageSync('redRainBackground')
      if(backImg){
        that.setData({
          redEnvelopBg: backImg
        })
      } else {
        downloadFile(gifImg).then(res=>{
          wx.setStorageSync('redRainBackground', res);
          that.setData({
            redEnvelopBg: res
          })
        })
      }
      
    }catch (e) {}
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(){
    let title = '玩游戏，接红包！邀你一起瓜分百元神券！'
    let path = `/activity/redEnvelop/main/main`
    let imageUrl = splitGameImg('img_share@2x.png', 'redEnvelop');
    console.log(`分享成功`, path)
    return{
      title: title,
      path : path,
      imageUrl : imageUrl,
      success:function(e){
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  },

  playMuisc(){
    let musicUrl = splitGameImg('redEnvelop_bgm.mp3', 'redEnvelop')
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.src = musicUrl
    innerAudioContext.autoplay = true
    innerAudioContext.loop = true
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  }
})