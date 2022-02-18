const app = getApp();
const {brand} = app.config;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    share: Object,
    detailPath: String
  },
  /**
   * 组件的初始数据
   */
  data: {
    brand,
  },
  lifetimes:{
    ready(){
      // this.initData();
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goDetail(e){
      const url = this.properties.detailPath;
      const {id} = e.currentTarget;
      const {title} = e.currentTarget.dataset;
      app.gioTrack('pageclick_share_rec_redbook', {
        title,
        content_Id: id
      })
      if(url && id){
        wx.navigateTo({ url: `${url}?id=${id}` })
      }
    },
    delShare(e){
      const {index} = e.currentTarget.dataset;
      const that = this;
      wx.showModal({
        title: '提示',
        content: '确认删除？',
        success(res){
          if(res.confirm){
            that.triggerEvent('removeTemp', index);
          }
        }
      })
    }
  }
})
