// activity//tiggerGame/welCome/welCome.js
import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
import {searchUser,createUser} from '../netWorking'

/*
* 本地store数据key
* lhjUser : 用户数据
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userPhone : '',
    // 注册中不能在注册
    canShow : false,
    // 品牌拆分
    brand : getApp().config.brand
  },
  guize : function(){
    wx.setStorageSync("lhjGZ", "1");
    wx.navigateTo({
      url: '../guizeView/guizeView'
    });
  },
  onClick : function(){

    if (wx.getStorageSync(KEYSTORAGE.loginInfo)){
      if (wx.getStorageSync(KEYSTORAGE.crmInfo)){

        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
        let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
        this.setData({userPhone : userInfo.phone})

        let params = `openId=${wxInfo.openId}`
        searchUser(params).then(e=>{
          if (!e){
            // 创建新用户
            let json = {
              phone : this.data.userPhone,
              openid : wxInfo.openId,
              facePic : wxInfo.avatarUrl,
              nickName : wxInfo.nickName,
              points : this.data.brand == 'FOL' ? 5000 : 600
            }

            if (this.data.canShow){
              return
            }
            else{
              this.setData({canShow : true})
            }

            createUser(json).then(e =>{
              wx.redirectTo({
                url: '../gameIndex/gameIndex'
              });
            }).catch(err => {
              this.setData({canShow : false})
            })
          }
          else{
            wx.redirectTo({
              url: '../gameIndex/gameIndex'
            });
          }
        })
      }
      else{
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
      
    }
    else{
      getApp().checkLogin()
    }
      
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_CRMINFO);

    if (options.params){
      let json = JSON.parse(options.params)
      let utmJson = {
        utm_source: json.utm_source,
        utm_medium: json.utm_medium,
        utm_term: json.utm_term,
        utm_campaign: json.utm_campaign
      }
      let collectParam = Object.assign(utmJson, { eventName: `打开老虎机引导页` });
      getApp()._collectData2(collectParam)
    }
  },
  /**
  * 订阅的事件回调
  */
  handleEvent: function (event, type) {


    if (type === EVENTS.EVENT_401 && event) {
      

      wx.showLoading({
        title: '加载中……',
        mask: true
      });
      let _this = this
      setTimeout(() => {

        wx.hideLoading();
        _this.onClick()
      }, 2000);

    }
    else if (type === EVENTS.EVENT_CRMINFO && event){
       //  获取手机号成功
      this.onClick()
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

      share_by : sharePams.employeeId || '',
      share_by_shop : sharePams.shopCode || '',

      utm_source : 'game',
      utm_medium : 'game_tigger',
      utm_term : '',
      utm_campaign : ''
    }
    let path = `/activity/tiggerGame/helpView/helpView?params=${JSON.stringify(json)}`

    return{
      title: '',
      path : '',
      imageUrl : '',
      success:function(e){
        console.log(`分享成功:${path}`)
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  }
})
