import {chengfa, filterStr, judgeUrl, skuToImg} from '../../../utils/utils'
import {URL_CDN, KEYSTORAGE} from '../../../src/const'
const app = getApp();
const {cdn, brand, DEV} = app.config;

const UPLOAD_DOMAIN_TEST = 'http://db.vm.cn';
Component({
  /**
   * 组件的属性列表
   */
  properties: { 
    goods: Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    goods: []
  },
  lifetimes: {
    ready(){
      const {goods} = this.properties;
      if(goods.length){
        goods.forEach(item => {
          const {goodsList = [],imgUrl = ''} = item;
          if(imgUrl){
            item.imgUrl = DEV ? UPLOAD_DOMAIN_TEST + imgUrl : judgeUrl(imgUrl);
            console.log(item.imgUrl,'***')
          }
          if(goodsList.length){
            goodsList.forEach(item => {
              const {discount, gsColorCode} = item;
              item.myDiscount = discount === 9 ? '一口价': `${chengfa(discount, 10)}折`;
              item.goodsImg = cdn + skuToImg({
                sku: gsColorCode,
                size: URL_CDN.IMGSIZE240400
              })
            })
          }
          item.showMore = false;
        });
        console.log(goods,'*****')
        this.setData({goods})
      }
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    lookMore(e){
      const {index} = e.currentTarget.dataset;
      const {goods} = this.data;
      goods[index].showMore = true;
      this.setData({goods})
    },
    hideGoods(e){
      const {index} = e.currentTarget.dataset;
      const {goods} = this.data;
      goods[index].showMore = false;
      this.setData({goods})
    }
  }
})
