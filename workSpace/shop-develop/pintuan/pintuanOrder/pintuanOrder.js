// pintuan/pintuanOrder/pintuanOrder.js
import{getBrandBySku,yipinNumber,objToQuery} from "../../utils/utils"
import{PTGetFaceAndIcon,PTGetGoodsDetailPinTuan,PTGetPicGen} from '../netWork/pintuanRquest.js'
import {EVENTS,KEYSTORAGE} from '../../src/const'
import events from "../../src/events";
// 记录团主支付时间
var paymentTimeForPZ = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 参团人数
    personRequire : 0,
    // 剩余多少名额
    shengyuNum : 0,
    // 判断是否是iphoneX
    isIphoneX: getApp().globalData.isIPhoneX,
    timer : '',
    endTimeObj : {
      day: '00',
      hou: '00',
      min: '00',
      sec: '00'
    },
    // 地址
    address : {
      province : '',
      city : '',
      area : '',
      detailAddress : '',
      contactTel : '',
      consignee : ''
    },
    // 下单时间
    xiadanTime: '',
    faceAndIcon : {
      face : '',
      icon : '',
      otherIcon : []
    },

    // 详情数据
    detailData:{},
    // 商品信息
    shopData : {},
    // 是否显示支付成功分享弹框
    fromBuyView : false,
    // 显示取消订单弹框
    canceButton : false,
    // 是否显示分享图片弹框
    shareView : false,
    // 判断直接分享还是分享图片
    isShareImage : false,
    // 保存图片的临时路径
    pintuanFilePath : '',
    // 已拼件数
    yipinNum : '0',
    huodongjieshu:false, //活动结束弹框
    // 分享数据
    eveShareDatas:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    paymentTimeForPZ = 0
    wx.hideShareMenu({
      success: (result)=>{

      },
      fail: ()=>{},
      complete: ()=>{}
    });

    events.register(this, EVENTS.EVENT_LOGINED);


    if (wx.getStorageSync(KEYSTORAGE.loginInfo)){
      this.requstData()
    }
  },
  requstData:function(){
    let djson = wx.getStorageSync('orderData');
    console.log(`参数:${JSON.stringify(djson)}`)
    wx.showLoading({
      title: 'Loading...', //提示的内容,
      mask: true, //显示透明蒙层，防止触摸穿透,
      success: res => {}
    });
    setTimeout(() => {
      wx.hideLoading();


      // 获取团所有参与人
      PTGetFaceAndIcon(djson.bigorderCode).then(e=>{
        if (e){
          var openID = wx.getStorageSync('wxOpenID');
          var shengyuNum = this.data.shengyuNum
          shengyuNum = 0
          var faceAndIcon = this.data.faceAndIcon
          faceAndIcon.otherIcon=['']


          let personRequire = this.data.personRequire
          e.forEach(item=>{
            shengyuNum += 1
            if (item.pintuanOrderType == '0'){
              faceAndIcon.face = item.customerNickname
              faceAndIcon.icon = item.customerFaceImg
              // 记录支付时间
              paymentTimeForPZ = new Date(item.paymentTime.replace(/-/g,'/')).getTime()
              personRequire = item.personRequire
            }
            else{
              if (personRequire > faceAndIcon.otherIcon.length){
                faceAndIcon.otherIcon.push(item.customerFaceImg)
              }
            }

            if (item.openId == openID){
              // 订单信息
              let address = this.data.address
              let xiadanTime = this.data.xiadanTime

              xiadanTime = item.paymentTime

              item.goodsOrderList[0].gscolPicPath = `${getApp().config.cdn}${item.goodsOrderList[0].gscolPicPath}`
              address.province = item.province
              address.city = item.city
              address.area = item.area
              address.detailAddress = item.detailAddress
              address.consignee = item.consignee
              address.contactTel = item.contactTel
              this.setData({
                detailData :item,
                address,
                shopData : item.goodsOrderList[0],
                xiadanTime,
                personRequire
              })
              //订单信息
            }

          })
          shengyuNum = personRequire - shengyuNum
          shengyuNum = shengyuNum <= 0 ? 0 : shengyuNum
          this.setData({
            faceAndIcon,shengyuNum
          })
          if (faceAndIcon.icon != ''){

            setTimeout(() => {
              this.setData({
                fromBuyView : true
              })
            }, 1000);

          }
        }


          // 获取商品详情数据
          let goodsCode = this.data.shopData.gcsSku.substring(0,9)
          PTGetGoodsDetailPinTuan(goodsCode).then(res=>{
            let item = res[this.data.shopData.gcsSku.substring(0,12)]
            // console.log(`商品详情数据:${JSON.stringify(item)}`)

            this.setData({
              yipinNum : yipinNumber(item.startTime)
            })

            var a = item.endTime
            if(paymentTimeForPZ == '' || paymentTimeForPZ == null){
              a = new Date().getTime() + (24 * 60 * 60 * 1000)
            }
            else{
              if (paymentTimeForPZ + (24 * 60 * 60 * 1000) < item.endTime){
                a = paymentTimeForPZ + (24 * 60 * 60 * 1000)
              }
            }
            let that = this;
            let timer = setInterval(() => {
              that.countDown(a);
            }, 1000);
            if(this.data.timer == ''){
              this.setData({
                timer : timer
              })
            }

          })
        })



    }, 2000);
  },
  // 跳转地址页面
  gotoAddress:function(e){
    wx.navigateTo({
      url: '/pages/address/address?dingdan=200'
    });
  },
  // 隐藏弹框
  hiddenBounces:function(){
    this.setData({
      fromBuyView : false,
      canceButton : false
    })
  },
  // 邀请好友
  onShare:function(){
    this.hiddenBounces()

    if (this.data.faceAndIcon.icon != ''){

      this.setData({
        fromBuyView : true
      })

    }
    else{

      let djson = wx.getStorageSync('orderData');
      // 获取团所有参与人
      PTGetFaceAndIcon(djson.bigorderCode).then(e=>{
        if (e){
          if (e.length <= 0){
            wx.showModal({
              title: '提示',
              content: '网络繁忙,请稍后再试',
              showCancel: false,
              confirmText: '确定',
              confirmColor: '#3CC51F',
              success: (result) => {
                if(result.confirm){

                }
              },
              fail: ()=>{},
              complete: ()=>{}
            });
            return
          }
          var shengyuNum = this.data.shengyuNum
          shengyuNum = 0
          var faceAndIcon = this.data.faceAndIcon
          faceAndIcon.otherIcon=['']

          e.forEach(item=>{
            shengyuNum += 1
            if (item.pintuanOrderType == 0){
              faceAndIcon.face = item.customerNickname
              faceAndIcon.icon = item.customerFaceImg
              // 记录支付时间
              paymentTimeForPZ = new Date(item.paymentTime.replace(/-/g,'/')).getTime()
            }
            else{
              if (this.data.personRequire > faceAndIcon.otherIcon.length){
                faceAndIcon.otherIcon.push(item.customerFaceImg)
              }
            }
          })
          shengyuNum = this.data.personRequire - shengyuNum
          shengyuNum = shengyuNum <= 0 ? 0 : shengyuNum
          this.setData({
            faceAndIcon,shengyuNum
          })
          if (faceAndIcon.icon != ''){

            this.setData({
              fromBuyView : true
            })

          }
        }
      })

    }

  },
  // 隐藏分享图片弹框
  shareViewHiddenBounces : function(){
    this.setData({
      shareView : false,
      isShareImage : false
    })
  },
  // 显示取消订单弹框
  canceButton:function(){
    this.setData({
      canceButton : true
    })
  },
  // 活动结束弹框
  huodongTap:function(e){
    wx.navigateBack({
      delta: 1 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 订阅的事件回调
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_LOGINED && event) {
      //用户登录成功
      if (JSON.stringify(this.data.detailData) == '{}'){
        this.requstData()
      }
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    setTimeout(() => {
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      }
    }, 1000);

    let addressJson = wx.getStorageSync('dingdanAddress');
    if (addressJson){
      var address = this.data.address
      address.consignee = addressJson.userName
      address.contactTel = addressJson.phone
      address.province = addressJson.province
      address.city = addressJson.city
      address.area = addressJson.area
      address.detailAddress = addressJson.detailAddress
      this.setData({
        address
      })
      wx.removeStorageSync('dingdanAddress');
    }
  },
  //回到首页
  gotoIndex : function(e){
    wx.switchTab({
      url: '/pages/index/index'
    })

  },
  //复制订单号
  copy: function (e) {
    let text = e.currentTarget.dataset.text;
    wx.setClipboardData({
      data: text,
      success:res=>{
        wx.showToast({
          title: '复制成功',
          icon: 'success',
        })
      }
    })
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
  // 分享图片
  shareImage : function(){
    console.log(`点击分享图片`)
    this.hiddenBounces()
    let sku = this.data.shopData.gcsSku.substring(0,12)
    let price = this.data.shopData.price
    let originalPrice = this.data.shopData.originalPrice
    let personNumber  = this.data.personRequire
    let goodsName = this.data.shopData.goodsName
    let icon = this.data.faceAndIcon.icon
    let places = `${this.data.shengyuNum}`
    let endTime = `${this.data.endTimeObj.hou}:${this.data.endTimeObj.min}:${this.data.endTimeObj.sec}`
    let brand = getBrandBySku(sku)


    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo);
    let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
    let shareJson = {
      productCode : sku.substring(0,9),
      gsColorCode : sku,
      isShare : 'share',
      icon,
      name : this.data.faceAndIcon.face,
      paymentTime : paymentTimeForPZ || new Date().getTime(),
      bigorderCode : this.data.detailData.bigorderCode,

      share_by : sharePams.employeeId || shareFrom.shareBy || shareFrom.share_by || '',
      share_by_shop : sharePams.shopCode || shareFrom.shareByShop || shareFrom.share_by_shop || '',

      /*utm_source : 'pintuan_share',
      utm_medium : 'pintuan_pic',
      utm_term : this.data.detailData.bigorderCode,
      utm_campaign : sku*/
    }
    Object.assign(shareJson, getApp().getUtmOptions())
    let detailPintuanData = wx.getStorageSync('detailData');
    if (detailPintuanData.pintuanOrderType == '1'){
      // 参团的话分享拼主的数据
      let faqiArrs = wx.getStorageSync("pinzhuShareArrs");
      let faqiJson = ''

      faqiArrs.forEach(item => {
        if (this.data.detailData.bigorderCode == item.dingdanID){
          faqiJson = item
        }
      });
      shareJson.productCode = faqiJson.productCode
      shareJson.gsColorCode = faqiJson.gsColorCode
      shareJson.paymentTime = faqiJson.paymentTime
      shareJson.bigorderCode = faqiJson.bigorderCode

      shareJson.share_by = faqiJson.share_by
      shareJson.share_by_shop = faqiJson.share_by_shop

      shareJson.utm_term = faqiJson.bigorderCode
      shareJson.utm_campaign = faqiJson.gsColorCode
    }

    this.setData({
      eveShareDatas : shareJson
    })
    let qrCode = `${getApp().config.pintuanUrl}${objToQuery(shareJson)}`.replace(/\?/g,'') // 二维码内容用于生成二维码
    let buyNum = this.data.yipinNum

    //测试url:
    // let qrCode = 'https://ext.bestseller.com.cn/productCode=21735O504&gsColorCode=21735O504E12&isShare=share&icon=https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL6X84bWfXDEDbqDBAhqdzaSSwMG9YnQjHeySC6UZLoAkibrblNjiasqJId5wGO3fL6VXCRibgU9ibOqw/132&name=づ余生、&paymentTime=1553240524073&bigorderCode=11820190322154157043'
    console.log(`分享地址:${qrCode}`)
    let faceAndIcon = this.data.faceAndIcon

    let iconArrs = []
    iconArrs.push(faceAndIcon.icon)
    if (this.data.personRequire > 2){

      faceAndIcon.otherIcon.forEach(item => {
        iconArrs.push(item)
      })
    }
    let dJson = {
      sku,
      price,
      originalPrice,
      personNumber,
      goodsName,
      icon : iconArrs,
      places,
      endTime,
      brand,
      qrCode,
      buyNum
    }

    // 调合图接口
    // 授权
    wx.getSetting({ success: res => {

      if (!res.authSetting['scope.writePhotosAlbum']){
        wx.authorize({
          scope:
            'scope.writePhotosAlbum',
          success: res => {

            this.saveImage(dJson)

          },
          fail: () => {
            wx.showModal({
              title: '提示', //提示的标题,
              content: '需要授权相册权限才能保存', //提示的内容,
              showCancel: true, //是否显示取消按钮,
              cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
              cancelColor: '#000000', //取消按钮的文字颜色,
              confirmText: '设置', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
                if (res.confirm) {
                  wx.openSetting({ success: res => {
                    if (res.authSetting['scope.writePhotosAlbum']){

                      this.saveImage(dJson)

                    }
                  } });
                }
              }
            });
          }
        });
      }
      else{

        this.saveImage(dJson)

      }
    } });


  },
  saveImage:function(dJson){
    PTGetPicGen(dJson).then(item=>{

      if (item.image_url){

        // 获取图片信息
        wx.getImageInfo({
          src: `${getApp().config.cdn}${item.image_url}`, //图片的路径，可以是相对路径，临时文件路径，存储文件路径，网络图片路径,
          success: res => {
            let tempFilePath = res.path


            wx.saveImageToPhotosAlbum({
              filePath: res.path, //图片文件路径，可以是临时文件路径也可以是永久文件路径，不支持网络图片路径,
              success: res => {
                let shareJson = this.data.eveShareDatas
                let collectParam = Object.assign(shareJson, {eventName: `拼团生成二维码图片_${shareJson.gsColorCode}`});
                getApp()._collectData2(collectParam)

                this.setData({
                  shareView : true,
                  isShareImage : true,
                  pintuanFilePath : tempFilePath
                })

              }
            });
          },
          fail: () => {
            wx.showModal({
              title: '提示', //提示的标题,
              content: '图片保存失败', //提示的内容,
              showCancel: false, //是否显示取消按钮,
              confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
              }
            });
          }
        });

      }

    })

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    let isShareImage = this.data.isShareImage
    this.hiddenBounces()
    this.shareViewHiddenBounces()
    let gsColorCode = this.data.shopData.gcsSku.substring(0,12)
    let productCode = this.data.shopData.gcsSku.substring(0,9)

    // 21731T501,21731T501E17
    //https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTL6X84bWfXDEDbqDBAhqdzaSSwMG9YnQjHeySC6UZLoAkibrblNjiasqJId5wGO3fL6VXCRibgU9ibOqw/132
    //昵称、
    //23:23:31
    // "61820190127153123270"

    let icon = this.data.faceAndIcon.icon
    let name = this.data.faceAndIcon.face

    let bigorderCode = this.data.detailData.bigorderCode

    var imageUrl = this.data.shopData.gscolPicPath
    var utm_param = 'pintuan_message'
    var eveName = `转发给好友_${gsColorCode}`
    if (isShareImage){
      imageUrl = this.data.pintuanFilePath
      utm_param = 'pintuan_pic'
      eveName = ''
    }

    // 发团人的昵称+邀请您拼团 +商品名称前20个字
    let customTitle = `${name}邀请您拼团 ${this.data.shopData.goodsName}`
    let sharePams = wx.getStorageSync(KEYSTORAGE.guideInfo)
    let shareFrom = wx.getStorageSync('shareFromDaogouInfo');
    let shareJson = {
      productCode,
      gsColorCode,
      isShare : 'share',
      icon,
      name,
      paymentTime : paymentTimeForPZ || new Date().getTime(),
      bigorderCode,
      share_by : sharePams.employeeId || shareFrom.shareBy || shareFrom.share_by || '',
      share_by_shop : sharePams.shopCode || shareFrom.shareByShop || shareFrom.share_by_shop || '',

      /*utm_source : 'pintuan_share',
      utm_medium : utm_param,
      utm_term : bigorderCode,
      utm_campaign : gsColorCode*/
    }
    // 合并UTM参数
    Object.assign(shareJson, getApp().getUtmOptions())
    let detailPintuanData = wx.getStorageSync('detailData');
    if (detailPintuanData.pintuanOrderType == '1'){
      // 参团的话分享拼主的数据
      let faqiArrs = wx.getStorageSync("pinzhuShareArrs");
      let faqiJson = ''

      faqiArrs.forEach(item => {
        if (this.data.detailData.bigorderCode == item.dingdanID){
          faqiJson = item
        }
      });
      shareJson.productCode = faqiJson.productCode
      shareJson.gsColorCode = faqiJson.gsColorCode
      shareJson.paymentTime = faqiJson.paymentTime

      shareJson.bigorderCode = faqiJson.bigorderCode
      shareJson.share_by = faqiJson.share_by
      shareJson.share_by_shop = faqiJson.share_by_shop
      shareJson.dingdanID = faqiJson.dingdanID

      shareJson.utm_term = faqiJson.bigorderCode
      shareJson.utm_campaign = faqiJson.gsColorCode
    }

    if (eveName != ''){
      let collectParam = Object.assign(shareJson, {eventName: eveName});
      getApp()._collectData2(collectParam)
    }

    let path = `/pintuan/pintuanDetail/pintuanDetail${objToQuery(shareJson)}`
    console.log(`分享地址:${path}`)
    return{
      title: customTitle,
      path : path,
      imageUrl : imageUrl,
      success:function(e){
        console.log(`分享成功`)
      },
      fail:function(e){
        console.log(`分享失败`)
      }
    }
  },


  timeFormat : function(param){//小于10的格式化函数
    return param < 10 ? '0' + param : param.toString();
  },
  countDown : function(e){

    var payTimeBol = this.data.payTimeBol;
    var newTime = new Date().getTime();
    let obj = null;
    var oneDateTime = e;
    if (oneDateTime - newTime > 0){
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
      }else{//活动已结束，全部设置为'00'
      payTimeBol = true;
      obj = {
       day: '00',
       hou: '00',
       min: '00',
       sec: '00'
      }
    }
    // console.log('剩余时间:',obj);
    this.setData({
      endTimeObj : obj,
      payTimeBol,
      huodongjieshu : payTimeBol
    })
    if (payTimeBol){
      clearInterval(this.data.timer)
    }
  }
})
