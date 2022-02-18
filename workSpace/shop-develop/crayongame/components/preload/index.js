let len = 0
import Config from '../../config/index'
import Images from '../../common/image/index.js'
import Utils from '../../common/utils/index'
Component({
  properties: {
    preload: {
      type: Boolean,
      value: true
    }
  },

  data: {
    isBigPhone: Utils.judgeBigScreen(),
    imageList:[],
    isEnd: false,
    percent: 0
  },

  ready() {
    let { imageList } = this.data
    let startbg = ''
    if (Utils.judgeBigScreen()) {
      startbg = `${Config.cdnUrl}/bigbg.png`
    } else {
      startbg = `${Config.cdnUrl}/bg.png`
    }
    imageList = [startbg || ''].concat(Images|| [])
    this.setData({
      imageList,
      percent: 0
    })
  },

  methods: {
    onload() {
      len++
      this.setData({
        percent: (len / this.data.imageList.length * 100).toFixed(2)
      })
      if (len >= this.data.imageList.length) {
        setTimeout(() => {
          this.setData({
            isEnd: true
          })
        }, 500)
        setTimeout(() => {
            this.setData({
              percent: 0,
            })
            len = 0
            this.triggerEvent('imageAllLoad')
        }, 500)

      }
    }
  }
})
