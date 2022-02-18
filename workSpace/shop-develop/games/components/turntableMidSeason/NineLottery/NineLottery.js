import {splitImg, hideStr, objToQuery} from '../../../../utils/utils'
import { KEYSTORAGE } from '../../../../src/const'
import { getGiftList, startlottery, getGiftRecords, checkPhoneOrder} from '../../../../service/games' // 奖品详情，及抽奖,
import {orderDetail} from '../../../../service/order'
import { wxShowToast } from '../../../../utils/wxMethods'
import {getVoucher} from "../../../../service/voucher"; // 奖品详情，及抽奖,
//获取应用实例
const app = getApp()
//计数器
var interval = null;
//值越大旋转时间越长  即旋转速度
var intime = 30;
const {brand, ETO_BRAND} = app.config;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    phones: String,
    bgColor: Array,
    gameCode: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    //9张奖品图片
    lottery: [],
    lotteryImage:[],
    btnconfirm: '',
    // clickLuck:'clickLuck',
    marqueeText: '',
    luckPosition: 3,
    color:[],
    brandTitle: '',
    isShowTModel: false,
    isluckly: false,
    unluckly: false,
    isRule: false,
    LuckshowImage: '',
    errShowImage:  splitImg("err_background.png", "common"),
    couponInfo: '',
    backgroundColor: '',
    gfitColor: '',
    homeColor: '',
    btnTxtColor:'',
    isErrTextShow:false,
    errMessage: '',
    buttonClicked: true,
    lotteryId: -1,
    noScroll: true, // 禁止滚动
    indexHeight: '',

    text: '',
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    size: 14,
    orientation: 'left',//滚动方向
    interval: 60, // 时间间隔
    giftInfo: {},
  },

  ready: function () {
    this.getZPgoods();
    this._getGiftRecords();
    this.onShow();
    this.onLoad();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onShow() {
      const {text, size} = this.data;
      this.setData({
        backgroundColor: this.properties.bgColor[0],
        gfitColor: this.properties.bgColor[1],
        homeColor: this.properties.bgColor[2],
        btnTxtColor: this.properties.bgColor[3],
        length: text *  size,
      })        // 页面显示
      this.runMarquee();// 水平一行字滚动完了再按照原来的方向滚动
    },

    // 跑马灯
    runMarquee: function () {
      var that = this;
      var interval = setInterval(function () {
        //文字一直移动到末端
        if (-that.data.marqueeDistance < that.data.length) {
          that.setData({
            marqueeDistance: that.data.marqueeDistance - that.data.marqueePace,
          });
        } else {
          clearInterval(interval);
          that.setData({
            marqueeDistance: wx.getSystemInfoSync().windowWidth,
          });
          that.runMarquee();
        }
      }, that.data.interval);
    },

    //点击抽奖按钮
    clickLuck:function(){
      if(!this.data.buttonClicked){
        return;
      }
      this.bottonClick(this);
      this._checkPhoneOrder();
    },


    //奖品列表
    getZPgoods () {
      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
      const {gameCode} = this.properties;
      getGiftList(gameCode).then(res => {
        wx.hideLoading();
        if(Array.isArray(res) && res.length){
          const config = res[0].config
          if(config){
            this.setData({
              backgroundColor: config.mainColor,
              rule: config.ruleDesc,
              btnconfirm: config.startButtonUrl,
              brandTitle: config.mainPicUrl
            });
            if(config.configJson){
              this.setData({
                configJson: JSON.parse(config.configJson)
              })
            }
          }
          this.setData({
            lottery: res
          })
        }

      }).catch(err => {
        wx.hideLoading();
        //this.getZPgoods();
      });
    },

  // 抽奖
  getLottery(){
    let {lottery} = this.data;
    let { phone } = wx.getStorageSync(KEYSTORAGE.crmInfo);
    const { gameCode } = this.properties
    const param = {
      phone, gameCode
    }
    wx.showLoading({
      title: '加载中',
    })
    startlottery(param).then(res => {
      wx.hideLoading()
      let currentIndex = 0;
      for (let i = 0; i < lottery.length; i++) {
        if(res.id === lottery[i].id){
          currentIndex = i
        }
      }
      this.startLottery1(currentIndex);
      this.setData({
        LuckshowImage: res.prizeWinPicUrl,
        giftInfo: res
      });
    }).catch(err => {
      wx.hideLoading()
    });
  },

  // 中奖记录
  _getGiftRecords(){
    let {marqueeText} = this.data;
    const { gameCode } = this.properties;
    getGiftRecords(gameCode).then(res =>{
      for (let i = 0; i < res.length; i++) {
        marqueeText = marqueeText + ' 恭喜  ' + hideStr(res[i].phone, 3,7) + '     获得' + res[i].prizeName + ';'
      }
      this.setData({marqueeText})
    })
  },


  startLottery1: function(luckPosition){
    let e = this;
    //清空计时器
    clearInterval(interval);
    var index = 0;
    //循环设置每一项的透明度
    interval = setInterval(function () {
      if (index > 5) {
        index = 0;
        e.data.color[5] = 0.5
      } else if (index != 0) {
        e.data.color[index - 1] = 0.5
      }
      e.data.color[index] = 1
      e.setData({
        color: e.data.color,
      })
      index++;
    }, intime);
    e.stop(luckPosition);
  },

  stop: function (which){
    var e = this;
    //清空计数器
    clearInterval(interval);
    //初始化当前位置
    var current = -1;
    var color = e.data.color;
    for (var i = 0; i < color.length; i++) {
      if (color[i] == 1) {
        current = i;
      }
    }
    //下标从1开始
    var index = current + 1;

    e.stopLuck(which, index, intime, 10);
  },

    /**
     * which:中奖位置
     * index:当前位置
     * time：时间标记
     * splittime：每次增加的时间 值越大减速越快
     */
    stopLuck: function (which, index,time,splittime){
      var e = this;
      //值越大出现中奖结果后减速时间越长
      var color = e.data.color;
      setTimeout(function () {
        //重置前一个位置
        if (index > 5) {
          index = 0;
          color[5] = 0.5
        } else if (index != 0) {
          color[index - 1] = 0.5
        }
        //当前位置为选中状态
        color[index] = 1
        e.setData({
          color: color,
        })
        //如果旋转时间过短或者当前位置不等于中奖位置则递归执行
        //直到旋转至中奖位置
        if (time < 400 || index != which){
          //越来越慢
          splittime++;
          time += splittime;
          //当前位置+1
          index++;
          e.stopLuck(which, index, time, splittime);
        }else{
        //1秒后显示弹窗
          setTimeout(function () {
              //中奖
              e.setData({
              isShowTModel: true,
              isluckly: true,
            })
          }, 1000);
        }
      }, time);
      console.log(time);
    },
      //进入页面时缓慢切换
    loadAnimation:function (){
      var e = this;
      var index = 0;
      // if (interval == null){
      interval = setInterval(function () {
        if (index > 7) {
          index = 0;
          e.data.color[7] = 0.5
        } else if (index != 0) {
          e.data.color[index - 1] = 0.5
        }
        e.data.color[index] = 1
        e.setData({
          color: e.data.color,
        })
        index++;
      }, 1000);
      // }
    },


    seeDetail: function(){
      this.setData({
        isShowTModel: true,
        isRule: true,
        indexHeight: wx.getSystemInfoSync().windowHeight * 3 + 'rpx',
      })
    },

    tanClose: function(){
      this.setData({
        isShowTModel: false,
        isErrTextShow: false,
        isRule: false,
        indexHeight: '',
        isluckly: false,
        unluckly: false,
      })
    },

    giftBtn: function(){
      let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[brand];
      wx.navigateTo({
        // url: '../../../member/couponsList/couponsList',
        url: '../../../member/myCouponList/myCouponList?name=' + name
      })
    },


    openWxCard: function(){
      let name = brand === 'BESTSELLER'? "" : ETO_BRAND[brand];
      const {prizeCode} = this.data.giftInfo;
      const reqParam = {
        phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
      };
      wx.showLoading({
        title: '加载中...',
        mask: true,
      });
      getVoucher(reqParam).then(res => {
        wx.hideLoading();
        if(Array.isArray(res) && res.length){
          const curCoupon = res.find(item => item.promotioncode === prizeCode);
          if(curCoupon){
            const couponInfo = {
              name,
              couponCode: curCoupon.couponno || curCoupon.voucherno || curCoupon.voucherno,
              couponId: curCoupon.promid || curCoupon.intergrationid || curCoupon.promotioncode,
            };
            wx.navigateTo({
              url: `/member/myCouponList/myCouponList${objToQuery(couponInfo)}`
            })
          }else{
            wxShowToast('暂无奖品')
          }
        }
        this.handleData(res);
      }).catch(err => {
      });
    },

    homeBtn: function(){
      wx.switchTab({url: '/pages/index/index'});
    },

    bottonClick: function(self){
      self.setData({
        buttonClicked: false
      })
      setTimeout(function () {
        self.setData({
          buttonClicked: true
        })
      }, 5000)

    },

    _checkPhoneOrder(){
      let {phone} = wx.getStorageSync(KEYSTORAGE.crmInfo);
      if(!phone){
        this.setData({
          tanShow: true,
          tanShow_xdcj: true,
          errMsg: '请删除小程序！重新进入。',
        })
        return
      }
      checkPhoneOrder(phone).then(res =>{
        if(res > 0){
          let json = {
            phone,
            gameCode: this.properties.gameCode,
          }
          this.getLottery(json);
        } else {
          wxShowToast("您没有满足条件的订单！");
        }
      })
    }
   },
})
