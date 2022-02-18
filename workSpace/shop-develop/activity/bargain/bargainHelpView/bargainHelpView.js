import {getBargainOrderDetail, getBargainShare, getBargainSuccessList, getBargainRecodeList} from "../../../service/bargain"
import {URL_CDN, KEYSTORAGE} from "../../../src/const";
import {skuToImg, splitImg, countDown, jianfa, toDecimal, splitCouponImg} from '../../../utils/utils'
import {wxShowToast} from '../../../utils/wxMethods'
var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
const dmpModule = {
  userLike: 'firstPage',
  hotSale: 'firstPageHot'
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 展示砍掉多少钱
    canShowSuccess : false,
    bouncedSuccessImg :splitImg("bouncedSuccess.png"),
    kanImg : splitImg("kan.png"),
    xiangImg : splitImg("xiang.png"),
    goHomeImg: splitImg('icon_home.png', 'common'),
    bgImg : splitImg("helpBgImg.png?v="+Math.floor(Math.random()*100000)),
    fuyongLeftImg : splitImg("activity_fly_left.png"),
    fuyongRightImg : splitImg("activity_fly_right.png"),
    goodsDetail: "",
    bargainInfo:'',
    timeObj : {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    },
    userLikeArr: [],// 猜你喜欢
    hotSaleArr: [], // 热销
    alreadyBargainPrice: '',
    residuePrice: '',
    widthPercent: '',
    lowPrice: '',
    isOver: false,
    isFinish: false,
    bargainPrice: '',
    userfacePic: '',
    projeckName: 'firstPage',
    showGoods: false,
    showCoupon: false
  },
  // 活动规则
  hdgzTap : function(){},
  // 关闭砍掉弹框
  bouncedTap : function(){this.setData({canShowSuccess : false})},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log("options= ====== ==  = =", options);
    let json = '';
    if (options.scene){
      let scan_url = decodeURIComponent(options.scene);
      let utmSource = decodeURIComponent(options.utmSource);
      let utmMedium = decodeURIComponent(options.utmMedium);
      let utmTerm = decodeURIComponent(options.utmTerm);
      let utmCampaign = decodeURIComponent(options.utmCampaign);
      json = {
        bargainId : scan_url,
        utm_source :utmSource,
        utm_medium : utmMedium,
        utm_campaign: utmCampaign,
        utm_term : utmTerm 
      }
    } else {
      json = {
        bargainId : options.bargainId,
        utm_source :options.utm_source,
        utm_medium :  options.utm_medium,
        utm_campaign: options.utm_term,
        utm_term : options.utm_term
      }
    }
    console.log("json= ====== ==  = =", json);
    this._getBargainOrderDetail(json.bargainId);
    this._getBargainSuccessList();
    this._getBargainRecodeList(json.bargainId);
    app.setUtmOptions(json);
    let data = {
      eventName : "好友帮砍",
      eventValue : json.bargainId,
      utm_source : json.utm_source,
      utm_medium : json.utm_medium,
      utm_campaign: json.utm_medium,
      utm_term : json.utm_medium,
    }
    app._collectData2(data);
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

  helpBargain: function(){
    let bargain = this.data.bargainInfo;
    let data = this.data;

    if(data.isOver){
      wxShowToast("助力已结束！");
      return;
    }

    if(data.isFinish){
      wxShowToast("助力已成功！");
      return;
    }

    if(!app.checkLogin()){
      return;
    }

    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let BargainDetail = {
      bargainId:bargain.id,
      brand: app.config.brand,
      facePic: wxInfo.avatarUrl,
      miniNickname:  wxInfo.nickName,
      goodsAcivityId: bargain.goodsActivityId,
      miniOpenid: wx.getStorageSync(KEYSTORAGE.openid), //小程序OPENID,
    }
    this._getBargainShare(BargainDetail);
    
  },

  joinBargain: function(){
    // if(app.config.brand === 'ONLY'){
    //   let code = "120201584";
    //   wx.navigateTo({
    //     url: '../bargainContent/content?goodsCode=' + code
    //   })
    // } else {
      wx.navigateTo({
        url: '../bargainList/bargainList'
      })
    // }
  },  

  _getBargainOrderDetail: function(_orderId){
    getBargainOrderDetail(_orderId).then(res =>{
      let goodsDetail = res.bargainGoodsDetail;
      let skuToImgParam = {
        size: URL_CDN.IMGSIZE240400,
        sku: goodsDetail.sku.substring(0, 12),
      };
      goodsDetail.picPath = `${cdn}${skuToImg(skuToImgParam)}`;
      // 判断时间是否过期
      //获取订单创建时间
      let createYear =  res.createdTime.substring(0, 4) + '/' + res.createdTime.substring(5, 7) + '/' + res.createdTime.substring(8, 11);
      let createTime = res.createdTime.substring(11);
      let createTimer =  parseInt(new Date(`${createYear} ${createTime}`).getTime()) +  1000;
      let addOneDay = createTimer + 86400000;

      // 获取总活动结束时间
      let endTear =  res.endTime.substring(0, 4) + '/' + res.endTime.substring(5, 7) + '/' + res.endTime.substring(8, 11);
      let endTime = res.endTime.substring(11)
      let endTimer = parseInt(new Date(`${endTear} ${endTime}`).getTime()) +  1000
      this.activityCountDown(addOneDay > endTimer ? endTimer: addOneDay);

      let percent = ((toDecimal(jianfa(res.goodsSumPrice, res.currentPrice)) / (res.goodsSumPrice) * 10000) / 100) + "%"
      let shareSize = res.bargainShareDetailList.length;
      this.setData({
        bargainInfo: res,
        goodsDetail: goodsDetail,
        userfacePic: res.bargainShareDetailList[shareSize - 1].facePic,
        alreadyBargainPrice: toDecimal(jianfa(res.goodsSumPrice, res.currentPrice)),
        residuePrice: toDecimal(jianfa(res.currentPrice,  goodsDetail.floorPrice)),
        widthPercent:percent,
        lowPrice: goodsDetail.floorPrice,
        isOver: res.orderStatus === 'fail',
        isFinish: res.orderStatus === 'success',
        couponImage: splitCouponImg(res.bargainGoodsDetail.sku, app.config.brand),
        showGoods: res.orderType ? (res.orderType === 0 ? true : false) : true,
        showCoupon: res.orderType === 1 ? true: false,
        // alreadyBargainNum: toDecimal(jianfa(res.bargainGoodsDetail.helpCount, res.remainHelpCount)),
        alreadyBargainNum: res.bargainShareDetailList.length,
        residueNum: res.remainHelpCount,
      })
      if(res.orderStatus === 'stockLess'){
        wx.showModal({
          title: '提示',
          content: "很遗憾，该商品已砍光，再看看其他美装吧！",
          showCancel: false,
          success: function (res) {
            wx.redirectTo({
              url: 'pages/index/index'
            })
          }
        });
      }
    })
  },


  _getBargainShare: function(dargainDetail){
    getBargainShare(dargainDetail).then(res => {
        this.setData({
          bargainPrice: res.price,
          canShowSuccess: true,
        })
        this._getBargainOrderDetail(res.bargainId);
        this._getBargainRecodeList(res.bargainId)
    }).catch( err=>{
        if(err === '该用户已经助力，不能重复助力'){
          wxShowToast("您已帮忙助力！");
        } else {
          wxShowToast(err);
        }
    })
  },

  _getBargainSuccessList: function(){
    getBargainSuccessList().then(res => {
      let successList = res.bargainOrderList;
      if(successList[0]){
        for (let i = 0; i < successList.length; i++) {
          if(i>3){
            break;
          }
          console.log("i++++" ,i)
          let goodsDetail = successList[i].bargainGoodsDetail;
          let skuToImgParam = {
            size: URL_CDN.IMGSIZE240400,
            sku: goodsDetail.sku.substring(0, 12),
          };
          goodsDetail.picPath = `${cdn}${skuToImg(skuToImgParam)}`;
           let shareSize = successList[i].bargainShareDetailList.length;
           successList[i].userPic = successList[i].bargainShareDetailList[shareSize - 1].facePic;
           successList[i].userNikeName =  successList[i].bargainShareDetailList[shareSize - 1].miniNickname;
           successList[i].createdTime = successList[i].createdTime.substring(0, 11)
           successList[i].contactTel =successList[i].contactTel ? successList[i].contactTel.substr(0,3)+"*".repeat(4)+successList[i].contactTel.substr(7) : '';
        }
        let success = [];
        if(successList.length > 3){
          for (let i = 0; i < 3; i++) {
            success.push(successList[i])
          }
        } else {
          success = successList;
        }
        this.setData({
          bargainSuccessList: success,
          bargainSuccessNum: res.count,
        })
      }
    })
  },

  _getBargainRecodeList: function(_orderId){
    getBargainRecodeList(_orderId).then(res => {
      if(res[0]){
        this.setData({
          bargainRecodeList: res,
        })
      }
    })
  },

   // 倒计时
   activityCountDown:function(endTime){ 
    let that = this;
    // var year =  endTime.substring(0, 4) + '/' + endTime.substring(5, 7) + '/' + endTime.substring(8, 11);
    // var time = endTime.substring(11)
    setInterval(() => {
      // let endTime = parseInt(new Date(`${year} ${time}`).getTime()) +  1000
      let countTimer = countDown(endTime);
      that.setData({
        timeObj: countTimer,
      })
    }, 1000);
  },

  goback: function(){
    app.goBack();
  }
})