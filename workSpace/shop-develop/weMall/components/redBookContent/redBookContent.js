import { filterStr, judgeUrl } from '../../../utils/utils'
const app = getApp();
const {cdn, brand, DEV} = app.config;
const UPLOAD_DOMAIN_TEST = 'http://db.vm.cn'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    matchJson: Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    showSame: brand !== 'FOL',
    swiper:{
      list: [
        {},
        {},
        {}
      ],
      autoplay: true,
      indicatorDots: true,
      duration: 500,
      interval: 2000
    }
  },
  lifetimes: {
    ready(){
      let {matchJson={}} = this.properties;
      const {videoData = {}, copywritingListData = {}} = matchJson;
      const {rotationVideoList = []} = videoData;
      const {copywritingImgList = []} = copywritingListData
      if(rotationVideoList.length){
        rotationVideoList.forEach(item => {
          const {videoUrl, widthHeight = ''} = item;
          if(videoUrl){
            item.videoUrl = DEV ? UPLOAD_DOMAIN_TEST + videoUrl : judgeUrl(videoUrl)
          }
          if(widthHeight && widthHeight.includes('*')){
            const [width, height] = widthHeight.split('*')
            item.width = `${width}rpx`;
            item.height = `${height}rpx`;
          }else{
            item.width =  '100%';
            item.height = 'auto';
          }
        })
      }
      // 文案图
      if(copywritingImgList.length){
        copywritingImgList.forEach(item => {
          const {imgUrl = ''} = item;
          if(imgUrl){
            item.imgUrl = DEV ? UPLOAD_DOMAIN_TEST + imgUrl : judgeUrl(imgUrl)
          }
        })
      }
      this.setData({matchJson})
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
