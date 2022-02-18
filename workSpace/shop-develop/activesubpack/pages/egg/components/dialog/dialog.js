// activesubpack/pages/egg/dialog/dialog.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dialogConfig: {
      type: Object,
      value: {}
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    imgUrl: '',
    // receiveImg: '',
    isRemoveIcon: false,
    isShow: false,
    btnImg: '',
    openBtn: '',
    receiveBtn: '',
    isGetAward: 0,  // 
    isWin: 1, // 判断是不是正常流程

    friendBtn: '', // 分享好友按钮
    circleBtn: '', // 分享朋友圈按钮

    coupon_type: 0, // 0 普通券  1  商家券
    couponDetail: {
      send_coupon_params: [],
      sign: '',
      send_coupon_merchant: ''
    }, // 商家券信息
  },

  attached(){
    
  },

  observers: {
    dialogConfig(newVal){
      let { imgUrl, isRemoveIcon, isShow, openBtn, receiveBtn, isGetAward, isWin, friendBtn, circleBtn, couponDetail, coupon_type } = newVal
      // let receiveImg = imgUrl
      // if(!isRemoveIcon){
      //   imgUrl = openImg
      // }
      console.log(newVal)
      this.setData({
        imgUrl: imgUrl || '',  // 图片
        isRemoveIcon: isRemoveIcon || false,  // 关闭
        isShow: isShow || false, // 是否显示
        btnImg: isGetAward == 0 ? receiveBtn : openBtn,  // 按钮图  中奖
        openBtn: openBtn || '',  // 打开图
        receiveBtn: receiveBtn || '', // 查看（领取）
        isGetAward: isGetAward || 0, // 是否领取过
        isWin: isWin || 0,
        friendBtn: friendBtn || '', // 分享好友按钮
        circleBtn: circleBtn || '', // 分享朋友圈按钮

        coupon_type,
        couponDetail
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭弹窗
    _close(){
      this.triggerEvent('customevent',{})
    },

    // 商家券
    getcoupon(params){
      console.log('=======params', params)
      this.triggerEvent('lookPrize', {
        coupon_type: this.data.coupon_type,
        ...params,
      })
    },

    // 点击查看
    _clickWinBtn(){
      console.log('==============_clickWinBtn')
      if(this.data.isWin == 1){
        if(this.data.isGetAward == 0){
          console.log('查看-领取')
          this.triggerEvent('lookPrize', {})
        }else{
          console.log('打开看看')
          this.triggerEvent('openPrize', {})
        }
      }else{
        console.log('查看-领取')
        this.triggerEvent('lookPrize', {})
      }
    },

    // 点击分享朋友圈海报
    _share(){
      this.triggerEvent('awardShare', {})
    },

    // 活动结束/无资格
    _toHome(){
      this.triggerEvent('toHome', {})
    }
  }
})
