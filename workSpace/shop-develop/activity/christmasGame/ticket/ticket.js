// activity//courierGame/ticket/ticket.js
import {getCouponList,getCouphon} from "../../service/christmasNet"
import {KEYSTORAGE} from '../../../src/const'
import {splitImg} from '../../../utils/utils'
import {TICKET} from '../gameParams'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TICKET,
    yhqArrs : [],

    userData : {},

    canShow : false,
    showTitle : '',
    exchangeImg: splitImg("exchange_btn.png", "common"),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();

    let userData = this.data.userData
    userData = wx.getStorageSync('maristmasData');
    wx.removeStorageSync('maristmasData');
    this.setData({
      userData
    })

    this._getCouponList()
  },
  _getCouponList(){
    getCouponList().then(res => {
        if (res){
            this.setData({yhqArrs : res})
        }
    })

  },
  jilu(){
    wx.setStorageSync('maristmasData', this.data.userData);

    wx.navigateTo({
      url: '../myTicket/myTicket'
    });
  },
  requestGetCoupon(e){

    let item = e.currentTarget.dataset.detail

    if (this.data.userData.points >= parseInt(item.pointsRequire)){
      if (item.stock > 0){
        let _this = this
        wx.showModal({
          title: '提示',
          content: '是否确认兑换',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              
                      let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
  
                      let userData = _this.data.userData
  
                      let json = {
                          phone : userInfo.phone,
                          userId : userData.id,
                          exchangeGiftName : item.giftName,
                          giftId : item.id,
                          giftPic : item.giftPic
                      }
                      getCouphon(json).then(res => {
                          if (res){
                              userData.points -= parseInt(item.pointsRequire)
                              _this.setData({
                                userData,
                                showTitle : item.giftName,
                                canShow : true
                              })
  
                              
                              setTimeout(() => {
                                  _this._getCouponList()
                              }, 1000);
                              
                          }
                      })
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });

      }
      else{
        wx.showToast({
            title: '库存不足',
            icon: 'none'
        });
      }


        
    }
    else{
        wx.showToast({
            title: '金币不足',
            icon: 'none'
        });
    }
  },
  closed(){

    this.setData({
      showTitle : '',
      canShow : false
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

  }
})