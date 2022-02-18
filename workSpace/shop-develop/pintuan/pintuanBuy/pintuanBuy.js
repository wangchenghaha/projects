// pintuan/pintuanBuy/pintuanBuy.js
import{PTOrderSave,PTGetAddress} from '../netWork/pintuanRquest.js'
import {KEYSTORAGE} from "../../src/const";
import { wxSubscription } from '../../utils/wxSubscribe'
const app = getApp();
const {ORDER_TYPE} = app.config;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: getApp().globalData.isIPhoneX,
    // 详情数据
    detailData:{},
    // 计算标题
    jsTitle:["拼团价","运费","折扣","合计"],
    // 计算价格
    jsJiage:[],
    // 地址
    address:[],
    // 请求用的地址
    requestForAddress : {
      province : '',
      city : '',
      area : '',
      detailAddress : '',
      contactTel : '',
      consignee : ''
    },
    // 拼团规则
    ptgz : [
      {
      name:"拼团活动时间、拼团有效期及成团说明：",
      isSelect:false,
      list:[
      "a.拼团活动时间: ",
      "b.拼团有效期：自开团时刻起到当天23:59:59。",
      "c.成团条件：拼团有效期内，包括拼团发起人在内，凑齐成团人数2人，购买任意参与拼团商品，则拼团成功，否则拼团失败。",
      "d.拼团活动时间内，针对单个拼团商品，拼团成功后，可继续发起拼团；",
      "e.每人可无次数限制参与其他团长所开的拼团，每次参与并拼团成功后，可购买对应拼团商品。"]
    },{
      name:"拼团失败",
      isSelect:false,
      list:[
      "a.超过成团有效期24小时或未超24小时但拼团活动时间已到，未达成相应参团人数的团，则该拼团失败。",
      "b.如拼团失败，且拼团活动仍未结束，可再次开团邀请好友共同拼团。",
      "c.在团有效期24小时内，拼团商品已提前售罄，若还未拼团成功，则该团自动失败。",
      "d.拼团失败的订单，系统会在1-7个工作日内处理退款，系统处理后1-10个工作日内原路退回至原支付账户中。"]
    },{
      name:"等待成团中如何退款？",
      isSelect:false,
      list:["a.超过成团有效期，未达成相应参团人数的要求，则该团失败，系统会自动退款。"]
    },{
      name:"商品退/换货承诺",
      isSelect:false,
      list:["a.尊敬的顾客，我们的退货适用范围包含本官方网站售出的所有商品（不包含积分商城礼品）在您收到商品后，如对商品不满意，7日之内（以物流签收时间为准），未经穿着洗涤，吊牌完整无损，不影响产品二次销售，请联系客服申请退货，并将商品按客服提示时间内寄回，可为您安排退货及退款。",
      "b.凡商品存在质量问题、发送（货）错误问题，支持无条件退换货，退换前请与客服人员联系，确认具体情况及流程，由此发生的邮寄费用将由我司承担。",
      "c.在官方网站的商品暂不支持在实体店进行退货。同时，官方网站暂时也不受理实体店售出商品的退货申请。",
      "d.如全部退货请将赠品以及发票一同寄回。",
      "e.由于顾客主观原因对商品不喜欢或感觉不符合心意的情况，符合退/换货条件可以办理，但需要买家承担相应运费。暂不支持退货到付。",
      "*如在拼团活动中存在作弊，或其他有损品牌或其他用户合法权益的行为，品牌有权终止服务并采取相关处理措施。",
      "*最终解释权归品牌所有。"]
    }
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var detailData = this.data.detailData
    var jsJiage = this.data.jsJiage
    Object.assign(detailData,wx.getStorageSync('detailData'))
    jsJiage[0] = `￥${detailData.allPrice}`
    jsJiage[1] = `+￥0.00`
    jsJiage[2] = `-￥0.00`
    jsJiage[3] = `￥${detailData.allPrice}`

    // console.log(`detailData:${JSON.stringify(detailData)}`)
    console.log(app.globalData.configJson.pintuanTimeD,'###');
    let {ptgz} = this.data;
    let curRule = ptgz[0].list[0] + app.globalData.configJson.pintuanTimeD;
    const ruleKey =  `ptgz[0].list[0]`
    this.setData({
      detailData,
      jsJiage,
      [ruleKey]: curRule,
    })
    // 获取地址
    var address = this.data.address
    var requestForAddress = this.data.requestForAddress
    PTGetAddress().then(item=>{
      console.log(`收货地址:${JSON.stringify(item)}`)
      if (item.length > 0){
        var defulatIndex = 0
        item.forEach((e,index)=>{
          if (e.defaultAddress == 'Y'){
            defulatIndex = index
          }
        })
        address = []
        address.push(item[defulatIndex].userName)
        address.push(`${item[defulatIndex].city}${item[defulatIndex].area}${item[defulatIndex].detailAddress}`)
        address.push(item[defulatIndex].phone)
        address.push(item[defulatIndex].province)

        requestForAddress.consignee = item[defulatIndex].userName
        requestForAddress.contactTel = item[defulatIndex].phone
        requestForAddress.province = item[defulatIndex].province
        requestForAddress.city = item[defulatIndex].city
        requestForAddress.area = item[defulatIndex].area
        requestForAddress.detailAddress = item[defulatIndex].detailAddress
        this.setData({
          address,
          requestForAddress
        })
      }
    })
  },


 wxSubscribe: function(e){

  if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
    getApp().checkLogin()
  }
  else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
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
      wxSubscription("orderPay").then(res => {
        this.submitOrder(e)
      }).catch(err => {
        this.submitOrder(e)
      });
  }



},
  // 提交订单
  submitOrder:function(e){

    let pintuanData = wx.getStorageSync('pintuanData');
    wx.removeStorageSync('pintuanData');
    if (pintuanData.endTime < new Date().getTime()){
      wx.setStorageSync('reloadList','1')
            // endtime商品过期了
            wx.showModal({
              title: '提示', //提示的标题,
              content: '活动已结束', //提示的内容,
              showCancel: false, //是否显示取消按钮,
              confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
                if (res.confirm) {
                  wx.navigateBack({
                    delta: 2 //返回的页面数，如果 delta 大于现有页面数，则返回到首页,
                  });
                }
              }
            });
            return
    }
    if (this.data.address.length <= 0){
      wx.showModal({
        title: '提示', //提示的标题,
        content: '请选择收货地址', //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#3CC51F' //确定按钮的文字颜色,
      });
      return
    }
    var detailData = this.data.detailData;

    var pintuanOrderPerson = ''
    var pintuanOrderType = ''

    // 获取头像
    var wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    var customerNickname = wxInfo.nickName
    var customerFaceImg = wxInfo.avatarUrl
    if (wx.getStorageSync('isShare')){
      let isShareData = wx.getStorageSync('isShare');
      //来自分享页
      pintuanOrderPerson = isShareData.bigorderCode
      pintuanOrderType = '1'
    }
    // console.log(`aaa:${JSON.stringify(pintuanOrderType)}`)
    let tempUrl = `${getApp().config.cdn}`


    /*let utmParams = wx.getStorageSync('pintuan-utm');
    var utmCampaign = ''
    var utmMedium = ''
    var utmSource = ''
    var utmTerm = ''
    if (utmParams.utm_source){
      utmTerm = utmParams.utm_term
      utmSource = utmParams.utm_source
      utmMedium = utmParams.utm_medium
      utmCampaign = utmParams.utm_campaign

      wx.removeStorageSync('pintuan-utm');
    }*/
    let userInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    const requstData = {
      "phone" : userInfo.phone,
      "channelCode":"MINIPROGRAM",
      "personRequire" : detailData.personRequire,
      "originalTotalPrice" : detailData.originalTotalPrice,
      "realSellPrice":detailData.allPrice,
      "payPrice":detailData.allPrice,
      "goodsTotalCount":detailData.nums,
      "gscPicmianId":"1",
      "picUrl":detailData.imageUrl.replace(new RegExp(tempUrl,'g'),''),
      "openId" : app.getOpenId(),
    "orderType" : ORDER_TYPE.PINTUAN, //rest接口新增字段by 2020/5/19 17:00:00
    "isPintuan":"pintuan",
    "pintuanOrderPerson":pintuanOrderPerson, // 拼团发起人（改为发起拼团时，订单详情接口返回的bigorderCode字段）
    "pintuanOrderType":pintuanOrderType, // 不传默认为0发起人
    "pintuanStatus":"",// 不传默认为waiting_for_pintuan（拼团和参团都不用传）
    "goodsOrderList":[{
      "colorName":detailData.color.colorAlias,
      "gcsSku":detailData.goodsSku,
      "goodsName":detailData.goodsName,
      "goodsCount":detailData.nums,
      "goodsColorCode":detailData.color.colorCode,
      "gscolPicPath":detailData.imageUrl.replace(new RegExp(tempUrl,'g'),''),
      "originalPrice":detailData.color.originalPrice,
      "sizeName":detailData.size.sizeAlias,
      "price":detailData.onePrice,
      "isGift":"N"
    }],
    "bigOrderAppendix":{
      "targetUrl":"",
      "utmCampaign": '',
      "utmMedium": '',
      "utmSource": '',
      "utmTerm": ''
    },
    "ruleId":"",
    "crmId":wx.getStorageSync(KEYSTORAGE.crmInfo).memberno || '',
    "utmWxScene":wx.getStorageSync('scene') || '',
    "expressFare":0,
    "unionid":wx.getStorageSync(KEYSTORAGE.unionid),
    "customerNickname":customerNickname,
    "customerFaceImg":customerFaceImg,
    devFlag: '',
    };
    // 合并地址
    Object.assign(requstData,this.data.requestForAddress)
    console.log(`保存订单数据:${JSON.stringify(requstData)}`)
    PTOrderSave(requstData).then(saveRes=>{

      console.log(`保存订单结果:${JSON.stringify(saveRes)}`)
      // 跳转页面支付
      let detailDatas = {
        imageUrl : detailData.imageUrl,
        goodsName : detailData.goodsName,
        sizeAlias : detailData.size.sizeAlias,
        nums : detailData.nums,
        onePrice : detailData.onePrice,
        originalPrice : detailData.color.originalPrice,
        pintuanOrderType : pintuanOrderType
      }


      // 用于订单筛选 查出拼主信息
      let pinzhuArrs = wx.getStorageSync('pinzhuShareArrs');
      let pinzhuJson = pinzhuArrs[pinzhuArrs.length - 1]
      pinzhuJson.dingdanID = saveRes.bigorderCode
      pinzhuArrs.splice(pinzhuArrs.length - 1,1,pinzhuJson)
      wx.setStorageSync('pinzhuShareArrs', pinzhuArrs);


      wx.setStorageSync('isPintuan',true)
      wx.setStorageSync('detailData',detailDatas)
      wx.setStorageSync('pintuanGsColorCode',detailData.goodsSku.substring(0,12))



      let querystring = `id=${saveRes.bigOrderId}&bigorderCode=${saveRes.bigorderCode}&orderToken=${saveRes.orderToken}&payToken=${saveRes.payToken}&payTokenTime=${saveRes.payTokenTime}&amountPaid=${saveRes.payPrice}&sku=${detailData.goodsSku.substring(0,12)}`;
      wx.navigateTo({
        url: '../../pages/wxPay/wxPay?' + querystring
      });

      let saveResOrderData = saveRes
      if (pintuanOrderType == '1'){
        saveResOrderData.bigorderCode = pinzhuJson.bigorderCode
      }
      wx.setStorageSync('orderData',saveResOrderData)

    })

  },
  // 跳转地址页面
  gotoAddress:function(e){
    wx.navigateTo({
      url: '/pages/address/address?dingdan=200'
    });
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


    let addressJson = wx.getStorageSync('dingdanAddress');
    if (addressJson){
      var address = this.data.address
      var requestForAddress = this.data.requestForAddress
      address = []
      address.push(addressJson.userName)
      address.push(`${addressJson.city}${addressJson.area}${addressJson.detailAddress}`)
      address.push(addressJson.phone)
      address.push(addressJson.province)

      requestForAddress.consignee = addressJson.userName
      requestForAddress.contactTel = addressJson.phone
      requestForAddress.province = addressJson.province
      requestForAddress.city = addressJson.city
      requestForAddress.area = addressJson.area
      requestForAddress.detailAddress = addressJson.detailAddress
      this.setData({
        address,
        requestForAddress
      })
      wx.removeStorageSync('dingdanAddress');
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

  // 拼团规则
  ptgzTap:function(e){
    let id = e.currentTarget.id
    var ptgz = this.data.ptgz
    ptgz.forEach((item,index) => {
      if (index == id){
        item.isSelect = !item.isSelect
      }
      else{
        item.isSelect = false
      }
    });
    this.setData({
      ptgz
    })
  }
})
