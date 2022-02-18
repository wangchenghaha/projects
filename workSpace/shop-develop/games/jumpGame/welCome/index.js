import {splitGameImg} from '../../../utils/utils'
// const imgPath = `../jumpGames/`
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/jumpGames/`

import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
import { wxSubscription } from '../../../utils/wxSubscribe'
import {searchUser,createUser,activiGameTime,getCouponList,duijiangjilu,getCouphon,getWorldList,getHaoyouList} from '../netWorking'
// 记录当前选中人物的下标
var currentSelectIndex = 0
// 等级对应图片
const levelImg = {
  "A" : `${imgPath}1.png`,
  "B" : `${imgPath}2.png`,
  "C" : `${imgPath}3.png`,
  "D" : `${imgPath}4.png`,
  "E" : `${imgPath}5.png`,
  "F" : `${imgPath}6.png`
}

var isFirstDuihuan_list = true
var isFirstDuihuan_jilu = true
var isFirstPaihang_shijie = true
var isFirstPaihang_haoyou = true

var startTime = 0
var endTime = 0

const brand = getApp().config.brand
Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand,
    imgPath,
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
    noGameCount : false
  },

  /**
  * 订阅的事件回调
  */
 handleEvent: function (event, type) {


  if (type === EVENTS.EVENT_401 && event){
    this.setData({zhanweiView : true})
  }
  else if (type == EVENTS.EVENT_LOGINED && event){

    if (!wx.getStorageSync('isMember')){
      getApp().isMemberETO()
    }
    else{
      getApp().getCRMInfoFn()
    }
  }
  else if (type === EVENTS.EVENT_CRMINFO && event){
     //  获取手机号成功
       if (JSON.stringify(this.data.userData) === '{}'){
        this.requestDatas()
       }
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
  let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)

  console.log(`crm信息:${JSON.stringify(userInfo)}`)
  let params = `openId=${wxInfo.openId}`
  searchUser(params).then(e=>{
    if (!e){
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
      })
    }
    else{
      // console.log(`查询用户信息:${JSON.stringify(e)}`)
      this.setData({userData : e})
    }
  })

},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    isFirstDuihuan_list = true
    isFirstDuihuan_jilu = true
    isFirstPaihang_shijie = true
    isFirstPaihang_haoyou = true

    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);

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
  // renwuTap(e){
  //   // console.log(`选择人物:${JSON.stringify(e)}`)
  //   let id = parseInt(e.detail)
  //   currentSelectIndex = id == 4 ? 1 : id

    
  //   let autoPlay = this.data.autoPlay
  //   let renwuArrs = this.data.renwuArrs
  //   renwuArrs.forEach((item,index) => {
  //     if (index == id){
  //       item.isSelect = !item.isSelect
  //       if (item.isSelect){
  //         autoPlay = false
  //       }
  //       else{
  //         autoPlay = true
  //       }
  //     }
  //     else{
  //       item.isSelect = false
  //     }
  //   });
  //   this.setData({renwuArrs,autoPlay})
  // },
  btn(e){
    let type = e.detail
    // console.log(`点击事件：${type}`)
    if (type == 'paihangbang'){
      this.haipangRequset()
    }
    else if (type == 'duihuan'){
      this.ticketRequset()
    }
  },
  play(){
    // 测试代码
    // let json = {
    //   index : currentSelectIndex,
    //   life : 5,
    //   points : 0,
    //   icon : '',
    //   startTime : 1601378525810,
    //   endTime : 1604378525810,
    //   id : 1601378525810
    // }
    // // 活动开启
    // wx.navigateTo({
    //   url: `../index/index?params=${JSON.stringify(json)}`
    // });
    // return

    // if (currentSelectIndex == -1 || this.data.autoPlay){
    //   wx.showToast({
    //     title: '请选择人物',
    //     icon: 'none'
    //   });
    // }
    // else 
    if (this.data.userData.gameCount <= 0){
      this.setData({ noGameCount : true })
    }
    else{
      let currentTime = new Date().getTime()
      if (currentTime > startTime && currentTime < endTime){
        
        
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
    let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)

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
    noGameCount = false

    ticketSelect.ticket = false
    ticketSelect.currentIndex = 0
    paihangSelect.paihangbang = false
    paihangSelect.currentIndex = 1

    this.setData({
      ticketSelect,
      noGameCount,
      paihangSelect
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
      userLevelImg : this.data.userData.userLevel ? levelImg[this.data.userData.userLevel] : levelImg['A'],
      score : this.data.userData.score ? this.data.userData.score : 0,
      maxScore : this.data.userData.maxScore ? this.data.userData.maxScore : 0
    }
    paihangSelect.meJson = meJson

    if (this.data.paihangSelect.currentIndex == 1){
      getWorldList(isFirstPaihang_shijie).then(res => {
        isFirstPaihang_shijie = false
        res.forEach(item => {
          item.userLevelImg = item.userLevel ? levelImg[item.userLevel] : levelImg['A'],
          item.score = item.score ? item.score : 0,
          item.maxScore = item.maxScore ? item.maxScore : 0
        });

        paihangSelect.shijieArrs = res
        
        this.setData({paihangSelect})

      })
    }
    else{
      let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
      let label = '202009_jj_jump'
      if (getApp().config.brand == 'FOL'){
        label = '202009_fol_jump'
      }
      else if (getApp().config.brand == 'VEROMODA'){
        label = '202009_vm_jump'
      }
      else if (getApp().config.brand == 'ONLY'){
        label = '202009_only_jump'
      }
      else if (getApp().config.brand == 'SELECTED'){
        label = '202009_slt_jump'
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
          item.userLevelImg = item.userLevel ? levelImg[item.userLevel] : levelImg['A'],
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

    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    let _this = this
    setTimeout(() => {
      wx.hideLoading();
      
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      }
      else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
        console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
        if (!wx.getStorageSync('isMember')){
          getApp().isMemberETO()
        }
        else{
          getApp().getCRMInfoFn()
        }
      }
      else{
        _this.requestDatas()
      }

    }, 1000);
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
      let title = '型趣有礼，动动手指助我一臂之力'
      if (getApp().config.brand == 'FOL'){
        let random = Math.floor(Math.random() * 7 + 0)
        let titles = ['1.把嘴给我闭上，我说一个事儿，3，2，1...',"2.快点说要我干嘛，我赶时间","3.帮我戳，使劲戳，给我助力","4.害不戳？你已经成功吸引了我的注意","5.得嘞！这就来，马上给您整上！","6.点了吗，关注了吗，谢谢老铁","7.那不必须得点吗？咱俩sei跟sei啊~"]
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
        openid : openID,

        share_by : sharePams.employeeId || '',
        share_by_shop : sharePams.shopCode || '',
        
        utm_source : 'game',
        utm_medium : 'game_jump',
        utm_term : '',
        utm_campaign : ''
      }
      let path = `/activity/jumpGame/help/index?params=${JSON.stringify(json)}`
      let imageUrl = `${imgPath}shareImage1.png`
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