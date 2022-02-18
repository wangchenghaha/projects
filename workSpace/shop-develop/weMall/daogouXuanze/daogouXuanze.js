import {getConfigJSON} from "../../service/init";
import { judgeUrl, skuToImg, splitImg} from "../../utils/utils";
import { wxShowToast } from '../../utils/wxMethods';
import { shareGoods,getBrandConfig, getWxaCodeUnpubAddrQR } from '../../service/guide';
import { getShareText } from '../../service/shareText';
import { chooseFile, uploadFile, compressImage } from '../../service/upload';
import { KEYSTORAGE, URL, PAGESTR } from '../../src/const.js'

var city = require('../../utils/city.js');
var app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
var zuheID = '';
var clickOnoff = true;
let themeValue = 'default';
let ModelValue = 'model1';
let curOptions = {};
const openPageUrl = 'weMall/openDaogouPage/openDaogouPage';
let userType = 1; // （0，导购；1，运营）
//生成小程序码
function createCode(that){

  // var _shareTitle = that.data.shareTitle == '' ? that.data.phShareTitle : that.data.shareTitle;
  var _shareTitle =  that.data.phShareTitle;
  var _sharePlace = that.data.proviceData[that.data.index1].name;
  zuheID = '';
  var daogouId = wx.getStorageSync('daogouInfo').employeeId;
  var now = Date.now();
  zuheID = daogouId +''+ that.data.timestamp;
  var _List = that.data.ziyouList;

  if (_List.length == 0) {
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content: '请添加推荐的商品',
      showCancel: false
    });
    clickOnoff = true;
    return;
  };
  // that.setData({
  //   coverImg : 'https://cdn.bestseller.com.cn/goodsImagePC/ONLY/11835S502/11835S502F10/240400/11835S502F10_p7.jpg'
  // })
  if (that.data.coverImg == '') {
    wx.hideLoading()
    wx.showModal({
      title: '提示',
      content: '请添加封面图',
      showCancel: false
    });
    clickOnoff = true;
    return;
  };
  /**
   * 必须在小程序发布后调用该接口才能有效
   */
  const wxWork = wx.getStorageSync(KEYSTORAGE.wxWork);
  const scene = `zID=${zuheID}`;
  const param = {
    scene: wxWork ? `${scene}${PAGESTR.QY}` : scene,
    page: openPageUrl
  }
  getWxaCodeUnpubAddrQR(param).then(res => {
    const appCodeImg = res;
    const _coverImg = that.data.coverImg;
    wx.setStorageSync('appCodeImg', appCodeImg);
    wx.setStorageSync('shareTitle', _shareTitle);
    wx.setStorageSync('coverImg', _coverImg);
    wx.setStorageSync('zuheID', zuheID);
    createJson(that, appCodeImg, that.data.timestamp);

  }).catch(err => {
    wxShowToast(err.message);
    clickOnoff = true
  });
}


function collected(eName, id){
  // 收集用户行为
  let param = Object.assign(curOptions, {eventName: eName, utm_campaign: id});
  app._collectData2(param);
}


