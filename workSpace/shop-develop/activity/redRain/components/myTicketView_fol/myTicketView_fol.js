// activity/redRain/components/myTicketView_fol/myTicketView_fol.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    jinbi : Number,
    noViewHeight : Number,
    yhqArrs : Array,
    imgPath : String

  },

  /**
   * 组件的初始数据
   */
  data: {
    jinbi : 0,
    noViewHeight : 0,
    yhqArrs : [],
    imgPath : ''
  },

  ready(){
    this.setData({
      jinbi : this.properties.jinbi,
      noViewHeight : this.properties.noViewHeight,
      yhqArrs : this.properties.yhqArrs,
      imgPath : this.properties.imgPath
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
