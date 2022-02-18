// recommendCourteous//homePage/homePage.js
import { splitImg, objToQuery } from '../../utils/utils'
import {	KEYSTORAGE, EVENTS } from '../../src/const.js'
import events from "../../src/events";
import { getHelpers} from '../common.js'
import {getWxaCodeUnpubAddrQR} from "../../service/guide";

const app = getApp();

const splashImgList = [
  {
    scale: 6218, // 6
    topTj: '50%',
    topInvite: '35%'
  },
  {
    scale: 5179, // x
    topTj: '50%',
    topInvite: '30%'
  },
  {
    scale: 5064, // 安卓
    topTj: '50%',
    topInvite: '30%'
  }
];


Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxInfo: wx.getStorageSync(KEYSTORAGE.wxInfo),
    crmInfo: wx.getStorageSync(KEYSTORAGE.crmInfo),
    unionid: wx.getStorageSync(KEYSTORAGE.unionid),

    bgImg: splitImg('lml_tj_01.jpg'),
    tjImg: splitImg('lml_tj_03.png'),
    ruleImg: splitImg('lml_tj_04.jpg'),
    inviteImg: splitImg('lml_tj_05.jpg'),
    endImg: splitImg('lml_tj_06.png'),
    succImg: splitImg('lml_tj_09.jpg'),
    succ2Img: splitImg('lml_tj_10.png'),
    posterImg: splitImg('lml_tj_11.png'),
    couponsImg: splitImg('lml_tj_12.png'),
    showShade: false,
    showRule: false,
    showSuccess: false,
    showPoster: false,
    showCoupons: false,
    isIPhoneX: getApp().globalData.isIPhoneX,
    topTj: '50%',
    topInvite: '40%',
    showTj: true,
    showInvite: false,
    showEnd: false,
    share: false,

    differenceHelpCount: '',
    helpList: [],
    newMemberHelpList: [],
    id: '',
    QRImg: ''
  },
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO && event) {
      this.getGameUserInfo();
    }
  },
  // 查询游戏用户信息
  getGameUserInfo(){
    this.setData({
      wxInfo: wx.getStorageSync(KEYSTORAGE.wxInfo),
      crmInfo: wx.getStorageSync(KEYSTORAGE.crmInfo),
      unionid: wx.getStorageSync(KEYSTORAGE.unionid),
    })
    if(!this.data.crmInfo){
      return
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo()
    // var str = '2021-08-30';
    // str = str.replace(/-/g,"/");
    // var date = new Date(str );
    // var now = new Date();
    // if(date < now) {
    //   this.setData({
    //     showTj: false,
    //     showEnd: true
    //   })
    //     // alert('is over...');
    // }
    // else {
        // var time = date - now;
        // alert((time/1000/60/60/24)+'Day');
    // }
    //订阅登录事件
    events.register(this, EVENTS.EVENT_CRMINFO);

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
    this.getGameUserInfo();
    if (this.data.share) {
      this.setData({
        share: false,
        showShade: true,
        showSuccess: true
      })
    }
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    this.setData({
      share: true
    })
    let json = {
      // creatorAvatarUrl: this.data.wxInfo.avatarUrl,
      // creatorNickname: this.data.wxInfo.nickName,
      // creatorOpenid: this.data.wxInfo.openId,
      // creatorPhone: this.data.crmInfo.phone,
      // creatorUnionid: this.data.unionid,
      id: this.data.id
    }
    console.log('============================>>>')
    console.log(json)
    return {
      title: '抢50元无门槛券',
      path:  `/recommendCourteous/help/help${objToQuery(json)} `,
      imageUrl: this.data.bgImg,
    }
  },
  openRule: function () {
    this.setData({
      showShade: true,
      showRule: true
    })
  },
  closeRule: function () {
    this.setData({
      showShade: false,
      showRule: false
    })
  },
  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let topTj = '50%',
          topInvite = '40%';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        console.log('========diff' + diff)
        if(diff < 100){
          topTj = item.topTj,
          topInvite = item.topInvite
        }
      });
      that.setData({
        topTj,
        topInvite
      })
    }catch (e) {}
  },
  btnInvite: function () {
    if(!getApp().checkLogin()){
      return
    }
    console.log(this.data.wxInfo)
    console.log(this.data.crmInfo)
    console.log(this.data.unionid)
    let json = {
      brand: getApp().config.brand,
      gameCode: "fission",
      creatorAvatarUrl: this.data.wxInfo.avatarUrl,
      creatorNickname: this.data.wxInfo.nickName,
      creatorOpenid: this.data.wxInfo.openId,
      // creatorPhone: '17710707047',
      creatorPhone: this.data.crmInfo.phone,
      creatorUnionid: this.data.unionid,
    }
    getHelpers(json).then(res => {
      // let startTime = new Date('2021-08-08 00:00:00').getTime()
      let startTime = new Date(res.config.startTime).getTime()
      let endTime = new Date(res.config.endTime).getTime()
      // let endTime = new Date('2021-08-09 00:00:00').getTime()
      let nowTime = new Date().getTime()
      if (nowTime < startTime || endTime < nowTime) {
        this.setData({
          showTj: false,
          showInvite: false,
          showEnd: true
        })
      }
      console.log('------>>>' + res.config.differenceHelpCount)
      console.log(startTime, endTime, nowTime)
      this.setData({
        differenceHelpCount: res.config.differenceHelpCount,
        helpList: res.helpList,
        newMemberHelpList: res.successList,
        id: res.id
      })
    }).catch(err => {
      wx.hideLoading();
      wx.showToast({
        title: res.msg,
        duration: 2000
      });
    })
    this.setData({
      showTj: false,
      showInvite: true
    })
  },
  goHome: function () {
    app.goBack()
  },
  openPoster: function () {
    this.setData({
      showShade: true,
      showPoster: true
    })
    this.createQrCode()
  },
   // 生成二维码
   createQrCode(){

    return new Promise((resolve, reject) => {
      // let playBtnImg = this.data.playBtnImg

      // let scene = `${this.data.type == 'center' ? 1 : 2}_${this.data.currentIndex}_${this.data.jsonDetail.id}`
      const param = {
        scene: `id=${this.data.id}`,
        page: 'recommendCourteous/help/help',
        // page: 'pages/content/content',
        is_hyaline: false,
        width : 120,
        height : 120
      };
      // console.log(`aaaaaa:${JSON.stringify(param)}`)
      // aaaaaa:{"scene":"2_2_1260447545985773569","page":"livePlayer/playerDetail/playerDetail","is_hyaline":false,"width":120,"height":120}

      getWxaCodeUnpubAddrQR(param).then(res=>{
        // console.log('---------->>' + res)
        this.setData({
          QRImg: res
        })
        // const guideQR = res;
        // console.log(`二维码图片:${guideQR}`) //宽高 280px
        // wx.getImageInfo({
        //   src: guideQR,
        //   success (res) {
        //     let json = {
        //       path : res.path,
        //       width : res.width,
        //       height : res.height
        //     }
        //     wx.getImageInfo({
        //       // src: playBtnImg,
        //       success (ress) {
        //         json.playImg = ress.path
        //         json.playWidth = ress.width
        //         json.playImgHeight = ress.height
        //         resolve(json)
        //       }
        //     })

        //   }
        // })

      }).catch(err=> {
        wx.hideLoading();
        console.log(err)
        reject(err)
      });

    })

  },
  savePhoto: function () {
    const canID = 'canvasa'
    let _this = this
    let vWidth = wx.getSystemInfoSync().windowWidth
    let vHeight = wx.getSystemInfoSync().windowHeight

    console.log(this.data.posterImg)
    wx.getImageInfo({
      src: this.data.posterImg,

      success (res) {
        wx.getImageInfo({
          src: _this.data.QRImg,
          success(res1){
            console.log(res1,'aaaaaaaaaaaaaaaaaaaaa')
            var cvsCtx = wx.createCanvasContext(canID,_this);

            cvsCtx.clearRect(0, 0,res.width, res.height);
            const offsetW = vWidth / res.width
            const offsetH = vHeight / res.height
            console.log(res.width*offsetW-res1.width*0.5)
            console.log(-((res.height-res1.height)/2 - 50))
            console.log(_this.data.QRImg)
                cvsCtx.drawImage(res.path, 0, 0,res.width, res.height,0,0,res.width*offsetW,res.height*offsetH);


                cvsCtx.save()
                 cvsCtx.beginPath()
                 cvsCtx.arc((vWidth-res1.width*0.2)/2 + res1.width*0.1 -5 , vHeight-res1.height*0.8+15 + res1.height*0.2, res1.width*0.2, 0, 2*Math.PI)
                 cvsCtx.clip()
                 cvsCtx.drawImage(res1.path, (vWidth-res1.width*0.4)/2 -5, vHeight-res1.height*0.8+15,res1.width*0.4,res1.height*0.4)
    //             cvsCtx.drawImage(res1.path, 0, 0,res1.width, res1.height,vWidth-res1.width+12,vHeight-res1.height + res1.height*0.4 -12,res1.width*0.4,res1.height*0.4);
                cvsCtx.restore()
                cvsCtx.draw(true,()=>{
                      wx.canvasToTempFilePath({
                          x: 0,
                          y: 0,
                          width: res.width,
                          height: res.height,
                          destWidth: res.width * 2,  //解决生成图模糊问题
                          destHeight: res.height * 2,    //解决生成图模糊问题
                          canvasId: canID,
                          success(res) {
                            console.log(`绘制完成:${res.tempFilePath}`)
                            let json = {
                                index : 0,
                                path : res.tempFilePath
                            }
                            _this.setData({
                              asddsa:true,
                              asddsaImage:json.path
                            })
          
          
                            wx.saveImageToPhotosAlbum({
                              filePath: res.tempFilePath, //图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径,
                              success: res => {
                                wx.showToast({
                                  title: '图片保存成功',
                                  icon: 'none'
                                });
                              },
                              fail: function (err) {
                                wx.showToast({
                                  title: '保存失败',
                                  icon: 'none',
                                  duration: 2000
                                })
                              }
                            });

                }
                })
          })
          }
        })
      }
    })
  },
  openCoupons:function () {
    this.setData({
      showShade: true,
      showCoupons: true
    })
  },
  hideShade: function () {
    this.setData({
      showShade: false,
      showRule: false,
      showSuccess: false,
      showPoster: false,
      showCoupons: false
    })
  }
})
