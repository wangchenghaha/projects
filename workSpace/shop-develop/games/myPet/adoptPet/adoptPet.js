import {splitImg} from '../../../utils/utils'
import { KEYSTORAGE, EVENTS } from '../../../src/const.js'
import events from '../../../src/events';
import {getPetList, queryUserPoints, addUserPoints, petSelect} from '../service/adopted'
import { wxSubscription } from '../../../utils/wxSubscribe'
import {wxShowToast} from '../../../utils/wxMethods'
import lottie from 'lottie-miniprogram'
const app = getApp();

let frameFn = function () { };
let rid = 0;
let canvasDom = null;

const splashImgList = [
  {
    scale: 5622,
    img: splitImg('images/adoptPet_bg_six.jpg?v=100', 'littlePet'), // 375/603 iphone 7
  },
  {
    scale: 4681,
    img: splitImg('images/adoptPet_bg_x.jpg?v=100', 'littlePet'),  // 375/724 iphoneX
  },
  {
    scale: 5064,
    img: splitImg('images/adoptPet_bg_x.jpg?v=100', 'littlePet'),   // 393/776  redMi Pro 8
  },
];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    petBg: splitImg('images/adoptPet_bg_x.jpg?v=100', 'littlePet'),
    petBtn: splitImg("mday0904_coupon210.png"),
    petChoose: [{
                  name: 'alpaca',
                  pic:  splitImg('images/alpaca_sel.png', 'littlePet'),
                  seleted: true,
                },
                {
                  name: 'koala',
                  pic:  splitImg('images/koala_nor.png', 'littlePet'),
                  seleted: false,
                },
                {
                  name: 'unicorn',
                  pic:  splitImg('images/unicorn_nor.png', 'littlePet'),
                  seleted: false,
                }],
    chooseBtn: splitImg('images/adopt_btn.png', 'littlePet'),
    canvas1: true,
    canvas2: false,
    canvas3: false,
    petsInfo: {},
    selPet: {},
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
      events.register(this, EVENTS.EVENT_CRMINFO);
      const {petChoose} = this.data;
      this.init(splitImg('lotties/alpaca_normal.json', 'littlePet'), petChoose[0].name);

  },

  /**
   * 接受授权成功刷新页面
   */
  handleEvent: function (event, type) {
    if (type === EVENTS.EVENT_CRMINFO){

      this.getSystemInfo();
      this._queryUserPoints();
      this._getPetList();

    }
  },

  _getPetList: function(){
    let {petChoose} = this.data;
    getPetList().then(res =>{
      if(res){
        for (let i = 0; i < res.length; i++) {
          petChoose[i].petInfo = res[i];
        }
        this.setData({
          petsInfo: res,
          selPet: res[0],
        })
      }
    }).catch(err=>{
      wxShowToast(err)
    })
  },

  _queryUserPoints: function(){
    
    queryUserPoints(app.getOpenId()).then(res =>{
      if(res){
        if(res.petInfo){
            wx.navigateTo({
              url: "../myPet/myPet"
            })
        } else {
          this.setData({
            userInfo: res
          })
        }
      }else{
        this._addUserPoints();
      }
    })
  },

  init(animJson, canvas) {
     
    this.createSelectorQuery().selectAll('#'+canvas).node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 512
      canvas.height = 512

      const requestAnimationFrame = canvas.requestAnimationFrame;
      canvas.requestAnimationFrame = function () {
        frameFn = arguments[0];
        rid = requestAnimationFrame.apply(canvas, arguments);
        return rid;
      }
      // 页面第二次打开时动画默认不会开始，这里需要手动调用一次动画
      canvas.requestAnimationFrame(frameFn);
      canvasDom = canvas;
      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        path : animJson,
        rendererSettings: {
          context,
        },
      })
    }).exec()
  },


  getSystemInfo: function(){
    let that = this
    try{
      let systemInfo = wx.getSystemInfoSync();
      const {windowHeight, windowWidth} = systemInfo;
      const scale = Math.floor((windowWidth/windowHeight * 10000));
      let petBg = '';
      splashImgList.forEach(item => {
        const diff = Math.abs(item.scale - scale);
        if(diff < 100){
          petBg = item.img
        }
      });
      if(petBg){
        that.setData({
          petBg
        })
        console.log(that.data.petBg,'***init');
      }
    }catch (e) {}
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    if (!wx.getStorageSync(KEYSTORAGE.loginInfo)){
      getApp().checkLogin()
    }
    else if (!wx.getStorageSync(KEYSTORAGE.crmInfo)){
      console.log(`会员信息isMember:${JSON.stringify(wx.getStorageSync('isMember'))}`)
      if (!wx.getStorageSync('isMember')){
        getApp().isMemberETO()
      }
      else{

        wx.showLoading({
          title: '加载中……',
          mask: true
        });
        setTimeout(() => {
          wx.hideLoading();
          getApp().getCRMInfoFn()
        }, 2000);

      }
    }
    else{
      
      this.getSystemInfo();
      this._queryUserPoints();
      this._getPetList();

    }

  },

  onClick: function(e){
    let type =  e.currentTarget.dataset.type;
    let seleted = e.currentTarget.dataset.seleted;
    if(seleted){
      return;
    }
    let {petChoose, selPet} = this.data;
    for (let i = 0; i < petChoose.length; i++) {
      if(type === petChoose[i].name){
        petChoose[i].seleted = true
        petChoose[i].pic = splitImg('images/'+ petChoose[i].name +'_sel.png', 'littlePet')
        selPet = petChoose[i].petInfo
      } else {
        petChoose[i].seleted = false
        petChoose[i].pic = splitImg('images/'+ petChoose[i].name +'_nor.png', 'littlePet')
      }
    }
    this.setData({
      petChoose,
      selPet
    });
    // 销毁页面时 关闭动画
    canvasDom.cancelAnimationFrame(rid);
    switch(type){
      case 'alpaca':
        // 销毁页面时 关闭动画
        this.init(splitImg('lotties/alpaca_normal.json', 'littlePet'), petChoose[0].name);
        break;
      case 'koala':
        this.init(splitImg('lotties/koala_normal.json?v=100', 'littlePet'), petChoose[1].name);
        break;
      case 'unicorn':
        this.init(splitImg('lotties/unicorn_normal.json', 'littlePet'), petChoose[2].name);
        break;
    }
    
  },

  _addUserPoints: function(){
    const wxInfo = wx.getStorageSync(KEYSTORAGE.wxInfo);
    const crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
    let jsData = {
      "phone": crmInfo.phone || '',
      "openid": app.getOpenId(),
      "nickName": wxInfo.nickName || '',
      "facePic": wxInfo.avatarUrl || '',
      "memberno": crmInfo.memberno || '',
    }
    addUserPoints(jsData).then(res => {
      if(res){
        this.setData({
          userInfo: res
        })
      }
    }).catch(err=>{
      wxShowToast(err)
    })
  },

  myPet: function(e){
    if (getApp().config.jumpGameTemplateIds){
      wxSubscription("jumpGame").then(res => {
        this.selpets()
      }).catch(err => {
        this.selpets()
      });
    }
    else{
      this.selpets()
    }
  },

  selpets: function(){
    const {selPet} = this.data;
    let jsData={
      petId: selPet.id,
      userid: this.data.userInfo.id
    }
    console.log("....",jsData );
    petSelect(jsData).then(res => {
      wx.navigateTo({
        url: "../myPet/myPet"
      })
    }).catch(err=>{
      wxShowToast(err)
    })
  }
})