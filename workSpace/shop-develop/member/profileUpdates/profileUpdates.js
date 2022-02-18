// pages/main/index.js
var pagePath = "../../";
var main = require(pagePath + "base/main.js");
var url = require(pagePath + "base/url.js");
import { updateCRMInfo } from '../../service/member'
import { wxShowToast } from '../../utils/wxMethods'
var app = getApp();
const genderArr = ['male','female']
const { URL_CDN,KEYSTORAGE } = require('../../src/const');
const brand = app.config.brand;
const isJL = app.config.isSaleForce;
Page({
    data: {
      header: URL_CDN.LOGO_BLACK_SQUARE,
        genderArray:['先生','女士'],
        g_index:0,
        date: '请选择',
        endDate:main.getYYMMDD(),
        disabled:false,
        email:'',
      bgImg:URL_CDN.MEMBER_MODIFY_BG
    },
    onLoad: function(options) {
        var userInfo = wx.getStorageSync('userInfo')
        this.setData({
            header:userInfo.avatarUrl
        })

    },
    onReady: function() {

    },
    onShow: function(options) {
      this.getLocalCRMInfo();
      app.track();
    },
    // 获取本地CRM信息
    getLocalCRMInfo(){
      const info = wx.getStorageSync(KEYSTORAGE.crmInfo);
      this.setData({
        phone:info.phone,
        name:info.name,
        g_index: info.gender === 'male' ? 0 : 1,
        date:info.birthday ? info.birthday :'请选择',
        disabled: !(!info.birthday),
        email:info.email
      });
    },
    onHide: function() {
        // 页面隐藏
    },
    bindPickerChange: function(e) {
      const type = e.currentTarget.dataset.type;
      switch(type){
        case "name":
          this.setData({
            name: e.detail.value
          });
        break;
        case "gender":
          this.setData({
            g_index: e.detail.value
          });
        break;
        case "birthday":
          this.setData({
            date: e.detail.value
          });
        break;
        case "email":
          this.setData({
            email: e.detail.value
          });
        break;
      }
    },
    submit:function(){
        const that = this;
        const CRMInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
        let info = {
          name:that.data.name,
          sex:that.data.genderArray[that.data.g_index],
          email:that.data.email,
          birth:that.data.date
        };
        if(isJL){
          info = {
            memberno: CRMInfo.memberno,
            phone: CRMInfo.phone,
            name: this.data.name,
            gender: genderArr[this.data.g_index],
            email:this.data.email || '',
            birthday:this.data.date !== '请选择' ? this.data.date :'',
          }
        }
        if (/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(info.email) || info.email=='') {
          wx.showLoading({
            title: '请求中...',
            mask: true
          });
          if(isJL){
            updateCRMInfo(info).then(res => {
              wxShowToast('修改成功');
              app.getCRMInfoFn();
            }).catch(err => wxShowToast(err.message));
          }else{
            main.request(url.setUserinfo,info,function(ret){
              if(ret.data.errcode === 0){
                wxShowToast('修改成功');
                app.getCRMInfoFn();
              }
            },-1,'POST');
          }

        }else{
          wx.showModal({
            title: "提示",
            content: '邮箱格式有误,请重新填写',
            showCancel: false,
            confirmText: "确定",
            success: function (_res) {
              if (_res.confirm) {
                that.setData({
                  email: ''
                })
              }
            }
          });
        }
        app.gioTrack('pageclick_personalcenter_memberUpdate_save')
    }
})
