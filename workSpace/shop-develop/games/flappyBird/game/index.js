// pages/game/index.js
import {gameMain} from '../gameMain'
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/birdGame/`
import {endGame} from '../netWork'
import {KEYSTORAGE} from '../../../src/const'
const app = getApp();
// utm参数
let utmParams = {}
// 控制 游戏结束只处理一次
let endGameStatus = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startGameImg : `${imgPath}/startGame.png`,
    gameOverImg : `${imgPath}/gameOver.png`,
    xingxingImg : `${imgPath}/xingxing.png`,
    isStart : false,  //展示开始游戏图层
    isEnd : false,  //展示结束游戏图层
    canvasImg : ``,
    // 是否可以点击游戏
    canPlay : false,

    userData:{},
    num : 0,
    birdNum : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    endGameStatus = false
    let userData = this.data.userData
    userData = wx.getStorageSync('flappyGame');
    this.setData({userData})
    utmParams = wx.getStorageSync('flappyGameUTM');

    wx.removeStorageSync('flappyGame');
    wx.removeStorageSync('flappyGameUTM');
    

    wx.showLoading({
      title: '资源加载中……',
      mask: true
    });
    this.gameMain = new gameMain(this,{
      cvs:`gameCanvas`,
      brand : app.config.brand
    },imgPath,() => {
      wx.hideLoading();
      const url = this.gameMain.getCanvasImage()

        this.setData({
          isStart : true,
          canvasImg : url
        })

    })
  },
  startGame(){
    this.setData({
      canPlay : true,
      isStart : false,
      isEnd : false
    })

    wx.showLoading({
      title: '资源加载中……',
      mask: true
    });
    this.gameMain = new gameMain(this,{
      cvs:`gameCanvas`,
      brand : app.config.brand
    },imgPath,() => {
      wx.hideLoading();
      this.click()
    },(num,birdNum) => {
      num = Math.ceil(num / 15) * 100
      this._endGame(num,birdNum)
    })
  },
  playAgin(){
    endGameStatus = false
    this.setData({
      isEnd:false,
      isStart:true
    })
  },
  closed(){
    wx.navigateBack({
      delta: 1
    });
  },
  click(){
    if (this.data.canPlay){
      this.gameMain.click()
    }
  },
  _endGame(num,birdNum){
    if (endGameStatus){
      return
    }
    endGameStatus = true

    let userData = this.data.userData
    let gameOverImg = this.data.gameOverImg
    endGame({points:num,birds : birdNum,userId:userData.id}).then(e => {
      userData.gameCount -= 1
      if (userData.gameCount <= 0){
        gameOverImg = `${imgPath}/endGame.png`
      }

      const url = this.gameMain.getCanvasImage()

        this.setData({
          userData,
          num,
          birdNum,
          gameOverImg,
          canPlay : false,
          isEnd : true,
          canvasImg : url
        })

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

    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let json = {
      userid: this.data.userData.id || '',

      share_by: sharePams.employeeId || '',
      share_by_shop: sharePams.shopCode || ''
    }
    const totalJson = Object.assign(json,utmParams)

    let title = ''
    let titleArr = ['今日次数已用光，不要气馁，明天再来！','我飞不动了，邀请好友来帮我加油打气吧！']
   
    let random = Math.floor(Math.random() * titleArr.length)
    title = titleArr[random]

    let path = `/games/flappyBird/help/index?params=${JSON.stringify(totalJson)}`
    let imageUrl = `${imgPath}shareImg.jpeg`
    console.log(`分享成功:${path}`)
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    }
  }
})