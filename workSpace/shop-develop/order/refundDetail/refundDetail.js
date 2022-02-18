import {getImageInfo, saveImageToPhotosAlbum} from "../../service/saveImg";

const app = getApp();
const {brand, cdn, refundAddress, CUSTOMER_WX_NAME} = app.config;
import {wxCopyText, wxShowToast} from '../../utils/wxMethods'
import {getCurrentUrl, judgeUrl, skuToImg, splitImg, formatDate} from '../../utils/utils'
import {awardActivity, orderDetail} from '../../service/order'
import {KEYSTORAGE, URL_CDN} from '../../src/const'
import {refundDetail} from "../../service/refund";
let ORDER_TYPE = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: '请等待商家处理',
    goodsOrderList:[],
    refundOrderCode: '',
    refundDetail:[],
    refundText: '',
    showRefundAddress: false,
    refundAddress: '',
    helpData: {
      show: false,
      bouncedImage : splitImg('helpBounced.jpg'),
      wxNum : brand === 'FOL' ? false :CUSTOMER_WX_NAME
    }
  },
  /*ApplyRefunding, //退款申请中
  RefundGoodsing,    //退货申请中
  RefundClose,   //退款关闭
  REFUNDING,    //退款中
  RefundFail,       //退款失败
  RefundSuccess, //退款成功
  RefundGoodsReceive,    //退货入库
  RefundGoodsClose,  //退货关闭
  WaitingRefundGoods //待买家寄回商品*/
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {refundOrderCode = '', type = '', deliveryMode = ''} = options;
    ORDER_TYPE = deliveryMode;
    this.handleRefundAddress();
    this.setData({refundOrderCode});
    this.getLocalRefundDetail();
    this.awardActivity();
    this.setData({deliveryMode});
    if(type && type === 'express'){
      this.setData({
        title: '买家已寄回商品，等待商家确认。',
        refundText: '待商家验收商品且确认无误后，退款将返还至原支付账户，请注意查收!如逾期未收到可联系客服处理。',
        refundTime: '退款到账时效: \n支付宝/微信支付: 1-7个工作日\n银行卡/信用卡: 1-15个工作日',
      })
    }
    refundOrderCode ? this.getRefundDetail(refundOrderCode) : this.getLocalRefundDetail();
  },
  changeShow(status){
    const {helpData} = this.data;
    helpData.show = !!status;
    this.setData({
      helpData
    })
  },
  handleRefundAddress(){
    let splitMark = refundAddress.includes(',') ? ',' : '，';
    refundAddress.split(splitMark);
    this.setData({refundAddress: refundAddress.split(splitMark)})
  },
  copy(e){
    const {text} = e.currentTarget.dataset;
    let copyText = text || refundAddress;
    wxCopyText(copyText);
  },
  contact(){
    this.changeShow(true)
  },
  closePop(){
    this.changeShow(false)
  },
  saveImg(){
    let _this = this;
    app.isAuthor({
      type: 'scope.writePhotosAlbum',
      title: '需要授权相册权限才能保存',
      callBack: _this.saveHelpImg,
    })
  },
  saveHelpImg(){
    wx.showLoading({
      title: '保存中',
    });
    getImageInfo(this.data.helpData.bouncedImage).then(res=>{
      saveImageToPhotosAlbum(res).then(res=>{
        wxShowToast('保存成功')
      })
    })
  },
  // 客服二维码
  awardActivity: function(){
    let param = {
      orderType:0,
      pageType:1,
      pageAddress: 'pages/index/index'
    };
    awardActivity(param).then( res => {
      let helpData = this.data.helpData;
      if(res && res.length){
        for(let item of res){
          if(item.pageRule){
            helpData.bouncedImage = judgeUrl(item.imgUrl);
            helpData.wxNum = item.pageRule;
            break;
          }
        }
        this.setData({helpData});
      }
    })
  },
  //●仅退款：退款申请审核通过后，订单支付金额将于48小时内返还至原付款路径，请注意查收！
  // ●退货退款：退款审核通过后，请按退货地址寄回商品并在【退换货/售后】订单列表中找到退款订单并填写退货物流信息。感谢您的配合！
  getLocalRefundDetail(){
    const refundDetail = wx.getStorageSync(KEYSTORAGE.refundDetail);
    let {title, refundText, showRefundAddress} = this.data;
    if(refundDetail && Array.isArray(refundDetail) && refundDetail.length){
      refundDetail.forEach((item, index) => {
        if(!index){
          if(ORDER_TYPE === 'pickup' || (item.refundStore && item.refundStore.storeName)){
            // refundCategory 1.退货2.退款（已付款未发货）
            if(item.refundCategory === '1' ){
              // chen jueyu 提供文案
              title = '您已成功提交退货申请';
              refundText = '您的退货申请审核通过后 请您携带需要退货的商品到提货门店退货'
            }else if (item.refundCategory === '2'){
              refundText = '您已成功发起退款申请，请耐心等待商家处理'
            }
          }else{
            if(item.refundStatus === 'ApplyRefunding'){
              refundText = '退款申请审核通过后，订单支付金额将于48小时内返还至原付款路径，请注意查收！';
              app.gioTrack('flow_orderdetail_return_success_9a', {
                sceneType:  item.refundOrderCode
              })
            }else{
              refundText = '退款审核通过后，请按退货地址寄回商品并在【退换货/售后】中找到退款订单并填写退货物流信息。感谢您的配合！';
              showRefundAddress = true
              app.gioTrack('flow_orderdetail_return_returning_8', {
                tospu_id: item.refundOrderCode
              })
            }
          }
        }
        item.refundGsOrderList = item.refundGsOrderList || item.rgopList;
        item.refundGsOrderList.forEach(goodsItem => {
          goodsItem.goodsImg = cdn + skuToImg({
            sku: goodsItem.sku,
            size: URL_CDN.IMGSIZE240400
          });
          // item.createRefundTime = formatDate(item.createTime, 'h');
          // item.originCodeTime = formatDate(item.oriOrderTime, 'h');
        })
      });
    }
    this.setData({
      title,
      refundDetail,
      refundText,
      showRefundAddress
    })
  },
  goBack(){
    app.goBack()
  },
  getRefundDetail(refundCode){
    wx.showLoading({
      title: '请求中...',
    });
    refundDetail(refundCode).then(res => {
      wx.hideLoading();
      if(res){
        wx.setStorageSync(KEYSTORAGE.refundDetail, [res]);
        this.getLocalRefundDetail();
      }
    }).catch(err => wxShowToast(err.message));
  },
  getOrderDetail(){
    const dingdanCon = wx.getStorageSync('allToDingdan');
    const {id, orderToken} = dingdanCon;
    const param = {
      bigOrderId: id,
      orderToken
    };
    orderDetail(param).then(res => {
      if(res){
        const {goodsOrderPoList} = res;
        goodsOrderPoList.forEach(item => {
          item.goodsImg = cdn + skuToImg({sku: item.gcsSku});
        });
        this.setData({
          goodsOrderList: goodsOrderPoList
        })
      }
    }).catch(err => wxShowToast(err.message))
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
    wx.removeStorageSync(KEYSTORAGE.refundDetail);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    wx.removeStorageSync(KEYSTORAGE.refundDetail);
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