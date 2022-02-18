// pages/christmasGame/welcome/welcome.js
import {IMG} from '../gameParams'
import {gameConfig} from '../gameConfig'
import {startGame,endGame} from "../../service/christmasNet"
import {KEYSTORAGE} from '../../../src/const'

const brand = getApp().config.brand
var firstImgJson = {}
var topHeight = 0
var gameid = 0
let innerAudioContext;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    IMG,
    topHeight,
    transY : 0,
    gameCount : 0,
    showBounced : false,
    bouncedText : [],
    daojishiJson : {
      show : false,
      num : 3,
      numImg : IMG.img3
    },
    firstGame : false,
    firstImg : {
      index : 0,
      img : ''
    },
    userData : {}
  },


  getSystemInfo: function(){
    
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;

      const scale = Math.floor((windowWidth/windowHeight * 10000));

      let arrs = Object.keys(firstImgJson)
      let bol = false

      IMG.fristImgs.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100 && arrs.length <= 0){
          firstImgJson = item
          bol = true,
          topHeight = item.topHeight
        }
      });

      if(!bol){
        firstImgJson = IMG.fristImgs[1],
        topHeight = IMG.fristImgs[1].topHeight
      }
      let firstImg = this.data.firstImg
      firstImg.index = 0
      firstImg.img = firstImgJson.img1

      let transY = this.data.transY


      let a = topHeight / 750 * windowWidth;

      let gameArea = windowHeight - a

      transY = -gameArea * 750 / windowWidth
      this.setData({
        firstImg,
        topHeight : topHeight,
        transY
      })


    }catch (e) {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    topHeight = 0
    firstImgJson = {}
    gameid = 0


    let userData = this.data.userData
    userData = wx.getStorageSync('maristmasData');
    wx.removeStorageSync('maristmasData');
    this.setData({
      userData,
      gameCount : userData.gameCount
    })
    
    this.getSystemInfo()

    let _this = this
    this.gameConfig = new gameConfig(this,{
      imgs : IMG,
      topHeight,
      callback : ( res => {
        _this._endGame(res)
      })
    })
    this.playMuisc()
    this._startGame()
  },
  firstBtn(){
    
    let firstImg = this.data.firstImg
    if (firstImg.index == 0){
      firstImg.index = 1
      firstImg.img = firstImgJson.img2
      this.setData({
        firstImg
      })
    }
    else{
      wx.setStorageSync('maristmasFirstGame', true);
      this.setData({
        firstGame : false
      })
      this.daojishi()
    }
  },
  daojishi(){

    startGame({userid : this.data.userData.id}).then(res => {
      gameid = res.id


        let daojishiJson = this.data.daojishiJson
        daojishiJson.show = true
        this.setData({daojishiJson})

        this.daojishiInterval = setInterval(() => {
          if (daojishiJson.num == 0){
            clearInterval(this.daojishiInterval)
            this.closed()
            this.gameConfig.reload()
          }
          else{
            daojishiJson.num -= 1
            daojishiJson.numImg = daojishiJson.num == 2 ? IMG.img2 : IMG.img1
            this.setData({daojishiJson})
          }
        }, 1000);
    })
  },
  
  _startGame(){
    this.closed()
  
    let daojishiJson = this.data.daojishiJson
    daojishiJson.num = 3
    daojishiJson.numImg = IMG.img3

    // 请求数据后执行下面
    let gameCount = this.data.gameCount
    gameCount -= 1
    this.setData({gameCount,daojishiJson})


    let bol = wx.getStorageSync('maristmasFirstGame');
    if (!bol){
      this.setData({
        firstGame : true
      })
    }
    else{
      this.daojishi()
    }
    
  },
  _endGame(res){
    console.log(`结束`)

    endGame({getPoints : res.totalNum,userid : this.data.userData.id,gameid:gameid}).then(item => {


      let bouncedText = this.data.bouncedText
      if(brand === 'FOL'){
        if (this.data.gameCount > 0){
          bouncedText = [`很厉害哦，获得${res.totalNum}金币`,`再接再厉，宝物就在前方！`,""]
        }
        else{
          bouncedText = [`您今天的游戏次数已用完`,`本局获得${res.totalNum}金币`,'邀请好友助力，再玩一次！']
        }
      } else {
        if (this.data.gameCount > 0){
          bouncedText = [`WOW！ 给你点赞，太厉害了！`,`获得${res.totalNum}金币`,""]
        }
        else{
          bouncedText = [`您今天的游戏次数已用完`,`本局获得${res.totalNum}金币`,'邀请好友助力，再玩一次！']
        }
      }
      
      this.setData({
        showBounced : true,
        bouncedText
      })

    })

  },
  closed(){
    let daojishiJson = this.data.daojishiJson
    daojishiJson.show = false
    this.setData({
      showBounced : false,
      daojishiJson,
      firstGame : false
    })
  },
  bouncedClosed(){
    this.closed()
    wx.navigateBack({
      delta: 1
    });
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
    if (this.interval){
      clearInterval(this.interval)
    }
    innerAudioContext.destroy();
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

  onShareAppMessage: function(){

    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    var openID = wx.getStorageSync('wxOpenID');
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
      let json = {
        userid : this.data.userData.id || '',
        picUrl : wxInfo.avatarUrl || '',
        nickName : wxInfo.nickName || '',
        openid : openID,

        share_by : sharePams.employeeId || '',
        share_by_shop : sharePams.shopCode || '',
        
        utm_source : 'game',
        utm_medium : 'game_christmas',
        utm_term : '',
        utm_campaign : ''
      }
      let title = ''

      let titleArr = ['@所有人，圣诞老人给大家发奖品啦，看看谁能夺大奖','迎双旦，绫致携圣诞老人给你送大礼啦']
      let random = Math.floor(Math.random() * titleArr.length + 0)
      title = titleArr[random]

      let path = `/activity/christmasGame/help/help?params=${JSON.stringify(json)}`
      let imageUrl = IMG.shareImg
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
  },

  playMuisc(){
    let musicUrl = "https://cdn.bestseller.com.cn/assets/common/SELECTED/christmas/christmas_bgm.mp3"
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