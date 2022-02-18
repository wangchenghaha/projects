//Page Object

const brand = getApp().config.brand

// 图片地址
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/redRains/`

const guize = brand == 'FOL' ? [
  "在规定时间内尽可能多的点击页面落下的爱心，爱心包含随机数量金币，点击爱心越多，获得金币越多哦",
  "每人每天有3次游戏机会，3次机会用完后，可以通过邀请好友助力获得额外的游戏次数。每邀请1人将额外获得1次机会，每位好友仅可给同一人助力一次。",
  "每邀请5人，将有机会开启宝箱，宝箱内有惊喜哦。",
  "每天任务中心都会刷新任务次数，转发小游戏或浏览指定页面可以获得任务奖励。",
  "获得的金币可按页面要求兑换金额不等的七夕活动优惠券。",
  "奖品数量有限，先到先得，具体以兑换界面数量为准。"

] : [
  "在规定时间内尽可能多的点击页面落下的红包，红包中包含随机数量金币，红包越多，获得金币越多哦", 
    "每人每天有3次抢红包机会，3次机会用完后，可以通过邀请好友助力获得额外的游戏次数。每邀请1人将额外获得1次机会，每位好友仅可给同一人助力一次。", 
    "每邀请5人，将有机会开启宝箱，宝箱内有惊喜。", 
    "获得的金币可按页面要求兑换金额不等的全场通用优惠券", 
    "每个会员单个面额优惠券限兑换3张", 
    "奖品数量有限，先到先得，具体以兑换界面显示的数量为准。" 
]
// 助力文字
const zhuliTextArr = [
    [
        "朋友一生一起走","红包在手不用愁"
    ],
    [
        "好友助力你最强","多抢几次齐飞翔"
    ]
]
import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";

import {searUserInfo,createUser,addZhuli} from "../../../service/redRain"
var tapType = ''
var isCreateUser = false

Page({
    data: {
      brand,
      // 解决401问题
      zhanweiView : false,
        userData : {},
        imgPath,
        guize,
        // 控制助力弹框
        zhuli : false,
        zhuliArr : [],
        // 是否弹出授权手机号
        canAuthPhone : false
    },

  /**
  * 订阅的事件回调
  */
  handleEvent: function (event, type) {


    if (type === EVENTS.EVENT_401 && event){
      this.setData({zhanweiView : true})
    }
    else if (type == EVENTS.EVENT_LOGINED && event){

      if (!wx.getStorageSync('isMember')){
        getApp().isMemberETO()
      }
      else{
        getApp().getCRMInfoFn()
      }
    }
    else if (type === EVENTS.EVENT_CRMINFO && event) {
      this.nextTap()
    }
  },
    //options(Object)
    onLoad: function(options){
      isCreateUser = false

      let json = JSON.parse(options.params)
      let userData = this.data.userData
      userData.userid = json.userid
      userData.picUrl = json.picUrl
      userData.openid = json.openid
      this.setData({userData})


      let shareBy = json.share_by
      let shareByShop = json.share_by_shop

      let utmJson = {
        utm_source: json.utm_source,
        utm_medium: json.utm_medium,
        utm_term: json.utm_term,
        utm_campaign: json.utm_campaign
      }
      let collectParam = Object.assign(utmJson, { eventName: `打开红包雨助力页_${json.userid}` });
      getApp()._collectData2(collectParam)
        
      events.register(this, EVENTS.EVENT_401);
      events.register(this, EVENTS.EVENT_LOGINED);
      events.register(this, EVENTS.EVENT_CRMINFO);

      let orderSaveShare = {
        shareBy,
        shareByShop
      };
      getApp().setShareInfo(orderSaveShare);
    },
    tapss(e){
      tapType = e.detail

      wx.showLoading({
        title: '加载中……',
        mask: true
      });
      let _this = this
      setTimeout(() => {
        wx.hideLoading();
        
        if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
          getApp().checkLogin()
        }
        else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
          if (!wx.getStorageSync('isMember')){
            getApp().isMemberETO()
          }
          else{
            getApp().getCRMInfoFn()
          }
        }
        else{
          _this.nextTap()
        }

      }, 1000);
          
    },
    nextTap(phoneNum){
      this.setData({zhanweiView : false})
      if (isCreateUser){
        this.requestDatas()
      }
      else{

        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
        var openID = wx.getStorageSync('wxOpenID');

        searUserInfo({openId : openID}).then(res => {
          if (!res){
            let phone = userInfo.phone
            if (!phone){
              if (!phoneNum){
                // 弹框授权手机号
                this.setData({canAuthPhone : true})
                return
              }
              else{
                phone = phoneNum
              }
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
              isCreateUser = true
              this.requestDatas()
            })
  
          }
          else{
            isCreateUser = true
            this.requestDatas()
          }
        })
        
      }


        
    },

    requestDatas(){
      
      if (tapType == 'help'){
        if (this.data.userData.openid == ''){
          wx.showModal({
            title: '提示',
            content: '分享参数有误,请重新分享',
            showCancel: false,
            cancelText: '取消',
            cancelColor: '#000000',
            confirmText: '确定',
            confirmColor: '#3CC51F'
          });
          return
        }
        let openID = wx.getStorageSync('wxOpenID');
        // openID = 'olJQ95dBU6M8Oxici-MNb-bTFAos' 闫宁的 olJQ95W1ixdez3TcSk_iiZvP8HWI 小黑的
        if (this.data.userData.openid == openID){
          wx.showToast({
            title: '不能自己助力',
            icon: 'none'
          });
        }
        else{
          // 助力
          let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
          let json = {
            userid : this.data.userData.userid,
            friendOpenid : openID,
            friendFacePic : wxInfo.avatarUrl,
            nickName : escape(wxInfo.nickName)
          }
          addZhuli(json).then(res => {
            
            let random = Math.floor(Math.random() * 2 + 0)
            this.setData({zhuli : true,zhuliArr : zhuliTextArr[random]})
          })

        }
      }
      else if (tapType == 'game'){
          // 去游戏
          wx.redirectTo({
              url: '../index/index'
          });
      }
    },
    // 授权手机号
    getPhoneNumber (e) {
      if(e.detail.encryptedData && e.detail.iv){
        getApp().getWxPhone(e.detail.encryptedData, e.detail.iv).then(wxPhone => {
          this.setData({canAuthPhone : false})
          this.nextTap(wxPhone)
        }).catch(err => wxShowToast(err))
      }

    },
    closed(){
        this.setData({zhuli : false})
    },
    onReady: function(){
        
    },
    onShow: function(){
        
    },
    onHide: function(){

    },
    onUnload: function(){

    },
    onPullDownRefresh: function(){

    },
    onReachBottom: function(){

    },
    onPageScroll: function(){

    },
    //item(index,pagePath,text)
    onTabItemTap:function(item){

    }
});