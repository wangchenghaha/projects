// activity//courierGame/game/game.js
import {startGame,endGame} from "../../service/courierNet"
import{gameConfigs} from '../gameConfigs'
import {KEYSTORAGE} from '../../../src/const'

const brand = getApp().config.brand
// 图片地址
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/courierImgs/`
const version = Date.now();
var splashImgList = [

  {
    scale: 5622,
    img: `${imgPath}game750.jpg?v=${version}`, // 375/667 iphone 7
  },
  {
    scale: 4618,
    img: `${imgPath}game1125.jpg?v=${version}`,  // 375/812 iphoneX
  }

];
let gameImgs_select = []
const selectImg = ['jiang0.png','jiang1.png','jiang2.png','jiang3.png','jiang4.png','jiang5.png']
const gameImgs = ['hezi0.png','hezi1.png','hezi2.png','hezi3.png','hezi4.png','hezi0.png','hezi1.png','hezi2.png','hezi3.png','hezi4.png']
const bgMusic = `${imgPath}hbyyinxiao.mp3`

var gameCount = 0 //控制游戏次数
var gameid = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    imgPath,
    splashImg: '',
    backImg : `${imgPath}sanjiao-left.png?v=${version}`,

    userData : {},



    downNum : 4,
    downImg : '',
    downTopImg : '',
    jindubiaoImg : '',
    jinduBgImg : '',
    jinduImg : '',

    downAnimate : '',
    canNotPlay : '',
    bouncedBtn : '',
    canPlay : '',

    endGame : false,
    canNotGame : false,
    endGameText : [],

    // 次数0文案
    canNotPlayText : []

  },

  ziyuan(){

    let downTopImg = this.data.downTopImg
    let jindubiaoImg = this.data.jindubiaoImg
    let jinduBgImg = this.data.jinduBgImg
    let jinduImg = this.data.jinduImg
    downTopImg = `${imgPath}downImg.png?v=${version}`
    jindubiaoImg = `${imgPath}jindubiao.png?v=${version}`
    jinduBgImg = `${imgPath}jindubg.png?v=${version}`
    jinduImg = `${imgPath}jindu.png?v=${version}`

    let canNotPlay = this.data.canNotPlay
    let canPlay = this.data.canPlay
    let bouncedBtn = this.data.bouncedBtn
    canNotPlay = `${imgPath}canNotPlay.png?v=${version}`
    canPlay = `${imgPath}canPlay.png?v=${version}`
    bouncedBtn = `${imgPath}bouncedBtn.png?v=${version}`

    this.setData({
      downTopImg,
      jindubiaoImg,
      jinduBgImg,
      jinduImg,
      canNotPlay,
      canPlay,
      bouncedBtn
    })
  },
  getSystemInfo: function(){

    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let splashImg = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100 && splashImg == ''){
          splashImg = item.img
        }
      });
      if(splashImg){
        this.setData({
          splashImg: `${splashImg}`
        })
        console.log(this.data.splashImg,'***init');
      }
      else{
        this.setData({
          splashImg: `${splashImgList[1].img}`
        })
        console.log(this.data.splashImg,'***init00000');
      }
    }catch (e) {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    let userData = this.data.userData
    userData = wx.getStorageSync('courierData');
    wx.removeStorageSync('courierData');
    this.setData({
      userData
    })
    gameCount = this.data.userData.gameCount


    this.getSystemInfo();
    this.ziyuan()

    this._startGame();

  },
  down(){

    let _this = this


    // 先下载点击随机出现的图片
    if (gameImgs_select.length != selectImg.length){
      wx.showLoading({
        title: '初始化……'
      });

      selectImg.forEach(item => {
        
        wx.getImageInfo({
          src: `${imgPath}${item}`,
          success (res) {
            gameImgs_select.push(res.path)
            if (gameImgs_select.length == selectImg.length){
              wx.hideLoading();
              _this.down()
            }
          }
        })

      });
      return
    }
    if (!this.innerAudioContext){
      
      this.startVedio(bgMusic)
    }

    
    let downNum = this.data.downNum
    let downImg = this.data.downImg
    let downAnimate = this.data.downAnimate

    downNum = 4
    downImg = ''
    downAnimate = 'downAnimate'

    
    this.timerout = setTimeout(() => {
      clearTimeout(_this.timerout)
      _this.chushihua()
    }, 3500);

    this.interval = setInterval(() => {
      if (downNum == 0){
        clearInterval(_this.interval)
      }
      else{
        downAnimate = downAnimate == 'downAnimate' ? 'downAnimate1' : 'downAnimate'
        downNum -= 1
        downImg = downNum == 3 ? `${imgPath}3.png?v=${version}` : downNum == 2 ? `${imgPath}2.png?v=${version}` : `${imgPath}1.png?v=${version}`

        _this.setData({
          downNum,
          downImg,
          downAnimate
        })
      }
    }, 1000);
  },
  chushihua(){

    if (this.gameConfig){
      this.gameConfig.agin()
      return
    }
    let _this = this
    this.gameConfig = new gameConfigs(this,{
      gameImgs_select,
      gameImgs,
      callback : (e) => {
        _this._endGame(e)
      }
    })
  },
  makeEndGameParams(e){
    if (gameCount <= 0){

      let canNotPlayText = this.data.canNotPlayText
      canNotPlayText = ['您今天的拆快递次数已用完',`本局获得${e}金币`,'邀请好友助力,再拆1次！']

      this.setData({
        canNotGame : true,
        canNotPlayText
      })

    }
    else{
      let endGameText = this.data.endGameText
      
      let arrs = [`获得${e}金币`,'一时拆一时爽,一直拆一直爽!']
      let arrs1 = ['拆快递的你仿佛拥有洪荒之力!',`获得${e}金币`]
      let a = [arrs,arrs1]
      let index = Math.floor(Math.random() * a.length + 0)
      endGameText = a[index]

      this.setData({
        endGame : true,
        endGameText
      })
    }
  },
  closed(){
    this.setData({
      endGame : false,
      canNotGame : false
    })
    wx.navigateBack({
      delta: 1
    });
  },
  startVedio(path){
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = path
    this.innerAudioContext.loop = true
    this.innerAudioContext.autoplay = true
  },
  // 开始游戏
  _startGame(){
    gameCount -= 1
    this.setData({
      endGame : false,
      canNotGame : false
    })
     
      startGame({userid : this.data.userData.id}).then(res => {
          gameid = res.id
          this.down()
      })
       
  },
  // 结束游戏
  _endGame(e){
    console.log(`游戏结束:${JSON.stringify(e)}`)

      endGame({getPoints : e,userid : this.data.userData.id,gameid:gameid}).then(res => {
        this.makeEndGameParams(e)
    })
  },
  backTap(){
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

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
    if (this.timerout){
      clearTimeout(this.timerout)
    }
    if (this.interval){
      clearInterval(this.interval)
    }
    
    if (this.gameConfig){
      this.gameConfig.dealloc()
      this.gameConfig = ''
    }
    if (this.innerAudioContext){
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
        utm_medium : 'game_courier',
        utm_term : '',
        utm_campaign : ''
      }
      let title = ''

        
      let titleArr = ['快来和我一起体验拆快递的快乐~','江湖告急！我的家被快递淹没了！']
      let random = Math.floor(Math.random() * titleArr.length + 0)
      title = titleArr[random]

      let path = `/activity/courierGame/help/help?params=${JSON.stringify(json)}`
      let imageUrl = `${imgPath}shareImg.png`
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