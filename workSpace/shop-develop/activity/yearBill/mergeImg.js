class mergeImg {
    constructor(opts){
        this.bgImgJson = opts.bgImgJson
        this.qrImg = opts.qrImg
        this.callBack = opts.callBack

        this.createUserImg()
    }

  // 分享好友图片
  createUserImg(){
    wx.showLoading({title:'加载中...', mask: true});

    let _this = this

    // qrImg px
    let qrWidth = 170
    let qrX = 0
    let qrY = 0

    let canvasID = 'canvasID'
    wx.getImageInfo({
      src: _this.bgImgJson.img,
      success (res) {
        let imgW = res.width
        let imgH = res.height
        let img = res.path
        // console.log(`合图背景图宽高:${imgW},${imgH}`)

        qrX = (imgW - qrWidth) / 2
        qrY = imgH - qrWidth - imgH * 0.08

          var cvsCtx = wx.createCanvasContext(canvasID,_this);
          cvsCtx.clearRect(0, 0, imgW, imgH);
          cvsCtx.drawImage(img, 0, 0, imgW, imgH);
          cvsCtx.drawImage(_this.qrImg, qrX, qrY, qrWidth, qrWidth);


          cvsCtx.draw(true,()=>{
              wx.canvasToTempFilePath({
                  x: 0,
                  y: 0,
                  width: imgW,
                  height: imgH,
                  destWidth: imgW * 2,  //解决生成图模糊问题
                  destHeight: imgH * 2,    //解决生成图模糊问题
                  canvasId: canvasID,
                  success(res) {
                    wx.hideLoading();
                    console.log(`绘制完成:${JSON.stringify(res)}`)
                    _this.shareMoment(res.tempFilePath)

                  }
                })
          });
      },
      fail:(err =>{
        wx.hideLoading();
          console.log(`错误：￥「${JSON.stringify(err)}」`)
      })
    })


  }

  // 分享朋友圈
  shareMoment(saveImg){
    console.log(`分享到朋友圈`)

    // 授权
    wx.getSetting({ success: res => {

      if (!res.authSetting['scope.writePhotosAlbum']){
        wx.authorize({
          scope:
            'scope.writePhotosAlbum',
          success: res => {

            this.saveImage(saveImg)

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
                      
                      this.saveImage(saveImg)

                    }
                  } });
                } 
              }
            });
          }
        });
      }
      else{

        this.saveImage(saveImg)

      }
    } });

  }
  saveImage(saveImg){
    let _this = this
    wx.saveImageToPhotosAlbum({
      filePath: saveImg, //图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径,
      success: res => {
        wx.showToast({
          title: '图片保存成功',
          icon: 'none'
        });
        _this.callBack()
      }
    });

  }

}
module.exports = {
    mergeImg
}