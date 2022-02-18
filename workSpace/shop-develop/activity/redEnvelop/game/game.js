
import {splitGameImg, objToQuery} from '../../../utils/utils'
import {KEYSTORAGE} from '../../../src/const'
import {gameConfig} from '../gameConfig'
import { kaiqibaoxiang, startGame, endGame, shareCoupon} from '../../service/redEvnelop'
const app = getApp();
let innerAudioContext;
let topHeight = 0
let gameID = 0;
let defaultX = 0;

const splashImgList = [
  {
    scale: 5622,// 375/603 iphone 7
    animate:'animatesix',
    animate1: 'animatesix1',
    popdownTimeTop:{
      img1: '25%',
      img2: '42%'
    },
    popFirstTop:{
      txt: '28%',
      btn: '65%'
    },
    popSecondTop:{
      txt1: '21%',
      txt2: '31%',
      coupon: '38%',
      txt3: '51%',
      btn: '76%'
    },
    popThirdTop:{
      txt1: '27%',
      coupon: '33%',
      txt2: '48%',
      invent: '52%',
      button: '67%',
      txt3: '73%',
      txt4: '77%'
    },
    forthPopTop: {
      txt1: '38%',
      txt2: '44%',
      txt3: '48%',
      button: '62%',
      txt4: '76%'
    }
  },
  {
    scale: 4681, // 375/724 iphoneX
    animate:'animate',
    animate1: 'animate1',
    popdownTimeTop:{
      img1: '20%',
      img2: '40%'
    },
    popFirstTop:{
      txt: '32%',
      btn: '63%'
    },
    popSecondTop:{
      txt1: '25%',
      txt2: '35%',
      coupon: '42%',
      txt3: '53%',
      btn: '72%',

    },
    popThirdTop:{
      txt1: '31%',
      coupon: '37%',
      txt2: '50%',
      invent: '52%',
      button: '64%',
      txt3: '69%',
      txt4: '74%'
    },
    forthPopTop: {
      txt1: '38%',
      txt2: '44%',
      txt3: '48%',
      button: '60%',
      txt4: '72%'
    }
  },
  {
    scale: 5064, // 393/776  redMi Pro 8
    animate:'animate',
    animate1: 'animate1',
    popdownTimeTop:{
      img1: '20%',
      img2: '40%'
    },
    popFirstTop:{
      txt: '32%',
      btn: '63%'
    },
    popSecondTop:{
      txt1: '25%',
      txt2: '35%',
      coupon: '42%',
      txt3: '53%',
      btn: '72%'
    },
     popThirdTop:{
      txt1: '31%',
      coupon: '37%',
      txt2: '50%',
      invent: '52%',
      button: '64%',
      txt3: '69%',
      txt4: '74%'
    },
    forthPopTop: {
      txt1: '38%',
      txt2: '44%',
      txt3: '48%',
      button: '60%',
      txt4: '72%'
    }
  },
];
const IMG = {
        img1: splitGameImg('time_1.png', 'redEnvelop'),
        img2: splitGameImg('time_2.png', 'redEnvelop'),
        img3: splitGameImg('time_3.png', 'redEnvelop')
      }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData: {},
    datas: [],
    hongBaoImg: "",
    timeBg: splitGameImg('ico_time.png', 'redEnvelop'),
    pointBg: splitGameImg('ico_point.png', 'redEnvelop'),
    gameBg: splitGameImg('img_bg.jpg', 'redEnvelop'),
    backImg: splitGameImg('backImg.png', 'redEnvelop'),
    topImg: splitGameImg('title_logo.png', 'redEnvelop'),
    centerImg: splitGameImg('bg_logo.png', 'redEnvelop'),
    bottomImg: splitGameImg('img_bottom@2x.png', 'redEnvelop'),
    currentImg: splitGameImg('gougou_img2x.png', 'redEnvelop'),
    liuxingImg: splitGameImg('liuxing_img.png', 'redEnvelop'),
    hongBaoTime:  splitGameImg('hongbao_time.png', 'redEnvelop'),
    imgs:splitGameImg('img_bg@2x.png', 'redEnvelop'),
    zadianshu: 0,
    transformX: 0,
    touchstart: 0,
    touchend: 0,
    imgWidth: 180,
    imgHeightRPX: 0,
    imgHeightPX: 0,
    loadTime: 0.2,
    points: 0,
    txtColor: '',
    showPoint: false,
    overTime: 30,
    currentPoint: 0,
    animate: 'animate',
    animate1: 'animate1',
    daojishiJson : {
      show : false,
      num : 3,
      numImg : IMG.img3
    },
    yudianDatas: [],
    // popFirstTop: splashImgList[2].popFirstTop,
    popSecondTop: splashImgList[2].popSecondTop,
    popThirdTop: splashImgList[2].popThirdTop,
    forthPopTop: splashImgList[2].forthPopTop,
    showPop: false,
    firstShow: false,
    pop1: false,
    pop2: false,
    pop3: false,
    pop4: false,
    // 弹窗 start
    popFirst: splitGameImg('pop_first_2.png', 'redEnvelop'),
    openBox: splitGameImg('pop_first_btn.png', 'redEnvelop'),
    popSecond: splitGameImg('pop_second_new.png', 'redEnvelop'),
    firstShowImg: splitGameImg('firstShow.gif', 'redEnvelop'),
    couponImg: '',
    couponImg2: splitGameImg('coup_50@2x.png', 'redEnvelop'),
    getBtn:  splitGameImg('pop_second_btn.png', 'redEnvelop'),
    popThird:  splitGameImg('pop_third.png', 'redEnvelop'),
    leftImage:  splitGameImg('pop_third_line_left.png', 'redEnvelop'),
    rightImage:  splitGameImg('pop_third_line_right.png', 'redEnvelop'),
    leftBtnImage:  splitGameImg('pop_third_btn_again.png', 'redEnvelop'),
    rightBtnImage:  splitGameImg('pop_third_btn_invent.png', 'redEnvelop'),
    rightBtn2Image:  splitGameImg('pop_third_btn_coupon.png', 'redEnvelop'),
    goBackImg: splitGameImg('icon_close.png', 'redEnvelop'),
    forthPop:  splitGameImg('pop_forth.png', 'redEnvelop'),
    againImage: splitGameImg('pop_third_btn_invent_2.png', 'redEnvelop'),
    inventBtn:  splitGameImg('pop_forth_btn.png', 'redEnvelop'),

    helpCount: 2,
    alreadyShareCount: 0,
    twoFriendHelp: false,
    popFirstTop: '',
    helpFirends:[{
      helpImg:  splitGameImg('pop_third_default.png', 'redEnvelop'),
      nickname: '待邀请',
      },
      {
        helpImg: splitGameImg('pop_third_default.png', 'redEnvelop'),
        nickname: '待邀请',
      }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userData = this.data.userData
    userData = wx.getStorageSync('redRainData');
    this.setData({
      userData,
      gameCount : userData.gameCount
    })
    gameID = 0;
    let _this = this
    this.gameConfig = new gameConfig(this,{
      imgs : IMG,
      topHeight,
      callback : ( res => {
        _this._endGame(res)
      })
    })
    let isMusic = wx.getStorageSync('redEvnelopmusic')
    if(isMusic){
      this.playMuisc();
    }
    this.daojishi();
  },

  getImgHeight(e){

    if(this.data.imgHeightRPX == 0){
      this.data.imgHeightRPX = e.detail.height
      this.data.imgHeightPX = this.data.imgHeightRPX / 750 * wx.getSystemInfoSync().windowWidth;
    }
    else{
      this.data.imgHeightRPX = e.detail.height
      this.data.imgHeightPX = this.data.imgHeightRPX / 750 * wx.getSystemInfoSync().windowWidth;
    }
    let transformX = this.data.transformX
    let touchend = this.data.touchend
    defaultX = (wx.getSystemInfoSync().windowWidth - e.detail.width / 750 * wx.getSystemInfoSync().windowWidth) / 2
    transformX = defaultX;
    touchend = transformX
    this.setData({transformX,touchend})

  },

  daojishi(){
    let firstGame = wx.getStorageSync('firstRedRainGame')
    if(!firstGame){
      wx.setStorageSync('firstRedRainGame', true)
      this.setData({
        firstShow: true,
      })
    }else{
      startGame({userid : this.data.userData.id}).then(res => {

        gameID = res.id
        let daojishiJson = this.data.daojishiJson
        daojishiJson.show = true
        this.setData({daojishiJson})

        this.daojishiInterval = setInterval(() => {
          if (daojishiJson.num == 0){
            clearInterval(this.daojishiInterval)
            this.closed()
            this.gameConfig.reload();
            this.makeDatas(0);
            this.gameConfig.makeYudian(0)
          }
          else{
            daojishiJson.num -= 1
            daojishiJson.numImg = daojishiJson.num == 2 ? IMG.img2 : IMG.img1
            this.setData({daojishiJson})
          }
        }, 1000);
    })
  }

  },

  _endGame(e){
    let jsData = {
      userid : this.data.userData.id,
      getPoints: this.data.currentPoint,
      gameid: gameID
    }
    endGame(jsData).then(res => {
      let userData = wx.getStorageSync('redRainData');
      userData.gameCount = userData.gameCount - 1;
      wx.setStorageSync('redRainData', userData);
      this.setData({
        showPop: true,
        pop1: true,
        overTime: 30,
        datas: [],
        transformX: defaultX,
        daojishiJson : {
          show : false,
          num : 3,
          numImg : IMG.img3
        }
      })
    })
  },

  onClick: function(e){
    let type = e.currentTarget.dataset.type;
    switch(type){
      case 'gameAgain':
        this.setData({
          showPop: false,
        })
        this.daojishi();
        break;
      case 'open':
        let jsData ={
          userid : this.data.userData.id,
          gameid: gameID
        }
        kaiqibaoxiang(jsData).then(res =>{
          this.setData({
            pop1: false,
            pop2: true,
            couponImg: res.giftPic
          })
        })
        break;
      case 'getGift':
        this.setData({
          pop2: false,
          pop3: true
        })
        break;
      case 'inventMore':
        this.setData({
          pop3: false,
          pop4: true,
        })
        break;
      case 'again':
        let gameCount =  wx.getStorageSync('redRainData').gameCount;
        if(gameCount <= 0){
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
        this.setData({
          showPop: false,
          pop1: false,
          pop2: false,
          pop3: false,
          pop4: false,
          showPoint: false,
          currentPoint: 0,
          helpCount: 2,
          alreadyShareCount: 0,
          twoFriendHelp: false,
          helpFirends:[{
            helpImg:  splitGameImg('pop_third_default.png', 'redEnvelop'),
            nickname: '待邀请',
            },
            {
              helpImg: splitGameImg('pop_third_default.png', 'redEnvelop'),
              nickname: '待邀请',
            }]
        })
        this.daojishi();
        break;
      case 'back':
        wx.navigateBack({
          delta: 1, // 返回上一级页面。
          success: function() {
              console.log('成功！')
          }
        })
        break;
      case 'firstShow':
        this.setData({
          firstShow: false
        })
        this.daojishi();
        break;
      case 'coupon':
        let name = app.config.ETO_BRAND[app.config.brand];
        wx.navigateTo({
          url: '../../../member/myCouponList/myCouponList?name=' + name
        })
        break;
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
  },

  makeDatas(index,id){
     let datas = this.data.datas;
     let json =  this.gameConfig.makeData(index, this.data.animate);
     let {animate, animate1} = this.data;
      if (id == 999){
        json.animation = datas[index].animation == animate ? animate1 : animate
        datas.splice(index,1,json)
        this.setData({datas})
      }
      else{
        datas.push(json)
        this.setData({datas})
        if (index < 5){
          this.makeDatas(index + 1)
        }
    }
  },

  closed(){
    let daojishiJson = this.data.daojishiJson
    daojishiJson.show = false
    this.setData({
      daojishiJson,
    })
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
    if (this.gameConfig){
      this.gameConfig.dealloc()
      this.gameConfig = ''
    }
    innerAudioContext.destroy();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(){
      let openID = wx.getStorageSync('wxOpenID');
      let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      let json = {
        userid : this.data.userData.id || '',
        gameid: gameID,
        openid: openID,
        userAvatar : wxInfo.avatarUrl || '',
        userNick : wxInfo.nickName || '',
        utm_source : 'game',
        utm_medium : 'game_redRain',
        utm_term : '',
        utm_campaign : ''
      }
      let title = '玩游戏，接红包！邀你一起瓜分百元神券！'

      let path = `/activity/redEnvelop/main/main${objToQuery(json)}`
      let imageUrl = splitGameImg('img_share@2x.png', 'redEnvelop');
      console.log(`分享成功`, path)
      let {alreadyShareCount, helpFirends, twoFriendHelp, helpCount} = this.data;
      alreadyShareCount = alreadyShareCount + 1
      if(alreadyShareCount === 1){
        helpFirends[0].helpImg = splitGameImg('ivented_default.png', 'redEnvelop')
        helpFirends[0].nickname = '已邀请'
      } else if(alreadyShareCount === 2){
        helpFirends[0].helpImg = splitGameImg('ivented_default.png', 'redEnvelop')
        helpFirends[0].nickname = '已邀请'
        helpFirends[1].helpImg = splitGameImg('ivented_default.png', 'redEnvelop')
        helpFirends[1].nickname = '已邀请'
        twoFriendHelp = true
        let jsData = {
          userid : this.data.userData.id || '',
          gameid: gameID,
        }
        shareCoupon(jsData).then(res =>{
          this.setData({
            couponImg2: res.giftPic
          })
        })
      }
      helpCount = 2 - alreadyShareCount;
      this.setData({
        alreadyShareCount,
        helpFirends,
        twoFriendHelp,
        helpCount,
        pop3: true,
        pop4: false
      })
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

  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let popdownTimeTop = '', popFirstTop = '', popSecondTop = '', popThirdTop = '', forthPopTop = '';
      let animate = '', animate1= '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          animate = item.animate
          animate1 = item.animate1
          popdownTimeTop = item.popdownTimeTop
          popFirstTop = item.popFirstTop
          popSecondTop = item.popSecondTop
          popThirdTop = item.popThirdTop
          forthPopTop = item.forthPopTop
        }
      });
      if(popdownTimeTop){
        that.setData({
          animate,
          animate1,
          popdownTimeTop,
          popFirstTop,
          popSecondTop,
          popThirdTop,
          forthPopTop
        })
      }

    }catch (e) {}
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
