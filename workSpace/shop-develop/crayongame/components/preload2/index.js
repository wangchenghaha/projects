let len = 0
import Images from '../../common/image/index2.js'

Component({
  properties: {
    preload: {
      type: Boolean,
      value: true
    }
  },

  data: {
    imageList:[],
    isEnd: false,
    percent: 0
  },

  ready() {
    let { imageList } = this.data
    imageList = Images
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
