import {dmpRecommendGoods, dmpRecommendGoodsNew, getGoodsDetail} from '../../service/goods'
import {KEYSTORAGE, URL_CDN} from '../../src/const.js'
import {chengfa, skuToImg, translateArray} from '../../utils/utils'
import {wxReportGoods, wxShowToast} from "../../utils/wxMethods";
import {shoppingAdd} from "../../service/cart";
const app = getApp();
const {brand,cdn,SOURCE_ID} = app.config;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    projeckName: String,
    sceneId: String,
    sceneType: String,
    itemId: String,
    page: String,
    // 订单号
    order: String
  },


  /**
   * 组件的初始数据
   */
  data: {
    showGoodsDetail: false,
    colorCode: '',
    colorList: '',
    hotSaleArr: [],
    userLikeArr:[],
  },
  lifetimes:{
    ready () {
      const {sceneId,sceneType,itemId} = this.properties;
      this.dmpRecommendGoodsNew(sceneId,sceneType,itemId);
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    dmpRecommendGoodsNew(sceneId,sceneType,itemId){
      let param = {
        sceneId:sceneId,
        sceneType:sceneType,
        sourceId:SOURCE_ID,
        openId:wx.getStorageSync("openid"),
        returnCount:30,
        itemId:itemId
      };
      const { page = ''} = this.properties;
      param.itemId = itemId;
      dmpRecommendGoodsNew(param).then(res => {
        if(res){
          let result = res.filter(item => {
            return item.gsColorCode && item.status === 'InShelf'
          });
          if(result.length){
            if(result.length % 2){
              result = result.slice(0, result.length - 1)
            }
            if(page === 'search'){
              result = result.slice(0, 10);
            }
            let skuParam = {
              size: URL_CDN.IMGSIZE7201280
            };
            result.forEach((item, index) => {
              skuParam.sku = item.gsColorCode;
              item.goodsImg  = cdn + skuToImg(skuParam)
              wxReportGoods('expose_sku_component', item, );
            });
            this.setData({
              hotSaleArr: result
            })
          }

        }

      })
    },
    onClick(e){
      const { item, code} = e.currentTarget.dataset;
      const sceneObj = {
        sy101: 'pageclick_recmlist_recmproduct_detail',
        gwc102: 'pageclick_cart_recmproduct',
        xqy103: 'pageclick_pdp_recmproduct',
        hyzx104: '',
        scy105: 'pageclick_collection_recmproduct',
        ddxqy106: 'pageclick_order_detail_recmproduct',
        ddwcy107: 'pageclick_order_complete_recmproduct',
        ss110: 'pageclick_search_recmproduct'
      }
      const {sceneId, sceneType, itemId, order} = this.properties;
      const gioParam = {
        sceneId, sceneType, itemId,
        tospu_id: code,
        sourceId: SOURCE_ID,
        spu_id: code,
      }
      if(order){
        gioParam.order_id = order;
      }
      app.tdSdkEvent(sceneObj[sceneId], gioParam);
      app.gioTrack(sceneObj[sceneId], gioParam)
      wxReportGoods('trigger_sku_component', item);
      wx.navigateTo({
        url: `/pages/content/content?colorCode=${code}`
      })
    },
    confirmGoods(e){
      if(e.detail.color){
        this.addCart(e.detail);
      }
      this.setData({
        showGoodsDetail: false
      })
    },
    addCart(data){
      const {color, count, sizeIndex} = data;
      const {colorCode, picurls, colorAlias, classifyIds, originalPrice, price, sizes} = color;
      const {goodsName} = this.data;
      let addCartParam = {
        goodsName,
        goodsCode: colorCode.substr(0, 9),
        gsColorCode: colorCode,
        gscPicmainId: "",
        gscPicmainPath: picurls[2],
        goodsSku: sizes[sizeIndex].sku,
        sizeName: sizes[sizeIndex].sizeAlias,
        colorName: colorAlias,
        quantity: count,
        category_list: String(classifyIds) ? String(classifyIds).split() : [],  //Array
        price: chengfa(price, 100),   // Number  售价精确到分
        original_price: chengfa(originalPrice, 100),   // Number  原价精确到分
      };
      shoppingAdd(addCartParam).then(res => {
        wx.hideLoading();
        if (res.msg === '成功') {
          wxShowToast(res.msg);
          // 向父级发送
          let localCartList = wx.getStorageSync(KEYSTORAGE.cartList) || {};
          localCartList.data = localCartList.data || [];
          localCartList.data.unshift(res.data);
          // let cartNum = Number(this.properties.cartNum);
          wx.setStorageSync(KEYSTORAGE.cartList, localCartList);
          app.setCartNum(localCartList.data.length);
        } else if (res === '已添加！') {
          wxShowToast('商品已添加');
        }
      }).catch(err => wxShowToast(err.message));
    },
    showGoodsDetail(e){
      const { code } = e.currentTarget.dataset;
      if(!app.checkLogin()){
        return
      }
      wx.showLoading({
        title: '加载中...'
      })
      getGoodsDetail(code).then(res => {
        if(res){
          wx.hideLoading()
          // 过滤上下架
          const colorList = res.color.filter(item => item.status === 'InShelf');
          this.setData({
            colorList,
            showGoodsDetail: true,
            goodsName: res.goodsName,
            colorCode: code
          })
        }
      }).catch(err => wxShowToast(err.message))
    },
  }
})
