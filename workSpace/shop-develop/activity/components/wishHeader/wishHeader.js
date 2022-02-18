import {splitImg} from '../../../utils/utils'
import {KEYSTORAGE} from "../../../src/const";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    wishDetail: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    banner: splitImg('banner@2x.png'),
    wishIcon: splitImg('wish-icon.png'),
  },

  /**
   * 组件的方法列表
   */
  methods: {
    getWxInfo(){

      const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      this.setData({wxInfo})
    },
  }
})
