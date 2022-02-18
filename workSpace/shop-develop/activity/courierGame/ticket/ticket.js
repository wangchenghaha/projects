// activity//courierGame/ticket/ticket.js
import {getCouponList,getCouphon} from "../../service/courierNet"
import {KEYSTORAGE} from '../../../src/const'
const brand = getApp().config.brand
// 图片地址
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/courierImgs/`
const version = Date.now();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    imgPath,
    yhqArrs : [],

    userData : {},


    jinbiImg : '',
    duihuanImg : '',
    noDuihuanImg : '',
    bouncedBtn : '',
    canPlay : '',

    canShow : false,
    showTitle : ''
  },

  ziyuan(){

    let jinbiImg = this.data.jinbiImg
    let duihuanImg = this.data.duihuanImg
    let noDuihuanImg = this.data.noDuihuanImg
    let bouncedBtn = this.data.bouncedBtn
    let canPlay = this.data.canPlay
    jinbiImg = `${imgPath}jinbi.png?v=${version}`
    duihuanImg = `${imgPath}duihuan.png?v=${version}`
    noDuihuanImg = `${imgPath}noDuihuan.png?v=${version}`
    bouncedBtn = `${imgPath}bouncedBtn.png?v=${version}`
    canPlay = `${imgPath}canPlay.png?v=${version}`

    this.setData({
      jinbiImg,
      duihuanImg,
      noDuihuanImg,
      bouncedBtn,
      canPlay
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.hideShareMenu();

    let userData = this.data.userData
    userData = wx.getStorageSync('courierData');
    wx.removeStorageSync('courierData');
    this.setData({
      userData
    })
    this.ziyuan()

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
    wx.setStorageSync('courierData', this.data.userData);

    wx.navigateTo({
      url: '../myTicket/myTicket'
    });
  },
  requestGetCoupon(e){

    let item = e.currentTarget.dataset.detail

    if (this.data.userData.points >= parseInt(item.pointsRequire)){
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