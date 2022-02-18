// pages/content_new/content.js
import { getDetailPage } from '../../../service/goods'
import { getBargainGoodDetail, createBargainOrder, getBargainSuccessList, getBargainOrderList, bargainOrderTimeOut } from '../../../service/bargain'
import { getNineSku, skuToImg, jiafa, splitImg, objToQuery, timeStamp, countDown} from '../../../utils/utils'
import { wxShowToast } from '../../../utils/wxMethods'
import { URL_CDN, KEYSTORAGE, EVENTS } from "../../../src/const";
import { getAddress } from "../../../service/member.js"
import { getNewExpressFare } from "../../../service/order";
import events from '../../../src/events';
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
let goodsCode = '';
const swiperImgSize = 5;
const whiteColor = '#fff', blackColor = '#000';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    currentPage: false,
    colorDefaultIndex: 0, // 默认颜色索引
    goodsCode: '',
    swiper: {
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 1000,
      data: []
    },
    goods: {},
    goodsColor: [], // 当前颜色
    showSelectSize: false,
    fixedBottom: [
      {
        event: 'more',
        bgColor: blackColor,
        color: whiteColor,
        name: app.config.brand === 'ONLY' ? '活动规则': '查看更多砍价商品',
        isShow: true,
      },
      {
        event: 'bargain',
        bgColor: '#d70715',
        color: whiteColor,
        name: '点我砍价',
        isShow: true,
      }
    ],
    // 小图展示
    goodsImg: '',
    stock: 0,
    selectGoodsInfo: {},
    detailShow: false,
    showAddress: false,
    // 砍价新增
    dargainNum: 2345,
    originalPrice: 399,
    dargainPrice: 299,
    dargainSuccess: [],
    userImage: wx.getStorageSync("userInfo").avatarUrl,
    userName: '阿纳斯塔',
    endTime: '',
    addressList: [],
    showInfo: false,
    showBottom: true,
    orderGoodsInfo: '',
    bargainActivity: '',
    chooseAddress: '',
    dargainTime: "2020-02-02",
    showNoAddress: false,
    showError: false,
    haveAddress: false,
    expressFare: '0',
    freeIcon: splitImg('free_icon.png'),
    refresh:  splitImg('refresh_icon.png'),
    bodyContent: '',
    bargainListSuccess: [],
    isShowNotice: false,
    activityTitle: "活动规则",
    ruleList: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订阅401事件
    events.register(this, EVENTS.EVENT_LOGINED);

    if(options.share_by){
      wx.setStorageSync('shareFromDaogouID', options.share_by);
      wx.setStorageSync('openShareTime', Date.now());
      let shareFromDaogouPageInfo = options;
      shareFromDaogouPageInfo.type = 'zhuanfa';
      app.setShareInfo(shareFromDaogouPageInfo);
    }
    if (options.goodsCode) {
      goodsCode = options.goodsCode;
      console.log("options =====", options)
      this.setData({
        goodsCode,
        colorDefaultIndex: options.colorDefault ? options.colorDefault: 0,
      });
      this._getGoodsDetail();
      this._getExpress();
      this._getBargainSuccessList();
    } else {
      app.goBack();
    }
    this.setData({
      currentPage: true,

    })
  },
  // 改变图片
  changeColorImg: function (sku) {
    let skuToImgParam = {
      size: URL_CDN.IMGSIZE240400,
      sku,
    };
    this.setData({ goodsImg: `${cdn}${skuToImg(skuToImgParam)}` })
  },

  /**
   * 接收401事件(自有平台用户登录态失效)
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED && this.data.currentPage) {
      this.getAddressData();
      this._getBargainOrderList();
      this._getExpress();
    }
  },

  _getGoodsDetail: function () {
    let param = goodsCode;
    const wxData = this.data;
    let swiper = wxData.swiper,
      goods = wxData.goods,
      goodsColor = wxData.goodsColor,
      colorDefaultIndex = wxData.colorDefaultIndex,
      selectGoodsInfo = wxData.selectGoodsInfo;
    wx.showLoading();
    getBargainGoodDetail(param).then(res => {
      wx.hideLoading();
      let goodsDetail = res.goodsDetail;
      let bargainActivity = res.bargainActivity;
      if (!goodsDetail || !bargainActivity) {
        wx.showModal({
          title: '提示',
          content: "该商品已下架",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              delta: 1,
            })
          }
        });
        return;
      }
      let endTimeStamp = timeStamp(bargainActivity.endTime);
      let curTimes = Date.parse(new Date()) / 1000;
      if (curTimes > endTimeStamp) {
        wx.showModal({
          title: '提示',
          content: "活动时间已过！商品已下架！",
          showCancel: false,
          success: function (res) {
            wx.navigateBack({
              delta: 1,
            })
          }
        });
        return;
      }

      if (goodsDetail) {
        goodsColor = goodsDetail.colorList;
        let successNum = 0;
        for (let j = 0; j < goodsDetail.colorList.length; j++) {
          for (let k = 0; k < goodsDetail.colorList[j].sizes.length; k++) {
            let nums = goodsDetail.colorList[j].sizes[k].bargainSuccessCount;
            successNum += nums ? nums : 0
          }
          if (goodsDetail.colorList[j].sizes.length > 0) {
            colorDefaultIndex = j
          }
        }
        const defaultGoods = goodsDetail.colorList[colorDefaultIndex];
        let skuToImgParam = {
          size: URL_CDN.IMGSIZE750750,
          sku: defaultGoods.colorCode,
        };
        // 轮播图
        for (let i = 0; i < swiperImgSize; i++) {
          skuToImgParam.suffix = `T0${i + 1}`;
          swiper.data.push(`${cdn}${skuToImg(skuToImgParam)}`);
        }
        // 默认选中商品信息
        const defaultSize = goodsDetail.colorList[colorDefaultIndex].sizes[0];
        //console.log("goodsDetail === ",goodsDetail)
        selectGoodsInfo = {
          goodsName: goodsDetail.goodsName,
          goodsCode: goodsDetail.productCode,
          color: defaultGoods,
          floorPrice: defaultSize.floorPrice,
          discountPrice: defaultSize.discountPrice,
          stock: defaultSize.stock,
          sizeAlias: defaultSize.sizeAlias,
          sku: defaultSize.sku,
          helpNums: successNum,
          endTime: bargainActivity.endTime.substring(0, 11),
        };
        this.changeColorImg(defaultGoods.colorCode);
        this.setData({ 
          swiper, 
          goods, 
          goodsColor, 
          colorDefaultIndex, 
          selectGoodsInfo, 
          bargainActivity ,
          ruleList: bargainActivity.ruleExplain ? JSON.parse(bargainActivity.ruleExplain) : '',
        });
      }
    }).then(() => {
      this.loadDetailPage()
    })
  },
  loadDetailPage: function () {
    getDetailPage(getNineSku(goodsCode)).then(res => {
      console.log(res,"==========11111111")
      this.setData({
        detailShow: true,
        //bodyContent: res.replace(/<img/g, '<img class="richImg"')
        bodyContent:res
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
  


  onClick: function (e) {
    const dataType = e.currentTarget.dataset.type || e.detail.target.dataset.type;
    let index = e.currentTarget.dataset.index;
    let _code = e.currentTarget.dataset.code;
    if (!app.checkLogin()) {
      return;
    }
    switch (dataType) {
      case 'selectGoods':
        this.selectGoods(true);
        break;
      case 'close':
        this.selectGoods();
        break;
      case 'selectColor':
        this.selectColorFn(e);
        break;
      case 'selectSize':
        this.selectSizeFn(e);
        break;
      case 'bargain':
        this.bargain();
        break;
      case 'more':
        if(app.config.brand === 'ONLY'){
          this.setData({
              isShowNotice: true,
          })
        } else {
          wx.navigateTo({
            url: '../bargainList/bargainList',
          })
        }
        break;
      case 'chooseAddress':
        this.chooseAddress(e);
        break;
      case 'address':
        wx.navigateTo({
          url: '/pages/addAddress/addAddress',
        })
        break;
      case 'refresh':
        this._getBargainOrderList();
        break;
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
              wx.setStorageSync("dargainOrder", this.data.bargainListSuccess[index]);
              wx.navigateTo({
                url:'../bargainOrderSave/bargainOrderSave'
              })
            break;
          case "stockLess":
              wxShowToast("该商品已售罄！");
              break
        }
      break;
    }
  },

  changeBottom: function (event) {
    let btnName = event === "bargain" ? "确定" : "添加地址"
    let fixedBottom = [
      {
        event: event,
        bgColor: blackColor,
        color: whiteColor,
        name: btnName,
        isShow: true,
      }
    ];
    this.setData({ fixedBottom });
    this.selectGoods(true);
  },

  closeThisPop: function(){
    this.setData({
      isShowNotice: false,
    })
  },


  //立即购买
  bargain: function () {
    let showSelectSize = this.data.showSelectSize;
    if (!showSelectSize) {
      this.changeBottom('bargain');
      return;
    }

    const selectGoodsInfo = this.data.selectGoodsInfo;
    if (!selectGoodsInfo.goodsSku) {
      wxShowToast("请选择尺码！");
      return;
    }

    this.changeBottom('address');

    this.setData({
      showAddress: true,
      showSelectSize: false,
    })
  },

  /**
   * 获取地址
   */
  getAddressData: function () {
    wx.showLoading();
    getAddress().then(res => {
      wx.hideLoading();
      if (res[0]) {
        this.setData({
          addressList: res,
          haveAddress: true,
          showNoAddress: false,
        })
      } else {
        this.setData({
          haveAddress: false,
          showNoAddress: true,
        })
      }
    }).catch(e => {
      wx.hideLoading();
      this.setData({
        showError: true
      })
    })
  },

  // 选择颜色
  selectColorFn(e) {
    const index = e.currentTarget.dataset.index || e.detail.target.dataset.index;
    const goodsColor = this.data.goodsColor;
    const selectGoodsInfo = this.data.selectGoodsInfo;
    let stock = 0;
    if (!goodsColor[index].sizes[0]) {
      wxShowToast('该颜色暂无库存！')
      return;
    }
    this.changeColorImg(goodsColor[index].colorCode);
    // 尺码清空
    goodsColor[index].sizes.forEach(item => {
      item.selected = false;
      stock = stock + item.newSellStock;
    });
    // 重置选择的商品信息
    selectGoodsInfo.goodsSku = '';
    selectGoodsInfo.color = goodsColor[index];
    this.setData({ colorDefaultIndex: index, selectGoodsInfo, goodsColor, stock });
  },
  // 选择尺码
  selectSizeFn(e) {
    const wxData = this.data;
    const dataIndex = e.currentTarget.dataset.index || e.detail.target.dataset.index;
    const goodsColor = wxData.goodsColor;
    const colorIndex = wxData.colorDefaultIndex;
    let selectGoodsInfo = wxData.selectGoodsInfo;
    let goodsColorSize = goodsColor[colorIndex].sizes;
    let sizeInfo = { size: {}, goodsSku: '' };
    console.log("selectedGoods1 === ", selectGoodsInfo);
    goodsColorSize.forEach((item, index) => {
      item.selected = index === dataIndex;
      if (item.selected) {
        if (item.stock <= 0) {
          item.selected = false;
          wxShowToast('暂无库存，请重新选择')
        } else {
          sizeInfo = {
            size: item,
            goodsSku: item.sku
          }
          selectGoodsInfo.floorPrice = item.floorPrice
          selectGoodsInfo.discountPrice = item.discountPrice
          selectGoodsInfo.stock = item.stock
          selectGoodsInfo.sizeAlias = item.sizeAlias
          selectGoodsInfo.sku = item.sku
          selectGoodsInfo.helpNums = item.helpCount
        }
      }
    });
    Object.assign(selectGoodsInfo, sizeInfo);
    this.setData({ goodsColor, selectGoodsInfo });
  },

  selectGoods: function (status) {
    const showSelectSize = status || false;
    this.setData({
      showSelectSize,
      showAddress: false,
      showInfo: false,
      showBottom: true,
    });
    if (!showSelectSize) {
      let fixedBottom = [{
        event: 'more',
        bgColor: blackColor,
        color: whiteColor,
        name: app.config.brand === 'ONLY' ? '活动规则': '查看更多砍价商品',
        isShow: true,
      },
      {
        event: 'bargain',
        bgColor: '#d70715',
        color: whiteColor,
        name: '点我砍价',
        isShow: true,
      }];
      fixedBottom.forEach(item => item.isShow = true);
      this.setData({ fixedBottom })
    }
  },

  chooseAddress: function (e) {
    let index = e.currentTarget.dataset.index;
    let wxData = this.data;
    const selectGoodsInfo = wxData.selectGoodsInfo;
    const chooseAddress = wxData.addressList[index];
    let skuToImgParam = {
      size: URL_CDN.IMGSIZE240400,
      sku: selectGoodsInfo.goodsSku,
    };
    let orderGoodsInfo = {
      picImage: `${cdn}${skuToImg(skuToImgParam)}`,
      goodName: selectGoodsInfo.goodsName,
      goodColor: selectGoodsInfo.color.colorAlias,
      goodSize: selectGoodsInfo.size.sizeAlias,
      userName: chooseAddress.userName,
      userPhone: chooseAddress.phone,
      userArea: chooseAddress.province + '   ' + chooseAddress.city + '   ' + chooseAddress.area,
      detailAddress: chooseAddress.detailAddress,
      // 
    }
    this.setData({
      chooseAddress,
      orderGoodsInfo,
      showAddress: false,
      showInfo: true,
      showBottom: false,
    })
  },

  submitBargainOrder: function () {
    const wxData = this.data;
    const selectGoodsInfo = wxData.selectGoodsInfo;
    const bargainActivity = wxData.bargainActivity;
    const chooseAddress = wxData.chooseAddress;
    //  let goodInfos = [];
    let goodInfo = {
      goodsName: selectGoodsInfo.goodsName,
      colorName: selectGoodsInfo.color.colorAlias,
      sizeName: selectGoodsInfo.size.sizeAlias,
      floorPrice: selectGoodsInfo.size.floorPrice,
      sku: selectGoodsInfo.size.sku,
      picPath: selectGoodsInfo.color.picurls[0],
      goodsPrice: selectGoodsInfo.size.discountPrice,
      originalPrice: selectGoodsInfo.size.originalPrice,
      goodsCount: 1,
    }
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    let bargainShareDetailList = [];
    let bargainShareDetail = {
      goodsAcivityId: bargainActivity.id, //活动ID
      miniOpenid: wx.getStorageSync(KEYSTORAGE.openid), //小程序OPENID
      miniNickname: wxInfo.nickName, //昵称
      facePic: wxInfo.avatarUrl // 头像
    }
    console.log(".............")

    // goodInfos.push(goodInfo);
    let orderParam = {
      addressId: chooseAddress.id,
      province: chooseAddress.province,
      city: chooseAddress.city,
      area: chooseAddress.area,
      detailAddress: chooseAddress.detailAddress,
      consignee: chooseAddress.userName,
      contactTel: chooseAddress.phone,
      crmId: wx.getStorageSync(KEYSTORAGE.crmInfo).memberno,
      brand: brand,
      endTime: bargainActivity.endTime,
      bargainCode: bargainActivity.id,
      bargainCount: selectGoodsInfo.size.helpCount,
      bargainTitle: bargainActivity.bargainName,
      currentPrice: selectGoodsInfo.size.discountPrice,
      expressFare: this.data.expressFare || '0',
      goodsActivityId: bargainActivity.id,
      goodsCanLowPrice: selectGoodsInfo.size.floorPrice,
      goodsCount: '1',
      goodsPic: selectGoodsInfo.color.picurls[0],
      goodsPrice: selectGoodsInfo.size.discountPrice,
      goodsSumPrice: selectGoodsInfo.size.discountPrice,
      bargainGoodsDetail: goodInfo,
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
        this.selectGoods();
        wx.navigateTo({
          url: '../bargainShareView/bargainShareView?orderId=' + res.id + '&dragainContent=content',
        })
      }
    }).catch(res => {
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: res,
        showCancel: false,
        success: function (res) {
          wx.navigateBack({
            delta: 1,
          })
        }
      });
    })
  },


  // 新的计算邮费
  _getExpress: function () {
    let expressParam = {
      expressMark: "SP",
      purchaseType: 0,
      sendingMode: 1,
      numberCourieres: 1,
    };
    getNewExpressFare(expressParam).then(res => {
      let expressFare = res.price || '0';
      this.setData({
        expressFare
      })
    });
  },

  againGetAddress: function () {
    this.getAddress();
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
    this.getAddressData();
    this._getBargainOrderList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var contentXinxi = this.data.contentCon;
    if (res.from === 'button') {
      // 来自页面内转发按钮
    };
    let path = '/activity/bargain/bargainContent/content';
    let title = contentXinxi.goodsName;
    let shareOptions = {
      goodsCode: goodsCode,
    };
    let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let guideId = guideInfo.employeeId || '';
    let guideShop = guideInfo.shopCode || '';
    if (guideId) {
      let guideOptions = {
        share_by: guideId,
        share_by_shop: guideShop,
        utm_medium: 'guideshare',
        utm_source: 'miniprogram_zhuanfa',
        utm_term: guideId,
        nickName: wx.getStorageSync(KEYSTORAGE.wxInfo).nickName || '',
        shareDevice: wx.getStorageSync(KEYSTORAGE.shareDevice) || ''
      };
      Object.assign(shareOptions, guideOptions);
    }
    console.log(path + objToQuery(shareOptions), '********');
    let sharePath = path + objToQuery(shareOptions);
    return {
      title: title,
      path: sharePath,
      imageUrl: that.data.slider[0].picUrl,
      success: function (res) { },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  _getBargainSuccessList: function () {

    getBargainSuccessList().then(res => {
      let successList = res.bargainOrderList;
      if (successList[0]) {
        for (let i = 0; i < successList.length; i++) {
          if (i > 3) {
            break;
          }
          let shareSize = successList[i].bargainShareDetailList.length;
          successList[i].userPic = successList[i].bargainShareDetailList[shareSize - 1].facePic;
          successList[i].userNikeName = successList[i].bargainShareDetailList[shareSize - 1].miniNickname;;
          successList[i].createdTime = successList[i].createdTime.substring(0, 11)
          successList[i].contactTel = successList[i].contactTel.substr(0, 3) + "*".repeat(4) + successList[i].contactTel.substr(7)
        }
        let success = [];
        if (successList.length > 3) {
          for (let i = 0; i < 3; i++) {
            success.push(successList[i])
          }
        } else {
          success = successList;
        }
        this.setData({
          dargainSuccess: success
        })
      }
    })
  },

  moreGoods: function(){
    wx.navigateTo({
      url: '../bargainList/bargainList'
    })
  }
})