//Page Object
import {tiggers} from '../tiggers'
import {choujiang,searchUser,paihangbang,getActivityTime,duijiangjilu} from '../netWorking'
import {KEYSTORAGE} from '../../../src/const'

// ************************************
const brand = getApp().config.brand;
// 最低注数
const lowNum = brand == 'FOL' ? 2000 : 200;
// 最大注数
const maxNum = brand == 'FOL' ? 10000 : 600;
// 每次加减注数
const centerNum = brand == 'FOL' ? 2000 : 100;
// 动画音效
const startVideo = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/tigger/start.mp3`
// 中奖音效
const zhongjiangVideo = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/tigger/zhongjiang.mp3`

const animationHeight = brand == 'FOL' ? 120 : 100
Page({
  data: {
    brand,
    // 用户信息
    userData : '',
    // 当前注数
    number : lowNum,
    // 我的筹码
    myNumber : 0,
    // 动画开始时显示遮罩
    canShow : false,
    // 滚动框的高度 px单位
    animationViewHeightPX : animationHeight / 750 * wx.getSystemInfoSync().windowWidth,
    // 活动时间
    activityTimeJson : {},
    // 滚动数组
    colors : [
      ['22.png','44.png','88.png','1616.png','44.png','22.png','44.png','88.png','1616.png','44.png','22.png'],
      ['88.png','22.png','44.png','1616.png','22.png','88.png','22.png','44.png','88.png','1616.png','88.png'],
      ['1616.png','88.png','44.png','22.png','88.png','1616.png','88.png','44.png','22.png','44.png','1616.png']
    ],
    // 弹框（获奖 邀请好友）
    bouncedStatues : {
      canShow : false,
      // 筹码不足
      isCancel : false,
      // 滚动中奖
      isMoneyWin : false,
      // 未中奖
      isNoWin : false,
      // 排行榜
      isPaiHang : false,
      // 抽奖规则
      isChouJiang : false,
      // 赢取的筹码数
      winNum : 0,
      // 中奖倍数（obj）
      winObj : ''
    },
    // 我的奖品弹框
    myPrize : false,
    // 排行榜数据
    paihangData : [],
    // 兑奖记录数据
    jiluDatas : []
  },
  guize : function(){
    wx.setStorageSync("lhjGZ", "1");
    wx.navigateTo({
      url: '../guizeView/guizeView'
    });
  },
  goHome(){
    getApp().goBack();
  },
  // 查询->创建用户
  // 兑换奖品
  duihuan : function(){
    wx.navigateTo({
      url: '../ticketView/ticketView'
    });
  },
  // 邀请好友助力
  share : function(){
    if (!this.checkTimeOut()){
      this.replaceStatus()
      wx.navigateTo({
        url: '../shareView/shareView'
      });
    }
  },
  // 我的奖品弹框
  myPrize : function(){
    duijiangjilu(this.data.userData.id).then(e => {
      let jiluDatas = this.data.jiluDatas
      jiluDatas = [].concat(e)
      this.replaceStatus()
      this.setData({jiluDatas,myPrize : true})
    })
  },
  // 我的奖品弹框-关闭
  closed : function(){
    let bouncedStatues = this.data.bouncedStatues
    bouncedStatues.canShow = true
    bouncedStatues.isPaiHang = true
    this.setData({myPrize : false,bouncedStatues})
  },
  // 当前页处跳转页面其余的事件
  onClick : function(e){
    let type = e.detail

    let bouncedStatues = this.data.bouncedStatues
    let number = this.data.number
    switch (type) {
      case 'choujiang':
        // 抽奖规则
        bouncedStatues.canShow = true
        bouncedStatues.isChouJiang = true
        break;
      case 'paihangbang':
        // 排行榜
        this.paihang()
        break;
      case 'start':
        // 开始抽奖
        this.startTap()
        break;
      case '0':
        // 减
        if (number == lowNum) {
          wx.showToast({
            title: '最低' + lowNum + '筹码',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false
          });
          return
        }
        number -= centerNum
        break;
      case '1':
        // 加
        if (number + centerNum <= this.data.myNumber && number + centerNum <= maxNum){
          number += centerNum
        }
        else{
          let str = '筹码不足'
          if (number + centerNum > maxNum){
            str = '最大' + maxNum + '筹码'
          }
          wx.showToast({
            title: str,
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false
          });
        }
        break;
    
      default:
        break;
    }
    this.setData({bouncedStatues,number})
  },
  // 排行榜
  paihang : function(){
    let bouncedStatues = this.data.bouncedStatues
    let paihangData = this.data.paihangData
    let userData = this.data.userData
    paihangData = []
    paihangbang().then(e => {
      // console.log(`排行榜:${JSON.stringify(e)}`)
      bouncedStatues.canShow = true
      bouncedStatues.isPaiHang = true

      paihangData = e
      paihangData.splice(0,0,userData)
      // console.log(`排行榜:${JSON.stringify(paihangData)}`)
      

      if (paihangData.length > 11){
        paihangData.splice(11)
      }
      this.setData({bouncedStatues,paihangData})
    })
  },
  // 弹框按钮
  bouncedTap : function(){
    if (this.data.bouncedStatues.isCancel){
      // 邀请好友
      this.share()
    }
    this.replaceStatus()
  },
  // 还原弹框状态
  replaceStatus : function(){
    let bouncedStatues = this.data.bouncedStatues
    bouncedStatues.canShow  = false
    bouncedStatues.isCancel = false
    bouncedStatues.isMoneyWin = false
    bouncedStatues.isPaiHang = false
    bouncedStatues.isChouJiang = false
    bouncedStatues.isNoWin = false
    this.setData({bouncedStatues})
  },
  // 抽奖
  startTap : function(){
    if (!this.checkTimeOut()){

    let myNumber = this.data.myNumber
    let bouncedStatues = this.data.bouncedStatues
    let a1 = 0;let a2 = 0; let a3 = 0;

    if (myNumber >= this.data.number){

      let params = `stake=${this.data.number}&userid=${this.data.userData.id}`
      choujiang(params).then(e => {
          myNumber -= this.data.number

          let userData = this.data.userData
          userData = wx.getStorageSync('lhjUser');
          userData.points = myNumber
          wx.setStorageSync('lhjUser', userData);

          // console.log(`抽奖返回数据:${JSON.stringify(e)}`)
          bouncedStatues.winNum = parseInt(e.awardPoint)
          if (e.awardObj){
            bouncedStatues.winObj = e.awardObj
          }
    
          this.setData({canShow : true,bouncedStatues,myNumber,userData})
          if (e.awardPoint == 0){
            do {
              a1 = Math.floor((Math.random()*8)+1);
              a2 = Math.floor((Math.random()*8)+1);
              a3 = Math.floor((Math.random()*8)+1);
            }while((this.data.colors[0][a1] == this.data.colors[1][a2]) && (this.data.colors[1][a2] == this.data.colors[2][a3]))
          }
          else{
            if (this.data.brand == 'FOL'){
              if (e.awardObj.multiple == 2){
                a1 = 5
                a2 = 1
                a3 = 4
              }
              else if (e.awardObj.multiple == 4){
                a1 = 6
                a2 = 7
                a3 = 8
              }
              else if (e.awardObj.multiple == 6){
                a1 = 2
                a2 = 4
                a3 = 1
              }
              else if (e.awardObj.multiple == 8){
                a1 = 8
                a2 = 5
                a3 = 2
              }
              else if (e.awardObj.multiple == 16){
                a1 = 4
                a2 = 3
                a3 = 5
              }
            }
            else{
              if (e.awardObj.multiple == 1){
                a1 = 5
                a2 = 4
                a3 = 8
              }
              else if (e.awardObj.multiple == 2){
                a1 = 4
                a2 = 2
                a3 = 2
              }
              else if (e.awardObj.multiple == 3){
                a1 = 2
                a2 = 5
                a3 = 1
              }
              else if (e.awardObj.multiple == 4){
                a1 = 3
                a2 = 3
                a3 = 5
              }
            }
          }
          this.tigger.start(a1,a2,a3)
          this.startVedio(startVideo)
        }).catch(e => {
          setTimeout(() => {
            this.searCh()
          }, 1700);
        })
      }
      else{
        bouncedStatues.isCancel = true
        bouncedStatues.canShow = true
        this.setData({bouncedStatues})
      }
    }

  },
  // 检测是否是pad
  checkPad : function(){
    let animationViewHeightPX = this.data.animationViewHeightPX

    let bouncedStatues = this.data.bouncedStatues
    this.tigger = new tiggers(this,{
      height    : animationViewHeightPX,
      len      : this.data.colors[0].length,
      speed     : 24,
      callBack : () => {
        // console.log(`动画结束`)
          bouncedStatues.canShow = true
        if (bouncedStatues.winNum > 0){
          // console.log(`中奖了`)
          // 中奖了
          bouncedStatues.isMoneyWin = true
          this.searCh()
          this.startVedio(zhongjiangVideo)
        }
        else{
          // console.log(`没中奖`)
          // 没中奖
          bouncedStatues.isNoWin = true
        }
        this.setData({bouncedStatues,canShow : false})
      }
    });
    this.setData({
      animationViewHeightPX
    })
  },
  // 开始音频
  startVedio : function(path){
    // properties(Read only)(duration,currentTime,paused,buffered,volume)
    // properties(src,startTime,autoplay,loop,obeyMuteSwitch)
    var innerAudioContext = wx.createInnerAudioContext();
    innerAudioContext.src = path
    innerAudioContext.autoplay = true
  },
  //options(Object)
  onLoad: function(options) {
    if (this.data.brand == 'FOL'){
      let colors = this.data.colors
      colors = [
        ['2.png','4_tyg.png','6.png','8.png','16_tyg.png','2.png','4_tyg.png','6.png','8.png','16_tyg.png'],
        ['8.png','2.png','4_tyg.png','16_tyg.png','6.png','8.png','2.png','4_tyg.png','16_tyg.png','6.png'],
        ['16_tyg.png','6.png','8.png','4_tyg.png','2.png','16_tyg.png','6.png','8.png','4_tyg.png','2.png']
      ]
      this.setData({colors})
    }
    wx.hideShareMenu();

    
    let myNumber = this.data.myNumber
    let userData = this.data.userData
    userData = wx.getStorageSync('lhjUser');
    myNumber = parseInt(userData.points)
    

    this.setData({myNumber,userData})


    this.checkPad()
    getActivityTime().then(e => {

      let activityTimeJson = this.data.activityTimeJson
      activityTimeJson.startTime = e.activityStartTime
      activityTimeJson.endTime = e.activityEndTime
      this.setData({activityTimeJson})

    })
  },
  onReady: function() {
    
  },
  onShow: function() {
    this.searCh()
  },
  // 活动是否过期
  checkTimeOut  :function(){

    let isTimeOutStr = ''
      
    let endTime = new Date(this.data.activityTimeJson.endTime.replace(/-/g,'/')).getTime()
    let starTime = new Date(this.data.activityTimeJson.startTime.replace(/-/g,'/')).getTime()
    let currentTime = new Date().getTime()

    if (starTime > currentTime || currentTime > endTime){
      isTimeOutStr = '不在活动时间范围内'
    }
    

    if (isTimeOutStr != ''){
      wx.showModal({
        title: '提示',
        content: isTimeOutStr,
        showCancel: false,
        confirmText: '确定',
        confirmColor: '#3CC51F'
      });
      return true
    }
    return false

  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  },
  // 查询用户数据
  searCh : function(){
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let params = `openId=${wxInfo.openId}`
    let myNumber = this.data.myNumber
    let number = this.data.number
    let userData = this.data.userData
    searchUser(params).then(e=>{
      myNumber = parseInt(e.points)
      if (myNumber < number){
        number = lowNum
      }
      userData = wx.getStorageSync('lhjUser');
      
      this.setData({myNumber,number,userData})
    })
  }
});
  