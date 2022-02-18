// activesubpack/pages/egg/index/index.js
import Utils from '../../../service/util'
import Fetch from '../../../service/fetch'
import Urls from '../../../service/url'

import Poster from './poster'

// import Poster from './poster'; // 绘制海报
let timer = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ac_id: '',
    ch_id: '',
    sh_id: '',
    isBigPhone: Utils.isBigPhone(),

    activity: {},

    awards: [],

    dialogConfig: {}, // 弹窗
    gifConfig: {}, // gif 弹窗

    awardsPosition: [
      [
        {x: 0, y: 250},
        {x: 200, y: 250},
        {x: 100, y: 108},
        {x: 100, y: 250},
        {x: 50, y: 177},
        {x: 150, y: 190},
        {x: 0, y: 103},
        {x: 130, y: 250},
        {x: 246, y: 180},
        {x: 310, y: 250},
      ],
      // [
      //   {x: 310, y: 250},
      //   {x: 246, y: 180},
      //   {x: 0, y: 115},
      //   {x: 197, y: 103},
      //   {x: 150, y: 190},
      //   {x: 50, y: 177},
      //   {x: 100, y: 250},
      //   {x: 100, y: 108},
      //   {x: 200, y: 250},
      //   {x: 0, y: 250},
      // ],
      [
        {x: 0, y: 250},
        {x: 200, y: 250},
        {x: 100, y: 192},
        {x: 100, y: 250},
        {x: 180, y: 104},
        {x: 150, y: 190},
        {x: 296, y: 103},
        {x: 237, y: 32},
        {x: 246, y: 180},
        {x: 310, y: 250},
      ],
    ],

    isStart: false,

    record_id: '',
    isGetAward: 1,
    awardList: [],

    navUrl: '', // 跳转路径

    isTouch: true,

    award_item_id: '',

    store_num: '',
    guide_id: '',

    can_join_num: 0,  // 剩余抽奖次数

    isCanvas: false,

    awardShareMainImg: '', // 中奖的海报
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    options = options.scene ? Utils.getRouteObjByStrOfSunQr(options.scene) : options

    console.log('======onload', options)
    let ac_id = options.ac_id ? options.ac_id : options.activity_id
    let ch_id = options.ch_id ? options.ch_id : options.channel_id
    let share_openid = options.share_openid ? options.share_openid : ''
    this.setData({
      ac_id,
      ch_id,
      share_openid,
      sh_id: options.sh_id || '',
      store_num: options.storeid || '',
      guide_id: options.guideid || '',
    })
    console.log('data======================option参数',this.data)
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
    wx.hideHomeButton()
    if (wx.getStorageSync('isLoginNew')) {
      wx.showLoading({
        title: '正在注册',
        mask: true
      });
      return
    }
    this.setData({
      isTouch: true
    })
    this.getData()

  },

  // 跳转列表
  toList(){
    wx.navigateTo({
      url: '/activesubpack/pages/egg/awardList/awardList?bg='+this.data.activity.record_list_img+'&record_btn_img='+this.data.activity.record_btn_img+'&record_add_btn_img='+this.data.activity.record_add_btn_img+'&ac_id='+this.data.ac_id
    })
  },

  /**
   * 获取数据
   */
  getData(){
    console.log('============== onshow')
    Fetch({
      url: Urls.egg_index,
      data: {
        ac_id: this.data.ac_id,
        ch_id: this.data.ch_id,
        sh_id: this.data.sh_id,
        store_num: this.data.store_num,
        guide_id: this.data.guide_id,
      }
    }).then(res => {
      let { errcode, data } = res
      if(errcode == 0){
        console.log('获取初始化数据===',res)
        let awardsCount = 10
        let awards = data.activity.awards
        let surplus = awardsCount - awards.length
        if(surplus > 0){
          for(let i = 0; i < surplus; i ++){
            awards.push({
              award_img: awards[0].award_img
            })
          }
        }
        awards.forEach((item, index) => {
          let random = this.random(99, 395, 350)
          item.x = this.data.awardsPosition[0][index].x
          item.y = this.data.awardsPosition[0][index].y
          item.deg = random.deg
        })
        // console.log(awards)
        this.setData({
          activity: data.activity,
          awards: awards,
          can_join_num: data.can_join_num // 剩余次数
        })

      }
    })
  },

  // 判断会员
  getIsMember(){
    Fetch({
      url: Urls.egg_ismember,
      method: "POST",
      data: {
        ac_id: this.data.ac_id,
        ch_id: this.data.ch_id,
        store_num: this.data.store_num,
        guide_id: this.data.guide_id,
      }
    }).then(res => {
      console.log('判断会员 ======', res)
      let {errcode, data} = res
      let awards = this.data.awards


      if(errcode == 0){
        let awardInfo = awards.find(item => item.id == data.award_id)  // 扭蛋信息

        if(data.is_member == 1){ // 是否会员
          if(data.is_get_card == 1){  // 判断是否开卡
            let dialogConfig = {
              isRemoveIcon: data.award_type == 0,
              isShow: true,
              imgUrl:awardInfo.win_prize_img,
              openBtn: this.data.activity.open_btn_img,
              receiveBtn: this.data.activity.receive_btn_img,
              isGetAward: data.is_get_award,
            }
            if(data.awardList){ // 已抽奖未领取
              dialogConfig.isWin = 1
              this.setData({
                isGetAward: data.is_get_award, // 是否领取
                dialogConfig: dialogConfig,
                awardList: data.awardList,
                isTouch: true,

              })
            }else{

              let awards = this.data.awards
              this.setData({
                isStart: true,
              })
              this.transitionEnd()

              this.eggLuck()
            }
          }else{
            // 是会员没有卡
            wx.addCard({
              cardList: data.cardList,
              success: res => {}
            })
          }

        }else{
          console.log('注册会员')
          if (data.is_get_card) { //不是会员但是领过卡券
            this._openCard(res.data.cardList)
          } else { //不是会员没领过卡券,注册会员
            Utils.memberRegistration(data.activatemembercard_url)
          }
          this.setData({
            isTouch: true
          })
        }
      }
      if(errcode == 30002 || errcode == 30001){
        // 活动已结束
        let dialogConfig = {
          isRemoveIcon: true,
          isShow: true,
          imgUrl: errcode == 30002 ? this.data.activity.end_time_img : this.data.activity.disqualification_img,
        }
        this.setData({
          dialogConfig: dialogConfig,
          navUrl: errcode == 30002 ? this.data.activity.end_time_url : this.data.activity.disqualification_url,
          isTouch: true
        })
      }
    })
  },

  eggLuck(){
    Fetch({
      loading: false,
      url: Urls.egg_luck,
      method: 'POST',
      data: {
        ac_id: this.data.ac_id,
        ch_id: this.data.ch_id,
        store_num: this.data.store_num,
        guide_id: this.data.guide_id,
      },
    }).then(res => {
      setTimeout(() => {
        this.setData({
          isStart: false,
          isTouch: true
        })
        let { errcode, data } = res
        let awards = this.data.awards
        console.log(errcode)
        if(errcode == 0){
          let awardInfo = awards.find(item => item.id == data.award_id)  // 扭蛋信息
          if(data.is_member == 1){
            let can_join_num = this.data.can_join_num
            this.setData({
              record_id: data.record_id,
              awardShareMainImg: awardInfo.share_img,
              can_join_num: can_join_num <= 0 ? 0 : can_join_num - 1
            })
            let that = this
            this.getCoupon(function(detail){
              console.log('============detail', detail)
              let dialogConfig = {
                isRemoveIcon: data.award_type == 0,
                isShow: true,
                imgUrl:awardInfo.egg_img,
                openBtn: that.data.activity.open_btn_img,
                receiveBtn: that.data.activity.receive_btn_img,
                isGetAward: data.is_get_award,
                friendBtn: that.data.activity.share_btn_img,
                circleBtn: awardInfo.share_Wechat_btn_img
              }
              /**
               * 获取标识
               * 通过标识addcard/商家券
               * 传参dialog, 呼起弹窗
               * 点击弹窗按钮, 调用_clickWinBtn方法,
               * if(普通券){
               *  addcard
               * }else{
               *  商家券
               *
               * }
               */
              if(detail.coupon_type == 1){
                // 商家券
                dialogConfig.coupon_type = detail.coupon_type
                dialogConfig.couponDetail = detail.cardList
              }


              if(awardInfo.win_prize_gif !== ''){  // 如果有gif  3s之后
                that.setData({
                  gifConfig: {
                    isShow: true,
                    imgUrl: awardInfo.win_prize_gif
                  }
                })
                setTimeout(() => {
                  that.setData({
                    dialogConfig,
                    award_item_id: data.award_id,
                    gifConfig: {
                      isShow: false
                    }
                  })
                }, 3000)
              }else{
                that.setData({
                  dialogConfig: dialogConfig,
                  award_item_id: data.award_id
                })
              }
            })
          }else{
            console.log('注册会员')
            if (data.is_get_card) { //不是会员但是领过卡券
              this._openCard(res.data.cardList)
            } else { //不是会员没领过卡券,注册会员
              Utils.memberRegistration(data.activatemembercard_url)
            }
          }
        }

        if(errcode == 30002 || errcode == 30001){
          // 活动已结束
          let dialogConfig = {
            isRemoveIcon: true,
            isShow: true,
            imgUrl: errcode == 30002 ? this.data.activity.end_time_img : this.data.activity.disqualification_img,
          }
          this.setData({
            dialogConfig: dialogConfig,
            navUrl: errcode == 30002 ? this.data.activity.end_time_url : this.data.activity.disqualification_url,
          })
        }

        if(errcode == 50001){  // 无次数
          this.showShareAlert()
        }
      }, 2000)
    })
  },

  // 开始
  play(){
    if(this.data.isTouch && this.data.can_join_num > 0){
      this.setData({
        isTouch: false
      })
      this.getIsMember()
    }else if(this.data.can_join_num == 0){
      console.log('没有次数了')
      this.showShareAlert()
    }
  },

  // 显示分享弹窗
  showShareAlert(){
    this.selectComponent('#com-share').show()
    this.selectComponent('#com-share').setShareConfig({
      friendBtn: this.data.activity.share_btn_img,
      circleBtn: this.data.activity.share_Wechat_def_btn,
      mainImageUrl: this.data.activity.no_num_img
    })
  },

  // 跳转
  toHome(){
    console.log(this.data.navUrl)
    wx.reLaunch({
      url: '/'+this.data.navUrl
    })
  },

  // 跳转活动规则
  toRule(){
    wx.navigateTo({
      url: '/activesubpack/pages/egg/rule/rule?rule_img='+this.data.activity.rule_img
    })
  },

  // 显示弹窗
  showWin(){
    let dialogConfig = {
      isRemoveIcon: true,
      isShow: true,
      imgUrl: this.data.activity.disqualification_img,
    }
    this.setData({
      dialogConfig: dialogConfig
    })
  },

  // 关闭弹窗
  closeWin(){
    this.setData({
      dialogConfig: {
        isShow: false
      }
    })
  },

  // 动画结束之后
  transitionEnd(){
    let awards = this.data.awards
    let num = 1
    // let num = Math.floor(Math.random() * this.data.awardsPosition.length)
    console.log(num)
    awards.forEach((item, index) => {
      let random = this.random(99, 395, 350)
      item.x = this.data.awardsPosition[num][index].x
      item.y = this.data.awardsPosition[num][index].y
      item.deg = random.deg
    })
    this.setData({
      awards
    })
  },

  //查看微信原生卡券
  _openCard(cardList) {
    wx.openCard({
      cardList: cardList,
      success(res) {}
    })
  },

  /**
   * 随机
   * @param {Number} size 随机物品的大小（正方形）
   * @param {Number} w 要随机区域的宽
   * @param {Number} h 要随机位置的高
   */
  random(size, w, h){
    let numX = Math.round(Math.random()*w)
    let numY = Math.ceil(Math.random()*h)
    let deg = Math.round(Math.random()*360)
    // console.log(numX, numY)
    if(w - numX < size){
      numX = size
    }
    if(h - numY < size) {
      numY = size
    }
    return {
      x: numX,
      y: numY,
      deg: deg
    }
  },

  // 查看奖品
  lookPrize(detail){
    console.log('查看奖品', detail)
    if(detail.detail.coupon_type == 1){
      // 商家券领取
      this.closeWin()
      Fetch({
        url: Urls.egg_update,
        data: {
          record_id: this.data.record_id,
          ac_id: this.data.ac_id,
          ch_id: this.data.ch_id,
          store_num: this.data.store_num,
          guide_id: this.data.guide_id,
        }
      })
      // this.update()
    }else{
      if(this.data.isGetAward == 0){
        // 未领取
        this.addCard(this.data.awardList)
        this.closeWin()
      }else{
        Fetch({
          url: Urls.egg_receive,
          method: "POST",
          header: 2,
          data: {
            record_id: this.data.record_id,
            ac_id: this.data.ac_id,
            ch_id: this.data.ch_id,
            store_num: this.data.store_num,
            guide_id: this.data.guide_id,
          }
        }).then(res => {
          console.log(res)
          let { errcode, data } = res
          if(errcode == 0){
            this.addCard(data.cardList)
            this.closeWin()
          }
        })
      }
      let that = this
      this.getCoupon(function(data){
        that.addCard(data.cardList)
        that.closeWin()
      })
    }
  },

  // 请求券信息
  getCoupon(cb){
    Fetch({
      url: Urls.egg_receive,
      method: "POST",
      header: 2,
      data: {
        record_id: this.data.record_id,
        ac_id: this.data.ac_id,
        ch_id: this.data.ch_id,
        store_num: this.data.store_num,
        guide_id: this.data.guide_id,
      }
    }).then(res => {
      console.log(res)
      let { errcode, data } = res
      if(errcode == 0){
        cb(data)
        // this.addCard(data.cardList)
        // this.closeWin()
      }
    })
  },

