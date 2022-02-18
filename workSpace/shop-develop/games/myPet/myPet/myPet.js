
import { splitImg, objToQuery } from '../../../utils/utils'
import { KEYSTORAGE } from "../../../src/const";
import {wxShowToast} from '../../../utils/wxMethods'
import {queryUserPoints } from '../service/adopted'
import {sign ,editFeedHeart, getCouponList, couponRecords, helpForIndex, openBox, getCoupon, getTaskList, finishTask,userFinishTaskList} from '../service/pets'
import {rules, getCoupons, popMsg, getCouponRecord, giftImage} from '../util'
import lottie from 'lottie-miniprogram'
const app = getApp();
const brand = getApp().config.brand
let innerAudioContext;
let bgmMusic = app.config.brand === 'FOL'? 'music/bgm_common.mp3':'music/bgm.mp3'

let frameFn = function () { };
let rid = 0;
let canvasDom = null;
let currOption ="";
let isOption = true;

const splashImgList = [
  {
    scale: 5622,
    img: splitImg('images/myPet_bg_six.jpg?v=1001', 'littlePet'), // 375/603 iphone 7
  },
  {
    scale: 4681,
    img: splitImg('images/myPet_bg_x.jpg?v=101', 'littlePet'),  // 375/724 iphoneX
  },
  {
    scale: 5064,
    img: splitImg('images/myPet_bg_x.jpg?v=101', 'littlePet'),   // 393/776  redMi Pro 8
  },
];

