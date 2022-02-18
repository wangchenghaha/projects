// components/guideShareBanner/guideShareBanner.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banner: Array,
    shortVideo: Object
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  ready: function(){

  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e){
      let dataIndex = e.currentTarget.dataset.index;
      let bannerList = this.properties.banner;
      let bannerItem = bannerList[dataIndex];
      let isJump = bannerItem.isJump;
      if(isJump && bannerItem.linkUrl){
        app.jumpUrl(bannerItem.linkUrl)
      }
      /*if(bannerItem.type === 'shopping'){
        let dataCode = bannerItem.shoppingCode;
        app.goAlbum(dataCode);
      }else if(bannerItem.type === 'getCoupon'){
        app.isMember(bannerItem.linkUrl);
      }*/

    },
  }
})
