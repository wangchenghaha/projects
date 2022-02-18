import {splitGameImg, objToQuery } from '../../../../utils/utils'
import {  kaiqibaoxiang, startGame, endGame,} from '../../../service/springOuting'
import {KEYSTORAGE} from '../../../../src/const'
const app = getApp()
const strs = ['wow,给你点赞，太厉害了！获得',
              '果然没看错人，你真厉害！获得',
              '再接再厉，你是最棒的！获得'];
const folStr = '啊啊啊啊啊啊！不小心掉下去了，再来一次！获得'              
const gameOverStrs = [
  '邀请好友助力挑战，大奖就快降临啦！',
  '邀请好友助力，中奖概率更高哦！',
  '太遗憾了，邀请好友助力，再试一次吧！'
]   
const gameFOLOverStrs = '就差一点啦！赶快邀请好友助力，抱走您的春日大奖！'

let isAnim = false;
let currentStep = 0;
let fistInvent = true
let timers = null;
let innerAudioContext;

var firstShowTap = 0

const splashImgList = [
  {
    scale: 5622,
    img: splitGameImg('spring_bg_six.jpg', 'springOuting'), // 375/603 iphone 7
    inventTop1: '660rpx',
    inventTop2: '710rpx',
    logoTop: '16rpx',
    pointTop: '124rpx'
  },
  {
    scale: 4681,
    img: splitGameImg('spring_bg_x.jpg', 'springOuting'),  // 375/724 iphoneX
    inventTop1: '800rpx',
    inventTop2: '852rpx',
    logoTop: '102rpx',
    pointTop: '216rpx'
  },
  {
    scale: 5064,
    img: splitGameImg('spring_bg_x.jpg', 'springOuting'),   // 393/776  redMi Pro 8
    inventTop1: '800rpx',
    inventTop2: '852rpx',
    logoTop: '102rpx',
    pointTop: '216rpx'
  },
];

const barriers = [
    splitGameImg('barrier_1.png', 'springOuting'),
    splitGameImg('barrier_2.png', 'springOuting'),
    splitGameImg('barrier_3.png', 'springOuting'),
    splitGameImg('barrier_4.png', 'springOuting'),
          ]

