import {getGuideQR, getWShopList, sendTemplateMsg, queryGuideWxOpenId} from '../../service/guide.js';
import {KEYSTORAGE} from '../../src/const'
import {unionIdToOpenId,unionIdBindOpenId, getUnionId} from "../../service/mini"
import {copyShareUrl} from "../../service/guide";
import {wxCopyText, wxShowToast} from "../../utils/wxMethods";
import {objToQuery, splitImg, formatDate } from "../../utils/utils";
import {URL_CDN, PAGESTR} from "../../src/const";
const app = getApp();
const {cdn, brand} = app.config;
let curOptions = {};
let isPull = true;

function collected(eName){
  // 收集用户行为
  let param = Object.assign(curOptions, {eventName: eName});
  const isWXWork = wx.getStorageSync(KEYSTORAGE.isEnterprise);
  if(isWXWork){
    Object.assign(param, {utm_source: PAGESTR.wxWorkSource})
  }
  app._collectData2(param);
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    coverPic: '',
    List: [],
    title: '',
    createTime: '',
    tag: '',
    tag_bg: '',
    showNotice: false,
    pageSize: 10,
    count: 1,
    BindNotice: '',
    showBtn: false,
    guideInfo: wx.getStorageSync(KEYSTORAGE.guideInfo),
    sendMsgImg: splitImg('send_msg.jpg'),
    articleTip: splitImg('article_tip.jpg'),
    articleTipGif: splitImg('article_tip.gif'),
    source: 'DB',
    showGif: false,
    accountTip: '',
    accountShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryGuideWxOpenId();
    this.setData({
      tag_bg: URL_CDN.LABEL_WSC,
      guideInfo: wx.getStorageSync(KEYSTORAGE.guideInfo)
    });
    if(app.config.singleBrand){
      // this._isSubscribe();
    }


  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // getList(this, this.data.pageSize, this.data.count);
    this.getArticleList();
  },
  getArticleList(){
    const {pageSize, count, List} = this.data;
    getWShopList(pageSize, count).then(res => {
      if(res){
        const {records = [], pages = 1} = res;
        if(pageSize === pages){
          isPull = false
        }
        if(records.length){
          this.setData({
            List: List.concat(records),
          });
        }
      }
    }).catch(err => wxShowToast(err.message))
  },
  /*
  * 通过员工号判断是否绑定公众号
  * */
  queryGuideWxOpenId: function () {
    let {employeeId} = wx.getStorageSync('daogouInfo');
    queryGuideWxOpenId(employeeId.substr(4)).then(res => {
      if(res.code === 0){
        return  res.data ? (res.data.openid || '') : ''; /*公众号openID*/
      }
    }).then(wxOpenId => {
      // wxOpenId ? this._getUnionId(wxOpenId) : this._isSubscribe();
      if(wxOpenId){
        this._getUnionId(wxOpenId)
      } else {
        if(brand === 'JLINDEBERG' || brand === 'FOL'){
          this.openWebView();
        } else {
          this._isSubscribe();
        }
      }
    }).catch(err => {
      wxShowToast(err.message);
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(isPull){
      this.setData({
        count: this.data.count + 1,
      });
      this.getArticleList();
    }else{
      wxShowToast('数据加载完成');
    }

  },
  // 判断用户是否关注公众号
  _isSubscribe: function(){
    let unionId = wx.getStorageSync(KEYSTORAGE.unionid) || '';
    let employeeId = wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId || '';
    let param = {brand,unionId, employeeId};
    unionIdBindOpenId(param).then(res => {
      if(res.subscribe === 0){
        // 没有关注打开webview
        this.openWebView();
      }
    }).catch(e =>{
      wxShowToast(e.message);
    })
  },
  /*
  * 调自己平台查看是否关注公众号
  * */
  _getUnionId: function(wxOpenId){
    let param = {
      brand,
      openId: wxOpenId
    };
    getUnionId(param).then(res=>{
      if(res.subscribe !== 1){
        this.showAccount('您当前未关注公众号，请先关注微信公众号')
      }
    }).catch(err => wxShowToast(e.message))
  },
  showAccount(accountTip){
    this.setData({
      accountShow: true ,
      accountTip,
    })
  },
// 再次封装
  tdSdkEventAgain: function (tdEventName, param) {
    let tdParam = {
      GUIDE_DAID: wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId
    };
    Object.assign(tdParam, param);
    app.tdSdkEvent(tdEventName, tdParam);
  },
  clickList: function (e) {
    wx.showLoading({
      title:'加载中...'
    });
    let _index = parseInt(e.currentTarget.id);
    let {employeeId} = wx.getStorageSync('daogouInfo');
    let lists = this.data.List;
    let url = lists[_index].linkUrl;
    let copyTitle = lists[_index].marketingWords;
    if (url.indexOf(app.config.domain_h5) > -1) {
      let guideInfo = {
        share_by: this.data.guideInfo.employeeId,
        share_by_shop: this.data.guideInfo.shopCode,
        utm_medium: 'guideshare',
        utm_source: 'ruanwen'
      };
      url = `${url}${objToQuery(guideInfo)}`
    }
    // let pageCode = lists[_index].linkUrl.split('/').reverse()[1];
    let sendParam = {
      shopGuideId: employeeId.slice(4, 10),
      articleName: lists[_index].title || '',
      articleIntroduction: lists[_index].marketingWords || '',
      url: url,
      // pagepath: `/pages/album/album?code=${pageCode}`,    // 跳小程序
    };
    collected("一键获取_" +  lists[_index].marketingWords +"_" + lists[_index].id);
    try {
      let TEMPLATE_ID = lists[_index].id;
      this.tdSdkEventAgain(`pageclick_h5model_goods${_index+1}`, {TEMPLATE_ID});
      app.gioTrack('pageclick_share_activity_get', {
        content_Id: TEMPLATE_ID,
        title: lists[_index].title
      })
    }catch (e) {

    }
    sendTemplateMsg(sendParam).then((response) => {
      wx.hideLoading();
      this.setData({
        showGif: true,
        BindNotice: `消息已发送到${app.config.title}品牌公众号, 请您查收。`,
        showBtn: false,
      });
      if (copyTitle) {
        let shareURLOption = {
          shareUrl: sendParam.url,
          brand: app.config.brand
        };
        copyShareUrl(shareURLOption).then(shortUrl=>{
	        wxCopyText(`${copyTitle}\n${shortUrl.url}`);
        });
      }
    }).catch((e) => {
      wx.hideLoading();
      this.showAccount(e.message);
    });
  },


  closeNotice: function () {
    this.setData({
      showGif: false
    })
  },

  openWebView: function () {
    wx.navigateTo({
      url: '/weMall/daogouBind/daogouBind'
    })
  },
  onClick: function (e) {
    let type = e.currentTarget.dataset.type;
    if(type === 'close'){
      this.setData({ accountShow: false })
    }
  }
})
