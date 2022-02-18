import {splitImg} from '../../utils/utils'
import { 
  getImageInfo, 
  saveImageToPhotosAlbum,
} from '../../service/saveImg' 
import {} from '../../service/coupon.js'
let app = getApp();
const cdn = app.config.cdn;
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    templateImage: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    showCoupon: true,
    templateImage:""
  },

  ready: function(){
    this.onShow();
  },

  /**
   * 组件的方法列表
   */
  methods: {

    onShow: function(){
      let templateImage = this.properties.templateImage;
      console.log(".....", templateImage)
      this.setData({
        templateImage,  
      })
    },

    closeCoupon: function(){
      this.properties.coupon_display = false;
      this.triggerEvent('changeShow', this.properties.coupon_display);
    },

    bouncedSave : function(){
      let _this = this;
      app.isAuthor({
        type: 'scope.writePhotosAlbum',
        title: '需要授权相册权限才能保存',
        callBack: _this.saveImage(),
      })
    },

    saveImage:function(){
        var text = '保存成功'
        // 获取图片信息
        getImageInfo(this.properties.templateImage).then(res=>{
          saveImageToPhotosAlbum(res).then(res=>{
            if (res.errMsg != 'saveImageToPhotosAlbum:ok'){
              text = res.errMsg
            }
            wx.showToast({
              title: text, //提示的内容,
              icon: 'none', //图标,
              duration: 2000, //延迟时间,
              mask: true, //显示透明蒙层，防止触摸穿透,
              success: res => {}
            });
          })
        })
    },
  }
})
