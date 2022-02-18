// valentineDay/pages/share/share.js
// import userModel from '../../../pages/memberModule/models/user.model';
import Poster from '../../bargain/pallete'; // 海报
import Utils from '../../services/util'
import Fetch from '../../services/fetch'
import Urls from '../../services/url'
import pathModel from '../../models/path.model';
import dataModel from '../../models/dataInfo.model';
import imgModel from "../../models/img.model";
const recorderManager = wx.getRecorderManager()
const audioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgModel,
    comData:{},
    zhufuArr:[],
    playStatus:false,
    isBigPhone: Utils.isBigPhone(),
    couponShow:false,
    channel:'',
    isAddCard:false,
    cardList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.info('shareopt',options)
    if(dataModel.data){
      let data = dataModel.data
      this.setData({
        comData:data
      })
    }
    if(options.heartSelect){
      this.setData({
        heartSelect:options.heartSelect
      })
    }
    if(options.soundUrl){
      this.setData({
        soundUrl:options.soundUrl
      })
    }
    if(options.name){
      this.setData({
        name:options.name
      })
    }
    if(options.soundId){
      this.setData({
        sound_id:options.soundId
      })
      this.shareApi(options.soundId)
    }
    if(options.blessingText){
      this.setData({
        zhufuArr:options.blessingText.split('|')
      })
    }
  },
  onShow(){
    this.getData();
  },
  getData() {
    Fetch({
      url: Urls.love_init,
      loading: true,
      data: {
        ac_id: wx.getStorageSync('ac_id'),
        ch_id: wx.getStorageSync('ch_id'),
      }
    }).then(res => {
      let { errcode, data ,errmsg } = res
      console.info('errcode',errcode)
      if (errcode == 0) {
        dataModel.data.is_get_coupon = data.is_get_coupon;
        dataModel.data.record_id = data.record_id;
      }else{
        wx.showToast({
          title: errmsg,
          icon:'none'
        })
      }
    })
  },
  closeModal(){
    this.setData({
      couponShow:false
    })
  },
  shareApi(soundId){
    Fetch({
      url: Urls.love_share,
      loading:true,
      data: {
        ac_id:wx.getStorageSync('ac_id'),
        user_id:this.data.comData.user_id,
        type:'2',
        sound_id:soundId,
      }
    }).then(res => {
      let { errcode, data } = res
      if(errcode == 0){
        console.info('分享按钮',data)
        this.setData({
          shareUrl:data.share_url
        })
      }
    })
  },
  handleShare(e) {
    const shareData = e.detail;
    this.setData({
      shareItem: shareData
    })
    this.selectComponent("#comp-share").show({
      navHeight: this.data.navHeight,
    })
  },
  play(){
    let _this = this
    if (_this.data.playStatus) return
    _this.setData({ playStatus:true})
    if (wx.setInnerAudioOption) {

      wx.setInnerAudioOption({
    
        obeyMuteSwitch: false,
    
        autoplay: true
    
      })
    
    }else {
    
      myaudio.obeyMuteSwitch = false;
    
      myaudio.autoplay = true;
    
    }
    audioContext.src = this.data.soundUrl
    audioContext.play()
    
    audioContext.onStop(() => {
      console.log('onStop=====================')
      _this.setData({ playStatus: false })
    })
    audioContext.onEnded(() => {
      console.log('onEnded=====================')
      _this.setData({ playStatus: false})
    })


  },
  getCouponStatus(par, cb) {
    let data = {
      ...par,
      type:'JsApi'
    }
    Fetch({
      url: Urls.love_coupon_get,
      loading: true,
      data
    }).then(res => {
      let { errcode, data } = res
      if (errcode == 0) {
        cb && cb(res.data.cardList)
      }
    })
  },
  getupdatecoupon() {
    let that = this
    Fetch({
      url: Urls.love_coupon_update,
      loading: true,
      data: {
        channel: this.data.channel,
      },
    }).then(res => {
      let { errcode, data, errmsg } = res
      if (errcode == 0) {
        console.log('领券更新成功')
        wx.showToast({
          title: '领券成功',
          icon:'none'
        })
        that.setData({
          couponShow:false
        })
        return
      }
      wx.showModal({
        title: '提示',
        content: errmsg,
        showCancel: false
      })
    })
  },
  addCoupon() {
    let that = this;
    if(that.data.isAddCard){
      wx.addCard({
        cardList:that.data.cardList,
        success:function(res){
          that.getupdatecoupon()
        }
      })
    }else{
      let url = that.data.comData.valentine.delivery_url
      if(url.substr(0,1) != '/'){
        url = '/'+url
      }
      wx.navigateTo({
        url: url,
      })
    }
       this.setData({
      couponShow:false
    })
  },
  handleShareFriends(){
    this.selectComponent("#comp-share").handleCloseShare()

    if(this.data.comData.record_id){//有领券记录
      if(!this.data.comData.is_get_coupon){
        let urlParams = this.data.comData.valentine.delivery_url.split('?')[1];
        let params = Utils.getRouteObjByStrOfSunQr(urlParams)
        console.info('params', params)
        this.data.channel = params.channel
        let par = {
          channel: this.data.channel,
          record_id: this.data.comData.record_id
        }
        this.getCouponStatus(par,(res)=>{
          console.info('is-get',res)
          this.setData({
            couponShow: true
          })
          this.data.isAddCard = true
          this.data.cardList = res.cardList
        })
      }
    }else{//没有领券记录，显示领取按钮
      this.setData({
        couponShow: true
      })
    }
  },
  handleCanvasPoster() {
    this.selectComponent("#comp-share").handleCloseShare()
    Fetch({
      url: Urls.love_share,
      loading:true,
      data: {
        ac_id: wx.getStorageSync('ac_id'),
        user_id:this.data.comData.user_id,
        type:'3',
        sound_id:this.data.sound_id,
      }
    }).then(res => {
      let { errcode, data } = res
      if(errcode == 0){
        console.info('res$$$$$$$$$$$$',res)
        const shareItem = this.data.shareItem;
        wx.showLoading({
          title: '生成中',
        })
        // console.info(';userModel', userModel)
        let canvasPalette = new Poster().palette({
          avatar: wx.getStorageSync('userInfo').avatarUrl || '',
          username: wx.getStorageSync('userInfo').nickName || '',
          shareText:this.data.comData.valentine.poster_title,
          toBg:this.data.comData.valentine.set_receiver_input_img,
          name:this.data.name,
          product_pic: this.data.heartSelect,
          zhufuyu1:this.data.zhufuArr[0],
          zhufuyu2:this.data.zhufuArr[1],
          qrcode:  this.data.comData.valentine.account_qrcode,
          logo: this.data.comData.valentine.logo_img,
          info:this.data.comData.valentine.postmark_img,
          
        })
        this.selectComponent("#comp-share").setCanvas(canvasPalette)
      }
    })
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.comData.valentine.share_title,
      path: this.data.shareUrl,
      imageUrl: this.data.comData.valentine.card_img, 
    }
  }
})