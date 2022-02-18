// components/shortVideos/shortVideoList/shortVideoList.js
import {splitImg} from '../../utils/utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    shortVideoList : Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    shortVideoList : {},
    shortVideoPlay: splitImg('shortVideoPlay.jpg', 'common')
  },
  ready:function(){
    var shortVideoList = this.properties.shortVideoList
    this.setData({
      shortVideoList
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick:function(e){
      // console.log(`aaa,${JSON.stringify(e)}`)
      let type = e.currentTarget.dataset.type
      if (type == 'more'){
        wx.navigateTo({ url: `/shortVideo/shortVideoListMore/shortVideoListMore` });
      }
      else{
        let detail = e.currentTarget.dataset.detail
        wx.setStorageSync('shortVideoDetailParams',detail)
        wx.navigateTo({ url: '/shortVideo/shortVideoListDetail/shortVideoListDetail' });
      }

    }

  }
})
