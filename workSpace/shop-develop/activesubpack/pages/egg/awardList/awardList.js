// activesubpack/pages/egg/awardList/awardList.js
import Fetch from '../../../service/fetch'
import Urls from '../../../service/url'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    bg: '',
    record_add_btn_img: '', //点击领取
    record_btn_img: '', //点击查看
    list: [
      {
        title: '满1800减180元券'
      },
      {
        title: '满300减180元券'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      bg: options.bg,
      record_add_btn_img: options.record_add_btn_img, // 点击领取
      record_btn_img: options.record_btn_img, // 点击查看
      ac_id: options.ac_id
    }, () => {
      this.getDataList()
    })
  },

  getDataList(){
    Fetch({
      url: Urls.egg_records,
      data: {
        ac_id: this.data.ac_id
      },
    }).then(res => {
      let {errcode, data = []} = res
      if(errcode == 0 || errcode == 200){
        this.setData({
          list: data
        })
      }else{
        wx.showToast({
          title: res.errmsg,
          icon: 'none',
          mask: true
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 更新券状态
  update(recordId){
    Fetch({
      url: Urls.egg_update,
      data: {
        record_id: recordId,
        ac_id: this.data.ac_id,
      }
    }).then(res => {
      let {errcode, errmsg} = res
      this.getDataList()
    })
  },

  getcoupon(detail){
    console.log('=============detail', detail)
    if(detail.detail.errcode == 'OK'){
      let recordId = detail.currentTarget.dataset.recordid
      this.update(recordId)
    }
  },
  // 点击领取
  addBtn(e){
    let {cardlist, coupontype} = e.currentTarget.dataset
    console.log('==点击领取', e.currentTarget.dataset)
    if(coupontype == 1){
      // 商家券领取
      this.update()
    }else{
      wx.addCard({
        cardList: cardlist,
      })
    }
  },

  // 点击查看
  openBtn(e){
    let {cardlist,coupontype} = e.currentTarget.dataset
    console.log('==点击查看', e.currentTarget.dataset)
    if(coupontype == 1){
      cardlist = cardlist.cardList
    }
    wx.openCard({
      cardList: cardlist,
    })
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