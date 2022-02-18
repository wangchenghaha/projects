// pages/userDaogou/daogouLogin/daogouLogin.js
import { isGuide, loginBind, guideBindOpenid, getGuideInfoByOpenId, getDAInfo } from '../../service/guide'
import { getCode } from '../../service/wsc'
import { KEYSTORAGE } from '../../src/const'
import { splitImg } from '../../utils/utils'
import { wxShowToast } from '../../utils/wxMethods'
const sha = require('../../utils/sha512.min.js');
const app = getApp();
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logoImg: splitImg('logo-white-rect.png'),
    user: {
      img: splitImg('logo-black-square.png'),
      name: ''
    },
    daogou_name: '',
    daogou_number: '',
    dp_name: '',
    dp_daima: '',
    daogou_phone: '',
    daogou_yanzhengma: '', 
    fasong_text: '发送验证码',
    // 是否公司手机
    phoneType: 2,
    // 是否公司设备 1: 公司， 2： 个人
    deviceType: 2,
    wxPhone: wx.getStorageSync(KEYSTORAGE.wxPhone) || ''
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
    let user = wx.getStorageSync('userInfo');
    if( user.nickName ){
      this.setData({
        'user.img': user.avatarUrl,
        'user.name': user.nickName
      });
    }
    curOptions = options;
    this.setData({
      deviceType: options.deviceType || 2,
      phoneType: options.phoneType || 2
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
  
  },

  goBack: function(){
    app.goBack();
  },
  inputing: function(e){
    let thisIndex = e.currentTarget.dataset.inp;
    let thisValue = e.detail.value;
    let inputArr = ['daogou_number', 'dp_name', 'dp_daima', 'daogou_phone', 'daogou_yanzhengma'];
    let setDataObj = {};
    setDataObj[inputArr[thisIndex -1 ]] = thisValue;
    this.setData(setDataObj)
  },

  //查询导购相关信息
  queryInfo(){
    let _staffNO = this.data.daogou_number;
    if( !_staffNO){
      wx.showModal({
        title: '提示',
        content: '请输入员工账号后查询',
        showCancel: false
      });
      return;
    }
    this.setData({
      daogou_name: "",
      dp_name: "",
      dp_daima: "",
      daogou_phone: ""
    });
    //根据导购号查询导购信息
    let getDAInfoParam = `DA00${_staffNO}`;
    let loadingTime = setTimeout( ()=> {
      wx.showLoading({
        title: '请求中...',
        mask: true,
      })
    }, 500);
    getDAInfo(getDAInfoParam).then(res => {
      wx.hideLoading();
      clearTimeout(loadingTime);
      if(res){
        const {staffCnName = '', zzJg12st = '',zzDpdm = '', phone = '' } = res;
        this.setData({
          daogou_name: staffCnName,
          dp_name: zzJg12st || '内部员工',
          dp_daima: zzDpdm || '0000',
          daogou_phone: phone,
        })
      }
    }).catch(err => {
      clearTimeout(loadingTime);
      wxShowToast(err.message);
    });
  },
  //获取验证码
  sendMsg: function(){
    const {fasong_text, daogou_phone, daogou_number, dp_daima} = this.data;
    if (fasong_text !== '发送验证码' || !daogou_phone || !daogou_number ){
      return;
    }
    if (!dp_daima){
      wx.showModal({
        title: '提示',
        content: '导购的店铺代码不能为空',
        showCancel: false
      });
      return;
    }
    if (daogou_phone.length !== 11) {
      wx.showModal({
        title: '提示',
        content: '手机号码不正确',
        showCancel: false
      });
    }
    let param = {
        t:Date.now(),
        staffNO: daogou_number,
        phone: daogou_phone,
        params: sha.sha512(`lz@t=${Date.now()}&staffNO=${daogou_number}&phone=${daogou_phone}@sz`)
    };
    getCode(param).then( res => {
      wxShowToast('发送成功');
      this.handleMsg();
    }).catch( err => {
      wxShowToast(err.message)
    });
  },
  handleMsg: function(){
    let timer = null, time = 30;
    let showText = `${time}s`;
    this.setData({fasong_text: showText});
    timer = setInterval(() => {
      time -= 1;
      showText = `${time}s`;
      if(time < 0) {
        clearInterval(timer);
        showText = '发送验证码'
      }
      this.setData({fasong_text: showText});
    },1000);
  },

  //登录导购个人微商城
  async loginWeMall () {
    let {daogou_number, dp_name, dp_daima, daogou_phone, daogou_yanzhengma, daogou_name} = this.data;
    if (!daogou_number || !dp_name || !dp_daima || !daogou_phone || !daogou_yanzhengma) {
      wx.showModal({
        title: '提示',
        content: '每一项都为必填项，请填写完整后登录',
        showCancel: false
      });
      return;
    }
    let wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const  openID = app.getOpenId();
    
    let loginJson = {
      "employeeId": daogou_number,
      "name": daogou_name,
      "nickName": wxInfo.nickName,
      "shopCode": dp_daima,
      "shopName": dp_name,
      "phone": daogou_phone,
      "unionId": wx.getStorageSync(KEYSTORAGE.unionid),
      "wxOpenId": '',
      "miniOpenId": openID,
      "portraitPic": wxInfo.avatarUrl,
      "code": daogou_yanzhengma
    };
    try {
      let loginWeMallInfo = await loginBind(loginJson);
      let guideInfo = await getGuideInfoByOpenId(openID);
      if(guideInfo.code === 0){
        wx.setStorageSync(KEYSTORAGE.guideInfo, guideInfo.data[0]);
        // 收集用户行为
        let param = Object.assign(curOptions, {eventName: 'register'});
        app._collectData2(param);
        wx.redirectTo({
          url: '/weMall/daogouNav/daogouNav'
        });

      }
    }catch (e) {
      wxShowToast(e.message);
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