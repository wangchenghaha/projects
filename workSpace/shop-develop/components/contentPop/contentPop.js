let app = getApp();
const cdn = app.config.cdn;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    activityTitle: String,
    ruleList: Array,
    buttonColor: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    ruleList:[],
    activityTitle: "",
    isShowNotice: true,
    color: "#000",
  },

  ready: function(){
     let activityTitle = this.properties.activityTitle;
     let ruleList = this.properties.ruleList;
     let isShowNotice = this.properties.isShowNotice;
     let color = this.setData.color;
     if(this.properties.buttonColor){
      color = this.properties.buttonColor
     }
     this.setData({
       activityTitle,
       ruleList,
       color
     })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeNotice: function(){
      this.properties.isShowNotice = false;
      this.triggerEvent('closeThisPop', this.properties.isShowNotice);
    },
  }
})
