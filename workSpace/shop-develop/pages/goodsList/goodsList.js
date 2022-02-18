// pages/goodsList/goodsList.js
import { getGoodsList , getNearbyShopGoodsList } from '../../service/goods'
import {URL_CDN, KEYSTORAGE, EVENTS} from '../../src/const'
import {skuToImg, getCurrentUrl, chengfa, dateIsOverDue, splitImg, throttle, jiafa} from '../../utils/utils'
import {wxShowToast } from '../../utils/wxMethods'
import events from "../../src/events";
const app = getApp();
const { cdn, brand, showWish, navStockShow} = app.config;
let goodsListParam = null;

/* 是否可以下拉 */
let isPull = true;
// 导购选择商品
let shareCar = [];
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 红包雨倒计时
    hbyJson : {
      img : splitImg('pet_close.png','common'),
      downNum : 15, //配置15秒
      canTap : false,
      canShow : false
    },
    titleLogo:splitImg('logo-black-rect.png?v=1'),
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    cartIcon: '/images/cart_icon.png',
    nearbyShopNavArr: [
      {title:'价格',isSelected:true,sortDirec:true},
      {title:'上架日期',isSelected:false,sortDirec:true}
    ],
    nav: [
      {
        name:'人气',
        sort:'desc',
        tdName: 'popular',
        value: 1,
        show: true,
      }, {
        name: '价格',
        sort: 'desc',
        tdName: 'price',
        show: true,
        value: 2
      }, {
        name: '销量',
        sort: 'desc',
        tdName: 'sales',
        show: true,
        value: 5
      },
      {
        name: '库存',
        sort: 'desc',
        tdName: 'stock',
        show: navStockShow,
        value: 3
      },
      {
        name: '新品',
        sort: 'desc',
        tdName: 'news',
        show: true,
        sortDirection: true,
        selected: true,
        value: 4
      }
    ],
    goodsListData:[],
    selectGoodsNum: 0,
    isShare: false,
    /* 筛选尺寸 */
    screenShow: false,
    /*页面禁止滑动*/
    noScroll: true,
    indexHeight: '',
    /* 回到顶部 */
    goTopShow: false,
    options:{},
    // 购物车数量
    cartNum: 0,
    showScrollLoading: false,
    showWishIcon: {
      show: showWish,
      img: splitImg('wish_home-icon.png')
    },
    // 促销分类
    ruleClassify: [],
    // 是否显示促销
    showPromotion: false,
    // 顶部样式
    headerStyle: {},
    placeholder: '',
    iconHome: splitImg('icon_home.png', 'common'),
    fixedHeight: '270rpx',
    // 是否显示广告弹窗
    showAD: false,
  },
  /* 判断是从自由选择进来还是其他页面 */
  isShare: function(){
    let isFromDaogou = wx.getStorageSync('isFromDaogou');
    if(isFromDaogou){
      this.setData({isShare: true})
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setPagePos();
    isPull = true;
    curOptions = options;
    // 微信数据上报
    app.setIsNewlyOpen(this, options);
    this._initParams(options);
    this.isShare();
    this.getIntentType(options);
    this._getGoodsList();
    this.guideSelectGoods();
    this.setData({options, 'showWishIcon.show': app.globalData.showWish});
    let collectParam = Object.assign(options, {eventName:'打开列表页'});
    app._collectData2(collectParam);
    app.setUtmOptions(options);
    app.getSearchKeyWords(this);
    events.register(this, EVENTS.EVENT_LOGINED);
    this.handleHBY();
    this.getCarList();
    this.setData({
      showAD: options.ad_show === 'show' && options.utm_term
    })
  },
  setPagePos(){
    let {headerStyle} = this.data;
    // 获取右侧胶囊大小
    const {top, height, width,} = wx.getMenuButtonBoundingClientRect();
    // 底部padding
    const paddingBottom = 20;
    headerStyle = {
      menuWidth: `${app.px2rpx(width)}rpx`,
      menuHeight: app.px2rpx(height) + 'rpx',
      paddingBottom:  `${paddingBottom}rpx`,
      paddingTop: `${app.px2rpx(top)}rpx`,
      height: jiafa(paddingBottom, app.px2rpx(height)) + 'rpx'
    };

    this.setData({
      headerStyle,
    });

  },
  // 红包雨
  handleHBY(){
    let hby_task = wx.getStorageSync('hby_task');
    if (hby_task == '1'){
      wx.removeStorageSync('hby_task');
      //  红包雨 倒计时15秒
      this.hbyInterval = setInterval(() => {
        let hbyJson = this.data.hbyJson
        if (hbyJson.downNum != 0){
          hbyJson.downNum -= 1
          hbyJson.canShow = true
        }else{
          hbyJson.img = splitImg('pet_open.png', 'common');
          hbyJson.canTap = true
          wx.setStorageSync('hby_task', '2');
          clearInterval(this.hbyInterval)
        }
        this.setData({hbyJson})
      }, 1000);

    }
  },
  handleEvent: function(event, type){

  },
  // 购物车列表
  getCarList(){
    let loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
    if(loginInfo){
      const cartList = wx.getStorageSync(KEYSTORAGE.cartList);
      if(cartList && Array.isArray(cartList.data) && cartList.data.length){
        this.setData({
          cartNum: cartList.data.length
        })
      }
    }
  },

  _initParams:function(options){
    const {list = '', listGoodsSelect = '', ruleId = ''} = options
    goodsListParam = {
      classifyIds: list,
      currentpage: 1,
      goodsHighPrice: '',
      goodsLowPrice: '',
      goodsSelect: listGoodsSelect,
      userBrand : '',
      sortDirection: 'desc',  // 排序方式 asc正、desc倒序 默认倒序
      sortType:  4,   // 排序条件　1-点击量[默认]；2-折扣价；3-销量；4-上架时间
      size: '',
      ruleId,
    };
    if(ruleId){
      const {nav} = this.data;
      nav.splice(0, 1, {
        name:'分类',
        tdName: 'promotionClassify',
        show: true,
      });
      this.setData({nav})
    }
    this.intentType= "";//来源页面
    this.shopCode = "";
    this.nearbyShopBean = {
      classifyId: "",//好像可以可以不填？
      site: getApp().config.brand,
      pageNum: 1,
      pageSize: 10,
      shopCode: this.shopCode,
      sortType:"1",
      sortDirection:"DESC"
    };
  },

  getIntentType:function(options){
    this.intentType = options.intentType||"";
    this.shopCode = options.shopCode||"";
    this.nearbyShopBean.shopCode = this.shopCode;
    this.setData({intentType:this.intentType});
  },

  guideSelectGoods: function(){
    wx.getStorageSync('shareCar').length > 0 ? shareCar = wx.getStorageSync('shareCar'): shareCar = [];
    this.setData({selectGoodsNum: shareCar.length})
  },
  // 获取商品列表
  _getGoodsList: function(){

    /* 加个定时器，在800ms之后再出发loading */
    let loadingTime = setTimeout( ()=> {
      wx.showLoading({
        title: '加载中...',
        mask: true,
      })
    }, 800);

    let oriPromise = this.intentType == `fromShopDetailPage` ?
    Promise.resolve(getNearbyShopGoodsList(this.nearbyShopBean)) : Promise.resolve(getGoodsList(goodsListParam));
    oriPromise.then(res => {
      wx.hideLoading();
      clearTimeout(loadingTime);
      let goodsList = res.data;
      let {goodsListData} = this.data;
      /*goodsList = goodsList.filter(item => {
        return item.sellStock !==0;
      });*/
      if(Array.isArray(res.ruleClassify) && res.ruleClassify.length){
        res.ruleClassify.unshift({name: '全部分类',id: Date.now()});
        this.setData({ruleClassify: res.ruleClassify})
      }
      if(goodsList.length > 0){
        let skuToImgParam = {
          size: URL_CDN.IMGSIZE360640
        };
        /* nameit 选p7的图 */
        brand === 'NAMEIT' ? skuToImgParam.suffix = 'p7' : '';
        /* VM选取720*1280的图，其余选240*400 */
        // brand !== 'VEROMODA' ? skuToImgParam.size = URL_CDN.IMGSIZE240400 : '';
        const overDueDay = 15; // 15天之内算新品
        goodsList.forEach((item, index) => {
          // this.intentType == `fromShopDetailPage` ? item.isShopGoods = true : item.isShopGoods = false;
          item.isShopGoods = this.intentType === 'fromShopDetailPage';
          skuToImgParam.sku = item.gsColorCode;
          item.goodsImg = `${cdn}${skuToImg(skuToImgParam)}`;
          const myCreateTime = item.createTime.replace(/-/g, '/');
          const myTimeStamp = Date.parse(myCreateTime)
          if(item.discount && item.discount !== 1){
            item.markImg = URL_CDN.DISCOUNTIMG;
            if(item.discount === 9){
              item.myDiscount = '一口价';
            }else{
              item.myDiscount = `${chengfa(item.discount, 10)}折`
            }
          } else if(item.salesQty && item.salesQty !== 0){
            item.markImg = URL_CDN.SALEQTY;
          } else if(myTimeStamp && !dateIsOverDue(myTimeStamp, overDueDay)){
            item.markImg = URL_CDN.NEW_GOODS;
          }
        });
        goodsListData = goodsListData.concat(goodsList);
        const goodsKey = `goodsListData[${res.currentpage -1}]`;
        this.setData({
          [goodsKey]: goodsList,
        })
      }
      this.setData({
        showScrollLoading: false
      });
      if(res.currentpage === res.totalPage){
        isPull = false
      }
    }).catch(err => {
      wx.hideLoading();
      clearTimeout(loadingTime);
      wx.showToast({
        title: err.message,
        icon: 'none'
      });
    })
  },

  // 点击事件
  onClick: function(e){
    let dataCode = e.currentTarget.dataset.code;
    switch (dataCode){
      case 'nav':
        this.changeNav(e);
        break;
      case 'confirmUpload':
        this.confirmUpload();
        break;
      case 'screenSize':
        this.screenSize();
        break;
      case 'goTop':
        this._goTop(e);
        break;
      case 'goIndex':
        this.gotoIndex();
        break;
      case 'cart':
        this.goCartList();
        break;
    }
  },
  // 去购物车
  goCartList: function(){
    let loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
    if(loginInfo){
      app.navigateTo('pages/shoppingCart/shoppingCart')
    }else{
      app.goSetting();
    }
  },
  gotoIndex(){
    app.gioTrack('pageclick_goodslist_shoppingcar_tohome', {classifyId: curOptions.list});
    app.goBack();
  },
  goBack(){
    wx.navigateBack({
      delta: 1
    })
  },
  // 导航切换
  changeNav: function(e){
    let {ruleClassify, nav, showPromotion} = this.data;
    goodsListParam.currentpage = 1;
    goodsListParam.sortDirection = 'desc';
    this.nearbyShopBean.pageNum = 1;
    const {index = 0, name=''} =  e.currentTarget.dataset;
    goodsListParam.sortType = nav[index].value;

    nav.forEach((item,ind) => {
      if(ind === index){
        item.selected = true;
        item.sortDirection = !item.sortDirection;
        goodsListParam.sortDirection = item.sortDirection ? 'desc' : 'asc';
      }else{
        item.selected = false
      }
    });
    if(goodsListParam.ruleId && !index){
      showPromotion = !showPromotion
      this.setData({showPromotion})
      // return
    }else{
      // 切换导航清空列表
      this.setData({goodsListData: []})
      this._getGoodsList()
    }
    this.setData({nav});

    // TD埋点
    try{
      app.tdSdkEvent(`pageclick_goodslist_${name}`, {});
      app.gioTrack(`pageclick_goodslist_${name}`, {classifyId: curOptions.list})
    }catch (e) {}
  },
  selectClassfyId(e){
    goodsListParam.classifyIds = e.detail;
    this._getGoodsList();
    this.setData({showPromotion: false})
  },
  /* 接受子组件穿来的值 */
  changeNum: function(e){
    shareCar = e.detail;
    let selectGoodsNum = shareCar.length;
    this.setData({selectGoodsNum})
  },
  // 改变购物车
  changeCart: function(e){
    this.setData({cartNum: e.detail})
  },
  /**/
  selectedRes: function(e){
    this.hideScreen();
    this.setData({goodsListData: []});
    let screenRes = e.detail;
    screenRes.currentpage = 1;
    Object.assign(goodsListParam, screenRes);
    isPull = true;
    this._getGoodsList();
  },
  /* 确认上传 */
  confirmUpload: function() {
    wx.setStorageSync('isFromDaogou', false);
    // wx.setStorageSync('shareCar', shareCar);
    wx.navigateBack({
      delta: 1
    });
  },
  /* 筛选 */
  screenSize: function(e) {
    this.setData({
      screenShow: true,
      noScroll: true,
      indexHeight: wx.getSystemInfoSync().windowHeight * 2 + 'rpx',
    });
    try {
      app.tdSdkEvent('pageclick_goodslist_filter', {});
      app.gioTrack('pageclick_goodslist_filter', {classifyId: curOptions.list})
    }catch (e) { }
  },
  hideScreen: function(e){
    this.setData({
      screenShow: false,
      noScroll: false
    });
  },
  onPageScroll: function(e){
    if(throttle()){
      let scrollTop = e.scrollTop;
      let {goTopShow, showPromotion} = this.data;
      if(showPromotion){
        this.setData({showPromotion: false})
      }
      goTopShow = scrollTop > 500;
      this.setData({ goTopShow})
    }

  },
  _goTop: function(e){
    wx.pageScrollTo({scrollTop: 0 });
    this.setData({ goTopShow : false});
    app.gioTrack('pageclick_goodslist_totop', {classifyId: curOptions.list});
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const query = wx.createSelectorQuery();
    query.select('#fixedHeader').boundingClientRect()
    query.selectViewport().scrollOffset();
    const {windowWidth} = wx.getSystemInfoSync()
    const scale = 750 / windowWidth;
    query.exec( res => {
      this.setData({mainMarginTop:  res[0].height +'px'})
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 微信数据上报
    app._browsePage(this);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 微信数据上报
    this.wxLeavePage();
  },
  pageTitle: '商品列表',
  wxLeavePage(){
    app._leavePage(this);
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    clearInterval(this.hbyInterval)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.redirectTo({
      url: `/${getCurrentUrl()}`,
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    app.WXReport('page_reach_bottom');
    app.gioTrack('pageclick_goodslist_scrolldown', {classifyId: curOptions.list});
    if(!isPull){
      wxShowToast('数据加载完毕');
      return;
    }
    goodsListParam.currentpage++;
    this.nearbyShopBean.pageNum++;
    this.setData({showScrollLoading: true});
    setTimeout( ()=> {
      this._getGoodsList();
    }, 1000)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let path = getCurrentUrl();
    const param = {
      from_type: 'menu',
      share_title: app.config.title,
      share_path: path,
      share_image_url: URL_CDN.COVER_SHARE
    };
    app._sharePage(param);
    return {
      title: app.config.title,
      path,
      imageUrl: URL_CDN.COVER_SHARE,
      success: res =>{}
    }
  },

  onShopSortClick:function(e){
    let index = e.currentTarget.id;
    let navArr = this.data.nearbyShopNavArr;
    console.log(`index = ${index}`)
    if(navArr[index].isSelected){
      //点击的是已经选择的nav
      navArr[index].sortDirec = !navArr[index].sortDirec;
      this.nearbyShopBean.sortDirection =  navArr[index].sortDirec ? 'DESC':'ASC';
    }else{
      //点击的 nav 还没被选择，则选择他
      navArr[index].isSelected = true;
      //另一个取消选择
      navArr[1-index].isSelected = false;
      //重置参数
      navArr[index].sortDirec = true;
      navArr[1-index].sortDirec = true;
      this.nearbyShopBean.sortDirection = 'DESC';
      this.nearbyShopBean.sortType =  index==0 ? '1':'2'; //1：价格2：上架日期
      console.log(` index = ${index} and this.nearbyShopBean.sortType = ${this.nearbyShopBean.sortType}`)
    }
    this.nearbyShopBean.pageNum = 1;
    this.setData({
      nearbyShopNavArr:navArr,
      goodsListData:[]
    });
    this._getGoodsList();

  },

  hbyTap(){
    wx.navigateBack({
      delta: 1
    });
  }


})
