import {skuToImg, judgeUrl, getCurrentUrl} from '../../../utils/utils'
import {URL_CDN, KEYSTORAGE} from '../../../src/const'
const app = getApp();
const {cdn, brand,} = app.config;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    content: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    guideId: ''
  },
  lifetimes: {
    attached(){
      this.handleData();
      this.getGuideID();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getGuideID(){
      const curPage = getCurrentUrl();
      if(curPage.includes('weMall/shareDetail/shareDetail')){
        const {employeeId} = wx.getStorageSync(KEYSTORAGE.guideInfo);
        this.setData({guideId: employeeId})
      }
    },
    // 处理数据
    handleData(){
      const {content} = this.properties;
      let {wxMoment = '', wxSharePageSkuLists = [], pictures} = content;
      // 推荐理由
      if(pictures){
        if(pictures.includes(',')){
          let myWxMomentArr = [];
          pictures.split(',').forEach(item => myWxMomentArr.push({wxPic: item}));
          content.myWxMoment = myWxMomentArr
        }else{
          content.myWxMoment = [{wxPic: pictures}]
        }
      }
      if(wxMoment){
        content.myWxMoment = JSON.parse(wxMoment);
      }
      if(content.myWxMoment && content.myWxMoment.length){
        content.myWxMoment.forEach(item => {
          // 判断是否有http
          item.wxPic = judgeUrl(item.wxPic);
        });
      }
      // 商品
      let skuPicParam1 = {
        size: URL_CDN.IMGSIZE360640
      };
      let skuPicParam2 = {
        size: URL_CDN.IMGSIZE240400,
        suffix:'p7'
      };
      wxSharePageSkuLists.forEach(item => {
        skuPicParam1.sku = skuPicParam2.sku = item.sku;
        skuPicParam1.brand = skuPicParam2.brand = brand;
        item.brandLogo = URL_CDN.LOGO_BLACK_RECT;  // 品牌logo
        item.skuPic = `${cdn}${skuToImg({
          sku:item.sku,
          size: URL_CDN.IMGSIZE360640
        })}`;
        console.log(item.skuPic, '*********');
        item.skuPic1 = `${cdn}${skuToImg(skuPicParam1)}`;
        item.skuPic2 = `${cdn}${skuToImg(skuPicParam2)}`;
        item.brand = brand;
      });
      this.setData({content})
    },
    onClick(e){
      const {index} = e.currentTarget.dataset;
      const {myWxMoment} = this.data.content;
      const curItem = myWxMoment[index];
      if(curItem.miniUrl){
        app.navigateTo(curItem.miniUrl)
      }
      console.log(index,'**', myWxMoment)
    }
  }
})
