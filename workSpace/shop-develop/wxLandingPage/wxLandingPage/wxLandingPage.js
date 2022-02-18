// wxLandingPage/wxLandingPage/wxLandingPage.js
import{SELECTED} from '../landing_SELECTED.js'
import{ONLY} from '../landing_ONLY.js'
import{JACKJONES} from '../landing_JACKJONES.js'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    list:[],
    isBonuced : false,
    bouncedImage : '',
    bouncedText:'进入客服聊天窗口,发送1,领取惊喜好礼!'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({ title: getApp().config.brand });

    var list = this.data.list
    
    var js = ''
    if (getApp().config.brand == 'SELECTED'){
      js = SELECTED
    }
    else if (getApp().config.brand == 'ONLY'){
      js = ONLY
    } 
    else if (getApp().config.brand == 'JACKJONES'){
      js = JACKJONES
    } 
    else{
      return
    }
    Object.assign(list,js)

    
    this.setData({
      list
    })
  },
  closed:function(){
    this.setData({
      isBonuced : false
    })
  },
  onClik:function(e){
    // console.log(`点击内容:${JSON.stringify(e)}`)
    if (e.currentTarget.dataset.link == 'bounced'){
      var bouncedImage = this.data.bouncedImage
      bouncedImage = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/image/landingGIF.gif`
      this.setData({
        isBonuced : true,
        bouncedImage
      })
    }
    else{
      if (e.currentTarget.dataset.isindex){
        wx.switchTab({ url: `${e.currentTarget.dataset.link}` });
      }
      else{
        wx.navigateTo({ url: `${e.currentTarget.dataset.link}` });
      }
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

  }
})