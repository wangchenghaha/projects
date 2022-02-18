import {getAddress, updateAddress, delAddress} from "../../service/member.js"
import {wxShowToast} from '../../utils/wxMethods'
var app = getApp();


Page({

  //页面的初始数据8
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    // 添加地址时控制自动填写还是微信
    getWxAddress : 1,
    null_isShow : false,
    addresses : [],
    wrap_hidden : 'none',
    dingdan : '',
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    if(options.dingdan){
      this.setData({
        dingdan: options.dingdan,
      })
    }
   
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {
  
  },

  //生命周期函数--监听页面显示
  onShow: function () {
    var getWxAddress = this.data.getWxAddress
    if (this.data.null_isShow){
      getWxAddress = 1
    }
    else{
      if (wx.getStorageSync('isAuthor') == '1'){
        getWxAddress = 1
      }
      else if (wx.getStorageSync('isAuthor') == '0'){
        getWxAddress = 2
      }
      else{
        getWxAddress = 1
      }
    }
    this.setData({
      getWxAddress
    })
    wx.removeStorageSync('isAuthor')
    this.getAddressData();
    app.track();

  },

  /**
   * 获取地址
   */
  getAddressData: function(){
    getAddress().then(res=>{
      var data = res;
      if(res.length){
        res.forEach(item => {
          item.checked = item.defaultAddress === 'Y'
        });
        this.setData({addresses: res, null_isShow: false})
      }else{
        this.setData({
          null_isShow : true,
        });
      }
    })
  },

  //新增地址
  addAddress : function(){
    wx.setStorageSync('xiugaiAddress', {});
    wx.setStorageSync('getWxAddress', this.data.getWxAddress);
    app.gioTrack('pageclick_personalcenter_myCoupons_addaddress')
    if(this.data.dingdan == "200"){
      wx.redirectTo({
        url: '../addAddress/addAddress'
      })
    } else{
      wx.navigateTo({
        url: '../addAddress/addAddress'
      });
    }
  },

  //点击地址是否返回到商品订单
  liCon : function(e){
    const index = e.currentTarget.id;
    const pageList = getCurrentPages();
    const prevPageUrl = pageList[pageList.length - 2].route;
    wx.setStorageSync('dingdanAddress', this.data.addresses[index]);
    wx.navigateBack({
      delta : 1
    });
  },

  switchChange: function(e){
    let index = e.currentTarget.id;
    let {addresses} = this.data;
    if(e.detail.value){
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      const {id} = addresses[index];
      const param = {
        id,
        defaultAddress: "Y"
      };
      updateAddress(param).then(res => {
        if(res){
          wxShowToast('设为默认地址成功');
          addresses.forEach(item => {
            item.checked = item.id === id;
          });
          this.setData({addresses});
        }
      }).catch(err => wxShowToast(err.message));
    }
  },

  //删除地址
  deleteAddress : function(e){
    const {index} = e.currentTarget.dataset;
    let {addresses} = this.data;
    const that = this;
    const addressId = addresses[index].id;
    wx.showModal({
      title: '提示',
      content: '确认删除该地址吗？',
      success: function (res) {
        if (res.confirm) {
          delAddress(addressId).then(res => {
            if(res){
              addresses = addresses.filter(item => item.id !== addressId);
              if(addresses.length === 0){
                that.setData({
                  null_isShow: true
                })
              }else{
                that.setData({
                  addresses:addresses
                });
              }

            }
          }).catch(err => wxShowToast(err.message));

        } else if (res.cancel) {
        }
      }
    })
  },

  //修改地址
  xiugaiAddress : function(e){

    const {index} = e.currentTarget.dataset;
    wx.setStorageSync('xiugaiAddress', this.data.addresses[index]);
    wx.setStorageSync('getWxAddress', 0);
    if(this.data.dingdan == "200"){
      wx.redirectTo({
        url: '../addAddress/addAddress'
      })
    } else{
      wx.navigateTo({
        url: '../addAddress/addAddress'
      });
    }
  }
  
})