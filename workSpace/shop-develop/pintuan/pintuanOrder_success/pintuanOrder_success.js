// pintuan/pintuanOrder_success/pintuanOrder_success.js
import{PTGetFaceAndIcon} from '../netWork/pintuanRquest.js'
import {KEYSTORAGE,EVENTS} from "../../src/const";

import events from "../../src/events";
import { wxSubscription } from '../../utils/wxSubscribe';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 几人团
    personRequire : 0,
    // 判断是否是iphoneX
    isIphoneX: getApp().globalData.isIPhoneX,
    // 地址
    address : {
      province : '',
      city : '',
      area : '',
      detailAddress : '',
      contactTel : '',
      consignee : ''
    },
    // 拼主
    faceAndIcon : {
      face : '',
      icon : ''
    },
    // 参与者
    otherFaceAndIcon : {
      face : [],
      icon : []
    },
    // 如果拼团成功，并且团所有参与人只有1个的话，不显示头像框
    canShowFace : true,

    bol : false, //控制7天无理由退货按钮

    // 详情数据
    detailData:{},
    // 商品信息
    shopData : {},

    // 退货需要的
    toTuiJson:{
      orderToken : '',
      bigorderCode : ''
    },
    // 请求参数
    requestBigorderCode : '',
    requsetPintuanOrderType : ''
  },
  //七天无理由退货
  sevenReturnPrd() {
    
    if(!wx.getStorageSync('wxSubscriptions').isRefund){
      wxSubscription("refund").then(res => {
	      this.nextTap()
      }).catch(err => {
      	this.nextTap()
      });
    }else{
	    this.nextTap()
    }



  },
  nextTap(){

    wx.setStorageSync('allToDingdan',this.data.toTuiJson)
    wx.setStorageSync('isPintuan',true)
    wx.navigateTo({
      url: '/pages/dingdanToTui/dingdanToTui'
    });

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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let requestBigorderCode = this.data.requestBigorderCode
    let requsetPintuanOrderType = this.data.requsetPintuanOrderType
    
    if (options.bigorderCode){
      requestBigorderCode = options.bigorderCode
      requsetPintuanOrderType = options.pintuanOrderType
    }
    else{

      let djson = wx.getStorageSync('orderData');
      let detailJson = wx.getStorageSync('detailData')

      requestBigorderCode = djson.bigorderCode
      requsetPintuanOrderType = detailJson.pintuanOrderType
    }
    
    this.setData({
      requestBigorderCode,
      requsetPintuanOrderType
    })

    events.register(this, EVENTS.EVENT_LOGINED);


    if (wx.getStorageSync(KEYSTORAGE.loginInfo)){
      this.requstData()
    }
  },
  requstData:function(){
  // console.log(`参数:${JSON.stringify(djson)}`)

  var toTuiJson = this.data.toTuiJson
  wx.showLoading({
    title: 'Loading...', //提示的内容,
    mask: true, //显示透明蒙层，防止触摸穿透,
    success: res => {}
  });
  setTimeout(() => {
    wx.hideLoading();
    


      // 获取团所有参与人
      PTGetFaceAndIcon(this.data.requestBigorderCode).then(e=>{
        if (e){
          var openID = wx.getStorageSync('wxOpenID');
          var faceAndIcon = this.data.faceAndIcon
          var otherFaceAndIcon = this.data.otherFaceAndIcon
          let personRequire = this.data.personRequire

          var tempIndex = 0
          e.forEach(item=>{
            if (item.pintuanOrderType == 0){
              faceAndIcon.face = item.customerNickname
              faceAndIcon.icon = item.customerFaceImg

              personRequire = item.personRequire
            }
            else{
                otherFaceAndIcon.face.push(item.customerNickname)
                otherFaceAndIcon.icon.push(item.customerFaceImg)

            }

            if (parseInt(personRequire) - 1 <= otherFaceAndIcon.face.length){
              otherFaceAndIcon.face.slice(0,parseInt(personRequire) - 1)  //2人团减去拼主
              otherFaceAndIcon.icon.slice(0,parseInt(personRequire) - 1)
            }

            if (item.isPintuan == 'pintuan'){
              tempIndex++
            }


            if (item.openId == openID){
              // 订单信息

              toTuiJson.orderToken = item.orderToken
              toTuiJson.bigorderCode = item.bigorderCode

              let hasNotRefund=false;
              item.goodsOrderList.forEach((items) =>{
                if (items.refundCount != 1) {
                  hasNotRefund = true;
                }
              })

              var bol = this.data.bol
              if (hasNotRefund && item.canRefund == 'Y') {
                bol = true;
              }

              var address = this.data.address

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
                bol,
                personRequire,
                toTuiJson
              })
              //订单信息
            }

          })

          if (this.data.requsetPintuanOrderType == '1' && personRequire == 2){
            otherFaceAndIcon.face = []
            otherFaceAndIcon.icon = []

            var wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
            otherFaceAndIcon.face.push(wxInfo.nickName)
            otherFaceAndIcon.icon.push(wxInfo.avatarUrl)
            if (wxInfo.nickName == '' || wxInfo.avatarUrl == ''){
              otherFaceAndIcon.face = []
              otherFaceAndIcon.icon = []
              var that = this
              wx.getUserInfo({
                success: (res) => {
                  if(res.errMsg === 'getUserInfo:ok'){
                    Object.assign(wxInfo, res.userInfo);
                    wx.setStorageSync(KEYSTORAGE.wxInfo, wxInfo)
                    otherFaceAndIcon.face.push(wxInfo.nickName)
                    otherFaceAndIcon.icon.push(wxInfo.avatarUrl)
        
                    that.setData({
                      otherFaceAndIcon
                    })
                  }
                }
              })
            }

          }
          this.setData({
            faceAndIcon,
            otherFaceAndIcon
          })

          console.log(`数量---:${tempIndex}`)
          if (tempIndex < personRequire){
            this.setData({canShowFace : false})
          }
        }
      })
    


  }, 2000);
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
      else{
        
        var timer = setInterval(() => {
          if (!this.data.otherFaceAndIcon.icon){
            this.requstData()
          }
          else{
            clearInterval(timer)
          }
        }, 5000);
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

  }
})