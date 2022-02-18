/*
 * @Author: your name
 * @Date: 2020-05-22 10:24:22
 * @LastEditTime: 2020-07-15 17:47:58
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /FOL/activity/redRain/index/index.js
 */ 
//Page Object rest/member/aliLogin
// 查询用户 没有就创建个并且初始游戏次数为3次
// 个人信息 （剩余次数、金币、助力列表）
// 开启宝箱
// 游戏结束上传增加的金币数
// 兑换优惠券（有无限的有指定数目的）
// 兑换记录
// 助力页（好友给openid助力 openid获得游戏次数+1）
const brand = getApp().config.brand


const guize = brand == 'FOL' ? [
  "在规定时间内尽可能多的点击页面落下的爱心，爱心包含随机数量金币，点击爱心越多，获得金币越多哦",
  "每人每天有3次游戏机会，3次机会用完后，可以通过邀请好友助力获得额外的游戏次数。每邀请1人将额外获得1次机会，每位好友仅可给同一人助力一次。",
  "每邀请5人，将有机会开启宝箱，宝箱内有惊喜哦。",
  "每天任务中心都会刷新任务次数，转发小游戏或浏览指定页面可以获得任务奖励。",
  "获得的金币可按页面要求兑换金额不等的七夕活动优惠券。",
  "奖品数量有限，先到先得，具体以兑换界面数量为准。"

] : [
  "在规定时间内尽可能多的点击页面落下的红包，红包中包含随机数量金币，红包越多，获得金币越多哦", 
    "每人每天有3次抢红包机会，3次机会用完后，可以通过邀请好友助力获得额外的游戏次数。每邀请1人将额外获得1次机会，每位好友仅可给同一人助力一次。", 
    "每邀请5人，将有机会开启宝箱，宝箱内有惊喜。", 
    "获得的金币可按页面要求兑换金额不等的全场通用优惠券", 
    "每个会员单个面额优惠券限兑换3张", 
    "奖品数量有限，先到先得，具体以兑换界面显示的数量为准。" 
]
// 图片地址

const imgPath = `https://cdn.bestseller.com.cn/assets/common/${brand}/redRains/`

// 宝箱奖品
const baoxiang = [
    {
        title : '10元优惠券一张',
        image : `${imgPath}hby_bxYhq10.png`,
        bgImage : `${imgPath}hby_baoxiang.png`
    },
    {
        title : '20元优惠券一张',
        image : `${imgPath}hby_bxYhq20.png`,
        bgImage : `${imgPath}hby_baoxiang.png`
    },{
      title : '3000金币',
      image : `${imgPath}hby_bxJinbi.png`,
      bgImage : `${imgPath}hby_baoxiang.png`
    },{
      title : '5000金币',
      image : `${imgPath}hby_bxJinbi.png`,
      bgImage : `${imgPath}hby_baoxiang.png`
    }
]

import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
import {searUserInfo,createUser,searchZhuli,kaiqibaoxiang,getActionTime,jpdhList,taskList,taskUserList,wanchengTask} from "../../../service/redRain"

