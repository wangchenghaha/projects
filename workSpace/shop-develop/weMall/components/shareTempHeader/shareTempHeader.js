// weMall/components/shareTempHeader/shareTempHeader.js
import {splitImg} from "../../../utils/utils";
import {KEYSTORAGE} from "../../../src/const";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    nickname: String,
    avatarUrl: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    bannerImg: splitImg('share-banner.jpg'),// banner 图
    wxUserInfo: wx.getStorageSync(KEYSTORAGE.wxInfo)
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
