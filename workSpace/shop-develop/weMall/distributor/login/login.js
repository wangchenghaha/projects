import {distributorLogin, distributorGetCode, distributorInfoByFxId} from '../../../service/index'
import {securityCode} from '../../../service/service'
import {getCode} from '../../../service/member'
import {wxShowToast} from '../../../utils/wxMethods'
import {KEYSTORAGE, REGEXP} from '../../../src/const'
const formPhone = 'phone', formSecurity = 'securityCode', formCode = 'code';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    wxInfo: wx.getStorageSync(KEYSTORAGE.wxInfo),
    formArr: [
      {
        placeholder: '请输入手机号',
        inputType: 'number',
        type: formPhone,
        writable: true,
        value: ''
			},
      {
        placeholder: '请计算右侧结果',
        inputType: 'text',
        type: formSecurity,
        writable: true,
        value: '',
        imgUrl: ''
      },
			{
        placeholder: '请输入验证码',
        inputType: 'number',
        type: formCode,
        writable: true,
        value: ''
      }
    ],
    countDown: '',
    isLogin: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 获取图形验证码
  getSecurityCode(){
    securityCode().then(res => {
      if(res){
        const {formArr} = this.data;
        formArr.forEach(item => {
          if(item.type === formSecurity){
            item.imgUrl = res;
          }
        });
        this.setData({formArr})
      }
    }).catch(err => wxShowToast(err.message))
  },
  // 判断本地是否登录
  getLocalInfo(){
    const guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);
    if(guideInfo && guideInfo.employeeId && guideInfo.employeeId.startsWith('FX')){
      this.setData({isLogin: true});
      setTimeout(()=> {
        this.loginJump();
      }, 1500);
    }else{
      this.getSecurityCode();
    }
  },
  inputText(e){
    const {value} = e.detail;
    const {type} = e.currentTarget.dataset;
    const {formArr} = this.data;
    formArr.forEach(item => {
      if(item.type === type){
        item.value = value
      }
    });
    this.setData({formArr})
  },
  sendCode(){
    let {formArr, countDown} = this.data;
    const phone = formArr[0].value;
    const securityValue = formArr[1].value;
    if(this.checkPhone(phone)){
      return;
    }
    this.hideErrorTip(formPhone);
    if(!securityValue){
      wxShowToast('请填写图形验证码');
      this.setErrorTip(formSecurity);
      return;
    }
    this.hideErrorTip(formSecurity);
    let timer = null, time = 60;
    countDown = `${time}s`;
    getCode(phone, securityValue).then(res => {
      if(res){
        this.setData({countDown});
        timer = setInterval(() => {
          time -= 1;
          countDown = `${time}s`;
          if(time < 0) {
            clearInterval(timer);
            countDown = ''
          }
          this.setData({countDown});
        },1000);
      }
    }).catch(err => wxShowToast(err.message))
  },
  loginJump(){
    wx.redirectTo({
      url: '../home/home',
    })
  },
  checkPhone(phone){
    if(!phone || !REGEXP.PHONEREG.test(phone)){
      wxShowToast('请填写正确的手机号');
      this.setErrorTip(formPhone);
      return true
    }
  },
  setErrorTip(type){
    const {formArr}= this.data;
    for(let item of formArr){
      if(item.type === type){
        item.shake = true;
        item.error = true;
        break;
      }
    }
    this.setData({formArr});
    setTimeout(() => {
      this.hideErrorTip(type, 'shake');
    },1000);
  },
  /**
   *
   * @param type 表单类型
   * @param errType 表单类型下的 shake or error
   */
  hideErrorTip(type, errType){
    const {formArr}= this.data;
    for(let item of formArr){
      if(item.type === type){
        if(errType){
          item[errType] = false
        }else{
          item.shake = item.error = false;
        }
        break;
      }
    }
    this.setData({formArr})
  },
  login() {
    const {formArr}= this.data;
    const param = {};
    formArr.forEach(item => {
      if(item.type === formPhone){
        param.phone = item.value;
      }
      if(item.type === formCode){
        param.password = item.value;
      }
    });
    const {phone = '', password = ''} = param;
    // 检查手机号
    if(this.checkPhone(phone)){
      return;
    }
    this.hideErrorTip(formPhone);
    if(!password){
      wxShowToast('请填写验证码');
      this.setErrorTip(formCode);
      return
    }
    this.hideErrorTip(formCode);
    wx.showLoading({
      title: '登录中',
      mask: true
    });
    distributorLogin(param).then(res => {
      wx.hideLoading();
      if(res){
        const {distributor = {}} = res;
        const {virtualShopCode = '', distributorId='',} = distributor;
        Object.assign(distributor, {
          shopCode: virtualShopCode,
          employeeId: distributorId,
        });
        wx.setStorageSync(KEYSTORAGE.guideInfo, distributor);
        this.loginJump();
      }
    }).catch(err => {
      console.log(err,'**');
      wxShowToast(err.message)
    })
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
    this.getLocalInfo();
  },


})