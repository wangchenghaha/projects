import {chooseFile, uploadFile, uploadImage, compressImage} from '../../service/upload';
import { submitWayBill } from '../../service/refund';
import { filterStr} from '../../utils/utils'
import {wxShowToast} from '../../utils/wxMethods'
import {REGEXP} from '../../src/const'
const app = getApp();
const {cdn, brand, DEV, domain} = app.config;
let inputType = '';
const saveParam = {
  brandCode: brand,
  expressCompany: '',
  otherAccountNumber: '',
  otherAcountName: '',
  otherAlipayPic: '',
  otherExpressFare: 0,
  otherExpressPic: '',
  otherGoodsPic: '',
  otherWay: "alipay",
  refundCode: '',
  oriorderCode: '',
  waybillNum: ''
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    payee: [
      {
        text: '支付宝账号：',
        type: 'text',
        placeholder: '请输入实名认证的支付宝账号',
        value: '',
        error: false,
      },
      {
        text: '姓名：',
        type: 'text',
        placeholder: '请输入支付宝对应的姓名',
        value: '',
        error: false,
      },
      {
        text: '寄回快递费用：',
        type: 'number',
        placeholder: '请填写真实的寄回快递费用',
        value: '',
        error: false,
      }
    ],
    express: [
      {
        text: '物流公司:',
        placeholder: '请输入寄回物流公司',
        value: '',
        error: false,
      },
      {
        text: '快递单号:',
        placeholder: '请输入寄回物流单号',
        value: '',
        error: false,
      }
    ],
    uploadDomain: DEV ? domain : cdn,
    zhiFuBaoImg:[],
    expressImg:[],
    qualityImg:[],
  },
  input(e) {
    const {type, ind} = e.currentTarget.dataset;
    let {value} = e.detail;
    const {express, payee} = this.data;
    value = filterStr(value);
    if (type === 'express') {
      express.forEach((item, index) => {
        if (index === ind) {
          item.value = value;
        }
      })
    } else if (type === 'payee') {
      payee.forEach((item, index) => {
        if (index === ind) {
          item.value = value
        }
      })
    }
    this.setData({express, payee});

  },
  focus(e) {
    const {type, ind} = e.currentTarget.dataset;
    inputType = type;
  },
  blur(e) {
    const {type, ind} = e.currentTarget.dataset;
    let {value} = e.detail;
    const {payee, express} = this.data;
    if(type === 'payee'){
      switch (ind) {
        case 0:
          if(!REGEXP.ZHI_FU_BAO.test(value)){
            wxShowToast('请填入正确的支付宝账号');
            payee[ind].error = true;
          }else{
            payee[ind].error = false;
            saveParam.otherAccountNumber = payee[ind].value;
          }
          break;
        case 1:
          if(!REGEXP.CHINESEREG.test(value)){
            wxShowToast('请填入正确的支付宝账姓名');
            payee[ind].error = true;
          }else{
            payee[ind].error = false;
            saveParam.otherAcountName = payee[ind].value;
          }
          break;
        case 2:
          if(isNaN(value)){
            wxShowToast('请填入数字');
            payee[ind].error = true;
          }else {
            payee[ind].error = false;
            saveParam.otherExpressFare = payee[ind].value * 1;
          }
          break;
      }
    }else if(type === 'express'){
      switch (ind) {
        case 0:
          if(!REGEXP.CHINESE_LETTER.test(value)){
            wxShowToast('请填入正确的快递公司');
            express[ind].error = true;
          }else{
            express[ind].error = false;
            saveParam.expressCompany = express[ind].value;
          }
          break;
        case 1:
          if(!REGEXP.NUMBER_LETTER.test(value)){
            wxShowToast('请填入正确的快递单号');
            express[ind].error = true;
          }else{
            express[ind].error = false;
            saveParam.waybillNum = express[ind].value
          }
          break;
      }
    }
    this.setData({payee, express})
  },
  upload(e){
    const {num, type } = e.currentTarget.dataset;
    let imgCount = 3;
    if(type === 'zhiFuBao'){
      imgCount = 1;
    }
    if(num >= imgCount){
      wxShowToast(`最多${imgCount}张图片`);
      return;
    }
    const param = {
      moduleName: `/assets/wechat/${brand}/service/`
    };
    const {zhiFuBaoImg, expressImg, qualityImg} = this.data;
    chooseFile(imgCount).then(res => {
      if(res && res.length){
        res.forEach(item => {
          uploadImage(item,param).then( file => {
            if(file && file.length){
              file.forEach(item => {
                if(type === 'zhiFuBao'){
                  zhiFuBaoImg.push(item);
                }else if(type === 'express'){
                  expressImg.push(item)
                }else if(type === 'quality'){
                  qualityImg.push(item)
                }
              });
              this.setData({zhiFuBaoImg, expressImg, qualityImg});
            }
          })
        });
      }
    }).catch(err => wxShowToast(err.message))
  },
  delUploadImg(e){
    const {index, type, value } = e.currentTarget.dataset;
    value.splice(index, 1);
    this.setData({
      [type]: value
    })
  },
  submit(){
    const {payee, express, zhiFuBaoImg, expressImg, qualityImg} = this.data;
    let payeeStatus = false;
    payee.forEach((item, index) => {
      if(item.error || !item.value){
        payeeStatus = true;
      }
    });
    if(payeeStatus){
      wxShowToast('请填写正确的收款信息');
      return
    }
    let expressStatus = false, expressCompany = '', waybillNum = '';
    express.forEach((item, index) => {
      if(item.error || !item.value){
        expressStatus = true;
      }
    });
    if(expressStatus){
      wxShowToast('请填写正确的快递信息');
      return
    }
    if(!zhiFuBaoImg.length){
      wxShowToast('请上传支付宝截图');
      return
    }else{
      saveParam.otherAlipayPic = zhiFuBaoImg.join(',')
    }
    if(!expressImg.length){
      wxShowToast('请上传快递截图');
      return
    }else{
      saveParam.otherExpressPic = expressImg.join(',')
    }
    if(!qualityImg.length){
      wxShowToast('请上传商品质量问题凭证');
      return
    }else{
      saveParam.otherGoodsPic = qualityImg.join(',')
    }
    wx.showLoading({title: '申请中...'});
    submitWayBill(saveParam).then(res => {
      wx.hideLoading();
      wx.showModal({
        title: '申请成功',
        content: '您的信息已经记录，若信息核查无误退款将在1到3个工作日到账，请耐心等待。',
        showCancel: false,
        confirmText: '知道了',
        success (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/dingdanToPay/dingdanToPay'
            })
          }
        }
      })
    }).catch(err => wxShowToast(err.message))
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    saveParam.refundCode = options.refundCode || '';
    saveParam.oriorderCode = options.oriorderCode || '';
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

  }
})