//创建JSON
function createJson(that,_appCodeImg, now){
  console.log(that.data);
  var _shareTitle = that.data.shareTitle == '' ? that.data.phShareTitle : that.data.shareTitle;
  var _sharePlace = that.data.proviceData[that.data.index1].name;
  let guideInfo = wx.getStorageSync(KEYSTORAGE.guideInfo);

  var _List = that.data.ziyouList;
  var daogouId = guideInfo.employeeId;
  var _daogouImage = wx.getStorageSync('userInfo').avatarUrl;
  var _daogouName = wx.getStorageSync('userInfo').nickName;
  var _wxSharePageSkuLists = [];
  _List.forEach(item => {
    _wxSharePageSkuLists.push({
      sku: item.gsColorCode,
      createTime: that.data.timestamp,
      skuPic: item.goodsImg.split('.cn')[1],
      goodsName: item.goodsName,
      discount: item.discount,
      discountPrice: item.discountPrice,
      originalPrice: item.originalPrice
    });
  });

  var _json = {
    id: zuheID,
    createBy: zuheID,
    portrait: _daogouImage,   //导购头像
    platform: 'MINIPROGRAM',       //平台（微信公众号、小程序）
    coverPic: that.data.coverImg,   //封面图
    pageUrl: _appCodeImg,        //appCodeImg
    region: _sharePlace,               //地区
    type: that.data.isOperate ? that.data.type: 'guide',                  //类型(是否运营推荐)  guide(导购创建) / operation(运营创建)
    templateId: '',          //模板ID
    pageTitle: _shareTitle,       //分享标题
    createByOpenid: daogouId,       //导购号
    createTime: that.data.timestamp,          //创建时间
    shareCount: 0,           //分享次数
    openCount: 0,              //打开次数
    shareMomentCount:0,         // 朋友圈打开次数
    status: 'normal',               //状态
    wxSharePageSkuLists: _wxSharePageSkuLists,    //分享的商品列表
    nickname: _daogouName,
    wechatVersion: wx.getStorageSync(KEYSTORAGE.isEnterprise)?'enterprise_wechat' : 'wechat',   // 是否企业微信
    pictures: that.data.highLight.toString(),
    author:daogouId,
    templateMsgSendTime: that.data.isOperate ? that.data.sendTimeValue : '',  //发送模板消息时间
    wxMomentGoodsPicTheme: themeValue,
    shortVideo: '',
    goodsTemplateId: ModelValue,
    shopCode: guideInfo.shopCode || ''
  };
  shareGoods(_json).then(res =>{
    wx.hideLoading();
    let tempId = res.id;
    collected("自由组合_" + _shareTitle + "_" + _json.type, tempId);
    wx.removeStorageSync('isFromDaogou');
    let url = `/weMall/daogouwxq/daogouwxq?from=list&isWeMall=weMall&status=login&id=${tempId}`;
    if(daogouId.startsWith('FX')){
      url = `/weMall/shareDetail/shareDetail?id=${tempId}`
    }
    app.gioTrack('pageclick_share_free_combination_save', {
      foundId: daogouId,
      modelId: tempId,
    })
    res.wxSharePageSkuLists.forEach(item => {
      app.gioTrack('pageclick_share_free_combination_save_goods', {
        modelId: tempId,
        spu_id: item.sku,
      })
    })
    wx.redirectTo({url})
  }).catch(e => {
    clickOnoff = true;
    wx.showToast({
      title: e.message,
      icon: 'none'
    });
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    wxShare: false,
    shareTitle: '',
    sharePlace: '',
    phShareTitle: '',
    ziyouList: [],
    scrollLeft: 0,
    nowDate: '',
    coverImg: '',
    proviceData: [{ name: '全国'}],
    index1 : 0,
    cdnDomain:cdn, //cdn域名
    highLight: [],
    //  时间戳
    timestamp:'',
    uploadText:'上传图片',
    titleList:[],
    titleListIsShow: false,
    isOperate: false,
    source:[
      {
        value:'operation',
        name:'DB',
        checked: true,
      },
      {
        value:'retail',
        name: `${brand}零售`
      }
    ],
    type:'operation',
    sendTime: [{
      value:'08:00',
      checked:true,
    },
    {
      value:'12:00',
      checked:false,
    },
    {
      value:'18:00',
      checked:false,
    }],
    sendTimeValue:'',
    themeArr : [],
    themePreImg: [],
    preTheme:{
      show: false,
      value:''
    },
    goodsTemplateArr:[],
    ModelpicUrl:'',
    source_icon: splitImg('source_icon.jpg', 'common')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBrandConfig();
    // this.judgeSex();
    this.initSendTime();
    wx.setStorageSync('coverImg', '');
    wx.getStorageSync(KEYSTORAGE.highLight) ? wx.removeStorageSync(KEYSTORAGE.highLight) : '';
    curOptions = options;
    this.setData({timestamp: Date.now()})
  },
  // 判断男装和女装显示不同标题
  judgeSex: function(){
    getShareText().then( res => {
      let titleList = res[brand].title, themePreImg = [], ModelpicUrl = '';
      // 下载图片主题
      let themeArr = res[brand].theme;
      let goodsTemplateArr = res[brand].goodsTemplate;
      themeArr.forEach(item => {
        if(item.checked){
          themePreImg = [item.singleImg, item.wxMoment]
        }
      });

      goodsTemplateArr.forEach(item=>{
        if(item.checked){
          ModelpicUrl = item.picUrl;
        }
      })
      this.setData({titleList, themeArr, themePreImg, goodsTemplateArr, ModelpicUrl});
    });
  },
  createtemp(){
    const {coverImg,isOperate, type, timestamp, sendTimeValue, highLight} = this.data
    const param = {
      id: zuheID,
      portrait: _daogouImage,   //导购头像
      platform: 'MINIPROGRAM',       //平台（微信公众号、小程序）
      coverPic: coverImg,   //封面图
      pageUrl: _appCodeImg,        //appCodeImg
      region: _sharePlace,               //地区
      type: isOperate ? type: 'guide',                  //类型(是否运营推荐)  guide(导购创建) / operation(运营创建)
      templateId: '',          //模板ID
      pageTitle: _shareTitle,       //分享标题
      createByOpenid: daogouId,       //导购号
      createTime: timestamp,          //创建时间
      shareCount: 0,           //分享次数
      openCount: 0,              //打开次数
      shareMomentCount:0,         // 朋友圈打开次数
      status: 'normal',               //状态
      wxSharePageSkuLists: _wxSharePageSkuLists,    //分享的商品列表
      nickname: _daogouName,
      wechatVersion: wx.getStorageSync(KEYSTORAGE.isEnterprise)?'enterprise_wechat' : 'wechat',   // 是否企业微信
      pictures: highLight.toString(),
      author:daogouId,
      templateMsgSendTime: isOperate ? sendTimeValue : '',  //发送模板消息时间
      wxMomentGoodsPicTheme: themeValue,
      shortVideo: '',
      goodsTemplateId: ModelValue,
      shopCode: guideInfo.shopCode || ''
    }
    wx.showToast({
      title: '加载中...',
    })
    shareGoods(param).then(res => {
      wx.hideLoading();
      let tempId = res.id;
      collected("自由组合_" + _shareTitle + "_" + _json.type, tempId);
      wx.removeStorageSync('isFromDaogou');
      wx.redirectTo({url: '/weMall/daogouwxq/daogouwxq?from=list&isWeMall=weMall&status=login&id='+ tempId,})
    }).catch(err => wxShowToast(err.message))
  },
  // 选择主题
  selectTheme: function(e) {
    themeValue = e.detail.value;
    let themeArr = this.data.themeArr, themePreImg = [];
    themeArr.forEach( item => {
      if(item.value === themeValue){
        themePreImg = [item.singleImg, item.wxMoment]
      }
    });
    this.setData({themePreImg})
  },

  selectModel: function(e) {
    console.log(e);
    ModelValue = e.detail.value;
    let goodsTemplateArr = this.data.goodsTemplateArr, ModelpicUrl = "";
    goodsTemplateArr.forEach( item => {
      if(item.model === ModelValue){
        console.log(item.picUrl)
        ModelpicUrl = item.picUrl;
      }
    });
    this.setData({ModelpicUrl})
  },
  // 点击事件
  onClick: function(e){
    let dataType = e.currentTarget.dataset.type;
    if(dataType === 'preview'){
      this.previewTheme(e)
    }else if(dataType === 'closePreview'){
      this._closePreview()
    }
  },
  // 预览图片
  previewTheme: function(e){
    this.setData({
      preTheme:{
        show: true,
        value: e.currentTarget.dataset.code
      }
    })
  },
  // 关闭预览主题
  _closePreview: function(){
    this.setData({
      preTheme:{
        show: false,
        value: ''
      }
    })
  },
  sourceChange: function(e){
    this.setData({type: e.detail.value});
  },
  // 初始化时间
  initSendTime: function(){
    this.setData({
      sendTimeValue: this.getCurDate(this.data.sendTime[0].value)
    });
    console.log('sendTimeValue',this.data.sendTimeValue)
  },
  sendTimeChange: function(e){
    this.setData({
      sendTimeValue: this.getCurDate(e.detail.value)
    });
  },
  getCurDate: function(hour){
    let dd = new Date();
    dd.setDate(dd.getDate()+1);//获取AddDayCount天后的日期
    let y = dd.getFullYear();
    let m = dd.getMonth()+1;//获取当前月份的日期
    let d = dd.getDate();
    // m < 10 ? m = `0${m}` : '';
    // d < 10 ? d = `0${m}` : '';
    dd = new Date(`${y}/${m}/${d} ${hour}`);
    let time1 = dd.getTime();
    let time2 = dd.valueOf();
    let time3 = Date.parse(`${y}-${m}-${d} ${hour}`);
    if(time1){
      return time1
    }else if(time2) {
      return time2
    }else{
      return time3
    }
  },
  getBrandConfig: function(){
    getConfigJSON().then(res => {
      let operateArr = res.operateDA;
      // 判断运营
      for(let operateItem of operateArr){
        let curGuideID = wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId;
        if(operateItem.daName === curGuideID){
          this.setData({isOperate: true});
          break;
        }
      }
      // 标题和主题
      let titleList = res.title, themePreImg = [], themeArr = res.theme, goodsTemplateArr = res.goodsTemplate, ModelpicUrl = '';
      for(let item of themeArr){
        if(item.checked){
          themePreImg = [judgeUrl(item.singleImg), judgeUrl(item.wxMoment)];
          themeValue = item.value;
          break;
        }
      }

      goodsTemplateArr.forEach(item=>{
        if(item.checked){
          ModelpicUrl = item.picUrl;
        }
      })
      if(!themePreImg.length){
        let defaultImg = themeArr[0];
        themePreImg = [judgeUrl(defaultImg.singleImg), judgeUrl(defaultImg.wxMoment)]
      }
      this.setData({titleList, themeArr, themePreImg, goodsTemplateArr, ModelpicUrl})
    });
    /*getBrandConfig().then(res => {
      let curBrandConfig = res[app.config.brand];
      let operateDA = curBrandConfig.operateDA;
      let curGuideID = wx.getStorageSync('daogouInfo').employeeId;
      if(operateDA.indexOf(curGuideID)>-1){
        this.setData({isOperate: true})
      }
    })*/
  },
  onBindBlur:function(e){
    var text = e.detail.value;
    var middleText = this.data.phShareTitle;
    if(text.length>0){
      this.setData({
        shareTitle :  text,
        phShareTitle : ''
      });
    }else{
      this.setData({
        phShareTitle : middleText,
        shareTitle:''
      });
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    clickOnoff = true;
    var userInfo = wx.getStorageSync('userInfo');
    let phShareTitle = this.data.shareTitle || `您的专属导购${userInfo.nickName}倾情推荐！春夏潮装焕新，总有一款适合你！`

    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth()+1;
    let day = date.getDate();

    let _nowDate = year+'.'+month+'.'+day;

    var coverImg = wx.getStorageSync('coverImg');
    var _shareCar = wx.getStorageSync('shareCar');
    if(_shareCar.length > 0){
      _shareCar.forEach( item => item.goodsImg = cdn + skuToImg({sku: item.gsColorCode}));
    }
	  const citys = city.getCitys();
    this.setData({
	    phShareTitle,
      ziyouList: _shareCar,
      coverImg: coverImg,
	    proviceData: citys,
	    nowDate : _nowDate
    });
  },
  // 选择文案
  selectTitle: function(e){
    let curIndex = e.currentTarget.dataset.index;
    let titleList = this.data.titleList;
    titleList.forEach((item,index) => {
      curIndex === index ? item.active = true : item.active = false;
    });
    this.setData({
      titleList: titleList,
      shareTitle: titleList[curIndex].text
    })
    wx.setStorageSync('shareTitle', titleList[curIndex].text);
  },
  titleShow: function(){
    let titleListIsShow = this.data.titleListIsShow;
    this.setData({titleListIsShow: !titleListIsShow})
  },
  // 上传图片
  uploadImg: function(e){
    let dataId = e.currentTarget.dataset.id;
    let guideId = wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId;
    let uploadParam = {
      guideId,
      scene: `${guideId}${this.data.timestamp}`,
      page: openPageUrl,
	    userType: this.data.isOperate ? 1 : 0, // 0，导购；1，运营
    };
    chooseFile().then( res => {
      uploadFile(res, uploadParam).then( uploadFile => {
        let imgPath = uploadFile[0];
        if(dataId === 'highLight'){
          // 推荐理由
          let highLightImg = wx.getStorageSync(KEYSTORAGE.highLight) || [];
          highLightImg.push(imgPath);
          this.setData({
            highLight: highLightImg,
            uploadText:'继续上传图片'
          });
          wx.setStorageSync(KEYSTORAGE.highLight, highLightImg);
        }else if(dataId === 'coverImg'){
          // 封面图
          wx.setStorageSync('coverImg', imgPath);
          this.setData({coverImg: imgPath});
        }
      }).catch(err => wxShowToast(err.message))
    }).catch(err => wxShowToast(err.message))
  },
  //上传封面图
  upchuan: function(e){
    var that = this;
    let dataId = e.currentTarget.dataset.id;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var _daogouID = wx.getStorageSync('daogouInfo').employeeId;

        wx.showLoading({
          title: '正在上传...'
        });
        that.setData({
          timestamp: Date.now()
        })
        let isCover=dataId==='coverImg'?1:0;
        let sceneOption = _daogouID+that.data.timestamp;
        wx.uploadFile({
          // url: `${app.config.domain}/api/guide/uploadConverPic?guideId=${_daogouID}`, //开发者服务器 url
          url:`${URL.UPLOADCONVERPICWITHMINICODE}?guideId=${_daogouID}&isCover=0&scene=${sceneOption}&page=${openPageUrl}`, //开发者服务器 url
          filePath: tempFilePaths[0],//要上传文件资源的路径
          name: 'file', //文件对应的 key , 开发者在服务器端通过这个 key 可以获取到文件二进制内容
          header: {
            token: wx.getStorageSync('token'),
            'content-type': 'multipart/form-data'
          },
          formData: {}, //HTTP 请求中其他额外的 form data
          success: function (res) {
            wx.hideLoading();
            var Data = JSON.parse(res.data);
            if (Data.code == 0) {
              if (dataId === 'highLight') {
                let highLightImg = wx.getStorageSync(KEYSTORAGE.highLight) || [];
                highLightImg.push(Data.data[0])
                wx.setStorageSync(KEYSTORAGE.highLight, highLightImg);
                that.setData({
                  highLight: wx.getStorageSync(KEYSTORAGE.highLight),
                  uploadText:'继续上传图片'
                });
              } else if (dataId === 'coverImg') {
                wx.setStorageSync('coverImg', Data.data[0]);
                var _CoverImg = wx.getStorageSync('coverImg');
                that.setData({
                  coverImg: _CoverImg
                });
              }
            };
          },
          fail: function (res) {
            wx.hideLoading();
          }
        });

      }
    });
  },

  //保存至推荐分享
  shareToTanchu: function(){
    if( clickOnoff ){
      clickOnoff = false;
      wx.showLoading({title: '加载中', mask: true});
      createCode(this);
    }
  },

  //点击取消分享弹出框
  shareToCancel: function(){
    this.setData({
      wxShare: false
    });
  },

  //输入自由组合标题
  shareTitleInput: function(e){
    var thisValue = e.detail.value;
    this.setData({
      shareTitle: thisValue
    });
  },

  changeCity: function (e) {
    var _index1 = Number(e.detail.value);
    this.setData({
      index1: _index1
    });
  },

  //选择推荐的商品
  toList: function(){
    wx.setStorageSync('isFromDaogou', true);
    wx.navigateTo({
      url: '/pages/search/search?page=weMall',
    })
    // wx.switchTab({
    //   url: '/pages/search/search?page=weMall'
    // });
  },

  removeThisGoods: function(e){
    var that = this;

    wx.showModal({
      title: '提示',
      content: '确定要删除此款商品吗？',
      success: function (res) {
        if (res.confirm) {
          trueRmoveThisGoods();
        };
      }
    });

    function trueRmoveThisGoods(){
      var thisGoodsColorCode = e.currentTarget.dataset.goodscolorcode;
      var _List = that.data.ziyouList;

      _List.forEach((item,index) => {
        if( item.gsColorCode == thisGoodsColorCode ){
          _List.splice(index,1)
        };
      });
      that.setData({
        ziyouList: _List
      });
      wx.setStorageSync('shareCar', _List);
    };

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

})
