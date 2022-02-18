import {splitImg} from '../../../utils/utils'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    overview: [
      {
        text: '销售额',
        value: 1066
      },
      {
        text: '订单',
        value: 1066
      },
      {
        text: '好友数',
        value: 1066
      },
      {
        text: '会员数',
        value: 1066
      },
    ],
    nav: [
      {
        icon: splitImg('icon_helper1.png', 'common'),
        text: '单品&搭配'
      },
      {
        icon: splitImg('icon_helper2.png', 'common'),
        text: '优惠券'
      },
      {
        icon: splitImg('icon_helper3.png', 'common'),
        text: '会员'
      },
      {
        text: '销售线索'
      },
    ],
    task: [
      {
        text: '浏览推荐搭配',
        value: 0
      },
      {
        text: '联系顾客',
        value: 0
      },
      {
        text: '分享朋友圈',
        value: 0
      },
    ],
    defaultValue: '本周',
    showTimeList: false,
    timeList: ['本周', '本月', '本年']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  changeShowTime(){
    const {showTimeList} = this.data;
    this.setData({showTimeList: !showTimeList})
  },
  selectTime(e){
    const {value} = e.currentTarget.dataset;
    this.setData({
      defaultValue: value,
      showTimeList: false
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