var isTimeOutStr = ''
var index = 0
// 是否是任务里的分享
var isTaskShare = {
  bol : false,
  id : '1'
}
// 去完成
var goFinishID = '-1'
Page({
    data: {
      brand,
      // 解决401问题
      zhanweiView : false,
      // 用户信息
      userData : {},
        imgPath,
        guize,
        // 助力信息
        friends:[
            {icon : '',name : '',otherIcon : `${imgPath}hby_kq_1.png`,otherName : '+开启1次'},
            {icon : '',name : '',otherIcon : `${imgPath}hby_kq_1.png`,otherName : '+开启1次'},
            {icon : '',name : '',otherIcon : `${imgPath}hby_kq_1.png`,otherName : '+开启1次'},
            {icon : '',name : '',otherIcon : `${imgPath}hby_kq_1.png`,otherName : '+开启1次'},
            {icon : '',name : '',otherIcon : `${imgPath}hby_kq_2.png`,otherName : '神秘宝箱'}
        ],
        // 是否满5人
        isFiveNum : false,
        // 是否打开宝箱
        canOpen : false,
        // 宝箱奖品
        baoxiangJson : {},
        // 背景图切换
        indexBgImage: `${imgPath}hby_indexBg12.png`,
        // 是否弹出授权手机号
        canAuthPhone : false,
        // 挽留弹框
        showOneBounced : false,
        showTwoBounced : false,
        // 赚金币
        showZhuanjinbi : false,
        // 任务数据
        taskArrs : [],
        // 奖品兑换列表数据
        jpListText : ''
        
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
    // 封装用户数据
    makeUserData(res){
      if(res){

        let userData = this.data.userData
        userData = res
        this.setData({userData})
        wx.setStorageSync('hby_userInfo', res);
        wx.setStorageSync(KEYSTORAGE.wxPhone, res.phone);
        
      }
      let friends = this.data.friends
      // 获取好友助力列表
      searchZhuli({userid : this.data.userData.id}).then(res => {
        if (res.length > 0){
          res.forEach((item,index) => {
            if (index <= 4){
              friends[index].icon = item.friendFacePic
              friends[index].name = unescape(item.nickName)
            }
          })
          this.setData({friends})
          this.checkFriendNum()
        }
      })
      this.checkFriendNum()
      
    },
    //   请求数据
    requestDatas(phoneNum){
      this.setData({zhanweiView : false})
      getActionTime().then(e => {

        let endTime = new Date(e.activityEndTime.replace(/-/g,'/')).getTime()
        let starTime = new Date(e.activityStartTime.replace(/-/g,'/')).getTime()
        let currentTime = new Date().getTime()
        isTimeOutStr = ''
        if (starTime > currentTime || currentTime > endTime){
          isTimeOutStr = '不在活动时间范围内'
        }
    
      })

      let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
      var openID = wx.getStorageSync('wxOpenID');

      searUserInfo({openId : openID}).then(res => {
        if (!res){
          let phone = userInfo.phone
          if (!phone){
            if (!phoneNum){
              // 弹框授权手机号
              this.setData({canAuthPhone : true})
              return
            }
            else{
              phone = phoneNum
            }
          }
          // 创建用户
          let json = {
            phone : phone,
            openid : openID,
            nickName : wxInfo.nickName,
            facePic : wxInfo.avatarUrl,
            memberno : userInfo.memberno
          }
          createUser(json).then(res => {
            this.makeUserData(res)
          })

        }
        else{
          this.makeUserData(res)
        }
      })

      jpdhList().then(res => {
        
        if (res && res.length > 0){
          let jpLists = []
          res.forEach(item => {
            item.phone = `${item.phone.substr(0,3)}****${item.phone.substr(7)}`
            jpLists.push(item)
          })

          this.getSuiji(jpLists)
        }
      })
      
    },

// 随机不重复5个
getSuiji(arrs){

  let a = []
  for (let i=0;i<3;i++){
      a.push(Math.floor(Math.random() * arrs.length + 0))
  }

  let isRepeat = false
  if (arrs.length > 3){
    let aa = a.sort()
    for (let i=0;i<aa.length;i++){
      if (aa[i] === aa[i+1]){
        // 重复
        console.log(`重复了:${aa}`)
        isRepeat = true
      }
    }
  }
  else if (arrs.length == 1){
    a = []
    a.push(0)
    a.push(0)
    a.push(0)
  }
  else if (arrs.length == 2){
    a = []
    a.push(0)
    a.push(1)
    a.push(0)
  }
  else if (arrs.length == 3){
    a = []
    a.push(0)
    a.push(1)
    a.push(2)
  }
  if (isRepeat){
    this.getSuiji(arrs)
  }
  else{
    // 没有重复的
    console.log(`没有重复的:${a}`)

    let jpListText = this.data.jpListText
    jpListText = `恭喜用户${arrs[a[index]].phone}获得${arrs[a[index]].exchangeGiftName}!`
    index += 1
    this.setData({jpListText})


    this.listInterval = setInterval(() => {
      let jpListText = this.data.jpListText
      if (index == 3){
        clearInterval(this.listInterval)
        jpListText = ''
        index = 0
      }
      else{
        jpListText = `恭喜用户${arrs[a[index]].phone}获得${arrs[a[index]].exchangeGiftName}!`
        index += 1
      }
      this.setData({jpListText})

    }, 7000);

  }
},
    // 授权手机号
    getPhoneNumber (e) {
      if(e.detail.encryptedData && e.detail.iv){
        getApp().getWxPhone(e.detail.encryptedData, e.detail.iv).then(wxPhone => {
          this.setData({canAuthPhone : false})
          this.requestDatas(wxPhone)
        }).catch(err => wxShowToast(err))
      }

    },

    //options(Object)
    onLoad: function(options){
      isTimeOutStr = ''
      index = 0
      isTaskShare = {}
      goFinishID = '-1'


      events.register(this, EVENTS.EVENT_401);
      events.register(this, EVENTS.EVENT_LOGINED);
      events.register(this, EVENTS.EVENT_CRMINFO);

    },
    oneClosed (){
      this.closed()
      this.setData({showTwoBounced : true})
    },
    closed(){
        this.setData({
          canOpen : false,
          showOneBounced : false,
          showTwoBounced : false
        })
    },
    // 打开宝箱
    openTap(){
      let isMember = wx.getStorageSync('isMember');
      if(!isMember){
        // 注册会员
        getApp().isMemberETO()
        return
      }
      // rest/member/aliLogin 查询并注册
      let friends = this.data.friends
      kaiqibaoxiang({userid : this.data.userData.id}).then(res => {
        let a = res.result == '10' ? 0 : res.result == '20' ? 1 : res.result == '3000' ? 2 : 3
        this.setData({canOpen : true,baoxiangJson : baoxiang[a]})
        

        friends.forEach(item => {
          item.icon = ''
          item.name = ''
        })
        this.setData({friends})
        this.requestDatas()
      })
    },
    // 规则
    guizeTap(){
        
        wx.pageScrollTo({
            scrollTop: wx.getSystemInfoSync().windowHeight,
            duration: 300
        });

    },
    // 检测是否5个人
    checkFriendNum(){
        let isFiveNum = this.data.isFiveNum
        isFiveNum = true
        this.data.friends.forEach(item => {
            if (item.icon == ''){
                isFiveNum = false
            }
        });
        this.setData({isFiveNum})
    },
    // 开始游戏
    startGame(){
      if (isTimeOutStr != ''){

        wx.showModal({
          title: '提示',
          content: isTimeOutStr,
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F'
        });
        return
      }
      if (this.data.userData.gameCount > 0){
        
        wx.navigateTo({
          url: `../game/game?jifen=${this.data.userData.points}`,
          success: (result)=>{
              
          },
          fail: ()=>{},
          complete: ()=>{}
        });

      }
      else{
        this.setData({showOneBounced : true})
      }
    },
    // 兑换奖品
    duihuan(){
        wx.navigateTo({
            url: '../ticketView/ticketView'
        });
    },
    // 赚金币
    zhuanjinbi(){
      
      let taskArrs = this.data.taskArrs
      taskList().then(res => {
        taskArrs = res
        isTaskShare.bol = true
        res.forEach(item => {
          if (!item.taskCode){
            isTaskShare.id = item.id
            item.button = '去分享'
          }
          else{
            item.button = '去浏览'
          }
        })
        taskUserList({userid : this.data.userData.id}).then(res1 => {
          if (res1 && res1.length > 0){
            res1.forEach(item => {
              taskArrs.forEach(items => {
                if (parseInt(item.taskid) == parseInt(items.id)){
                  items.isFinish = true
                }
              })
            })
          }
          this.setData({showZhuanjinbi : true,taskArrs})
        })
      })
      
    },
    // 关闭赚金币
    closedZhuanjinbi(){
      isTaskShare.bol = false
      this.setData({showZhuanjinbi : false})
    },
    // 去完成
    goFinish(e){
      isTaskShare.bol = false
      let detail = e.detail
      // console.log(`aaaa:${JSON.stringify(detail)}`)
      goFinishID = detail.id
      wx.setStorageSync('hby_task', '1');

      wx.navigateTo({
        url: `/pages/goodsList/goodsList?list=${detail.taskCode}`
      });
    },
    // 返回
    backTap(){
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
    onReady: function(){
        
    },
    onShow: function(){
      index = 0
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



      if (isTaskShare.bol){
        // 任务的分享
        isTaskShare.bol = false
        this.successTask(isTaskShare.id)
      }
      if (goFinishID == '-1'){
        wx.removeStorageSync('hby_task');
      }
      let hby_task = wx.getStorageSync('hby_task');

      if (hby_task == '2' && goFinishID != '-1'){

        wx.removeStorageSync('hby_task');
        this.successTask(goFinishID)
      }
    },
    onHide: function(){

    },
    onUnload: function(){

    },
    onPullDownRefresh: function(){

      
    },
    onReachBottom: function(){

    },
    onShareAppMessage: function(){

      let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
      var openID = wx.getStorageSync('wxOpenID');
      let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
        let title = '千山万水总是情，帮我助力行不行'
        let json = {
          userid : this.data.userData.id || '',
          picUrl : wxInfo.avatarUrl,
          openid : openID,

          share_by : sharePams.employeeId || '',
          share_by_shop : sharePams.shopCode || '',
          
          utm_source : 'game',
          utm_medium : 'game_redRain',
          utm_term : '',
          utm_campaign : ''
        }
        let path = `/activity/redRain/help/help?params=${JSON.stringify(json)}`
        let imageUrl = `${imgPath}hby_shareImage.png`
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
    },
    // 完成任务
    successTask(id){
      wanchengTask({taskid : id,userid : this.data.userData.id}).then(res => {
        goFinishID = '-1'
        this.zhuanjinbi()
        this.requestDatas()
      })
    },
    onPageScroll: function(){

    },
    //item(index,pagePath,text)
    onTabItemTap:function(item){

    }
});