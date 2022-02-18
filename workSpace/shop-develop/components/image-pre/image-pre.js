/**
 * 图片预处理组件
 * create by ant.liu
 */
Component({
  options: {
    multipleSlots: true
  },
  properties: {
    width: { // 图片初始宽度
      type: Number,
      value: 750,
    },
    height: { // 图片初始高度
      type: Number,
      value: 300,
    },
    borderRadius: { // 设置圆角
      type: Number,
      value: 0,
    },
    mode: { // 图片模型
      type: String,
      value: '',
    },
    src: { // 图片路径
      type: String,
      value: '',
    },
  },
  data: {
    imageLoaded: false, // 图片是否加载完成
  },
  attached() { },
  methods: {
    imageLoad(e){
      this.triggerEvent("imagepreload",e)
    },
    imageLoadHandle(e) {
      // 监听image加载完成
      setTimeout(() => {
        this.setData({
          imageLoaded: true,
        })
      }, 10)
      this.triggerEvent('load', e.detail);
    },
  }
})