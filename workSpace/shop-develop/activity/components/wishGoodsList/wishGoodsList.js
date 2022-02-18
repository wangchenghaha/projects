// activity/components/wishGoodsList/wishGoodsList.js
import {URL_CDN} from "../../../src/const";
import {skuToImg} from "../../../utils/utils";
import {wishGoodsRemove} from "../../service/wish";
import {wxShowToast} from "../../../utils/wxMethods";
const app = getApp();
const {brand, cdn} = app.config;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList: Array,
    bgColor: String,
    showIcon: {
      type: Boolean,
      value: false
    },
    showBtn: {
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  lifetimes:{
    ready(){
      const {goodsList} = this.properties;
      goodsList.forEach(item => {
        const param = {
          size: URL_CDN.IMGSIZE240400,
          sku: item.gcsSku
        };
        item.goodsImg = cdn + skuToImg(param)
      });
      this.setData({goodsList})
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    selectGoods(e){
      const {index} = e.currentTarget.dataset;
      const {goodsList} = this.properties;
      goodsList[index].myChecked = !goodsList[index].myChecked;
      this.setData({goodsList});
      this.triggerEvent('selectIndex', index);
    },
    confirmDelete(e){
      const {index} = e.currentTarget.dataset;
      const {goodsList} = this.data;
      const param = {
        gcsSku: goodsList[index].gcsSku,
        brand
      };
      wishGoodsRemove(param).then(res => {
        if(res.code === 0){
          wxShowToast('删除成功');
          goodsList.splice(index, 1);
          /*if(goodsList.length === 0){
            this.triggerEvent('emptyGoods', true);
          }*/
          this.triggerEvent('emptyGoods', index);
          this.setData({goodsList})
        }
      }).catch(err => wxShowToast(err.message))
    },
    deleteGoods(e){
      const _this = this;
      wx.showModal({
        title: '提示',
        content: '确认删除吗？',
        success (res) {
          if (res.confirm) {
              _this.confirmDelete(e);
          }
        }
      });
    }
  }
})
