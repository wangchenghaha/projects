const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;

import {getZpGoods, getZpHasOrder } from '../../service/games'//积分变动,
import { splitImg, hideStr, getCur } from '../../utils/utils'
import { getGiftRecords, getGiftList, startlottery, getHelp, getConsumePoints, getPlayer } from '../../service/lottery' // 奖品详情，及抽奖,

let num = 1;//用在动画上，让用户在第二次点击的时候可以接着上次转动的角度继续转123
let lotterys = '';
let lotteryArrLen = 0; //放奖品的数组的长度
let gameCode = '';
let phone = '';
let configId = '';
Component({
  //组件的属性列表12
  properties: {
    phones: String,
    bgColor: Array,
  },
  data: {
    picUrl: splitImg("cj_bg.jpg?v="+Math.floor(Math.random()*10000, 10000)),
    LogoPic:  splitImg("mid_draw_title.png"),
    goPic: splitImg("turnplate-pointer.png"),
    closePic: splitImg("tan_close2.png"),
    activityTitle: splitImg("title.png"),
    text: '',
    marqueePace: 1,//滚动速度
    marqueeDistance2: 0,//初始滚动距离
    marquee2copy_status: false,
    marquee2_margin: 30,
    size: 28,
    orientation: 'left',//滚动方向
    interval: 20, // 时间间隔
    points: "",
    phone: "",
    tanShow: false, // 透明背景
    tanShow_gift: false, // 差号
    showErrText: false, // 错误文字提示
    errMsg: '',
    bigBackGround:'',
    buttonClicked: true,

    marqueeText: '',
    lotterys: [],
    changeAnim: true,
    drawNoticePic:'',
    borderNum: 184,

     backgroundUrl: '',
    mainColor: '',
    startButtonUrl: '',
    turntableColor: '',
    ruleDesc: '',
    configJson: {},
    configId: '',
    playerNums: '',

    isTurntableNum: app.config.isTurntableNum
  },
  ready: function () {
    // this.getZPgoods()
    this.getPageOptions();
    this.onLoad()
    this.onShow()
    this._getGiftRecords()
    this._getGiftList();
    this._getHelp()
  },
  methods: {
    getPageOptions(){
      const pages = getCurrentPages();
      let currentPage = pages[pages.length - 1]; //获取当前页面的对象
      let curOptions = currentPage.options;
      gameCode = curOptions.gameCode || '';
      phone = curOptions.phone || '';
      configId = curOptions.configId || '';
      console.log('获取的url参======数' + gameCode + phone + configId)
    },
    onLoad(options) {
      console.log(options, '&&&&&');
      let aniData = wx.createAnimation({
        duration: 2000,
        timingFunction: 'ease-in-out'
      });
      this.aniData = aniData;

    },
    onShow: function () {
      this.setData({
        bigBackGround: this.properties.bgColor[0],
        brand: this.properties.bgColor[1],
        text: this.properties.bgColor[2],
      })
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
        if(!this.data.buttonClicked){
          return;
        }
        this.bottonClick(this);
        wx.showLoading({
          title: '加载中',
        })
        var data;
        if (this.properties.phones) {
          data = {
            "phone": this.properties.phones,
            gameCode,
            // "phone": 17710707044
          }
        } else {
          wx.showToast({
            title: '未获取到用户手机号',
            icon: 'none',
            duration: 3000
          });
          return
        }
        // getZpHasOrder(data).then(res => {
        startlottery(data).then(res => {
          wx.hideLoading()
          console.log('奖品位置' + res.data)
          let aniData = this.aniData; //获取this对象上的动画对

          let currentIndex = 0;
          for (let i = 0; i < lotterys.length; i++) {
            if(res.id === lotterys[i].id){
              currentIndex = i
            }
          }
          aniData.rotate(2880 * num - 360 / lotteryArrLen * Number(currentIndex)).step();
          num++






          // let random = Math.floor(Math.random()* 5);//生成随机数计算概率
          // aniData.rotate(1440 * num - 360 / this.data.lottery.length * Number(res.data - 1)).step(); //设置转动的圈数
          this.setData({ aniData: aniData.export() })
          // let lottery = this.data.lottery;
          // let currentType = "";
          // for (let i = 0; i < lottery.length; i++) {
          //   if(res.data === i){
          //     currentType = lottery[i].type;
          //   }
          // }
          setTimeout(function () {
            changeAnim = !changeAnim;
            this.setData({
              tanShow: true,
              tanShow_gift: true,
              showTan: true,
              showErr: false ,
              showErrText: false,
              drawNoticePic: res.prizeWinPicUrl,
              // errPic: this.data.lottery[res.data-1].tanPic,
              changeAnim,
              // giftInfo: res

              // tanShowWhite: false,
              // blackBgShow: true,
              // cheatsShow: false ,
              // tanShow: true,
              // drawNoticePic: res.prizeWinPicUrl,
              // changeAnim,
              // giftInfo: res
            })

            // if(currentType === "card"){
            //   this.setData({
            //     tanShow: true,
            //     tanShow_gift: true,
            //     showTan: false,
            //     showErr: true ,
            //     showErrText: false,
            //     errPic: this.data.lottery[res.data-1].tanPic,
            //   })
            // } else {
            //   this.setData({
            //     tanShow: true,
            //     tanShow_gift: true,
            //     showTan: true,
            //     showErr: false,
            //     showErrText: false,
            //     tanPic: this.data.lottery[res.data-1].tanPic,
            //   })
            // }

          }.bind(this), 3000)
          this.getPlayerNums()
        }).catch(err => {
          wx.hideLoading()
          let errPic = '';
          if(err.msg === "当前不是活动期间"){
            errPic = "memberDay_timeErr.png"
          } else if(err.msg  === "您没有满足条件的订单"){
            errPic = "mid_noOrder.png"
          } else if(err.msg  === "对不起，您已经到达兑换次数限制，无法再次兑换。"
                  || err.msg === "会员在时间段内已达领取次数限制，请稍后再试"){
            errPic = "memberDay_noChance.png"
          } else{
            errPic = "memberDay_ErrFrame.png"
            this.setData({
              showErrText: true,
              errMsg: err.msg ,
            })
          }
          this.setData({
            tanShow: true,
            tanShow_gift: true,
            showTan: false,
            showErr: true ,
            errPic: splitImg(errPic, 'common'),
          })
          return
        });
    },

    clickClose() {
      this.setData({
        tanShow: false,
        tanShow_gift: false,
        showErrText: false,
      })
    },

    //点击弹窗领取券
    clickCoupon: function () {
      let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand];
      wx.navigateTo({
        url: '../../../member/myCouponList/myCouponList?name=' + name
      });
    },

    //转发分享功能
    onShareAppMessage: function () {
      return {
        title: '周五会员日来袭！',
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
        "lotteryType": 'FRIDAY'
      }
      getZpGoods(data).then(res => {
        console.log('==============================奖品？？？？')
        console.log(res.data)
        let lottery = res.data;
        for (let i = 0; i < lottery.length; i++) {
          lottery[i].imagePic = splitImg(lottery[i].img)
          lottery[i].tanPic =  splitImg("tan_"+lottery[i].img);
        }
        console.log("========", lottery)
        this.setData({
          lottery,
        })
      }).catch(err => {
        wx.showToast({
          title: res.msg,
          duration: 2000
        });
      });
    },

    bottonClick: function(self){
      self.setData({
        buttonClicked: false
      })
      setTimeout(function () {
        self.setData({
          buttonClicked: true
        })
      }, 3000)

    },

    //积分兑换抽奖次数
    integral: function () {
      let data1 = {
        configId: this.data.configId,
        phone: wx.getStorageSync('user_info').phone
      }
      getConsumePoints(data1).then(res =>{
        this.getPlayerNums();
        wx.showToast({
          title: res.msg,
          duration: 2000
        });
      })
    },
    
    // 抽奖剩余次数 
    getPlayerNums: function () {
      let data1 = {
        configId: this.data.configId,
        phone: wx.getStorageSync('user_info').phone
      }
      getPlayer(data1).then(res =>{
        this.setData({
          playerNums: res.remainCount
        })
      })
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
      const resConfig = res[0].config
      this.setData({
        lotterys: res,
        backgroundUrl: resConfig.backgroundUrl,
        mainColor: resConfig.mainColor,
        startButtonUrl: resConfig.startButtonUrl,
        turntableColor: JSON.parse(resConfig.configJson).turntableColor,
        configJson: resConfig.configJson ? JSON.parse(resConfig.configJson): {},
        ruleDesc: resConfig.ruleDesc,
        configId: resConfig.id
      })
      this.getPlayerNums();
      this.triggerEvent('contInfo',{ configId: resConfig.id, sharedAddJoinCount: this.data.configJson.sharedAddJoinCount},{})
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
        title: err.msg,
        duration: 2000
      });
    });
  },

  // 助力
  _getHelp: function () {
    console.log('助力参数' + phone + '===' + configId + '===' + wx.getStorageSync('user_info').phone)
    if (configId) {
      let data = {
        creatorPhone: phone,
        configId: configId,
        helperPhone: wx.getStorageSync('user_info').phone
        // helperPhone: phone
      }
      getHelp(data).then(res =>{
        console.log('--------------助力状态' + res.msg)
        wx.showToast({
          title: '助力成功',
          duration: 2000
        });
      })
    }
  }

  }
})

