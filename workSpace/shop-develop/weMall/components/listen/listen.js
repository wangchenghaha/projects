// components/listen/listen.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    guideInfo:Object
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
      let description = e.currentTarget.dataset.desc;
      console.log(description);
      wx.navigateTo({
        url: `/weMall/daogouVideo/daogouVideo?videoName=${description}`,
      })
    }
  }
});
