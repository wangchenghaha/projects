// livePlayer/playerDetail/playerDetail.js
import {
  splitImg
} from '../../utils/utils'
import { roomReplay } from '../../service/livePlayer'
import {getWxaCodeUnpubAddrQR} from "../../service/guide";
import {
  getShortVideoDetail
} from '../netWork/shortVideoRquest'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 播放按钮
    playBtnImg : splitImg('zbj_playBtn.png'),
    // 分享好友图片
    shareUserImg : '',

    // 判断是否是iphoneX
    isIphoneX: getApp().globalData.isIPhoneX,
    closeImg : splitImg('close.png','common'),
    hb_shoppingImg : splitImg('hb_shoppingg.png','common'),
    hb_shareImg : splitImg('hb_sharee.png','common'),
    hb_leftsjImg : splitImg('hb_leftsj.png','common'),
    updownImg : splitImg('updown.png','common'),
    bouncedShow : false,
    // 详情数据
    jsonDetail : {},
    // 商品数组
    goodDatas : [],
    // 全部商品数组
    totalGoodDatas : [],
    // 播放地址
    replayPaths : [],
    // 起始位置
    startTime : 0,
    // 视频时长
    endTime : 0,
    // 是否显示默认底部控制栏
    controls : false,
    // 单独商品时记录播放片段
    currentIndex : 0,
    // type判断center还是bottom
    type : '',
    // 首次展示引导框
    firstBounced : false,
    // 首次自动播放
    isFirstLoad : true,
    // 控制分享层
    canShowShare : false,
    // 分享图片
    shareImg : '',
    // 图片宽
    imgWidthRPX : 0,
    // 跳转其他页面但是没销毁本页
    isHidden : false,
    // 合成图宽度
    canvasWidth : 0

  },
  makeData(json){

    wx.setNavigationBarTitle({
      title: json.videoTitle
    });

    let videoPaths = []

    let goodDatas = this.data.goodDatas
    let totalGoodDatas = this.data.totalGoodDatas

    let firstBounced = this.data.firstBounced


    if (json.goodsList.length > 0){
      if (this.data.type == 'center'){
        if (json.videoUrl != '' || json.roomId != ''){

          if(json.videoUrl != ''){
            videoPaths.push(json.videoUrl)
          }
          else{
            this.getReplay(json.roomId)
          }

        }
        else{


          json.goodsList.forEach(item => {
            videoPaths.push(item.videoUrl)
          });
        }
        goodDatas = json.goodsList
      }
      else{

        json.goodsList.forEach(item => {
          videoPaths.push(item.videoUrl)
        });

        goodDatas.push(json.goodsList[this.data.currentIndex])

      }
      if (videoPaths.length > 1){

        let bol = wx.getStorageSync("firstBounced")
        if (!bol){
          wx.setStorageSync("firstBounced", true);
          firstBounced = true
        }
      }
      totalGoodDatas = json.goodsList
      this.setData({

        replayPaths : videoPaths,
        goodDatas,
        totalGoodDatas,

        firstBounced
      })

    }

    let id = `video_${this.data.currentIndex}`
    this.video = wx.createVideoContext(id, this);
    this.showBounces()
  },
  getReplay(roomId){
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    let _this = this
    let videoPaths = []
    roomReplay(roomId).then(res => {
      wx.hideLoading();
      if(res.errcode === 0 && res.live_replay && res.live_replay.length){

        videoPaths.push(res.live_replay[0].media_url)
        _this.setData({replayPaths : videoPaths})
      }
    }).catch(err => {
      wx.showToast({
        title: err,
        icon: 'none',
        image: '',
        duration: 1500,
        mask: false
      });
      wx.hideLoading();
    });
  },
  getDetailDatas(id){

    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    
    let _this = this
    // 详情数据
    getShortVideoDetail(id,wx.getStorageSync('wxOpenID')).then(res=>{
      wx.hideLoading();

      res.goodsList.forEach(item => {
        if (!(item.goodsName.indexOf('useCoveImg') != -1)){
          item.goodsName = item.goodsName.replace(/useCoveImg/g,'')
          item.coverImg = `${getApp().config.cdn}/goodsImagePC/${getApp().config.brand}/${item.goodsCode.substr(0,9)}/${item.goodsCode}/240400/${item.goodsCode}_T03.jpg`

          // https://cdn.bestseller.com.cn/goodsImagePC/JACKJONES/220221508/220221508E03/750750/220221508E03_T01.jpg
        }
      })
      let rpx = 240 * 750 / wx.getSystemInfoSync().windowWidth;

      _this.setData({jsonDetail : res,imgWidthRPX : rpx})
      _this.makeData(res)
      _this.createUserImg()
    }).catch(err => {

      wx.hideLoading();
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(`分享参数:${JSON.stringify(options)}`)
    let json = {}
    if (options.listViewJson){
       json = JSON.parse(options.listViewJson)
    }
    else if (options.shareJson){
      json = JSON.parse(options.shareJson)
    }
    else if (options.scene){
      let scan_url = decodeURIComponent(options.scene);
      // {"scene":"2_2_1260447545985773569","page":"livePlayer/playerDetail/playerDetail","is_hyaline":false,"width":120,"height":120}
      // console.log(`二维码内容：${JSON.stringify(options)}`)

      scan_url = scan_url.split('_')

      json.type = scan_url[0] == 1 ? 'center' : 'bottom'
      json.currentIndex = scan_url[1]
      json.id = scan_url[2]

    }
    this.setData({
      type : json.type,
      currentIndex : json.currentIndex || 0
    })
    this.getDetailDatas(json.id)

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.isHidden){
      this.setData({isHidden:false})
      this.video.play()
    }
  },
  showBounces : function(){
    if (this.data.totalGoodDatas.length > 0){

      setTimeout(() => {
      
        this.setData({
          bouncedShow : true,
        })
      }, 1000);
    }
  },
  firstTap(){
    this.setData({firstBounced : false})
  },
  // 开播
  videoUpdata : function(){

    this.setData({isFirstLoad : false})
  },
  // 滑动
  swiperChange : function(e){

    this.setData({controls : false})
    this.video.stop()

  },
  finish(e){

    let currentIndex = this.data.currentIndex
    currentIndex = e.detail.current
    let id = `video_${currentIndex}`
    this.video = wx.createVideoContext(id, this);
    if (this.data.type == 'bottom'){

      let goodDatas = this.data.goodDatas
      let arr = []
      arr.push(this.data.totalGoodDatas[currentIndex])
      goodDatas = arr
      this.setData({goodDatas})
    }


    this.setData({currentIndex})

    setTimeout(() => {
      this.video.play()
    }, 500);
    this.showBounces()

  },
  // 开始播放
  startPlay : function(){
    this.setData({controls : true})
  },
  // 播放结束
  endPlay(){

    if (this.data.replayPaths.length == 1){

      this.setData({controls : false})
      this.video.stop()
  
      let id = `video_0`
      this.video = wx.createVideoContext(id, this);
  
      setTimeout(() => {
        this.video.play()
      }, 500);
      
    }
    else{

      let currentIndex = this.data.currentIndex
      if (currentIndex == this.data.replayPaths.length - 1){
        currentIndex = 0
      }
      else{
        currentIndex += 1
      }
      this.setData({currentIndex})
    }
  },
  // 弹框背景
  bgTap : function(){

    this.setData({bouncedShow : false})
  },
  // 弹出弹框
  btnTap : function(e){
    this.setData({bouncedShow : true})
  },
  // 关闭分享层
  shareBgTap(){
    this.setData({canShowShare : false})
  },
  // 点击行
  onClick : function(e){
    // console.log(`点击:${JSON.stringify(e)}`)
    let id = e.currentTarget.id
  },
  // 购买
  buy : function(e){
    let url = e.currentTarget.dataset.url
    // console.log(`地址:${url}`)
    wx.navigateTo({
      url: `/${url}`
    });
  },
  lookMoreTap(){
    var curPages =  getCurrentPages();
    if (curPages.length == 1){
      wx.redirectTo({
        url: '/livePlayer/listView/listView'
      });
    }
    else{
      wx.navigateBack({
        delta: 1
      });
    }

    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.video.pause()
    this.setData({isHidden:true})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.video.stop()
    this.video = ''
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
  // 生成二维码
  createQrCode(){

    return new Promise((resolve, reject) => {
      let playBtnImg = this.data.playBtnImg

      let scene = `${this.data.type == 'center' ? 1 : 2}_${this.data.currentIndex}_${this.data.jsonDetail.id}`
      const param = {
        scene,
        page: 'livePlayer/playerDetail/playerDetail',
        is_hyaline: false,
        width : 120,
        height : 120
      };
      // console.log(`aaaaaa:${JSON.stringify(param)}`)
      // aaaaaa:{"scene":"2_2_1260447545985773569","page":"livePlayer/playerDetail/playerDetail","is_hyaline":false,"width":120,"height":120}
  
      getWxaCodeUnpubAddrQR(param).then(res=>{
        const guideQR = res;
        // console.log(`二维码图片:${guideQR}`) //宽高 280px
        wx.getImageInfo({
          src: guideQR,
          success (res) {
            let json = {
              path : res.path,
              width : res.width,
              height : res.height
            }
            wx.getImageInfo({
              src: playBtnImg,
              success (ress) {
                json.playImg = ress.path
                json.playWidth = ress.width
                json.playImgHeight = ress.height
                resolve(json)
              }
            })

          }
        })
  
      }).catch(err=> {
        wx.hideLoading();
        console.log(err)
        reject(err)
      });

    })

  },
  // 分享好友图片
  createUserImg(){
    wx.showLoading({title:'加载中...', mask: true});

    let _this = this

    wx.getImageInfo({
      src: _this.data.playBtnImg,
      success (playRes) {

        let qrOffset = 0.7  //二维码缩放系数
        
        let imageUrl = _this.data.jsonDetail.coverImgUrl

        let canvasID = 'canvasID'
        wx.getImageInfo({
          src: imageUrl,
          success (res) {
            let imgW = res.width
            let imgH = res.height
            // console.log(`合图背景图宽高:${imgW},${imgH}`)


              var cvsCtx = wx.createCanvasContext(canvasID,_this);
              cvsCtx.clearRect(0, 0, imgW, imgH);
              cvsCtx.drawImage(res.path, 0, 0, imgW, imgH);
              cvsCtx.drawImage(playRes.path, (imgW - playRes.width * qrOffset) / 2, (imgH - playRes.height * qrOffset) / 2, playRes.width * qrOffset, playRes.height * qrOffset);


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
                        // console.log(`绘制完成:${JSON.stringify(res)}`)

                        _this.setData({shareUserImg : res.tempFilePath})

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
    })


  },
  // 分享按钮
  shareTap(){

    this.setData({bouncedShow : false})
    wx.showLoading({title:'加载中...', mask: true});
    this.createQrCode().then(qrResJson => {
      let qrOffset = 0.5  //二维码缩放系数
      let qrOffset_play = 0.7  //播放按钮二维码缩放系数

      let imageUrl = this.data.jsonDetail.coverImgUrl
      if (this.data.goodDatas.length == 1){ 
        imageUrl = this.data.goodDatas[0].coverImg.replace(/240400/g,'6241000') 
        
      } 

      let _this = this
      let canvasID = 'canvasID'
      wx.getImageInfo({
        src: imageUrl,
        success (res) {
          let imgW = res.width
          let imgH = res.height
          // console.log(`合图背景图宽高:${imgW},${imgH}`)


            var cvsCtx = wx.createCanvasContext(canvasID,this);
            cvsCtx.clearRect(0, 0, imgW, imgH);
            cvsCtx.drawImage(res.path, 0, 0, imgW, imgH);
            cvsCtx.drawImage(qrResJson.playImg, (imgW - qrResJson.playWidth * qrOffset_play) / 2, (imgH - qrResJson.playImgHeight * qrOffset_play) / 2, qrResJson.playWidth * qrOffset_play, qrResJson.playImgHeight * qrOffset_play);
            cvsCtx.drawImage(qrResJson.path, imgW - qrResJson.width * qrOffset, imgH - qrResJson.height * qrOffset, qrResJson.width * qrOffset, qrResJson.height * qrOffset);
  
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
                      // console.log(`绘制完成:${JSON.stringify(res)}`)

                      _this.setData({canShowShare : true,shareImg : res.tempFilePath,canvasWidth : imgW})
  
                    }
                  })
            });
        },
        fail:(err =>{
          wx.hideLoading();
            console.log(`错误：￥「${JSON.stringify(err)}」`)
        })
      })

    })


  },
  // 分享朋友圈
  shareMoment(){
    console.log(`分享到朋友圈`)

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
    wx.saveImageToPhotosAlbum({
      filePath: this.data.shareImg, //图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径,
      success: res => {
        wx.showToast({
          title: '图片保存成功',
          icon: 'none'
        });
      }
    });

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let jsonDetail = this.data.jsonDetail

    let title = jsonDetail.videoTitle
    let shareJson = {
      type : this.data.type,
      currentIndex : this.data.currentIndex,
      id : jsonDetail.id
    }
    let path = `/livePlayer/playerDetail/playerDetail?shareJson=${JSON.stringify(shareJson)}`
    // console.log(`分享地址:${path}`)

    let imageUrl = this.data.shareUserImg || jsonDetail.coverImgUrl
    return{
      title: title,
      path : path,
      imageUrl : imageUrl,
      success:function(e){
        console.log(`分享成功`)
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  }
})