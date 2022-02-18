// pages/content_new/content.js
import { getLuckBagJson, getStockNew, getDetailPage, getLuckbagStock} from '../../../service/goods'
import { skuToImg,  getNineSku ,objToQuery} from '../../../utils/utils'
import {wxShowToast} from '../../../utils/wxMethods'
import {KEYSTORAGE, URL_CDN, URL} from "../../../src/const";
const app = getApp();
const cdn = app.config.cdn;
const whiteColor = '#fff', blackColor = '#000';
let goodCodeID = '';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
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
        event: 'buy',
        bgColor: '#d70715',
        color: whiteColor,
        name: '立即购买',
        isShow: true,
      }
    ],

    // 小图展示
    goodsImg: '',
    stocks: 0,
    selectGoodsInfo: [],
    detailShow: false,
    detailPic: "",
    packagePrice: '',
    originalPrice: '',
    isSell: true,
    luckbagName: '',
    detailImage: '',
    titleBar: '',
    sizeNameSlt: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.share_by){
      wx.setStorageSync('shareFromDaogouID', options.share_by);
      wx.setStorageSync('openShareTime', Date.now());
      let shareFromDaogouPageInfo = options;
      shareFromDaogouPageInfo.type = 'zhuanfa';
      app.setShareInfo(shareFromDaogouPageInfo);
    }
    let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    this.setData({
      guideNo: guideInfo.employeeId,
    })
    goodCodeID = options.goodsCode;
    if(options.goodsCode === '320433015'){
      this.getGoodsDetailFn(URL.LUCKBAGJSON_320433015);
    } else {
      this.getGoodsDetailFn(URL.LUCKBAGJSON_320433013);
    }

  },
  // 改变图片
  changeColorImg: function(sku){
    let skuToImgParam = {
      size: URL_CDN.IMGSIZE240400,
      sku,
    };
    this.setData({goodsImg: `${cdn}${skuToImg(skuToImgParam)}`})
  },
  // 库存计算
  computerStock: function(sizeArr){
    let stock = 0;
    sizeArr.forEach(itemSize => stock = stock + itemSize.newSellStock);
    return stock
  },

  getGoodsDetailFn: function(lukyBagUrl){
    const wxData = this.data;
    let swiper = wxData.swiper,
      goods = wxData.goods,
      goodsColor = '',
      colorDefaultIndex = 0,
      selectGoodsInfo = wxData.selectGoodsInfo,
      fixedBottom = wxData.fixedBottom;
      wx.showLoading({
        mask:true,
      })
    getLuckBagJson(lukyBagUrl).then(res => {
      wx.hideLoading();
      goodsColor = res.color;
      let goodsGift = res.gift;
      if(goodsColor){
        const defaultGoods = res.color[colorDefaultIndex];
        // 轮播图
        for(let i = 0; i < defaultGoods.picurls.length; i++){
          let pic = cdn+defaultGoods.picurls[i];
          swiper.data.push(pic);
        }
        let detailPic = cdn + res.contentPic;
        let detailImage = cdn + res.goodsDetailImg
        let packagePrice = res.packagePrice;
        let originalPrice = res.originalPrice;
        let titleBar = res.titleBar;
        let skuToImgParam = {
          size: URL_CDN.IMGSIZE240400,
          sku: goodsColor[0].colorCode,
        };

        // 默认选中商品信息
        let goodsInfo = {
          "goodsName": res.goodsName,
          "goodsCount":1,
          "gscolPicPath": skuToImg(skuToImgParam),
          "price":goodsColor[0].price,
          "originalPrice":goodsColor[0].originalPrice,
          "discount":goodsColor[0].discount,
          "colorName":goodsColor[0].colorAlias,
          "sizeName":'',
          "gcsSku":'',
          "goodsColorCode":goodsColor[0].colorCode,
        };
        let giftInfo = {
          "goodsName": goodsGift.goodsName,
          "goodsCount":1,
          "gscolPicPath":goodsGift.picurls,
          "price":goodsGift.price,
          "originalPrice":goodsGift.originalPrice,
          "discount":goodsGift.discount,
          "goodsColorCode":goodsGift.colorCode,
          "colorName":goodsGift.colorAlias,
          "sizeName": goodsGift.sizeAlias,
          "gcsSku":goodsGift.sku,
        };
        selectGoodsInfo.push(goodsInfo);
        selectGoodsInfo.push(giftInfo)
        this.changeColorImg(defaultGoods.colorCode);
        let luckbagName = giftInfo.goodsName;
        this.setData({swiper, goods, goodsColor, colorDefaultIndex, selectGoodsInfo, detailPic, packagePrice, originalPrice, luckbagName, detailImage, titleBar});
      }
      let param = res.gift.sku;
      let projeckCode = res.projectCode;
      return {
        param,
        projeckCode
      };
    }).then( res => {
      const {param, projeckCode} = res;
      // 获取库存
      getLuckbagStock(param).then( stockRes => {

        let isSell = (stockRes.status === 'open');
        if(!isSell){
          fixedBottom[0].event='gone';
          fixedBottom[0].bgColor='#999';
          fixedBottom[0].color= whiteColor;
          fixedBottom[0].name='已售罄'
        }
        this.setData({isSell, fixedBottom});
        this.setData({
          stocks: stockRes[param] > 0 ? stockRes[param]: 0
        })
        return {
          param,
          projeckCode
        };
      })
      .then(res =>{
        const {param, projeckCode} = res;
         // 获取库存
         getStockNew(getNineSku(param), '').then( stocks => {
          return {
            param,
            projeckCode,
          };
        }).then( clothesStocks =>{
          const {projeckCode} = clothesStocks;
          getStockNew(getNineSku(projeckCode), '').then( stocks => {
            goodsColor.forEach(item => {
              item.sizes.forEach(sizeItem => {
                sizeItem.newSellStock = stocks[sizeItem.sku];
              });
            });
            this.setData({goodsColor});
          })
        })
      }
      )
      .then( res=> {
        this.loadDetailPage()
      }).catch( err=>{
        wx.hideLoading();
      })
    })
  },


  // loadDetailPage: function(){
  //   getDetailPage(getNineSku(this.data.selectGoodsInfo[1].goodsColorCode)).then(res => {
  //     if(!res.includes('Not Found')){
  //       this.setData({
  //         detailShow:true,  // 详情页是否显示
  //       });
  //       const reg_body = /<body[^>]*>([\s\S]*)<\/body>/;
  //       let bodyContent = reg_body.exec(res)[1];
  //       WxParse.wxParse('article', 'html', bodyContent, this, 5);
  //     }
  //   })
  // },

  onClick: function(e){
    const dataType = e.currentTarget.dataset.type || e.detail.target.dataset.type;
    const isSell = this.data.isSell;
    if(!app.checkLogin()){
      return;
    }
    switch (dataType){
      case 'selectGoods':
        if(!isSell){
          wxShowToast('商品已售罄!');
          return;
        }
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
      case 'buy':
        this.buyFn();
        break;
      case 'gone':
        wxShowToast('商品已售罄!');
        break;
    }
  },

  changeBottom: function(event){
    let fixedBottom = this.data.fixedBottom;
    fixedBottom.forEach(item => item.isShow = !(item.event === event));
    this.setData({fixedBottom});
    this.selectGoods(true);
  },

  //立即购买
  buyFn: function(){
    let showSelectSize = this.data.showSelectSize;
    if(!showSelectSize){
      this.changeBottom('cart');
      return;
    }
    let selectGoodsInfo = this.data.selectGoodsInfo;
    if(!selectGoodsInfo[0].gcsSku){
      wxShowToast('请选择尺码');
      return;
    }
    wx.setStorage({
      key: 'luckbagGoods',
      data: selectGoodsInfo,
      success(){
       app.navigateTo('activity/luckBag/luckBagOrderSave/luckBagOrderSave')
      }
    });
  },
  // 选择颜色
  selectColorFn(e) {
    const index = e.currentTarget.dataset.index || e.detail.target.dataset.index;
    const goodsColor = this.data.goodsColor;
    const selectGoodsInfo = this.data.selectGoodsInfo;
    this.changeColorImg(goodsColor[index].colorCode);
    // 尺码清空
    goodsColor[index].sizes.forEach(item => {
      item.selected = false;

    });
    // 重置选择的商品信息
    selectGoodsInfo[0].gcsSku = '';
    selectGoodsInfo[0].goodsColorCode = goodsColor[index].colorCode;
    selectGoodsInfo[0].colorName = goodsColor[index].colorAlias;
    let skuToImgParam = {
      size: URL_CDN.IMGSIZE240400,
      sku: goodsColor[index].colorCode,
    };
    selectGoodsInfo[0].gscolPicPath = skuToImg(skuToImgParam),
    this.setData({colorDefaultIndex: index, selectGoodsInfo, goodsColor, sizeNameSlt : ''});
    const formId = e.detail.formId;
    if(formId){
      // app.saveFormIdFn(formId)
    }
  },
  // 选择尺码
  selectSizeFn(e){
    const wxData = this.data;
    const dataIndex = e.currentTarget.dataset.index || e.detail.target.dataset.index;
    const goodsColor = wxData.goodsColor;
    const colorIndex = wxData.colorDefaultIndex;
    const selectGoodsInfo = wxData.selectGoodsInfo;
    let goodsColorSize = goodsColor[colorIndex].sizes;
    let stock =''; // 库存
    goodsColorSize.forEach((item, index) => {
      item.selected = index === dataIndex;
      if(item.selected){
        stock = item.newSellStock;
        if(!stock){
          item.selected = false;
          wxShowToast('暂无库存，请重新选择')
        }else{
          selectGoodsInfo[0].sizeName = item.sizeAlias;
          selectGoodsInfo[0].gcsSku = item.sku;
          this.setData({
            stocks: item.newSellStock,
          })
      }
    }

    });
    this.setData({goodsColor, selectGoodsInfo, sizeNameSlt: selectGoodsInfo[0].sizeName});
  },

  selectGoods: function(status){
    const showSelectSize = status || false;
    this.setData({showSelectSize });
    if(!showSelectSize){
      let fixedBottom = this.data.fixedBottom;
      fixedBottom.forEach(item => item.isShow = true);
      this.setData({fixedBottom})
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    let path = '/activity/luckBag/luckBagContent/luckBagContent';
    let title = this.data.luckbagName;
    let shareOptions = {
      goodsCode: goodCodeID,
	    devFlag: app.urlDevFlag(),
    };
    let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let guideId = guideInfo.employeeId || '';
    let guideShop = guideInfo.shopCode || '';
    if(guideId){
      let guideOptions = {
        share_by: guideId,
        share_by_shop: guideShop,
        utm_medium: 'guideshare',
        utm_source: 'miniprogram_zhuanfa',
        utm_term: guideId,
        nickName:wx.getStorageSync(KEYSTORAGE.wxInfo).nickName || '',
	      shareDevice: wx.getStorageSync(KEYSTORAGE.shareDevice) || ''
      };
      Object.assign(shareOptions, guideOptions);
    }
    console.log(path + objToQuery(shareOptions),'********');
    let sharePath = path + objToQuery(shareOptions);
    try {
      app.tdSdkEvent('pageclick_goodsdetail_share', {
        TITLE: title,
        PATH: sharePath
      });
      app.tdShare(title, sharePath);
    }catch (e) {}
    try {
      app.tdsdk.share({
        title: title,
        path: path,
        shareTickets: res.shareTickets
      });
      let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
      let guideId = guideInfo.employeeId || '';
      let collectParam = Object.assign(curOptions, {
        eventName: `单品转发_${contentID}_${guideId}`,
        eventValue: '对话框'
      });
      app._collectData2(collectParam);
    }catch (e) {}
    return {
      title: title,
      path: sharePath,
      imageUrl: that.data.swiper[0],
      success: function (res) { },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
