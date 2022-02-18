// pages/jumpGame/index.js

import {jumpGameConst} from '../jumpGameConst.js'
import {jumpGameFunction} from '../jumpGameFunction.js'
import {splitGameImg, objToQuery} from '../../../../utils/utils'
import {startGame,endGame} from '../netWorking'
import {KEYSTORAGE} from '../../../../src/const'

var isTwoBounces = false

const brand = getApp().config.brand

// options参数
var optionsJson = {}

var startTime = 0
var endTime = 0

var userid = 0
var gameid = -1

// 动画音效
const startVideo = splitGameImg('gameVedio.mp3','jumpGame0501')

const splashImgList = [
  {
    scale: 5622,
    scoreTop: '80rpx'
  },
  {
    scale: 4681,
    scoreTop: '150rpx'
  },
  {
    scale: 5064,
    scoreTop: '150rpx'
  }
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    icon : '',
    isFirstJumpGame : false,
    adapter: {
      scoreTop: '150rpx'
    }
  },
  getImgHeight(e){

    if(this._gameConst.imgHeightRPX == 0){
      this._gameConst.imgHeightRPX = e.detail.height
      this._gameConst.imgHeightPX = this._gameConst.imgHeightRPX / 750 * wx.getSystemInfoSync().windowWidth;
  
      this._gameConst.jumpTop = wx.getSystemInfoSync().windowHeight - this._gameConst.imgHeightPX
      this._gameConst.returnDatas()
  
      this._startGame()
    }
    else{
      this._gameConst.imgHeightRPX = e.detail.height
      this._gameConst.imgHeightPX = this._gameConst.imgHeightRPX / 750 * wx.getSystemInfoSync().windowWidth;
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    optionsJson = JSON.parse(options.params)
    userid = optionsJson.id
    startTime = optionsJson.startTime
    endTime = optionsJson.endTime
    this.setData({icon : optionsJson.icon})
    isTwoBounces = false
    gameid = -1
    this.isIos()
    this.startbgVedio(startVideo)
},
startbgVedio : function(path){
  this.innerAudioContext = wx.createInnerAudioContext();
  this.innerAudioContext.src = path
  this.innerAudioContext.loop = true
  this.innerAudioContext.autoplay = true
},
// 判断ios还是android
isIos(){
  var that = this;
    wx.getSystemInfo({
      success:function(res){
        if(res.platform == "ios"){
          that.chushihua(true)
        }
        else{
          that.chushihua(false)
        }
      }
    })
},
// 初始化数据
chushihua(isIos){
    let _this = this
    // 初始化数据
    this._gameConst = new jumpGameConst(this,{animateIndex : optionsJson.index})
    this._gameFunction = new jumpGameFunction(this._gameConst,() => {
      let a = _this._gameConst.fenshuArr.sort()
      let json = {
        gameid : gameid,
        getPoints : _this._gameConst.currentNumber,
        score : a[a.length - 1],
        userid : userid
      }
      endGame(json).then(res => {
        
        this._gameConst.fenshu = res.score
        this._gameConst.life = res.gameCount
        this._gameFunction.checkLife()
      })
    })

    this._gameConst.isIos = isIos
    this._gameConst.zongNumber = optionsJson.points
    this._gameConst.life = optionsJson.life

    for (let i=0;i<6;i++){
      this._gameFunction.makeDatas(false)
    }

    this._gameFunction.reloadYunOffset()


},
// 开始游戏
_startGame(){

  let currentTime = new Date().getTime()
  if (currentTime > startTime && currentTime < endTime){
    // 活动开启

    startGame({userid : userid}).then(res => {
      gameid = res.id
      this._gameFunction.levedSpeed()

      // 检测是否是第一次玩游戏
      if (!wx.getStorageSync('isFirstJumpGame')){
        wx.setStorageSync('isFirstJumpGame', true);
        this.setData({isFirstJumpGame : true})
      }
    })

  }
  else{
    let _this = this
    wx.showModal({
      title: '提示',
      content: '活动已结束',
      showCancel: false,
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        if(result.confirm){
          _this.backTap()
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  }
},
closedFirst(){
  this.setData({isFirstJumpGame : false})
},

  /****************** 手指移动相关逻辑 ******************/
  touchstart(e){
    if (!e.touches){
      return
    }
    this._gameConst.touchstart = e.touches[0].pageX
    
  },
  touchmove(e){
    if (!e.touches){
      return
    }
    let transformX = this._gameConst.transformX
    let touchstart = this._gameConst.touchstart
    let touchend = this._gameConst.touchend
    let imgWidth = this._gameConst.imgWidth

    let x = e.touches[0].pageX


    if (x > touchstart){
      x - touchstart
      transformX = transformX + (x - touchstart) - transformX + touchend
    }
    else{
      transformX = transformX - (touchstart - x) - transformX + touchend
    }


    if (transformX < 0){
      transformX = 0
    }
    else if (transformX > wx.getSystemInfoSync().windowWidth - imgWidth / 750 * wx.getSystemInfoSync().windowWidth){
      transformX = wx.getSystemInfoSync().windowWidth - imgWidth / 750 * wx.getSystemInfoSync().windowWidth
    }
    
    this._gameConst.transformX = transformX
  },
  touchend(){
    this._gameConst.touchend = this._gameConst.transformX
  },

    // 返回
    backTap(){
      console.log(`返回`)
      this._gameFunction._clearInterval()

      var pageList = getCurrentPages();
      if (pageList.length > 1){
        wx.navigateBack({
          delta: 1
        });
      }
      else{
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
      
      
        
    },
    // 继续挑战
    agin(){
      this._gameFunction.clearBounces(true)
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
    if (isTwoBounces){
      isTwoBounces = false
      this.backTap()
    }
  },

  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let adapter = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          adapter = item
        }
      });
      if(adapter){
        that.setData({
          adapter
        })
      }
    }catch (e) {}
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
    this._gameFunction._clearInterval()
    if(this.innerAudioContext){
      this.innerAudioContext.destroy()
    }
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    if (this._gameConst.twoBounces){
      isTwoBounces = true
    }
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    var openID = wx.getStorageSync('wxOpenID');
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let utmData = wx.getStorageSync('daogouLists');
      let title = '型趣有礼，动动手指助我一臂之力'
      if (getApp().config.brand == 'FOL'){
        let random = Math.floor(Math.random() * 7 + 0)
        let titles = ['把嘴给我闭上，我说一个事儿，3，2，1...',"快点说要我干嘛，我赶时间","帮我戳，使劲戳，给我助力","害不戳？你已经成功吸引了我的注意","得嘞！这就来，马上给您整上！","点了吗，关注了吗，谢谢老铁","那不必须得点吗？咱俩sei跟sei啊~"]
        title = titles[random]
      }
      else if (getApp().config.brand == 'ONLY'){
        title = '确认过眼神，你就是对的人，快来为我助力吧！'
      }
      else if (getApp().config.brand == 'VEROMODA'){
        title = '送一份来自月球的礼物，你准备好了吗？'
      }
      else if (getApp().config.brand == 'SELECTED'){
        title = '考验感情的时刻到了，快来帮帮我'
      }
      let json = {
        userid : userid || '',
        picUrl : wxInfo.avatarUrl,
        nickName:  wxInfo.nickName,
        openid : openID,

        share_by : sharePams.employeeId || '',
        share_by_shop : sharePams.shopCode || '',
        
      }
      if(utmData && utmData.length){
        utmData.forEach(item => {
          if(item.key && item.key.startsWith('utm')){
            json[item.key] = item.value;
          }
        })
      }
      let path = `/activity/games/jumpGame/help/index${objToQuery(json)}`
      let imageUrl =  splitGameImg('share_img.png','jumpGame0501')
      console.log(`分享成功:${path}`)
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

  }
})