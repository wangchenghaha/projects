import {getExpressInfo} from '../../service/express.js'
import { wxCopyText} from '../../utils/wxMethods.js'
import {KEYSTORAGE} from '../../src/const'

var app = getApp();
var dingdan_code = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ddAddress : [],
    dingdan_code: dingdan_code,
    expressInfo: wx.getStorageSync(KEYSTORAGE.expressInfo)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    dingdan_code = options.dingdan_code || '';
    this.setData({
      dingdan_code,
      expressInfo: wx.getStorageSync(KEYSTORAGE.expressInfo)
    })
  },
  onClick(e){
    let text = e.currentTarget.dataset.text;
    wxCopyText(text);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(){
    getExpressInfo(dingdan_code)
      .then(res=>{
        if(res.length > 0){
          res.forEach( item => {
            item.date1 = item.date.substring(0,10);
            item.date2 = item.date.substring(11);
          });
          this.setData({ ddAddress: res })
        }
      });
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