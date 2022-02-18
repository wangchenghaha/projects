import { getAdd0306JsonNew } from "../ad.js"
import { splitImg , getCurrentUrl} from '../../../utils/utils'
import { KEYSTORAGE, EVENTS } from '../../../src/const.js'
import {wxShowToast} from '../../../utils/wxMethods'
const app = getApp();
let utmParam = ``

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents: [],
    autoplay: true,
    interval: 3000,
    duration: 500,
    jumpAppid: '', 
    isShow: false,  
    backgroundImg: splitImg('share_getCoupon.png', 'common'),
    isShare: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getContentJson();
    app.setUtmOptions(options)
    this.utm_source = options.utm_source
    this.utm_medium = options.utm_medium
    this.utm_term = options.utm_term
    this.utm_campaign = options.utm_campaign
    utmParam = `utm_source=${this.utm_source}&utm_medium=${this.utm_medium}&utm_term=${this.utm_term}&utm_campaign=${this.utm_campaign}`
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

  _getContentJson: function(){
    getAdd0306JsonNew().then(res => {
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
    let item =  e.currentTarget.dataset.item;
    switch(type){
        case "One":
          if(item.type === 'goods'){
            wx.navigateTo({
              url: item.pathUrlOne,
            })
          } else if(item.type === 'shop'){
            app.goToWebView(item.pathUrlOne)
          } else if(item.type === 'coupon'){

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
              app.navigateTo(item.pathUrlOne);
            }
          }
          break;
        case "Two":
          if(item.type === 'goods'){
            wx.navigateTo({
              url: item.pathUrlTwo,
            })
          }
          break;
        case "Three":
          if(item.type === 'goods'){
            wx.navigateTo({
              url: '/pages/content/content?colorCode=' + item.goodsCodeThree,
            })
          }
          break;
        case "close":
          this.setData({
            isShow: false
          })
          break;    
    }
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