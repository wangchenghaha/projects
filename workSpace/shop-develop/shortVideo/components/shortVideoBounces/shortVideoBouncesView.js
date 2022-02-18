// shortVideo/components/shortVideoBounces/shortVideoBouncesView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodsList : Array
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 动画参数
    animationBol:false,
    goodsList : []
  },
  ready:function(){
    var goodsList = this.properties.goodsList
    goodsList.forEach(e => {
      e.picUrl = `${getApp().config.cdn}/goodsImagePC/${e.brandCode}/${e.goodsCode}/${e.gsColorCode}/750750/${e.gsColorCode}_T01.jpg`
    });

    this.setData({
      goodsList,
      animationBol:true
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick : function(e){
      let codeStr = e.currentTarget.dataset.type
      // console.log(`sss:${JSON.stringify(e)}`)


      let json = {
        codeStr,
        detailParam : e.currentTarget.dataset.code
      }
      this.triggerEvent("onClick",json)
      this.setData({
        animationBol:false
      })
    }
  }
})
