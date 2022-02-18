import API from '../../../api/index'
import main from "../../../base/mains.js"
import {urls} from "../../../base/url.js"

Page({
  data: {
    showPage: false, // 是否显示页面
    baseColor: '',//基础色
    formId: '', // formId
    goods_number: '', // 商品数量
    order_amount: '', // 价格
    payment_status: 'ok', // 支付状态
    fissionData: {}, //保存裂变券页面的信息
    orderId: '', // 订单id
    powerPoint: 0,//能量值
    showPost: false,
    isTriggleRegister: false, // 是否唤起注册组件
    userModel:{},
    userMeg: {}, //用户信息
    template: {},
  },
  onLoad(options) {
    // const palette = {
    //   path: '/palette/index.js',
    // };
    // this.setData({
    //   template: palette,
    // });
    wx.hideShareMenu();
    this.setData({
      template: new Card().palette({
        proPic: '',
        proName: '',
        proPrice: '',
        groupPrice: '',
        shareMessage:'',
      }, ''),
    })
    this.initData();
  },
  onShow() {
    this.setData({
      baseColor: etoshop.baseColor
    })
    wx.hideShareMenu()
  },
  initData() {
    
    const that = this
    let stoUse = wx.getStorageSync('usemodel')
  
    let postMessage =  JSON.parse(wx.getStorageSync('postMessage') || {});
    let reqData = {
      page: urls.groupBuy.replace("/", ""),
      scene: postMessage.shareMessage,
      width: 270,
    }
    let url = urls.groupBuy.replace("/", "");
    console.log(`---|${urls.groupBuy.replace("/", "")}|`)
    main.request(apis.wxCode, reqData, "POST").then(res => {
      if (res.data.errcode == 200 || res.data.errcode == 0 || res.data.errcode == "SUCCESS") {
        that.setData({
          template: new Card().palette(postMessage, res.data.data.image),
        })
      }
    })
  },
  goonShop() {
    main.link(urls.onShop, 3);
  },
  ok(e) {
    let { detail: { path: imagePath } } = e
    this.imagePath = e.detail.path;
    console.log(this.imagePath)

  },
  onImgOK(e) {
    const that = this
    wx.saveImageToPhotosAlbum({
      filePath: this.imagePath,
      success(res) {
        wx.showToast({
          title: '图片已保存至相册',
        })
        that.setData({
          showPost: false
        })
      },
      fail(res) {
        wx.navigateTo({ url: '/shopSubpages/post/pages/opensetting/index', })
      }
    })
  },
  requestFissionInfo() {
    main.request(apis.getFissionActivity, {}, "POST").then(res => {
      console.log(res);
      if (res.data.data == false) {
        return;
      }
      let imgStr = res.data.data.activity_cover_pic;
      this.setData({
        fissionImg: imgStr,
        showFission: true,
        // fissionData: res.data
        fissionData: res.data.data
      })
    })
  },
  openFission() {
    let dataStr = JSON.stringify(this.data.fissionData);
    main.link(`${urls.fission}?fissionData=${dataStr}`);
  },
  goShare: function () {
    this.setData({
      showPost: true
    })
  },
  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      console.log(ops.target)
    }
    return {
      title: 'XXXX小程序',
      path: `pages/post/pages/borad/index?openid=` + this.data.userModel.openid + `&unionid=` + this.data.userModel.unionid + `&hand_origin=1`,
      imageUrl: 'https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=2925622357,4237394704&fm=26&gp=0.jpg',
      success: function () {
        console.log("转发成功" + JSON.stringify(res))
      },
      fail: function () {
        console.log("转发失败" + JSON.stringify(res))
      },
    }
  },
  goborad: function () {
    main.link(`${urls.borad}?openid=${this.data.userModel.openid}&unionid=${this.data.userModel.unionid}&hand_origin=1`, 1);
  }

  // closePost:function(){
  //   console.error("@@@@")
  //   let that = this;                       //生成海报分享朋友圈
  //   function startSaveImage(){
  //     // console.log(this.imagePath)
  //     wx.saveImageToPhotosAlbum({
  //       filePath: this.imagePath,
  //       success(res){
  //         that.setData({
  //           closeBot:true,
  //           postUrl:that.imagePath
  //         })
  //       }
  //     });

  //   }
  //   wx.getSetting({                               //保存海报图片
  //     success(res) {
  //       // console.log(res);
  //       if (res.authSetting['scope.writePhotosAlbum']) {
  //         startSaveImage.call(that);
  //         // mainService.modal('海报已保存')
  //       } else {
  //         wx.authorize({
  //           scope: 'scope.writePhotosAlbum',
  //           success(res) {
  //             // console.log(res);
  //             startSaveImage.call(that);
  //             // console.log(res,'success writePhotosAlbum');

  //           },
  //           fail(res) {
  //             // main.link(urls.openSetting);
  //             // console.log(res, 'err writePhotosAlbum');   
  //             wx.navigateTo({
  //               url: '/pages/homeModule/pages/opensetting/index',
  //             })                
  //           },
  //         })
  //       }
  //     },
  //   });
  // }
})
