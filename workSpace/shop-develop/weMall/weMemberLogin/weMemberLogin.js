// weMall/weMemberLogin/weMemberLogin.js
import {KEYSTORAGE} from "../../src/const";
import {wxShowToast} from '../../utils/wxMethods'
import {splitImg} from "../../utils/utils";
import {loginWeMember, sendMsg, weMemberLogin, qYGetCode, qYWEMemberLogin} from "../../service/weMember";
const app = getApp();
const DANum = 6;
const brand = app.config.brand;
let curOptions = {};
let loginPhone = '';
let numberArrInit = [], codeArrInit = [];
for(let i = 0; i < DANum; i++){
  numberArrInit.push('');
  codeArrInit.push('')
}
let key = '', mobile = '';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    numberArr: numberArrInit,
    guideInfo: {
      shopName: '',
      shopCode: '',
      curLoginPhone: '',
      curLoginWX: '',
      privatePhone: ''
    },
    logo: splitImg('logo-black-rect.png'),
    codeArr: codeArrInit,
    showClose: false,
    sixDANum: '',
    code: '',
	  wxWork: wx.getStorageSync(KEYSTORAGE.wxWork),
    // 是否个人登录（个人工号，虚拟工号）
    personalLogin: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
    console.log(curOptions,'*********curOptions')
    key = wx.getStorageSync(KEYSTORAGE.sessionKey) || curOptions.key;
	  mobile = ''
  },
  onClick: function(e){
    const dataType = e.currentTarget.dataset.type;
    switch (dataType){
      case 'confirm':
        this.getDAInfo();
        break;
      case 'DAInput':
        this.numberChange(e);
        break;
      case 'weMemberLogin':
        this.sendCode();
        break;
      case 'codeInput':
        this.codeInput(e);
        break;
      case 'close':
        this.changeCodeShow(false);
        break;
      case 'login':
        this.weMemberLogin();
        break;
      case 'goBack':
        app.goBack();
        break;
    }
  },
  // 切换登录方式
  switchLogin(){
    let {personalLogin, sixDANum, numberArr} = this.data;
    // 清空输入的值
    sixDANum = '', numberArr.fill('');
    this.setData({personalLogin: !personalLogin, sixDANum, numberArr})
  },
  weMemberLogin: function(){
    const wxData = this.data;
    const code = wxData.code;
    if(!code){
      wxShowToast('请输入验证码');
      return;
    }

    wx.showLoading({
      title: '正在登录...',
    });
    let param = {
      mobile: curOptions.wxPhone || wx.getStorageSync(KEYSTORAGE.wxPhone),
      key,
      da_number: wxData.sixDANum,
      device: wx.getSystemInfoSync().model || '',
      code
    };
    weMemberLogin(param).then(res => {
      wx.hideLoading();
      const {mobile, device} = param;
      this.guideLoginSuccess({mobile, device})
    }).catch(err => wxShowToast(err.message))
  },
  changeCodeShow: function(show){
    this.setData({showClose: show, code: '', codeArr: codeArrInit});
  },
  codeInput: function(e){
    const value = e.detail.value.replace(/[\D]/g, '');
    const arr = value.split('');
    const maxValueLength = 6;
    let codeArr = [...arr];
    while (codeArr.length < maxValueLength) {
      codeArr.push('')
    }
    this.setData({codeArr, code: value});
  },
	formatName(name) {
		let newStr;
		if (name.length === 2) {
			newStr = name.substr(0, 1) + '*';
		} else if (name.length > 2) {
			let char = '';
			for (let i = 0, len = name.length - 2; i < len; i++) {
				char += '*';
			}
			newStr = name.substr(0, 1) + char + name.substr(-1, 1);
		} else {
			newStr = name;
		}
		return newStr;
	},
  getDAInfo: function(e){
    let staff_no = this.data.sixDANum;
    if(staff_no.length !== DANum){
      wxShowToast('请输入6位员工号');
      return;
    }
    let param = { key, staff_no };
    wx.showLoading({
      title: '请求中...'
    });
    let guideInfo = this.data.guideInfo;
    guideInfo.guideName = '';
    app.getGuideInfo(param).then( res => {
      wx.hideLoading();
      const staffName = res.STAFF_NAME;
	    mobile = res.MOBILE_PHONE;
      const guideInfo = {
        guideName: this.formatName(staffName),
        guidePhone: res.MOBILE_PHONE,
        shopName: res.shopName || '',
        shopCode: res.shopCode,
        curLoginPhone: curOptions.deviceType === '1' ? '企业手机' : '个人手机',
        curLoginWX: curOptions.phoneType === '1' ? '企业手机' : '个人微信',
        privatePhone: res.MOBILE_PHONE.replace(/(.{3}).*(.{4})/, '$1****$2'),
      };
      this.setData({guideInfo})
      app.gioTrack('pageclick_shoppers_bind', {
        bind_id: staff_no,
        store_id: res.shopCode || '0000'
      })
    }).catch(err => {
    	this.setData({guideInfo});
	    wxShowToast(err.message)
	  })
  },
  numberChange: function(e){
    const {personalLogin} = this.data;
    let {value} = e.detail;
    if(personalLogin){
      // 个人登录，只能填写数字
      value = value.replace(/[\D]/g, '')
    }
    const arr = value.toUpperCase().split('');
    let numberArr = [...arr];
    while (numberArr.length < DANum) {
      numberArr.push('')
    }
    this.setData({numberArr, sixDANum: value});
  },
  sendCode: function(){
    let phone = mobile;
    if(curOptions.deviceType === '1' && curOptions.phoneType === '1'){
      phone = curOptions.wxPhone || wx.getStorageSync(KEYSTORAGE.wxPhone);
    }
    loginPhone = phone;
		const {wxWork} = this.data;
		if(wxWork){
			const qyParam = {
				key: wx.getStorageSync(KEYSTORAGE.sessionKey),
				brand: app.config.WE_MEMBER_BRAND[brand],
				device: wx.getSystemInfoSync().model,
				da_account: this.data.sixDANum,
				code: '000000',
				qiye_mobile: phone
			};
			wx.showLoading({title: '登录中...'});
			qYWEMemberLogin(qyParam).then(res => {
				const loginInfo = {
					device: qyParam.device,
					mobile: phone
				};
				this.guideLoginSuccess(loginInfo)
			}).catch(err => wxShowToast(err.message));
			return;
		}
    let sendMsgParam = {
      key,
      mobile: phone,
      brand: app.config.WE_MEMBER_BRAND[brand]
    };
    sendMsg(sendMsgParam).then(res => {
      this.changeCodeShow(true);
    }).catch(err => wxShowToast(err.message));
  },
  guideLoginSuccess: function(loginInfo){
    wx.hideLoading();
    const {mobile, device} = loginInfo;
    const {wxWork} = this.data;
    let { curLoginPhone, curLoginWX } = this.data.guideInfo;
    // 埋点
	  const eventValue = `${curLoginPhone}: ${mobile}_${curLoginWX}: ${device}`;
    let param = Object.assign(curOptions, {
    	eventName: wxWork ? 'WEMEMBER企业微信登录' : 'WEMEMBER登录',
	    eventValue
    });
    wx.setStorageSync(KEYSTORAGE.shareDevice, eventValue);
    if(wxWork){
      Object.assign(param, {utm_source: 'enterpise_wechat_login'})
    }
    app._collectData2(param);
    app.gioTrack('pageclick_share_login');
    const curPath = wx.getStorageSync(KEYSTORAGE.curPath) || '';
    wx.redirectTo({
      url: curPath || '/weMall/daogouNav/daogouNav?status=login'
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
		const {wxWork} = this.data;
		if(wxWork){
			const wxWorkDA = wx.getStorageSync(KEYSTORAGE.wxWorkDANum);
			if(wxWorkDA){
				this.setData({
					sixDANum: wxWorkDA,
					numberArr: wxWorkDA.split('')
				});
				this.getDAInfo();
			}
		}
  },

})
