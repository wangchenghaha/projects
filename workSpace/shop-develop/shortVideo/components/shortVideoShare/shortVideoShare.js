// shortVideo/components/shortVideoShare/shortVideoShare.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    detailData : Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    detailData : {}
  },
  ready:function(){
    var detailData = this.properties.detailData
    this.setData({
      detailData
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick:function(e){
      let codeStr = e.currentTarget.dataset.code
      console.log(`aaa`)
      this.triggerEvent("shareOnClick",codeStr)
    }
  }
})
