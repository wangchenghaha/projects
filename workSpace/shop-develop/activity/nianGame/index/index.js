
//Page Object

import {EVENTS,KEYSTORAGE} from '../../../src/const'
import events from "../../../src/events";
import {wxSubscription} from '../../../utils/wxSubscribe'

import {getGameTime, searUserInfo, createUser,searchZodiacList,openbox,attack,myprize,lastPrize,addZhuli} from "../../service/nian"
const imgPath = `https://cdn.bestseller.com.cn/assets/common/${getApp().config.brand}/attackNian/`
import {splitImg} from '../../../utils/utils';
const brand = getApp().config.brand

// 是否助力过
var isZhuli = false
// 是否是新人
var isCreateUser = false
// 控制每次进游戏页面只展示一次订阅消息
var canShowXiaoxi = false
var startTime = 0
var endTime = 0
// 记录我的盲盒点击的下标
var mangheTapIndex = -1
// 打年兽时记录年兽id
var requstzodiacID = -1
const splashImgList = [

  {
    scale: 5622,
    bgImg: `${imgPath}6.jpg`, // 375/667 iphone 7
    isIphone6 : true
  },
  {
    scale: 4618,
    bgImg: `${imgPath}x.jpg`,  // 375/812 iphoneX
    isIphone6 : false
  }
  
]
// 第一次加载显示加载框
var isFrist = true
// 鼠0、牛1、虎2、兔3、龙4、蛇5、马6、羊7、猴8、鸡9、狗10、猪11
const zodiacDatas = [`${imgPath}zudiac_0${brand}.png`,`${imgPath}zudiac_1${brand}.png`,`${imgPath}zudiac_2${brand}.png`,`${imgPath}zudiac_3${brand}.png`,`${imgPath}zudiac_4${brand}.png`,`${imgPath}zudiac_5${brand}.png`,`${imgPath}zudiac_6${brand}.png`,`${imgPath}zudiac_7${brand}.png`,`${imgPath}zudiac_8${brand}.png`,`${imgPath}zudiac_9${brand}.png`,`${imgPath}zudiac_10${brand}.png`,`${imgPath}zudiac_11${brand}.png`]
const zodiacs = [`${imgPath}tujian_0.png`,`${imgPath}tujian_1.png`,`${imgPath}tujian_2.png`,`${imgPath}tujian_3.png`,`${imgPath}tujian_4.png`,`${imgPath}tujian_5.png`,`${imgPath}tujian_6.png`,`${imgPath}tujian_7.png`,`${imgPath}tujian_8.png`,`${imgPath}tujian_9.png`,`${imgPath}tujian_10.png`,`${imgPath}tujian_11.png`]
const downLoadGifs = ['xuanyun2.gif','nianshou4.gif']
var downLoadStatus = false

var canUsrBoxIndex = -1
var isAnimate = false

// 是否集满12生肖
var is12 = false
// 年兽的话数组
const nianshouTextArrs = {
  index : 0,
  arrs : brand == 'FOL' ? [
    '准备承受我的洪荒之力吧！','想打败我可没那么容易！','哈哈哈哈！这里是我的了！！','你还有更多的生肖卡？我不信...'
  ] : ['瞄准目标,惊喜就在眼前！','时间不多了,果断出手吧！','是时候展现真正的技术了！','继续挑战吧,大奖就快降临了！','我仰慕的勇士在哪里？','发挥出你全部的实力吧！','注意,前方年兽出没！']
}
const nianshouTextGameOverArrs = brand == 'FOL' ? [
  '游戏已经结束了，感谢您的参与～,祝您牛年行大运　欢喜过新年！','感谢您打跑年兽，保护村庄,绫致时装折扣店官网祝您牛转乾坤，新年好福气～','恭喜你打跑了年兽，完成游戏！,绫致送心意，祝您牛运亨通，牛气冲天～'
] : ['游戏结束,明年再战！','游戏结束,祝你新年快乐！','游戏结束,祝你 “牛”气冲天！']
var canShowNianshouText = false

