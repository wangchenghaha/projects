// activity/bargain/bargainShareView/bargainShareView.js
import QRCode from '../../../utils/weapp-qrcode.js'
import {getBargainOrderDetail, getBargainRecodeList, getBargainSuccessList} from "../../../service/bargain"
import {skuToImg, objToQuery, splitImg, countDown, jianfa, toDecimal, splitCouponImg} from '../../../utils/utils'
import {URL_CDN, KEYSTORAGE} from "../../../src/const";
import {getImageInfo, saveImageToPhotosAlbum} from '../../../service/saveImg' 
import {getWxaCodeUnpubAddrQR} from "../../../service/guide";
import { createExchangeOrder } from '../../../service/order.js';
var app = getApp();
const cdn = app.config.cdn;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    yaoqingImg : splitImg("yaoqing.png"),
    fuyongLeftImg : splitImg("activity_fly_left.png"),
    fuyongRightImg : splitImg("activity_fly_right.png"),
    bouncedSuccessImg :splitImg("bouncedSuccess.png"), 
    bouncedPicImg :app.config.brand === 'FOL'? splitImg("bouncedPicImg.png?v=1") : splitImg("bargain_save_backgroun.jpg"),
    couponPicImg: splitImg("coupon_toast.jpg"),
    goHomeImg: splitImg('icon_home.png', 'common'),
    wxFriendsImg: splitImg('wx_friends.png', 'common'),
    shareCouponImage: splitImg('shareCouponPic.png', 'common'),
    // 展示砍掉多少钱
    canShowSuccess : false,
    // 图片保存
    canShowPic : false,
    // 二维码图片
    qrImg : '',
    // 二维码宽高适配
    qrViewWidthRPX : 180,
    qrViewHeightRPX : 180,
    goodsDetail: "",
    bargainInfo:'',
    dragainIng: true,
    dragainPrice: '',
    alreadyBargainPrice: '',
    residuePrice: '',
    widthPercent: '',
    ruleList: [],
    isShowNotice: false,
    bargainRecodeList: [],
    bargainSuccessList: [],
    activityTitle: "活动规则",
    showGoods: false,
    showCoupon: false,
    isFol: app.config.brand === 'FOL' ? true : false,
    covers:[
             "限时爆品任你选，双11好物0元带回家",
             "时尚单品免费拿，更有首页惊喜等你来探！",
             "双11心动好物0元开抢！这波“羊毛”不来薅 ？"
            // "砍价狂欢，快喊朋友来补刀，0元潮品带回家！",
            // "让朋友帮你，没有最低只有更低，0元潮品等你来拿",
            // "朋友一生一起走，帮砍一刀有没有！"
          ],
  },
  // 关闭砍掉弹框
  bouncedTap : function(){this.setData({canShowSuccess : false})},
  // 保存图片
  shareImage : function(){this.setData({canShowPic : true})},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    this.setData({
      ruleList: wx.getStorageSync("ruleList"),
    });
    this._getBargainOrderDetail(options.orderId, options.dragainContent || '');
    this._getBargainRecodeList(options.orderId);
    this._getBargainSuccessList();
  },

  _getBargainOrderDetail: function(_orderId, isContent){
    getBargainOrderDetail(_orderId).then(res =>{
        let goodsDetail = res.bargainGoodsDetail;
        let skuToImgParam = {
          size: URL_CDN.IMGSIZE240400,
          sku: goodsDetail.sku.substring(0, 12),
        };
        console.log("...........", jianfa(res.goodsSumPrice, res.currentPrice))
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
        this.activityCountDown( addOneDay > endTimer ? endTimer: addOneDay);
        if(isContent && isContent === 'content'){
          this.setData({
            canShowSuccess: true,
            dragainPrice: toDecimal(jianfa(res.goodsSumPrice, res.currentPrice))
          })
        }
        res.isOver = res.orderStatus === 'fail'
        res.isFinish =  res.orderStatus === 'success'
        let percent = ((toDecimal(jianfa(res.goodsSumPrice, res.currentPrice)) / res.goodsSumPrice * 10000) / 100) + "%"
        console.log("percent =======", percent)
        this.setData({
          bargainInfo: res,
          goodsDetail: goodsDetail,
          alreadyBargainPrice: toDecimal(jianfa(res.goodsSumPrice, res.currentPrice)),
          residuePrice: toDecimal(jianfa( res.currentPrice, res.bargainGoodsDetail.floorPrice)),
          widthPercent: percent,
          couponImage:  splitCouponImg(res.bargainGoodsDetail.sku, app.config.brand),
          showGoods: res.orderType ? (res.orderType === 0 ? true : false) : true,
          showCoupon: res.orderType === 1 ? true: false,
          //alreadyBargainNum: toDecimal(jianfa(res.bargainGoodsDetail.helpCount, res.remainHelpCount)),
          alreadyBargainNum: res.bargainShareDetailList.length,
          residueNum: res.remainHelpCount,
        })
        this.createQrView()
        if(res.orderStatus === 'stockLess'){
          wx.showModal({
            title: '提示',
            content: "很遗憾，您所选购的商品已砍光，再看看其他美装吧！",
            showCancel: false,
            success: function (res) {
              wx.navigateBack({
                delta: 1,
              })
            }
          });
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

  _getBargainSuccessList: function(){
    getBargainSuccessList().then(res=>{
      if(res[0]){
        for (let i = 0; i < res.length; i++) {
          if(i>3){
            break;
          }
           let shareSize = res[i].bargainShareDetailList.length;
           res[i].userPic = res[i].bargainShareDetailList[shareSize - 1].facePic;
           res[i].userNikeName =  res[i].bargainShareDetailList[shareSize - 1].miniNickname;
           res[i].createdTime = res[i].createdTime.substring(0, 11)
           res[i].contactTel = res[i].contactTel.substr(0,3)+"*".repeat(4)+res[i].contactTel.substr(7)
        }
        let success = [];
        if(res.length > 3){
          for (let i = 0; i < 3; i++) {
            success.push(res[i])
          }
        } else {
          success = res;
        }
        this.setData({
          bargainSuccessList: success
        })
      }
    })
  },

  createQrView : function(){

    wx.showLoading({title:'加载中...', mask: true});
    let scene = this.data.bargainInfo.id
    let utmSource = "bargin";
    let utmMedium = 'usershare';
    let utmTerm = this.data.bargainInfo.bargainCode;
    let utmCampaign =  '';
    const param = {
      scene,
      page: 'activity/bargain/bargainHelpView/bargainHelpView',
      is_hyaline: false,
      width : this.data.qrViewWidthRPX,
      height : this.data.qrViewWidthRPX,
      utmSource,
      utmMedium,
      utmTerm,
      utmCampaign
    };
    // console.log(`aaaaaa:${JSON.stringify(param)}`)
    // aaaaaa:{"scene":"123321","page":"livePlayer/playerDetail/playerDetail","is_hyaline":false,"width":120,"height":120}
    console.log("=========barginInfo=======",param)
    getWxaCodeUnpubAddrQR(param).then(res=>{
      wx.hideLoading();
      this.setData({qrImg : res});
    }).catch(err=> {
      wx.hideLoading();
      console.log(err)
    });

  },

  saveImageTap : function(){
    if(this.data.isFol){
      let _this = this;
      app.isAuthor({
        type: 'scope.writePhotosAlbum',
        title: '需要授权相册权限才能保存',
        callBack: _this.saveImage,
      })
    } else {
      if(this.data.showGoods){
        this.createImageCanvas();
      } else {
        this.createCouponImageCanvas();
      }
     
    }
  },
  
  saveImage:function(){
      var text = '保存成功'
      // 获取图片信息
      getImageInfo(this.data.qrImg).then(res=>{
        saveImageToPhotosAlbum(res).then(res=>{
          if (res.errMsg != 'saveImageToPhotosAlbum:ok'){
            text = res.errMsg
          }
          wx.showToast({
            title: text, //提示的内容,
            icon: 'none', //图标,
            duration: 2000, //延迟时间,
            mask: true, //显示透明蒙层，防止触摸穿透,
            success: res => {}
          });
          this.setData({
            canShowPic: false,
          })
        })
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

  toPay: function(){
    let isFinish = this.data.bargainInfo.isFinish;
    if(isFinish){
      wx.setStorageSync("dargainOrder", this.data.bargainInfo);
      wx.navigateTo({
        url:'../bargainOrderSave/bargainOrderSave'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

      // let title = app.config.brand === 'FOL'?'就差你了，帮我砍一刀，大额优惠券免费拿回家！' : '就差你了，帮我砍一刀, 商品更优惠！'
      let title = this.data.covers[Math.floor(Math.random()*3)]
      let json = {
        bargainId : this.data.bargainInfo.id,
        utm_source: "bargin",
        utm_medium: 'usershare',
        utm_term: this.data.bargainInfo.bargainCode,
        utm_campaign: '',
      }
      console.log("=============objToQuery ===========", objToQuery(json));
      let path = `/activity/bargain/bargainHelpView/bargainHelpView${objToQuery(json)}`
      let imageUrl = app.config.brand === 'FOL'? `${this.data.bouncedSuccessImg}` : `${this.data.shareCouponImage}`  
      console.log(`分享成功:${path}`)
      return{
        title: title,
        path : path,
        imageUrl : imageUrl,
        success:function(e){
          console.log(`分享成功:${path}`)
        },
        fail:function(e){
          console.log(`分享失败`)
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

    closeFaceToFace: function(){
      this.setData({
        canShowPic: false,
      })
    },

    onUnload: function () {
      wx.removeStorageSync('ruleList')
    },

    goback: function(){
      app.goBack();
    },

    async createImageCanvas(){
      const {bouncedPicImg, goodsDetail,  qrImg} =  this.data;
      let bouncedPicImgInfo = await getImageInfo(bouncedPicImg, true) ;
      let goodsDetailImgInfo = await getImageInfo(goodsDetail.picPath, true) ;
      let qrImgInfo = await getImageInfo(qrImg, true) ;
     
      console.log(qrImgInfo, goodsDetailImgInfo, bouncedPicImgInfo,'**')
      const ctx = wx.createCanvasContext('dargainCanvas');
      ctx.clearRect(0, 0,  589, 700)
      ctx.drawImage(bouncedPicImgInfo.path, 0, 0,
        bouncedPicImgInfo.width , bouncedPicImgInfo.height)
      let goodsName = ""
      if(goodsDetail.goodsName.length > 11){
        goodsName = goodsDetail.goodsName.substr(0,11)+"..."
      } else {
        goodsName = goodsDetail.goodsName;
      }
      ctx.font = `normal bold 20px sans-serif`;
      ctx.fillText(goodsName, 320, 120)
      ctx.font = `normal bold 20px sans-serif`;
      ctx.fillText("可砍至：" + goodsDetail.floorPrice+ "元", 320, 160)
      ctx.font = `normal 16px sans-serif`;
      ctx.fillStyle = `#7b7b7b`;
      ctx.fillText("吊牌价：" + goodsDetail.originalPrice+ "元", 320, 186)
      ctx.drawImage(goodsDetailImgInfo.path, 50, 50, goodsDetailImgInfo.width ,  goodsDetailImgInfo.height )
      ctx.drawImage(qrImgInfo.path, 360, 260, qrImgInfo.width * 0.6,  qrImgInfo.height * 0.6)
      ctx.draw(true, ()=>{
       wx.canvasToTempFilePath({
           x: 0,
           y: 0,
           width:  589,
           height: 700,
           destWidth: 589 * 2,  //解决生成图模糊问题
           destHeight: 700 * 2,    //解决生成图模糊问题
           canvasId: "dargainCanvas",
           success(res) {
              app.saveImage(res.tempFilePath);
           }
         })
    });
  },

  async createCouponImageCanvas(){
    const {couponPicImg, couponImage,  qrImg} =  this.data;
    let bouncedPicImgInfo = await getImageInfo(couponPicImg, true) ;
    let saveCouponImage = await getImageInfo(couponImage, true);
    let qrImgInfo = await getImageInfo(qrImg, true) ;
    console.log(qrImgInfo, saveCouponImage, bouncedPicImgInfo,'**')
    const ctx = wx.createCanvasContext('dargainCanvas');
    ctx.clearRect(0, 0,  574, 603)
    ctx.drawImage(bouncedPicImgInfo.path, 0, 0,
      bouncedPicImgInfo.width , bouncedPicImgInfo.height)
    ctx.drawImage(saveCouponImage.path, 0, 0, saveCouponImage.width * 0.87,  saveCouponImage.height * 0.87)
    ctx.drawImage(qrImgInfo.path, 230, 320, qrImgInfo.width * 0.4,  qrImgInfo.height * 0.4)
    ctx.draw(true, ()=>{
     wx.canvasToTempFilePath({
         x: 0,
         y: 0,
         width:  574,
         height: 603,
         destWidth: 574 * 2,  //解决生成图模糊问题
         destHeight: 603 * 2,    //解决生成图模糊问题
         canvasId: "dargainCanvas",
         success(res) {
            app.saveImage(res.tempFilePath);
         }
       })
  });
},
  
})