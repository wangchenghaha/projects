//Page Object

import {renwuAction} from '../renwu'
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/redRain_charged/`

import {EVENTS, KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events"

import{getGameConfig,searchUserInfo,createUserInfo,myPrize,getTaskList,getSureTaskList,finishTask,charged} from '../../service/redRain_charged'
// 底图高度
let bgImgHeight = 0
// topTitle文字
const topTitles = ['还不给我充能？人家好饿哦~','再不充能，我要生气啦！','我快睡着了，给我充充能吧！','小主，快来给我充能吧！']
let topTitleNum = 0
// 是否开启了大奖
let haveBigPrize = false
// 游戏开始/结束日期
let startTime = 0
let endTime = 0
// 用户信息
let userData = {}
// 是否是首次注册
let isFirst = 0

// 控制充能点击按钮
let canTap = true
// 每次点击的充能数
const chargedNum = 20
Page({
  data: {
    homeBgImg : `${imgPath}homeBg1.jpg`,
    renwuImg : `${imgPath}renwu.png`,
    homeBgBottomImg : `${imgPath}homeBg_bottom.png`,
    processBgImg : `${imgPath}processBg.png`,
    numQiuImg : `${imgPath}numQiu.png`,
    guizeImg : `${imgPath}guize.png`,
    backImg : `${imgPath}back.png`,
    playImg : `${imgPath}play_none.png`,
    jumpAnimate : '',
    renwuJson : {
      b:0,
      l:0,
      tob:0,
      tol:0,
      type:'r'
    },

    // 当前能量
    currentTaijie : 0,
    // 总能量
    totalTaijie : 0,
    // 进度条
    processValue : 0, //最大85
    // 能量不足弹框
    showCharged : false,
    // 我的奖品
    showMyPrize : false,
    // 更多燃料
    showMore : false,
    // 大奖
    showBigPrize : false,
    // 定时 每20秒弹出对话框 展示5秒
    topTitleJson : {
      title:'',
      animate : ''
    }


  },
  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
      if (type == EVENTS.EVENT_GAMECRMINFO && event) {
          //  获取手机号成功
            if (startTime === 0){
              this.getDatas()
            }
      } 
  },
  //options(Object)
  onLoad: function(options){
    wx.hideShareMenu();
    canTap = true
    userData = {}
    isFirst = 0
    bgImgHeight = 0
    topTitleNum = 0
    startTime = 0
    endTime = 0
    haveBigPrize = false
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
  },
  _setTopTitles(){
    if (haveBigPrize){
      return
    }
    let _this = this
    this.interval = setInterval(() => {
      topTitleNum += 1
      if ( topTitleNum % 20 === 0 && Math.random() >= 0.5){
        let topTitleJson = _this.data.topTitleJson
        const random = Math.floor(Math.random() * topTitles.length + 0)
        topTitleJson.title = topTitles[random]
        topTitleJson.animate = 'topTitleAnimate'
        _this.setData({
          topTitleJson
        })
        clearInterval(_this.interval)
        topTitleNum = 0
      }
      
    }, 1000);
  },
  topTitleAnimateEnd(){
    if (this.data.topTitleJson.animate === 'topTitleAnimate'){
      let _this = this
      this.interval1 = setInterval(() => {
        topTitleNum += 1
        if (topTitleNum >= 5){
          let topTitleJson = _this.data.topTitleJson
          topTitleJson.animate = 'topTitleAnimate1'
          _this.setData({
            topTitleJson
          })
          clearInterval(_this.interval1)
          topTitleNum = 0
          _this._setTopTitles()
        }
        
      }, 1000);
    }
  },
  bgLoad(e){
    bgImgHeight = e.detail.height

    renwuAction.setTaijie(this,bgImgHeight)
  },
  playTapEnd(){
    this.setData({
      playImg : `${imgPath}play_none.png`
    })
  },
  playTap(){
    if (!renwuAction.checkGameTime(startTime,endTime)){
      return
    }
    if (this.data.jumpAnimate !== '' || !canTap){
      return
    } 
    if (this.data.currentTaijie <= chargedNum || haveBigPrize){
      this.setData({
        showCharged : true
      })
      if (haveBigPrize){
        this.selectComponent('#noCharged').setImg()
      }
      return
    }
    canTap = false
    charged({fuel : chargedNum,userId : userData.id}).then(e => {
      userData = e.data.user
      this.makeData(1)
      canTap = true

      let gift = e.data.gift
      if (gift && Object.keys(gift).length > 0){
        this.setData({
          showBigPrize : true
        })
        let imgType = 0
        if (userData.energy >= 200 && userData.energy < 300){
          imgType = 3
        } else if (userData.energy >= 500 && userData.energy < 600){
          imgType = 6
        } else if (userData.energy >= 900 && userData.energy < 1000){
          imgType = 10
        } else if (userData.energy >= 1200 && userData.energy < 1300){
          imgType = 13
        } else{
          imgType = 0
        }
        this.selectComponent('#bigPrize').setImgs(gift.giftPic,imgType)
      }

    }).catch(() => {
      canTap = true
    })


  },
  taps(e){
    // console.log(e.currentTarget.id)
    const type = e.currentTarget.id
    if (type === '1'){
      this.getYHQ()
    } else {
      this.getTask()
    }
  },
  renwuAnimateEnd(){
    // console.log(`人物动画结束:${JSON.stringify(this.data.renwuJson)}`)
    
  },
  noChargedclosed(){
    this.closed()
    if (haveBigPrize){
      getApp().goBack()
      return
    }
    this.getTask()
  },
  guize(){
    wx.navigateTo({
      url: '../guize/index'
    });
  },
  goFinish(e){
    if (!renwuAction.checkGameTime(startTime,endTime)){
      return
    }
    // console.log(JSON.stringify(e))
    if (e.detail.taskCode === 'game'){
      this.selectComponent('#renwu').closed()
      
      wx.navigateTo({
        url: '/games/redRain_charged/game/index?userData='+JSON.stringify(userData)+'&isFirst='+isFirst
      });
    } else if (e.detail.taskCode === 'checkin'){
      finishTask({taskId : e.detail.id,userId : userData.id}).then(e => {
        this.getDatas()
        this.getTask()
      })
    } else if (e.detail.taskCode === 'visit_page'){
      getApp().navigateTo(e.detail.taskUrl)

      finishTask({taskId : e.detail.id,userId : userData.id}).then(e => {
        this.getDatas()
        this.getTask()
      })
    }
  },
  closed(){
    this.setData({
      showCharged : false,
      showMyPrize : false,
      showMore : false,
      showBigPrize : false
    })
  },
  // 我的优惠券
  getYHQ(){
    myPrize({userId:userData.id}).then(e => {
      this.setData({
        showMyPrize : true
      })
      this.selectComponent('#myPrize').setImgs(e.data)
    })

  },
  getTask(){

    getTaskList().then(e => {
      getSureTaskList({userId : userData.id}).then(res => {

        e.data.forEach(item => {
          if (res.data && res.data.length > 0){
            const isOK = res.data.findIndex(ress => {
              return ress.taskId === item.id
            })
            item.isOK = isOK
          } else {
            item.isOK = -1
          }
          if (item.taskCode === 'game' && userData.gameCount <= 0){
            item.isOK = true
          }
          switch (item.taskCode) {
            case 'checkin':
              item.subTitle = '签到完成奖励'+item.rewardFuel+'燃料'
              break;
  
            case 'game':
              item.subTitle = '玩游戏可以赚取特定奖励能量'
              break;
            case 'visit_page':
              item.subTitle = '浏览专区页奖励'+item.rewardFuel+'燃料'
              break;
            case 'help':
              item.subTitle = '每邀请成功一个好友获得'+item.rewardFuel+'燃料'
              break;
          
            default:
              break;
          }
        })
        this.setData({
          showMore : true
        })
        this.selectComponent('#renwu').setImgs(e.data)
        
      })
    })

  },
  getDatas(){
    // 用户信息
    if (startTime === 0){
      getGameConfig().then(e => {
          startTime = new Date(e.data.activityStartTime.replace(/-/g, '/')).getTime()
          endTime = new Date(e.data.activityEndTime.replace(/-/g, '/')).getTime()
      })
    }
    let openID = wx.getStorageSync('wxOpenID');
    searchUserInfo({openid : openID}).then(e => {
      
        if (!e.data) {
          isFirst = 1
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
              crmRegTime: userInfo.joindate
          }
          
          createUserInfo(json).then(e => {
            userData = e.data
            this.makeData(0)
          })

      } else {
        userData = e.data
        this.makeData(0)
      }
    })
  },
  makeData(type){
    let homeBgImg = this.data.homeBgImg
    if (userData.gameStatus === 1){
      homeBgImg = `${imgPath}homeBg2.jpg`
    }
    haveBigPrize = userData.gameStatus === 1
    this.setData({
      currentTaijie : userData['fuel'],
      totalTaijie : userData['energy'],
      homeBgImg
    })
    if ((!haveBigPrize && this.interval)){
      this._setTopTitles()
    }
    if (type === 0){
      renwuAction.setTaijie(this,bgImgHeight)

    } else{

      this.setData({
        playImg : `${imgPath}play_down.png`
      })

      renwuAction.setJindu(this,bgImgHeight)
      setTimeout(() => {
        this.playTapEnd()
      }, 100);
    }


  },
  back(){
    wx.navigateBack({
      delta: 1
    })
  },
  onReady: function(){
    
  },
  onShow: function(){
    wx.showLoading({
        title: '加载中……',
        mask: true
      });
      setTimeout(() => {
        wx.hideLoading();
        if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
          getApp().navigateTo('member/login/login?game=true')
          return;
        }
        else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
            this.getDatas()
        }
       
      }, 1000);
    
  },
  onHide: function(){

  },
  onUnload: function(){
    clearInterval(this.interval)
    clearInterval(this.interval1)

  },
  onPullDownRefresh: function(){

  },
  onReachBottom: function(){

  },
  onShareAppMessage: function(){
    this.selectComponent('#renwu').closed()
    let json = {
      userid: userData.id || ''
    }
    const totalJson = Object.assign({},json)

    
    let title = ''
    let titleArr = ['江湖救急，快来助我一臂之力！']
   
    let random = Math.floor(Math.random() * titleArr.length)
    title = titleArr[random]

    let path = `/games/redRain_charged/help/index?params=${JSON.stringify(totalJson)}`
    let imageUrl = `${imgPath}shareImg.jpeg`
    console.log(`分享成功:${path}`)
    return {
      title: title,
      path: path,
      imageUrl: imageUrl
    }

  },
  onPageScroll: function(){

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item){

  }
});