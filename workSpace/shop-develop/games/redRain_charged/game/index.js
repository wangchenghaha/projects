// pages/game/index.js
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/redRain_charged/`

import{gameOver} from '../../service/redRain_charged'
const daojishi_3 = `${imgPath}daojishi_3.png`
const daojishi_2 = `${imgPath}daojishi_2.png`
const daojishi_1 = `${imgPath}daojishi_1.png`
const rains = [{
  img : `${imgPath}rain_1.png`,
  type : 1
},{
  img : `${imgPath}rain_4.png`,
  type : 1
},{
  img : `${imgPath}rain_3.png`,
  type : 0
}]
// 手势相关
let startX = 0
let endX = 0
// 图片尺寸
const renwuW_rpx = 202
const renwuH_rpx = 226
const rainW_rpx = 134
const rainH_rpx = 139
// 倒计时
const downNum = 15
// 游戏结束弹框图片
const endGame1 = `${imgPath}endGame1.png`
const endGame2 = `${imgPath}endGame2.png`

// 系统高度(px)
const systemH = wx.getSystemInfoSync().windowHeight
// 系统宽度(px)
const systemW = wx.getSystemInfoSync().windowWidth
// 用户信息
let userData = {}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 是否是第一次玩
    isFirst : false,
    gameBgImg : `${imgPath}gameBg.png`,
    gameWutaiImg : `${imgPath}gameWutai.png`,
    gameRenwuImg : `${imgPath}gameRenwu.png`,
    yindaoImg : `${imgPath}yindao.gif?${new Date().getTime()}`,
    downTimeImg : `${imgPath}daojishi.png`,
    downLoadNumImg : `${imgPath}downLoadImage.png`,
    backImg : `${imgPath}back.png`,
    zhadanImg : `${imgPath}numQiu.png`,
    endGameImg : endGame1,
    rainImgs:[],
    downTimeJson : {
      img : '',
      animate : '',
      type : 0
    },
    // 开始游戏
    startGame : false,
    // 降落y轴位置
    downY : 0,
    // 人物X
    renwuX : 0,
    // 游戏开始/暂停
    animationPlayState : 'running',
    // 获得的分数(+1或-1)
    num : '',
    numAnimate : '',
    // 倒计时
    downLoadNum : downNum,
    // 游戏次数
    canGameNum : -1,
    // 结束弹框
    showEndGame : false,
    showEndGame1 : true,
    // 单局游戏分数
    totalNum : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userData = JSON.parse(options.userData)

    const a = parseInt(options.isFirst)

    let renwuX = this.data.renwuX
    renwuX = (systemW - this.px(renwuW_rpx)) / 2
    this.setData({renwuX,canGameNum : userData.gameCount,isFirst : a === 1 ? true : false})
    endX = renwuX

    if (!this.data.isFirst){
      this.yindaoTap()
    }

  },
  yindaoTap(){
    let downTimeJson = this.data.downTimeJson
    if (downTimeJson.type === 0){
      downTimeJson.img = daojishi_3
      downTimeJson.type = 3
    } else if (downTimeJson.type === 3){
      downTimeJson.img = daojishi_2
      downTimeJson.type = 2
    } else if (downTimeJson.type === 2){
      downTimeJson.img = daojishi_1
      downTimeJson.type = 1
    }
    this.setData({
      isFirst : false,
      downTimeJson
    })
  },
  downNumImgLoad(){
    let downTimeJson = this.data.downTimeJson

    downTimeJson.animate = downTimeJson.animate === '' ? 'downAnimate' : downTimeJson.animate === 'downAnimate' ? 'downAnimate1' : 'downAnimate'
    this.setData({
      downTimeJson
    })
  },
  animateEnd(){
    // console.log(`动画结束`)
    if (this.data.downTimeJson.type === 1){
      let downTimeJson = this.data.downTimeJson
      downTimeJson.type = 0
      this.setData({downTimeJson})
      this.onLoadJson()
    } else{
      this.yindaoTap()
    }
  },
  animateEnd_rain(e){
    const id = e.currentTarget.id
    this.reloadJson(id)
  },
  onLoadJson(){
    let rainImgs = this.data.rainImgs
    rainImgs = []
    let canGameNum = this.data.canGameNum
    for (let i=0;i<10;i++){
      let json = JSON.parse(JSON.stringify(rains[Math.floor(Math.random() * rains.length + 0)]))
      json.speed = Math.random() * 4+2
      json.delay = Math.random() * 2 + 0
      json.x = Math.random() * (this.rpx(systemW) - rainW_rpx - 10) + 10
      json.y = Math.random() * -159 + -rainH_rpx
      json.animate = 'rainAnimate'
      json.tap = false
      rainImgs.push(json)
    }
    canGameNum -= 1
    this.setData({canGameNum,rainImgs,downY : systemH + this.px(rainH_rpx),startGame : true})

    this.check()
    this.downLoad()

  },
  reloadJson(id){
    let rainImgs = this.data.rainImgs
    let json = rainImgs[id]
    json.speed = Math.random() * 4+2
    json.delay = Math.random() * 2 + 0
    json.x = Math.random() * (this.rpx(systemW) - rainW_rpx - 10) + 10
    json.y = Math.random() * -159 + -rainH_rpx
    json.animate = json.animate === 'rainAnimate' ? 'rainAnimate1' : 'rainAnimate'
    json.tap = false
    rainImgs.splice(id,1,json)
    this.setData({rainImgs})

  },

  touchstart(e){
    startX = e.touches[0].clientX

  },
  touchmove(e){
      const xx = e.touches[0].clientX
      let tempX = 0
      if (xx > startX){
          tempX = xx - startX + endX
      } else{
          tempX = this.data.renwuX - (startX - xx) - this.data.renwuX + endX
      }
      if (tempX < 0){
          return
      } else if (tempX + this.px(renwuW_rpx) > systemW){
          return
      }
      this.setData({
        renwuX : tempX
      })

  },
  touchend(e){
      endX = this.data.renwuX
  },
  // 检测
  check(){
    let _this = this
    const renwuTop = systemH - this.px(75) - this.px(renwuH_rpx) + this.px(120)
    const renwuBottom = systemH - this.px(75)
    this.interval = setInterval(() => {
      const query = wx.createSelectorQuery()
      query.selectAll('.rain').boundingClientRect()
      query.exec(function(res){
        res[0].forEach((e,i) => {
          if (e.bottom > renwuTop && e.top < renwuBottom){
            if (e.left + e.width > _this.data.renwuX + 40 && e.left < _this.data.renwuX + _this.px(renwuW_rpx) - 20){
              let rainImgs = _this.data.rainImgs
              let totalNum = _this.data.totalNum
              const json = rainImgs[i]
              if (json.tap === true || _this.data.animationPlayState === 'paused'){
                return
              } else {
                json.tap = true
                _this.setData({rainImgs})
              }
              let tempNumStr = '+1'

              if (json.type === 0){
                tempNumStr = '-1'
                totalNum -= 1
                if (totalNum < 0){
                  totalNum = 0
                }
              } else{
                totalNum += 1
              }
              // 最多50分 不能再多了
              if (totalNum > 50){
                totalNum = 50
              }

              let numAnimate = _this.data.numAnimate
              numAnimate = numAnimate === '' ? 'numAnimate1' : numAnimate === 'numAnimate1' ? 'numAnimate' : 'numAnimate1'
              _this.setData({
                num : tempNumStr,
                numAnimate,
                totalNum
              })
              _this.reloadJson(i)

            }
          }
        })
      })
      
    }, 10);
  },
  px(rpx){

    return rpx / 750 * wx.getSystemInfoSync().windowWidth;
  },
  rpx(px){
    return px * 750 / wx.getSystemInfoSync().windowWidth;

  },
  downLoad(){
    let _this = this
    this.downLoadInterval = setInterval(() => {
      let downLoadNum = _this.data.downLoadNum
      downLoadNum -= 1
      if (downLoadNum <= 0){
        downLoadNum = 0
        clearInterval(_this.downLoadInterval)
        clearInterval(_this.interval)

        _this.setData({
          downLoadNum,
          animationPlayState : 'paused',
        })
        _this._gameOver()
      } else{
        _this.setData({
          downLoadNum
        })
      }
      // console.log(downLoadNum)
      
    }, 1000);
  },
  agin(){
    if (this.data.canGameNum > 0){
      this.setData({
        showEndGame : false,
        downLoadNum : downNum,
        animationPlayState : 'running',
        totalNum : 0,
        startGame : false
      })
      this.yindaoTap()

    } else {
      this.setData({
        endGameImg : endGame2,
        showEndGame1 : false
      })
    }
  },
  _gameOver(){
    gameOver({fuel : this.data.totalNum,userId:userData.id}).then(e => {
      this.setData({
        showEndGame : true
      })
    })
  },
  back(){
    wx.navigateBack({
      delta: 1
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
    clearInterval(this.downLoadInterval)
    clearInterval(this.interval)

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

  }
})