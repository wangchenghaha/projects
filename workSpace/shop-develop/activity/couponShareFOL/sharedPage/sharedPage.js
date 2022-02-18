import {splitImg,  countDown, timeStamp, getCurrentUrl} from '../../../utils/utils'
import { URL_CDN, KEYSTORAGE, EVENTS } from "../../../src/const";
import { wxShowToast } from '../../../utils/wxMethods'
import events from '../../../src/events';
import {brandAdapter} from '../brandAdapter'
import { getExpandCoupon, lightExpandCoupon, createExpandCoupon, lightSuccessList} from '../../../service/sharecoupon'
const app = getApp();
let myOpenId = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponShow:  splitImg("couponShare_title.jpg?v=1"),
    couponbg: splitImg("couponShare_ing_new.png?v=1"),
    user_pic: '',
    user_name: '',
    user_option: '发起者',
    getCoupon: '',
    mySelfRecordList: [],
    //projeckName: 'firstPage',
    canShowPic: true,
    getCouponImg:  splitImg("couponShare_pop.png?v=110"),
    recordTab: [{
                  name: '我的点亮记录',
                  selected: true,
                  isLeft: true,
                },{
                  name: '成功点亮的VIP',
                  selected: false,
                  isLeft: false,
                }],
    isLeft: true,
    otherRecords: [],
    couponID: '',
    multipleNum: 0,
    contentInfo:  [],
    isShowTModel: false,
    lightInfo: {},
    isHelpLight: false,
    alreadyHelp: false,
    shareIcon:  splitImg("couponShare_icon.png?v=1"),
    personIcon:  splitImg("couponShare_person.png?v=1"),
    myCouponId: '',
    adapter: {},
    helpFirends:[],

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订阅401事件
    events.register(this, EVENTS.EVENT_LOGINED);
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    myOpenId = wx.getStorageSync(KEYSTORAGE.openid);
    let {alreadyHelp, canShowPic, helpFirends} = this.data;
    if(myOpenId === options.couponid){
      // alreadyHelp = true
      canShowPic = false
    }
    for(let i = 0; i < brandAdapter().helpCount; i++){
      helpFirends.push({
        helpImg: splitImg("couponShare_inventDefault.png", 'common'),
        nickname: '',
      })
    }
    this.setData({
      helpFirends,
      adapter: brandAdapter(),
      user_name: wxInfo.nickName, //昵称
      user_pic: wxInfo.avatarUrl, // 头像
      couponID: options.couponid,
      alreadyHelp,
      canShowPic,
      contentInfo: brandAdapter().activityRule()
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
    let dates = this.data.adapter.endTime;
    // 获取总活动结束时间
    let years =  dates.substring(0, 4) + '/' + dates.substring(5, 7) + '/' + dates.substring(8, 11);
    let times = dates.substring(11)
    let timerDate = parseInt(new Date(`${years} ${times}`).getTime()) +  1000;
    this.activityCountDown(timerDate);
    this._getExpandCoupon(this.data.couponID);
    this._lightSuccessList();
  },



  /**
   * 接收401事件(自有平台用户登录态失效)
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      myOpenId = wx.getStorageSync(KEYSTORAGE.openid);
      this._getExpandCoupon(this.data.couponID);
      this._lightSuccessList();
    }
  },

  closeCoupon: function(){
    this.setData({
      canShowPic: false,
    })
  },

  onClick: function(e){
    let selected = e.currentTarget.dataset.selected;
    let type = e.currentTarget.dataset.type;
    let {recordTab} = this.data
    switch(type){
      case 'recode':
        if(selected){
          return;
        }
        for (let i = 0; i < recordTab.length; i++) {
          recordTab[i].selected = !recordTab[i].selected;
        }
        this.setData({
          recordTab,
          isLeft: recordTab[0].selected === recordTab[0].isLeft,
        })
        break;
      case 'goLightCoupon':
        this._createExpandCoupon();
        break;
      case 'notice':
        this.setData({
          isShowTModel: true,
        })
        break;
      case "tanClose":
        this.setData({
          isShowTModel: false,
        })
        break;
      case 'helpLight':
        if (!app.checkLogin()) {
          return;
        }
        this.setData({
          canShowPic: false,
        })
        if(this.data.alreadyHelp){
          this._createExpandCoupon();
        } else {
          this._lightExpandCoupon();
        }
        break;
      case "seeCoupon":
        let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[app.config.brand];
        wx.navigateTo({
          url: '../../../member/myCouponList/myCouponList?name=' + name
        })
        break;
      case "close":
        this.setData({
          canShowPic: false,
        });
        break;
      case 'createLight':
        this._createExpandCoupon();
        break;
      case 'jump':
        app.goBack();
        // wx.navigateTo({
        //   url: this.data.adapter.jumpLink
        // })
        break;
    }
  },

    // 倒计时
    activityCountDown:function(endTime){
      let that = this;
      setInterval(() => {
        // let endTime = parseInt(new Date(`${year} ${time}`).getTime()) +  1000
        let countTimer = countDown(endTime);
        that.setData({
          timeObj: countTimer,
        })
      }, 1000);
    },

    _getExpandCoupon: function(_id){
      let {isHelpLight, canShowPic, helpFirends, couponbg, alreadyHelp} = this.data;
      getExpandCoupon(_id).then(res => {
        for (let ii = 0; ii < res.lightingList.length; ii++) {
          helpFirends[ii].helpImg = res.lightingList[ii].avatarUrl
          helpFirends[ii].nickname= res.lightingList[ii].nickname
          if(myOpenId === res.lightingList[ii].openid){
            alreadyHelp = true
          }
        }
        if(res.lightingList.length === brandAdapter().helpCount){
          isHelpLight = true;
          alreadyHelp = true;
          couponbg= splitImg("couponShare_success_new.png?v=1");
        }
        this.setData({
          lightInfo:res.creatorInfo,
          isHelpLight,
          couponbg,
          helpFirends,
          alreadyHelp,
          canShowPic: isHelpLight ? false: canShowPic,
        })
        console.log("lightInfo ============ ",this.data.lightInfo);
      }).catch(err=>{
        wxShowToast(err);
      })
    },

    _lightExpandCoupon: function(){
      const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      const {lightInfo, couponID} = this.data;
      if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
        console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
        if (!wx.getStorageSync('isMember')){
          getApp().isMemberETO()
        }
        else{
          wx.showLoading({
            title: '加载中……',
            mask: true
          });
          setTimeout(() => {
            wx.hideLoading();
            getApp().getCRMInfoFn()
          }, 2000);

        }
      } else {
        let jsData = {
          nickname:  wxInfo.nickName || '',
          openid: wx.getStorageSync(KEYSTORAGE.openid),
          phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone || '',
          avatarUrl: wxInfo.avatarUrl || '',
          friendAvatarUrl: lightInfo.avatarUrl,
          friendNickname: lightInfo.nickname,
          friendOpenid: lightInfo.openid,
          friendPhone: lightInfo.phone,
        }

        wx.showLoading({
          title: '点亮中...',
          mask: true,
        })
        lightExpandCoupon(jsData).then(res => {
          wx.hideLoading();
          this._getExpandCoupon(this.data.couponID);
          this._lightSuccessList();
          this.setData({
            alreadyHelp: true,
          })
        }).catch(err=>{
          wx.hideLoading();
          wxShowToast(err);
        })
      }
    },

    _lightSuccessList: function(){
      lightSuccessList(myOpenId).then(res=>{
        let multipleNum = 0;
        if(res.lightSuccessList.length > 3){
          multipleNum = 3
        } else {
          multipleNum = res.lightSuccessList.length;
        }
        this.setData({
          mySelfRecordList: res.couponList,
          otherRecords: res.lightSuccessList,
          multipleNum,
        })
      }).catch(err=>{
        wxShowToast(err)
      })
    },
  onPullDownRefresh(){
    wx.redirectTo({
      url: `/${getCurrentUrl()}`
    })
  },
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

      let title = "点亮你我他，好券一起拿！"
      let path = `/activity/couponShareFOL/shareIndex/shareIndex`
      const imgVersion = `${new Date().getDate()}${new Date().getHours()}${new Date().getMinutes()}`
      let imageUrl = splitImg(`coupon_share_shareimg.jpg?v=${imgVersion}`)
      console.log(`分享成功:${path}`)
      return{
        title: title,
        path : path,
        imageUrl : imageUrl,
        success:function(e){
          console.log(`分享成功:${path}`)
        },
        fail:function(e){
          console.log(`分享失败`)
        }
      }
    },

    _createExpandCoupon: function(){

      getExpandCoupon(myOpenId).then(res => {
        let haveCoupon = res.creatorInfo
        return haveCoupon;
      }).then(data =>{
        console.log("...........................", data)
        if(data){
          wx.navigateTo({
            url: "../couponShare/couponShare",
          })
        } else {
          let that = this;
          const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
          let jsData = {
            avatarUrl: wxInfo.avatarUrl || '',
            nickname: wxInfo.nickName || '',
            openid:  wx.getStorageSync(KEYSTORAGE.openid),
            phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone || '',
          }
          wx.showLoading({
            mask: true,
          })
          createExpandCoupon(jsData).then(res =>{
            wx.hideLoading();
            that.setData({
              canShowPic: false,
              myCouponId: res.id,
            })
            wx.navigateTo({
              url: "../couponShare/couponShare",
            })
          }).catch(err=>{
            wx.hideLoading();
            wxShowToast(err);
          })
        }
      }).
      catch(err=>{
        wxShowToast(err);
      })


    },

})
