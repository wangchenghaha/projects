function checkAuthSetting(type) {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success(res){
        res.authSetting[type] ? resolve(true) : resolve(false)
      }
    })
  })
}
function authorize(scope) {
  return new Promise((resolve, reject) => {
    wx.authorize({
      scope,
      success() {
        resolve(true)
      },
      fail(){
        resolve(false)
      }
    })
  })
}
function openAuthor(type, text) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示', //提示的标题,
      content: text, //提示的内容,
      showCancel: true, //是否显示取消按钮,
      cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
      cancelColor: '#000000', //取消按钮的文字颜色,
      confirmText: '设置', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#3CC51F', //确定按钮的文字颜色,
      success(res) {
        if (res.confirm) {
          wx.openSetting({
            success: res => {
              if(res.authSetting[type]){
                resolve(true)
              }
            }
          })
        }
      }
    })
  })
}
function getImageInfo(imgUrl, detail) {
  return new Promise((resolve, reject) => {
    wx.getImageInfo({
      src: imgUrl,
      success: res =>{
        if(res.errMsg === 'getImageInfo:ok'){
          console.log('获取图片信息成功=>>>', res);
          detail ? resolve(res) : resolve(res.path);
        }else{
          reject(new Error('获取图片信息失败'))
        }
      }
    })
  })
}
function getVideoInfo(videoUrl, detail) {
  return new Promise((resolve, reject) => {
    wx.getVideoInfo({
      src: videoUrl,
      success: res =>{
        detail ? resolve(res) : resolve(res.path);
      }
    })
  })
}

function saveImageToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveImageToPhotosAlbum({
      filePath:filePath,
      success: res =>{
        resolve(res)
      },
      fail: err =>{
        console.log('保存失败=>>>', filePath);
        reject(new Error('保存图片失败'))
      }
    })
  })
}
function saveVideoToPhotosAlbum(filePath) {
  return new Promise((resolve, reject) => {
    wx.saveVideoToPhotosAlbum({
      filePath:filePath,
      success: res =>{
        resolve(res)
      },
      fail: err =>{
        console.log('保存失败=>>>', filePath);
        reject(new Error('保存视频失败'))
      }
    })
  })
}
function downloadFile(fileUrl) {
  return new Promise((resolve, reject) => {
    wx.downloadFile({
      url: fileUrl, //仅为示例，并非真实的资源
      success: function(res) {
        if (res.statusCode === 200) {
          resolve(res.tempFilePath);
        }else{
          reject(new Error(res.message))
        }
      }
    })
  })
}
function checkNetwork() {
  return new Promise((resolve, reject) => {
    wx.getNetworkType({
      success: function(res) {
        // 返回网络类型, 有效值：
        // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
        let networkType = res.networkType
        resolve(networkType)
      }
    })
  })

}

export {
  getImageInfo,
  saveImageToPhotosAlbum,
  downloadFile,
  checkNetwork,
  checkAuthSetting,
  authorize,
  openAuthor,
  getVideoInfo,
  saveVideoToPhotosAlbum
}