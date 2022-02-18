import {EVENTS, KEYSTORAGE, URL_CDN} from "../../src/const";
import { getCartList, shoppingDel, shoppingAdd} from "../../service/cart";
import { promotionByCart } from "../../service/promotion";
import { optionGoodsCollection} from '../../service/collection.js'
import { getGoodsDetail } from "../../service/goods";
import { wxUserActions} from '../../service/collect.js'
import events from "../../src/events";
import {splitImg, skuToImg, getNineSku, animateShow, animateHide, chengfa} from '../../utils/utils'
import {wxShowToast, wxReportGoods} from '../../utils/wxMethods'
const app = getApp();
const {brand, isCollection, cdn} = app.config;
//请求页数
var n_page = 1;
var delGood ;
let colorlist = {};  // 颜色列表
let sizelist ={};    // 尺码列表
let chooseItem= 0;
/* 是否可以下拉 */
let isPull = true;
let actionType = '';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    shoplist: [],
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    totalPrice: '0',
    selectAllStatus: false,
    //删除商品确认
    remove_display : 'none',
    //弹框显示/隐藏
    details_display : 'none',
    //动画效果
    animationOpacity: {},
    animationBottom: {},
    colors:{},
    sizes:{},
    color_list_num: 0,
    size_list_num: 0,
    nums: 1,
    stock_nums: 0,
    yanseList:{},
    chimaList: {},
    haveGoods: false,
    noGoods: false,
    noticeAct: false,
    wxIcon: splitImg('wxpay_icon.png', 'common'),
    isCollection: isCollection ,
    submitMsg:  isCollection? '添加到收藏夹': '确定',
    cancelMsg:  isCollection? '确定': '取消',
    projeckName:  brand === 'SELECTED' ? 'shopcar-gender':'shopCartPage',
    isShowDmp: true,
    totalNum: 0,
    itemId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 微信数据上报
    app.setIsNewlyOpen(this, options);
  },
  promotionClick(e){
    const {id} = e.currentTarget
     wx.navigateTo({
      url: `../goodsList/goodsList?ruleId=${id}`,
    })
  },
  //加载前
  onReady: function () {
    var animation_bottom = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    });

    var animation_oapcity = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease'
    })

    this.animation_bottom = animation_bottom;
    this.animation_oapcity = animation_oapcity;
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    isPull = true;
    n_page = 1;
    this.getCarList();
    app.track()
   this.thisPageInit();
    // 微信数据上报
    app._browsePage(this);
  },
  onPullDownRefresh(){
    this.getCarList();
    wx.stopPullDownRefresh();
  },
  onTabItemTap(item){
    app.gioTrack('pageclick_home_shoppingcar')
  },
  //获取购物车列表
  getCarList: function(){
    var oldData = [];
    if(!app.checkLogin()){
      return
    }
    //获取购物车中的商品
    wx.showLoading({
      title: "Loading....",
      mask: true
    });
    app.getCart(n_page).then(res=>{
      wx.hideLoading();
      if(res.data.length !== 0){
        app.setCartNum(res.data.length)
        res.data.forEach(item=>{
          // 拼接图片
          item.goodsImg = cdn + skuToImg({
            sku: item.goodsSku,
            size: URL_CDN.IMGSIZE240400
          });
          // item.gscPicmainPath = `${cdn}${item.gscPicmainPath}`;
          item.goodsCount = item.quantity ? item.quantity : 1;
          // 判断商品是否下架
          item.isOutShelf = item.status === 'OutShelf';
          // 判断商品总库存是非为0
          item.noSellStock = item.sellStock <= 0;
          let count;
          /**
           * 判断改商品在此尺码下库存是否为0
           */
          for (var item1 in item.stock) {
            if (item.goodsSku === item1) {
              count = Number(item.stock[item1] ? item.stock[item1] : 0)
            }
          }
          item.sizeNoSellStock = count <= 0;
          item.discountPrice = Number(item.discountPrice).toFixed(2);
          item.originalPrice = Number(item.originalPrice).toFixed(2);
          if(this.data.selectAllStatus && !item.sizeNoSellStock && !item.isOutShelf && !item.noSellStock){
            item.selected = true;
          }
          // 显示促销
          if(Array.isArray(item.promotionData) && item.promotionData.length){
            item.showPromotionItem = item.promotionData[0]
          }
        });
        let newData = res.data;
        newData = oldData.concat(newData);
        this.setData({
          haveGoods:true,
          noGoods:false,
          shoplist: newData,
          isShowDmp: isPull,
          itemId: getNineSku(newData[0].goodsCode),
        });
        this.getTotalPrice();
        wx.hideLoading();
        return newData
      }
    }).catch(err => wxShowToast(err.message))
  },

  // 单选
  checkGood: function(e){
    const index = e.currentTarget.dataset.index;    // 获取data- 传进来的index
    let {shoplist} = this.data;                    // 获取购物车列表
    const {isOutShelf, noSellStock, sizeNoSellStock, goodsCount, goodsSku='', stock = {}, selected} = shoplist[index];
    if(isOutShelf){ // 商品已下架或没有库存 单选不可点
      wxShowToast('商品已下架');
      return;
    }
    if(noSellStock || sizeNoSellStock || goodsCount > (stock[goodsSku] || 0)){
      wxShowToast('库存不足');
      return;
    }
    shoplist[index].selected = !selected;
    let selects = 0;
    for (let i = 0; i < shoplist.length; i++) {
       if(shoplist[i].selected){
          selects++;
       }           // 改变所有商品状态
    }
    let selectAllStatus = selects === shoplist.length
    // 改变状态
    this.setData({
      shoplist: shoplist,
      selectAllStatus: selectAllStatus,
    });
    this.getTotalPrice();
  },

  // 全选
  allCheckGood: function(e){
    let selectAllStatus = this.data.selectAllStatus;    // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let shoplist = this.data.shoplist;

    for (let i = 0; i < shoplist.length; i++) {
      // 下架或没有库存的不能被选中
      if(!shoplist[i].isOutShelf && !shoplist[i].noSellStock && !shoplist[i].sizeNoSellStock){
        shoplist[i].selected = selectAllStatus;
      }// 改变所有商品状态
    }
    this.setData({
        selectAllStatus: selectAllStatus,
        shoplist: shoplist
    });
    this.getTotalPrice();
  },

  // 点击进入详情页
  showGoodDetails: function(e){
    let {index} = e.currentTarget.dataset;
    let {gsColorCode, goodsSku} = this.data.shoplist[index];
    try {
      app.tdSdkEvent('pageclick_shoppingcar_goods_togoodsdetail', {
        GOODS_ID: gsColorCode
      });
      app.gioTrack('pageclick_shoppingcar_goods_togoodsdetail', {
        spu_id: gsColorCode,
        sku_id: goodsSku
      })
    }catch (e) { }
    wx.navigateTo({
      url: `/pages/content/content?colorCode=${gsColorCode}`
    })
  },

  // 删除商品
  deleteGood: function(e){
    var index = e.currentTarget.dataset.index;

    delGood = this.data.shoplist[index];
    this.setData({
      remove_display:'block'
    });
  },

  // 提示框确认按钮
  remove_true : function(){
    if(this.data.isCollection){
      this.optionsCollection();
    } else {
      this.delectedShopCart();
    }
  },

  //提示框取消按钮
  remove_false : function(){
    if(this.data.isCollection){
      this.delectedShopCart();
    } else {
      this.setData({
        remove_display: 'none'
      });
    }

  },

  /**
   * 添加到收藏夹并删除购物车
   */
   optionsCollection: function(){
    console.log(">>>>>>>>>>>>>>", delGood);
    let jsonData = {
      goodsCode: delGood.gsColorCode,
      deleteStatus: "0",
      goodsName: delGood.goodsName,
      unionId: "", // wx.getStorageSync('unionid'),
    }
    optionGoodsCollection(jsonData).then(res =>{
      this.setData({
        remove_display : 'none'
      });
      wxShowToast('收藏成功');
      this.delectedShopCart();
      // 埋点 添加收藏夹
      let collectParam = {
        eventValue:  delGood.gsColorCode,
        eventName: '购物车页添加收藏夹'
      }
      app._collectData2(collectParam);
    })
  },

  closeShopCart: function(){
    this.setData({
      remove_display : 'none'
    })
  },
  // 删除购物车商品
  delectedShopCart: function(){
    let shoppingList = this.data.shoplist;
    let goodsId = '', goodsInfo = {};
      shoppingList.forEach(item => {
        if(item.id === delGood.id){
          goodsId = item.goodsSku;
          goodsInfo = item;
        }
      });
    try {
      app.tdSdkEvent('pageclick_shoppingcar_goods_deletegoods', {
        GOODS_ID:goodsId
      });
      this.wxReportAddGoods( goodsInfo, 'remove_from_cart');
      app.gioTrack('pageclick_shoppingcar_goods_deletegoods', {
        spu_id: delGood.gsColorCode,
        sku_id: delGood.goodsSku
      })
    }catch (e) {}

    //删除购物车里的商品
    shoppingDel(delGood.id).then(res=>{
      this.setData({
        remove_display : 'none'
      });
      let {shoplist} = this.data;  // String
      shoplist.forEach(item => {
        if(item.id === delGood.id){
          // 微信用户行为 删除购物车
          if(brand === 'JACKJONES' || brand === 'VEROMODA'){
            this._wxUserAction(item);
          }
        }
      })
      let localCartList = wx.getStorageSync(KEYSTORAGE.cartList);
      if(localCartList && localCartList.data){
        localCartList.data = localCartList.data.filter(item => item.id === delGood.id);
        wx.setStorageSync(KEYSTORAGE.cartList, localCartList)
      }
      shoplist = shoplist.filter(item=> item.id !== delGood.id );
      app.setCartNum(shoplist.length)

      if(shoplist.length === 0){
        this.setData({
          noGoods: true,
          haveGoods: false,
        })
      }
      this.setData({
        shoplist:shoplist
      });
      this.getTotalPrice();
      wx.showToast({
        title: res,
        icon: 'success',
        duration: 2000
      })
    }).catch(err=>{
      wxShowToast(err.message);
    });

  },
  wxReportAddGoods( goodsInfo, action_type, changeCount){
    const reportParam = {
      colorCode: goodsInfo.goodsSku.substr(0, 12),
      goodsName: goodsInfo.goodsName,
      categoryName: goodsInfo.goodsName,
      classifyIds: goodsInfo.goodsCode,
      price: goodsInfo.price || goodsInfo.discountPrice,
      originalPrice: goodsInfo.originalPrice,
      // 如某商品原来有3件，增加4件，变7件，sku_num应传4，而不是7
      sku_num: changeCount || goodsInfo.quantity,
      goodsSku: goodsInfo.goodsSku,
    };
    wxReportGoods('add_to_cart', reportParam, action_type )
  },

  //去逛逛
  toIndex: function () {
    try {
      app.tdSdkEvent('pageclick_shoppingcar_nogoods_seearound', {});
      app.gioTrack('pageclick_shoppingcar_nogoods_seearound')
    }catch (e) { }
    app.goBack();
  },

  // 编辑商品
  editGood: function(e){
    let index = e.currentTarget.dataset.index;
    chooseItem = index;
    const {shoplist} = this.data;
    if(shoplist[index].isOutShelf){
      wxShowToast('此商品已下架！');
      return;
    }
    let goodsCode = shoplist[index].goodsCode;
    let colorCode = shoplist[index].gsColorCode;
    let sizeCode = shoplist[index].goodsSku;
    this.setData({
      details_display: 'block',
      nums: shoplist[index].goodsCount,
    });
    animateShow(this);
    //获取商品详情
    this.getGoodCon(goodsCode, colorCode, sizeCode);
    actionType = '';
  },

  //获取商品详情及库存
  getGoodCon: function(goodsCode, colorCode, sizeCode){
    wx.showLoading({
      title: '加载中'
    });
    //获取商品信息
    getGoodsDetail(goodsCode, '')
    .then(res=>{
      wx.hideLoading();
      colorlist = res.color;
      let colorArr = [];
      for(let i = 0; i < res.color.length; i++){
        if(colorCode === res.color[i].colorCode){
          this.setData({
            color_list_num: i,
          })
        }
        colorArr.push(res.color[i].status === "OutShelf");
      }
      let arr = [];
      sizelist = res.color[this.data.color_list_num].sizes;
      sizelist.forEach((item, index) => {
        if(sizeCode === item.sku){
          this.setData({
            size_list_num: index,
            stock_nums: item.sellStock,
          })
        }
        arr.push(item.sellStock <= 0);
      });

      this.setData({
        colors : res.color,
        sizes: sizelist,
        chimaList: arr,
        yanseList: colorArr,
      })
    })
    .catch(e=>{
      console.log(e.message);
    });
  },

  //选择尺寸 - 关闭
  chicunHide: function (e) {
    animateHide(this);
  },

  // 确认修改
  submitChange: function(){
     const {shoplist, color_list_num, size_list_num, nums} =this.data;
    let list = shoplist[chooseItem];
    let colorIndex = colorlist[color_list_num];
    // 改变的数量
    const changeCount = Math.abs(list.quantity - nums);
    console.log(changeCount,'***')
    // 先删除原购物车商品
    shoppingDel(list.id).then().catch();
    // 再将新选择商品添加至购物车

    let addCartParam = {
      goodsName: list.goodsName,
      goodsCode: list.goodsCode,
      gsColorCode: colorIndex.colorCode,
      gscPicmainId:"",
      gscPicmainPath: colorIndex.picurls[2],
      goodsSku: colorIndex.sizes[size_list_num].sku,
      sizeName: colorIndex.sizes[size_list_num].sizeAlias,
      colorName: colorIndex.colorAlias,
      quantity: nums,
    };
    shoppingAdd(addCartParam).then( res => {
      this.setData({
        shoplist: [],
        noGoods: false,
        haveGoods: false,
      })
      n_page = 1;
      this.getCarList();
    }).catch( err => {
      wxShowToast(err.message);
    });
    animateHide(this);
    this.getTotalPrice();
    const goodsInfo = Object.assign(addCartParam, {
      originalPrice: colorIndex.originalPrice,
      price: colorIndex.price
    });
    if(actionType){
      this.wxReportAddGoods(goodsInfo, actionType, changeCount);
    }
  },

  // 选择颜色
  colorChange:function(e){
    let index = e.currentTarget.dataset.index;
    sizelist = colorlist[index].sizes;
    if(colorlist[index].status === "OutShelf"){
      return;
    }
    let arr = [];
    for(let i = 0; i < sizelist.length; i++){
      arr.push(sizelist[i].sellStock <= 0);
    }

    this.setData({
      color_list_num : index,
      nums: 1,
      chimaList: arr,
      stock_nums: sizelist[this.data.size_list_num].sellStock,
      sizes: sizelist,
    })
  },

  // 选择尺码
  sizeChange: function(e){
    // 库存为0不可选择
    let index = e.currentTarget.dataset.index;
    const curSellStock = sizelist[index].sellStock;
    if(curSellStock <= 0){
      return;
    }
    // 尺码可选中 代表有库存
    this.data.shoplist[chooseItem].sizeNoSellStock = false;
    this.setData({
      size_list_num : index,
      nums: 1,
      stock_nums:  curSellStock,
    })
  },

  //件数增加
  add_number: function (e) {
    let {nums, stock_nums, shoplist} = this.data;
    if (nums >= stock_nums) {
      return false;
    }
    nums++;
    this.setData({ nums });
    actionType = 'append_to_cart_in_cart';
  },

  //件数减少
  jian_number: function (e) {
    let {nums, shoplist} = this.data;
    if (nums == 1) {
      return;
    }
    nums--;
    this.setData({ nums });
    actionType = 'remove_from_cart';
  },

  // 提交
  submitGood: function(e){
    app.saveFormIdFn(e.detail.formId);
    let buyTrueList = [];
    let list = this.data.shoplist;
    let goodsIdList = '';
    for(let i = 0; i<list.length; i++) {    // 循环列表得到每个数据
       // 判断选中才会计算价格
      if(list[i].selected) {
        let ddJson = {
          delId : list[i].id,
          goodsName: list[i].goodsName,
          nums: list[i].goodsCount,
          goodsCode: list[i].goodsCode,
          goodsColorCode: list[i].gsColorCode,
          colorName: list[i].colorName,
          sizeName: list[i].sizeName,
          goodsSku: list[i].goodsSku,
          discount: list[i].discount,
          onePrice: Number(list[i].discountPrice).toFixed(2),
          allPrice: chengfa(list[i].discountPrice, list[i].goodsCount),
          gscolPicPath: list[i].gscPicmainPath,
          originalPrice: list[i].originalPrice,
        };
        const promotionData = list[i].promotionData;
        if(Array.isArray(promotionData) && promotionData.length){
          ddJson.promotionData = promotionData[0]
        }
        goodsIdList += list[i].goodsSku +',';
        buyTrueList.push(ddJson);    // 将所有的
        try {
          app.gioTrack('pageclick_shoppingcar_goods_buy', {
            spu_id: list[i].gsColorCode,
            sku_id: list[i].goodsSku
          })
        }catch (err){}
      }
    }
    try {
      app.tdSdkEvent('pageclick_shoppingcar_goods_buy', {
        GOODS_ID: goodsIdList
      });
    }catch (e) { }
    if(buyTrueList.length > 0){
      wx.setStorageSync('dingdanCon', buyTrueList);
      wx.navigateTo({
        url: '../orderSave/orderSave'
      });
    }else{
      wxShowToast('请选择商品');
    }

  },

  getTotalPrice: function(){
    let shoplist = this.data.shoplist;                  // 获取购物车列表
    let total = 0;
    let totalNum = 0;
    for(let i = 0; i<shoplist.length; i++) {         // 循环列表得到每个数据
        if(shoplist[i].selected) {                   // 判断选中才会计算价格
            total += chengfa(shoplist[i].discountPrice, shoplist[i].goodsCount);     // 所有价格加起来
            totalNum+=shoplist[i].goodsCount;
        }
    }
    this.setData({                                // 最后赋值到data中渲染到页面
        shoplist: shoplist,
        totalNum,
        totalPrice: total.toFixed(2)
    });
  },
  onHide: function () {
    // 微信数据上报
    app._leavePage(this);
  },
 /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(!isPull){
      return;
    }
    n_page++
    // this.getCarList();
    // 微信数据上报
    app.WXReport('page_reach_bottom')
  },


  //页面初始化
  thisPageInit: function(){
    n_page = 1;
    this.setData({
      totalPrice : "0",
    });
    this.getTotalPrice();
  },

  // 微信用户行为
  _wxUserAction: function(param){
    let data = [];
    data.push({
      action_type: 'DELETE_CART',
      action_param: {
        'product_id': param.gsColorCode,
        'industry_id':'',
        'product_name':param.goodsName,
      }
    });
    wxUserActions(data);
  }
})
