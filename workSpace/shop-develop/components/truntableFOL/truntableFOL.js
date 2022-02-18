const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
import {getZpGoods,  getZpHasOrder } from '../../service/games'//积分变动,
import {orderDetail} from '../../service/order'
import {splitImg, hideStr} from '../../utils/utils'
import { getGiftRecords, getGiftList, startlottery } from '../../service/lottery' // 奖品详情，及抽奖,

let num = 1, //用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转123
  lotteryArrLen = 0, //放奖品的数组的长度
  lottery = '';
let lotterys = '';
let gameCode = '';

Component({
  //组件的属性列表
  properties: {
    phones: String
  },
  data: {
    picUrl: `${cdn}/assets/common/${brand}/image/`,
    text: '用户***乐 抽中10元优惠券；用户***ire 抽中10元优惠券；用户***nav 抽中时尚手提袋；用户***ella 抽中腰带；用户***芳 抽中5优惠券；用户***聪 10元优惠券；',
    marqueePace: 1,//滚动速度
    marqueeDistance2: 0,//初始滚动距离
    marquee2copy_status: false,
    marquee2_margin: 30,
    size: 28,
    orientation: 'left',//滚动方向
    interval: 20, // 时间间隔
    points: "",
    phone: "",
    tanShow: false,
    tanShowWhite: false,
    inputValue: '',
    backgroundPic: splitImg("backgroundPic.jpg?v="+Math.floor(Math.random()*100000)),
    goPicUrl: splitImg("turnplate-pointer.png?v="+Math.floor(Math.random()*100000)),
    brandTitle: splitImg('mid_draw_title.png'),
    downArr: splitImg('shuangjiantou_down.png' ,'common'),
    upArr:splitImg('shuangjiantou_up.png' ,'common'),
    showDetail: false,
    tanShowGift:false,
    color_one: '#fde2db',
    color_two: '#fe2a39',
    color_three: '#fe8386',
    errorNotice: splitImg('memberDay_ErrFrame.png' ,'common'),
    errMsg: '',

    marqueeText: '',
    lotterys: [],
    changeAnim: true,
    borderNum: 184,

    backgroundUrl: '',
    mainColor: '',
    startButtonUrl: '',
    turntableColor: '',
    ruleColor: '',
    ruleDesc: ''
  },
  ready: function () {
    // this.getZPgoods()
    this.getPageOptions();
    this.onLoad()
    this.onShow()
    this._getGiftRecords()
    this._getGiftList()
  },
  methods: {
    getPageOptions(){
      const pages = getCurrentPages();
      let currentPage = pages[pages.length - 1]; //获取当前页面的对象
      let curOptions = currentPage.options;
      gameCode = curOptions.gameCode || '';
    },
    onLoad(options) {
      let that = this;
      let aniData = wx.createAnimation({
        duration: 2000,
        timingFunction: 'ease-in-out'
      });
      this.aniData = aniData;

      //判断是否显示订单入口
      if (!wx.getStorageSync('zpId')){
        this.setData({ tanShow_login: true, tanShow: true })
      }

    },
    onShow: function () {
      // 页面显示
      var vm = this;
      var length = vm.data.text.length * vm.data.size;//文字长度
      var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
      vm.setData({
        length: length,
        windowWidth: windowWidth,
        marquee2_margin: length < windowWidth ? windowWidth - length : vm.data.marquee2_margin//当文字长度小于屏幕长度时，需要增加补白
      });
      vm.run2();// 第一个字消失后立即从右边出现
    },
    run2: function () {
      var vm = this;
      var interval = setInterval(function () {
        if (-vm.data.marqueeDistance2 < vm.data.length) {
          // 如果文字滚动到出现marquee2_margin=30px的白边，就接着显示
          vm.setData({
            marqueeDistance2: vm.data.marqueeDistance2 - vm.data.marqueePace,
            marquee2copy_status: vm.data.length + vm.data.marqueeDistance2 <= vm.data.windowWidth + vm.data.marquee2_margin,
          });
        } else {
          if (-vm.data.marqueeDistance2 >= vm.data.marquee2_margin) { // 当第二条文字滚动到最左边时
            vm.setData({
              marqueeDistance2: vm.data.marquee2_margin // 直接重新滚动
            });
            clearInterval(interval);
            vm.run2();
          } else {
            clearInterval(interval);
            vm.setData({
              marqueeDistance2: -vm.data.windowWidth
            });
            vm.run2();
          }
        }
      }, vm.data.interval);
    },
    //===============GO按钮================
    startRollTap() {
      let {changeAnim} = this.data;
      var data;
      var zpId;
      if (this.properties.phones) {
        if (wx.getStorageSync('zpId')){
          zpId = wx.getStorageSync('zpId')
        }else{
          this.setData({
            tanShow: true,
            tanShow_xdcj: true,
            errMsg: '请输入订单号！',
          })
          return
        }
        wx.showLoading({
          title: '加载中',
        })
        data = {
          "phone": this.properties.phones,
          // "phone": 17710707044,
          "bigOrderId": zpId,
          gameCode,
          // "gameCode": "EnterpriseWechat",
        }
      } else {
        
        this.setData({
          tanShow: true,
          tanShow_xdcj: true,
          errMsg: '请删除小程序！重新进入。',
        })
        return
      }
      this.setData({ tanShowWhite: true })//防止重复调用接口
      // getZpHasOrder(data).then(res => {
      startlottery(data).then(res => {
        wx.removeStorageSync("zpId", this.data.voteTitle);
        wx.hideLoading()
        this.setData({ tanShowWhite: false })//防止重复调用接口
        console.log('==============================中奖商品？？？？')
        console.log('奖品个数' + lotteryArrLen)
        console.log('奖品位置' + res.data)
        console.log('奖品对应索引' + Number(res.data - 1))

        let aniData = this.aniData; //获取this对象上的动画对


        let currentIndex = 0;
          for (let i = 0; i < lotterys.length; i++) {
            if(res.id === lotterys[i].id){
              currentIndex = i
            }
          }
          aniData.rotate(2880 * num - 360 / lotteryArrLen * Number(currentIndex)).step();
          num++


        // let random = res.data;//生成随机数计算概率
        // aniData.rotate(1440 * num - 360 / lotteryArrLen * Number(res.data - 1)).step(); //设置转动的圈数
        this.setData({ aniData: aniData.export() })

        setTimeout(function () {
          changeAnim = !changeAnim;
          this.setData({ 
            tanShow: true,
            tanShowGift: true,
            drawNoticePic: res.prizeWinPicUrl,
            changeAnim,
            // drawNoticePic: splitImg('tan_'+lottery[res.data - 1].img),
           })
        }.bind(this), 3000)

      }).catch(err => {
        wx.hideLoading()
        this.setData({
          tanShow: true,
          tanShow_xdcj: true,
          errMsg:  err.msg,
        })
        // wx.showToast({
        //   title: err.message,
        //   icon: 'none',
        //   duration: 1500
        // });
        return
      });

    },
    clickClose() {
      this.setData({
        tanShow: false,
        tanShow_login: false,
        tanShow_xdcj: false,
        tanShowGift: false,
        tanShowWhite: false,
      })
    },

    //点击弹窗领取券
    clickLQ:function(){
      let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand];
      wx.navigateTo({
        url: '../../../member/myCouponList/myCouponList?name'+ name
      });
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

    showOrderInput: function(){
      this.setData({
        tanShow_login: true,
        tanShow: true,
      })
    },

    //转发分享功能
    onShareAppMessage: function () {
      return {
        title: 'Bestseller折扣店！',
        path: '/pages/welcome/welcome'
      }
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
      var data = {
        "brand": brand,
        "lotteryType":'FOL-COUPON'
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
    getOrderDetail(){
      wx.showLoading({
        title: '加载中',
        mask: true
      });
      if(this.data.inputValue){
        let param = {
          orderToken: app.config.ORDER_TOKEN,
          bigorderCode: this.data.inputValue
        };
        orderDetail(param).then(res => {
          console.log(res)
          wx.hideLoading();
          if (res.status == 'TransactionSuccess' || res.status == 'WaitingShipment' || res.status == 'WaitingReceive'){
            wx.setStorageSync("zpId", res.bigorderCode)
            this.setData({ tanShow_login: false, tanShow: false })
          }else{
            wx.showToast({
              title: '订单状态不满足抽奖条件',
              duration: 2000
            });
          }
        }).catch(err => {
          wx.hideLoading();
          wx.showToast({
            title: err.message,
            duration: 2000
          });
        });
      } else {
        wx.hideLoading();
        wx.showToast({
          title: "请输入订单号！",
          duration: 2000
        });
      }
    },

    // 中奖记录列表(新)
    _getGiftRecords: function () { 
      console.log('================>>>>getGiftRecords')
      let {marqueeText} = this.data;
      getGiftRecords(gameCode).then(res =>{
         for (let i = 0; i < res.length; i++) {
            marqueeText = marqueeText + ' 恭喜  ' + hideStr(res[i].phone, 3,7) + '     获得' + res[i].prizeName + ';'
          }
         this.setData({marqueeText})
      })
      console.log(this.marqueeText)
    },
    //奖品列表（新）
    _getGiftList: function () {
      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      getGiftList(gameCode).then(res => {
        wx.hideLoading();
        console.log('==============================奖品？？？？')
        console.log(res)
        this.setData({
          lotterys: res,

          backgroundUrl: res[0].config.backgroundUrl,
          mainColor: res[0].config.mainColor,
          startButtonUrl: res[0].config.startButtonUrl,
          turntableColor: JSON.parse(res[0].config.configJson).turntableColor,
          ruleColor: JSON.parse(res[0].config.configJson).ruleColor,
          ruleDesc: res[0].config.ruleDesc
        })
        lotterys = res
        lotteryArrLen = res.length
        if (res.length === 8) {
          this.setData({
            borderNum : 132
          })
        } else if (res.length === 7) {
          this.setData({
            borderNum : 154
          })
        } else {
          this.setData({
            borderNum : 184
          })
        }
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          duration: 2000
        });
      });
    },
  }
})