// 是否是任务里的分享
var isTaskShare = {
  bol : false,
  id : '1'
}
// 去完成
var goFinishID = '-1'
// 区分倒计时页还是其他页面
var isDaojishi = -1
Page({

  /**
   * 页面的初始数据
   */
  data: {
      petTitle:'',
      splashImg: splitImg('images/myPet_bg_x.jpg?v=101', 'littlePet'),
      backImg: splitImg("images/pet_back.png", 'littlePet'),
      userAvatar: '',
      loverIcon: splitImg("images/pet_lover_num.png", 'littlePet'),
      loverNum: "",
      signIcon: splitImg("images/pet_sign_icon.png", 'littlePet'),
      signBg:  splitImg("images/pet_signIn.png", 'littlePet'),
      boxImg:  '',
      boxClose: splitImg("images/pet_openBox_close.png", 'littlePet'),
      loveIcon:  splitImg("images/lover_icon.png", 'littlePet'),
      userInfo: {},
      // 任务图标
      taskOptions: [{
        name: "getFood",
        pic: splitImg("images/pet_task_getFood.png", 'littlePet'),
      },
      {
        name: "help",
        pic: splitImg("images/pet_task_help.png", 'littlePet'),
      },
      {
        name: "gift",
        pic: splitImg("images/pet_task_gift.png", 'littlePet'),
      },
      {
        name: "rule",
        pic: splitImg("images/pet_task_rule.png", 'littlePet'),
      }
      ],

      // 操作图标
      petOptions: [{
        name: "feel",
        pic: splitImg("images/pet_option_feel.png", 'littlePet'),
      },
      {
        name: "bathtub",
        pic: splitImg("images/pet_option_bathtub.png", 'littlePet'),
      },
      {
        name: "clear",
        pic: splitImg("images/pet_option_clear.png", 'littlePet'),
      }],

      feedPic: splitImg("images/pet_feed.png", 'littlePet'),
      feedNum: 1000,
      helpTitle: splitImg("images/pet_help_icon.png", 'littlePet'),
      closeIcon: splitImg("images/task_close.png", 'littlePet'),
      // 好友助力操作
      showFriends: [{
        icon: splitImg("images/pet_add_friend.png", 'littlePet'),
        nick: '',
      },
      {
        icon: splitImg("images/pet_add_friend.png", 'littlePet'),
        nick: '',
      },
      {
        icon: splitImg("images/pet_add_friend.png", 'littlePet'),
        nick: '',
      },
      {
        icon: splitImg("images/pet_add_friend.png", 'littlePet'),
        nick: '',
      },
      {
        icon: splitImg("images/pet_add_friend.png", 'littlePet'),
        nick: '',
      }],
      showHelp: false,
      showTask: false,
      showExchange: false,
      isShowNotice: false,
      showClear: false,
      isShowFeces: true,
      isShowAnim: true,
      isShowStatic: false,
      staticImg: '',
      isShowAdd: false,
      signShow: false,
      isInvite: true,
      isExchange:true,
      showBox: false,
      isFOL: false,
      taskTitle: splitImg("images/pet_food_icon.png", 'littlePet'),
      tasks: [],
      exchangeTitle: splitImg("images/pet_gift_icon.png", 'littlePet'),
      navis: [{
        name: "兑换礼品",
        selected: true,
      },
      {
        name: "兑换记录",
        selected: false
      }],
      couponList: [],
      alreadGetList: [],
      buttonColor: '#FF4A4B',
      activityTitle: '活动规则',
      ruleList: [],
      aminJson: [],
      url: '',
      petCanvas: [{
                    name: 'normal',
                    options: '',
                    isShow: true,
                  },
                  {
                    name: 'feel',
                    options: '',
                    isShow: false,
                  },
                  {
                    name: 'bathtub',
                    options: '',
                    isShow: false,
                  },
                  {
                    name: 'feed',
                    options:'',
                    isShow: false,
                  },
                ],
    fecesImage: splitImg("images/feces.png", 'littlePet'),
    popMessage: '',
    isShowPop: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    isTaskShare = {}
    goFinishID = '-1'
    isDaojishi = -1

    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const {petCanvas} = this.data;
    this.getSystemInfo();
    this._queryUserPoints();
    this._getCouponList();
    
    this.setData({
      userAvatar: wxInfo.avatarUrl,
      ruleList: rules(),
      isFOL: app.config.brand === 'FOL',
      petTitle: app.config.brand === 'FOL'? '绫致宠咖':'撸宠乐园'
    })
  },
  // 任务列表
  _getTaskList(){

    let folMetTask = wx.getStorageSync('folMetTask');
    if (folMetTask && folMetTask.index == '2'){
      // 首页单独处理
      this._finishTask(folMetTask.id)
      wx.removeStorageSync('folMetTask');
    }
    else{
      getTaskList().then(res => {
        isTaskShare.bol = true
        res.forEach(item => {
          item.isFinish = false
          item.currentFinishNum = 0
          if (!item.taskCode && !item.taskUrl){
            isTaskShare.id = item.id
            item.button = '去分享'
          }
          else{
            if (item.taskCode == '985211'){
              item.button = '去完成'
            }
            else{
              item.button = '去浏览'
            }
            
          }
        })
  
        userFinishTaskList(this.data.userInfo.id).then(res1 => {
          if (res1 && res1.length > 0){
            res1.forEach(item => {
              res.forEach(items => {
                if (parseInt(item.taskid) == parseInt(items.id)){
                  items.currentFinishNum += 1
                  if (items.currentFinishNum >= items.dayLimit){
                    items.isFinish = true
                    items.currentFinishNum = items.dayLimit
                  }
                  
                }
              })
            })
          }
  
          this.setData({
            tasks : res,
            showTask: true,
            isShowAnim: false,
            isShowStatic: true
          })
  
        })
  
        
      })
    }

  },
  // 完成任务
  _finishTask(id){
    finishTask(id,this.data.userInfo.id).then(res => {
      goFinishID = '-1'
      this.setData({userInfo : res})
      this._getTaskList();
    })
  },
    // 去完成
    goFinish(e){
      isTaskShare.bol = false
      let detail = e.currentTarget.dataset.detail
      // console.log(`aaaa:${JSON.stringify(detail)}`)
      goFinishID = detail.id
      wx.setStorageSync('hby_task', '1');

      let url = detail.taskUrl
      if (detail.taskCode){
        if (detail.taskCode == '985211'){
          // 喂养200g单独处理
          if (this.data.userInfo.feedToday >= 200){
            this._finishTask(goFinishID)
          }
          else{

              this.setData({
                showHelp: false,
                showTask: false,
                showExchange: false,
                isShowNotice: false,
                isShowAnim: true,
                isShowStatic: false,
                signShow: false,
                showBox: false
              })
              this.switchOption('normal');
          }
          wx.removeStorageSync('hby_task');
          goFinishID = -1
          return
        }
        else{
          url = `pages/goodsList/goodsList?list=${detail.taskCode}`
          isDaojishi = 1
        }
      }
      else if (detail.taskUrl.indexOf('rewardCenter/rcMain/rcMain') != -1 || detail.taskUrl.indexOf('content/content') != -1){
        isDaojishi = 1
      }
      else if (detail.taskUrl.indexOf('pages/index/index') != -1){
        // 首页单独处理
        wx.setStorageSync('folMetTask', {index : '1',id : goFinishID});
        wx.removeStorageSync('hby_task');
        goFinishID = -1
        app.goBack();
        
        return
      }
      else{
        isDaojishi = 0
      }

      app.navigateTo(url)
    },

  _queryUserPoints: function(){
    let {petCanvas} = this.data;
    queryUserPoints(app.getOpenId()).then(res =>{
      if(res){
        petCanvas[0].options = res.petInfo.actionPic1;
        petCanvas[1].options = res.petInfo.actionPic2;
        petCanvas[2].options = res.petInfo.actionPic3;
        petCanvas[3].options = res.petInfo.actionPic4;
        console.log("=========", petCanvas)
        this.setData({
          petCanvas,
          userInfo: res,
          staticImg: res.petInfo.staticPic,
          isShowFeces: res.clearCount > 0 ? true: false,
          signIcon: res.isSign === 1? splitImg("images/pet_sign_icon_sel.png", 'littlePet'):splitImg("images/pet_sign_icon.png", 'littlePet'),
        })
        this.init(petCanvas[0].options, petCanvas[0].name);
      }
    }).catch(err=>{
      wxShowToast(err)
    })
  },

  _editFeedHeart: function(_feed, _heart,_actionName){
    let jsData={
      feed: _feed,
      heart: _heart,
      userid: this.data.userInfo.id,
      actionName: _actionName
    }
    let that = this;
    editFeedHeart(jsData).then(res => {
      if(res){
        that.setData({
          userInfo: res,
          isShowAdd: true,
          loverNum: _heart,
        })
        that.slideupshow('addAnim', -10,1)
        setTimeout(function () {
          that.setData({
            isShowAdd: false,
          })
          that.slideupshow('addAnim', 10,1)
       }, 1000) 
      }
    }).catch(err=>{
      wxShowToast(err)
    })

  },

  _getCouponList(){
    getCouponList().then(res => {
        this.setData({
          couponList: getCoupons(res)
        })
        console.log("coupon============",this.data.couponList)
    }).catch(err=>{
      wxShowToast(err)
    })
  },

  init(animJson, canvas) {
    
    this.createSelectorQuery().selectAll('#' + canvas).node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 512
      canvas.height = 512

      const requestAnimationFrame = canvas.requestAnimationFrame;
      canvas.requestAnimationFrame = function () {
        frameFn = arguments[0];
        rid = requestAnimationFrame.apply(canvas, arguments);
        return rid;
      }
      // 页面第二次打开时动画默认不会开始，这里需要手动调用一次动画
      canvas.requestAnimationFrame(frameFn);
      canvasDom = canvas;
      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        path : animJson,
        rendererSettings: {
          context,
        },
      })
    }).exec()
  },

