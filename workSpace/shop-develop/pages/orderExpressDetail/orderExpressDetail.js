import{getOrderExpressDetail} from '../../service/order.js'
import{getdate, splitImg} from '../../utils/utils.js'
const app = getApp();
const brand = app.config.brand;

import { EVENTS, KEYSTORAGE } from '../../src/const.js'
import events from '../../src/events';
let bigOrderNumber = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumber: '',
    expressList: [],
    waitShipList: [],
    expressAddress: splitImg("express_address.png", "common"),
    expressPosting: splitImg("express_posting.png", "common"),
    expressPackage: splitImg("express_package.png", "common"),
    expressCopy: splitImg("express_copy.png", "common"),
    expressCurrent: splitImg("express_current.png", "common"),
    expressWaiting: splitImg("express_waiting.png", "common"),
    callService: splitImg("express_call.png", "common"),
    backTop: splitImg("express_top.png", "common"),
    isHaveOrder: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 注册刷新
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);
    bigOrderNumber = options.orderNumber;
    // bigOrderNumber = "41120200623103959563";
    this.getDetail(bigOrderNumber);
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setTimeout(() => {
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      } else if(!wx.getStorageSync('user_info')){
        getApp().getCRMInfoFn();
      }
    }, 1000);
    
  },

 /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO) {
      this.getDetail(bigOrderNumber);
    }
  },


  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    events.unregister(this, EVENTS.EVENT_CRMINFO);
    events.unregister(this, EVENTS.EVENT_LOGINED);
  },

  getDetail: function(_bigOrderNumber){
    getOrderExpressDetail(_bigOrderNumber).then(res =>{
      console.log('=========resresres', res);
        let expressList = res.expressList;
        let expressInfo = '';
        let waitShipListNum = res.waitShipList.length;
        let isAllDone = true;
        for (let i = 0; i < expressList.length; i++) {
            expressList[i].isShowAll = false;
            expressList[i].isShowDetail = "点击查看更多物流详情";
            expressList[i].isShowImage = splitImg("express_showdown.png", "common");
            if(expressList[i].detailList[0] && expressList[i].detailList[0].status !== "签收" ){
              isAllDone = false;
            }
        }
        if(waitShipListNum === 0){
          if(expressList[0].detailList[0] && isAllDone){
            expressInfo = "您的所有包裹已签收,期待您再次购物!";
          } else {
            expressInfo = "包裹离您越来越近,请注意查收!";
          }
        } else {
          expressInfo = "包裹离您越来越近,请注意查收!";
        }

        this.setData({
          isHaveOrder: true,
          orderNumber: res.bigorderCode,
          payTime: res.paymentTime,
          orderCount: res.goodsTotalCount,
          orderPrice: res.payPrice,
          addressDetail: res.province + res.city + res.area + res.detailAddress,
          expressList: expressList,
          waitShipList: res.waitShipList,
          expressInfo: expressInfo,
        })
    }).catch( res=>{
      this.setData({
        isHaveOrder: false,
      })
      wx.showModal({
        title: '提示',
        content: '查询不到此订单！',
        showCancel: false,
        success: (res) => {
          if (res.confirm) {
            app.goBack()
          }
        }
      });
    })
  },


  showExpress: function(e){
    console.log(e);
    let index = e.currentTarget.dataset.index;
    let expressList = this.data.expressList;
    let isShowAll = expressList[index].isShowAll;
    expressList[index].isShowAll = !isShowAll;
    isShowAll = expressList[index].isShowAll;
    if(isShowAll){
      expressList[index].isShowDetail = "点击收起";
      expressList[index].isShowImage = splitImg("express_showup.png", "common");
    } else {
      expressList[index].isShowDetail = "点击查看更多物流详情";
      expressList[index].isShowImage = splitImg("express_showdown.png", "common");
    }

    this.setData({
      expressList,
    })
  },

  copyOrderNum: function(){
    let that = this;
    wx.setClipboardData({
      data:  that.data.orderNumber,
      success: function(res){
        wx.showToast({
          title:'复制成功'
        })
      }
    })
  },

  copyOrderItemNum: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let expressNum = that.data.expressList[index].expressOrderNo;

    wx.setClipboardData({
      data:  expressNum,
      success: function(res){
        wx.showToast({
          title:'复制成功'
        })
      }
    })
  },

  goToTop: function(){
    wx.pageScrollTo({
      scrollTop: 0
    });
  },

   // 拨打电话
   callPhone :function(){
    wx.makePhoneCall({ phoneNumber: '400-862-8888' });
  },
    
})