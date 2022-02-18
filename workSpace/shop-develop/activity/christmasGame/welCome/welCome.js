// activity//courierGame/welCome/welCome.js
import {EVENTS, KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
import {wxSubscription} from '../../../utils/wxSubscribe'

import {WELCOME} from '../gameParams'

import {getGameTime, searUserInfo, createUser, searchZhuli, kaiqibaoxiang} from "../../service/christmasNet"

var startTime = 0
var endTime = 0

const brand = getApp().config.brand

var canShowLoadding = true
Page({

  /**
   * 页面的初始数据
   */
  data: {
    WELCOME,
    zhanweiView: false,
    splashImg: '',

    userData: {},
    // 助力信息
    friends: WELCOME.friends,
    // 是否满5人
    isFiveNum: false,
    // 是否打开宝箱
    canOpen: false,
    // 宝箱奖品
    baoxiangJson: {
      bgImage: '',
      image: '',
      title: ''
    },
    // 次数0弹框
    showOneBounced: false,
    // 次数0文案
    canNotPlayText: [],
    xuehuaDatas: []

  },

  getSystemInfo: function () {

    try {
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth / windowHeight * 10000));
      let splashImg = '';
      WELCOME.splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if (diff < 100 && splashImg == '') {
          splashImg = item.img
        }
      });
      if (splashImg) {
        this.setData({
          splashImg: `${splashImg}`
        })
        console.log(this.data.splashImg, '***init');
      } else {
        this.setData({
          splashImg: `${WELCOME.splashImgList[1].img}`
        })
        console.log(this.data.splashImg, '***init00000');
      }
    } catch (e) {
    }
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
    if (brand == 'FOL') {
      canNotPlayText = ['您今天的游戏次数已用完', '邀请好友助力', '再玩1次！']
    } else {
      canNotPlayText = ['太遗憾了', '邀请好友助力', '再拆1次！']
    }

    this.getSystemInfo();

    let xuehuaDatas = this.data.xuehuaDatas
    WELCOME.xuehuaArr.forEach(item => {
      xuehuaDatas.push(item)
    });
    this.setData({
      xuehuaDatas,
      canNotPlayText
    })
  },
  requestData() {
    this.setData({zhanweiView: false})

    if (startTime == 0 && endTime == 0) {
      getGameTime().then(e => {

        endTime = new Date(e.activityEndTime.replace(/-/g, '/')).getTime()
        startTime = new Date(e.activityStartTime.replace(/-/g, '/')).getTime()

        this.nextTwo()

      })
    } else {
      this.nextTwo()
    }


  },
  nextTwo() {
    var openID = wx.getStorageSync('wxOpenID');

    searUserInfo({openId: openID}, canShowLoadding).then(res => {
      if (!res) {

        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
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
          memberno: userInfo.memberno
        }
        createUser(json).then(res => {
          this.makeUserData(res)
        })

      } else {
        this.makeUserData(res)
      }
    })

  },

  // 封装用户数据
  makeUserData(res) {
    if (res) {

      let userData = this.data.userData
      userData = res
      this.setData({userData})

    }
    let friends = this.data.friends
    // 获取好友助力列表
    searchZhuli({userid: this.data.userData.id}, canShowLoadding).then(res => {
      canShowLoadding = false
      if (res.length > 0) {
        res.forEach((item, index) => {
          if (index <= 4) {
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
  checkFriendNum() {
    let isFiveNum = this.data.isFiveNum
    isFiveNum = true
    this.data.friends.list.forEach(item => {
      if (item.name == '') {
        isFiveNum = false
      }
    });

    if (brand == 'JACKJONES' || brand == 'ONLY' || brand == 'SELECTED' || brand == 'VEROMODA') {
      if (this.data.userData.openBoxCount > 0) {
        isFiveNum = false
      }
    }

    this.setData({isFiveNum})
  },

  /**
   * 订阅的事件回调
   */
  handleEvent: function (event, type) {


    if (type === EVENTS.EVENT_401 && event) {
      this.setData({zhanweiView: true})

      setTimeout(() => {
        this.requestData()
      }, 5000);
    } else if (type == EVENTS.EVENT_LOGINED && event) {
      if (!wx.getStorageSync('isMember')) {
        getApp().isMemberETO()
      } else {

        setTimeout(() => {
          getApp().getCRMInfoFn()
        }, 2000);
      }
    } else if (type === EVENTS.EVENT_CRMINFO && event) {
      //  获取手机号成功
      this.requestData()
    }
  },
  openBox() {
    const {friends, userData} = this.data;
    kaiqibaoxiang({userid: userData.id}).then(res => {
      let a = 0
      switch (parseInt(res.result)) {
        case 20:
          a = 0
          break;
        case 10:
          a = 1
          break;
        case 15:
          a = 2
          break;
        case 3000:
          a = 3
          break;
        case 5000:
          a = 4
          break;
        default:
          break;
      }
      friends.list.forEach(item => {
        item.icon = ''
        item.name = ''
      })
      this.setData({friends,canOpen: true, baoxiangJson: WELCOME.baoxiang[a], isFiveNum: false})
      this.requestData()
    })


  },
  startGame() {
    this.onClick('startGame')
  },
  closed() {
    this.setData({
      canOpen: false,
      showOneBounced: false
    })
  },
  guize() {
    wx.navigateTo({
      url: '../guize/guize'
    });
  },
  duihuan() {

    let json = {
      points: this.data.userData.points,
      id: this.data.userData.id
    }
    wx.setStorageSync('maristmasData', json);
    wx.navigateTo({
      url: `../ticket/ticket`
    });
  },
// 返回
  backTap() {
    console.log(`返回`)

    var pageList = getCurrentPages();
    if (pageList.length > 1) {
      wx.navigateBack({
        delta: 1
      });
    } else {
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


    if (!wx.getStorageSync(KEYSTORAGE.loginInfo)) {
      getApp().checkLogin()
    } else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)) {
      console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
      if (!wx.getStorageSync('isMember')) {
        getApp().isMemberETO()
      } else {
        setTimeout(() => {
          getApp().getCRMInfoFn()
        }, 2000);
      }
    } else {
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
    if (startTime > currentTime || currentTime > endTime) {
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
    if (type == 'startGame') {
      if (this.data.userData.gameCount <= 0) {
        this.setData({
          showOneBounced: true
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
  playNext() {

    let json = {
      gameCount: this.data.userData.gameCount,
      id: this.data.userData.id
    }
    wx.setStorageSync('maristmasData', json);
    wx.navigateTo({
      url: `../game/game`
    });
  },
  onShareAppMessage: function () {

    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    var openID = wx.getStorageSync('wxOpenID');
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let json = {
      userid: this.data.userData.id || '',
      picUrl: wxInfo.avatarUrl || '',
      nickName: wxInfo.nickName || '',
      openid: openID,

      share_by: sharePams.employeeId || '',
      share_by_shop: sharePams.shopCode || '',

      utm_source: 'game',
      utm_medium: 'game_christmas',
      utm_term: '',
      utm_campaign: ''
    }
    let title = ''
    let titleArr = []
    if (brand == 'FOL') {
      titleArr = ['@所有人，圣诞老人给大家发奖品啦，看看谁能夺大奖', '迎双旦，绫致携圣诞老人给你送大礼啦']
    } else {
      titleArr = ['分享好友，一起开启神秘宝箱吧！', '双旦豪礼齐上阵，好友助力大作战！', '分享邀请越多，奖励越多哦！']
    }
   
    let random = Math.floor(Math.random() * titleArr.length)
    title = titleArr[random]

    let path = `/activity/christmasGame/help/help?params=${JSON.stringify(json)}`
    let imageUrl = WELCOME.shareImg
    console.log(`分享成功:${path}`)
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (e) {

      },
      fail: function (e) {
        console.log(`分享失败`)
      }
    }
  }
})