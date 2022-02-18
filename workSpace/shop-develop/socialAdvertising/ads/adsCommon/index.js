import { getAddJson } from "../ad.js"
import { splitImg , getCurrentUrl} from '../../../utils/utils'
import { KEYSTORAGE, EVENTS } from '../../../src/const.js'
import {wxShowToast} from '../../../utils/wxMethods'
const app = getApp();
let utmParam = ``
let share = "N"
let  jsName = ''

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents: [],
    autoplay: true,
    interval: 30000,
    duration: 500,
    jumpAppid: '', 
    isShow: false,  
    backgroundImg: splitImg('share_getCoupon.png', 'common')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getContentJson(options.jsname);
    jsName = options.jsname
    app.setUtmOptions(options)
    if(options.utm_source){
      this.utm_source = options.utm_source
      this.utm_medium = options.utm_medium
      this.utm_term = options.utm_term
      this.utm_campaign = options.utm_campaign
      utmParam = `utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`
      if(options.ald_share_op){
        share = "Y"
      }
    }
    
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
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  _getContentJson: function(_jsName){
    getAddJson(_jsName).then(res => {
      let contents = [];
      for (let i = 0; i < res.length; i++) {
        contents.push(res[i]);
      }
      this.setData({
        contents: contents,
      })
    })
  },

  onClick: function(e){
    let type =  e.currentTarget.dataset.type;
    let pathUrl =  e.currentTarget.dataset.url;
    let utm =  e.currentTarget.dataset.utm;
    switch(type){
        case "coupon":
          if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
            getApp().checkLogin()
          } else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
            console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
            if (!wx.getStorageSync('isMember')){
              getApp().isMemberETO()
            }else{
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
            this.appTDSdkEvent(utm)
            app.navigateTo(pathUrl);
          }

          break;
        case "classify":
          this.appTDSdkEvent(utm)
          wx.navigateTo({
            url: `/${pathUrl}`
          })
          break;
        case "home":
          this.appTDSdkEventHome(utm)
          wx.switchTab({url: `/${pathUrl}`})
          break;
        case "good":
          this.appTDSdkEvent(utm)
          wx.navigateTo({
            url: `/${pathUrl}`
          })
          break;
        case "goods":
          this.appTDSdkEvent(utm)
          wx.navigateTo({
            url: `/${pathUrl}`
          })
          break;
    }
  },

  onBannerClick(e){
    let goodsPath =  e.currentTarget.dataset.goodspath;
    let utm =  e.currentTarget.dataset.utm;
    this.appTDSdkEvent(utm)
    wx.navigateTo({
      url: `/${goodsPath}`
    })
  },


  appTDSdkEvent: function(params){
      let id = "pageclick_camp_button"
      let jsonData = {
        utm_source: params.utm_source,
        utm_medium: params.utm_medium,
        utm_term: params.utm_term,
        utm_campaign: params.utm_campaign,
        share_flag: share,
        camp_button: params.camp_button
      }
      app.tdSdkEvent(id, jsonData);
    
  },


  appTDSdkEventHome: function(params){
      let id = "adpage_to_home_btn_click"
      let jsonData = {
        utm_source: params.utm_source,
        utm_medium: params.utm_medium,
        utm_term: params.utm_term,
        utm_campaign: params.utm_campaign,
        share_flag: share,
        camp_button: params.camp_button
      }
      app.tdSdkEvent(id, jsonData);
  },


 /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let pagePath = getCurrentUrl()
    return {
      path: `/${pagePath}?${utmParam}`
    }
  },
})