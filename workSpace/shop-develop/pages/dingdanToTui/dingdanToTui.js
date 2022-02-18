var app = getApp();
const {domain, brand, cdn, DEV} = app.config;
import { KEYSTORAGE, REGEXP, URL_CDN } from '../../src/const'
import {wxShowToast} from "../../utils/wxMethods";
import { refundApply } from "../../service/refund";
import {getDateByOrder, getdate, filterStr, skuToImg, orderStatus, dateIsOverDue} from "../../utils/utils";
import { chooseFile, uploadFile, uploadImage } from '../../service/upload';
import { orderDetail } from '../../service/order'
var list = [];
const productProblem = '质量问题';
const refundGoodsReason = ['七天无理由退换货', '包装/商品破损/污渍', '不喜欢/不想要', '缩水/褪色', '商品描述的颜色/款式/尺码/材质/面料与实物不符', '卖家发错货', '少件/漏发', '少件/漏发', '质量问题', '未按约定时间发货'];
// 仅退款
const refundReason = ['不喜欢/不想要', '订单信息拍错（规格/尺码/颜色/地址/电话信息等）', '没用/少用优惠', '缺货', '未按约定时间发货']

Page({
  //页面的初始数据
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    dingdanCon: {},
    footer_isShow: false,
    dingdanStatus: false,
    prevDingdanStatus: '',
    payment: true,
    isCome: true,


    // 控制1 2级弹框
    tcShow : false,
    tcShow_two : false,
    // 是否是拼团订单(拼团的话必须全退)
    pintuan : false,
    // 退货原因 、订单信息拍错（款式/尺码/颜色等）、我不想要了、地址/电话信息填写错误、没用/少用优惠、缺货 未发货
    refoundReason : {
      messageText : refundGoodsReason,
      inputContent : "",
      selectIndex : -1,
      selectName : ''
    },
    disabled: true,
    showUpload: false,
    uploadImg: [],
    uploadDomain: DEV ? domain : cdn,
    selectReason: '',
    showReason: true,
  //  选中的商品状态
    selectGoodsStatus: ''
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    this.getOrderDetail();
  },

  //生命周期函数--监听页面显示
  onShow: function () {
    app.track();
  },
  setRefundReason(arr){
    let refundReasonArr = [];
    let { refoundReason } = this.data;
    arr.forEach(item => {
      refundReasonArr.push({
        text: item,
        checked: false,
      })
    });
    refoundReason.messageText = refundReasonArr;
    this.setData({refoundReason})
  },

  getOrderDetail(){
    wx.showLoading({
      title: '加载中'
    });
    const dingdanCon = wx.getStorageSync('allToDingdan');
    const {id, orderToken, bigorderCode, payPrice} = dingdanCon;
    let pintuan = this.data.pintuan;
    pintuan = wx.getStorageSync('isPintuan');
    wx.removeStorageSync('isPintuan');
    const param = {
      orderToken,
      bigorderCode
    };
    orderDetail(param).then(res => {
      if(res){
        wx.hideLoading();
        let {goodsOrderList, createTime, status,expressPoList, isHaveRefund} = res;

        goodsOrderList.forEach(item => {
          item.goodsImg = cdn + skuToImg({sku: item.gcsSku, size: URL_CDN.IMGSIZE240400});
          item.myGoodsStatus = orderStatus(item.goodsStatus);
          item.myGoodsCount = 1;
          if (pintuan){
            item.myChecked = true;
            // 设置原因
            this.setRefundReason(item.goodsStatus === 'WaitingShipment' ? refundReason :  refundGoodsReason);
          }
          if (item.isGift === 'Y') {
            item.myChecked = true;
          }
        });
        if(pintuan){

        }

        let {footer_isShow, payment, isCome, refoundReason} = this.data;
        if(status === 'TransactionCancel'){
          footer_isShow = false
        }else{
          if(status === 'WaitingPay'){
            footer_isShow = true;
            payment = false
          }else if(status === 'WaitingShipment'){
            // 待发货
            footer_isShow = payment = true;
            isCome = false;
          }else if(status === 'WaitingReceive'){
            footer_isShow = payment = isCome = true;
          }
        }
        const date = '2020/03/10';
        const onlineDate = new Date(date).getTime();
        if(createTime <= onlineDate){
          refoundReason.messageText[0] = '15天无理由退款'
        }
        this.setData({
          dingdanCon: res,
          dingdanStatus: true,
          prevDingdanStatus: status,

          pintuan,
          refoundReason,
          footer_isShow,
          payment,
          isCome,
        })
      }
    }).catch(err => wxShowToast(err.message))
    app.gioTrack('flow_orderdetail_1', {
      order_amount: payPrice
    })
  },


  changeGoodsCount(e){
    const {index, type} = e.currentTarget.dataset;
    const {dingdanCon} = this.data;
    const goodsItem = dingdanCon.goodsOrderList[index];
    const myGoodsCount = goodsItem.myGoodsCount;
    if(type * 1 > 0){
      // 增加
      if(myGoodsCount >= goodsItem.goodsCount){
        return
      }
      goodsItem.myGoodsCount++;
    }else if(type * 1 < 0){
      if(myGoodsCount === 1){
        return;
      }
      goodsItem.myGoodsCount--
    }
    this.setData({dingdanCon})
  },

  //选中商品
  checked : function(e){
    if (this.data.pintuan){
      wx.showModal({
        title: '提示', //提示的标题,
        content: '拼团商品需要全部退货', //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#3CC51F', //确定按钮的文字颜色,
        success: res => { }
      });
    }else{
      let {dingdanCon, selectGoodsStatus} = this.data;
      const {goodsOrderList} = dingdanCon;
      const index = Number(e.currentTarget.id);
      // 签收日前
      const {updateFinishTime = '', finishTime = '', refundCount, isGift, goodsStatus, goodsColorCode, gcsSku} = goodsOrderList[index];

      const shipmentTime = updateFinishTime || finishTime;
      if(shipmentTime){
        const shipmentTimeSatamp = new Date( shipmentTime.replace(/-/g, '/')).getTime();
        // 签收7日不可退款

        if(dateIsOverDue(shipmentTimeSatamp, 7)){
          wxShowToast('签收超过7天，不可退');
          return;
        }
      }
      if(refundCount > 0){
        wxShowToast('该商品已退，请选择其他商品');
        return;
      }
      if (isGift === 'Y') {
        wxShowToast('赠品不可取消');
        return;
      }
      let hasChecked = goodsOrderList.some(item => item.myChecked);
      if(!hasChecked){
        // 没有选中就清空
        selectGoodsStatus = ''
      }
      selectGoodsStatus = selectGoodsStatus || goodsStatus;
      if(selectGoodsStatus && selectGoodsStatus !== goodsStatus){
        wxShowToast('订单商品状态不一致，请重新选择！');
        return;
      }
      const isExchangeOrder = goodsOrderList.some(item => item.exchangeCount >= 1);
      if(isExchangeOrder){
        wxShowToast('换货单不可退款');
        return
      }
      // 设置原因
      this.setRefundReason(goodsStatus === 'WaitingShipment' ? refundReason :  refundGoodsReason);
      goodsOrderList[index].myChecked = !goodsOrderList[index].myChecked;
      this.setData({
        dingdanCon,
        selectGoodsStatus
      });
      app.gioTrack('flow_orderdetail_return_return_goods_3', {
        spu_id: goodsColorCode,
        sku_id: gcsSku,
        logType: gcsSku
      })
    }
  },

  //申请退款 - 点击确定按钮
  btnTrue : function(e){
    let dingdan_con = this.data.dingdanCon;
    // 选择退货的商品列表
    const selectGoodsList = dingdan_con.goodsOrderList.filter(item => item.myChecked);
    if( !selectGoodsList.length ){
      wxShowToast('请选择需要退货商品');
      return;
    }
    list = [];
    selectGoodsList.forEach(item => {
      list.push({
        colorName: item.colorName,
        counts: item.myGoodsCount || 1,
        goodsName: item.goodsName,
        goodsOrderId: item.goodsId || item.id || '',
        id: item.id || '',
        gsMainPicPath: item.gscolPicPath,
        isGift: item.isGift,
        isJoin: item.isJoin,
        sizeName: item.sizeName,
        sku: item.gcsSku,
        goodsStatus: item.goodsStatus,
      });
      app.gioTrack('flow_orderdetail_return_summit_4', {
        spu_id: item.goodsColorCode
      })
    });
  /*  for( var i=0;i<arr.length;i++ ){
      var thisList = dingdan_con.goodsOrderList[arr[i]];
      var index = arr[i];

    }*/
    if (dingdan_con.bigOrderStore && dingdan_con.deliveryMode && dingdan_con.deliveryMode === 'pickup') {
      if (list.length !== dingdan_con.goodsTotalCount) {
        wxShowToast('此门店不支持部分退');
        return
      }
    }
    this.setData({
      tcShow : !!list.length
    });
  },



  //申请退款 - 提交
  qdTrue : function(e){
    if(!this.data.disabled){
      return
    }
    const {dingdanCon, refoundReason} = this.data;
    let str = filterStr(`${refoundReason.selectName}_${refoundReason.inputContent}`);

    let counts = 0;
    list.forEach(item => counts += item.counts)
    if(str){
      if(!REGEXP.STRREG2.test(str)){
        wxShowToast('请填写中文、字母、数字');
        return;
      }
    }else{
      wxShowToast('请选择退单原因');
      return;
    }
    this.close();

    wx.showLoading({
      title:'退货申请中...',
      mask: true,
    });
    this.setData({
      disabled: false,
    });
    const {uploadImg} = this.data;
    const param = {
      oriorderCode: dingdanCon.bigorderCode,
      refundGsOrderList: list,
      refundReason: str,
      refundTotalCount: counts,
      refundType: "OnLine",
      otherRefundType: uploadImg.length ? 'goodsQuality' : '',
      otherGoodsPic: uploadImg.length ? uploadImg.join(','): ''
    };
    refundApply(param).then(res => {
      this.setData({
        disabled: true,
      });
      if(res){
        wx.hideLoading();
        this.setData({
          disabled: true,
        });
        const refundOrderCode = res[0].refundOrderCode;
        wx.setStorageSync('tuikuanCode', refundOrderCode);
        wx.setStorageSync(KEYSTORAGE.refundDetail, res);
        wx.setStorageSync('isTuihuo', true);
        wx.showLoading({
          title: '加载中',
        });
        wx.redirectTo({
          url: `/order/refundDetail/refundDetail?deliveryMode=${dingdanCon.deliveryMode}`,
          success(){
            wx.hideLoading();
          }
        });
      }
    }).catch(err => {
      this.setData({
        disabled: true,
      });
      wxShowToast(err.message)
    });
    app.wxPaymentReport(dingdanCon.bigorderCode, 'cancel_give_order', dingdanCon.payPrice);
    app.gioTrack('pageclick_return_confirm', {
      orderId: dingdanCon.bigorderCode
    })
    app.gioTrack('flow_orderdetail_return_confirm_reason_6', {
      sourceId:dingdanCon.bigorderCode,
      spu_id: str
    })
    app.gioTrack('flow_orderdetail_retrun_confirm_7', {
      requestId: dingdanCon.bigorderCode
    })

  },
  changeShowReason(){
    this.setData({
      showReason: true,
    })
  },
  // 退款原因选择
  selectValue : function(e){
    // console.log(`选中的下标:${JSON.stringify(e)}`);
    let {refoundReason, showUpload, uploadImg, showReason, dingdanCon} = this.data;
    const dataIndex = e.currentTarget.dataset.index * 1;
    refoundReason.selectIndex = dataIndex;
    refoundReason.selectName = refoundReason.messageText[dataIndex].text;
    if(refoundReason.selectName && refoundReason.selectName.includes(productProblem)){
      showUpload = true;
    }else{
      showUpload = false;
      uploadImg = [];
    }
    showReason = false;
    refoundReason.messageText.forEach((item, index) => {
      item.checked = index === dataIndex
    });
    this.setData({refoundReason, showUpload, uploadImg, showReason});
    app.gioTrack('pageclick_return_reason', {
      orderId: dingdanCon.bigorderCode
    })
    app.gioTrack('flow_orderdetail_return_reason_5', {
      sceneId: dingdanCon.bigorderCode
    })
  },
  // 输入框
  inputTap : function(e){
    let refoundReason = this.data.refoundReason
    refoundReason.inputContent = e.detail.value
    this.setData({refoundReason})

  },
  delUploadImg(e){
    const {index} = e.currentTarget.dataset;
    const { uploadImg } = this.data;
    uploadImg.splice(index, 1);
    this.setData({uploadImg})
  },
  upload(e){
    const {uploadImg} = this.data;
    if(uploadImg.length >=3){
      wxShowToast('最多3张图片');
      return;
    }
    const param = {
      moduleName: `/assets/wechat/${brand}/service/`
    };
    chooseFile(3).then(res => {
      if(res && res.length){
        res.forEach(item => {
          uploadImage(item,param).then( file => {
            if(file && file.length){
              const {uploadImg} = this.data;
              if(uploadImg.length < 3){
                file.forEach(item => {
                  uploadImg.push(item)
                });
                this.setData({uploadImg});
              }
            }
          })
        });
      }
    }).catch(err => wxShowToast(err.message))
  },

  // 关闭弹框
  close : function(){
    this.setData({
      tcShow_two : false,
      tcShow : false
    })
  },
  //关闭
  selectTapClose : function(e){
    this.setData({ tcShow_two : false })
  },
  // 选择原因
  selectTap:function(){
    this.setData({ tcShow_two : true })
  }

})
