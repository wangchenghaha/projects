import {translateArray, splitImg, skuToImg, countDown, objToQuery} from '../../../utils/utils'
import {getBargainList, getBargainOrderList, bargainOrderTimeOut} from '../../../service/bargain'
import {URL_CDN, KEYSTORAGE} from "../../../src/const";
import {wxShowToast} from '../../../utils/wxMethods'
import { createBargainOrder} from '../../../service/bargain'
import {splitCouponImg} from '../../../utils/utils'
var app = getApp();
let { cdn, barginCode} = app.config;
function isHaveStock(colors){
    let isHave = false;
    for (let k = 0; k < colors.length; k++) {
      if(colors[k].sizes){
        for (let i = 0; i < colors[k].sizes.length; i++) {
          if(colors[k].sizes[i].stock > 0){
            isHave = true;
            break;
          }
        }
      }
    }
    return isHave;
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actImage:splitImg("helpBgImg.png?v="+Math.floor(Math.random()*100000)),
    bargainListSuccess:[],
    bargainTitle: app.config.brand === 'FOL' ? '0元底价疯狂砍':'盛夏享惠狂欢',
    goodsName: "",
    bargainNum: 2342,
    singlePrice: "300.00",
    dargainPrice: "220.00",
    timeObj : {
      hou: '00',
      min: '00',
      sec: '00'
    },
    bargainList: [],
    isShowNotice: false,
    bargainNums: 2345,
    activityTitle: "活动规则",
    ruleList: [],
    leftImage: splitImg("activity_fly_left.png"),
    rightImage: splitImg("activity_fly_right.png"),
    activityPic: splitImg("activity_show.gif"),
    stockless: splitImg("bargain_stockless_gray.png", "common"),
    showActivity: false,
    AlreadyBargain: '',
    bargainAct:{},
    showInfo: false,
    couponInfo : {},
    couponImage: 'http://cdn.bestseller.com.cn/memberImage/FOL/1CR12000257.jpg',
    showGoods: false,
    showCoupon: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取活动ID
    barginCode = options.barginCode || barginCode;
    let isShowActivity = wx.getStorageSync("isActivity") || false;
    if(!isShowActivity){
      this.setData({
        showActivity: true,
      })
      wx.setStorageSync("isActivity", true);
    }

    console.log(this.data.bargainLists);
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
    this._getBargainList();
    if(wx.getStorageSync(KEYSTORAGE.crmInfo)){
      this._getBargainOrderList();
    }
  },

  _getBargainList: function(){

    getBargainList(barginCode).then(res => {
      let goodLists = res.goodsList;
      let couponList = res.bargainCouponList;
      if(goodLists){
        for (let i = 0; i < goodLists.length; i++) {
          let skuToImgParam = {
            size: URL_CDN.IMGSIZE240400,
            sku: goodLists[i].colorList[0].colorCode,
          };
          goodLists[i].picImage = `${cdn}${skuToImg(skuToImgParam)}`;
          let successNum = 0;
          for (let j = 0; j < goodLists[i].colorList.length; j++) {
            for (let k = 0; k <  goodLists[i].colorList[j].sizes.length; k++) {
              let nums = goodLists[i].colorList[j].sizes[k].bargainSuccessCount;
              successNum += nums ? nums : 0
            }
            if(goodLists[i].colorList[j].sizes.length > 0){
              goodLists[i].discountPrice = goodLists[i].colorList[j].sizes[0].discountPrice;
              goodLists[i].floorPrice = goodLists[i].colorList[j].sizes[0].floorPrice;
            }
          }
          goodLists[i].bargainSuccessNum = successNum;
          goodLists[i].isHasStock = isHaveStock(goodLists[i].colorList)
        }
      }
      if(couponList){
        for (let index = 0; index < couponList.length; index++) {
          couponList[index].picImage = splitCouponImg(couponList[index].sku, app.config.brand);
        }
      }
      wx.setStorageSync("ruleList",  JSON.parse(res.bargainActivity.ruleExplain));
      this.setData({
        bargainList: translateArray(goodLists, 3),
        bargainCouponList: couponList,
        ruleList: res.bargainActivity.ruleExplain ? JSON.parse(res.bargainActivity.ruleExplain) : '',
        bargainAct: res.bargainActivity,
      })
    })
  },

  _getBargainOrderList: function(){
    getBargainOrderList().then(res => {
      let bargainInfo = res;
      for (let i = 0; i < bargainInfo.length; i++) {
        if(bargainInfo[i].bargainGoodsDetail){
          let skuToImgParam = {
            size: URL_CDN.IMGSIZE240400,
            sku: bargainInfo[i].bargainGoodsDetail.sku.substring(0,12),
          };
          bargainInfo[i].bargainGoodsDetail.picImage = `${cdn}${skuToImg(skuToImgParam)}`;
          bargainInfo[i].bargainGoodsDetail.endTime = bargainInfo[i].endTime;

          // 判断时间是否过期
          //获取订单创建时间
          let createYear =  bargainInfo[i].createdTime.substring(0, 4) + '/' + bargainInfo[i].createdTime.substring(5, 7) + '/' + bargainInfo[i].createdTime.substring(8, 11);
          let createTime = bargainInfo[i].createdTime.substring(11);
          let createTimer =  parseInt(new Date(`${createYear} ${createTime}`).getTime()) +  1000;
          let addOneDay = createTimer + 86400000;

          // 获取总活动结束时间
          let endTear =  bargainInfo[i].endTime.substring(0, 4) + '/' + bargainInfo[i].endTime.substring(5, 7) + '/' + bargainInfo[i].endTime.substring(8, 11);
          let endTime = bargainInfo[i].endTime.substring(11)
          let endTimer = parseInt(new Date(`${endTear} ${endTime}`).getTime()) +  1000

          let currentTime = new Date().getTime();
          if( bargainInfo[i].orderStatus != "fail"  && currentTime > (addOneDay > endTimer ? endTimer: addOneDay)){
            bargainInfo[i].orderStatus = "fail"
            this._bargainOrderTimeOut(bargainInfo[i].id);
          }
          bargainInfo[i].isOver = bargainInfo[i].orderStatus === "fail";
          bargainInfo[i].isFinish = bargainInfo[i].orderStatus === "success";
          bargainInfo[i].isStockLess = bargainInfo[i].orderStatus === "stockLess";
          bargainInfo[i].couponPic = splitCouponImg(bargainInfo[i].bargainGoodsDetail.sku, app.config.brand);
          this.activityCountDown(bargainInfo[i] , addOneDay > endTimer ? endTimer: addOneDay);
        }
      }
      console.log(bargainInfo);
      this.setData({
        bargainListSuccess: bargainInfo,
      })
    })
  },

  _bargainOrderTimeOut: function(bargainOrderId){
    bargainOrderTimeOut(bargainOrderId).then(res=>{

    })
  },

  onClick: function(e){
    console.log("eee", e)
    let index = e.currentTarget.dataset.index;
    let type =  e.currentTarget.dataset.type;
    let _code = e.currentTarget.dataset.code;
    let _item = e.currentTarget.dataset.item;
    let _stock = e.currentTarget.dataset.stock;
    switch(type){
      case "goBargain":
          let orderStatus = this.data.bargainListSuccess[index].orderStatus;
          let orderType = this.data.bargainListSuccess[index].orderType;
          switch(orderStatus){
            case "fail":
                wxShowToast("此单已关闭！");
              break;
            case "bargain":
              wx.navigateTo({
                url: '../bargainShareView/bargainShareView?orderId='+ _code,
              })
              break;
            case "success":
              if(orderType === 0){
                wx.setStorageSync("dargainOrder", this.data.bargainListSuccess[index]);
                wx.navigateTo({
                  url:'../bargainOrderSave/bargainOrderSave'
                })
              } else {
                let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[app.config.brand];
                wx.navigateTo({
                  url: '../../../member/myCouponList/myCouponList?name=' + name
                })
              }
              break;
            case "stockLess":
                wxShowToast("该商品已售罄！");
                break
          }

        break;
      case "goDetail":
          if(_stock){
            let shareOptions = {
              goodsCode: _code
            };
            wx.navigateTo({
              url: '../bargainContent/content'+ objToQuery(shareOptions),
            })
          } else {
            wxShowToast("该商品已售罄！");
          }
          break;
      case "goShare":
          wx.navigateTo({
            url: '../bargainShareView/bargainShareView?orderId='+ _code,
          })
          break;
      case 'goCoupon':
          this.setData({
            showInfo: true,
            couponInfo: _item,
            bargainNum: _item.helpCount,
            couponMark: _item.remark,
          })
          break;
      case 'close':
          this.setData({
            showInfo: false,
          })
          break;
      case 'couponOrder':
          this.creatCouponOrder();
          break;
    }

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

   // 倒计时
   activityCountDown:function( bargainInfo, endTime){
    let that = this;
    // var year =  endTime.substring(0, 4) + '/' + endTime.substring(5, 7) + '/' + endTime.substring(8, 11);
    // var time = endTime.substring(11)
    setInterval(() => {
      // let endTime = parseInt(new Date(`${year} ${time}`).getTime()) +  1000
      let countTimer = countDown(endTime);
      // bargainInfo.countDownTime = countTimer;
      let bargains = that.data.bargainListSuccess
      for (let i = 0; i < bargains.length; i++) {
        if(bargains[i].id === bargainInfo.id){
          bargains[i].countDownTime = countTimer;
        }
      }
      that.setData({
        bargainListSuccess: bargains
      })
    }, 1000);
},

  closeBtn: function(){
    this.setData({
      showActivity: false,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let path = '/activity/bargain/bargainList/bargainList';
    return {
      path: path,
      success: function (res) { },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  showActivity: function(){
    this.setData({
      isShowNotice: true,
    })
  },

  closeThisPop: function(){
    this.setData({
      isShowNotice: false,
    })
  },


  creatCouponOrder: function(){
    if (!app.checkLogin()) {
      return;
    }
    let activity = this.data.bargainAct;
    let couponInfo =  this.data.couponInfo;
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let bargainShareDetailList = [];
    let bargainShareDetail = {
      goodsAcivityId: activity.id, //活动ID
      miniOpenid: wx.getStorageSync(KEYSTORAGE.openid), //小程序OPENID
      miniNickname: wxInfo.nickName, //昵称
      facePic: wxInfo.avatarUrl // 头像
    }
    let orderParam = {
      crmId: wx.getStorageSync(KEYSTORAGE.crmInfo).memberno,
      brand: app.config.brand,
      endTime: activity.endTime,
      bargainCode: activity.id,
      contactTel: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
      bargainCount: couponInfo.helpCount,
      bargainTitle: activity.bargainName,
      goodsActivityId: activity.id,
      orderType: couponInfo.bargainGoodsType,
      bargainGoodsDetail: couponInfo,
      bargainShareDetailList: bargainShareDetailList.concat(bargainShareDetail)
    }
    wx.showLoading({
      title: '生成中...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => { }
    });
    createBargainOrder(orderParam).then(res => {
      if (res) {
        wx.hideLoading();
        this.setData({
          showInfo: false,
        });
        wx.navigateTo({
          url: '../bargainShareView/bargainShareView?orderId=' + res.id + '&dragainContent=content',
        })
      }
    }).catch(res => {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: res.msg,
        showCancel: false,
        success: function (res) {
          wx.navigateBack({
            delta: 1,
          })
        }
      });
    })
  }

})
