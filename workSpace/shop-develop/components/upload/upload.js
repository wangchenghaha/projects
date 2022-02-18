const app = getApp();
const cdn = app.config.cdn;
import {splitImg} from '../../utils/utils'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    count: Number,
  },

  /**
   * 组件的初始数据
   */
  data: {
    cameraImg: splitImg('camera.png','common')
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
