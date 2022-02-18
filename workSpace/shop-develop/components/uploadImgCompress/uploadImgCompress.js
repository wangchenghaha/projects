// components/uploadImgCompress/uploadImgCompress.js
import {chooseFile, compressImage, uploadImage} from "../../service/upload";
import {getImageInfo } from "../../service/saveImg";
const app = getApp();
const {brand} = app.config;
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
    canvas: {
      display: 'none',
      width:500,
      height: 500
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    upload(){
      const ctx = wx.createCanvasContext('myCanvas')

      wx.chooseImage({
        success: function(res){
          console.log(res.tempFilePaths[0],'before****', ctx)
          ctx.drawImage(res.tempFilePaths[0], 0, 0, 150, 100)
          ctx.draw()
          console.log(res.tempFilePaths[0],'after****')
        }
      })
    },
    async uploadImg(){
      // 选择图片 返回数组
      const chooseFileArr = await chooseFile();
      const chooseImg = chooseFileArr[0];
      // 获取图片信息
      const imgInfo = await getImageInfo(chooseImg, true);
      this.drawImgToImg(imgInfo);
      return
      // 压缩图片
      const compressedImg = await compressImage(chooseImg, 40);
      console.log(compressedImg,'***');

      console.log(imgInfo,'***');
      // 上传图片
      const uploadParam = {
        moduleName: `/assets/wechat/${brand}/service/`
      };
      const uploadImg = await uploadImage(chooseImg, uploadParam);
      console.log(uploadImg)
      // this.triggerEvent('uploadedImg', compressedImg);
      // app.saveImage(compressedImg)
      //
      // console.log(imgInfo);
      //
      // this.triggerEvent('uploadedImg', chooseImg)
    },
    drawImgToImg(imgInfo = {}){
      // 最大宽度
      const maxWidth = 750;
      let {height, width, path} = imgInfo;
      const ctx = wx.createCanvasContext('myCanvas');
      // let {canvas} = this.data;
      ctx.rect(0, 0, width, height);
      if(width > maxWidth){
        height = maxWidth / (width/height);
        width = maxWidth;
      }
      const canvas = {
        display: 'block',
        width, height
      };
      this.setData({canvas});
      ctx.drawImage(path, 0, 0, width, height);
      ctx.draw(true, _=> {

      });
      const uploadImg = SelectorQuery.selectAll('.canvas').toDataURL('image/jpeg', 0.6)
      console.log(uploadImg,'***')
    }
  }
})
