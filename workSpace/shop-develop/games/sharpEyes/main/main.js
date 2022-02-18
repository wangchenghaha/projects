import {splitGameImg, objToQuery, translateArray } from '../../../utils/utils'
import {EVENTS, KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events"
import {wxShowToast} from '../../../utils/wxMethods'
import { getGameConfig, getUserInfo, createUser, getCardList, getCouponList, changeCoupon, getUserCouponList, openBigGif} from '../../service/sharpEyes'
import { wxSubscription } from '../../../utils/wxSubscribe'
import {getRules}  from '../sharpEyesAdapter'
const app = getApp();
let innerAudioContext = null;

const gameOverStrs = [
  '邀请好友助力挑战，大奖就快降临啦！',
  '邀请好友助力，中奖概率更高哦！',
  '太遗憾了，邀请好友助力，再试一次吧！'
] 

const gameFOLOverStrs = '就差一点啦！赶快邀请好友助力，抱走您的春日大奖！'
 
 
const splashImgList = [
  {// 375/603 iphone 7
    scale: 5622,
    startTop: '',
  },
  {// 375/724 iphoneX
    scale: 4681,
    startTop: '',
 
  },
  { // 393/776  redMi Pro 8
    scale: 5064,
    startTop: '',
  },
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainbg: splitGameImg('main.gif','sharpEyes'),
    userData: {},
    rulebg:  splitGameImg('rule_bg.png','sharpEyes'),
    brandLogo: splitGameImg('main_logo.png?v=1','sharpEyes'),
    guideImg: splitGameImg('guide.gif','sharpEyes'),
    isFirstEnty: false,
    isShowRule: false,
    ruleContent: [],
    gameNoCount: false,
    regretlogo: splitGameImg('regret.png', 'sharpEyes'),
    closeImg: splitGameImg('close.png', 'sharpEyes'), 
    gameOverStr: '',    
    isShowLimte: false,
    isShowFriendLimte: false,
    isMusicStart: true,  
    musicImg: splitGameImg('music_start.png', 'sharpEyes'), 
    gameData:{isMusic: true,
              userData: {}},
    isIllustrat: false,
    isGift: false,
    illustratTitle: splitGameImg('wenan@2x.png', 'sharpEyes'), 
    illustratBg: splitGameImg('puzzle_bg.png', 'sharpEyes'), 
    tan_close: splitGameImg('puzzle_close.png', 'sharpEyes'), 
    illustrats: [],
    giftBg: splitGameImg('gift_bg.png', 'sharpEyes'),
    openGiftImage: splitGameImg('bigGiftbtn.png', 'sharpEyes'),
    isChange: true, 
    giftLists: [],
    isColletAll: false,  
    isBigGift: false,    
    bigGiftbg: splitGameImg('bigGiftbg_new.png', 'sharpEyes'),
    bigGiftImage: splitGameImg('coupon.png', 'sharpEyes'),
    gameNoCountImg: splitGameImg('invite.png','sharpEyes'),
    inviteBtn:  splitGameImg('btn_invite.png','sharpEyes'),
    gameNoCount: false,
    isRule: false,
    rules: [],
    ruleBg: splitGameImg('rule_bg.png','sharpEyes'),
    showBtn:'',
    backImg: splitGameImg('backImg.png','sharpEyes'),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
    app.setUtmOptions(options)
    let gameData = wx.getStorageSync('gameUserData')
    let {isIllustrat, musicImg, isMusicStart} = this.data;
    if(gameData){
      if(gameData.isMusic){
        this.playMuisc();
        musicImg = splitGameImg('music_start.png', 'sharpEyes')
        isMusicStart = true
      } else {
        this.closeMuisc();
        musicImg = splitGameImg('music_close.png', 'sharpEyes')
        isMusicStart = false
      }
    } else {
      gameData = {
        isMusic: true,
        userData: {}
      }
      this.playMuisc();
      musicImg = splitGameImg('music_start.png', 'sharpEyes')
      isMusicStart = true
      isIllustrat = true
    }
    this.setData({
      gameData,
      musicImg,
      isMusicStart,
      isIllustrat,
      rules: getRules()
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
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    let _this = this
    setTimeout(() => {
      wx.hideLoading();
      _this.getSystemInfo();
      if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
        app.navigateTo('member/login/login?game=true')
        return;
      }
      else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
        _this.requestData();
      }
     
    }, 1000);
  },

  /**
 * 接受授权成功刷新页面
 */
  handleEvent: function (event, type) {
    if (type == EVENTS.EVENT_GAMECRMINFO && event) {
      //  获取手机号成功
      this.requestData()
    } 
  },

  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let startTop='';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
        
        }
      });
      if(mainbg){
        that.setData({
         
        })
        console.log(that.data.mainbg,'***init');
      }

    }catch (e) {}
  },

  requestData() {
    getGameConfig().then(e => {
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
    getUserInfo(openID).then(res => {
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
          userData = res
          this.setData({userData})
        })

      } else {
        userData = res
        this.setData({userData});
      }
    })
  },

  
  onClick(e){
    let {userData} = this.data;
    let type = e.currentTarget.dataset.type;
    let giftId = e.currentTarget.dataset.giftid;
    switch(type){
      case 'startGame':
        if (!wx.getStorageSync('wxSubscriptions').isJumpGame){
          wxSubscription("jumpGame").then(res => {
            this._startGame();
          }).catch(err => {
            this._startGame();
          })
        } else{
          this._startGame();
        }
        break;
      case 'giftList':
        this._getCouponList();
        break; 
      case 'illustrated':
        this._getCardList()
        break  
      case 'rule':
        this.setData({
          isRule: true
        })
        break;
      case 'change':
        this.setData({
          isChange: true
        })
        this._getCouponList();
        break;
      case "myGift":  
        this.setData({
          isChange: false
        })
        this._getUserCouponList()
        break;
      case "openGift":
        if(userData.giftStatus === 1){
          this.setData({
            isIllustrat: false
          })
          return;
        }
        this._openBigGif();
        break;  
      case 'tan_close':
        this.setData({
          isIllustrat: false,
          isGift: false,
          isBigGift: false,
          gameNoCount: false,
          isRule: false
        })
        break;
      case "changeGift":
        this._changeCoupon(giftId);
        break;  
      case 'music':
        let {isMusicStart, musicImg, gameData} = this.data;
        isMusicStart = !isMusicStart;
        musicImg = isMusicStart ? splitGameImg('music_start.png', 'sharpEyes'): splitGameImg('music_close.png', 'sharpEyes')
        if(isMusicStart){
          this.playMuisc();
        }else{
          this.closeMuisc();
        }
        gameData.isMusic = isMusicStart
        wx.setStorageSync('gameUserData', gameData)
        this.setData({
          isMusicStart, 
          musicImg
        })
        break;   
      case 'back':
        app.goBack();
        break;                
    }
  },

  _getCouponList(){
    getCouponList().then(res =>{
      this.setData({
        isGift: true,
        giftLists: translateArray(res,2),
      })
    })
  },

  _changeCoupon(_giftid){
    let jsData={
      giftId: _giftid,
      userId: this.data.userData.id
    }
    changeCoupon(jsData).then(res =>{
      // wxShowToast("兑换成功！");
      if(res){
        let msg = "恭喜！成功兑换"+res.giftName + '，请在【会员中心-我的优惠券】查看'
        wx.showModal({
          title: '提示',
          content: msg,
          showCancel: false,
          success: function (res) {
          }
        });
      }
    })
  },

  _getUserCouponList(){
    let jsData = {
      userId: this.data.userData.id
    }
    getUserCouponList(jsData).then(res =>{
      this.setData({
        giftLists: translateArray(res,2)
      })
    })
  },

  _getCardList(){
    let {userData, illustrats, isColletAll, openGiftImage} = this.data;
    let jsData = {
      userId: userData.id
    }
    getCardList(jsData).then(res =>{
      if(res){
        for (let i = 0; i < res.length; i++) {
          let puzzleUrl =  `show_puzzle_${res[i].cardName}.png`
          illustrats.push(splitGameImg(puzzleUrl,'sharpEyes'))
        }
        if(res.length === 6){
          isColletAll = true
          if(userData.giftStatus === 0){
            openGiftImage = splitGameImg('bigGiftbtn.png', 'sharpEyes')
          } else {
            openGiftImage = splitGameImg('alreadyGetGift.png', 'sharpEyes')
          }
          
        } else {
          isColletAll = false
        }
      } 
      this.setData({
        isIllustrat: true,
        openGiftImage,
        illustrats,
        isColletAll,
      })
    })
  },

  _openBigGif(){
    let jsData = {
      userId:this.data.userData.id
    }
    openBigGif(jsData).then(res =>{
      this.userInfo();
      this.setData({
        isBigGift: true,
        isIllustrat: false,
        bigGiftImage: res.giftPic
      })
    })
  },
 
  _startGame(){
    let {gameData, userData} = this.data
    gameData.userData = userData
    if(userData.gameCount > 0){
      wx.setStorageSync('gameUserData', gameData);
      wx.navigateTo({
        url: '../game/game'
      })
    } else {
      this.setData({
        gameNoCount: true
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
   onShareAppMessage: function () {
    let {userData} = this.data;
    let utmData = wx.getStorageSync('daogouLists');
    let json = {
      userid : userData.id || '',
    }
    if(utmData && utmData.length){
      utmData.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          json[item.key] = item.value;
        }
      })
    }
    let title = app.config.brand === 'FOL'? '快来和我一起体验挑战记忆巅峰的快感！' :  "你的记忆力如何，快来挑战吧！"
    let path = `/games/sharpEyes/help/help${objToQuery(json)}`
    let imageUrl = splitGameImg('share_image.png', 'sharpEyes');
    console.log("utmParam**********",path );
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

    /**
   * 生命周期函数--监听页面隐藏
   */
    onHide: function () {
      this.closeMuisc()
    },
  
      /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      this.closeMuisc()
    },
  
   playMuisc(){
      let musicUrl = splitGameImg('game_bgm.mp3', 'sharpEyes')
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
  },  
  
  closeMuisc(){
    if(innerAudioContext){
        innerAudioContext.destroy();
        innerAudioContext = null;
    }
}

})