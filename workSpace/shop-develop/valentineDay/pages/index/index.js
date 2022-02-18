import mainService from '../../../base/main.js';
import Utils from '../../services/util'
import Fetch from '../../services/fetch'
import Urls from '../../services/url'
import pathModel from '../../models/path.model';
import dataModel from '../../models/dataInfo.model';

Page({
  data: {
    ac_id: '',
    ch_id: '',
    s_id: '',
    data: {},
    isStart: false,
    isEnd: false
  },
  onShow() {
    this.getData();

  },
  onLoad(options) {
    console.info('love_options1', options)

    options = options.scene ? Utils.getRouteObjByStrOfSunQr(options.scene) : options
    this.setData({
      ac_id: options.ac_id || '',
      ch_id: options.ch_id || '',
      s_id: options.s_id || '',
    })
    wx.setStorageSync('ac_id', this.data.ac_id)
    wx.setStorageSync('ch_id', this.data.ch_id)
    // if (mainService.judgeBigScreen()) { // 大屏
    //   this.setData({
    //     indexImg: this.data.indexImg
    //   })
    // }
    //假装调用接口，加载完成跳转到下个页面
    // setTimeout(function(){
    //   mainService.link(pathModel.vd_record)

    // },10000)
  },

  /**
   * 获取数据
   */
  // 获取时间戳
  getTime(data) {
    var date = new Date(data);
    var timeStamp = date.getTime();
    return timeStamp
  },
  getData() {
    console.info('love_option')
    Fetch({
      url: Urls.love_init,
      loading: true,
      data: {
        ac_id: this.data.ac_id,
        ch_id: this.data.ch_id,
        s_id: this.data.s_id
      }
    }).then(res => {
      let { errcode, data ,errmsg } = res
      console.info('errcode',errcode)
      if (errcode == 0) {
        dataModel.data = data
        this.setData({
          data
        },()=>{
          setTimeout(() => {
            if (this.data.s_id) {
              this.openRecord();
            } else {
              wx.redirectTo({
                url:`${pathModel.vd_goRecord}`
              })
            }
          }, 2000)
        })   
      }else if(errcode == 80002 || errcode == 80003){
        this.setData({
              isStart: true,
              timeImg:data.err_img
            })
      }else{
        wx.showToast({
          title: errmsg,
          icon:'none'
        })
      }
    })
  },

  openRecord() {
    // 判断是否是会员
    // return
    Fetch({
      url: Urls.love_ismember,
      loading: true,
      data: {
        ac_id: this.data.ac_id,
        ch_id: this.data.ch_id,
        user_id: this.data.data.user_id
      }
    }).then(res => {
      let { errcode, data } = res
      if (errcode == 0) {
        console.info('res$$$$$$$$$$$$', res)
        if (data.is_member) {//如果是会员
          if (data.is_get_card) {//但是领过卡
            this.reportAd();
            wx.navigateTo({
              url: `${pathModel.vd_listen}?s_id=${this.data.s_id}`,
            })
          } else {//没领过卡
            wx.addCard({
              cardList: data.cardList,
              success: res => { }
            })
            // wx.navigateTo({
            //   url: `${pathModel.vd_startRecord}`,
            // })

          }
        } else {//不是会员
          console.info('data.cardList', data.cardList)
          if (data.is_get_card) {//但是领过卡
            wx.openCard({
              cardList: data.cardList,
              success(res) { }
            })
          } else {//没领过卡
            wx.showModal({
              title: '提示',
              content: '您还不是会员，点击确定即可注册',
              showCancel:false,
              success (res) {
                if (res.confirm) {
                  Utils.memberRegistration(data.activatemembercard_url)


                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
          }
        }
      }
    })
  },
  reportAd(){
    Fetch({
      url: Urls.love_btnAd,
      loading: true,
      method:'POST',
      data: {
        ac_id:this.data.ac_id,
        ch_id: this.data.ch_id,
      }
    }).then(res => {
      
    })
  },
  //查看微信原生卡券
  _openCard(cardList) {
    wx.openCard({
      cardList: cardList,
      success(res) { }
    })
  },
})