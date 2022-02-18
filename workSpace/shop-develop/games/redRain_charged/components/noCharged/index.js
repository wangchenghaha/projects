// pages/components/noCharged/index.js.js
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/redRain_charged/`
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    img : `${imgPath}noCharged.png`,
    bgAnimate : 'bouncedBgAnimation',
    animate : 'bouncedAnimation'

  },

  /**
   * 组件的方法列表
   */
  methods: {
    setImg(){
      this.setData({
        img : `${imgPath}noCharged1.png`
      })
    },
    closed(){
      let {bgAnimate,animate} = this.data
      bgAnimate = 'bouncedBgAnimation1'
      animate = 'bouncedAnimation1'
      this.setData({
        bgAnimate,
        animate
      })
      setTimeout(() => {
        this.triggerEvent('noChargedclosed')
      }, 300);
    }
  }
})
