/**
 * 海报绘制
 * @param {String} circleBg 背景图/海报
 * @param {String} qrCodeUrl 二维码
 */
const drawPoster = function(circleBg, qrCodeUrl){
  let posterCanvas = wx.createSelectorQuery().select('#posterCanvas')
  return new Promise((resolve, reject) => {
    posterCanvas.fields({node: true, size: true}).exec(res => {
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')
      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr

      // 绘制海报
      wx.getImageInfo({
        src: circleBg,
        success: res => {
          let imageUrl = res.path // 图片临时地址
          let imageW = res.width
          let imageH = res.height
          let ratio = imageW/canvas.width  // 获取比例
          let imageObj = canvas.createImage()
          imageObj.src = imageUrl
          imageObj.onload = (res) => {
            ctx.drawImage(imageObj, 0, 0, imageW/ratio, imageH/ratio);
            // 绘制二维码
            wx.getImageInfo({
              src: qrCodeUrl,
              success: res => {
                let qrImageUrl = res.path
                let qrImageW = 130 // 二维码大小（正方形）
                let qrRatio = ratio
                let qrImageObj = canvas.createImage()
                qrImageObj.src = qrImageUrl
                qrImageObj.onload = (res) => {
                  //            图片        left    top                                width            height
                  ctx.drawImage(qrImageObj, 5, canvas.height-(qrImageW+2)/qrRatio, qrImageW/qrRatio, qrImageW/qrRatio)
                  // canvas转图片临时路径
                  wx.canvasToTempFilePath({
                    canvas: canvas,
                    fileType: 'jpg',
                    success: res => {
                      resolve(res)
                    },
                    fail: err => {
                      reject(err)
                    }
                  })
                }
              },
              fail: err => {
                reject(err)
              },
            })
          }
        },
        fail: err => {
          reject(err)
        },
      })
    })
  })
}

export default {drawPoster};