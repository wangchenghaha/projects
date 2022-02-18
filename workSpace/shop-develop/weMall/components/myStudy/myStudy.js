// weMall/components/guideStudy/guideStudy.js
import { getCurrentUrl } from '../../../utils/utils'
import {KEYSTORAGE} from "../../../src/const";
const pageUrl = 'weMall/guideVideo/guideVideo';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    video: Object,
    num: Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showTitle: true,
    showListSize: 4
  },
  lifetimes: {
    attached() {
      // 在组件实例进入页面节点树时执行

    },
    ready(){
      let showListSize = this.data.showListSize;
      showListSize = this.properties.num || this.properties.video.list.length
      this.setData({
        showListSize,
        showTitle: !(getCurrentUrl().includes('guideStudy'))
      });
      wx.removeStorageSync(KEYSTORAGE.guideStudy);
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的方法列表
   */
  methods: {
    goNextPage(){
      let curUrl = getCurrentUrl();
      if(curUrl.includes(pageUrl)){
        let curData = this.properties.video;
        wx.setStorageSync(KEYSTORAGE.guideStudy, curData);
        wx.navigateTo({url: '/weMall/guideStudy/guideStudy'})
      }
    },
    openVideo(e) {
      let videoName = e.currentTarget.dataset.name;
      wx.navigateTo({
        url: `/weMall/daogouVideo/daogouVideo?videoName=${videoName}`,
      })
    },
  }
})
