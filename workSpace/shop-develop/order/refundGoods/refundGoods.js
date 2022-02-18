import {KEYSTORAGE, REGEXP} from '../../src/const'
import {wxShowToast} from "../../utils/wxMethods";
import {refundApply} from "../../service/refund";
import {chooseFile, uploadImage} from "../../service/upload";

const productProblem = '质量问题';
const refundGoodsReason = ['7天无理由退款', '多拍/拍错', productProblem, '未按约定时间发货', '不想要/不喜欢', '尺码不合适', '价格问题（未用券/差价/邮费）', '其他（请下方备注）'];
;
const app = getApp();
const {brand, cdn} = app.config;
Page({
  data: {
    orderDetail: [],
    refundReason: [],
    showReasonList: false,
    selectReasonValue: '',
    myReason: '', // 自定义原因
    needMyReason: false,
    showUpload: false,
    uploadImg: [],
    tempUploadImg: [], // 临时图片，并没有上传服务器
  },

  onLoad: function (options) {
    this.handleReason();
  },
  delUploadImg(e) {
    const {index} = e.currentTarget.dataset;
    const {tempUploadImg} = this.data;
    tempUploadImg.splice(index, 1);
    this.setData({tempUploadImg})
  },
  upload(e) {
    let {uploadImg, tempUploadImg} = this.data;
    const maxCount = 3 - tempUploadImg.length;
    if (tempUploadImg.length >= maxCount) {
      wxShowToast('最多3张图片');
      return;
    }
    chooseFile(maxCount).then(res => {
      if (res && res.length) {
        console.log(res);
        tempUploadImg = tempUploadImg.concat(res);
        this.setData({tempUploadImg})
      } else {
        wxShowToast('上传失败，请重试')
      }
    }).catch(err => wxShowToast(err.message))
  },
  handleReason() {
    let {refundReason, orderDetail} = this.data;
    orderDetail = wx.getStorageSync(KEYSTORAGE.orderInfo);
    refundGoodsReason.forEach(item => refundReason.push({text: item}));
    this.setData({refundReason, orderDetail});
  },
  myInput(e) {
    this.setData({myReason: e.detail.value});
  },
  onClick(e) {
    const {type} = e.currentTarget.dataset;
    switch (type) {
      case 'checkGoods':
        this.selectRefundGoods(e);
        break;
      case 'checkReason':
        this.selectReason(e);
        break;
      case 'reasonConfirm':
        this.confirmReason();
        break;
      case 'confirmGoods':
        this.showReason(e);
        break;
      case 'hide':
        this.hideReason(e);
        break;
      case 'delImg':
        this.delUploadImg();
        break;
    }
  },
  hideReason(e) {
    this.setData({
      showReasonList: false,
      myReason: ''
    });
  },
  showReason(e) {
    let {orderDetail, showReasonList} = this.data;
    for (let item of orderDetail.goodsOrderPoList) {
      if (item.myChecked) {
        showReasonList = true;
        break;
      }
    }
    if (!showReasonList) {
      wxShowToast('请选择商品');
      return;
    }
    this.setData({showReasonList})
  },
  async confirmReason(e) {
    let {selectReasonValue, myReason, tempUploadImg, uploadImg} = this.data;
    if (!selectReasonValue) {
      wxShowToast('请选择退单原因');
      return;
    } else if (selectReasonValue.includes('其他')) {
      if (myReason) {
        if (!REGEXP.STRREG2.test(myReason)) {
          wxShowToast('请填写汉字、字母、和数字');
          this.setData({
            needMyReason: true,
            myReason: ''
          });
          return;
        }
      } else {
        wxShowToast('请输入其他原因');
        this.setData({needMyReason: true});
        return;
      }
    }
    this.setData({needMyReason: false});
    const param = {};
    console.log(param, '***');
    if (tempUploadImg.length) {
      const uploadParam = {
        moduleName: `/assets/wechat/${brand}/service/`
      };
      tempUploadImg.forEach(async (item, index) => {
        let uploadFile = await uploadImage(item, uploadParam);
        uploadImg.push(uploadFile);
        if(uploadImg.length === tempUploadImg.length){
          this.setData({uploadImg});
          console.log('上传完成****');
          this.refundApplyFn(param);
        }
      });
    }else{
      this.refundApplyFn(param)
    }


    /*;*/
  },
  refundApplyFn(param){
    refundApply(param).then(res => {
      if(res){

      }
    }).catch(err => wxShowToast(err.message))
  },
  selectReason(e) {
    const {index} = e.currentTarget.dataset;
    let {refundReason, selectReasonValue, showUpload} = this.data;
    refundReason.forEach((item, ind) => {
      if (index === ind) {
        item.checked = !item.checked;
        selectReasonValue = selectReasonValue === item.text ? '' : item.text;
        showUpload = selectReasonValue === productProblem
      } else {
        item.checked = false;
      }
    });
    this.setData({refundReason, selectReasonValue, showUpload})
  },
  selectRefundGoods(e) {
    const {index} = e.currentTarget.dataset;
    const {orderDetail} = this.data;
    const curGoods = orderDetail.goodsOrderPoList[index];
    if (curGoods.refundCount > 0) {
      wxShowToast('该商品已退，请选择其他商品');
      return;
    }
    curGoods.myChecked = !curGoods.myChecked;
    this.setData({orderDetail});
  }
});