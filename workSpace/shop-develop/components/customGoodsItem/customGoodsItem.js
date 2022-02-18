// components/customGoodsItem/customGoodsItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsInfo: Object,
    forShowType: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    goodsPic: '',
    goodsName: '',
    currentPrice: '',
    orginalPrice: '',
  },

  ready: function(){
    let goodsInfo = this.properties.goodsInfo;
    this.setData({
      goodsPic: goodsInfo.goodsImg,
      goodsName:  goodsInfo.template_name,
      goodsCode: goodsInfo.sku,
      goodsPrice:  goodsInfo.sale_price,
      orginalPrice: goodsInfo.original_price,
    })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClick: function(e){
      let goodsCode = e.currentTarget.dataset.goodscode;
      let forShowType = this.properties.forShowType;
      let graphicsId = "";
      let goodsgraphic = this.properties.goodsInfo.graphics;
      goodsgraphic.forEach(item=>{
        graphicsId += item.graphic_id
        graphicsId += '_'
      })
      graphicsId = graphicsId.substr(0,graphicsId.length - 1)
      goodsCode = goodsCode.substring(0, 12);
      wx.navigateTo({
        url: '/customization/customGoodsDetail/customGoodsDetail?goodsCode=' + goodsCode + "&type=" + forShowType + "&graphicsId="+ graphicsId,
      })
    }
  }
})