// 倒计时固定时间
const constDownNum = 60
Page({
  data: {
    // 倒计时
    downNum : constDownNum,
    userData: {},
    springBg: splitGameImg('spring_bg_x.jpg', 'springOuting'),
    platformList:[],            
    direction: [],
    renwuIndex:  0,
    renwuJump: false,
    renwuImg:  splitGameImg('award_left.png', 'springOuting'),
    barrieImg:  splitGameImg('step_gift.png', 'springOuting'),
    firstShow: true,
    firstShowImg: splitGameImg('firstpage.png?v=10', 'springOuting'),
    renwuAnim: '',
    gameId: 0,
    logo: splitGameImg('logo.png?v=15', 'springOuting'),
    gameOverShow: false,
    isFirstDeath: false,
    haveGameCount: false,
    noGameCount: false,
    showCoupon: false,
    gameOverlogo: splitGameImg('game_over.png', 'springOuting'),
    regretlogo: splitGameImg('regret.png', 'springOuting'),
    closeImg: splitGameImg('close.png', 'springOuting'),
    couponShowImg: splitGameImg('gift_bg.png', 'springOuting'),
    couponImg: splitGameImg('coupon_20.png', 'springOuting'),
    currentPoint: 0,
    gift20: 0,
    gift50: 0,
    inventTop1: '800rpx',
    inventTop2: '852rpx',
    logoTop: '102rpx',
    pointTop: '216rpx',
    messages: '',
    gameOverStr: '',
    couponName: '',
    myRank: '',
    isShowLimte: false,
    isMusicStart: true,  
    musicImg: splitGameImg('music_start.png', 'springOuting'),  
    backImg: splitGameImg('backImg.png', 'springOuting'),
    isFol: false,
  },
 
  onLoad() {
    firstShowTap = 0
    let {userData, isMusic, firstShow, myRank} = this.data.userData
    userData = wx.getStorageSync('springOutData');
    isMusic = wx.getStorageSync('springMusic')
    myRank =  wx.getStorageSync('myRank');
    firstShow = wx.getStorageSync('closeFirst')
    if(isMusic){
      this.playMuisc();
    }
    if(firstShow === 1){
      firstShow = false
    } else {
      firstShow = true
    }

    this.setData({
      isMusicStart: isMusic,
      userData,
      myRank,
      gift20: this.randomNum(10),
      gift50: this.randomNum(40),
      firstShow,
      isFol: app.config.brand === 'FOL'
    })
    this._startGame();
    
  },

  onShow() {
    this.getSystemInfo();
  },

  _startGame(){
    let {platformList, direction, gameOverShow, currentPoint, renwuIndex, renwuAnim} = this.data
    platformList = [{top: 966, left:305, direction: 0, barrier: 10,stepImg : splitGameImg('step_nor.png', 'springOuting')},
      {top: 896, left:0, direction: 0},
      {top: 826, left:0, direction: 0},
      {top: 756, left:0, direction: 0},
      {top: 686, left:0, direction: 0},
      {top: 616, left:0, direction: 0},
    ],
    currentPoint = 0
    currentStep = 0
    renwuIndex = 0
    gameOverShow = false
    direction = [],
    renwuAnim = '',
    this.setData({
      platformList,
      gameOverShow,
      currentPoint,
      direction,
      renwuIndex,
      renwuAnim
    })
    startGame(this.data.userData.id).then(res=>{
      this.setData({
        gameId: res.id,
        downNum : constDownNum
      })
      this.makeData();
      this._downNum()
    })
  },

  _gameOver(renwuIndex){
    if (this.interval){
      clearInterval(this.interval)
    }
    let {userData, platformList, isFol} = this.data;
    if(fistInvent){
      this.setData({
        gameOverShow: true,
        isFirstDeath: true,
        haveGameCount: false,
        noGameCount: false,
        renwuAnim: 'dropAnimate'
      })
      
    }else {
      this.setData({
        gameOverShow: true,
        isFirstDeath: false,
        haveGameCount: true,
        noGameCount: false,
        renwuAnim: 'dropAnimate',
        messages: isFol? folStr : strs[Math.floor(Math.random()*3)]
      })
      for (let i = 0; i < renwuIndex; i++) {
        platformList[i].animation = 'animate'
      }
      this.setData({
        platformList
      })
      this._endGame();
    }  
  },

  _endGame(){
    return new Promise((resolve, reject)=>{

      let {userData, currentPoint, gameId} = this.data;
      let jsData = {
        userid : userData.id,
        getPoints: currentPoint,
        gameid: gameId,
      
      }
      endGame(jsData).then(res=>{
        userData.gameCount-- 
        this.setData({
          userData,
          myRank: res.myRank
        })
        resolve(res.data)
      })
    
    })
    
  },

  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let springBg = '', inventTop1 = '', inventTop2 = '',logoTop = '',pointTop = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          springBg = item.img
          inventTop1 = item.inventTop1
          inventTop2 = item.inventTop2
          logoTop = item.logoTop
          pointTop = item.pointTop
        }
      });
      if(springBg){
        that.setData({
          springBg,
          inventTop1,
          inventTop2,
          logoTop,
          pointTop
        })
        console.log(that.data.springBg,'***init');
      }
    }catch (e) {}
  },

  onClick(e){
    let type = e.currentTarget.dataset.type;
    let {isFol} = this.data;
    switch(type){
      case 'left':
      case 'right':
        this.clickDirection(type)
        break;
      case 'firstShow':
        if (firstShowTap > 0){
          wx.setStorageSync('closeFirst', 1);
          this.setData({
            firstShow: false
          })
          return

        }
        firstShowTap += 1
        let firstShowImg = this.data.firstShowImg
        firstShowImg= splitGameImg('firstpage_1.jpg?v=10', 'springOuting'),
        this.setData({
          firstShowImg
        })
        break; 
      case 'gameAgain':
        if(this.data.userData.gameCount > 0){
          this.setData({
            gameOverShow: false
          })
          if (fistInvent){
            this._endGame().then(() => {
              this._startGame();
            });
            return
          }
          this._startGame();
          
        } else {
          this.setData({
            gameOverShow: true,
            isFirstDeath: false,
            haveGameCount: false,
            noGameCount: true,
            renwuAnim: 'dropAnimate',
            gameOverStr: isFol? gameFOLOverStrs : gameOverStrs[Math.floor(Math.random()*3)]
          })
        }
        break;  
      case 'gift':
        if (fistInvent){
          this._endGame().then(()=>{
            wx.navigateTo({
              url: '../myGift/myGift'
            })
          })
        }
        else{
          wx.navigateTo({
            url: '../myGift/myGift'
          })
        }
        break;  
      case 'close': 
        this.setData({
          gameOverShow: false,
          showCoupon: false,
        })
        break;
      case 'gameOver':
        if (fistInvent){
          this._endGame();
        }
        wx.navigateBack({
          delta: 1
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
        if (this.interval){
          clearInterval(this.interval)
        }

        wx.navigateBack({
          delta: 1, // 返回上一级页面。
          success: function() {
              console.log('成功！')
          }
        })
        break;          
    }
  
    
  },

  makeData(){
    let {direction, platformList} = this.data
    for (let index = 0; index <6; index++) {
        direction[index] = Math.floor(Math.random(2)*2);
    }
    
    // 0: 代表左 left - 60  1：代表右 left + 60
    for (let i = 1; i < direction.length; i++) {
        if(direction[i] === 0){
          platformList[i].left = platformList[i - 1].left - 70;
        } else {
          platformList[i].left = platformList[i - 1].left + 70;
        }
        platformList[i].barrier = 10;
        platformList[i].direction = direction[i]
        platformList[i].stepImg = splitGameImg('step_nor.png', 'springOuting');
       
    }
    console.log("platformList1 ==== ",platformList);
    this.setData({
      platformList
    })
  },

  _downNum(){


    let downNum = this.data.downNum
    let _this = this
    this.interval = setInterval(() => {
      if (downNum ==1){
        // 游戏结束
        downNum = 0
        clearInterval(_this.interval)
        fistInvent = false
        _this._gameOver(_this.data.renwuIndex)
      }
      else{
        downNum -= 1
      }
      _this.setData({downNum})
    }, 1000);
  },
  clickDirection(type){
    
    let {userData, platformList, renwuIndex, renwuImg, gift20, gift50, showCoupon} = this.data;
    // 判断是否挑错位置
    renwuIndex =renwuIndex + 1;
    if(renwuIndex > 4){
      renwuIndex = 4
    }
   // this.formClassCode(2000);
    // 判断点击放下与下一个台阶位置是否一直
    if((type === 'left' && platformList[renwuIndex].direction !== 0)
    || (type === 'right' && platformList[renwuIndex].direction !== 1)){
      this._gameOver(renwuIndex);
      return;
    }
    // 步数++
    currentStep++
    // 随机方向生成下一个台阶
    let _direction = Math.floor(Math.random()*2);
    let _top = 0 , _left = 0, _barrier = 10, _barrierleft = 0, _stepImg = splitGameImg('step_nor.png', 'springOuting');
    let index = platformList.length - 1
    _top = platformList[index].top - 70;
    if(_direction === 0){
      _left = platformList[index].left - 70;
    } else {
      _left = platformList[index].left + 70;
    }

    let zorjRan = Math.floor(Math.random() * 101 + 0)
    // 百分之二十的概率出现障碍物 20：没有障碍物， 0：台阶左侧有障碍 1：台阶右侧
    if(zorjRan >= 10 && zorjRan <= 90){
      _barrier = 10;
    } else {
      _barrier = Math.floor(Math.random(2)*2);
      if(_barrier === 0){
        _barrierleft =  _left - 140
      } else {
        _barrierleft =  _left + 140
      }
    }
   
    let brandTap = Math.floor(Math.random() * 101 + 0)
    // 百分之十的概率出现品牌台阶
    if(brandTap >= 50 && brandTap <= 90){
      _stepImg = splitGameImg('step_brand.png', 'springOuting');
    } 

    //获取本地存储的开宝箱次数
    let localCounts = wx.getStorageSync('springOutData').openBoxCount;
    // 判断用户是否开过宝箱 0： 没开过， 1： 开过一次， 2：开过两次
    if(userData.openBoxCount === 0){
      if(localCounts === 0){
         // 奖品台阶 10~20、 40~50 随机出现 
        if(currentStep + 5 === gift20 || currentStep + 5 === gift50){
          _stepImg = splitGameImg('step_gift.png', 'springOuting');
          // this.formClassCode(20000);
        }
        // 跳到宝箱格开宝箱
        if(gift20 === currentStep || gift50 === currentStep){
          this._openBox();
        }
      } else if(localCounts === 1){
        if(currentStep + 5 === gift50){
          _stepImg = splitGameImg('step_gift.png', 'springOuting');
          // this.formClassCode(20000);
        }
         // 跳到宝箱格开宝箱
        if(gift50 === currentStep){
          this._openBox();
        }
      }
    }else if(userData.openBoxCount === 1){
      if(localCounts === 1 && currentStep + 5 === gift50){
        _stepImg = splitGameImg('step_gift.png', 'springOuting');
        // this.formClassCode(20000);
      }
       // 跳到宝箱格开宝箱
      if(localCounts === 1 && gift50 === currentStep){
        this._openBox();
      }
    }

    let jsData = {
      top: _top,
      left: _left,
      direction: _direction,
      barrier: _barrier,
      barrierleft: _barrierleft,
      stepImg: _stepImg,
      barrieImg:barriers[Math.floor(Math.random()*4)]
    }
    platformList.push(jsData);
   
    // 点击左右切换人物朝向
    if(type === 'left'){
      renwuImg = splitGameImg('award_left.png', 'springOuting')
    }else{
      renwuImg = splitGameImg('award_right.png', 'springOuting')
    }
    
    // 台阶下移计算
    let newDirection = platformList[renwuIndex].direction;
    for (let j = 0; j < platformList.length ; j++) {
      platformList[j].top = platformList[j].top + 70;
      if(newDirection === 0){
        platformList[j].left = platformList[j].left + 70;
      }else{
        platformList[j].left = platformList[j].left - 70;
      }
      if(platformList[j].barrier === 0){
        platformList[j].barrierleft = platformList[j].left + 140;
      }else{
        platformList[j].barrierleft = platformList[j].left - 140;
      }
      
    }
    if(platformList.length >= 10){
      platformList.splice(0, 1)
    }
    if(renwuIndex === 4){
      isAnim = !isAnim
      if(isAnim){
        platformList[0].animation = 'animate'
      } else {
        platformList[0].animation = 'animate1'
      }
    }
 
   
    this.setData({
      platformList,
      renwuIndex,
      renwuJump: true,
      showCoupon,
      renwuImg,   
      currentPoint: currentStep*10   
    })
    let that = this;
    setTimeout(()=>{
      that.setData({
        renwuJump: false      
      })
    }, 80)
  },


  randomNum(num){
    let randomNum = Math.floor(Math.random()*10) + num
    return randomNum;
  },

  // formClassCode(seconds){
  //   let that = this;
  //   if(timers != null){
  //     clearInterval(timers)
  //   }

  //   timers = setTimeout(()=>{
  //     that._gameOver();
  //   }, seconds)
  // },

  // 领取台阶奖励
  _openBox(){
    let {userData} = this.data
    let jsData ={
      userid : userData.id,
    }
    kaiqibaoxiang(jsData).then(res =>{
      userData.openBoxCount++;
      wx.setStorageSync('springOutData', userData)
      this.setData({
        showCoupon: true,
        couponImg: res.giftPic,
        couponName: res.giftName
      })
    })
  },
  /**
   * 用户分享
   */
   onShareAppMessage: function () {
    let {userData, isFol} = this.data
    let that = this;
    setTimeout(()=>{
      if(fistInvent){
        that.setData({
          gameOverShow:false,
          renwuAnim: '',
        })
        that._downNum()
      } else {
        wx.navigateBack({
          delta: 1, // 返回上一级页面。
          success: function() {
              console.log('成功！')
          }
        })
      }
      fistInvent = false
    }, 2000)
    let openID = wx.getStorageSync('wxOpenID');
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let utmData = wx.getStorageSync('daogouLists');
    let json = {
      userid : userData.id || '',
      openid: openID,
      userAvatar : wxInfo.avatarUrl || '',
      userNick : wxInfo.nickName || '',
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
    const folArr = '春日大奖，惊喜不断，叫上小伙伴一起加入吧！'  
    let title = isFol? folArr : arrs[Math.floor(Math.random()*2)]
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
