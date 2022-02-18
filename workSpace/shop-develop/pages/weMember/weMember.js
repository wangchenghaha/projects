// pages/weMember/weMember.js
import {objToQuery, splitImg} from '../../utils/utils'
import {wxShowToast, wxCopyText} from '../../utils/wxMethods'
import {getWeChatInfo, unionIdByCode, wxGetUserProfile, wxLogin} from "../../service/user";
import {KEYSTORAGE, SUCCESS_STATUS} from "../../src/const";
import {getGuideInfoByOpenId} from "../../service/guide";
import {
  getDADetail,
  isEnterprisePhone,
  isLoginWeMember,
  LOGIN_FAIL,
  sessionKey,
  weMemberOutLogin,
  qYGetCode
} from "../../service/weMember";

const app = getApp();
const {brand, isWeMemberLogin} = app.config;
const systemInfo = wx.getSystemInfoSync();
const weMallLogin = '/weMall/weMemberLogin/weMemberLogin', weMallPage = '/weMall/daogouNav/daogouNav?status=login';
let curOptions = {};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    logo: splitImg('logo-black-rect.png'),
    loginList: ['导购微商城', 'WeMall'],
    steps: [
      {
        show: true,
        text: '授权获取微信个人信息',
        openType: 'getUserInfo'
      },
      {
        text: '授权获取手机号信息',
        openType: 'getPhoneNumber',
        show: !(wx.getStorageSync(KEYSTORAGE.wxWork))
      }
    ],
    wxInfo: '',
    unionId: wx.getStorageSync(KEYSTORAGE.unionid),
    wxPhone: wx.getStorageSync(KEYSTORAGE.wxPhone),
    wxWork: wx.getStorageSync(KEYSTORAGE.wxWork),
    isWeMemberLogin,
    agreePrivacy: false,
  },
  changeCheck(){
    let { agreePrivacy } = this.data;
    agreePrivacy = !agreePrivacy;
    this.setData({ agreePrivacy });
  },
  goClause(){
    app.navigateTo('weMall/userService/userService?tab=1')
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    curOptions = options;
  },
  getUserProfile(){
    const { agreePrivacy } = this.data;
    if(!agreePrivacy){
      wxShowToast('请勾选隐私政策');
      this.setData({animate: true});
      setTimeout( () =>{
        this.setData({animate: false});
      }, 1000);
      return
    }
    wxGetUserProfile().then(wxInfo => {
      this.getUnionId(wxInfo);
    });
  },
  wxWorkLogin(loginStatus, eventValue) {
    let {wxWork} = this.data;
    if (wxWork) {
      wxLogin(true).then(code => {
        const param = {
          type: 2,
          brand: app.config.WE_MEMBER_BRAND[brand],
          code,
        };
        qYGetCode(param).then(res => {
          const wxPhone = res.qiye_mobile;
          if(!wxPhone || !res.da_account){
            wxShowToast('缺少企业手机号或DA号');
            return
          }
          this.setData({wxPhone});
          wx.setStorageSync(KEYSTORAGE.wxPhone, wxPhone);
          wx.setStorageSync(KEYSTORAGE.wxWorkDANum, res.da_account);
          this.weMemberLoin(wxPhone)
        })
      }).catch(err => wxShowToast(err.message))
    } else {
      console.log('个人微信**************')
    }


    /*return new Promise((resolve, reject) => {
      qYGetCode(param).then(res => resolve(res)).catch(err => reject(new Error(err.message)));
    });*/

  },
  async getUnionId(wxInfo){
    try {
      wx.showLoading({title:'正在登录...', mask: true});
      let code = await wxLogin();
      let {openid, unionid} = await unionIdByCode(code);
      wx.setStorageSync(KEYSTORAGE.authed, true);
      wx.setStorageSync(KEYSTORAGE.openid, openid || '');
      wx.setStorageSync(KEYSTORAGE.unionid, unionid || '');
      Object.assign(wxInfo, {openId: openid, unionId: unionid});
      wx.setStorageSync(KEYSTORAGE.wxInfo, wxInfo);
      wx.setStorageSync(KEYSTORAGE.AGREE_PRIVACY, true);
      this.setData({unionId: unionid, wxInfo});
      wx.hideLoading();
      this.loginFn();
    }catch (e) {
      console.log(e)
      wxShowToast(e.message)
    }
  },
  bindGetUserInfo: function (e) {
    if (e.detail.errMsg === 'getUserInfo:ok') {
      wx.showLoading({title: '加载中...', mask: true});
      wxLogin().then(res => {
        return res
      }).then(res => {
        const wxInfoParam = {
          brand: brand,
          js_code: res,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        };
        getWeChatInfo(wxInfoParam).then(res => {
          wx.setStorageSync(KEYSTORAGE.authed, true);
          wx.setStorageSync(KEYSTORAGE.openid, res.openId || '');
          wx.setStorageSync(KEYSTORAGE.unionid, res.unionId || '');
          wx.setStorageSync(KEYSTORAGE.wxInfo, res);
          this.setData({unionId: res.unionId, wxInfo: res});
          wx.hideLoading();
          this.loginFn();
        }).catch(err => wxShowToast(err.message))
      }).catch(err => wxShowToast(err.message))
    }
  },
  getPhoneNumber: function (e) {
    if (e.detail.encryptedData && e.detail.iv) {
      wx.showLoading({title: '加载中...', mask: true});
      app.getWxPhone(e.detail.encryptedData, e.detail.iv).then(wxPhone => {
        wx.hideLoading()
        wx.setStorageSync(KEYSTORAGE.wxPhone, wxPhone);
        this.setData({wxPhone});
        this.weMemberLoin(wxPhone)
      }).catch(err => wxShowToast(err))
    }
  },
  weMemberLoin: function (phone) {
    let {wxPhone} = this.data;
    let sessionKeyParam = {
      unionid: wx.getStorageSync(KEYSTORAGE.unionid),
      openid: app.getOpenId(),
      mobile: phone || wxPhone,
      user: JSON.stringify(wx.getStorageSync(KEYSTORAGE.wxInfo))
    };
    wx.showLoading({
      title: '正在登录...',
      icon: 'none'
    });
    // 检查sessionKey
    sessionKey(sessionKeyParam).then(res => {
      let sessionKey = res.session_key;
      if (sessionKey) {
        wx.setStorageSync(KEYSTORAGE.sessionKey, sessionKey);
        return sessionKey
      }
    }).then(key => {
      //  查询是否企业手机号
      let checkPhoneParam = {
        mobile: phone || wxPhone,
        key,
      };
      isEnterprisePhone(checkPhoneParam).then(res => {
        // 个人手机：type=2 ； 公司手机：type=1 ；
        wx.setStorageSync(KEYSTORAGE.phoneType, res.type);
        return res.type;
      }).then((type) => {
        // 是否登录
        let isLoginParam = {
          device: systemInfo.model,
          key
        };
        console.log(systemInfo, 'systemInfo****');
        isLoginWeMember(isLoginParam).then(isLoginRes => {
          const modelInfo = systemInfo.model;
          let deviceType = (modelInfo.toUpperCase().includes('BESTSELLER') || modelInfo === 'unknown<iPad6,11>') ? 1 : 2;
          let options = {key, wxPhone, deviceType, phoneType: type};
          wx.setStorageSync(KEYSTORAGE.deviceType, deviceType);
          wx.hideLoading();
          const curLoginPhone = type === 1 ? '企业手机' : '个人手机';
          const curLoginWX = deviceType === 1 ? '企业手机' : '个人微信';
          const eventValue = `${curLoginPhone}: ${wxPhone}_${curLoginWX}: ${modelInfo}`;
          wx.setStorageSync(KEYSTORAGE.shareDevice, eventValue);
          if (isLoginRes.code === LOGIN_FAIL) {
            this.creatFile('WEMEMBER未登录', eventValue);
            wx.redirectTo({
              url: `${weMallLogin}${objToQuery(options)}`
            })
          } else {
            this.creatFile('WEMEMBER已登录', eventValue);
            wx.setStorageSync(KEYSTORAGE.sessionKeyTime, Date.now());
            this.loginGetDAInfo(isLoginRes.data.da);
          }
        }).catch(err => wxShowToast(err.message))
      }).catch(err => wxShowToast(err.message))
    }).catch(err => wxShowToast(err.message))
  },
  outLogin: function (data) {
    weMemberOutLogin(data).then(res => {
      app.goBack();
    }).catch(err => wxShowToast(err.message))
  },
  loginGetDAInfo: function (da) {
    let getSysUserParam = {
      key: wx.getStorageSync(KEYSTORAGE.sessionKey),
      brand: app.config.WE_MEMBER_BRAND[brand]
    };
    wx.showLoading({
      title: '正在登录...',
    });
    let param = {
      key: getSysUserParam.key,
      staff_no: da || '',
    };
    app.getGuideInfo(param).then(res => {
      wx.hideLoading();
      const curPath = wx.getStorageSync(KEYSTORAGE.curPath) || '';
      wx.redirectTo({url: curPath || weMallPage});
    }).catch(err => wxShowToast(err.message))
    return;
    getDADetail(getSysUserParam).then(res => {
      if (res.errcode === SUCCESS_STATUS || res.errcode === '0') {
        if (!res.data.staff_no) {
          wx.hideLoading();
          const that = this;
          wx.showModal({
            title: '用户信息不完整',
            content: getSysUserParam.key,
            cancelText: '复制',
            confirmText: '退出',
            success(res) {
              if (res.confirm) {
                that.outLogin(getSysUserParam)
              } else if (res.cancel) {
                wx.setClipboardData({
                  data: getSysUserParam.key,
                  success(res) {
                    app.goBack()
                  }
                })
              }
            }
          });
          return;
        }

      }
    }).catch(err => wxShowToast(err.message));
  },
  onTabItemTap(item){
    app.gioTrack('pageclick_home_shoppers')
  },
  creatFile(eventName, eventValue) {
    // 埋点
    let param = Object.assign(curOptions, {eventName, eventValue});
    const isWXWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
    if(isWXWork){
      Object.assign(param, {utm_source: 'enterpise_wechat_login'})
    }
    app._collectData2(param);
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
    // 隐私政策
    const agreePrivacy = wx.getStorageSync(KEYSTORAGE.AGREE_PRIVACY);
    this.setData({
      agreePrivacy,
    });
    this.loginFn();
  },
  handleLogin(){
    const curPath = wx.getStorageSync(KEYSTORAGE.curPath) || '';
    wx.redirectTo({url: curPath || weMallPage});
  },
  weMallLogin() {
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    if (wxInfo) {
      const openid = app.getOpenId();
      const {employeeId} = wx.getStorageSync(KEYSTORAGE.guideInfo);
      getGuideInfoByOpenId(openid).then(res => {
        if (res.code === 0) {
          if (Array.isArray(res.data) && res.data.length) {
            this.handleLogin()
          }
        }
      }).catch(err => wxShowToast(err.message))
    }
  },
  loginFn: function () {
    const {wxWork} = this.data;
    const unionId = wx.getStorageSync(KEYSTORAGE.unionid), wxPhone = wx.getStorageSync(KEYSTORAGE.wxPhone);
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    this.setData({unionId, wxPhone, wxInfo});
    if (isWeMemberLogin) {
      if (wxWork && wxInfo) {
        this.wxWorkLogin();
        return;
      }
      if (wxInfo && wxPhone) {
        const sessionKeyTime = wx.getStorageSync(KEYSTORAGE.sessionKeyTime);
        const curDate = Date.now();
        const {employeeId = ''} = wx.getStorageSync(KEYSTORAGE.guideInfo);
        if(employeeId.startsWith('DA')){
          if (sessionKeyTime && curDate - sessionKeyTime <= 60 * 60 * 1000) {
            this.handleLogin();
            return
          }
        }
        this.weMemberLoin(wxPhone)
      }
      return;
    }
    this.weMallLogin();
  },


})
