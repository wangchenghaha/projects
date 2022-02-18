// yifenqian/aPennyActivity/aPennyActivity.js

// https://m.veromoda.com.cn/api/coupon/orderCouponList?phone=17810651817
import {
  splitImg
} from '../../utils/utils'
import {orderCancel} from '../../service/order'
import {wxShowToast} from '../../utils/wxMethods'
import{
  getActionID,
  getJson,
  getAddress,
  getOrderCoupon,
  orderSave,
  checkCoupon
} from '../netWork/request'
import {KEYSTORAGE,EVENTS} from "../../src/const";
import events from "../../src/events";
import{
  aPennyModel
} from '../requestModel'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionID : '',
    promid : '',
    dataDic : {},
    // 地址
    address : {
      province : '',
      city : '',
      area : '',
      detailAddress : '',
      contactTel : '',
      consignee : ''
    },
    // 数据请求成功后 展示页面
    canShowPage : false,
    // 滚动位置
    scroTop : 't0',
    // 横竖拍切换(left:横排)
    switchBtn : 'left',
    // 图片高度
    swiperImageHeight : 0,
    // slider值
    sliderValue: 1,
    // 说明文字
    useDire:[],
    // 商品json数据
    jsonDatas : [],
    // 库存数据封装
    kucunArrs : [],
    // 判断库存是否为空，为空的话不能点击
    isEmpy : [],
    //选中的下标
    currentSelectIndex : -1,
    // 尺码弹框
    isBounces : false,

    // 点确定的下标,提交时判断该值>=0才可以提交
    subMitIndex : -1,
    // 判断是否生成订单
    isSaveOrder : false,
    // 保存订单成功后参数
    saveOrderParams : {},
    // 当前活动已过期或者未开启或者名下没有对应的券,界面点击按钮弹框
    actionStatusStr : '',
    ticketNo : ''
  },
  // 使用说明
  shuoming : function(){
    this.setData({scroTop : 'shuoming'})
  },
  // 横竖切换
  switch : function (params) {
    var switchBtn = this.data.switchBtn;
    switchBtn = switchBtn == 'left' ? 'right' : 'left';
    this.setData({switchBtn})
  },
  // swiper滑动事件
  swiperChange : function(e){
    this.setData({sliderValue : e.detail.current + 1})
  },
  // 获取图片高度
  getImageHeight : function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth;
    var imgh=e.detail.height;
    var imgw=e.detail.width;
    var swiperH=winWid*imgh/imgw;

    this.setData({swiperImageHeight : swiperH});
  },
  // 左右按钮事件
  leftAndRightBtnTap:function(e){
    const type = e.currentTarget.dataset.type
    const jsonDatas = this.data.jsonDatas
    let sliderValue = this.data.sliderValue

    if (type == 'left'){
      if (sliderValue == 1){
        sliderValue = jsonDatas.length
      }
      else{
        sliderValue -= 1
      }
    }
    else{
      if (sliderValue == jsonDatas.length){
        sliderValue = 1
      }
      else{
        sliderValue += 1
      }
    }
    this.setData({sliderValue})
    // console.log(`aaaaaaa:${JSON.stringify(e)}`);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var actionID = this.data.actionID

    if (options.q) {
      var scan_url = decodeURIComponent(options.q);

      scan_url = scan_url.replace(/http:\/\/one.veromoda.com.cn\//g,'')

      scan_url = scan_url.split('&')

      scan_url.forEach(items => {

        let b = items.split('=')
        switch (b[0]) {
          case 'actionID':
          actionID = b[1]
            break;
          default:
            break;
        }
      });

      }
      else{
        actionID = options.actionID
      }
    actionID = '333244153511018497'

    let utm_source = options.utm_source ? options.utm_source : ''
    let utm_medium = options.utm_medium ? options.utm_medium : ''
    let utm_term = options.utm_term ? options.utm_term : ''
    let utm_campaign = options.utm_campaign ? options.utm_campaign : ''
    
    let utmJson = {
      utm_source,
      utm_medium,
      utm_term,
      utm_campaign
    }

    getApp()._collectData2(utmJson)
    wx.setStorageSync('aPenny-utm',utmJson)


    // 删除下还原状态值
    wx.removeStorageSync('aPennyReplace');



    events.register(this, EVENTS.EVENT_LOGINED);
    events.register(this, EVENTS.EVENT_CRMINFO);

    this.setData({
      actionID
    })
    if (wx.getStorageSync(KEYSTORAGE.loginInfo)){
      this.getActionData(actionID)
    }

  },
  getActionData : function (id){
    var useDire = this.data.useDire
    getActionID(id).then(res=>{
      
      var arrs = []
      arrs = res.detailContent.split(',')
      console.log(`结果:${arrs}`)
      arrs.forEach(item=>{
        var json = {}
        var jsonStr = item
        if (jsonStr.indexOf('[') != -1){
          jsonStr = jsonStr.replace(/\[/g,"")
        }
        else if (jsonStr.indexOf(']' != -1)){
          jsonStr = jsonStr.replace(/\]/g,"")
        }
        json = JSON.parse(jsonStr)
        useDire.push(json)
      })
      // console.log(`结果asddsa:${JSON.stringify(useDire)}`)
      this.setData({useDire})


      

      let endTime = new Date(res.endTime.replace(/-/g,'/')).getTime()
      let starTime = new Date(res.starTime.replace(/-/g,'/')).getTime()
      let currentTime = new Date().getTime()

      var str = ''
      if (res.status == 0 || starTime > currentTime){
        str = '活动未开启'
      }
      else if(endTime < currentTime){
        str = '活动已结束'
      }
      else{
        this.setData({
          dataDic : res,
          promid : res.promotionid,
          canShowPage : true
        })
        this.getJsonDatas(res.activityScopeGoodsList)

        if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
          getApp().getCRMInfoFn();
        }
      }

      if (str != ''){
        this.setData({
          actionStatusStr : str
        })
        wx.showModal({
          title: '提示', //提示的标题,
          content: str, //提示的内容,
          showCancel: false, //是否显示取消按钮,

          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3CC51F', //确定按钮的文字颜色,
          success: res => {
          }
        });
      }
    })
    this._getAddress()
  },
  // 获取商品json数据
  getJsonDatas : function(arrs){
    var jsonDatas = this.data.jsonDatas
    var isEmpy = []
    arrs.forEach(item=>{

      if (item.untitled2 && parseInt(item.untitled2) >= 0){
        isEmpy.push(parseInt(item.untitled2))
      }
      else{
        isEmpy.push(0)
      }

       getJson(item.signSku.substring(0,9)).then(res=>{
         res.colorDefault = 0
         res.sizeDefault = -1
         res.color.forEach(item=>{
           let sku9 = item.colorCode.substring(0,9)
           item.image = `${getApp().config.cdn}/goodsImagePC/${getApp().config.brand}/${sku9}/${item.colorCode}/750750/${item.colorCode}_T01.jpg`
         })

        jsonDatas.push(res)
        this.setData({
          jsonDatas,
          isEmpy : isEmpy
        })
        // console.log(`aaa:${JSON.stringify(res)}`)
       })
    })
  },
  // 获取地址
  _getAddress:function(){
        var address = this.data.address
        getAddress().then(item=>{
          if (item.length > 0){
            // console.log(`地址:${JSON.stringify(item)}`)
            var defulatIndex = 0
            item.forEach((e,index)=>{
              if (e.defaultAddress == 'Y'){
                defulatIndex = index
              }
            })
      
            address.consignee = item[defulatIndex].userName
            address.contactTel = item[defulatIndex].phone
            address.province = item[defulatIndex].province
            address.city = item[defulatIndex].city
            address.area = item[defulatIndex].area
            address.detailAddress = item[defulatIndex].detailAddress
            this.setData({
              address
            })
          }
        })
  },
  onClick : function(e){
    if (!this.getActionStatue()){
      return
    }
    var kucunDic = {}
    var kucunArrs = []

    let colors = this.data.jsonDatas[e.currentTarget.id].color  //数组
      colors.forEach(item=>{
        var arrs = []
        var nums = 0
        item.sizes.forEach(items=>{
          var tempNum = 0
          this.data.dataDic.activityScopeGoodsList.forEach(a=>{
            if (a.signSku == items.sku){
              if (a.untitled2 && parseInt(a.untitled2) >= 0){
                tempNum = parseInt(a.untitled2)
              }
            }
          })
          var dic = {
            size : items.sizeAlias,
            sku : items.sku,
            num : tempNum
          }
          arrs.push(dic)
          nums += tempNum
        })

        kucunDic[item.colorCode] = {
          num : nums,
          data : arrs
        }
        kucunArrs.push(kucunDic)
      })
      console.log(`库存封装:${JSON.stringify(kucunArrs)}`);

      this.setData({
        isBounces : true,
        kucunArrs : kucunArrs,
        currentSelectIndex : e.currentTarget.id
      })
  },
  bounceSubmit:function(){
    var jsonDatas = this.data.jsonDatas
    var subMitIndex = this.data.subMitIndex
    subMitIndex = this.data.currentSelectIndex

    jsonDatas.forEach((item,index)=>{
      if (subMitIndex != index){
        item.colorDefault = 0
        item.sizeDefault = -1
      }
    })
    this.setData({
      isBounces : false,
      subMitIndex,
      jsonDatas
    })
  },
  bouncesHidden:function(e){
    var jsonDatas = this.data.jsonDatas
    if (this.data.subMitIndex != this.data.currentSelectIndex){
      jsonDatas[this.data.currentSelectIndex].colorDefault = 0
      jsonDatas[this.data.currentSelectIndex].sizeDefault = -1
    }


    this.setData({
      isBounces : false,
      jsonDatas
    })
  },
  selectChima:function(e){
    let index = e.detail
    var jsonDatas = this.data.jsonDatas
    jsonDatas[this.data.currentSelectIndex].sizeDefault = index

    this.setData({
      jsonDatas
    })
  },
  selectColor:function(e){
    // console.log(`点击的颜色:${JSON.stringify(e.detail)}`)
    let index = e.detail
    var jsonDatas = this.data.jsonDatas
    jsonDatas[this.data.currentSelectIndex].colorDefault = index
    jsonDatas[this.data.currentSelectIndex].sizeDefault = -1

    this.setData({
      jsonDatas
    })
  },
  // 跳转地址页面
  gotoAddress:function(e){
    if (!this.getActionStatue()){
      return
    }
    wx.navigateTo({
      url: '/pages/address/address?dingdan=200'
    });
  },
  subMitTap_gif : function(e){
    // 订单详情页

      wx.setStorageSync('isTuihuo', false);
      wx.navigateTo({
        url: '/pages/dingdanToPay/dingdanToPay'
      });
  },
  // 生成订单后 直接调用支付页面
  subMitTap_repeat : function (){
    let sku_15 = this.data.jsonDatas[this.data.subMitIndex].color[this.data.jsonDatas[this.data.subMitIndex].colorDefault].sizes[this.data.jsonDatas[this.data.subMitIndex].sizeDefault].sku
    let sku_12 = sku_15.substring(0,12)
    let saveRes = this.data.saveOrderParams

    let querystring = `id=${saveRes.bigOrderId}&bigOrderCode=${saveRes.bigOrderCode}&orderToken=${saveRes.orderToken}&payToken=${saveRes.payToken}&payTokenTime=${saveRes.payTokenTime}&amountPaid=${saveRes.order.amountPaid}&sku=${sku_12}`;
    wx.navigateTo({
      url: '/pages/wxPay/wxPay?' + querystring
    });
  },
  // 取消订单
  cancelOrder : function (params) {
    wx.showModal({
      title: '提示', //提示的标题,
      content: '确定取消该订单吗？', //提示的内容,
      showCancel: true, //是否显示取消按钮,
      cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
      cancelColor: '#000000', //取消按钮的文字颜色,
      confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#3CC51F', //确定按钮的文字颜色,
      success: res => {
        if (res.confirm) {

          let json = wx.getStorageSync('allToDingdan');
          let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
	        let querystring = {
		        bigOrderId: Number(json.id),
		        orderToken: json.orderToken,
		        payIntegral: '',
		        phone: userInfo.phone
	        };
	        orderCancel(querystring).then(res =>{
            wxShowToast('取消成功');
            this.replaceData()
	        }).catch(err => wxShowToast(err.message))
          
        } 
      }
    });
  },
  subMitTap:function(e){
    if (!this.getActionStatue()){
      return
    }
    var str = ''
    if (this.data.address.contactTel == ''){
      str = '请添加收货地址'
    }
    else if (this.data.subMitIndex == -1){
      str = '未选中商品'
    }
    if (str != ''){
      wx.showModal({
        title: '提示', //提示的标题,
        content: str, //提示的内容,
        showCancel: false, //是否显示取消按钮,

        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#3CC51F', //确定按钮的文字颜色,
        success: res => {
        }
      });
    }
    else{
      // 重新获取库存信息
      getActionID(this.data.actionID).then(item=>{
        var isEmpy = []
        item.activityScopeGoodsList.forEach(a=>{
          if (a.untitled2 && parseInt(a.untitled2) >= 0){
            isEmpy.push(parseInt(a.untitled2))
          }
          else{
            isEmpy.push(0)
          }
        })
        
        // 更新
        this.setData({
          dataDic : item,
          promid : item.promotionid,
          isEmpy : isEmpy
        })
        
        if (isEmpy[this.data.subMitIndex] > 0){
          this.getDDList().then(ruleId => {
            let jsonCoupon = {
              ruleId : ruleId,
              ticketNo : this.data.ticketNo
            }

            let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
            let jsonData = this.data.jsonDatas[this.data.subMitIndex]
            jsonData['activitySkuId'] = this.data.actionID
  
            let requestData = aPennyModel(jsonData,jsonCoupon,this.data.address,userInfo.phone)
            this.saveOrder(requestData)
          }).catch(err => {

          })


        }
        else{
          wx.showModal({
            title: '提示',
            content: '该商品无货',
            showCancel: false,
            confirmText: '确定',
            confirmColor: '#3CC51F',
            success: (result) => {
              this.replaceData()
            }
          });
            
        }


      })
    }
  },
  // 保存订单
  saveOrder : function(requstData){
    let sku_15 = this.data.jsonDatas[this.data.subMitIndex].color[this.data.jsonDatas[this.data.subMitIndex].colorDefault].sizes[this.data.jsonDatas[this.data.subMitIndex].sizeDefault].sku
    let sku_12 = sku_15.substring(0,12)
    
    orderSave(requstData).then(saveRes=>{
      
      console.log(`保存订单结果:${JSON.stringify(saveRes)}`) 
      // 跳转页面支付
      this.setData({
        isSaveOrder : true,
        saveOrderParams : saveRes
      })
      let dingdan = {
        orderToken : saveRes.orderToken,
        id : saveRes.bigOrderId
      }
      wx.setStorageSync('allToDingdan', dingdan);

      let querystring = `id=${saveRes.bigOrderId}&bigOrderCode=${saveRes.bigOrderCode}&orderToken=${saveRes.orderToken}&payToken=${saveRes.payToken}&payTokenTime=${saveRes.payTokenTime}&amountPaid=${saveRes.order.amountPaid}&sku=${sku_12}`;
      wx.navigateTo({
        url: '/pages/wxPay/wxPay?' + querystring
      });
    })
  },
