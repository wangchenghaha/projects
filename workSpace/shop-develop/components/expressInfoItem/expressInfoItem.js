import{splitImg} from '../../utils/utils.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    expressInfo: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    expressDate: '',
    expressHours: '',
    expressState: '',
    expressDetail: '',
    isShow: false,
    expressImage: '',
  },

  ready: function(){
    let expressInfo = this.properties.expressInfo;
    let expressDate = expressInfo.fTime.substring(5, 10);
    let expressHours= expressInfo.fTime.substring(11, 16);
    let expressDetail = expressInfo.context;
    if(expressInfo.status === "签收"){
      this.setData({
        isShow: true,
        expressState: "已签收",
        expressImage: splitImg('express_done.png', 'common'),
      })
    } else if(expressInfo.status === "揽收"){
      this.setData({
        isShow: true,
        expressState: "已发货",
        expressImage: splitImg('express_start.png', 'common'),
      })
    } else {
      this.setData({
        isShow: false,
        expressImage: splitImg('express_ing.png', 'common'),
      })
    }
    this.setData({
      expressDate,
      expressHours,
      expressDetail
    })
   
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
