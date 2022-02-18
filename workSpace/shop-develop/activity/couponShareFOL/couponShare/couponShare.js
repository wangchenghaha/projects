import {splitImg, countDown, objToQuery, getCurrentUrl} from '../../../utils/utils'
import { URL_CDN, KEYSTORAGE, EVENTS } from "../../../src/const";
import { wxShowToast } from '../../../utils/wxMethods'
import {brandAdapter} from '../brandAdapter'
import { getExpandCoupon,  lightSuccessList} from '../../../service/sharecoupon'
const app = getApp();

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
    canShowPic: false,
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
    isHelpLight: false,
    adapter: {},
    helpFirends:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const { helpFirends } = this.data;
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
    this._getExpandCoupon();
    this._lightSuccessList();

  },

  closeCoupon: function(){
    this.setData({
      canShowPic: false,
    })
  },

  _getExpandCoupon: function(){
    let {isHelpLight, couponbg, helpFirends, adapter} = this.data;
    getExpandCoupon(wx.getStorageSync(KEYSTORAGE.openid)).then(res => {
      if(res.lightingList.length === (adapter.helpCount || 1)){
        isHelpLight = true;
        couponbg= splitImg("couponShare_success_new.png");
      }
      for (let ii = 0; ii < res.lightingList.length; ii++) {
        helpFirends[ii].helpImg = res.lightingList[ii].avatarUrl
        helpFirends[ii].nickname= res.lightingList[ii].nickname
      }
      this.setData({
        lightInfo: res.creatorInfo,
        isHelpLight,
        couponbg,
        helpFirends
      })
    }).catch(err=>{
      wxShowToast(err);
    })
  },

  _lightSuccessList: function(){
    lightSuccessList(wx.getStorageSync(KEYSTORAGE.openid)).then(res=>{
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
        wx.navigateTo({
          url: '../shareIndex/shareIndex',
        })
        break;
      case 'goHome':
        app.goBack();
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
      case "seeCoupon":
        let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[app.config.brand];
        wx.navigateTo({
          url: '../../../member/myCouponList/myCouponList?name=' + name
        })
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
      let json = {
        couponid: wx.getStorageSync(KEYSTORAGE.openid),
      }
      let path = `/activity/couponShareFOL/sharedPage/sharedPage${objToQuery(json)}`
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
})
