import {splitImg,  countDown, objToQuery} from '../../../utils/utils'
import { URL_CDN, KEYSTORAGE, EVENTS } from "../../../src/const";
import { wxShowToast } from '../../../utils/wxMethods'
import events from '../../../src/events';
import {brandAdapter} from '../brandAdapter'
import { getLightCoupons, lightCoupons, getLightCouponList, getLightCouponSuccessList, createLightCoupon} from '../../../service/sharecoupon'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    coupon_bg: splitImg("text_conponbg.png?v=11"),
    user_pic: '',
    user_name: '',
    user_option: '发起者',
    getCoupon: '',
    widthPercent: "40%",
    mySelfRecordList: [],
    //projeckName: 'firstPage',
    canShowPic: true,
    getCouponImg:  splitImg("couponShare_pop.png?v=11"),
    couponShow:  splitImg("couponShare_bg.png?v=11"),
    recordTab: [{
                  name: '我的点亮记录',
                  selected: true,
                  isLeft: true,
                },{
                  name: '成功点亮的VIP',
                  selected: false,
                  isLeft: false,
                }],
    isLeft: true,
    otherRecords: [],
    couponID: '',
    multipleNum: 0,
    contentInfo:  [ {text:'1.此券仅限BESTSELLER折扣店官网/小程序的会员使用'},
                    {text:'2.每人限领1张，每人限用1张，每单仅能使用1张优惠券，不可拆单使用，该券不与其他活动或优惠券同享，不找零，不兑现'},
                    {text:'3.使用时间为领取时起 至 2020/11/26 23:59:59，请在规定时间内使用，过期失效不予以返还'},
                    {text:'4.本优惠券仅限购买BESTSELLER折扣店官网/小程序指定专区商品时使用'},
                    {text:'5.限订单金额不低于商品吊牌总价1折时使用'},
                    {text:'6.使用方法：使用时在付款页面-“我的优惠券”选择对应优惠券'},
                    {text:'7.此优惠券一经提交，无法退还'},
                    {text:'8.使用优惠券的订单发生退货或者换货，优惠券不退还，退款时优惠券抵扣金额不退还'},
                    {text:'9.对于通过技术、代码篡改等任何不正常或不正当手段获取或使用优惠券者，该优惠券无效，品牌有权进行删除'},
                    {text:'10.由于账户盗用等非常规用户自身原因造成的优惠券问题，品牌不予返还或补偿'},
                    {text:'11.品牌在法律范围内保留对此优惠券使用细则的最终解释权'}
    ],
    isShowTModel: false,
    lightInfo: {},
    isHelpLight: false,
    shareIcon:  splitImg("couponShare_icon.png"),
    personIcon:  splitImg("couponShare_person.png"),
    myCouponId: '',
    adapter: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //订阅401事件
    events.register(this, EVENTS.EVENT_LOGINED);
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    // let {contentInfo} = this.data
    // let newContentInfo = [
    //   {text:'600-'+ brandAdapter().couponScend +'档位   核销时间： 2020年10月1日 – 2020 年10月8日'},
    //   {text:'2.	活动参与方式：'},
    //   {text:'a.点击活动页面中助力点亮按钮，发起助力，获得基础档位优惠券1张。'},
    //   {text:'b.转发给任意好友，好友进入助力页面，点击助力，发起者获得高档位优惠券1张，助力者获得基础优惠券1张。'},
    //   {text:'3.注意事项:'},
    //   {text:'a.'+ app.config.brand +'是绫致时装(天津)有限公司旗下品牌，绫致时装(天津)有限公司及其关联公司(以下简称“绫致”)为本次活动的举办方。本次活动每人仅限参与1次。'},
    //   {text:'b.优惠券过期未使用，将视为自动弃奖，不予补发。'},
    //   {text:'c.如您有其他活动相关疑问，请在工作时间内(周一至周五9:00-18:00，节假日除外)拨打活动电话：4008101 666，我们将竭诚为您解答。'},
    //   {text:'4.免责声明:'},
    //   {text:'a.由于参与用户自身参与活动方式不当或不正确而导致不能参与活动，在法律法规允许的范围内绫致不承担责任。'},
    //   {text:'b.凡以任何方式参加本次活动的，视为自愿接受本免责声明的约束。'},
    //   {text:'c.本声明未涉及的问题参见国家有关法律法规.当本声明与国家法律法规冲突时，以国家法律法规为准。'},
    //   {text:'d.本活动在法律允许范围内由绫致解释。'},
    // ]
    // contentInfo =  contentInfo.concat(newContentInfo)
    this.setData({
      // goodsAcivityId: bargainActivity.id, //活动ID
      // miniOpenid: wx.getStorageSync(KEYSTORAGE.openid), //小程序OPENID
      adapter: brandAdapter(),
      user_name: wxInfo.nickName, //昵称
      user_pic: wxInfo.avatarUrl, // 头像
      couponID: options.couponid,
      // contentInfo
    })


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
    let dates = "2021-08-31 23:59:59"
    // 获取总活动结束时间
    let years =  dates.substring(0, 4) + '/' + dates.substring(5, 7) + '/' + dates.substring(8, 11);
    let times = dates.substring(11)
    let timerDate = parseInt(new Date(`${years} ${times}`).getTime()) +  1000;
    this.activityCountDown(timerDate);
    this._getLightCoupons(this.data.couponID);
    this._getLightCouponList();
    this._getLightCouponSuccessList();

  },



  /**
   * 接收401事件(自有平台用户登录态失效)
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED) {
      this._getLightCoupons(this.data.couponID);
      this._getLightCouponList();
    }
  },

  closeCoupon: function(){
    this.setData({
      canShowPic: false,
    })
  },

  onClick: function(e){
    let selected = e.currentTarget.dataset.selected;
    let type = e.currentTarget.dataset.type;
    let {recordTab} = this.data
    switch(type){
      case 'recode':
        if(selected){
          return;
        }
        for (let i = 0; i < recordTab.length; i++) {
          recordTab[i].selected = !recordTab[i].selected;
        }
        this.setData({
          recordTab,
          isLeft: recordTab[0].selected === recordTab[0].isLeft,
        })
        break;
      case 'goLightCoupon':
        if(this.data.myCouponId){
          wx.navigateTo({
            url: "../couponShare/couponShare?couponID="+ this.data.myCouponId,
          })
        } else {
          wx.navigateTo({
            url: '../shareIndex/shareIndex',
          })
        }
        break;
      case 'goHome':
        app.goBack();
        break;
      case 'notice':
        this.setData({
          isShowTModel: true,
        })
        break;
      case "tanClose":
        this.setData({
          isShowTModel: false,
        })
        break;
      case 'helpLight':
        if (!app.checkLogin()) {
          return;
        }
        this.setData({
          canShowPic: false,
        })
        if(this.data.isHelpLight){
          this._createLightCoupon();
        } else {
          this._lightCoupons();
        }
        break;
      case "seeCoupon":
        let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[app.config.brand];
        wx.navigateTo({
          url: '../../../member/myCouponList/myCouponList?name=' + name
        })
        break;
      case "close":
        this.setData({
          canShowPic: false,
        });
        break;
      case 'createLight':
        this._createLightCoupon();
        break;
      case 'jump':
        wx.navigateTo({
          url: this.data.adapter.jumpLink
        })
        break;
    }
  },

    // 倒计时
    activityCountDown:function(endTime){
      let that = this;
      setInterval(() => {
        // let endTime = parseInt(new Date(`${year} ${time}`).getTime()) +  1000
        let countTimer = countDown(endTime);
        that.setData({
          timeObj: countTimer,
        })
      }, 1000);
    },

    _getLightCoupons: function(_id){
      let {isHelpLight, widthPercent, canShowPic} = this.data;
      getLightCoupons(_id).then(res => {
        if(res.friendOpenid){
          isHelpLight = true;
          widthPercent = "100%"
        }
        this.setData({
          lightInfo: res,
          isHelpLight,
          widthPercent,
          canShowPic: isHelpLight ? false: canShowPic,
        })
      }).catch(err=>{
        wxShowToast(err);
      })
    },

    _lightCoupons: function(){
      const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      const {lightInfo} = this.data;
      if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
        console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
        if (!wx.getStorageSync('isMember')){
          getApp().isMemberETO()
        }
        else{
          wx.showLoading({
            title: '加载中……',
            mask: true
          });
          setTimeout(() => {
            wx.hideLoading();
            getApp().getCRMInfoFn()
          }, 2000);

        }
      } else {
        let jsData = {
          brand: app.config.brand,
          friendNickname: wxInfo.nickName || '',
          friendOpenid: wx.getStorageSync(KEYSTORAGE.openid),
          friendPhone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone || '',
          id: this.data.couponID,
          lightStatus: 1,
          nickname: lightInfo.nickname,
          openid: lightInfo.openid,
          phone: lightInfo.phone,
        }
        wx.showLoading({
          title: '点亮中...',
          mask: true,
        })
        lightCoupons(jsData).then(res => {
          wx.hideLoading();
          this.setData({
            canShowPic: true,
            isHelpLight: true,
            widthPercent: "100%"
          })
        }).catch(err=>{
          wx.hideLoading();
          wxShowToast(err);
        })
      }
    },

    _getLightCouponList: function(){
      getLightCouponList().then(res =>{
        this.setData({
          mySelfRecordList: res,
          myCouponId: res[0].id,
        })
      }).catch(err=>{
        wxShowToast(err);
      })
    },

    _getLightCouponSuccessList: function(){
       getLightCouponSuccessList().then(res =>{
          let multipleNum = 0;
          if(res.length > 3){
            multipleNum = 3
          } else {
            multipleNum = res.length;
          }
          this.setData({
           multipleNum,
           otherRecords: res,
          })
       }).catch(err=>{
        wxShowToast(err);
      })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

      let title = "点亮你我他，好券一起拿！"
      let path = `/activity/couponShare/shareIndex/shareIndex`
      console.log(`分享成功:${path}`)
      return{
        title: title,
        path : path,
        success:function(e){
          console.log(`分享成功:${path}`)
        },
        fail:function(e){
          console.log(`分享失败`)
        }
      }
    },

    _createLightCoupon: function(){
      let that = this;
      const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      let jsData = {
        brand : app.config.brand,
        lightStatus: 0,
        nickname: wxInfo.nickName || '',
        openid:  wx.getStorageSync(KEYSTORAGE.openid),
        phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone || '',
      }
      wx.showLoading({
        mask: true,
      })
      createLightCoupon(jsData).then(res =>{
        wx.hideLoading();
        that.setData({
          canShowPic: false,
          myCouponId: res.id,
        })
        wx.navigateTo({
          url: "../couponShare/couponShare?couponID="+ res.id,
        })
      }).catch(err=>{
        wx.hideLoading();
        wxShowToast(err);
      })
    },

})
