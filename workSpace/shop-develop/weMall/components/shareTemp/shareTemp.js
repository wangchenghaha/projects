const app = getApp();
const {cdn, brand} = app.config;
import { getShareDetail, shareUpdate, copyShareUrl, getBrandConfig } from '../../../service/guide';
import {wxShowToast} from '../../../utils/wxMethods'
import {objToQuery, skuToImg, splitImg, judgeUrl, getCurrentUrl} from '../../../utils/utils'
import {KEYSTORAGE, URL_CDN} from '../../../src/const'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tempId: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    content:{},
    guideId: ''
  },
  lifetimes: {
    ready: function () {
      this.getDetail();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    getDetail(){
      const id = this.properties.tempId;
      getShareDetail(id).then(res => {
        if(res){
          let content = res;
          const skuList = content.wxSharePageSkuLists;
          let skuPicParam1 = {
            size: URL_CDN.IMGSIZE360640,
            brand,
          };
          let skuPicParam2 = {
            size: URL_CDN.IMGSIZE240400,
            suffix:'p7',
            brand,
          };
          if(skuList && skuList.length){
            skuList.forEach(item => {
              skuPicParam1.sku = skuPicParam2.sku = item.sku;
              item.brandLogo = URL_CDN.LOGO_BLACK_RECT;  // 品牌logo
              item.skuPic1 = `${cdn}${skuToImg(skuPicParam1)}`;
              item.skuPic2 = `${cdn}${skuToImg(skuPicParam2)}`;
            })
          }
          this.setData({content})
        }
      }).then( _=> {
        const guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
        let {guideId} = this.data;
        if(guideInfo){
          guideId = guideInfo.employeeId;
        }else{}
        this.setData({
          guideId
        });
        console.log(guideId,'***')
      }).catch(err => wxShowToast(err.message))
    }
  }
});
