const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
import { EVENTS, KEYSTORAGE } from '../../../../src/const.js'
import events from '../../../../src/events'
import {splitImg} from '../../../../utils/utils'
import { getZpGoods, getMidSeason } from '../../../../service/games' // 奖品详情，及抽奖,
let num = 1, //用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转123
  lotteryArrLen = 0, //放奖品的数组的长度
  lottery = '';
let isHasPhone = false;
let isError = false;

Component({
  //组件的属性列表
  properties: {
    phones: String,
    bgColor: Array,
  },
  data: {
    picUrl: `${cdn}/assets/common/${brand}/image/`,
    //text: '恭喜  ***NN 获得50元优惠券；恭喜 ***玲 获得免单大奖；恭喜  ***清 腾讯年卡； ***东 腾讯年卡；恭喜  ***ex 获得50元优惠券；恭喜 ***欢 获得免单大奖；',
    // marqueePace: 1,//滚动速度
    // marqueeDistance2: 0,//初始滚动距离
    // marquee2copy_status: false,
    // marquee2_margin: 30,
    // size: 28,
    // orientation: 'left',//滚动方向
    // interval: 20, // 时间间隔
    points: "",
    phone: "",
    tanShow: false,
    inputValue: '',
    downArr: splitImg('shuangjiantou_down.png' ,'common'),
    upArr:splitImg('shuangjiantou_up.png' ,'common'),
    showDetail: false,
    drawNoticePic:'',
    drawPointer: splitImg('draw_pointer.png'),
    brandTitle: splitImg('mid_draw_title.png'),
    bigBackGround: '',
    midBackGround: '',
    smallBackGround: '',
    noticeBrand: '',
    errTanShow: false,
    errPic: '',
    blackBgShow: false,

  },
  ready: function () {
    this.getZPgoods()
    this.onLoad()
    this.onShow()
  },
  methods: {
    onLoad() {
      events.register(this, EVENTS.EVENT_CRMINFO);
      let aniData = wx.createAnimation({
        duration: 2000,
        timingFunction: 'ease-in-out'
      });
      this.aniData = aniData;
    },

    onShow: function () {
      console.log(this.properties.bgColor);
      this.setData({
        bigBackGround: this.properties.bgColor[0],
        midBackGround: this.properties.bgColor[1],
        smallBackGround: this.properties.bgColor[2],
        noticeBrand: this.properties.bgColor[3],
      })
      // // 页面显示
      // var vm = this;
      // var length = vm.data.text.length * vm.data.size;//文字长度
      // var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
      // vm.setData({
      //   length: length,
      //   windowWidth: windowWidth,
      //   marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
      // });
      // vm.run2();// 第一个字消失后立即从右边出现
    },
    // run2: function () {
    //   var vm = this;
    //   var interval = setInterval(function () {
    //     if (-vm.data.marqueeDistance2 < vm.data.length) {
    //       // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
    //       vm.setData({
    //         marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
    //         marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
    //       });
    //     } else {
    //       if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
    //         vm.setData({
    //           marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
    //         });
    //         clearInterval(interval);
    //         vm.run2();
    //       } else {
    //         clearInterval(interval);
    //         vm.setData({
    //           marqueeDistance2: -vm.data.windowWidth
    //         });
    //         vm.run2();
    //       }
    //     }
    //   }, vm.data.interval);
    // },

    /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO && isHasPhone) {
      isHasPhone = false;
      let json = {
        phone:  wx.getStorageSync('user_info').phone,
        type: 'a618',
      }
      this.getLottery(json);
    }
  },

    //===============GO按钮================
    startRollTap() {
      if(isError){
        this.setData({
          blackBgShow: true,
          errTanShow: true,
        })
      } else {
        let json;
        if(this.properties.phones){
          json = {
            phone: this.properties.phones,
            type: 'a618',
          }
          this.getLottery(json);
        } else {
          app.getCRMInfoFn();
          isHasPhone = true;
        }
      }
    },

    clickClose() {
      this.setData({
        errTanShow: false,
        tanShow: false,
        blackBgShow: false,
      })
    },

    //跳转crm链接
    gotoWebView: function (linkUrl) {
      let deCodeURL = encodeURIComponent(linkUrl);
      wx.navigateTo({
        url: `/pages/webview/webview?linkUrl=${deCodeURL}`
      })
    },
    //点击弹窗领取券
    clickLQ:function(){
      let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand];
      wx.navigateTo({
        url: '../../../member/myCouponList/myCouponList?name=' + name
      })
    },

    //跳转首页
    goShop: function () {
       wx.switchTab({url: '/pages/index/index'});
    },

    goCoupon: function(){
      let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand];
      wx.navigateTo({
        url: '../../../member/myCouponList/myCouponList?name=' + name
      })
    },
    //奖品列表
    getZPgoods: function () {
      console.log('1028409183')
      var data = {
        "brand": brand,
        "lotteryType":'a618'
      }
      getZpGoods(data).then(res => {
        console.log('==============================奖品？？？？')
        console.log(res.data)
        this.setData({
          lottery: res.data
        })
        lottery = res.data
        lotteryArrLen = res.data.length
      }).catch(err => {
        wx.showToast({
          title: res.msg,
          duration: 2000
        });
      });
    },
    bindKeyInput(e) {
      this.setData({
        inputValue: e.detail.value
      })
    },
    showDetails: function(e){
      this.setData({
        showDetail: true
      });
    },

    closeDetails: function(e){
      this.setData({
        showDetail: false
      });
    },

    getLottery: function(_data){
      getMidSeason(_data).then(res => {
        setTimeout(function () {
          wx.hideLoading()
        }, 500)
        this.setData({ tanShowWhite: true })//防止重复调用接口
        let aniData = this.aniData; //获取this对象上的动画对
        aniData.rotate(1440 * num - 360 / lotteryArrLen * Number(res.data - 1)).step(); //设置转动的圈数
        this.setData({ aniData: aniData.export() })
        setTimeout(function () {
          this.setData({
            tanShowWhite: false,
            blackBgShow: true,
            tanShow: true ,
            drawNoticePic: splitImg('tan_'+lottery[res.data - 1].img),
          })
        }.bind(this), 3000)

      }).catch(err => {
        isError = true
        wx.hideLoading()
        let errPic = '';
        if(err.msg === "当前不是活动期间"){
          errPic = "mid_noTime.png"
        } else if(err.msg  === "您没有满足条件的订单"){
          errPic = "mid_noOrder.png"
        } else if(err.msg  === "您已没有抽奖机会"){
          errPic = "mid_noChance.png"
        } else{
          isError = false
          errPic = "netErro.png"
        }
        this.setData({
          blackBgShow: true,
          errTanShow: true ,
          errPic: splitImg(errPic, 'common'),
        })
        return
      });
    }
  }
})

