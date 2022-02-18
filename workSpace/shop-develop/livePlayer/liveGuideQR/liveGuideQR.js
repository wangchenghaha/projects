import {splitImg} from '../../utils/utils'
import {  getImageInfo, saveImageToPhotosAlbum} from '../../service/saveImg' 
const app = getApp();
const brand = app.config.brand;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rqImage: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let qrPic = '';
    if(brand === 'FOL' || brand === "VEROMODA"){
      if(options.qrCode === "1"){
        qrPic = splitImg("liver_one.png?v="+Math.floor(Math.random()*100000));
      } else if(options.qrCode === "2"){
        qrPic = splitImg("liver_two.png?v="+Math.floor(Math.random()*100000));
      }
    } else {
      qrPic = splitImg("live_guide_rq.png")
    }
    this.setData({
      rqImage : qrPic,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  saveQR : function(){
    let _this = this;
    app.isAuthor({
      type: 'scope.writePhotosAlbum',
      title: '需要授权相册权限才能保存',
      callBack: _this.saveImage,
    })
  },
  saveImage:function(){
    var text = '保存成功'
        // 获取图片信息
        getImageInfo(this.data.rqImage).then(res=>{
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: "添加小微，给你发券！",
      path: "livePlayer/liveGuideQR/liveGuideQR?qrCode=2",
      success: res =>{}
    }
  }
})