import { shoppingAdd, addSkuToWish } from '../../service/cart'
import { addClickRate, getGoodsDetail } from '../../service/goods'
import { KEYSTORAGE, URL_CDN } from '../../src/const'
import { wxShowToast, wxReportGoods} from '../../utils/wxMethods'
import { animateShow, skuToImg, animateHide, splitImg, objToQuery, chengfa, formatDate} from '../../utils/utils'
import { wxUserActions } from '../../service/collect.js'
const app = getApp();
const {brand, cdn, SHOW_DISCOUNT} = app.config;
let shareCar = [];

let goodsDetail;
let colorlist = {};  // 颜色列表
let sizelist = {};    // 尺码列表

let skuToImgParam = {
  size: URL_CDN.IMGSIZE240400
};
let addWishFlag = false;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: Object,
    isShare: Boolean,
    options: Object,
    cartNum: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsInfo: {},
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    defaultBg: URL_CDN.LOGO_WHITE_RECT,
    //弹框显示/隐藏
    details_display: 'none',
    //动画效果
    animationOpacity: {},
    animationBottom: {},
    colors: {},
    sizes: {},
    color_list_num: 0,
    size_list_num: -1,
    nums: 1,
    stock_nums: 0,
    chimaList: {},
    goodsImg: '',
    goodsSku: '',
    wishIcon: {
      // 心愿单
      show: false,
      url: splitImg('add_wish_icon.png', 'common')
    },
    addWishFlag,
    SHOW_DISCOUNT
  },
  ready: function () {
    let goodsInfo = this.properties.goodsInfo;
    wx.getStorageSync('shareCar').length > 0 ? shareCar = wx.getStorageSync('shareCar') : shareCar = []
    this.setData({
      goodsInfo,
      'wishIcon.show':  app.globalData.configJson.goodslistwishlist
    });
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
    try{
      wxReportGoods('expose_sku_component', goodsInfo, )
    }catch (e) {
      console.error(e)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e) {
      let clickType = e.currentTarget.dataset.type;
      switch (clickType) {
        case 'content':
          this.toContent(e);
          break;
        case 'cart':
          this.addCart(e);
          break;
        case 'dao':
          this.selectGoods(e);
          break;
      }
    },
    // 详情页
    toContent(e) {
      let sku = e.currentTarget.dataset.sku;
      let intentType = e.currentTarget.dataset.intentType;
      let shopCode = e.currentTarget.dataset.shopCode;
      // 增加点击量
      addClickRate(sku).then(msg => { }).catch(e => { });
      try {
        const {options} = this.properties;
        app.tdSdkEvent('pageclick_goodslist_goods', {
          SKU:sku,
          CLASSIFY_ID: options.list || ''
        });
        app.gioTrack('pageclick_goodslist_goods', {
          classifyId: options.list,
          spu_id: sku
        })
        wxReportGoods('trigger_sku_component', this.properties.goodsInfo, )
      } catch (e) { }
      const queryObj = {
        colorCode: sku,
        intentType: intentType,
        shopCode: shopCode,
      }
      if(this.properties.isShare){
        // 导购分享选商品
        queryObj.isWMall = true
      }

      wx.navigateTo({
        // 去除url中的undefined
        url: `/pages/content/content${objToQuery(queryObj)}`,
        // url: `/pages/content/content?colorCode=${sku}&intentType=${intentType}&shopCode=${shopCode}&isWMall=${this.properties.isShare}`
      });
    },

    // 购物车
    addCart(e) {
      app.ifWXWork(false);  //企业微信跳转;
      if (!app.checkLogin()) {
        return;
      }
      let goodsCode = e.currentTarget.dataset.sku || '';
      let colorCode = e.currentTarget.dataset.color;
      const {desc} = e.currentTarget.dataset;
      addWishFlag = (desc && desc === 'addWish');
      this.setData({
        details_display: 'block',
        addWishFlag
      });
      console.log(this.data.addWishFlag,'*****addWishFlag')
      animateShow(this);
      app.tdSdkEvent('pageclick_goodslist_shoppingcar', { GOODS_ID: goodsCode });
      //获取商品详情
      this.getGoodCon(goodsCode, colorCode);
    },

    //获取商品详情及库存
    getGoodCon: function (goodsCode, colorCode) {
      wx.showLoading({
        title: '加载中'
      });
      //获取商品信息
      getGoodsDetail(goodsCode, '')
        .then(res => {
          wx.hideLoading();
          goodsDetail = res;
          colorlist = res.color;
          let colorArr = [];
          for (let i = 0; i < res.color.length; i++) {
            if (colorCode === res.color[i].colorCode) {
              skuToImgParam.sku = colorCode;
              this.setData({
                color_list_num: i,
                goodsImg: `${cdn}${skuToImg(skuToImgParam)}`,
                goodsSku: colorCode
              });
            }
            colorArr.push(res.color[i].status === "OutShelf");
          }
          let arr = [];
          sizelist = res.color[this.data.color_list_num].sizes;
          let totalStock = 0;
          sizelist.forEach(item => {
            totalStock += item.sellStock;
            arr.push(item.sellStock <= 0);
          });

          this.setData({
            colors: res.color,
            sizes: sizelist,
            chimaList: arr,
            yanseList: colorArr,
            size_list_num: -1,
            stock_nums: totalStock,
          })
        })
        .catch(e => {
          console.log(e.message);
        });
    },

    //选择尺寸 - 关闭
    chicunHide: function (e) {
      animateHide(this);
    },

    // 确认修改
    submitChange: function () {
      if (this.data.size_list_num < 0) {
        wx.showToast({
          title: '请选择尺码',
          image: '../../images/joinFalse.png',
          duration: 1500
        });
        return;
      }
      wx.showLoading({
        title: "Loading....",
        mask: true
      });

      let colorListNum = this.data.color_list_num;
      let sizeNum = this.data.size_list_num;
      let addColor = colorlist[colorListNum];
      console.log(addColor);
      let addSize = colorlist[colorListNum].sizes[sizeNum];
      let categoryList = [];
      if (addColor.classifyNames) {
        if (addColor.classifyNames.includes(',')) {
          categoryList = addColor.classifyNames.split(',')
        } else {
          categoryList.push(addColor.classifyNames)
        }
        if (!categoryList[categoryList.length - 1]) {
          categoryList.splice(categoryList.length - 1, 1)
        }
      }
      const {nums} = this.data;
      let addCartParam = {
        goodsName: goodsDetail.goodsName,
        goodsCode: goodsDetail.projectCode,
        gsColorCode: addColor.colorCode,
        gscPicmainId: "",
        gscPicmainPath: addColor.picurls[2],
        goodsSku: addSize.sku,
        sizeName: addSize.sizeAlias,
        colorName: addColor.colorAlias,
        quantity: nums,
        category_list: categoryList,  //Array
        price: chengfa(addColor.price, 100),   // Number  售价精确到分
        original_price: chengfa(addColor.originalPrice, 100),   // Number  原价精确到分
      };
      let wishParam = {
        brand,
        gcsSku: addSize.sku,
        discountPrice: addColor.price,
        goodsName: goodsDetail.goodsName,
        originalPrice: addColor.originalPrice,
        discount: addColor.discount,
        colorName:addColor.colorAlias,
        sizeName:addSize.sizeAlias
      };
      app.gioTrack('wemall_addToCartResult', {
        spu_id:addColor.colorCode,
        sku_id: addSize.sku,
        addToCartTime: formatDate(Date.now()).replace(/-/g, '/'),
        productName: goodsDetail.goodsName,
        originalPrice: addColor.originalPrice,
        currentPrice: addColor.price,
        discountRate: addColor.discount,
        num: nums,
        pagename: '列表'
        // liveRoomNo: wxVideoLiveRoom ? wxVideoLiveRoom.id : ''
      })
      if(addWishFlag){
        // 添加心愿单
        this.addWish(wishParam);
        return
      }
      shoppingAdd(addCartParam).then(res => {
        wx.hideLoading();
        if (res.msg === '成功') {
          // 微信用户行为“加入购物车”
          if (brand === 'JACKJONES' || brand === 'VEROMODA') {
            this._wxUserAction(addCartParam);
          }
          wxShowToast(res.msg);
          let curOptions = this.properties.options;
          // 向父级发送
          let localCartList = wx.getStorageSync(KEYSTORAGE.cartList) || {};
          localCartList.data = localCartList.data || [];
          localCartList.data.unshift(res.data);
          // let cartNum = Number(this.properties.cartNum);
          wx.setStorageSync(KEYSTORAGE.cartList, localCartList);
          this.triggerEvent('changeCartNum', localCartList.data.length);
          let collectParam = Object.assign(curOptions, { eventValue: addCartParam.goodsSku, eventName: '添加购物车' });
          app._collectData2(collectParam);
        } else if (res === '已添加！') {
          wx.showToast({
            title: '商品已添加',
            image: '../../images/joinFalse.png',
            duration: 1500
          });
        }
      }).catch(err => wxShowToast(err.message));
      // 腾讯有数添加购物车
      const addGoodsInfo = Object.assign(addColor,
        {goodsName: goodsDetail.goodsName,
                sku_num: nums,
                goodsSku: addSize.sku
        })
      wxReportGoods('add_to_cart', addGoodsInfo, 'append_to_cart_in_cart')
      animateHide(this);

    },
    pageTitle: '商品列表',
    addWish(param){
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      addSkuToWish(param).then(res => {
        wx.hideLoading();
        if(res){
          wxShowToast('添加心愿单成功')
        }
        animateHide(this);
      }).catch(err => wxShowToast(err.message));
    },
    // 选择颜色
    colorChange: function (e) {
      let index = e.currentTarget.dataset.index;
      sizelist = colorlist[index].sizes;
      skuToImgParam.sku = colorlist[index].colorCode;
      if (colorlist[index].status === "OutShelf") {
        wxShowToast('商品已下架');
        return;
      }
      let arr = [];
      let totalStock = 0;
      sizelist.forEach(item => {
        totalStock += item.sellStock;
        arr.push(item.sellStock <= 0);
      });
      this.setData({
        color_list_num: index,
        nums: 1,
        chimaList: arr,
        stock_nums: totalStock,
        sizes: sizelist,
        goodsImg: `${cdn}${skuToImg(skuToImgParam)}`,
        goodsSku: skuToImgParam.sku,
        size_list_num: -1,
      })
    },

    // 选择尺码
    sizeChange: function (e) {
      let index = e.currentTarget.dataset.index;
      const curSize = sizelist[index];
      const goodsSku = curSize.sku;
      const curSizeStock = sizelist[index].sellStock;
      const {color_list_num} = this.data;
      if (colorlist[color_list_num].status === "OutShelf") {
        wxShowToast('商品已下架');
        return;
      }
      if (curSizeStock <= 0) {
        wxShowToast('暂无库存');
        return;
      }
      // 库存为0不可选择
      this.setData({
        size_list_num: index,
        nums: 1,
        stock_nums: curSizeStock,
        goodsSku
      })
    },

    //件数增加
    add_number: function (e) {
      var numm = this.data.nums;
      if (numm >= this.data.stock_nums || addWishFlag) {
        return false;
      }
      numm++;
      this.setData({
        nums: numm
      });
    },

    //件数减少
    jian_number: function (e) {
      var numm = this.data.nums;
      if (numm == 1) {
        return;
      }
      numm--;
      this.setData({
        nums: numm
      });
    },


    // 自由选择商品
    selectGoods: function (e) {
      let goodsInfo = e.currentTarget.dataset.goods;
      goodsInfo.checked = !goodsInfo.checked;
      let shareGoods = {
        brandName: brand,
        goodsName: goodsInfo.goodsName,
        gsColorCode: goodsInfo.gsColorCode,
        originalPrice: goodsInfo.originalPrice,
        discountPrice: goodsInfo.discountPrice,
        gscMaincolPath: goodsInfo.gscMaincolPath,
        discount: (goodsInfo.discount * 1000) / 100
      };
      if (goodsInfo.checked) {
        shareCar.push(shareGoods);
        if (shareCar.length > 8) {
          wx.showToast({
            title: '最多8款商品',
          });
          shareCar.splice(8, 1);
          return;
        }

      } else {
        shareCar = shareCar.filter(item => {
          return item.gsColorCode !== goodsInfo.gsColorCode
        });
      }
      this.triggerEvent('shareGoodsNum', shareCar);
      wx.setStorageSync('shareCar', shareCar);
      this.setData({ goodsInfo })
    },

    // 微信用户行为
    _wxUserAction: function (param) {
      let data = [];
      data.push({
        action_type: 'ADD_CART',
        action_param: {
          'product_id': param.gsColorCode,
          'industry_id': '',
          'product_name': param.goodsName,
        }
      });
      wxUserActions(data);
    }
  }
});
