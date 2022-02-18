// activity//courierGame/welCome/welCome.js
import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
import { wxSubscription } from '../../../utils/wxSubscribe'

import {getGameTime,searUserInfo,createUser,searchZhuli,kaiqibaoxiang} from "../../service/courierNet"

var startTime = 0
var endTime = 0

const brand = getApp().config.brand
// 图片地址
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/courierImgs/`
const version = Date.now();
var splashImgList = [

  {
    scale: 5622,
    img: `${imgPath}welComeBg750.jpg?v=${version}`, // 375/667 iphone 7
  },
  {
    scale: 4618,
    img: `${imgPath}welComeBg1125.jpg?v=${version}`,  // 375/812 iphoneX
  }

];

// 宝箱奖品
const baoxiang = [
  {
      title : '10元优惠券一张',
      image : `${imgPath}yhqList10.png`,
      bgImage : `${imgPath}box.png?v=${version}`
  },
  {
      title : '15元优惠券一张',
      image : `${imgPath}yhqList15.png`,
      bgImage : `${imgPath}box.png?v=${version}`
  },{
    title : '2000金币',
    image : `${imgPath}box2000.png`,
    bgImage : `${imgPath}box.png?v=${version}`
  },{
    title : '3000金币',
    image : `${imgPath}box3000.png`,
    bgImage : `${imgPath}box.png?v=${version}`
  },{
    title : '50元优惠券一张',
    image : `${imgPath}yhqList50.png`,
    bgImage : `${imgPath}box.png?v=${version}`
  },{
    title : '100元优惠券一张',
    image : `${imgPath}yhqList100.png`,
    bgImage : `${imgPath}box.png?v=${version}`
  },{
    title : '30元优惠券一张',
    image : `${imgPath}yhqList30.png`,
    bgImage : `${imgPath}box.png?v=${version}`
  }
]

var canShowLoadding = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    imgPath,
    zhanweiView : false,
    splashImg: '',
    backImg : `${imgPath}sanjiao-left.png?v=${version}`,
    userData : {},
    // 助力信息
    friends:{
      bgImg : `${imgPath}friends.png?v=${version}`,
      list : [
        {icon : '',name : '',defIcon : `${imgPath}kq0.png?v=${version}`,otherIcon : `${imgPath}kq1.png?v=${version}`,otherName : '+开启1次'},
        {icon : '',name : '',defIcon : `${imgPath}kq0.png?v=${version}`,otherIcon : `${imgPath}kq1.png?v=${version}`,otherName : '+开启1次'},
        {icon : '',name : '',defIcon : `${imgPath}kq0.png?v=${version}`,otherIcon : `${imgPath}kq1.png?v=${version}`,otherName : '+开启1次'},
        {icon : '',name : '',defIcon : `${imgPath}kq0.png?v=${version}`,otherIcon : `${imgPath}kq1.png?v=${version}`,otherName : '+开启1次'},
        {icon : '',name : '',defIcon : `${imgPath}kq0.png?v=${version}`,otherIcon : `${imgPath}kq2.png?v=${version}`,otherName : '开启宝箱'}
      ]
    },
    // 是否满5人
    isFiveNum : false,
    // 是否打开宝箱
    canOpen : false,
    // 宝箱奖品
    baoxiangJson : {
      bgImage : '',
      image : '',
      title : ''
    },
    // 次数0弹框
    showOneBounced : false,
    // 次数0文案
    canNotPlayText : [],
    userData : {},


    // 静态资源
    jinbi : '',
    startGame : '',
    canNotPlay : '',
    bouncedBtn : ''

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
  ziyuan(){

    let jinbi = this.data.jinbi
    let startGame = this.data.startGame
    let canNotPlay = this.data.canNotPlay
    let bouncedBtn = this.data.bouncedBtn
    jinbi = `${imgPath}jinbi.png?v=${version}`
    startGame = `${imgPath}startGame.png?v=${version}`
    canNotPlay = `${imgPath}canNotPlay.png?v=${version}`
    bouncedBtn = `${imgPath}bouncedBtn.png?v=${version}`

    this.setData({
      jinbi,
      startGame,
      canNotPlay,
      bouncedBtn
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();
    startTime = 0
    endTime = 0
    canShowLoadding = true

    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);

    let canNotPlayText = this.data.canNotPlayText
    if (brand == 'FOL' || brand == 'VEROMODA'){
      canNotPlayText = ['你今天的拆快递次数','已经用完,携手助力','多抢一次']
    }
    else{
      canNotPlayText = ['您今天的次数耗尽啦','邀请好友助力','再拆1次！']
    }
    this.setData({canNotPlayText})

    this.getSystemInfo();
    this.ziyuan()
  },
  requestData(){
    this.setData({zhanweiView : false})

    if (startTime == 0 && endTime == 0){
      getGameTime().then(e => {
  
        endTime = new Date(e.activityEndTime.replace(/-/g,'/')).getTime()
        startTime = new Date(e.activityStartTime.replace(/-/g,'/')).getTime()

        this.nextTwo()
        
      })
    }
    else{
      this.nextTwo()
    }


  },
  nextTwo(){
    var openID = wx.getStorageSync('wxOpenID');

    searUserInfo({openId : openID},canShowLoadding).then(res => {
      if (!res){
        
        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
        let phone = userInfo.phone
        if (phone.length == 12){
          phone = phone.substr(0,11)
        }

        // 创建用户
        let json = {
          phone : phone,
          openid : openID,
          nickName : wxInfo.nickName,
          facePic : wxInfo.avatarUrl,
          memberno : userInfo.memberno
        }
        createUser(json).then(res => {
          this.makeUserData(res)
        })

      }
      else{
        this.makeUserData(res)
      }
    })

  },

    // 封装用户数据
    makeUserData(res){
      if(res){

        let userData = this.data.userData
        userData = res
        this.setData({userData})
        
      }
      let friends = this.data.friends
      // 获取好友助力列表
      searchZhuli({userid : this.data.userData.id},canShowLoadding).then(res => {
        canShowLoadding = false
        if (res.length > 0){
          res.forEach((item,index) => {
            if (index <= 4){
              friends.list[index].icon = item.friendFacePic
              friends.list[index].name = unescape(item.nickName)
            }
          })
          this.setData({friends})
          this.checkFriendNum()
        }
      })

      
    },
    // 检测是否5个人
    checkFriendNum(){
        let isFiveNum = this.data.isFiveNum
        isFiveNum = true
        this.data.friends.list.forEach(item => {
            if (item.name == ''){
                isFiveNum = false
            }
        });

        if (brand == 'JACKJONES' || brand == 'ONLY' || brand == 'SELECTED'){
          if (this.data.userData.openBoxCount > 0){
            isFiveNum = false
          }
        }

        this.setData({isFiveNum})
    },

  /**
  * 订阅的事件回调
  */
 handleEvent: function (event, type) {


  if (type === EVENTS.EVENT_401 && event){
    this.setData({zhanweiView : true})

    setTimeout(() => {
      this.requestData()
    }, 5000);
  }
  else if (type == EVENTS.EVENT_LOGINED && event){
    if (!wx.getStorageSync('isMember')){
      getApp().isMemberETO()
    }
    else{
      
      setTimeout(() => {
        getApp().getCRMInfoFn()
      }, 2000);
    }
  }
  else if (type === EVENTS.EVENT_CRMINFO && event){
     //  获取手机号成功
     this.requestData()
  }
},
openBox(){
  // fol:10/15/2000金币/3000金币
  // vm:50/100/3000金币
  // 其他品牌:30
  let friends = this.data.friends
  kaiqibaoxiang({userid : this.data.userData.id}).then(res => {
    let a = 0
    switch (parseInt(res.result)) {
      case 10:
        a = 0
        break;
        case 15:
          a = 1
          break;
          case 2000:
            a = 2
            break;
            case 3000:
              a = 3
              break;
              case 50:
                a = 4
                break;
                case 100:
                  a = 5
                  break;
                  case 30:
                    a = 6
                    break;
    
      default:
        break;
    }
    this.setData({canOpen : true,baoxiangJson : baoxiang[a]})
    

    friends.list.forEach(item => {
      item.icon = ''
      item.name = ''
    })
    this.setData({friends})
    this.requestData()
  })


},
startGame(){
  this.onClick('startGame')
},
closed(){
  this.setData({
    canOpen : false,
    showOneBounced : false
  })
},
guize(){
  wx.navigateTo({
    url: '../guize/guize'
  });
},
duihuan(){

  let json = {
    points : this.data.userData.points,
    id : this.data.userData.id
  }
  wx.setStorageSync('courierData', json);
  wx.navigateTo({
    url: `../ticket/ticket`
  });
},
// 返回
backTap(){
  console.log(`返回`)

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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {


    if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
      getApp().checkLogin()
    }
    else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
      console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
      if (!wx.getStorageSync('isMember')){
        getApp().isMemberETO()
      }
      else{
        setTimeout(() => {
          getApp().getCRMInfoFn()
        }, 2000);
      }
    }
    else{
      this.requestData()
    }

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
  // 统一事件处理
  onClick(type) {
      let currentTime = new Date().getTime()
      if (startTime > currentTime || currentTime > endTime){
        wx.showModal({
          title: '提示',
          content: '不在活动时间范围内',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F'
        });
        return

      }
    if (type == 'startGame'){
      if (this.data.userData.gameCount <= 0){
        this.setData({
          showOneBounced : true
        })
        return
      }

      if (getApp().config.courierGameTeplateIds){
        wxSubscription("courierGame").then(res => {
          this.playNext()
        }).catch(err => {
          this.playNext()
        });
      }
      else{
        this.playNext()
      }

      
    }
  },
  playNext(){

    let json = {
      gameCount : this.data.userData.gameCount,
      id : this.data.userData.id
    }
    wx.setStorageSync('courierData', json);
    wx.navigateTo({
      url: `../game/game`
    });
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