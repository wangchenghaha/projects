import {splitGameImg, objToQuery} from '../../../../utils/utils'
import {EVENTS,KEYSTORAGE} from '../../../../src/const'
import events from "../../../../src/events";
import { wxSubscription } from '../../../../utils/wxSubscribe'
import {searchUser,createUser,activiGameTime,getCouponList,duijiangjilu,getCouphon,getWorldList,getHaoyouList, sendCoupon} from '../netWorking'
// 记录当前选中人物的下标
var currentSelectIndex = 0

var isFirstDuihuan_list = true
var isFirstDuihuan_jilu = true
var isFirstPaihang_shijie = true
var isFirstPaihang_haoyou = true

var startTime = 0
var endTime = 0
const app = getApp()
const brand = app.config.brand


const splashImgList = [
  {
    scale: 5622,
    img: splitGameImg('2021_51_main_background_six.jpg', 'jumpGame0501'), // 375/603 iphone 7
    logoTop: "64rpx",
    goHomeTop: '400rpx',
    selecteTop: "622rpx",
    renWutop: "384rpx",
    activityTop: "940rpx",
    pointTop: '978rpx',
    startTop: '1112rpx'
  },
  {
    scale: 4681,
    img: splitGameImg('2021_51_main_background.jpg', 'jumpGame0501'),  // 375/724 iphoneX
    logoTop: "172rpx",
    goHomeTop: '470rpx',
    selecteTop: "760rpx",
    renWutop: "520rpx",
    activityTop: "1080rpx",
    pointTop: '1128rpx',
    startTop: '1260rpx'
  },
  {
    scale: 5064,
    img: splitGameImg('2021_51_main_background.jpg', 'jumpGame0501'),   // 393/776  redMi Pro 8
    logoTop: "172rpx",
    goHomeTop: '470rpx',
    selecteTop: "760rpx",
    renWutop: "520rpx",
    activityTop: "1080rpx",
    pointTop: '1128rpx',
    startTop: '1260rpx'
  }
];


Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    zhanweiView : false,
    // 用户信息
    userData : {},
    autoPlay : true,
    paihangSelect : {
      paihangbang : false,
      currentIndex : 1,
      shijieArrs : [],
      haoyouArrs : [],
      meJson : {}
    },
    ticketSelect : {
      ticket : false,
      currentIndex : 0,
      listArrs : [],
      jiluArrs : []
    },
    noGameCount : false,
    couponImage: '',
    isNew: false,
    adapter: {
        img: splitGameImg('2021_51_main_background.jpg', 'jumpGame0501'),   
        logoTop: "172rpx",
        goHomeTop: '470rpx',
        selecteTop: "760rpx",
        renWutop: "520rpx",
        activityTop: "1080rpx",
        pointTop: '1128rpx',
        startTop: '1260rpx'
    }
  },

  /**
  * 订阅的事件回调
  */
 handleEvent: function (event, type) {

  if (type == EVENTS.EVENT_GAMECRMINFO && event) {
    //  获取手机号成功
    this.requestDatas()
  } 
},
requestDatas(){
  let zhanweiView = this.data.zhanweiView
  zhanweiView = false
  this.setData({zhanweiView})

  if (startTime == 0){
    this._activiGameTime()
  }

  let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
  let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)
  
  console.log(`crm信息:${JSON.stringify(userInfo)}`)
  let params = `openId=${wxInfo.openId}`
  searchUser(params).then(e=>{
    if (!e){
      if(!userInfo || !userInfo.phone){
        wx.clearStorageSync();
        app.navigateTo('member/login/login?game=true')
        return;
      }
      // 创建新用户
      let json = {
        phone : userInfo.phone,
        openid : wxInfo.openId,
        facePic : wxInfo.avatarUrl,
        nickName : wxInfo.nickName,
        memberno : userInfo.memberno,
        points : 0
      }
      
      createUser(json).then(res =>{
        // console.log(`创建用户信息:${JSON.stringify(res)}`)
        this.setData({userData : res})
        this._sendCoupon(e.id);
      })
    }
    else{
      // console.log(`查询用户信息:${JSON.stringify(e)}`)
      this.setData({userData : e})
      if(e.lotteryCount != 1){
        this._sendCoupon(e.id);
      }
    }
  })

},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_GAMECRMINFO)
    app.setUtmOptions(options)
    
    isFirstDuihuan_list = true
    isFirstDuihuan_jilu = true
    isFirstPaihang_shijie = true
    isFirstPaihang_haoyou = true
    currentSelectIndex = 0

  },
  // 活动时间
  _activiGameTime(){

    activiGameTime().then(res => {
      console.log(`活动时间:${JSON.stringify(res)}`)
      
      startTime = new Date(res.activityStartTime.replace(/-/g,'/')).getTime()
      endTime = new Date(res.activityEndTime.replace(/-/g,'/')).getTime()

    })
  },

  _sendCoupon(_id){
    let json = {
      userid: _id
    }
    sendCoupon(json).then( res =>{
      this.setData({
        couponImage: res.giftPic,
        isNew: true
      })
    })
  },

  btn(e){
    let type = e.detail

    if (type == 'paihangbang'){
      this.haipangRequset()
    }
    else if (type == 'duihuan'){
      this.ticketRequset()
    }
  },
  play(e){
    console.log("play==============",e)
    if (this.data.userData.gameCount <= 0){
      this.setData({ noGameCount : true })
    }
    else{
      let currentTime = new Date().getTime()
      if (currentTime > startTime && currentTime < endTime){
        if(e.detail[0].isSelect){
          currentSelectIndex = 0;
        } else {
          currentSelectIndex = 1;
        }
        
        if (getApp().config.jumpGameTemplateIds){
            wxSubscription("jumpGame").then(res => {
              this.playNext()
            }).catch(err => {
              this.playNext()
            });
        }
        else{
          this.playNext()
        }


      }
      else{
        let _this = this
        wx.showModal({
          title: '提示',
          content: '活动已结束',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              _this.backTap()
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }

    }
    
  },
  playNext(){
        let json = {
          index : currentSelectIndex,
          life : this.data.userData.gameCount,
          points : this.data.userData.points,
          icon : this.data.userData.facePic,
          startTime : startTime,
          endTime : endTime,
          id : this.data.userData.id
        }
        // 活动开启
        wx.navigateTo({
          url: `../index/index?params=${JSON.stringify(json)}`
        });
  },
  paihangTap(e){
    let type = e.detail
    if (type == 'list' || type == 'jilu'){
      let ticketSelect = this.data.ticketSelect
      ticketSelect.currentIndex = type == 'list' ? 0 : 1
      this.setData({ticketSelect})
      this.ticketRequset()
    }
    else{
      let paihangSelect = this.data.paihangSelect
      paihangSelect.currentIndex = type == 'haoyou' ? 0 : 1
      this.setData({paihangSelect})
      this.haipangRequset()
    }

  },
  duihuan(e){
    let detail = e.detail
    if (parseInt(this.data.userData.points) < parseInt(detail.pointsRequire)){
      wx.showToast({
        title: '金币不足',
        icon: 'none'
      });
      return
    }

    console.log(`兑换`)
    let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)

    let _this = this

    let json = {
        phone : userInfo.phone,
        userId : this.data.userData.id,
        exchangeGiftName : detail.giftName,
        giftId : detail.id,
        giftPic : detail.giftPic
    }
    getCouphon(json).then(res => {
      setTimeout(() => {
        _this.ticketRequset()
        _this.requestDatas()
      }, 1500);
    }).catch(err => {
      setTimeout(() => {
        _this.ticketRequset()
        _this.requestDatas()
      }, 1500);
    })
  },
  closed(){
    isFirstDuihuan_list = true
    isFirstDuihuan_jilu = true
    isFirstPaihang_shijie = true
    isFirstPaihang_haoyou = true

    let noGameCount = this.data.noGameCount
    let ticketSelect = this.data.ticketSelect
    let paihangSelect = this.data.paihangSelect
    let isNew = this.data.isNew
    noGameCount = false
    isNew = false

    ticketSelect.ticket = false
    ticketSelect.currentIndex = 0
    paihangSelect.paihangbang = false
    paihangSelect.currentIndex = 1

    this.setData({
      ticketSelect,
      noGameCount,
      paihangSelect,
      isNew
    })
  },
  // 返回
  backTap(){
    console.log(`返回`)

    var pageList = getCurrentPages();
    if (pageList.length > 1){
      wx.navigateBack({
        delta: 1
      });
    }
    else{
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
    
    
      
  },
    // 获取优惠券列表
    ticketRequset(){
      let ticketSelect = this.data.ticketSelect
      ticketSelect.ticket = true

      if (this.data.ticketSelect.currentIndex == 0){
        getCouponList(isFirstDuihuan_list).then(res => {
          isFirstDuihuan_list = false
          ticketSelect.listArrs = this.split_array(res,2)
          this.setData({ticketSelect})
        })
      }
      else{
        duijiangjilu({userid : this.data.userData.id},isFirstDuihuan_jilu).then(res => {
          isFirstDuihuan_jilu = false
          ticketSelect.jiluArrs = this.split_array(res,2)
          this.setData({ticketSelect})
        })
      }
  },
  // 获取排行榜
  haipangRequset(){
    let paihangSelect = this.data.paihangSelect
    paihangSelect.paihangbang = true

    let meJson = {
      facePic : this.data.userData.facePic,
      nickName : this.data.userData.nickName,
      userLevel : this.data.userData.userLevel,
      score : this.data.userData.score ? this.data.userData.score : 0,
      maxScore : this.data.userData.maxScore ? this.data.userData.maxScore : 0
    }
    paihangSelect.meJson = meJson

    if (this.data.paihangSelect.currentIndex == 1){
      getWorldList(isFirstPaihang_shijie).then(res => {
        isFirstPaihang_shijie = false
        res.forEach(item => {
          item.score = item.score ? item.score : 0,
          item.maxScore = item.maxScore ? item.maxScore : 0
        });

        paihangSelect.shijieArrs = res
        
        this.setData({paihangSelect})

      })
    }
    else{
      let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      let userInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo)
      let label = '202104_jj_jump'
      if (getApp().config.brand == 'FOL'){
        label = '202104_fol_jump'
      }
      else if (getApp().config.brand == 'VEROMODA'){
        label = '202104_vm_jump'
      }
      else if (getApp().config.brand == 'ONLY'){
        label = '202104_only_jump'
      }
      else if (getApp().config.brand == 'SELECTED'){
        label = '202104_slt_jump'
      }
      let json = {
        openid : wxInfo.openId,
        label,
        distance : 2,
        phone : userInfo.phone
      }
      getHaoyouList(json,isFirstPaihang_haoyou).then(res => {
        isFirstPaihang_haoyou = false
        res.forEach(item => {
          item.score = item.score ? item.score : 0,
          item.maxScore = item.maxScore ? item.maxScore : 0
        });

        paihangSelect.haoyouArrs = res
        
        this.setData({paihangSelect})

      })
    }
  },
  
  split_array(arr, len){
    var a_len = arr.length;
    var result = [];
    for(var i = 0 ; i < a_len ; i += len){
        result.push( arr.slice( i, i + len ));
    }
    return result;
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
    this.getSystemInfo();
    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    let _this = this
    setTimeout(() => {
      wx.hideLoading();

      if (!wx.getStorageSync(KEYSTORAGE.gameCRMInfo) || !wx.getStorageSync(KEYSTORAGE.wxPhone)){
        app.navigateTo('member/login/login?game=true')
        return;
      }
      else if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
        _this.requestDatas();
      }

    }, 1000);
  },

  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let adapter = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          adapter = item
        }
      });
      console.log("adapter ========== ", adapter);
      if(adapter){
        that.setData({
          adapter
        })
        console.log(that.data.adapter,'***init');
      }
    }catch (e) {}
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

    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    var openID = wx.getStorageSync('wxOpenID');
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let utmData = wx.getStorageSync('daogouLists');
    let title = '型趣有礼，动动手指助我一臂之力'
    if (getApp().config.brand == 'FOL'){
      let random = Math.floor(Math.random() * 7 + 0)
      let titles = ['把嘴给我闭上，我说一个事儿，3，2，1...',"快点说要我干嘛，我赶时间","帮我戳，使劲戳，给我助力","害不戳？你已经成功吸引了我的注意","得嘞！这就来，马上给您整上！","点了吗，关注了吗，谢谢老铁","那不必须得点吗？咱俩sei跟sei啊~"]
      title = titles[random]
    }
    else if (getApp().config.brand == 'ONLY'){
      title = '确认过眼神，你就是对的人，快来为我助力吧！'
    }
    else if (getApp().config.brand == 'VEROMODA'){
      title = '送一份来自月球的礼物，你准备好了吗？'
    }
    else if (getApp().config.brand == 'SELECTED'){
      title = '考验感情的时刻到了，快来帮帮我'
    }
    let json = {
      userid : this.data.userData.id || '',
      picUrl : wxInfo.avatarUrl,
      nickName:  wxInfo.nickName,
      openid : openID,

      share_by : sharePams.employeeId || '',
      share_by_shop : sharePams.shopCode || '',
    }
    if(utmData && utmData.length){
      utmData.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          json[item.key] = item.value;
        }
      })
    }
    let path = `/activity/games/jumpGame/help/index${objToQuery(json)}`
    let imageUrl =  splitGameImg('share_img.png','jumpGame0501')
    console.log(`分享成功:${path}`)
    return{
      title: title,
      path : path,
      imageUrl : imageUrl,
      success:function(e){
        
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  }
})