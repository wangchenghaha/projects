// activity//tiggerGame/shareView/shareView.js
import{objToQuery} from "../../../utils/utils"
import {genQr,cdn} from '../netWorking'
import QRCode from '../../../utils/weapp-qrcode.js'

const brand = getApp().config.brand;
const qrUrl = 'https://couponni.bestseller.com.cn/'
const qrUrl_only = 'https://tigeronly.truu.com.cn/'
const qrUrl_veromoda = 'https://tigervm.truu.com.cn/'
// 临时用qrcode
// const tempQrUrl = 'https://tigervm.truu.com.cn/userID=1277513378798084098&pic=https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTKcUfMiceCdLMYpcYqh2cEibBEhibnzPSqsX69fMCngOHMSSFEsictLhfkhLXr7aWaKvoxgkZiabr0Oqww/132&name=%u6635%u79F0%u3001&openID=oLOUO0VevxKuzOfvMXsuYMiZHgqs'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    imagePath : `https://cdn.bestseller.com.cn/assets/common/${brand}/tigger/`,
    // 面对面邀请弹框
    canShow : false,
    // 二维码参数
    qrCode : '',
    // 二维码宽高适配
    qrViewWidthRPX : 240,
    qrViewHeightRPX : 240,
    qrViewWidthPX : 0,
    qrViewHeightPX : 0
  },
  // 返回上一页
  backView : function(){
    wx.navigateBack({
      delta: 1
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this
    wx.getSystemInfo({
        success: function(res){
          // console.log(`aaa:${JSON.stringify(res)}`)
          let qrViewWidthPX = that.data.qrViewWidthPX
          let qrViewHeightPX = that.data.qrViewHeightPX
          qrViewWidthPX = that.data.qrViewWidthRPX * (res.windowWidth / 750)
          qrViewHeightPX = that.data.qrViewHeightRPX * (res.windowWidth / 750)

          that.setData({
            qrViewWidthPX,qrViewHeightPX
          })
        }
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

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  guize : function(){
    wx.setStorageSync("lhjGZ", "1");
    wx.navigateTo({
      url: '../guizeView/guizeView'
    });
  },
  // 保存图片
  shareImage : function(){
    let qrCode = this.data.qrCode

    let wxInfo = wx.getStorageSync('lhjUser');
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let json = {
      userID : wxInfo.id,
      pic : wxInfo.facePic,
      name : escape(wxInfo.nickName),
      openID : wxInfo.openid,

      share_by : sharePams.employeeId || '',
      share_by_shop : sharePams.shopCode || '',

      utm_source : 'game',
      utm_medium : 'game_tigger',
      utm_term : '',
      utm_campaign : ''
    }
    // console.log(`aaa:${JSON.stringify(wxInfo)}`)
    let url = qrUrl
    if (getApp().config.brand == 'ONLY'){
      url = qrUrl_only
    }
    else if (getApp().config.brand == 'VEROMODA'){
      url = qrUrl_veromoda
    }
    qrCode = `${url}${objToQuery(json)}`.replace(/\?/g,'') // 二维码内容用于生成二维码
    // qrCode = tempQrUrl // 二维码内容用于生成二维码

    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    new QRCode('myQrcode',{
      text: qrCode,
      width: this.data.qrViewWidthPX,
      height: this.data.qrViewHeightPX,
      padding: 5, // 生成二维码四周自动留边宽度，不传入默认为0
      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
      callback: (res) => {
        // console.log(`qrCode扫描结果:${res.path}`)
      }
    })
    console.log(`qrCode : ${qrCode}`)

    wx.hideLoading();
    this.setData({
      canShow : true,
      qrCode
    })
  },
  bouncedTap:function(){this.setData({canShow : false})},
  // 保存图片事件
  saveImageTap : function(){
    this.setData({canShow : false})

    // 授权
    wx.getSetting({ success: res => {

      if (!res.authSetting['scope.writePhotosAlbum']){
        wx.authorize({
          scope:
            'scope.writePhotosAlbum',
          success: res => {

            this.saveImage()

          },
          fail: () => {
            wx.showModal({
              title: '提示', //提示的标题,
              content: '需要授权相册权限才能保存', //提示的内容,
              showCancel: true, //是否显示取消按钮,
              cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
              cancelColor: '#000000', //取消按钮的文字颜色,
              confirmText: '设置', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
                if (res.confirm) {
                  wx.openSetting({ success: res => {
                    if (res.authSetting['scope.writePhotosAlbum']){
                      
                      this.saveImage()

                    }
                  } });
                } 
              }
            });
          }
        });
      }
      else{

        this.saveImage()

      }
    } });
  },
  saveImage : function(){
    let json = {
      qrUrl : this.data.qrCode
    }
    genQr(json).then(e => {
      // console.log(`生成图片:${cdn}${e.pic_path}`)
      let imagePath = `${cdn}${e.pic_path}`

        // 获取图片信息
        wx.getImageInfo({
          src: imagePath, //图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径,
          success: res => {
            wx.saveImageToPhotosAlbum({
              filePath: res.path, //图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径,
              success: res => {
                wx.showToast({
                  title: '图片保存成功',
                  icon: 'none'
                });
              }
            });
          },
          fail: () => {
            wx.showModal({
              title: '提示', //提示的标题,
              content: '图片保存失败', //提示的内容,
              showCancel: false, //是否显示取消按钮,
              confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
              }
            });
          }
        });
    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let title = '我在参加“玩游戏赢好礼”活动，筹码告急求助力！'
    let wxInfo = wx.getStorageSync('lhjUser');
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let json = {
      userID : wxInfo.id,
      pic : wxInfo.facePic,
      name : wxInfo.nickName,
      openID : wxInfo.openid,

      share_by : sharePams.employeeId || '',
      share_by_shop : sharePams.shopCode || '',
      
      utm_source : 'game',
      utm_medium : 'game_tigger',
      utm_term : '',
      utm_campaign : ''
    }
    let path = `/activity/tiggerGame/helpView/helpView?params=${JSON.stringify(json)}`
    let imageUrl = `${this.data.imagePath}shareHY.jpeg`
    // console.log(`分享成功:${imageUrl}`)
    return{
      title: title,
      path : path,
      imageUrl : imageUrl,
      success:function(e){
        console.log(`分享成功:${path}`)
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  }
})