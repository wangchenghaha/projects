import {splitGameImg, objToQuery } from '../../../../utils/utils'
import {EVENTS, KEYSTORAGE} from '../../../../src/const'
import events from "../../../../src/events"
import { getGameTime, getUserInfo, createUser,userRank, worldRank} from '../../../service/springOuting'
import { wxSubscription } from '../../../../utils/wxSubscribe'
import {downloadFile} from '../../../../service/saveImg'
import {getRules} from '../gameAdapter'

const app = getApp();
let innerAudioContext;

const gameOverStrs = [
  '邀请好友助力挑战，大奖就快降临啦！',
  '邀请好友助力，中奖概率更高哦！',
  '太遗憾了，邀请好友助力，再试一次吧！'
] 

const gameFOLOverStrs = '就差一点啦！赶快邀请好友助力，抱走您的春日大奖！'
 
const splashImgList = [
  {
    scale: 5622,
    img: splitGameImg('spring_main_six.jpg', 'springOuting'), // 375/603 iphone 7
    startTop1: '1080rpx',
    startTop2: '1060rpx',
    ruleTop1: '200rpx',
    ruleTop2: '120rpx',
    inventTop2: '710rpx',
    gifImg: ''
  },
  {
    scale: 4681,
    img: splitGameImg('spring_main_x.jpg', 'springOuting'),  // 375/724 iphoneX
    startTop1: '1280rpx',
    startTop2: '1144rpx',
    ruleTop1: '200rpx',
    ruleTop2: '200rpx;',
    inventTop2: '852rpx',
    gifImg:  splitGameImg('main_move.gif', 'springOuting'),
  },
  {
    scale: 5064,
    img: splitGameImg('spring_main_x.jpg', 'springOuting'),   // 393/776  redMi Pro 8
    startTop1: '1280rpx',
    startTop2: '1144rpx',
    ruleTop1: '200rpx',
    ruleTop2: '200rpx',
    inventTop2: '852rpx',
    gifImg:  splitGameImg('main_move.gif', 'springOuting'),
  },
];


Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainbg: splitGameImg('spring_main_x.jpg','springOuting'),
    userData: {},
    rankbg:  splitGameImg('rank_bg.png','springOuting'),
    rulebg:  splitGameImg('rule_bg.png','springOuting'),
    rankImg: splitGameImg('ranks.png','springOuting'),
    giftImg: splitGameImg('gift.png','springOuting'),
    brandLogo: splitGameImg('main_logo.png','springOuting'),
    startTop1: '1280rpx',
    startTop2: '1144rpx',
    ruleTop1: '200rpx',
    ruleTop2: '200rpx',
    isWorld: true,
    threeList: [{avatarbg: splitGameImg('rank_2.png','springOuting'),
                avatarImg: "",
                bgcolor: '#6ee7f5',
                level: 2,
                nickName: '',
                points: 0,
                marginTop: "30rpx"},
                {avatarbg: splitGameImg('rank_1.png','springOuting'),
                avatarImg:"",
                bgcolor: '#ffe63c',
                level: 1,
                nickName: '',
                points: 0,
                marginTop: "2rpx"},
                {avatarbg: splitGameImg('rank_3.png','springOuting'),
                avatarImg: "",
                bgcolor: '#b3f283',
                level: 3,
                nickName: '',
                points: 0,
                marginTop: "40rpx"},],

    otherList:[],
    friendList: [],
    isShowRank: false,
    isShowRule: false,
    ruleContent: [],
    tan_close: splitGameImg('close_toast.png','springOuting'), 
    isBrandShow: true,
    gameNoCount: false,
    regretlogo: splitGameImg('regret.png', 'springOuting'),
    closeImg: splitGameImg('close.png', 'springOuting'), 
    gameOverStr: '',    
    myRank: '',   
    isShowLimte: false,
    isShowFriendLimte: false,
    isMusicStart: true,  
    musicImg: splitGameImg('music_start.png', 'springOuting'),    
    inventTop2: '852rpx',
    backImg: splitGameImg('backImg.png', 'springOuting'), 
    isFol: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
    app.setUtmOptions(options)
    let {isBrandShow} = this.data
    if(app.config.brand === 'ONLY' || app.config.brand === 'SELECTED' || app.config.brand === 'FOL'){
      isBrandShow = true
    } else {
      isBrandShow = false
    }
    this.setData({
      isBrandShow,
      ruleContent: getRules(),
      isFol: app.config.brand === 'FOL'
    })
    wx.setStorageSync('springMusic', this.data.isMusicStart)
    let isMusic = wx.getStorageSync('springMusic')
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
      let mainbg = '', startTop1 = '', startTop2 = '', ruleTop1 = '', ruleTop2 = '', inventTop2 = '', gifImg = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          mainbg = item.img
          startTop1 = item.startTop1
          ruleTop1 = item.ruleTop1
          ruleTop2 = item.ruleTop2
          startTop2 = item.startTop2
          inventTop2 = item.inventTop2
          gifImg = item.gifImg
        }
      });
      if(mainbg){
        that.setData({
          mainbg,
          startTop1,
          startTop2,
          ruleTop1,
          ruleTop2,
          inventTop2
        })
        console.log(that.data.mainbg,'***init');
      }
      if(gifImg){
        let backImg = wx.getStorageSync('springMainBg')
        if(backImg){
          that.setData({
            mainbg: backImg
          })
        } else {
          downloadFile(gifImg).then(res=>{
            wx.setStorageSync('springMainBg', res);
            that.setData({
              mainbg: res
            })
          })
        } 
      }
    }catch (e) {}
  },

  requestData() {
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
        this._worldRank();
      }
    })
  },

  _userRank(){
    let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)
    let _phone = userInfo.phone
    let friendList = []
    let jsData = {
      openid: wx.getStorageSync('wxOpenID'),
      label: app.config.friendRanklabel,
      distance: 1,
      phone: _phone
    }
    userRank(jsData).then(res =>{
      let friendRankLength = 0;
      friendRankLength = res.length > 10 ? 10 : res.length
      let isShowFriendLimte;
      isShowFriendLimte = res.length >= 10 ? true : false
      for (let i = 0; i < friendRankLength; i++) {
        let friends = {}
        friends.id = i+1;
        friends.otherImg = res[i].facePic;
        friends.nickName = res[i].nickName;
        friends.points = res[i].points;
        friendList.push(friends);
      }
      this.setData({
        friendList,
        isShowFriendLimte
      })
    })
  },

  _worldRank(){
    let {threeList, isShowLimte} = this.data;
    let otherList = [];
    let jsData = {
      userid: this.data.userData.id
    }
    worldRank(jsData).then(res=>{
      if(res.rankList.length === 1){
        threeList[1].avatarImg = res.rankList[0].facePic
        threeList[1].nickName = res.rankList[0].nickName
        threeList[1].points = res.rankList[0].points
      }
      if(res.rankList.length === 2){
        threeList[0].avatarImg = res.rankList[1].facePic
        threeList[0].nickName = res.rankList[1].nickName
        threeList[0].points = res.rankList[1].points
        threeList[1].avatarImg = res.rankList[0].facePic
        threeList[1].nickName = res.rankList[0].nickName
        threeList[1].points = res.rankList[0].points
      }

      if(res.rankList.length >= 3){
        threeList[0].avatarImg = res.rankList[1].facePic
        threeList[0].nickName = res.rankList[1].nickName
        threeList[0].points = res.rankList[1].points
        threeList[1].avatarImg = res.rankList[0].facePic
        threeList[1].nickName = res.rankList[0].nickName
        threeList[1].points = res.rankList[0].points
        threeList[2].avatarImg = res.rankList[2].facePic
        threeList[2].nickName = res.rankList[2].nickName
        threeList[2].points = res.rankList[2].points
      }

      if(res.rankList.length > 3){
        for (let i = 0; i < res.rankList.length - 3; i++) {
          let otherData = {}
          otherData.id = i + 4;
          otherData.otherImg = res.rankList[i + 3].facePic;
          otherData.nickName = res.rankList[i + 3].nickName;
          otherData.points = res.rankList[i + 3].points;
          otherList.push(otherData);
        }
      }
      if(res.rankList.length === 10){
        isShowLimte = true
      }
      wx.setStorageSync('myRank', res.myRank);
      this.setData({
        myRank: res.myRank,
        threeList,
        otherList,
        isShowLimte
      })
    })
  },

  onClick(e){
    let {isWorld} = this.data;
    let type = e.currentTarget.dataset.type;
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
      case 'ranking':
        this.setData({
          isShowRank: true
        })
        this._worldRank();
        break;
      case 'giftList':
        wx.navigateTo({
          url: '../myGift/myGift'
        })
        break; 
      case 'rule':
        this.setData({
          isShowRule: true
        })
        break;
      case 'tan_close':
        this.setData({
          isShowRank: false,
          isShowRule: false,
          gameNoCount: false
        })
        break;
      case 'world':
        if(isWorld){
          return
        }
        isWorld = !isWorld;
        this.setData({
          isWorld
        })
        break;
      case 'friends':
        if(!isWorld){
          return
        }
        isWorld = !isWorld;
        this._userRank();
        this.setData({
          isWorld
        })
        break;   
      case 'music':
        let {isMusicStart, musicImg} = this.data;
        isMusicStart = !isMusicStart;
        musicImg = isMusicStart ? splitGameImg('music_start.png', 'springOuting'): splitGameImg('music_close.png', 'springOuting')
        if(isMusicStart){
          this.playMuisc();
        }else{
          innerAudioContext.destroy();
        }
        wx.setStorageSync('springMusic', isMusicStart)
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
 
  _startGame(){
    let {userData, isFol} = this.data
    if(userData.gameCount > 0){
      wx.setStorageSync('springOutData', userData);
      wx.navigateTo({
        url: '../index/index'
      })
    } else {
      this.setData({
        gameNoCount: true,
        gameOverStr: isFol? gameFOLOverStrs : gameOverStrs[Math.floor(Math.random()*3)]
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
   onShareAppMessage: function () {
    let {userData} = this.data;
    let openID = wx.getStorageSync('wxOpenID');
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let utmData = wx.getStorageSync('daogouLists');
    let json = {
      userid : userData.id || '',
      openid: openID,
      userAvatar : wxInfo.avatarUrl || '',
      userNick : wxInfo.nickName || ''
    }
    if(utmData && utmData.length){
      utmData.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          json[item.key] = item.value;
        }
      })
    }
    const arrs = ["独自玩耍太孤单了，赶快分享给小伙伴，叫Ta一起加入吧！",
      "分享小游戏会让快乐加倍哟~赶快邀请小伙伴一起春游啦！"]
    let title = arrs[Math.floor(Math.random()*2)]
    let path = `/activity/games/springOuting/help/help${objToQuery(json)}`
    let imageUrl = splitGameImg('share_image.jpg', 'springOuting');
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
      innerAudioContext.destroy();
    },
  
      /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      innerAudioContext.destroy();
    },
  
    playMuisc(){
      let musicUrl = splitGameImg('spring_bgm.mp3', 'springOuting')
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