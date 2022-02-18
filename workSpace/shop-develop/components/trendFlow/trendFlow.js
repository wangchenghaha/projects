import { splitImg ,numToThousand, objToQuery} from '../../utils/utils'
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    vistorId: Number,
    listData: Object
  },


  /**
   * 组件的初始数据
   */
  data: {
    listData: [],
    praise: splitImg('praise_nor.png', 'common'),
    praised: splitImg('praise_sel.png', 'common'),
    vistorId : 0
  },

  ready: function () {
    let listData = this.properties.listData;
    for (let i = 0; i < listData.length; i++) {
      listData[i].praiseTotal = numToThousand(listData[i].praiseTotal)
    }
    this.setData({
      listData,
      vistorId: this.properties.vistorId
    });
    console.log("listData ======", listData)

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e){
      console.log(e);
      let type = e.currentTarget.dataset.type;
      let authorId = e.currentTarget.dataset.authorid;
      let item = e.currentTarget.dataset.item;
      app.gioTrack('pageclick_trendyzone_zc', {
        content_Id: item.id || '',
        title: item.title || ''
      })
      switch(type){
        case 'detail':
          if(item.jumpType === 'original'){
            const param = {
              newsID: item.newsId,
              createdTime: encodeURIComponent(item.createTime),
              title: encodeURIComponent(item.title)
            };
            wx.navigateTo({
              url: '/pages/informatCon/informatCon' + objToQuery(param)
            });
          } else if(item.jumpType === 'trendInfo'){
            wx.navigateTo({
              url: '/member/trendInformation/trendDetail/trendDetail?id='+ item.id + '&visitorid=' + this.data.vistorId
            })
          }
          break;
        case 'autor':
          wx.navigateTo({
            url: '/member/trendInformation/autorCenter/autorCenter?authorId='+ authorId + '&visitorid=' + this.data.vistorId
          })
          break;
        case 'praise':
          this.triggerEvent('praise', item);
          break;
      }
    }
  }
})