// 订单对应优惠券列表
getDDList : function(){
  return new Promise((resolve,reject) => {
    
    let sku_15 = this.data.jsonDatas[this.data.subMitIndex].color[this.data.jsonDatas[this.data.subMitIndex].colorDefault].sizes[this.data.jsonDatas[this.data.subMitIndex].sizeDefault].sku
    let sku_12 = sku_15.substring(0,12)
    let json = {
      quantity : '1',
      sku : sku_12
    }
    let datas = []
    datas.push(json)
    getOrderCoupon(datas).then(item=>{
      // console.log(`处理结果:${JSON.stringify(item)}`)
      var arrs = []
      item.forEach(res=>{
        if (this.data.promid == res.couponNumber){

          let start = res.startTime
          let end = res.endTime
          let currentTime = new Date().getTime()
          if (currentTime > start && currentTime < end && res.validbyCoupon == 'Y'){
            arrs.push(res)
          }

        }
      })
      if (arrs.length <= 0){
        this.setData({actionStatusStr : '暂无该活动对应券'})
        wx.showModal({
          title: '提示', //提示的标题,
          content: '暂无该活动对应券', //提示的内容,
          showCancel: false, //是否显示取消按钮,

          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3CC51F', //确定按钮的文字颜色,
          success: res => {
          }
        });
        reject()
      }
      resolve(arrs[0].id)
    })
  })
},
  // 手机号下的优惠券列表