getSystemInfo: function(){
  let that = this
  try{
    let systemInfo = wx.getSystemInfoSync();
    const {windowHeight, windowWidth} = systemInfo;
    const scale = Math.floor((windowWidth/windowHeight * 10000));
    let splashImg = '';
    splashImgList.forEach(item => {
      const diff = Math.abs(item.scale - scale);
      if(diff < 100){
        splashImg = item.img
      }
    });
    if(splashImg){
      that.setData({
        splashImg
      })
      console.log(that.data.splashImg,'***init');
    }
  }catch (e) {}
},

  onClick: function (e) {
    let type = e.currentTarget.dataset.type;
    let status = e.currentTarget.dataset.status;
    let {userInfo, isFOL} = this.data;
    if(!isOption){
      wxShowToast(currOption+ "，请稍后！")
      return;
    }
    switch (type) {
      case 'getFood': //领饲料
        this._getTaskList()
        break;
      case 'help': // 好友助力
        this.setData({
          showHelp: true,
          isShowAnim: false,
          isShowStatic: true
        })
        let {isInvite} = this.data;
        let showFriends =  [{
                          icon: splitImg("images/pet_add_friend.png", 'littlePet'),
                          nick: '',
                        },
                        {
                          icon: splitImg("images/pet_add_friend.png", 'littlePet'),
                          nick: '',
                        },
                        {
                          icon: splitImg("images/pet_add_friend.png", 'littlePet'),
                          nick: '',
                        },
                        {
                          icon: splitImg("images/pet_add_friend.png", 'littlePet'),
                          nick: '',
                        },
                        {
                          icon: splitImg("images/pet_add_friend.png", 'littlePet'),
                          nick: '',
                        }]
        helpForIndex(userInfo.id).then(res=>{
          if(res.length >= showFriends.length){
            isInvite = false;
            for (let i = 0; i < showFriends.length; i++) {
              showFriends[i].icon = res[i].friendFacePic
              showFriends[i].nick = res[i].nickName
            }
          } else {
            isInvite = true;
            for (let i = 0; i < res.length; i++) {
              showFriends[i].icon = res[i].friendFacePic
              showFriends[i].nick = res[i].nickName
            }
          }
          this.setData({
            isInvite,
            showFriends,
          })
        }).catch(err=>{
          wxShowToast(err)
        })
        break;
      case 'gift': // 兑换礼品
        this.setData({
          showExchange: true,
          isShowAnim: false,
          isShowStatic: true
        })
        break;
      case 'rule': // 活动规则
        this.setData({
          isShowNotice: true,
          isShowAnim: false,
          isShowStatic: true
        })
        break;
      case 'feel': // 撸它
        if(userInfo.feelCount <= 0){
          wxShowToast("主人，我都要被你摸秃噜啦！");
          return;
        }
        isOption = false,
        currOption = "您正在撸它"
        // 销毁页面时 关闭动画
        canvasDom.cancelAnimationFrame(rid);
        this.switchOption('feel');
        if(isFOL){
          if(userInfo.petInfo){
            innerAudioContext.destroy();
            switch(userInfo.petInfo.name){
              case 'alpaca':
                this.playMuisc('feel',splitImg('music/alpaca_feel.mp3', 'littlePet'));
                break;
              case 'koala':
                this.playMuisc('feel',splitImg('music/koala_feel.mp3', 'littlePet'));
                break;
              case 'unicorn':
                this.playMuisc('feel',splitImg('music/unicron_feel.mp3', 'littlePet'));
                break;
            }
          }
          this._editFeedHeart(0, 25, 'feel');
        } else {
          this._editFeedHeart(0, 15, 'feel');
        }
        this.recover();
        break;
      case 'bathtub': // 洗澡
        if(userInfo.bathtubCount <= 0){
          wxShowToast("阿嚏！再洗我都要感冒了。");
          return;
        }
        isOption = false,
        currOption = "您正在给它洗澡"
        // 销毁页面时 关闭动画
        canvasDom.cancelAnimationFrame(rid);
        this.switchOption('bathtub');
        if(isFOL){
          innerAudioContext.destroy();
          this.playMuisc('bathtub',splitImg('music/bathtub.mp3', 'littlePet'));
          this._editFeedHeart(0, 25, 'bathtub');
        } else {
          this._editFeedHeart(0, 25, 'bathtub');
        }
        this.recover();
        break;
      case 'clear': // 打扫
        if(userInfo.clearCount <= 0){
          wxShowToast("谢谢主人，我的小窝已经很干净啦！");
          return;
        }
         // 销毁页面时 关闭动画
        canvasDom.cancelAnimationFrame(rid);
        if(!this.data.isShowFeces){
          wxShowToast("没有便便需求清理哦~");
          return
        }
        this.setData({
          showClear: true,
          isShowFeces: false,
          isShowPop: true,
          popMessage: popMsg('clear')
        })
   
        if(isFOL){
          innerAudioContext.destroy();
          this.playMuisc('clear',splitImg('music/clear.mp3', 'littlePet'));
          this._editFeedHeart(0, 25, 'clear');
        } else {
          this._editFeedHeart(0, 20, 'clear');
        }
       
        this.init(splitImg('lotties/clear.json', 'littlePet'), 'clear');
        let that= this;
        setTimeout(function () {
          that.setData({
            showClear: false,
          })
       }, 1000) 
       setTimeout(function () {
        that.setData({
          isShowPop: false,
        })
        }, 6000) 
        break;
      case 'feed': // 喂食
        if(userInfo.feed < 50){
          wxShowToast("没有饲料了，请主人赶紧去做任务领取饲料吧！");
          return;
        }
        if(userInfo.feedCount <= 0){
          wxShowToast("嗝~吃不下了！");
          return;
        }
        isOption = false,
        currOption = "它正在吃饭"
        // 销毁页面时 关闭动画
        canvasDom.cancelAnimationFrame(rid);
        if(isFOL){
          this._editFeedHeart(-50, 25, 'feed');
        } else {
          this._editFeedHeart(-50, 50, 'feed');
        }
        this.switchOption('feed');
        this.recover();
        break;
      case 'close': // 关闭弹窗
        this.setData({
          showHelp: false,
          showTask: false,
          showExchange: false,
          isShowNotice: false,
          isShowAnim: true,
          isShowStatic: false,
          signShow: false,
          showBox: false
        })
        this.switchOption('normal');
        break;
      case 'navi': // 兑换礼品：领取奖品和兑换记录切换
        if (status) {
          return;
        }
        let { navis, isExchange} = this.data;
        for (let i = 0; i < navis.length; i++) {
          navis[i].selected = !navis[i].selected;
        }
        if (navis[0].selected) {
          isExchange = true
        } else {
          isExchange = false
          couponRecords(userInfo.id).then(res =>{
            this.setData({
              navis,
              isExchange,
              alreadGetList: getCouponRecord(res)
            })
            console.log("alreadGetList ===========", this.data.alreadGetList[0]);
            return;
          }).catch(err=>{
            wxShowToast(err)
          })
        }
        this.setData({
          navis,
          isExchange
        })
        break;
      case 'sign': 
        let userId = userInfo.id;
       
        sign(userId).then(res =>{
          userInfo.heart = res.heart
          userInfo.feed = res.feed
          this.setData({
            signShow: true,
            isShowAnim: false,
            isShowStatic: true,
            userInfo,
            signIcon: splitImg("images/pet_sign_icon_sel.png", 'littlePet'),
          })
        }).catch(err=>{
          wxShowToast(err)
        })
        break;
      case 'openBox':
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
        }
        else{
          openBox(userInfo.id, wx.getStorageSync(KEYSTORAGE.crmInfo).phone).then(res=>{
            this.setData({
              showBox: true,
              isShowStatic: true,
              isShowAnim: false,
              boxImg: giftImage(res.result),
            })
            let that = this;
            setTimeout(function () {
              that.setData({
                isShowAnim: true,
                isShowStatic: false,
                signShow: false,
                showBox: false,
                showHelp: false,
              })
              that.switchOption('normal');
            }, 20000) 
            
          }).catch(err=>{
            wxShowToast(err)
          })
       }
        break;  
      case 'exchange':
        let couponId = e.currentTarget.dataset.couponid;
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
        }
        else{
          if(!wx.getStorageSync(KEYSTORAGE.crmInfo).phone){
            wxShowToast("手机号为空！请删除小程序重新打开试试！")
            return;
          }
          if(!userInfo.id){
            wxShowToast("用户ID为空！")
            return;
          }
          if(!couponId){
            wxShowToast("券ID为空！")
            return;
          }
          let jsData = {
            phone: wx.getStorageSync(KEYSTORAGE.crmInfo).phone,
            userId:userInfo.id,
            giftId: couponId,
          }
          getCoupon(jsData).then(res =>{
            if(res){
              wxShowToast("兑换成功！请在我的优惠券中查看")
            }
          }).catch(err => {
            wxShowToast(err)
          })
      }
        break; 
      case 'exchanged':
        let name = app.config.brand === 'BESTSELLER'? "" : app.config.ETO_BRAND[app.config.brand];
        wx.navigateTo({
          url: '../../../member/myCouponList/myCouponList?name=' + name
        })
        break;
      case 'back':
        app.goBack();
        break;  
      case 'inviteClose':
        wxShowToast("今日邀请次数已达上线，请明日再来吧。");
        break;
    }
  },


  /**
   * 切换宠物动画
   * @param {}} options 
   */
  switchOption: function(options){
    let {petCanvas} = this.data;
    let curIndex = 0;
    for (let i = 0; i < petCanvas.length; i++) {
      if(options === petCanvas[i].name){
         petCanvas[i].isShow = true;
         curIndex = i;
      }else {
        petCanvas[i].isShow = false;
      }  
    }
    this.setData({
      petCanvas,
      isShowPop: true,
      popMessage: popMsg(options)
    })
    let that = this;
    setTimeout(function () {
      that.setData({
        isShowPop: false
      })
    }, 10000) 
    this.init(petCanvas[curIndex].options, petCanvas[curIndex].name);
  },

  recover: function(){
    let that = this
    setTimeout(function () {
        isOption = true,
        // 销毁页面时 关闭动画
        canvasDom.cancelAnimationFrame(rid);
        that.switchOption('normal');
        that.setData({
          isShowPop: false
        })
     }, 6000) 
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
    this.playMuisc('',splitImg(bgmMusic, 'littlePet'));
    
    if (isTaskShare.bol){
      // 任务的分享
      isTaskShare.bol = false
      this._finishTask(isTaskShare.id)
    }
    if (goFinishID == '-1'){
      wx.removeStorageSync('hby_task');
    }

    let hby_task = wx.getStorageSync('hby_task');
    if (isDaojishi == 1){
      isDaojishi = -1
      if (hby_task == '2' && goFinishID != '-1'){
  
        wx.removeStorageSync('hby_task');
        this._finishTask(goFinishID)
      }
    }
    else if (isDaojishi == 0){
      isDaojishi = -1
      wx.removeStorageSync('hby_task');
      this._finishTask(goFinishID)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
      isDaojishi = -1
      let title = "动动手指，快来帮我喂养宠物吧！";
      let json = {
        userId : this.data.userInfo.id,
      }
      console.log("=============objToQuery ===========", objToQuery(json));
      let path = `/activity/myPet/friendHelp/friendHelp${objToQuery(json)}`
      let imageUrl =""
      console.log(`分享成功:${path}`)
      return{
        title: title,
        path : path,
        imageUrl : imageUrl,
        success:function(e){
          console.log(`分享成功:${path}`)
        },
        fail:function(e){
          console.log(`分享失败`)
        }
      }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 销毁页面时 关闭动画,关闭音乐
    canvasDom.cancelAnimationFrame(rid);
    innerAudioContext.destroy();
    
  },
  onHide:function(){
    innerAudioContext.destroy();
  },

  //滑动渐入渐出
  slideupshow: function(param,px,opacity){
    let that = this;
    var animation = wx.createAnimation({
      duration: 800,
      timingFunction: 'ease',
    });
    animation.translateY(px).opacity(opacity).step()
    //将param转换为key
    var json = '{"' + param + '":""}'
    json = JSON.parse(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
    
  },
  
  playMuisc(option, musicUrl){
    console.log(musicUrl)
    innerAudioContext = wx.createInnerAudioContext()
    innerAudioContext.autoplay = true
    innerAudioContext.src = musicUrl
    innerAudioContext.onPlay(() => {
      console.log('开始播放')
    })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    let that = this;
    switch(option){
      case 'feel':
      case 'bathtub':
        setTimeout(function () {
          innerAudioContext.destroy();
          that.playMuisc('', splitImg(bgmMusic, 'littlePet'))
        }, 6000) 
        break;
      case 'clear':
        setTimeout(function () {
          innerAudioContext.destroy();
          that.playMuisc('', splitImg(bgmMusic, 'littlePet'))
        }, 1000) 
        break;  
    }
  }

})