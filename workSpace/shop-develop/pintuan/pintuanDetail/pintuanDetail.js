// pintuan/pintuanDetail/pintuanDetail.js
import { objToQuery } from "../../utils/utils"
import { EVENTS, KEYSTORAGE } from '../../src/const'
import { getDetailPage } from '../../service/goods'
import events from "../../src/events";
import { PTGetKucun, PTGetGoodsDetailPinTuan, PTGetFaceAndIcon, PTGetGoPindan } from '../netWork/pintuanRquest.js'
import {
  yipinNumber
} from '../../utils/utils'
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // DA号
    DANum: '',
    // 拼团人数
    pintuanPersonNum: 0,
    // 剩余多少名额
    shengyuNum: 0,
    // 判断是否是iphoneX
    isIphoneX: getApp().globalData.isIPhoneX,
    // 右侧悬浮按钮
    fixedRightArr: [
      {
        type: 'share',
        url: 'https://cdn.bestseller.com.cn/assets/common/image/icon_share.png'
      }, {
        type: 'home',
        url: 'https://cdn.bestseller.com.cn/assets/common/image/icon_home.png'
      }],
    // 默认选中
    defalutIndex: 0,

    timer: '',
    endTimeObj: {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    },
    // endtime商品是否过期
    endTimebol: false,
    // stauts商品状态是否是stop
    status_stop: false,
    // paytime是否过期
    payTimeBol: false,
    // 是否下架
    isInself: false,

    // 去拼单数据
    goPindanArrs : [],
    goPindanDaojishi : [],
    // 轮播图
    swiper: {
      images: [],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 500
    },
    // 弹框数据
    bouncesData: {
      // 数据源
      'datas': {},
      // 拼团数据
      'pintuanDatas': {},
      // 总库存
      'totalKucun': 0,
      // 库存
      'kucuns': 0,
      //缩略图
      'thumImages': [],
      // 颜色数据
      'colors': [],
      // 尺码数据
      'sizes': [],
      // 默认弹框显示的颜色
      'defalutColor': 0,
      // 弹框用到的数据

      'buyNum': 1,
      'selectColor': {},
      'selectChima': {}
    },
    productCode: '',
    gsColorCode : '',
    // 来自分享的话展示邀请模块
    isShare: {
      icon: '',
      name: '',
      paymentTime: 0,
      bigorderCode: ''
    },
    // 详情页展示逻辑用的分享数据
    isShareForDetail: {
      icon: '',
      name: '',
      paymentTime: 0,
      bigorderCode: '',

      otherIcons: []
    },
    buyBttonFrom: '', //点击的是单独购买还是发起拼团
    ischimaBounces: false, //是否显示弹框
    detailShow: false,  // 详情页是否显示
    huodongjieshu: false, //活动结束弹框
    bodyContent: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    events.register(this, EVENTS.EVENT_LOGINED);
    /*
     *  判断商品endtime status是否过期，在判断InSelf是否下架,以及库存0或者<2,发团的话返回上一页,参团的话ui弹框返回首页
     *
    */
    console.log('接收的数据:', JSON.stringify(options))

    var productCode = ''
    var gsColorCode = ''

    var isShares = ''
    var icon = ''
    var name = ''
    var paymentTime = 0
    var bigorderCode = ''


    var utm_source = ''
    var utm_medium = ''
    var utm_term = ''
    var utm_campaign = ''

    var shareBy = ''
    var shareByShop = ''
    let devFlag = ''

    if (options.q) {

      let scan_url = decodeURIComponent(options.q);
      if (getApp().config.brand == 'VEROMODA') {
        scan_url = scan_url.replace(/https:\/\/www.veromoda.com.cn\//g, '')
      }
      else if (getApp().config.brand == 'ONLY') {
        scan_url = scan_url.replace(/https:\/\/www.only.cn\//g, '')
      }
      else if (getApp().config.brand == 'SELECTED') {
        scan_url = scan_url.replace(/https:\/\/www.selected.com.cn\//g, '')
      }
      else if (getApp().config.brand == 'JACKJONES') {
        scan_url = scan_url.replace(/https:\/\/www.jackjones.com.cn\//g, '')
      }
      else {
        scan_url = scan_url.replace(/https:\/\/ext.bestseller.com.cn\//g, '')
      }

      scan_url = scan_url.split('&')
      scan_url.forEach(items => {

        let b = items.split('=')
        switch (b[0]) {
          case 'productCode':
            productCode = b[1]
            break;
          case 'gsColorCode':
            gsColorCode = b[1]
            break;
          case 'isShare':
            isShares = b[1]
            break;
          case 'icon':
            icon = b[1]
            break;
          case 'name':
            name = b[1]
            break;
          case 'paymentTime':
            paymentTime = parseInt(b[1])
            break;
          case 'bigorderCode':
            bigorderCode = b[1]
            break;

          case 'utm_source':
            utm_source = b[1]
            break;
          case 'utm_medium':
            utm_medium = b[1]
            break;
          case 'utm_term':
            utm_term = b[1]
            break;
          case 'utm_campaign':
            utm_campaign = b[1]
            break;

          case 'share_by':
            shareBy = b[1]
            break;
          case 'share_by_shop':
            shareByShop = b[1]
            break;
          case 'devFlag':
            devFlag = b[1]
            break;

          default:
            break;
        }
        curOptions = {
          gsColorCode,
          productCode,
          isShares,
          icon,
          name,
          paymentTime,
          utm_source,
          utm_medium,
          utm_term,
          utm_campaign,
          shareBy,
          shareByShop,
          devFlag
        }
        if(devFlag){
          wx.setStorageSync(KEYSTORAGE.devFlag, devFlag)
        }
      });

    } else {
      curOptions = options;
      productCode = options.productCode
      gsColorCode = options.gsColorCode
      isShares = options.isShare
      icon = options.icon
      name = options.name
      paymentTime = parseInt(options.paymentTime)
      bigorderCode = options.bigorderCode;

      shareBy = options.share_by || '',
      shareByShop = options.share_by_shop || ''
    }
    if(options.devFlag){
      wx.setStorageSync(KEYSTORAGE.devFlag, options.devFlag)
    }
    /*var utmJson = {}
    if (!utm_source) {
      utmJson = {
        utm_source: 'pintuan_faqi',
        utm_medium: 'pintuan_goods_detail',
        utm_term: '',
        utm_campaign: gsColorCode
      }
    }else {
      utmJson = {
        utm_source,
        utm_medium,
        utm_term,
        utm_campaign
      }
    }*/
    if (shareBy) {
      let orderSaveShare = {
        shareBy,
        shareByShop
      };
      getApp().setShareInfo(orderSaveShare);
      this.setData({ DANum: shareBy })
    }
    else {
      let dbShare = wx.getStorageSync('shareFromDaogouInfo');
      if (dbShare) {
        this.setData({ DANum: dbShare.shareBy })
      }
    }

    // 保存拼主的分享参数
    // 如果没有缓存数据 创建个数组
    if (!wx.getStorageSync('pinzhuShareArrs')) {
      wx.setStorageSync('pinzhuShareArrs', [{}]);
    }

    if (!bigorderCode || bigorderCode == undefined) {
      if (isShares && isShares != '') {
        /*utmJson = {
          utm_source: 'pintuan_faqi',
          utm_medium: 'pintuan_goods_detail',
          utm_term: '',
          utm_campaign: gsColorCode
        }*/
        isShares = ''
        icon = ''
        name = ''
        paymentTime = 0
        bigorderCode = ''

        wx.removeStorageSync('pintuan-utm');
        wx.removeStorageSync('pintuanDetailPage_s');
        wx.removeStorageSync('pintuanDetailPage_nomal');

        wx.showModal({
          title: '提示',
          content: '内容无效,请重新分享',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#3CC51F',
          success: (result) => {
            if (result.confirm) {

            }
          },
          fail: () => { },
          complete: () => { }
        });
      }
    }
    else if (bigorderCode) {
      let pinzhuShareJson = {
        productCode,
        gsColorCode,
        paymentTime,
        bigorderCode,

        share_by: shareBy,
        share_by_shop: shareByShop
      }
      let ptArrs = wx.getStorageSync('pinzhuShareArrs')
      ptArrs.push(pinzhuShareJson)
      wx.setStorageSync('pinzhuShareArrs', ptArrs);

      wx.removeStorageSync('pintuanDetailPage_s')
    }


    // 从拼团列表进入 如果是链接详情的话，展示链接详情内容
    let pageJson = wx.getStorageSync('pintuanDetailPage_s')
    // if(pageJson && pageJson.productCode == productCode){
    if (pageJson) { //从连接进,无论拼团列表哪个商品 都展示参加拼团模块
      let currentTime = new Date().getTime()
      let endTime = pageJson.paymentTime + (24 * 60 * 60 * 1000)
      if (currentTime > endTime) {

        // 失效了
        /*utmJson = {
          utm_source: 'pintuan_faqi',
          utm_medium: 'pintuan_goods_detail',
          utm_term: '',
          utm_campaign: gsColorCode
        }*/
        isShares = ''
        icon = ''
        name = ''
        paymentTime = 0
        bigorderCode = ''

        wx.removeStorageSync('pintuan-utm');
        wx.removeStorageSync('pintuanDetailPage_s');
        wx.removeStorageSync('pintuanDetailPage_nomal');
      }
      else {
        // productCode = pageJson.productCode
        // gsColorCode = pageJson.gsColorCode
        isShares = pageJson.isShares
        icon = pageJson.icon
        name = pageJson.name
        paymentTime = pageJson.paymentTime
        bigorderCode = pageJson.bigorderCode


        /*utmJson = {
          utm_source: pageJson.utm_source,
          utm_medium: pageJson.utm_medium,
          utm_term: pageJson.utm_term,
          utm_campaign: pageJson.utm_campaign
        }*/

      }
    }

    const json = {
      productCode,
      gsColorCode,
      isShares,
      icon,
      name,
      paymentTime,
      bigorderCode
    }
    console.log(`接收的数据-二维码:${JSON.stringify(json)}`)


    let collectParam = Object.assign(curOptions, { eventName: `打开拼团详情页_${gsColorCode}` });
    getApp()._collectData2(collectParam)
    getApp().setUtmOptions(curOptions)

    wx.setStorageSync('pintuanDetailPage', json) //用于分享
    if (bigorderCode) {
      wx.setStorageSync('pintuanDetailPage_s', Object.assign(json, curOptions))  //从拼团列表里进入判断是否是链接商品，展示参团模块
      wx.setStorageSync('pintuanDetailPage_nomal', json) //普通订单参数
    }

    this.setData({
      productCode,
      gsColorCode
    })
    wx.removeStorageSync('isShare')
    wx.removeStorageSync('detailData')
    getDetailPage(productCode).then(res => {
      this.setData({
        detailShow: true,  // 详情页是否显示
        bodyContent: res
      })
    })

    if (wx.getStorageSync(KEYSTORAGE.loginInfo)) {
      this.getDetailData()
    }
    else{
      getApp().checkLogin()
    }

  },
  /**
 * 订阅的事件回调
 */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED && event) {
      //用户登录成功
      this.getDetailData()
    }
  },
  // 获取详情数据
  getDetailData () {

    let pintuanPersonNum = this.data.pintuanPersonNum
    PTGetGoodsDetailPinTuan(this.data.productCode).then(e => {
      // console.log(`拼团数据:${JSON.stringify(e)}`)

      // ............................ 普通商品详情
      let goodDetail = e[this.data.productCode]
      // 图片变成_T、集合图片/尺码数据
      var swiper = this.data.swiper
      var bouncesData = this.data.bouncesData
      bouncesData.datas = goodDetail

      goodDetail.color.forEach((item, index) => {
        bouncesData.colors.push(item.colorAlias)

        let thum = `${getApp().config.cdn}/goodsImagePC/${goodDetail.brand}/${goodDetail.projectCode}/${item.colorCode}/240400/${item.colorCode}_p3.jpg`
        bouncesData.thumImages.push(thum)
        if (this.data.gsColorCode == item.colorCode) {
          bouncesData.defalutColor = index
          this.setData({
            defalutIndex: index
          })
          if (item.status != 'InShelf') {
            // 下架了
            this.setData({
              isInself: true
            })
          }
        }

        var sizeArrs = []
        var arrs = []
        item.picurls.forEach((items, index) => {
          let path = `${getApp().config.cdn}/goodsImagePC/${goodDetail.brand}/${goodDetail.projectCode}/${item.colorCode}/750750/${item.colorCode}_T0${index + 1}.jpg`
          arrs.push(path)
        })
        item.sizes.forEach(items => {
          sizeArrs.push(items)
        })
        swiper.images.push(arrs)
        bouncesData.sizes.push(sizeArrs)
      })

      bouncesData.selectColor.index = bouncesData.defalutColor
      bouncesData.selectColor.name = bouncesData.colors[bouncesData.defalutColor]


      // ............................ 拼团详情
      let pintuanDetail = e[this.data.gsColorCode]
      pintuanPersonNum = pintuanDetail.personRequire
      pintuanDetail.yipinNum = yipinNumber(pintuanDetail.startTime)
      wx.setStorageSync('pintuanData', pintuanDetail)

      // 如果endtime过期了回到上一页
      var timestamp = new Date().getTime();
      if (pintuanDetail.endTime < timestamp) {
        this.setData({
          endTimebol: true
        })
      }
      // 判断status是否是0(stop)
      if (pintuanDetail.status == 0) {
        this.setData({
          status_stop: true
        })
      }
      if (this.data.endTimebol || this.data.status_stop || this.data.isInself) {
        if (isShares == 'share') {
          // 弹框退到首页
          this.alterView(true)
        }
        else {
          this.alterView(false)
        }
      }
      else {
        bouncesData.pintuanDatas = pintuanDetail
        this.setData({
          bouncesData
        })

        let isSharesJson = wx.getStorageSync('pintuanDetailPage');
        if (isSharesJson.isShares == 'share') {
          var isShareForDetail = this.data.isShareForDetail
          isShareForDetail.icon = isSharesJson.icon
          isShareForDetail.name = isSharesJson.name
          isShareForDetail.paymentTime = isSharesJson.paymentTime
          isShareForDetail.bigorderCode = isSharesJson.bigorderCode
          this.setData({
            isShareForDetail
          })

          let timer = setInterval(() => {
            var a = pintuanDetail.endTime

            if (isShareForDetail.paymentTime + (24 * 60 * 60 * 1000) < pintuanDetail.endTime) {
              a = isShareForDetail.paymentTime + (24 * 60 * 60 * 1000)
            }

            this.countDown(a);
          }, 1000);
          if (this.data.timer == '') {
            this.setData({
              timer: timer
            })
          }

          this.checkOpenID()
        }
      }

      this.setData({
        swiper,
        bouncesData,
        pintuanPersonNum
      })
    })

    this.getPindanDatas()

  },
  // 获取拼单数据
  getPindanDatas(){

    // 获取去拼单数据
    PTGetGoPindan(this.data.productCode).then(res => {
      if (res && res.length > 0){
        let goPindanDaojishi = this.data.goPindanDaojishi
        goPindanDaojishi = []

        res.forEach(item => {
          item.phone = item.phone.substr(0,3) + '****' + item.phone.substr(7)

          let json = {
            time : new Date(item.paymentTime.replace(/-/g,'/')).getTime() + (24 * 60 * 60 * 1000),

            obj : {
              day: '00',
              hou: '00',
              min: '00',
              sec: '00',
              canShow : false
            },

            timer : ''
          }
          goPindanDaojishi.push(json)
        })


        for (let i = 0;i<goPindanDaojishi.length;i++){

          goPindanDaojishi[i].timer = setInterval(() => {
            this.countDown_goPindan(goPindanDaojishi[i],i)
          }, 1000);
          this.setData({
            goPindanArrs : res,
            goPindanDaojishi
          })
        }
      }
    })
  },
  // 检测是不是自己的团，自己不能跟自己拼
  checkOpenID: function (e) {
    // return

    let json = wx.getStorageSync('pintuanDetailPage');

    if (json.isShares == 'share') {

      // 自己不能跟自己拼
      if (json.bigorderCode && json.bigorderCode != undefined) {

      PTGetFaceAndIcon(json.bigorderCode).then(item => {
          // console.log(`团信息:${JSON.stringify(item)}`)
          var openID = wx.getStorageSync('wxOpenID');
          var isShareForDetail = this.data.isShareForDetail
          var type = ''
          var id = ''
          var pintuanStatus = ''
          if (item && item.length > 0) {
            var shengyuNum = this.data.shengyuNum
            isShareForDetail.otherIcons = ['']

            item.forEach(e => {
              if (e.isPintuan == 'pintuan') {
                shengyuNum += 1
                if (e.openId == openID && !(e.paymentTime == null)) {
                  type = e.pintuanOrderType
                  id = e.id
                  pintuanStatus = e.pintuanStatus
                }
                if (e.pintuanOrderType != '0') {
                  if (this.data.pintuanPersonNum > isShareForDetail.otherIcons.length) {
                    isShareForDetail.otherIcons.push(e.customerFaceImg)
                  }
                }
              }
            });
            shengyuNum = this.data.pintuanPersonNum - shengyuNum
            shengyuNum = shengyuNum <= 0 ? 0 : shengyuNum

            if (this.data.pintuanPersonNum == 2) {
              shengyuNum = 1
              isShareForDetail.otherIcons = ['']
            }

            this.setData({ isShareForDetail, shengyuNum })
          }
          else{
            // 解决退款了 同一人点进来匹配不了问题
            wx.removeStorageSync('pintuanDetailPage_s');
            wx.removeStorageSync('pintuanDetailPage_nomal');
            wx.removeStorageSync('isShare');
            /*let utmJson = {
              utm_source: 'pintuan_faqi',
              utm_medium: 'pintuan_goods_detail',
              utm_term: '',
              utm_campaign: json.gsColorCode
            }*/
            let collectParam = Object.assign(curOptions, { eventName: `打开拼团详情页_${json.gsColorCode}` });
            getApp()._collectData2(collectParam)
            wx.setStorageSync('pintuan-utm', curOptions)
            getApp().setUtmOptions(curOptions)


            // 改为发团状态
            var isShareForDetail = this.data.isShareForDetail
            isShareForDetail.icon = '',
              isShareForDetail.name = '',
              isShareForDetail.payTokenTime = '',
              isShareForDetail.bigorderCode = ''
            this.setData({
              isShareForDetail,
              ischimaBounces: false
            })
            clearInterval(this.data.timer)
          }
          if (type != '') {

            wx.removeStorageSync('pintuanDetailPage_s');
            wx.removeStorageSync('pintuanDetailPage_nomal');
            wx.removeStorageSync('isShare');
            /*let utmJson = {
              utm_source: 'pintuan_faqi',
              utm_medium: 'pintuan_goods_detail',
              utm_term: '',
              utm_campaign: json.gsColorCode
            }*/
            let collectParam = Object.assign(curOptions, { eventName: `打开拼团详情页_${json.gsColorCode}` });
            getApp()._collectData2(collectParam)
            wx.setStorageSync('pintuan-utm', curOptions)
            getApp().setUtmOptions(curOptions)


            // 改为发团状态
            var isShareForDetail = this.data.isShareForDetail
            isShareForDetail.icon = '',
              isShareForDetail.name = '',
              isShareForDetail.payTokenTime = '',
              isShareForDetail.bigorderCode = ''
            this.setData({
              isShareForDetail,
              ischimaBounces: false
            })
            clearInterval(this.data.timer)

            let orderData = {
              bigorderCode: json.bigorderCode,
              bigOrderId: id
            }
            wx.setStorageSync('orderData', orderData)
            let detailData = {
              pintuanOrderType: type
            }
            wx.setStorageSync('detailData', detailData)
            // 进入支付成功页
            if (pintuanStatus == 'PintuanSuccess') {
              // 跳转到拼团成功详情页
              wx.navigateTo({ url: '../pintuanOrder_success/pintuanOrder_success' });
            }
            else {
              // 跳转到待分享详情页
              wx.navigateTo({ url: `../pintuanOrder/pintuanOrder` });
            }
          }
        }).catch(err => {

            // 解决退款了 同一人点进来匹配不了问题
            wx.removeStorageSync('pintuanDetailPage_s');
            wx.removeStorageSync('pintuanDetailPage_nomal');
            wx.removeStorageSync('isShare');
            /*let utmJson = {
              utm_source: 'pintuan_faqi',
              utm_medium: 'pintuan_goods_detail',
              utm_term: '',
              utm_campaign: json.gsColorCode
            }*/
            let collectParam = Object.assign(curOptions, { eventName: `打开拼团详情页_${json.gsColorCode}` });
            getApp()._collectData2(collectParam)
            wx.setStorageSync('pintuan-utm', curOptions)
            getApp().setUtmOptions(curOptions)


            // 改为发团状态
            var isShareForDetail = this.data.isShareForDetail
            isShareForDetail.icon = '',
              isShareForDetail.name = '',
              isShareForDetail.payTokenTime = '',
              isShareForDetail.bigorderCode = ''
            this.setData({
              isShareForDetail,
              ischimaBounces: false
            })
            clearInterval(this.data.timer)
        })
      }
    }
  },
  // 右侧按钮
  rightOnClick: function (e) {
    if (e.currentTarget.dataset.type == 'home') {
      wx.switchTab({
        url: '/pages/index/index'
      })
    }
  },
  //回到首页
  gotoIndex: function (e) {
    wx.switchTab({
      url: '/pages/index/index'
    })

  },
  onClick: function (e) {
    if (!wx.getStorageSync(KEYSTORAGE.loginInfo)) {
      getApp().checkLogin()
      return;
    }
    let timestamp = new Date().getTime();
    if (this.data.bouncesData.pintuanDatas.endTime < timestamp || this.data.status_stop || this.data.isInself) {
      this.alterView(false)
      return;
    }
    switch (e.currentTarget.id) {
      case "chima":
        // 尺码弹框
        let bouncesData = this.data.bouncesData
        PTGetKucun(`${this.data.productCode}`).then(item => {
          bouncesData.kucuns = item
          bouncesData.totalKucun = 0
          bouncesData.sizes[this.data.defalutIndex].forEach(items => {
            console.log(`库存sku:${items.sku}`);
            if (bouncesData.kucuns[items.sku]) {
              bouncesData.totalKucun += bouncesData.kucuns[items.sku]
            }
            console.log(`库存:${JSON.stringify(bouncesData.kucuns[items.sku])}`);
          })
          bouncesData.buyNum = 1
          bouncesData.selectChima.index = 0
          bouncesData.selectChima.sku = ''
          bouncesData.selectChima.name = ''
          bouncesData.selectColor.index = this.data.defalutIndex
          bouncesData.selectColor.name = bouncesData.colors[this.data.defalutIndex]

          if (bouncesData.totalKucun <= 2) {
            if (this.data.isShareForDetail.icon == '') {
              this.alterView(false)
            }
            else {
              this.alterView(true)
            }
          }
          else {
            wx.removeStorageSync('isShare');
            let selectType = e.currentTarget.dataset.type
            let isShare = this.data.isShare
            if (selectType == 'center') {
              isShare.icon = ''
              isShare.name = ''
              isShare.paymentTime = 0
              isShare.bigorderCode = ''
            }
            else if (selectType == 'goPindan'){
              let canShow = e.currentTarget.dataset.canshow
              if (!canShow){

                  wx.showModal({
                    title: '提示', //提示的标题,
                    content: '活动已结束', //提示的内容,
                    showCancel: false, //是否显示取消按钮,
                    confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
                    confirmColor: '#3CC51F', //确定按钮的文字颜色,
                    success: res => {
                    }
                  });
                  return
              }

              selectType = 'canyu'
              let bigorderCode = e.currentTarget.dataset.detail
              wx.setStorageSync('isShare', {bigorderCode})
            }
            else {
              Object.assign(isShare, this.data.isShareForDetail)
              if (this.data.isShareForDetail.icon != '') {
                wx.setStorageSync('isShare', this.data.isShareForDetail) //从分享来
              }
            }
            this.setData({
              bouncesData,
              ischimaBounces: true,
              isShare,
              buyBttonFrom: selectType
            })
          }
        })
        break;
      case 'goBack':
        wx.navigateTo({
          url: '/pintuan/pintuanList/pintuanList'
        })
        break;
      default:
        break;
    }
  },
  alterView_noBack: function (str) {
    wx.showModal({
      title: '提示', //提示的标题,
      content: str, //提示的内容,
      showCancel: false, //是否显示取消按钮,
      confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#3CC51F', //确定按钮的文字颜色,
      success: res => {
        if (res.confirm) {
          var bouncesData = wx.getStorageSync('pyUpSelectData');
          wx.removeStorageSync('pyUpSelectData');
          this.setData({
            bouncesData
          })
        }
      }
    });
  },
  selectColor: function (e) {
    let index = parseInt(e.detail.index)
    let name = e.detail.name


    var bouncesData = this.data.bouncesData

    var tempTotalKucun = 0
    bouncesData.sizes[index].forEach(item => {
      if (bouncesData.kucuns[item.sku]) {
        tempTotalKucun += bouncesData.kucuns[item.sku]
      }
    })

    if (bouncesData.datas.color[index].status != 'InShelf' || tempTotalKucun < 2) {
      wx.setStorageSync('pyUpSelectData', e.detail.bouncesData)
      var str = '该商品已下架'
      if (tempTotalKucun < 2) {
        str = '活动已结束'
      }
      this.alterView_noBack(str)
    }
    bouncesData.totalKucun = tempTotalKucun
    bouncesData.defalutColor = index

    bouncesData.buyNum = 1
    bouncesData.selectColor.index = index
    bouncesData.selectColor.name = name

    bouncesData.selectChima.index = 0
    bouncesData.selectChima.name = ''
    bouncesData.selectChima.sku = ''
    this.setData({
      bouncesData
    })
  },
  chimaHidden: function (e) {
    this.setData({
      ischimaBounces: false
    })
  },
  chimaCallBack: function (e) {
    console.log(`选中的尺码参数是:${JSON.stringify(e.detail)}`)
    var ddJson = {
      color: this.data.bouncesData.datas.color[e.detail.selectColor.index],
      size: this.data.bouncesData.datas.color[e.detail.selectColor.index].sizes[e.detail.selectChima.index],
      goodsName: this.data.bouncesData.datas.goodsName,
      nums: e.detail.buyNum,
      goodsCode: this.data.bouncesData.datas.projectCode,
      goodsSku: e.detail.selectChima.sku,
      discount: this.data.bouncesData.datas.color[e.detail.selectColor.index].discount,
      onePrice: this.data.bouncesData.datas.color[e.detail.selectColor.index].price,
      allPrice: (this.data.bouncesData.datas.color[e.detail.selectColor.index].price * e.detail.buyNum)
    }
    if (e.detail.index == 0) {
      var arr = new Array();
      arr.push(ddJson);
      wx.setStorageSync('dingdanCon', arr);
      wx.setStorageSync('useMyCoupons', {});
      wx.setStorageSync('isJiajiagou', {});
      //单独购买
      wx.navigateTo({
        url: '/pages/orderSave/orderSave'
      });
    }
    else {
      ddJson.onePrice = this.data.bouncesData.pintuanDatas.pintuanPrice
      ddJson.allPrice = (this.data.bouncesData.pintuanDatas.pintuanPrice * ddJson.nums)
      ddJson.originalTotalPrice = (this.data.bouncesData.pintuanDatas.originalPrice * ddJson.nums)
      ddJson.imageUrl = this.data.bouncesData.thumImages[e.detail.selectColor.index]
      ddJson.colorName = e.detail.selectColor.name
      ddJson.personRequire = this.data.bouncesData.pintuanDatas.personRequire
      // ddJson.yipinNum = this.data.bouncesData.pintuanDatas.alreadySpellNumber

      wx.setStorageSync('detailData', ddJson)
      wx.navigateTo({
        url: '../pintuanBuy/pintuanBuy'
      });
    }
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
    var json = wx.getStorageSync('pintuanDetailPage');
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    /*json.utm_source = 'pintuan_share'
    json.utm_medium = 'pintuan_goodsdetailpage'
    json.utm_campaign = json.gsColorCode,*/
    json.share_by_shop = sharePams.shopCode || curOptions.shareByShop || '',
    json.share_by = sharePams.employeeId || curOptions.shareBy || '';
    // get utm options
    const utmOptions = wx.getStorageSync(KEYSTORAGE.utmOptions);
    if(utmOptions && utmOptions.length){
      utmOptions.forEach(item => {
        if(item.key && item.key.startsWith('utm')){
          json[item.key] = item.value;
        }
      })
    }
    let collectParam = Object.assign(json, { eventName: `拼团分享_${json.gsColorCode}` });
    getApp()._collectData2(collectParam)

    let path = `/pintuan/pintuanDetail/pintuanDetail${objToQuery(json)}`
    console.log(`分享地址:${path}`)
    return {
      title: '',
      path: path,
      imageUrl: '',
      success: function (e) {
        console.log(`分享成功`)
      },
      fail: function (e) {
        console.log(`分享失败`)
      }
    }
  },

  timeFormat: function (param) {//小于10的格式化函数
    return param < 10 ? '0' + param : param.toString();
  },
  countDown: function (e) {
    var payTimeBol = this.data.payTimeBol;
    var newTime = new Date().getTime();
    let obj = null;
    var oneDateTime = e;
    if (oneDateTime - newTime > 0) {
      payTimeBol = false;
      let time = (oneDateTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time / (60 * 60));
      // let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec)
      }
    } else {//活动已结束，全部设置为'00'
      payTimeBol = true;
      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00'
      }
      var timestamp = Date.parse(new Date());
      if (this.data.bouncesData.pintuanDatas.endTime < timestamp || this.data.status_stop || this.data.isInself) {
        // 弹框退到首页
        this.alterView(true)
      }
      else {
        wx.showModal({
          title: '提示', //提示的标题,
          content: '商品已过期', //提示的内容,
          showCancel: false, //是否显示取消按钮,
          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3CC51F', //确定按钮的文字颜色,
          success: res => {
            if (res.confirm) {
              // 改为发团状态
              var isShareForDetail = this.data.isShareForDetail
              isShareForDetail.icon = '',
                isShareForDetail.name = '',
                isShareForDetail.payTokenTime = '',
                isShareForDetail.bigorderCode = ''
              this.setData({
                isShareForDetail,
                ischimaBounces: false
              })

              wx.removeStorageSync('pintuanDetailPage_s');
              wx.removeStorageSync('pintuanDetailPage_nomal');
              wx.removeStorageSync('isShare');

              let a = wx.getStorageSync('pintuanDetailPage');

              /*let utmJson = {
                utm_source: 'pintuan_faqi',
                utm_medium: 'pintuan_goods_detail',
                utm_term: '',
                utm_campaign: a.gsColorCode
              }*/
              let collectParam = Object.assign(curOptions, { eventName: `打开拼团详情页_${a.gsColorCode}` });
              getApp()._collectData2(collectParam)
              wx.setStorageSync('pintuan-utm', curOptions)
              getApp().setUtmOptions(curOptions)
            }
          }
        });
      }
    }
    // console.log('剩余时间:',obj);
    this.setData({
      endTimeObj: obj,
      payTimeBol
    })
    if (payTimeBol) {
      clearInterval(this.data.timer)
    }
  },
  countDown_goPindan: function (e,index) {
    let goPindanDaojishi = this.data.goPindanDaojishi

    var newTime = new Date().getTime();
    let obj = null;
    var oneDateTime = e.time;
    if (oneDateTime - newTime > 0) {

      let time = (oneDateTime - newTime) / 1000;
      // 获取天、时、分、秒
      let day = parseInt(time / (60 * 60 * 24));
      let hou = parseInt(time / (60 * 60));
      // let hou = parseInt(time % (60 * 60 * 24) / 3600);
      let min = parseInt(time % (60 * 60 * 24) % 3600 / 60);
      let sec = parseInt(time % (60 * 60 * 24) % 3600 % 60);
      obj = {
        day: this.timeFormat(day),
        hou: this.timeFormat(hou),
        min: this.timeFormat(min),
        sec: this.timeFormat(sec),
        canShow : true
      }
    } else {//活动已结束，全部设置为'00'
      clearInterval(e.timer)
      e.timer = ''

      obj = {
        day: '00',
        hou: '00',
        min: '00',
        sec: '00',
        canShow : false
      }
    }
    e.obj = obj
    goPindanDaojishi[index] = e

    this.setData({goPindanDaojishi})

    // 倒计时0也显示出来

    // if (!obj.canShow){
    //   // 是否全部都是0
    //   let isNo = false
    //   // 清除倒计时 重新获取拼单数据
    //   goPindanDaojishi.forEach(item => {
    //     if (item.timer != ''){
    //       clearInterval(item.timer)
    //       item.timer = ''
    //     }
    //     if (item.obj.canShow){
    //       isNo = true
    //     }
    //   })
    //   this.setData({goPindanDaojishi})

    //   if (isNo){
    //     this.getPindanDatas()
    //   }
    //   else{
    //     this.setData({goPindanArrs : []})
    //   }
    // }

  },
  // 活动结束弹框
  alterView: function (isShare) {
    wx.setStorageSync('reloadList','1')
    if (isShare) {
      // 活动结束,弹框
      this.setData({
        huodongjieshu: true
      })
    }
    else {
      var str = '活动已结束'
      if (this.data.isInself) {
        str = '商品已下架'
      }
      // endtime商品过期了
      wx.showModal({
        title: '提示', //提示的标题,
        content: str, //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#3CC51F', //确定按钮的文字颜色,
        success: res => {
          if (res.confirm) {
            wx.navigateBack({
              delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
            });
          }
        }
      });
    }
  }
})
