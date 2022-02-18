import {getPointRecord, getPointRule} from '../../service/member'
import { splitImg} from '../../utils/utils'
import { KEYSTORAGE, EVENTS } from "../../src/const";
import events from '../../src/events';
let  app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pointBg: splitImg("point_bg.png"),
    userImg: '',
    pointList: [],
    myPoint: 0,
    isShowTModel: false,
    contentInfo:  [],
    expirePoints: 0,
    isShow: false,
    currentYear: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_CRMINFO);
    this._getPointRule();
    let {isShow} = this.data;
    if(app.config.brand === 'FOL'){
      isShow = true;
    }
    this.setData({
      isShow,
      currentYear: new Date().getFullYear()
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

   /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO){
      const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      this.setData({
        userImg: wxInfo.avatarUrl,
        myPoint: crmInfo.availablepoints
      })
      this._getPointRecord();
    }
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
        wx.showLoading({
          title: '加载中……',
          mask: true
        });
        setTimeout(() => {
          wx.hideLoading();
          getApp().getCRMInfoFn()
        }, 2000);
      }
    }
    else{
      const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
      this.setData({
        userImg: wxInfo.avatarUrl,
        myPoint: crmInfo.availablepoints
      })
      this._getPointRecord();
    }

  },
  
  _getPointRecord: function(){

    let jsData = {
      phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
      brand: app.config.brand,
      platform: 'H5'
    }

    getPointRecord(jsData).then(res =>{
      for (let i = 0; i <  res.pointsReasonList.length; i++) {
          if(Number(res.pointsReasonList[i].updatePoints) > 0){
            res.pointsReasonList[i].updatePoints = "+" + res.pointsReasonList[i].updatePoints;
            res.pointsReasonList[i].isGet = true
          } else{
            res.pointsReasonList[i].isGet = false
          }
      }
      this.setData({
        expirePoints: res.expirePoints,
        pointList: res.pointsReasonList
      })
    })
  },

  _getPointRule(){
    getPointRule().then(res=>{
      this.setData({
        contentInfo: res
      })
    })
  },


  onClick: function(e){
    let type = e.currentTarget.dataset.type;
    switch(type){
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
    }
  }

})