getPhoneList : function(){
  return new Promise((resolve,reject) => {

    let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo)
    let json = {
      phone : userInfo.phone,
      returnListFlag : '0'
    }
    checkCoupon(json).then(item=>{
  
      var ticketNoArrs = []
      item.forEach(res=>{
        if (this.data.promid == res.promotioncode){
          let start = new Date(res.startdate.replace(/-/g,'/')).getTime()
          let end = new Date(res.enddate.replace(/-/g,'/')).getTime()
          let currentTime = new Date().getTime()
          if (currentTime > start && currentTime < end){
            ticketNoArrs.push(res)
          }
        }
      })
      if (ticketNoArrs.length <= 0){
        this.setData({actionStatusStr : '暂无该活动对应券'})
        wx.showModal({
          title: '提示', //提示的标题,
          content: '暂无该活动对应券', //提示的内容,
          showCancel: false, //是否显示取消按钮,
  
          confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3CC51F', //确定按钮的文字颜色,
          success: res => {
          }
        });
        reject()
      }
      else{
        resolve(ticketNoArrs[0].voucherno)
      }
    })
  })
    
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
   if (JSON.stringify(this.data.dataDic) == '{}'){
      this.getActionData(this.data.actionID)
  }
 }
 else if (type === EVENTS.EVENT_CRMINFO && event){
    //  获取手机号成功
    if (this.data.ticketNo == ''){
      this.getCouList()
    }
 }
},
// 还原状态
replaceData : function (params) {
  
    let ticketNo = this.data.ticketNo;
    let jsonDatas = this.data.jsonDatas;
    let currentSelectIndex = this.data.currentSelectIndex;
    let subMitIndex = this.data.subMitIndex;
    let isSaveOrder = this.data.isSaveOrder
    let saveOrderParams = this.data.saveOrderParams

    isSaveOrder = false
    saveOrderParams = {}
    jsonDatas[subMitIndex].colorDefault = 0;
    jsonDatas[subMitIndex].sizeDefault = -1;
    ticketNo = ''
    
    currentSelectIndex = -1;
    subMitIndex = -1;

    this.setData({
      jsonDatas,
      currentSelectIndex,
      subMitIndex,
      isSaveOrder,
      saveOrderParams,
      ticketNo
    })
    this.getCouList()

},
getActionStatue : function(){

  if (this.data.actionStatusStr != ''){
    wx.showModal({
      title: '提示', //提示的标题,
      content: this.data.actionStatusStr, //提示的内容,
      showCancel: false, //是否显示取消按钮,

      confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#3CC51F', //确定按钮的文字颜色,
      success: res => {
      }
    });
    return false;
  }
  else{
    return true;
  }
  
},
// 获取优惠券信息
getCouList : function(){
  this.getPhoneList().then(ticketNo => {
    console.log(`voucherno=:${ticketNo}`)

    this.setData({ticketNo : ticketNo})

  }).catch(vouchernoErr => {
  
  })

},
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    setTimeout(() => {
      if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
        getApp().checkLogin()
      }
      else if (wx.getStorageSync(KEYSTORAGE.crmInfo) && this.data.ticketNo == ''){
        this.getCouList()
      }
    }, 1000);

    let addressJson = wx.getStorageSync('dingdanAddress');
    // console.log(`地址:${JSON.stringify(addressJson)}`)
    // d
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
    }
    if (wx.getStorageSync('aPennyReplace')){
      this.replaceData()
    }
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

  }
})