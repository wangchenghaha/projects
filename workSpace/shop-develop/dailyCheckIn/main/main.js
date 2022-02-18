// dailyCheckIn/main.js
import { EVENTS, KEYSTORAGE } from '../../src/const.js'
import { uploadImage } from '../../service/upload'
import {
  getCheckInUserInfo, createCheckInUser, getBaseConfig, getMissionList, addCheckInRecord, makeupCheckInRecord,
  queryCheckInRecordByMonth, queryInviteInfo, addInvite, getQueryDate, generateCalendarList,
  checkMissionCompletion, addCalendarTodoText, generateCalendarBonusList, generateCalendarSelectedList,
  culcFutureDate, getBonusName, getBonusValue, combineBonus, queryCheckInRecord, findMakeupDate, getInviteConfig,
  queryRedeemableList, perfromRedeem, getRedeemPrizeHistroy, getConsecutiveRewardConfig, getLiveRoom, addMission,
  TYPE_NONE, TYPE_MAIN_PLACE, TYPE_LIVE, TYPE_GOODS, TEXT_CHECK_IN_RULES
} from '../dailycheckin'
import events from '../../src/events'
import { splitImg, formatDate, isArrayEmpty, throttle } from '../../utils/utils'
import { wxShowToast } from '../../utils/wxMethods'
import config from '../../src/config.js'
let app = getApp()
const cdn = app.config.cdn
const brand = app.config.brand
var phone = null
var tempMakeupDay = null
var mUserinfo = null
var baseLingmi = 0
var roomInfo = null
const folGiftCount = 2
var fromInvite = "N"
var hasInvited = false
Page({
  openid: "",
  nickName: "",

  wxInfo: {},
  crmInfo: {},
  intervalCount: 0,
  missionType: TYPE_NONE,
  currMissionIndex: -1,

  /**
   * 页面的初始数据
   */
  data: {
    CDN_HOST: app.config.DEV ? `http://db.vm.cn` : cdn,
    testImgYouWouldLikeUrl: splitImg(`daily_checkin_test_you_may_like.png`, 'pub'),
    makeUpCardCount: 0,
    continuousCheckInDays: 1,
    continuousCheckInTip: ``,
    currIntegralValue: 0,
    imgTopBlackUrl: splitImg(`daily_checkin_top_black_bg.png`, "pub"),
    imgTopBlackUrl2: splitImg(`daily_checkin_main_bg.jpg`, "pub"),
    imgBonusItemBg: splitImg(`daily_checkin_main_coupon_item_bg.png`, "pub"),
    imgTopAlreadyDaysBg: splitImg(`daily_checkin_already_days_bg.png`, "pub"),
    imgMakeUpCardUrl: splitImg(`daily_checkin_makeup_card_mini.png`, "pub"),
    imgPopCheckInCard: splitImg(`daily_checkin_makeup_card_normal.png`, "pub"),
    imgCoinUrl: splitImg(`daily_checkin_coin.png`, "pub"),
    imgCouponNoStock: splitImg(`daily_checkin_coupon_no_stock.png`, "pub"),
    imgCouponReceived: splitImg(`daily_checkin_coupon_already_receive.png`, "pub"),
    imgBtLookActivity: splitImg(`daily_checkin_look_over_activity.png`, "pub"),
    imgBtLookActivity2: splitImg(`daily_checkin_look_over_activity_2.png`, "pub"),
    imgActivity001: splitImg(`daily_checkin_activity_001.png?v=123`, "pub"),
    imgInviteActivityBgUrl: splitImg(`daily_checkin_invite_activity_bg.png`, "pub"),
    imgBtInviteNowUrl: splitImg(`daily_checkin_bt_invite_friend_now.png`, "pub"),
    imgPointsTitle: splitImg(`daily_checkin_receive_point_center.png`, "pub"),
    imgPointsClose: splitImg(`daily_checkin_points_close.png`, "pub"),
    imgCheckInResultUrl: splitImg(`daily_checkin_checkin_success.png`, "pub"),
    imgInviteGiftMain: splitImg(`daily_checkin_invite_gift_main.png`, "pub"),
    imgInviteGiftCoupon: splitImg(`daily_checkin_invite_gift_coupon_20.png`, "pub"),
    imgInviteGiftClose: splitImg(`daily_checkin_invite_gift_close.png`, "pub"),
    imgInviteGiftAdd: splitImg(`daily_checkin_invite_add.png`, "pub"),
    imgSharePic: splitImg(`daily_checkin_share_pic.jpg`, "pub"),
    imgCalendarWrapperBg: splitImg(`daily_checkin_main_calendar_bg.png`, "pub"),
    coinValue: `10`,
    bonusObtainedThisTime: 10,
    nearestBonusDayNum: false,
    user: {
      defaultImg: '/images/user_icon.png',
      defaultText: '点击登录账户',
      avatarUrl: '',
      nickName: ''
    },
    currentMonth: new Date().getMonth() + 1,
    currentDay: new Date().getDate(),
    brandAppName: app.config.appName,
    flagShowCalendar: true,
    showIntegralList: false,
    inviteList: [null, null, null, null, null,],
    popActivityList: [],
    showPopupResult: false,
    showPopupMakeupCheckIn: false,
    hasCard: false,
    calendarConfig: {
      preventSwipe: true,
      onlyShowCurrentMonth: false,
      highlightToday: true,
      takeoverTap: true,
      showLunar: false,
      theme: 'default',
      multi: true
    },
    bonusUnit: `绫米`,
    TEXT_RULES: TEXT_CHECK_IN_RULES,
    showRules: false,
    // showMoreGift: brand == "FOL",
    showMoreGift: true,
    showMakeupUI: false,
    showInviteSucDialog: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("daily check in >> onlad ", options)
    // wx.setNavigationBarTitle({ title: '每日签到' })
    events.register(this, EVENTS.EVENT_CRMINFO)
    if (options.fromInvite == "Y") {
      fromInvite = "Y"
      // let param = `fromInvite=Y&sharerPhone=${phone}&sharerUserId=${mUserinfo.id}`
      this.fromInvitePhone = options.sharerPhone
      this.fromInviteUserId = options.sharerUserId
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let cTimer = setInterval(() => {
      console.log(`    ***************   this.calendar====  ${this.calendar}`)
      if (this.calendar) {
        console.log(`    ***************   this.calendar  初始化成功 ！！！！！！！！！！！！`)
        clearInterval(cTimer)
        this.checkAuth()
      }
    }, 200)
  },

  checkAuth: function () {
    // console.log(">>>>>>>>>>>>>>>>>>>>>>>...           checkAuth       ")
    if (!wx.getStorageSync(KEYSTORAGE.loginInfo)) {
      app.checkLogin()
    }
    else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)) {
      app.getCRMInfoFn()
    }
    else {
      this._getConfigs()
      this.getCacheInfoAndSet()
      this._newTryToCheckIn()
    }
  },

  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO && event) {
      this._getConfigs()
      this.getCacheInfoAndSet()
      this._newTryToCheckIn()
    }
  },


  _refreshRedeemableList: function () {
    let arr = [queryRedeemableList({ brand: brand }), getRedeemPrizeHistroy({
      userId: mUserinfo.id, brand: brand, phone: phone,
    })]
    Promise.all(arr).then(list => {
      let coupL = []
      let hisL = []
      if (list[0]) {
        coupL = list[0]
        if (this.data.showMoreGift && coupL.length >= folGiftCount) {
          coupL = coupL.splice(0, folGiftCount)
        }
        // this.setData({ couponList: coupL })
      }
      if (list[1]) {
        hisL = list[1]
        for (const coupon of coupL) {
          for (const his of hisL) {
            if (coupon.couponId == his.couponId) {
              coupon.hasRedeemed = true
              break
            }
          }
        }
      }
      this.setData({ couponList: coupL })
    })
      .catch(e => {
        console.log(">>>>>>>>>>>>>>>>>      _refreshRedeemableList   errrrrrr    ")
        console.log(e)
      })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.timer) {
      console.log("this.timer  >>>>    ")
      console.log(this.timer)
      clearInterval(this.timer)
      if (this.fromMission) {
        this.fromMission = false
        if (this.missionCompleted) {
          this.missionCompleted = false
          this.missionType = TYPE_NONE
          this._onMissionCompleted()
        } else {
          wxShowToast('没有完成任务')
        }
      }
    }
  },

  _getConfigs: function () {
    getBaseConfig()
      .then(bean => {
        baseLingmi = bean.signPoints
        this.setData({
          coinValue: `+${baseLingmi}`,
          bonusObtainedThisTime: baseLingmi,
        })
      })
      .catch(e => {
        console.log(">>>>>>>>>>>>>>>>>      getBaseConfig   errrrrrr    ")
        console.log(e)
      })

    getMissionList()
      .then(list => {
        let openList = []
        for (const item of list) {
          if (item.isOpen == 1) {
            if (item.browseName.indexOf('直播') > 0) {
              item.titleIcon = splitImg(`daily_checkin_points_center_activity_${2}.png`, `pub`)
              getLiveRoom()
                .then(info => {
                  roomInfo = info
                })
                .catch(e => {
                  console.log(e)
                })
            } else {
              item.titleIcon = splitImg(`daily_checkin_points_center_activity_${3}.png`, `pub`)
            }
            item.currBrowseCount = 0
            openList.push(item)
          }
        }
        // console.log(`openList==================`, openList)
        let count = openList.length
        let autoHeight = 400 + count * 100
        this.setData({
          popActivityList: openList,
          autoHeight: autoHeight,
        })
      })
      .catch(e => {
        console.log(">>>>>>>>>>>>>>>>>      getMissionList   errrrrrr    ")
        console.log(e)
      })

    getConsecutiveRewardConfig({ brand: brand })
      .then(list => {
        if (!isArrayEmpty(list)) {
          // let name = getBonusName(list[0].giftType)
          // let value = getBonusValue(list[0])
          // let tip = list[0].signCondition + `，获得 ${value} ${name}`
          // let num = list[0].continueDays
          // this.setData({
          //   continuousCheckInTip: tip,
          //   nearestBonusDayNum: num,
          //   // bonusUnit: name,
          // })
          let bonusCoupons = list.filter(item => {
            return item.giftType == 1//只取出优惠券
          })
          this.setData({ bonusList: bonusCoupons })




        }
      })
      .catch(e => {
        console.log(">>>>>>>>>>>>>>>>>      getConsecutiveRewardConfig   errrrrrr    ")
        console.log(e)
      })

    getInviteConfig({ brand: brand })
      .then(config => {
        // console.log("@@@@@@@@@@@@@@@@@@@@@     getInviteConfig   bean ==========   ", config)
        let { startTime, endTime, activityRule, activityStatus, successHelp, singleMaxHelp, signInviteGift } = config
        let startStr = startTime.split(" ")[0].substring(5, 10).replace("-", ".")
        let endStr = endTime.split(" ")[0].substring(5, 10).replace("-", ".")
        this.inviteCouponId = signInviteGift.couponId
        this.inviteCouponName = signInviteGift.giftName
        this.inviteCouponUrl = signInviteGift.giftPic
        this.setData({
          inviteStart: startStr,
          inviteEnd: endStr,
          inviteRuleHtml: activityRule,
          inviteRequiredNum: successHelp,
        })

        //todo:不同的邀请活动，不同的 couponId 匹配
        // if (fromInvite == "N") {
        //   this.inviteCouponId = signInviteGift.inviteCouponId
        //   this.inviteCouponName = signInviteGift.inviteCouponName
        //   this.inviteCouponUrl = signInviteGift.inviteCouponUrl
        // }


      })
      .catch(e => {
        console.log(">>>>>>>>>>>>>>>>>      getInviteConfig   errrrrrr    ")
        console.log(e)
      })
  },

  getCacheInfoAndSet() {
    this.crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
    this.wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo)
    this.openId = this.wxInfo.openId
    this.nickName = this.wxInfo.nickName
    this.avatarUrl = this.wxInfo.avatarUrl
    phone = this.crmInfo.phone.substring(0, 11)
    let user = this.data.user
    user.avatarUrl = this.wxInfo.avatarUrl || ''
    user.nickName = this.wxInfo.nickName || ''
    this.setData({ user })
  },

  _newTryToCheckIn: async function () {
    try {
      mUserinfo = await this._attemptToGetUserInfo()
      if (mUserinfo) {
        this._afterUserCreation()
      } else {
        let infoData = await this._attemptToCreateUser()
        console.log("_attemptToCreateUser   -----  ==========  res  1111111  =====")
        console.log(infoData)
        mUserinfo = await this._attemptToGetUserInfo()
        this._afterUserCreation()
      }
    } catch (e) {
      console.log(">>>>>>>>>>>>>>>>>          _newTryToCheckIn       errrrrrrr   >>>>>>")
      console.log(e)
    }
  },

  _afterUserCreation: async function () {
    let record = await this._attemptToAddRecord()
    if (record.code == 0) {
      this.setData({ showPopupResult: true })
    } else {
      if (record.msg.indexOf("签到") > 0) {
        wx.showToast({
          title: record.msg,
        })
      }
    }
    this._refreshCalendar()
    this._matchMissionCount()
    this._refreshRedeemableList()
    if (fromInvite == "Y" && this.fromInvitePhone != phone && !hasInvited) {
      hasInvited = true
      this._addOrCompleteInvitation(this.fromInvitePhone, this.fromInviteUserId, 0)
        .then(res => {
          wxShowToast(res.message || `助力成功！`)
        })
    }
  },

  _attemptToGetUserInfo: async function () {
    try {
      return await getCheckInUserInfo({
        brand: brand,
        phone: phone
      })
    } catch (e) {
      console.log(">>>>>>>>>>>>>>>          _attemptToGetUserInfo     errrrrrrr   >>>>>>>>>>")
      console.log(e)
    }
  },

  _attemptToCreateUser: async function () {
    try {
      //没有用户信息，创建用户
      let postBean = {
        "brand": brand,
        "phone": phone,
        "openid": this.openId,
        "nickName": this.nickName,
        "userImg": this.avatarUrl,
      }
      return await createCheckInUser(postBean)
    } catch (e) {
      console.log(">>>>>>>>>>>>>>>>>          _attemptToCreateUser       errrrrrrr   >>>>>>")
      console.log(e)
    }
  },

  _attemptToAddRecord: async function () {
    try {
      //  签到状态    0:正常签到,1:补签，3：浏览记录
      let postBean = {
        "brand": brand,
        "userid": mUserinfo.id,
        "signDays": mUserinfo.signDays,
        "phone": phone,
        "signStatus": 0
      }
      this.setData({
        continuousCheckInDays: mUserinfo.signDays,
        currIntegralValue: mUserinfo.points
      })
      return await addCheckInRecord(postBean)
    } catch (e) {
      console.log(">>>>>>>>>>>>>>>>>          _attemptToAddRecord       errrrrrrr   >>>>>>")
      console.log(e)
    }
  },

  _attemptToGetMonth: async function () {
    console.log(`>>>>>>>>>>>>>>>    _attemptToGetMonth  calendar      calendar`, `${this.calendar}`)
    try {
      let res = await queryCheckInRecordByMonth({
        signDate: getQueryDate(),
        userid: mUserinfo.id,
      })
      let days = generateCalendarList(res)
      // this._waitForCalendarInstantiate(days)
      return days
    } catch (e) {
      console.log(">>>>>>>>>>>>>>>>>>>>    _attemptToGetMonth  errrrrrrrrr      ")
      console.log(e)
      return []
    }
  },

  _waitForCalendarInstantiate: function () {
    let timer = setInterval(() => {
      if (this.calendar) {
        console.log("_waitForCalendarInstantiate >>>>>>>>>      calendar  init success   !!")
        clearInterval(timer)
      } else {
        console.log("_waitForCalendarInstantiate >>>>>>>>>      calendar has not init ")
      }
    }, 500)

  },

  _refreshCalendar: function (ev) {
    wx.showLoading({
      title: "加载中...",
    })
    let promiseList = []
    promiseList.push(this._attemptToGetMonth())
    promiseList.push(this._attemptToGetUserInfo())
    promiseList.push(getConsecutiveRewardConfig({ brand: brand }))
    Promise.all(promiseList).then(list => {
      //按月查询
      let checkedInDayList = list[0]
      if (checkedInDayList.length > 31) {
        checkedInDayList = checkedInDayList.splice(-31)
      }
      let { continuousCheckInDays, currIntValue, mCardCount, hasCard } = this.data
      //用户信息
      if (list[1]) {
        mUserinfo = list[1]
        continuousCheckInDays = list[1].signDays
        currIntValue = list[1].points
        mCardCount = list[1].cardCount
        hasCard = mCardCount > 0 ? true : false
      }
      let calendar = this.calendar
      let { continuousCheckInTip, bonusUnit, coinValue, tempNearestDay } = this.data
      let lingmi = baseLingmi
      //连续签到奖励列表
      if (list[2]) {
        let cList = list[2]
        if (!isArrayEmpty(cList)) {
          tempNearestDay = cList[0].continueDays
          let giftIconDayList = []
          for (const item of cList) {
            //找到比今天更晚的距离今天最近的连续签到奖励天数
            if (item.continueDays > continuousCheckInDays) {
              let combineStr = combineBonus(item)
              continuousCheckInTip = item.signCondition + `，获得${combineStr}`
              let gift = {
                continueDays: item.continueDays,
                bonusStr: combineStr
              }
              giftIconDayList.push(gift)
              if (item.continueDays < tempNearestDay) {
                tempNearestDay = item.continueDays
              }
            }
            if (item.continueDays == continuousCheckInDays) {
              if (item.giftType == 0) {
                lingmi += item.points
                // console.log(`@@@@@@@@@@@@@    111   lingmi += item.points   ==${lingmi} `)
                coinValue = `+${lingmi}`
                // console.log(`@@@@@@@@@@@@@     222  coinValue ===   +${lingmi}   ==${coinValue} `)
              } else {
                lingmi = getBonusValue(item)
                // console.log(`@@@@@@@@@@@@@     333  lingmi = getBonusValue(item)   ==${lingmi} `)
                bonusUnit = getBonusName(item.giftType)
              }
            }
          }
          if (calendar) {
            // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@    checkedInDayList===`, checkedInDayList)
            let giftDays = addCalendarTodoText(continuousCheckInDays, giftIconDayList)
            // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@   giftDays===`, giftDays)
            let newD = checkedInDayList.concat(giftDays)
            // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@    setTodoLabels   newD===`, newD)
            calendar['setTodoLabels']({
              showLabelAlways: true,
              days: newD
            })
            // let bonusDays = generateCalendarBonusList(giftDays)
            // calendar['enableDays'](bonusDays)//不需要设置enabledays
            let selectDays = generateCalendarSelectedList(giftDays)
            calendar['setSelectedDays'](selectDays)
            // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@    setSelectedDays   selectDays===`, selectDays)
          }
        }
      }
      this.setData({
        continuousCheckInDays: continuousCheckInDays,
        currIntegralValue: currIntValue,
        makeUpCardCount: mCardCount,
        hasCard: hasCard,

        coinValue: coinValue,
        bonusObtainedThisTime: lingmi,
        bonusUnit: bonusUnit,
        continuousCheckInTip: continuousCheckInTip,
        nearestBonusDayNum: tempNearestDay
      })


      if (this.data.showMakeupUI) {
        let makeupDate = findMakeupDate(continuousCheckInDays, checkedInDayList)
        let makeupDays = [{
          year: makeupDate[0],
          month: makeupDate[1],
          day: makeupDate[2],
          todoText: '补签'
        }]
        // console.log(`@@@@@@@@@@@@@@@@@@@@@@@@@@@   makeupDays===`)
        // console.log(makeupDays)
        tempMakeupDay = makeupDays[0]
        calendar['setTodoLabels']({
          showLabelAlways: true,
          days: makeupDays
        })
      }
      this.calendarTodoLabels = calendar['getTodoLabels']()
      this.calendarSelectedDay = calendar['getSelectedDay']()
      wx.hideLoading()
    })
      .catch(e => {
        wx.hideLoading()
        console.log(">>>>>>>>>>>>>>>>>       Promise  error   >>>>>>")
        console.log(e)
      })

  },

  _onMyIntegralClick: function (ev) {
    wx.navigateTo({
      url: `/dailyCheckIn/points/points?userid=${mUserinfo.id}`,
    })

  },

  onRemindClick: function (ev) {
    console.log(ev.detail.value)
  },

  onLookActivityClick: function (ev) {
    console.log("onLookActivityClick..", ev)
    if (!throttle()) return
    let flag = this.data.flagShowCalendar
    if (flag) {
      this._refreshInvitationInfo(false)
    }
    this.setData({ flagShowCalendar: !flag }, function () {
      if (!flag) {
        setTimeout(() => {
          let calendar = this.calendar
          calendar['setTodoLabels']({
            showLabelAlways: true,
            days: this.calendarTodoLabels
          })
          calendar['setSelectedDays'](this.calendarSelectedDay)
        }, 35)
      }
    })
  },

  onInviteClick: function (ev) {
    console.log(ev)
  },


  onReceiveAwardClick: function (ev) {
    console.log(ev)
    this.setData({
      showPopupMakeupCheckIn: false,
      showIntegralList: true
    })
  },

  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function (ev) {
    let param = `fromInvite=Y&sharerPhone=${phone}&sharerUserId=${mUserinfo.id}`
    console.log(`onShareAppMessage >>  param==`, param)
    return {
      title: "测试：转发有礼",
      path: `/dailyCheckIn/main/main?${param}`,
      imageUrl: this.data.imgSharePic,
    }
  },

  onPointsCloseClick: function (ev) {
    this.setData({ showIntegralList: false })
  },

  onCheckInSuccessClick: function (ev) {
    this.setData({ showPopupResult: false })
  },

  onTapDay: function (ev) {
    if (!throttle()) return
    if (!tempMakeupDay) return
    console.log("onTapDay ....", ev.detail)
    console.log(ev)
    let year = ev.detail.year
    let month = ev.detail.month
    let day = ev.detail.day
    console.log(`year=${year}  month=${month}  day=${day}`)
    //如果是补签的日期:
    let makeupDay = tempMakeupDay
    if (year == makeupDay.year && month == makeupDay.month && day == makeupDay.day) {
      //则弹出补签确认对话框
      this.setData({ showPopupMakeupCheckIn: true })
    }
  },

  afterTapDay: function (ev) {
    // return
    console.log("afterTapDay ....", ev.detail)
  },

  whenChangeMonth: function (ev) {
    console.log(ev)
  },

  onMakeupCardClose: function (ev) {
    console.log(">>>>>>>>>  onMakeupCardClose")
    console.log(ev)
    this.setData({ showPopupMakeupCheckIn: false })
    if (ev.target.dataset.act == "confirm") {
      let makeupDay = tempMakeupDay
      //  签到状态    0:正常签到,1:补签，3：浏览记录
      let postBean = {
        "brand": brand,
        "userid": mUserinfo.id,
        "signDays": mUserinfo.signDays,
        "phone": phone,
        "signDate": `${makeupDay.year}-${makeupDay.month}-${makeupDay.day}`,
        "signStatus": 1
      }
      addCheckInRecord(postBean)
        .then(res => {
          wx.showToast({
            title: `${res.msg}`
          })
          if (res.code == 0) {
            this.calendar['clearTodoLabels']()
            this.calendar['cancelSelectedDates']()
            this._refreshCalendar()
          }
        })
        .catch(e => {
          console.log(e)
          wxShowToast(`${e.message}`)
        })
    }
  },

  onMissionItemClick: function (ev) {
    if (!throttle()) return
    console.log(ev)
    let index = ev.currentTarget.dataset.id
    this.currMissionIndex = index
    let act = this.data.popActivityList[index]
    if (act.currBrowseCount == act.browseCount) {
      wx.showModal({
        title: '提示',
        content: '您已做完这个任务',
        showCancel: false,
      })
      return
    }
    let benchmark = act.browseTime
    let timesToComplete = act.browseCount
    let activityNo = act.activityNo
    let name = act.browseName
    let taskUrlList = act.signTaskUrlList
    let browseUrl = isArrayEmpty(taskUrlList) ? "" : taskUrlList[0].browseUrl //todo:taskUrlList length>1
    this.fromMission = true
    this.missionCompleted = false
    this._startSingleCountDown(benchmark)
    try {
      if (name.indexOf('主会场') > 0 || activityNo == "1") {
        this.missionType = TYPE_MAIN_PLACE
        wx.navigateTo({
          url: `${browseUrl}`
        })
      }
      else if (name.indexOf('直播') > 0 || activityNo == "2") {
        this.missionType = TYPE_LIVE
        this._gotoLiveRoom(benchmark)
      }
      else if (name.indexOf('爆款') > 0 || activityNo == "3") {
        this.missionType = TYPE_GOODS
        let colorCode = browseUrl
        wx.navigateTo({
          url: `/pages/content/content?colorCode=${colorCode}&countDownSec=${benchmark}&intentType=DAILY_CHECKIN`
        })
      }
      else if (name.indexOf('任务') > 0 || activityNo == "4") {
        this.missionType = TYPE_MAIN_PLACE
        wx.navigateTo({
          url: `${browseUrl}`
        })
      }
      else {
        this.missionType = TYPE_NONE
        clearInterval(this.timer)
      }
    } catch (e) {
      console.log(e)
      this.missionType = TYPE_NONE
      this.fromMission = false
      clearInterval(this.timer)
    }
  },

  _gotoLiveRoom: function () {
    console.log(roomInfo)
    try {
      const curRoom = roomInfo[0]
      const roomId = curRoom.roomid
      const startTime = formatDate(curRoom.start_time * 1000, '')
      const utmOptions = {
        utm_source: 'wx_zhibo',
        utm_medium: 'wx_zhibo',
        utm_campaign: `${startTime.replace(/-/g, '')}LIVE` || '',
        utm_term: `${app.config.ETO_BRAND[brand]}${roomId}` || '',
      }
      const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo) || {}
      app.tdSdkEvent('pageclick_home_live', {
        直播名称: curRoom.name,
        LIVEID: `${ETO_BRAND[brand]}${curRoom.roomid}`,
        PHONE: crmInfo.phone || '',
        UTM_SOURCE: utmOptions.utm_source,
        UTM_MEDIUM: utmOptions.utm_medium || '',
        UTM_TERM: utmOptions.utm_term || '',
        UTM_CAMPAIGN: utmOptions.utm_campaign || '',
        LIVE_STATUS: curRoom.live_status,
        PAGE: 'pages/index/index',
        FROM: '',
        STAFF_NO: '',
      })
      wx.navigateTo({
        url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`,
        success() {
          wx.setStorageSync(KEYSTORAGE.roomId, roomId)
          wx.setStorageSync('roomName', curRoom.name || '')
          app.setUtmOptions(utmOptions)
          app.setRoomId(roomId, curRoom.start_time)
        },
        fail: () => {
          wxShowToast('暂无可用直播')
          this.missionType = TYPE_NONE
          this.fromMission = false
          clearInterval(this.timer)
        }
      })
    } catch (e) {
      console.log(e)
      wxShowToast('暂无可用直播')
      this.missionType = TYPE_NONE
      this.fromMission = false
      clearInterval(this.timer)
    }
  },

  _startSingleCountDown: function (benchmark) {
    let newT = Number(benchmark)
    this.timer = setInterval(() => {
      this.newT = --newT
      if (this.newT <= 0) {
        clearInterval(this.timer)
        this.newT = 60
        this.missionCompleted = true
        console.log(`clearInterval  >>>   missionCompleted...`)
      }
      console.log(`this.newT == ${this.newT}`)
    }, 1000)
  },

  _onMissionCompleted: function () {
    switch (this.missionType) {
      case TYPE_MAIN_PLACE:

        break
      case TYPE_LIVE:

        break
      case TYPE_GOODS:

        break
    }
    let index = this.currMissionIndex
    let act = this.data.popActivityList[index]
    let taskUrlList = act.signTaskUrlList
    let browseUrl = isArrayEmpty(taskUrlList) ? "" : taskUrlList[0].browseUrl //todo:taskUrlList length>1
    let bean = {
      activityConfigId: act.id,
      browseCount: act.browseCount,
      signStatus: 3,//活动
      taskNo: act.activityNo,
      userid: mUserinfo.id,
      brand: brand,
      points: act.points,
      browseUrl: browseUrl,
      userImg: this.avatarUrl
    }
    wx.showLoading({
      title: '添加任务中...',
    })
    addMission(bean)
      .then(() => {
        wx.showModal({
          title: '任务完成',
          content: `恭喜您,获得${act.points}绫米`,
          showCancel: false,
        })
        wx.hideLoading()
        this._refreshCalendar()
        this._matchMissionCount()
      })
      .catch(e => {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: `添加任务失败`,
          showCancel: false,
        })
        console.log(e)
      })
  },

  _onCouponItemClick: function (ev) {
    if (!throttle()) return
    console.log(ev)
    let index = ev.currentTarget.dataset.id
    let coupon = this.data.couponList[index]
    let hasRedeemed = coupon.hasRedeemed
    if (hasRedeemed) {
      wx.showModal({
        title: '提示',
        content: '您已兑换过这张优惠券',
        showCancel: false,
      })
      return
    }
    let totalCount = coupon.cardCount
    if (totalCount <= 0) {
      wx.showModal({
        title: '提示',
        content: '很抱歉，这个优惠券已没有库存',
        showCancel: false,
      })
      return
    }
    if (this.data.currIntegralValue < coupon.points) {
      wx.showModal({
        title: '提示',
        content: '很抱歉，您的绫米不足',
        showCancel: false,
      })
      return
    }
    wx.showLoading({
      title: "加载中...",
    })
    let bean = {
      "brand": brand,
      "count": 1,
      "couponId": coupon.couponId,
      "couponName": coupon.redeemName,
      "couponUrl": coupon.couponId,
      "redeemId": coupon.id,
      "phone": phone,
      "points": coupon.points,
      "redeemType": coupon.redeemType,
      "userId": mUserinfo.id
    }
    perfromRedeem(bean)
      .then(res => {
        wx.showToast({
          title: `兑换成功`,
          duration: 2000,
        })
        this._refreshRedeemableList()
        let newInfo = this._attemptToGetUserInfo()
        if (newInfo) {
          mUserinfo = newInfo
          let mCardCount = mUserinfo.cardCount
          let hasCard = mCardCount > 0 ? true : false
          this.setData({
            continuousCheckInDays: mUserinfo.signDays,
            currIntegralValue: mUserinfo.points,
            makeUpCardCount: mCardCount,
            hasCard: hasCard,
          })
        }
        wx.hideLoading()
      })
      .catch(e => {
        wx.hideLoading()
        if (app.config.DEV) {
          wx.showModal({
            title: '测试环境提示',
            content: `${e.message}`,
          })
        }
        console.log(e)
      })
  },

  _matchMissionCount: function () {
    checkMissionCompletion({ userid: mUserinfo.id, brand: brand })
      .then(list => {
        if (list && list.length > 0) {
          let actList = this.data.popActivityList
          if (actList) {
            actList.forEach((act) => {
              console.log(`############################   act.id==${act.id}`)
              for (const m of list) {
                console.log(`############################   m.activityConfigId=${m.activityConfigId}`)
                if (act.id == m.activityConfigId) {
                  console.log(` act.id =========m.activityConfigId !!!  act.id==${act.id}   m.activityConfigId=${m.activityConfigId}`)
                  act.currBrowseCount = m.browseCount
                  break
                }
              }
            })
          }
          this.setData({ popActivityList: actList })
        }
      })
      .catch(e => {
        console.log(e)
      })
  },

  _onRuleClick: function (ev) {
    let action = ev.currentTarget.dataset.action
    let flag = action == "show" ? true : false
    this.setData({ showRules: flag })
  },

  _onInviteSucCloseClick: function (ev) {
    this.setData({ showInviteSucDialog: false })
  },

  _onMoreGiftClick: function (ev) {
    wx.navigateTo({
      url: `/dailyCheckIn/history/history?userid=${mUserinfo.id}&phone=${phone}`,
    })
  },

  _onInviteRuleClick: function (ev) {
    console.log(ev)
    let action = ev.currentTarget.dataset.action
    let flag = action == "show" ? true : false
    this.setData({ showInviteRules: flag })
  },

  _refreshInvitationInfo: function (showDialog) {
    wx.showLoading({
      title: "加载中...",
    })
    queryInviteInfo({ brand: brand, userId: mUserinfo.id })
      .then(list => {
        let inviteList = new Array()
        if (!isArrayEmpty(list)) {
          let inviteSuc = list.length >= 5
          for (let i = 0; i <= 4; i++) {
            inviteList.push(list[i] ? list[i] : null)
          }
          //设置邀请列表头像
          this.setData({
            inviteList: inviteList,
            // showInviteSucDialog: showDialog,
            canCompleteInvite: inviteSuc
          })
        } else {
          this.setData({
            inviteList: [null, null, null, null, null],
            // showInviteSucDialog: false,
            canCompleteInvite: false
          })
        }
        wx.hideLoading()
      })
      .catch(e => {
        wx.hideLoading()
        console.log(">>>>>>>>>>>>>>>>>      queryInviteInfo   errrrrrr    ")
        console.log(e)
      })
  },

  _onInviteSucClick: async function (e) {
    if (this.data.canCompleteInvite) {
      await this._addOrCompleteInvitation(phone, mUserinfo.id, 1)
        .then(res => {
          this.setData({ showInviteSucDialog: true })
          this._refreshInvitationInfo(true)
        })
        .catch(e => {
          wxShowToast(`${e.msg || e.message}`)
        })
    }
  },

  _addOrCompleteInvitation: async function (mPhone, mUserId, isGift) {
    wx.showLoading({
      title: "加载中...",
    })
    try {
      let bean = {
        "bindingPhone": phone,//完成邀请任务，bindingPhone该字段随意传
        "bindingUserId": mUserinfo.id,//完成邀请任务，bindingUserId该字段随意传
        "couponId": this.inviteCouponId,
        "couponName": this.inviteCouponName,
        "couponUrl": this.inviteCouponUrl,
        "giftAmount": 1,
        "isGift": isGift,//0 未满足邀请人数   1--满足邀请人数
        "phone": mPhone,
        "signInviteId": 0,
        "userId": mUserId,
        "userImg": this.avatarUrl
      }
      return await addInvite(bean)
    } catch (e) {
      console.log(" catch      addInvite   errrrrrr    ")
      console.log(e)
      wx.hideLoading()
      return new Error(e.message)
    }

  },




  onUnload: function () {
    events.unregister(this, EVENTS.EVENT_CRMINFO)
    if (this.timer) {
      clearInterval(this.timer)
    }
  }
})