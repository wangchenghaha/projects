// components/shareGoodsList/goodsList.js
const app = getApp();
const {SHOW_DISCOUNT} = app.config
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:Array,
    wxMoment: Array,
    highLight: Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsList:[],
    SHOW_DISCOUNT
  },
  attached: function(){
    console.log('attached',this.properties.list, SHOW_DISCOUNT)
  },
  ready: function(){
    let goodsList = this.properties.list;
    this.setData({goodsList});
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e){
      let pages = getCurrentPages();
      let curPage = pages[pages.length-1].route;
      // 导购分享页面不可点击
      /*if(curPage.indexOf('daogouwxq') > -1){
        return;
      }*/
      let sku = e.currentTarget.dataset.sku;
      this.toDetail(sku)
    },
    toDetail(sku){
      try {
        app.tdSdkEvent('pageclick_guide_share_userclick',{
          GUIDE_ID: wx.getStorageSync('shareFromDaogouID') || '',
          GOODS_ID: sku
        })
      }catch (e) { }
      wx.navigateTo({url: `/pages/content/content?colorCode=${sku}&prevPage=weMall`})
    }
  }
})