// 动画音效
const startVideo = `${imgPath}gameVedio.mp3`
Page({
  data: {
    // 用户信息
    userData : {},
    // 分享过来的用户信息
    shareUserData : {},
    icon_voice: splitImg('icon_voice.png', 'common'),
    icon_voice_no: splitImg('icon_voice_no.png', 'common'),
    // 年兽的话
    nianshouText : '',
    bgImg : '',
    nianshou : `${imgPath}nianshou.png`,
    playBtn : `${imgPath}playBtn.png`,
    leftImg : `${imgPath}leftImg.png`,
    rightBgImg : `${imgPath}rightBgImg.png`,
    rightImg : `${imgPath}rightImg.png`,
    mangheTitleImg : `${imgPath}mangheTitle.png`,
    // 我的盲盒
    boxArrs : [],
    gonglueImg : `${imgPath}gonglue.png`,
    tujianImg : `${imgPath}tujian.png`,

    chaiOpenBoxOneImg : `${imgPath}openBox${brand}.png`,
    chaiTwoCenterImg : `${imgPath}chaiTwoCenterImg.png`,
    is12Img : `${imgPath}is12bouncedImg.png`,
    myPrizeImg : `${imgPath}myPrize.png`,
    // 我的奖品数据
    myPrizeDatas : [],


    // 每次打年兽几率出优惠券弹框
    // 打开宝箱动效
    showOpenbox_animate : false,
    gongxiBouncedJson : {
      img : `${imgPath}gongxibounced.png`,
      yhqImg : '',
      title : '年兽掉落的优惠券',
      subTitle : '请在卡包/会员中心-我的优惠券查看'
    },
    // 没有可用年兽弹框数据
    // 没有可用的年兽
    canNotPlay : false,
    noManghe : false,
    yihanBouncedImg : '',


    renwuImgJson : {},
    baozhaImg : '',
    xuanyunImg : '',

    isIphone6 : false,

    topTitles : [],

    upAnimate : 'upAnimate',
    attackAnimate : '',
    // 展示爆炸和年兽gif图
    showBaozha : false,
    showXuanyun : false,
    // 集齐12个显示打开宝箱
    showOpenbox : false,
    // 集齐12个弹框显示的文案
    is12Text : '',
    // 拆盲盒
    chaiBoxTotal : false,
    chaiBoxOne : false,
    chaiBoxOne_animate : false,
    chaiGif : '',
    chaiBoxTwo : false,
    // 拆开盲盒需要的数据
    mangheJson : {},
    // 集满12个点击分享按钮弹框
    showIs12 : false,
    // 我的奖品
    showMyPrize : false,
    // 攻略
    showGonglue : false,
    // 终极大奖
    showZongji : false,
    zhongjiBouncedJson : {
      img : `${imgPath}zhongji.png`,
      yhqImg : '',
      title : '年兽掉落的优惠券',
      subTitle : '请在卡包/会员中心-我的优惠券查看'
    },

    gonglueDatas : {
      bgImg : `${imgPath}gonglueBgImg.png`,
      texts : [
        {
          img : `${imgPath}guize1.png`,
          text : brand == 'FOL' ? '为了驱赶扰乱平静的年兽，玩家需要通过拆盲盒来获取不同的生肖并进行反击，在拆盲盒以及打年兽的过程中会随机掉落不同奖励；盲盒内一共有12种生肖，集齐生肖图鉴后，可以开启宝箱获取额外奖励。' : 
          '为了驱赶扰乱平静的年兽，玩家需要通过拆盲盒来获取不同的生肖来进行反击，在拆盲盒以及打年兽的过程中会随机掉落不同奖励；盲盒内一共有12种生肖，集齐生肖图鉴打跑年兽，可以开启宝箱获取额外奖励。'
        },
        {
          img : `${imgPath}guize2.png`,
          text : brand == 'FOL' ? '每名用户每天有3次拆盲盒机会，3次机会用完后，可以邀请好友助力获得额外的盲盒。每邀请1人将额外获得1个盲盒，每位好友活动期间仅可给同一人助力一次。每人每天可给他人助力2次。' : 
          '每名用户每天有3次拆盲盒机会，3次机会用完后，可以邀请好友助力获得额外的盲盒。每邀请1人将额外获得1次盲盒，每位好友仅可给同一人助力一次。'
        },
        {
          img : `${imgPath}guize3.png`,
          text : brand == 'FOL' ? '成功打跑年兽有机会获得精美背包或66元官网优惠券哦。部分奖品数量有限，先到先得。获得的奖励可在我的奖品页面查看，实际金额以页面显示为准。优惠券使用规则请以具体优惠券页面显示为准。' : 
          '获得的奖励可在我的奖品页面查看，实际金额以页面显示为准。奖品数量有限，先到先得。'
        }
        
      ]
    },
    playVideo : true,
    backImg : `${imgPath}backImg.png`,
    
  },
  getSystemInfo: function () {

    let bgImg = this.data.bgImg
    let isIphone6 = this.data.isIphone6
    try {
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth / windowHeight * 10000));


      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if (diff < 100) {
          bgImg = item.bgImg
          isIphone6 = item.isIphone6
        }
      });
      if (bgImg == '') {
        bgImg = splashImgList[1].bgImg
        isIphone6 = splashImgList[1].isIphone6
      } 
    } catch (e) {
    }
    this.setData({
      bgImg,
      isIphone6
    })
  },
  fenxiang(options){

    if (options.params){
      let json = JSON.parse(options.params)
      let shareUserData = this.data.shareUserData
      shareUserData.userid = json.userid
      shareUserData.picUrl = json.picUrl
      shareUserData.nickName = json.nickName
      shareUserData.openid = json.openid
      this.setData({shareUserData})

  
  
      let shareBy = json.share_by
      let shareByShop = json.share_by_shop
  
      let utmJson = {
        utm_source: json.utm_source,
        utm_medium: json.utm_medium,
        utm_term: json.utm_term,
        utm_campaign: json.utm_campaign
      }
      let collectParam = Object.assign(utmJson, { eventName: `打开打年兽游戏页_${json.userid}` });
      getApp()._collectData2(collectParam)
        
  
      let orderSaveShare = {
        shareBy,
        shareByShop
      };
      getApp().setShareInfo(orderSaveShare);

      if (json.userid && json.userid == ''){
        wx.showModal({
          title: '提示',
          content: '分享数据异常,请重新分享',
          showCancel: false,
          cancelText: '取消',
          cancelColor: '#000000',
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if(result.confirm){
              
            }
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }

    }
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
  //options(Object)
  onLoad: function(options) {
    console.log(`aaa:${this.data.icon_voice}`)
    wx.hideShareMenu();
    isCreateUser = false
    isZhuli = false
    canShowNianshouText = false
    downLoadStatus = false
    canShowXiaoxi = false
    
    isFrist = true
    startTime = 0
    endTime = 0
    mangheTapIndex = -1
    canUsrBoxIndex = -1
    requstzodiacID = -1
    isAnimate = false
    is12 = false

    this.fenxiang(options)
    this.getSystemInfo()


    events.register(this, EVENTS.EVENT_401);
    events.register(this, EVENTS.EVENT_GAMECRMINFO);


    this.startbgVedio(startVideo)
  },
  startbgVedio : function(path){
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = path
    this.innerAudioContext.loop = true
    this.innerAudioContext.autoplay = true
  },
  playVideoTap(){
    let playVideo = this.data.playVideo
    playVideo = !playVideo
    this.setData({playVideo})

    if (this.innerAudioContext){
      if (playVideo){
        this.innerAudioContext.play()
        
      }
      else{
        this.innerAudioContext.pause()
      }
      
    }

  },
  _setTopTitles(){

    this.interval = setInterval(() => {
      let topTitles = this.data.topTitles
      if (this.data.userData.giftStatus == 1){

        let random = Math.floor(Math.random() * nianshouTextGameOverArrs.length + 0)
        topTitles = nianshouTextGameOverArrs[random].split(',')
        clearInterval(this.interval)
        
      }
      else{
        topTitles = nianshouTextArrs.arrs[nianshouTextArrs.index].split(',')
        if (nianshouTextArrs.index == nianshouTextArrs.arrs.length - 1){
          nianshouTextArrs.index = 0
        }
        else{
          nianshouTextArrs.index += 1
        }
      }
      
      this.setData({topTitles})
      
    }, 10000);
  },

  _requsetData() {


    if (startTime == 0 && endTime == 0) {
      getGameTime().then(e => {

        endTime = new Date(e.activityEndTime.replace(/-/g, '/')).getTime()
        startTime = new Date(e.activityStartTime.replace(/-/g, '/')).getTime()

        this._nextTwo()

      })
    } else {
      this._nextTwo()
    }


  },
  _nextTwo() {

    var openID = wx.getStorageSync('wxOpenID');
    let crmInfo = wx.getStorageSync(KEYSTORAGE.gameCRMInfo);

    if (isFrist){
      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
    }
    searUserInfo({openId: openID}).then(res => {
      if (!res) {

        let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);

        let phone = crmInfo.phone
        if (phone.length == 12) {
          phone = phone.substr(0, 11)
        }

        // 创建用户
        let json = {
          phone: phone,
          openid: openID,
          nickName: wxInfo.nickName,
          facePic: wxInfo.avatarUrl,
          memberno: crmInfo.memberno,
          crmCreatedTime : crmInfo.joindate
        }
        createUser(json).then(res1 => {
          isCreateUser = true
          if (isFrist){
            wx.hideLoading();
          }
          this._makeDatas(res1)
        })

      } else {
        if (isFrist){
          wx.hideLoading();
        }
        this._makeDatas(res)
      }
    })

  },
  _makeDatas(res){
    let boxArrs = this.data.boxArrs
    if (res){

      this.setData({
        userData : res
      })

    }
    if (!canShowNianshouText){
      canShowNianshouText = true
      this._setTopTitles()
    }
    if (isFrist){
      wx.showLoading({
        title: '加载中……', //提示的内容,
        mask: true, //显示透明蒙层，防止触摸穿透,
        success: res => {}
      });
    }
    let mangheTitle = getApp().config.brand == 'FOL' ? 'BESTSELLER' : getApp().config.brand
    boxArrs = []
    searchZodiacList({userid : this.data.userData.id}).then(item => {
      if (isFrist){
        isFrist = false
        wx.hideLoading();
      }
      boxArrs.push({
        img : this.data.chaiOpenBoxOneImg,
        color : '#07B6A8',
        num : this.data.userData.gameCount

      })
      item.forEach(items => {
        items.img = zodiacDatas[items.zodiacId - 1]
        items.color = '#C4B88D',
        items.num = items.cardCount,

        // 两个url只要有值就是商品跳转
        items.isSKU = false
        if (items.giftUrl && items.giftUrl != '' || items.goodsUrl && items.goodsUrl != ''){
          items.isSKU = true
        }
        

        items.title = `${mangheTitle} 祝您新年安康`
        items.yhqW = 504,
        items.otherW = 609,
        items.subTitle = '请在卡包/会员中心-我的优惠券查看'
        boxArrs.push(items)
      });
      wx.setStorageSync('attackNianBoxDatas', boxArrs);

      // console.log(`生肖盒子:${JSON.stringify(boxArrs)}`)
      this.setData({
        boxArrs
      })
      canUsrBoxIndex = -1
      boxArrs.forEach((item,index) => {
        if (item.unusedCardCount > 0){
          if (canUsrBoxIndex == -1){
            canUsrBoxIndex = index
          }
          
        }
      })
      this._canUsrData()

      console.log(`是否可以助力:${this.data.shareUserData.userid || ''},isZhuli:${isZhuli}`)
      if (this.data.shareUserData.userid && this.data.shareUserData.userid != '' && !isZhuli){

        let openID = wx.getStorageSync('wxOpenID');
        if (this.data.shareUserData.openid != openID){
          let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
          let json = {
            userid : this.data.shareUserData.userid,
            friendOpenid : openID,
            friendFacePic : wxInfo.avatarUrl || '',
            nickName : wxInfo.nickName || ''
          }
          addZhuli(json).then(res => {
            isZhuli = true
          })
        }
      }
      this._jiance12()

    })


  },
  _jiance12(){
    if (!downLoadStatus){
      downLoadStatus = true
      this._downLoadGifs()
    }

    if (this.data.boxArrs.length >= 13){
        
      let playBtn = this.data.playBtn
      let showOpenbox = this.data.showOpenbox
      let nianshou = this.data.nianshou
      is12 = true
      showOpenbox = true

      if (this.data.renwuImgJson.img == ''){
        if (this.data.userData.giftStatus == 0){
          // 没开启
          nianshou = `${imgPath}weikaiqi.png`
          playBtn = `${imgPath}playBtn_true.png`
          let _this = this
          this._downGifImg(`${imgPath}weikaiqi.gif`,111).then(res => {
            nianshou = res.path
            _this.setData({
              nianshou
            })
          }).catch(e => {
            _this._jiance12()
          })
        }
        else{
          nianshou = `${imgPath}yikaiqi.png`
          playBtn = `${imgPath}playBtn_false.png`
        }
      }
      else{
        playBtn = `${imgPath}playBtn.png`
      }

      this.setData({
        playBtn,
        showOpenbox,
        nianshou
      })
    }
    else{
      if (isCreateUser){
        isCreateUser = false

        if (!is12){
          mangheTapIndex = 0
          this.setData({
            chaiBoxTotal : true,
            chaiBoxOne : true
          })
        }
      }
      
    }
  },
  /**
  * 订阅的事件回调
  */
 handleEvent: function (event, type) {


  if (type === EVENTS.EVENT_401 && event){
    if (!this.data.userData.id){
      setTimeout(() => {
        this._requsetData()
      }, 5000);
    }

  }
  else if (type === EVENTS.EVENT_GAMECRMINFO && event){
    this._requsetData()
  }
},
  _downLoadGifs(){

    wx.showLoading({
      title: '加载中……',
      mask: true
    });
    let _this = this
    
    var arrs = []
    console.log(`gif图下载:开始`)
    downLoadGifs.forEach((item,index) => {
      item = imgPath + item
      _this._downGifImg(item,index).then(e => {
        console.log(`gif图下载:完成${JSON.stringify(e)}`)
        arrs.push(e)
        if (arrs.length == downLoadGifs.length){

          let xuanyunImg = _this.data.xuanyunImg
          let nianshou = _this.data.nianshou

          arrs.forEach(items => {
            if (items.index == 0){
              xuanyunImg = items.path
            }
            else if (items.index == 1){
              nianshou = items.path
            }
          })
          _this.setData({

            xuanyunImg,
            nianshou
          })
          wx.hideLoading();
        }

      }).catch(err => {
        wx.hideLoading();
        _this._downLoadGifs()
      })

    })
  },
  _canUsrData(){
    
    let renwuImgJson = this.data.renwuImgJson
    

    if (this.data.boxArrs.length > 1 && canUsrBoxIndex > 0){
      
      if (canUsrBoxIndex < this.data.boxArrs.length){
        let json = this.data.boxArrs[canUsrBoxIndex]
        
        if (json.unusedCardCount == 0){
          canUsrBoxIndex += 1
          this._canUsrData()
          return
        }
        
        renwuImgJson.num = json.unusedCardCount
        renwuImgJson.img = zodiacs[json.zodiacId - 1]
        renwuImgJson.id = json.zodiacId
      }
      else{
        renwuImgJson.num = 0
        renwuImgJson.img = ''

      }
    }
    else{
      renwuImgJson.num = 0
      renwuImgJson.img = ''

    }

    this.setData({
      renwuImgJson
    })

  },
  danianshou(){
    if (isAnimate){
      return
    }

    if (this.checkTime()){
      if (this.data.renwuImgJson && this.data.renwuImgJson.num > 0){
          requstzodiacID = this.data.renwuImgJson.id
          isAnimate = true
          let attackAnimate = this.data.attackAnimate
          let upAnimate = this.data.upAnimate
          attackAnimate = 'attackHor'
          upAnimate = 'attackVer'
  
          let baozhaImg = this.data.baozhaImg
          baozhaImg = `${imgPath}baozha.gif?v=${new Date().getTime()}`
          this.setData({
            attackAnimate,
            upAnimate,
            baozhaImg
          })
          if (!canShowXiaoxi && getApp().config.courierGameTeplateIds){
            canShowXiaoxi = true
            wxSubscription("nianGame").then(res => {
            }).catch(err => {
            });
          }
  
      }
      else{
        if(!is12){
          this.setData({
            canNotPlay : true,
            yihanBouncedImg : `${imgPath}yihanBoucned.png`,
          })
        }
        else{
          if (this.data.userData.giftStatus == 1){
            return
          }
          this.setData({
            showIs12 : true,
            is12Text : '开启大礼包得终极大奖!'
          })
          this._makeDatas()
        }
      }
    }
  },
  baozhaLoad(){
    setTimeout(() => {
      this.setData({
        showBaozha : false
      })
    }, 750);

    setTimeout(() => {

      attack({
        userid : this.data.userData.id,
        zodiacId : requstzodiacID
      }).then(item => {

        let showOpenbox_animate = this.data.showOpenbox_animate
        let gongxiBouncedJson = this.data.gongxiBouncedJson
        if (item.giftPic && item.giftPic != ''){
          showOpenbox_animate = true
          gongxiBouncedJson.yhqImg = item.giftPic
        }
        isAnimate = false
        this.setData({
          showXuanyun : false,
          showOpenbox_animate,
          gongxiBouncedJson
        })


      }).catch(e => {
        isAnimate = false
        this.setData({
          showXuanyun : false
        })

      })
      this._jiance12()
    }, 1550);

  },
  acttackEnd(){
    let renwuImgJson = this.data.renwuImgJson
    let boxArrs = this.data.boxArrs

    renwuImgJson.num -= 1
    boxArrs[canUsrBoxIndex].unusedCardCount -= 1
    if (renwuImgJson.num == 0){
      this.setData({
        boxArrs
      })
      canUsrBoxIndex += 1
      this._canUsrData()
    }
    else{
      this.setData({
        renwuImgJson,
        boxArrs
      })
    }
  

    let upAnimate = this.data.upAnimate
    upAnimate = upAnimate == 'upAnimate' ? 'upAnimate1' : 'upAnimate'
    this.setData({
      upAnimate,

      attackAnimate : '',
      showBaozha : true,
      showXuanyun : true
    })

    
  },
  openBox(){
    if (!this.data.showOpenbox){
      return
    }
    if (this.checkTime()){
      if (is12){
        if (this.data.renwuImgJson.img == ''){
          if (this.data.userData.giftStatus == 0){
            // 开启大奖
            let showZongji = this.data.showZongji
            let zhongjiBouncedJson = this.data.zhongjiBouncedJson
            let userData = this.data.userData
            lastPrize({userid : this.data.userData.id}).then(res => {
              showZongji = true
              zhongjiBouncedJson.yhqImg = res.giftPic
              userData.giftStatus = 1
              this.setData({
                showZongji,
                zhongjiBouncedJson,
                userData
              })
              

              this._makeDatas()
            })
          }
          else{
            // 开过大奖啦 啥也不动
          }
          
        }
        else{
          this.setData({
            showIs12 : true,
            is12Text : '打年兽可开启活动大礼包!'
          })
        }
      }
    }
    
  },
  closed(bol){
    this.setData({
      showOpenbox_animate : false,
      chaiBoxOne : false,
      chaiBoxOne_animate : false,
      canNotPlay : false,
      showIs12 : false,
      showMyPrize : false,
      showGonglue : false,
      noManghe : false,
      showZongji : false,
      chaiBoxTotal : !bol,
      chaiBoxTwo : !bol
    })
  },
  bouncedClosed(){
    this.closed(true)
  },
  bouncedClosedTwo(){
    this.bouncedClosed()
    if (this.data.userData.gameCount > 0 && mangheTapIndex == 0){

      if (is12){
        if (this.data.userData.giftStatus == 1){
          return
        }
        let is12Text = this.data.is12Text
        if (this.data.renwuImgJson.img == ''){
          is12Text = '开启大礼包得终极大奖!'
        }
        else{
          is12Text = '打年兽可开启活动大礼包!'
        }
        this.setData({
          showIs12 : true,
          is12Text
        })

      }
      else{
        let mangheJson = this.data.mangheJson
        this.setData({
          mangheJson,
          chaiBoxTotal : true,
          chaiBoxOne : true
        })
      }
    }
  },
  chaiTap(e){
    if (this.checkTime()){

        let id = e.currentTarget.id
        mangheTapIndex = id
        if (id == 0){
          if (is12){
            if (this.data.userData.giftStatus == 1){
              return
            }
            let is12Text = this.data.is12Text
            if (this.data.renwuImgJson.img == ''){
              is12Text = '开启大礼包得终极大奖!'
            }
            else{
              is12Text = '打年兽可开启活动大礼包!'
            }
            this.setData({
              showIs12 : true,
              is12Text
            })

          }
          else{
            if (this.data.userData.gameCount <= 0){
              this.setData({
                noManghe : true,
                yihanBouncedImg : `${imgPath}yihanBoucned1.png`,
              })
  
            }
            else{
              this.setData({
                chaiBoxTotal : true,
                chaiBoxOne : true
              })
            }
          }

        }
        else{
          let mangheJson = this.data.mangheJson
          mangheJson = this.data.boxArrs[id]
          this.setData({
            chaiBoxTotal : true,
            chaiBoxTwo : true,
            mangheJson
          })
        }
    }
  },
  openBoxOneTap(){
    let mangheJson = this.data.mangheJson
    let userData = this.data.userData
    let chaiGif = this.data.chaiGif
    chaiGif = `${imgPath}chai.gif?v=${new Date().getTime()}`
    let mangheTitle = getApp().config.brand == 'FOL' ? 'BESTSELLER' : getApp().config.brand
    openbox({userid : this.data.userData.id}).then(res => {
      mangheJson.img = zodiacDatas[parseInt(res.id) - 1]
      mangheJson.title = `${mangheTitle} 祝您新年安康`
      mangheJson.yhqW = 504,
      mangheJson.otherW = 609,
      mangheJson.subTitle = '请在卡包/会员中心-我的优惠券查看'

      mangheJson.isSKU = false
      if (res.giftUrl && res.giftUrl != '' || res.goodsUrl && res.goodsUrl != ''){
        mangheJson.isSKU = true
      }

      Object.assign(mangheJson,res)
      userData.gameCount -= 1
      this.setData({
        mangheJson,
        userData,
        chaiBoxOne_animate : true,
        chaiGif
      })


      this._makeDatas()


    })

    

  },
  concentTap(){
    if (this.data.mangheJson.isSKU){
      if (this.data.mangheJson.goodsUrl && this.data.mangheJson.goodsUrl != ''){
        getApp().navigateTo(this.data.mangheJson.goodsUrl)
      }
      else{
        getApp().navigateTo(this.data.mangheJson.giftUrl)
      }
      
    }
  },
  chaiLoad(){
    setTimeout(() => {
      this.closed()
      this.setData({
        chaiBoxTwo : true
      })
    }, 250);

  },
  _downGifImg(page,index){
    return new Promise((resolve,reject) => {
      
      wx.downloadFile({
        url: page, //仅为示例，并非真实的资源
        success (res) {
          if (res.statusCode === 200) {
            
            resolve({
              path : res.tempFilePath,
              index : index
            })
  
          }
          else{
            reject()
          }
        },
        fail (err){
          reject()
        }
      })
    })

  },
  rightTap(e){
    if (this.checkTime()){
      let type = e.currentTarget.dataset.type
      if (type == 'gonglue'){
        this.setData({showGonglue : true})
      }
      else if (type == 'prize'){
        myprize({userid : this.data.userData.id}).then(res => {
          let myPrizeDatas = this.data.myPrizeDatas
          let arrs = []
          if (res.length > 0){
            res.sort((a,b) => {
              return b.giftId - a.giftId
            })
    
            let json = res[0]
            json.count = 0
            
            res.forEach((item,index) => {
              if (json.giftId == item.giftId){
                json.count += 1
              }
              else{
                arrs.push(json)
                json = item
                json.count = 1
              }
              if (index == res.length - 1){
                arrs.push(json)
              }
            })
            // console.log(`排序后数组:${JSON.stringify(arrs)}`)
    
          }
          
          myPrizeDatas = arrs
  
          this.setData({
            showMyPrize : true,
            myPrizeDatas
          })
        })
        
      }
      else{
        wx.navigateTo({
          url: `../tujianView/tujianView`
        });
      }
    }
  },
  goMyCoupons(){
    getApp().navigateTo('member/myCoupons/myCoupons')
  },
  onReady: function() {
    
  },
  onShow: function() {

    if (wx.getStorageSync(KEYSTORAGE.gameCRMInfo)){
      this._requsetData();
    }
    else{
      getApp().navigateTo('member/login/login?game=true')
    }
    
  },
  onHide: function() {

  },
  onUnload: function() {
    clearInterval(this.interval)
    if(this.innerAudioContext){
      this.innerAudioContext.destroy()
    }

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  checkTime(){

    let currentTime = new Date().getTime()
    if (startTime > currentTime || currentTime > endTime) {
      wx.showModal({
        title: '提示',
        content: '不在活动时间范围内',
        showCancel: false,
        cancelText: '取消',
        cancelColor: '#000000',
        confirmText: '确定',
        confirmColor: '#3CC51F'
      });
      return false

    }
    return true
  },
  onShareAppMessage: function() {

    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    var openID = wx.getStorageSync('wxOpenID');
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let json = {
      userid: this.data.userData.id || '',
      picUrl: wxInfo.avatarUrl || '',
      nickName: wxInfo.nickName || '',
      openid: openID || '',

      share_by: sharePams.employeeId || '',
      share_by_shop: sharePams.shopCode || '',

      utm_source: 'game',
      utm_medium: 'game_attackNian',
      utm_term: '',
      utm_campaign: ''
    }
    let title = ''
    let titleArr = ['全民打年兽，轻松赢取新年豪礼！','打年兽，拆盲盒，快来一起为新年开好运！','打年兽，迎好运，邀你一起挑战赢取新年豪礼！']
   
    let random = Math.floor(Math.random() * titleArr.length)
    title = titleArr[random]

    let path = `/activity/nianGame/index/index?params=${JSON.stringify(json)}`
    let imageUrl = `${imgPath}share.jpeg`
    console.log(`分享成功:${path}`)
    return {
      title: title,
      path: path,
      imageUrl: imageUrl,
      success: function (e) {

      },
      fail: function (e) {
        console.log(`分享失败`)
      }
    }
  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  