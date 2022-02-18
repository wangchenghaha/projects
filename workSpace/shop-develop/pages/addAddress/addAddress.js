import {checkAndGetProvincesInfo} from '../../service/location.js';
import {addAddress, updateAddress} from '../../service/member';
import {wxShowToast} from '../../utils/wxMethods'
import {filterStr} from '../../utils/utils'
import { REGEXP } from '../../src/const'
const cityJS = require('../../utils/city.js');
const app = getApp();

let xiugaiAddress = '';
let xiugaiAddress_id = '';
const chineseReg = REGEXP.CHINESEREG;
const strReg = REGEXP.STRREG;

Page({

  //页面的初始数据
  data: {
    region: ['-省或市-', '-城市-', '-地区-'],
    regionCode: [],
  // 判断是否是iphoneX
  isIphoneX: app.globalData.isIPhoneX,
    opacity : false,

    User : {
      name : {
        value : '',
        tishi: false
      },
      shengshi: {
        tishi: false
      },
      chengshi: {
        tishi: false
      },
      diqu: {
        tishi: false
      },
      address: {
        value: '',
        tishi: false
      },
      phone: {
        value: '',
        tishi: false,
        tishiValue : '请填写手机号'
      }
    },

    index1: 0,
    index2: 0,
    index3: 0,
    submitType : 0,
    isChecked :false,
  },
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail);
    const {value, code} = e.detail;
    if(value[1].includes('行政')){
      // 解决hybris不认的行政区，单独的县， 比如重庆
      value[1] = value[2];
    }
    // 直辖市的县修改为市
    if(value[1] === '县'){
      value[1] = value[0]
    }
    this.setData({
      region: value,
      regionCode: code,
    })
  },
  //生命周期函数--监听页面加载
  onLoad: function (options) {
    cityJS.init(this);
  },

  //生命周期函数--监听页面初次渲染完成
  onReady: function () {

  },
  getLocalAddress(){
    const that = this;
    xiugaiAddress = wx.getStorageSync('xiugaiAddress');
    var isGetWxAddress = wx.getStorageSync('getWxAddress');
    if( xiugaiAddress.userName ){
      xiugaiAddress_id = xiugaiAddress.id;
      const {phone, userName, province, provinceCode, city, cityCode, area, areaCode, detailAddress} = xiugaiAddress;
      this.setRegion([province, city, area], [provinceCode, cityCode, areaCode]);
      this.setData({
        submitType:1,
        isChecked: xiugaiAddress.checked,
        'User.name.value': userName,
        'User.phone.value': phone,
        'User.address.value': detailAddress
      });
    }else{
      this.setData({
        'submitType': 0
      });
      if( isGetWxAddress==1 ){
        //询问用户是否使用微信收货地址
        wx.showModal({
          title: '提示',
          content: '是否使用微信收货地址？',
          success: function (res) {
            wx.showLoading({
              title: '加载中'
            });
            if (res.confirm) {
              that.getwxAddress()
            }
            wx.hideLoading();
          }
        });
      }
      else if (isGetWxAddress==2){
        //补充地址，调用自动填写地址
        that.getAddress()
      }
    }
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    this.getLocalAddress();
    app.track()
  },

  //上拉触底
  onReachBottom:function(){

  },

  checkUsername: function(e){
    let username = filterStr(e.detail.value);
    this.setData({
      "User.name.value" : username
    });
    if(!strReg.test(username)){
      wxShowToast('请填写简体中文');
      this.clearName();
    }
  },

  //一键清除姓名
  clearName : function(e){
    this.setData({
      "User.name.value": ''
    });
  },

  //省/市 的 选择
  bindPickerChange1: function (e) {
    this.setData({
      index1: Number(e.detail.value),
      index2: 0,
      index3: 0
    });
    const current_value = e.detail.value;
    cityJS.change(1,current_value, this);
  },

  //城市 的 选择
  bindPickerChange2: function (e) {
    this.setData({
      index2: Number(e.detail.value),
      index3: 0
    });
    const current_value = e.detail.value;
    cityJS.change(2,current_value, this);
  },

  //地区 的 选择
  bindPickerChange3: function (e) {
    this.setData({
      index3: Number(e.detail.value)
    });
    const current_value = e.detail.value;
    cityJS.change(3,current_value, this);
  },
  
  //地址填写
  userAddress : function(e){
    this.setData({
      "User.address.value": filterStr(e.detail.value)
    });
  },
  checkAddress: function(e){
    let address = filterStr(e.detail.value);
    this.setData({
      "User.address.value" : address
    });
    if(!strReg.test(address)){
      wxShowToast('请填写汉字、字母、数字');
      this.setData({
        "User.address.value" : ''
      });
    }
  },

  //手机号填写
  userPhone: function (e) {
    let phone = filterStr(e.detail.value);
    this.setData({
      "User.phone.value": phone,
    });
  },
  checkPhone: function(e){
    let phone = filterStr(e.detail.value);
    if(phone.length < 11){
      wxShowToast('请输入正确的11位手机号');
    }
  },
  wxAddress:function(){
    const that = this;
    wx.chooseAddress({
      success: function (res) {
        wx.setStorageSync('getWxAddress', 0);
        const {provinceName, cityName, countyName, detailInfo = '', userName = '', telNumber = ''} = res;
        that.setRegion([provinceName, cityName, countyName]);
        that.setData({
          'User.address.value': detailInfo,
          "User.phone.value": telNumber,
          "User.name.value": userName,
        });
        wx.hideLoading();
      }
    });
  },
  setRegion(regionArr, regionCodeArr){
    let {region, regionCode} = this.data;
    regionCode = regionCodeArr || [cityJS.getCodeSheng(regionArr[0]) || '', cityJS.getCodeCity(regionArr[1]) || '', cityJS.getCodeQu(regionArr[2]) || ''];
    region = regionArr;
    this.setData({region, regionCode})
  },
  getwxAddress:function(){
    wx.setStorageSync('getWxAddress', 0);
    const that = this;
    wx.getSetting({
      success: res => {
      if (!res.authSetting['scope.address']){
        wx.authorize({
          scope: 'scope.address',
          success: res => {
            that.wxAddress()
          },
          fail: () => {
            wx.showModal({
              title: '获取你的通讯地址', //提示的标题,
              content: '您的通讯地址将用于快速帮您填写收货地址', //提示的内容,
              showCancel: true, //是否显示取消按钮,
              cancelText: '取消', //取消按钮的文字，默认为取消，最多 4 个字符,
              cancelColor: '#000000', //取消按钮的文字颜色,
              confirmText: '设置', //确定按钮的文字，默认为取消，最多 4 个字符,
              confirmColor: '#3CC51F', //确定按钮的文字颜色,
              success: res => {
                if (res.confirm) {
                  wx.openSetting({ success: res => {
                    if (res.authSetting['scope.address']){
                      that.wxAddress()
                    }
                  } });
                } 
              }
            });
          }
        });
      }
      else{
        that.wxAddress()
      }
     }
    });
    
  },
  getAddress: function(){
    let address = wx.getStorageSync('zidongAddress');
    if (address){
      console.log(address,`----------------------------------------`)
      const {province, city, area} = address;
      this.setRegion([province, city, area]);
      this.setData({
        'User.address.value': address.detailAddress,
      });
      wx.removeStorageSync('zidongAddress');
    }else{
      wx.showLoading({
        title: '加载中...',
        mask: true
      });
      checkAndGetProvincesInfo().then(data=>{
        wx.hideLoading();
        const {province, city, district} = data.ad_info;
        this.setRegion([province, city, district]);
        if (data.address_component.street_number){
          this.setData({
            'User.address.value': data.address_component.street_number,
          });
        }
      }).catch(err => wxShowToast(err.message))
    }
    
  },

  switchChange: function(e){
    this.setData({
      isChecked : e.detail.value,
    });
  },

  //保存地址
  saveAddress: function (e) {
    const {isChecked, region, regionCode, submitType} = this.data;
    const Data = this.data;
    const name = Data.User.name.value;  //姓名
    const dizhi = Data.User.address.value;    //地址
    let phone = Data.User.phone.value;     //手机
    const regionFilter = region.filter(item => item.includes('-') || !item);
    if(regionFilter.length){
      wxShowToast('请选择省市区');
      return;
    }
    /*if(province.includes('-') || city.includes('-') || area.includes('-')){
      wxShowToast('请选择省市区');
      return;
    }*/
    if(!name || !phone || !dizhi){
      wxShowToast('请填写完整收货信息');
      return;
    }
    if(name.length > 20){
      wxShowToast('姓名过长，请修改');
      return;
    }
    if(!REGEXP.PHONEREG.test(phone)){
      wxShowToast('手机号填写错误！');
      return;
    }
    const detailAddress = Data.User.address.value;
    if(detailAddress){
      if(detailAddress.length < 10){
        wxShowToast('详细地址不能少于10位');
        return;
      }
      if(detailAddress.length > 50){
        wxShowToast('详细地址过长，请修改');
        return;
      }
    }else{
      wxShowToast('填写详细地址');
        return;
    }
    
    const param = {
      userName: name,
      detailAddress: detailAddress,
      phone,
      province: region[0],
      provinceCode: regionCode[0] ? regionCode[0].slice(0,2) :'',
      city: region[1],
      cityCode: regionCode[1] ? regionCode[1].slice(0,4) : '',
      area: region[2],
      areaCode: regionCode[2] ? regionCode[2].slice(0,6) :'',
      defaultAddress: isChecked ? 'Y' : 'N',
    };
    if( submitType === 0 ){
      //可以保存地址了
      try {
        app.tdSdkEvent('flow_purchase_order_address_save', {
          CE_NAME: name,
          CE_PRI: region[0],
          CE_CITY: region[1],
          CE_REGION: region[2],
          CE_ADRS: detailAddress,
          CE_PHONE: phone
        })
        app.gioTrack('flow_purchase_order_address_save', {
          receiveProvince: region[0],
          receiveCity: region[1],
          receiveArea: region[2],
          receiveName: name,
        })
      }catch (e) { }

      //保存地址
      addAddress(param).then(res => {
        if(res){
          wx.navigateBack({
            delta: 1
          });
        }
      }).catch(err => wxShowToast(err.message));
    }else if(submitType === 1){
      //修改后的地址
      //保存修改后的地址
      param.id = xiugaiAddress_id;
      updateAddress(param).then(res => {
        if(res){
          wx.navigateBack({
            delta: 1
          });
        }
      }).catch(err => wxShowToast(err.message));
    }
    var address= [];
    address.push(param)
    wx.setStorageSync('dingdanAddress', address[0]);
  }

})