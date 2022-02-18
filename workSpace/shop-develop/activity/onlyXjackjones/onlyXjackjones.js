import { getContentJson, getCoupon, queryCoupon } from "../service/onlyXjj"
import { splitImg } from '../../utils/utils'
import { KEYSTORAGE, EVENTS } from '../../src/const.js'
import {wxShowToast} from '../../utils/wxMethods'
import events from '../../src/events';
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    contents: [],
    jumpAppid: '', 
    isShow: false,  
    backgroundImg: splitImg('share_getCoupon.png', 'common'),
    isShare: true  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._getContentJson();
    events.register(this, EVENTS.EVENT_CRMINFO);
    let {jumpAppid} = this.data;
    if(app.config.brand === 'ONLY'){
      jumpAppid = 'wx7f1b0d611e93dea4'
    } else {
      jumpAppid = 'wxa3d9d2199eeded73'
    }
    this.setData({
      jumpAppid
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
      this._queryCoupon();
    }
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  _getContentJson: function(){
    getContentJson().then(res => {
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
              url: '/pages/content/content?colorCode=' + item.goodsCodeOne,
            })
          } else if(item.type === 'classify'){
            wx.navigateTo({
              url: '/pages/goodsList/goodsList?list=' + item.goodsCodeOne,
            })
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
              this._queryCoupon();
            }
          }
          break;
        case "Two":
          if(item.type === 'goods'){
            wx.navigateTo({
              url: '/pages/content/content?colorCode=' + item.goodsCodeTwo,
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

  _getCoupon(){
    let phone = wx.getStorageSync(KEYSTORAGE.crmInfo).phone;
    getCoupon(phone).then(res =>{
        this.setData({
          backgroundImg: splitImg('getCoupon.png', 'common'),
          isShare: false  
        })
    }).catch(res => {
      this.setData({
        backgroundImg: splitImg('already_get.png', 'common'),
        isShare: false  
      })
    })
  },


  _queryCoupon(){
    let phone = wx.getStorageSync(KEYSTORAGE.crmInfo).phone;
    queryCoupon(phone).then(res =>{
      if(res){
        this.setData({
          isShow: true,
          backgroundImg: splitImg('already_get.png', 'common'),
          isShare: false  
        })
      } else {
        this.setData({
          isShow: true
        })
      }
    }).catch(err =>{
      let errStr = err.message?err.message:err.msg
      wxShowToast(errStr);
    })
  },

 /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let title = "我们的恋爱招式大公开！点击为爱加温！"
    let images = splitImg('shareImg.jpg', 'common')  
    let path = `/activity/onlyXjackjones/onlyXjackjones`
    this._getCoupon();
    console.log(`分享成功:${path}`)
    return{
      title: title,
      path : path,
      imageUrl : images,
      success:function(e){
        console.log(`分享成功:${path}`)
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  },
})