// 更新券状态
  update(){
    Fetch({
      url: Urls.egg_update,
      data: {
        record_id: this.data.record_id,
        ac_id: this.data.ac_id,
        ch_id: this.data.ch_id,
        store_num: this.data.store_num,
        guide_id: this.data.guide_id,
      }
    }).then(res => {
      Fetch({
        url: Urls.egg_ismember,
        method: "POST",
        data: {
          ac_id: this.data.ac_id,
          ch_id: this.data.ch_id,
          store_num: this.data.store_num,
          guide_id: this.data.guide_id,
        }
      }).then(res => {
        let {errcode, data} = res
        let awards = this.data.awards
        let awardInfo = awards.find(item => item.id == data.award_id)  // 扭蛋信息

        let dialogConfig = {
          isRemoveIcon: data.award_type == 0,
          isShow: true,
          imgUrl: awardInfo.win_prize_img,
          openBtn: this.data.activity.open_btn_img,
          receiveBtn: this.data.activity.receive_btn_img,
          isGetAward: data.is_get_award,
          isWin: 1,
          coupon_type: 0,
        }
        this.setData({
          // isGetAward: data.is_get_award, // 是否领取
          dialogConfig: dialogConfig,
          awardList: data.awardList,
          // isTouch: true,
        })
      })

    })
  },

  addCard(cardList){
    wx.addCard({
      cardList: cardList,
      success: res => {
        // this.update()
      },
      fail: err => {
        console.log('领取失败', err)
      },
    })
  },

  // 打开看看
  openPrize(){
    wx.openCard({
      cardList: this.data.awardList,
      success: res => {
        console.log(res)
      },
      fail: err => {
        console.log(err)
      },
      complete: () => {
        this.setData({
          dialogConfig: {
            isShow: false
          }
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('隐藏')
    clearInterval(timer)
    timer = null
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('卸载')
    clearInterval(timer)
    timer = null
  },

  //注册完成的回调
  registerCallBack() {
    wx.hideLoading();
    // this.play()
  },

  // 中奖之后分享朋友圈
  awardShare(){
    let dialogConfig = {isShow: false}
    this.setData({
      dialogConfig
    })
    this.shareCircle('', this.data.awardShareMainImg)
  },

  // 次数加减
  getEggNum(){
    Fetch({
      url: Urls.egg_index,
      data: {
        ac_id: this.data.ac_id,
        ch_id: this.data.ch_id,
        sh_id: this.data.sh_id,
        store_num: this.data.store_num,
        guide_id: this.data.guide_id,
      }
    }).then(res => {
      let {errcode, data} = res
      if(errcode == 0 || errcode == 200){
        this.setData({
          can_join_num: data.can_join_num
        })
      }
    })
  },

  // 点击分享朋友圈按钮
  shareCircle(e, circleBg){
    let circleBgUrl = circleBg ? circleBg : this.data.activity.share_wechat_def_img
    this.getShareVal(3).then(res => {
      let {errcode, data} = res
      if(errcode == 0 || errcode == 200){
        let qrCode = data.share_url  // 二维码
        this.getEggNum()
        this.selectComponent('#com-share').close()
        this.setData({
          isCanvas: true,
        },() => {
          Poster.drawPoster(circleBgUrl, qrCode).then(res => {
            console.log('==========保存图片', res)
            wx.saveImageToPhotosAlbum({
              filePath: res.tempFilePath,
              success: res => {
                wx.showToast({
                  title: '海报保存成功',
                  icon: 'none',
                  mask: true
                })
                console.log('===========海报保存成功')
              },
              fail: err => {
                wx.showToast({
                  title: '海报保存失败',
                  icon: 'none',
                  mask: true
                })
                console.log('=========海报保存失败', err)
              }
            })
          }).catch(err => {
            console.log('===========海报绘制失败', err)
          })
        })
      }
    })
  },

  setIsCanvas(){
    this.setData({
      isCanvas: !this.data.isCanvas
    })
  },

  /**
   * 分享取值
   * @param {Number} type 分享类型 2：分享好友  3：分享朋友圈
   */
  getShareVal(type){
    if(!type) return console.error('===分享取值没有传type值')
    return new Promise((resolve, reject) => {
      Fetch({
        url: Urls.egg_share,
        method: 'GET',
        data:{
          type,
          openid: this.data.openid,
          ac_id: this.data.ac_id,
          ch_id: this.data.ch_id
        }
      }).then(res => {
        resolve(res)
      })
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let activity = this.data.activity
    let dialogConfig = {isShow: false}
    this.setData({dialogConfig})
    return this.getShareVal(2).then(res => {
      let {errcode, data} = res
      if(errcode == 0 || errcode == 200){
        return {
          title: activity.share_title,
          path: data.share_url,
          imageUrl: activity.share_img,
          success: res => {},
          fail: err => {}
        }
      }
    })
  }
})