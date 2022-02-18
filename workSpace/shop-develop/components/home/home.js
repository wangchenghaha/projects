import {homePage} from '../../service/mini'
import {obj2css, isJSONStr, splitImg, countDown} from '../../utils/utils'
import {EVENTS, KEYSTORAGE, URL_CDN} from "../../src/const";
import {getCRMInfo} from "../../service/member";
import {wxShowToast} from "../../utils/wxMethods";
import {wxSubscription} from "../../utils/wxSubscribe";
import {goodsDetailgetCouponList} from "../../service/coupon";
import {retailRecNew} from "../../service/goods";
import events from "../../src/events";
const PLATFORM = 'wechatApplet';
const app = getApp();
const {channel, brand, cdn, SOURCEID_BRAND, FULL_SCREEN} = app.config;
const pageModuleName = {
  // 大轮播
  largeLoop: 'largeLoop',
  // 2个
  category: 'category',
  // 4个
  categoryFour: 'categoryFour',
  categorySix: 'categorySix',
  categoryThree: 'categoryThree',
  categoryFive: 'categoryFive',
  leftFourRightSix: 'leftFourRightSix',
  leftSixRightFour: 'leftSixRightFour',
  newDragTwo: 'newDragTwo',
  newDragThree: 'newDragThree',
  tuangouBanner: 'tuangouBanner',
  shortVideo: 'shortVideo',
  new: 'new', // 上新
  hot: 'hot',
  flow: 'flow',
  video: 'video',
  guessLike: 'guessLike',
  recommendSale: 'recommendedSale',
  getCoupon: 'getCoupon',
  jumpMiniProgram: 'jumpMiniProgram',
  textAnnouncement: 'textAnnouncement',
  rollHorizontally: 'rollHorizontally',
  hotSearch: 'hotSearch',
  search: 'search'
};
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    showFixedTop: Boolean,
    homePageHotSearch: Boolean
  },
  /**
   * 组件的初始数据
   */
  data: {
    FULL_SCREEN,
    // 搜索框位置
    searchPos: 20,
    swiper: {
      data: [],
      indicatorDots: true,
      autoplay: true,
      circular: true,
      interval: 3000,
      duration: 500,
    },
    // 轮播视频静音按钮
    icon_voice: splitImg('icon_voice.png', 'common'),
    icon_voice_no: splitImg('icon_voice_no.png', 'common'),
    pageModule: [],
    // 会员等级
    memberLevel: '0', // 0 :新人， 1： 普卡， 2: 银卡， 3： 金卡
    // 一键领取
    coupon_display: false,
    hasCoupon: false,
    activityInfo:[],
    inputUrl: '/pages/index',
    // 热销
    hotSaleArr: [],
    // 秒杀
    secKill: {},
    // 热词搜索
    searchKeyWord: [],
    swiperTransform: 'transform: translateX(0); transition: all 0.3s',
    background: [{
      imgUrl: splitImg('test_1_0922.jpg')
    },{
      imgUrl: splitImg('test_1_0922.jpg')
    },
      {
        imgUrl: splitImg('test_1_0922.jpg')
      },],
    currentIndex:0,
    textArr:[
      {
        title:"RANDOMEVENT SEEING IS ENDITED",
        titlebot:"WALLPAPAER 热销爆款 ",
        labelArr:["VM","JJ","XLL"],
      },
      {
        title:"乐一通合作系列",
        titlebot:"RANDOMEVENT ",
        labelArr:["VM","XS","XXXXL"],
      },
      {
        title:"史努比合作系列",
        titlebot:"RANDOMEVENT ",
        labelArr:["ONLY","ADidas","Nike"],
      },
    ],
  },
  lifetimes: {
    ready(){
      console.log('未播放**', Date.now())
      this.getHome();
      this.getMemberLevel();
      this.setPagePos();
      app.getSearchKeyWords(this);
      //订阅登录事件
      events.register(this, EVENTS.EVENT_LOGINED);
    },
    detached() {
      events.unregister(this, EVENTS.EVENT_LOGINED);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleChange(e) {
      const {index} = e.currentTarget.dataset;
      const myCurrent = `pageModule[${index}].myCurrent`;
      this.setData({
        [myCurrent]:  e.detail.current,
      })
    },
    handleEvent: function (event, type) {
      if (type === EVENTS.EVENT_LOGINED && event) {
        this.getMemberLevel();
      }
    },
    setPagePos(){
      // 获取右侧胶囊大小
      const {top, height } = wx.getMenuButtonBoundingClientRect();
      const {screenHeight, windowHeight} = wx.getSystemInfoSync();
      this.setData({
        searchPos: top + (height/4),
        screenHeight,
        windowHeight
      })
    },
    changeVoice(e){
      const {row, index} = e.currentTarget.dataset;
      let {pageModule} = this.data;
      const curSwiperItem = pageModule[row].imgList[index]
      curSwiperItem.videoMuted = !curSwiperItem.videoMuted;
      this.setData({pageModule})
    },
    changeSwiper(e){
      let {index, module} = e.currentTarget.dataset;
      const {current, source} = e.detail;
      const {pageModule} = this.data;
      const list = pageModule[index].imgList;
      list.forEach((item, ind) => {
        // 当前帧播放，其他帧暂停
        const i = `${index}-${ind}`;

        if(item.type === 'video'){
          if(ind === current){
            this[`myVideo${i}`].play();
          }else{
            this[`myVideo${i}`].pause();
          }
        }
      });
      if( module === 'largeLoopB'){
        index -= 1;
      }
      const progressWidth = `pageModule[${index}].progressWidth`;
      const myCurrent = `pageModule[${index}].myCurrent`;
      this.setData({
        [progressWidth]: this.computeProgress(list, current),
      });
      if(source === 'touch'){
        this.setData({
          [myCurrent]: current
        })
      }
      // this.changeLargeLoopB(index, current)
    },
    // 计算轮播进度条宽度
    computeProgress(list = [], curIndex = 0){
      const size = list.length;
      return  ((curIndex + 1) / size) * 100 + '%';
    },
    // 获取会员等级
    async getMemberLevel(){
      const loginInfo = wx.getStorageSync(KEYSTORAGE.loginInfo);
      if(loginInfo){
        // const param = {
        //   unionid: wx.getStorageSync(KEYSTORAGE.unionid),
        //   brand: ETO_BRAND[brand]
        // };
        // shoppingamount销售额来确定是否购买过商品。
        let crmInfo = wx.getStorageSync(KEYSTORAGE.crmInfo);
        if(!crmInfo){
          crmInfo = await getCRMInfo()
        }
        const {shoppingamount, level = ''} = crmInfo;
        let {memberLevel} = this.data;
        switch (level) {
          case '普通会员':
            if(Number(shoppingamount) === 0){
              memberLevel = '0';
            }else{
              memberLevel = '1';
            }
            break;
          case '银卡会员':
            memberLevel = '2';
            break;
          case '金卡会员':
            memberLevel = '3';
            break;
        }
        this.setData({memberLevel})
      }
    },
    getPromotionActionList(){
      let beanJson = {
        brandCode: brand,
        channelCode: channel,
      }
      // 获取优惠券
      goodsDetailgetCouponList(beanJson).then(data=>{
        if(data.promotionActionList.length === 0){
          return
        }
        let actionCouponList = data.promotionActionList[0];
        let curTime = new Date().getTime();
        if(curTime < (new Date(actionCouponList.actionStartDate).getTime() - 288000000)
          || (new Date(actionCouponList.actionEndDate).getTime() + 57600000) < curTime){
          return
        }
        let actionList = actionCouponList.actionCouponList;
        for (let i = 0; i < actionList.length; i++) {
          actionList[i].imgUrl = cdn + actionList[i].imgUrl
        }
        if(actionCouponList){
          this.setData({
            activityInfo: actionCouponList,
            hasCoupon: true,
          })
        }
      }).catch(err=>{

      })
    },
    // 一键领取
    async getCoupon(e){
      this.buryingPoint(e);
      if (getApp().checkLogin()) {
        if( wx.getStorageSync(KEYSTORAGE.crmInfo).phone){
          if(!wx.getStorageSync('wxSubscriptions').isActivity){
            const subscription = await wxSubscription("activity");
            this.setData({
              coupon_display: true,
            });
          }else{
            this.setData({
              coupon_display: true,
            })
          }
        }else{
          app.getCRMInfoFn();
        }
      }
    },
    // 获取优惠券信息
    getCouponInfo(){
      let beanJson = {
        brandCode: brand,
        channelCode: channel,
      };
      // 获取优惠券
      goodsDetailgetCouponList(beanJson).then(data=>{
        if(data.promotionActionList.length ) {
          let actionCouponList = data.promotionActionList[0];
          let curTime = new Date().getTime();
          if (curTime < (new Date(actionCouponList.actionStartDate).getTime() - 288000000)
            || (new Date(actionCouponList.actionEndDate).getTime() + 57600000) < curTime) {
            return
          }
          let actionList = actionCouponList.actionCouponList;
          actionList.forEach(item => {
            item.imgUrl = cdn + item.imgUrl
          });
          if (actionCouponList) {
            this.setData({
              activityInfo: actionCouponList,
              hasCoupon: true,
            })
          }
        }
      })
    },
    // 去掉客服弹窗
    changeShow(e){
      this.setData({
        tipShow: false,
        noScroll: false,
        coupon_display: false,
      });
    },
    openMiniProgram(e){
      const {id} = e.currentTarget.dataset;
      app.gioTrack('pageclick_home_to_othermini', {
        appId: id
      } )
    },
    buryingPoint(e){
      const {link = '', module = '', index='', moduleIndex = 0, text='' } = e.currentTarget.dataset;
      try {
        switch (module){
          case pageModuleName.largeLoop:
            app.tdSdkEvent(`pageclick_home_slide_L`, {});
            app.tdSdkEvent(`pageclick_home_slide_L_${index + 1}`, {GOODS_ID: link});
            app.gioTrack('pageclick_home_slide', {
              url: link,
              moduleIdx: moduleIndex,
              slideIdx: index,
              slideType: 'L'
            } )
            break;
          case pageModuleName.video:
            app.tdSdkEvent('pageclick_home_video', {});
            app.gioTrack('pageclick_home_video', {
              videoUrl: link,
              moduleIdx: moduleIndex
            })
            break;
          case pageModuleName.shortVideo:
            app.tdSdkEvent('pageclick_home_video_short', {});
            break;
          case pageModuleName.new:
            app.tdSdkEvent(`pageclick_home_new_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_new`, {});
            app.gioTrack('pageclick_home_new', {
              url: link,
              moduleIdx: moduleIndex
            })
            break;
          case pageModuleName.newDragTwo:
            app.tdSdkEvent(`pageclick_home_1with2goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_1with2goods`, {});
            app.gioTrack('pageclick_home_1with2goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.newDragThree:
            app.tdSdkEvent(`pageclick_home_1with3goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_1with3goods`);
            app.gioTrack('pageclick_home_1with3goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.hot:
            app.tdSdkEvent(`pageclick_home_1goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_1goods`);
            app.gioTrack('pageclick_home_1goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.category:
            app.tdSdkEvent(`pageclick_home_2goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_2goods`);
            app.gioTrack('pageclick_home_2goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.categoryThree:
            app.tdSdkEvent(`pageclick_home_3goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_3goods`);
            app.gioTrack('pageclick_home_3goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.categoryFour:
            app.tdSdkEvent(`pageclick_home_4goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_4goods`);
            app.gioTrack('pageclick_home_4goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.categoryFive:
            app.tdSdkEvent(`pageclick_home_5goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_5goods`);
            app.gioTrack('pageclick_home_5goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.categorySix:
            app.tdSdkEvent(`pageclick_home_6goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_6goods`);
            app.gioTrack('pageclick_home_6goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.leftFourRightSix:
            app.tdSdkEvent(`pageclick_home_L4R6goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_L4R6goods`);
            app.gioTrack('pageclick_home_L4R6goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.leftSixRightFour:
            app.tdSdkEvent(`pageclick_home_L6R4goods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_L6R4goods`);
            app.gioTrack('pageclick_home_L6R4goods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.flow:
            app.tdSdkEvent(`pageclick_home_fallgoods_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_fallgoods`);
            app.gioTrack('pageclick_home_fallgoods', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.tuangouBanner:
            app.tdSdkEvent('pageclick_home_groupbanner');
            app.gioTrack('pageclick_home_groupbanner', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.alubm:
            app.tdSdkEvent('pageclick_home_brand');
            app.gioTrack('pageclick_home_brand', {
              moduleIdx: moduleIndex,
              url: link
            })
            break;
          case pageModuleName.getCoupon:
            app.tdSdkEvent(`pageclick_home_getCoupon_${index + 1}`, {GOODS_ID: link});
            app.tdSdkEvent(`pageclick_home_getCoupon`);
            break;
          case pageModuleName.rollHorizontally:
            app.gioTrack('pageclick_home_hscroll', {
              moduleIdx: moduleIndex,
              url: link
            })
            break
          case pageModuleName.hotSearch:
            app.gioTrack('pageclick_home_keyword_search', {
              keyword: text,
            });
            break
          case pageModuleName.search:
            app.gioTrack('pageclick_home_search')
        }
      }catch (e) {}
    },
    onClick(e){
      const {link, module} = e.currentTarget.dataset;
      this.buryingPoint(e);
      if(module === 'video'){
        this.videoClick(e);
      }
      if(link && link.toLocaleLowerCase().endsWith('mp4')){
        return
      }
      app.navigateTo(link)
    },
    videoClick(e){
      const {moduleIndex, loop} = e.currentTarget.dataset;
      if(loop){
        return
      }
      const pause = `pageModule[${moduleIndex}].pause`;
      this.setData({
        [pause]: true
      })
    },
    // 视频加载完成
    loadVideo(e){
      const {moduleIndex, module, index} = e.currentTarget.dataset;
      if(module === 'video'){
        const loaded = `pageModule[${moduleIndex}].loaded`;
        this.setData({ [loaded]: true })
      }
      if(module === 'largeLoop'){
        const loaded = `pageModule[${moduleIndex}].imgList[${index}].loaded`;
        this.setData({ [loaded]: true })
      }
    },
    async getHome(){
      try{
        let res = wx.getStorageSync(KEYSTORAGE.HOME_DATA);
        if(!res || res.length === 0){
          wx.showLoading({title: '加载中...'})
          res = await  homePage();
          wx.setStorageSync(KEYSTORAGE.HOME_DATA, res)
          wx.hideLoading();
        }
        const path = getCurrentPages();
        if(Array.isArray(res) && res.length){
          // 过滤小程序模块
          const pageModule = res.filter(item => {
            if(item.value && item.value.multipleChoicesList && Array.isArray(item.value.multipleChoicesList)){
              return item.value.multipleChoicesList.includes(PLATFORM)
            }
          });
          pageModule.forEach((item, index) => {
            const {backgroundColor = 'none',
              fontSize = '',
              isWeight = false,
              padding = [],
              textAlign = 'left',
              textColor = '#000',
              moduleType,
              imgList,
              goodsList = [], timeData = '', paddingBottom, paddingLeft, paddingRight, paddingTop} = item.value;
            let cssObj = {
              'color': textColor,
              'background-color': backgroundColor,
              'font-size': fontSize ? `${fontSize}rpx` : '28rpx',
              'font-weight': isWeight ? 'bolder' : 'normal',
              'text-align': textAlign,
              padding: `${paddingTop || 0 }rpx ${paddingRight || 0}rpx ${paddingBottom || 0}rpx ${paddingLeft || 0}rpx`,
            };
            item.cssStyle = obj2css(cssObj, ['dbcommon' , 'dbcommonimg', 'imgLink', 'imgUrl']);
            // 横向滚动
            if(goodsList.length){
              goodsList.forEach(item => {
                item.querySkus = isJSONStr(item.querySkus) ? JSON.parse(item.querySkus) : {}
              })
            }
            // 轮播图
            if(moduleType === 'largeLoop'){
              let swiperVideoPlay = true;
              imgList.forEach((picItem , swiperIndex) => {
                if(picItem.imgListImage[0].imgUrl.toLocaleLowerCase().endsWith('mp4')){
                  // 静音
                  picItem.videoMuted = true;
                  // 第一个播放，其他不播放
                  picItem.autoplay = swiperVideoPlay;
                  swiperVideoPlay = false;

                  let t1 = setTimeout(() => {
                    const i = `${index}-${swiperIndex}`;
                    this[`myVideo${i}`] = wx.createVideoContext(`myVideo${i}`);
                    clearTimeout(t1);
                  }, 300)
                }
                // 文字
                if(picItem.textList && picItem.textList.length){
                  picItem.textList.forEach(textItem => {
                    const { isWeight, textColor} = textItem;
                    textItem.textStyle = `font-weight: ${isWeight ? 'bolder': 'normal'}; color: ${textColor};` + obj2css(textItem, ['textColor', 'text', 'isWeight']);
                    console.log(textItem.textStyle,'###')
                  })
                }
                // 按钮
                if(picItem.butList && picItem.butList.length){
                  picItem.butList.forEach(btnItem => {
                    const { buttonText,
                      buttonBordeRadius,
                      buttonBorder,
                      buttonBorderColor = '#000',
                      buttonColor='#000',
                      buttonBorderWidth = 1, buttonHeight, buttonSize, buttonWidth, marginLeft = 0, marginTop} = btnItem;
                    const btnStyle = {
                      margin: `${marginTop}rpx 0 0 ${marginLeft}rpx`,
                      width: buttonWidth,
                      height: buttonHeight,
                      color: buttonColor,
                      'line-height': buttonHeight,
                      'font-size': buttonSize,
                      border: `${buttonBorder} ${buttonBorderWidth}rpx ${buttonBorderColor}`,
                      'border-radius': `${buttonBordeRadius}rpx`
                    };
                    btnItem.btnStyle = obj2css(btnStyle)
                  })
                }
              });
              item.progressWidth = this.computeProgress(imgList);
              // item.myCurrent = 1;
            }
            //  限时秒杀
            if(moduleType === 'tuangouBanner' && timeData){
              const {secKill} = this.data;
              const timeStr =timeData.replace(/-/g, '/');
              const timeStamp = Date.parse(timeStr);
              Object.assign(secKill, {[index]: {
                  timeStamp,
                  value: ''
                }});
              this.setData({ secKill, });
              this.countTimeDown();
            }
            Object.assign(item, item.value)
          });
          this.setData({ pageModule })
        }
        this.getRetailRecGoods()
        this.getPromotionActionList()
      }catch (e) {
        wxShowToast('请下拉刷新！')
        this.setData({errorText: '请下拉刷新!'})
      }
    },
    countTimeDown(){
      if(Object.keys(this.data.secKill).length){
        const {secKill} = this.data;
        const t1 = setInterval(() => {
          let isClear = false;
          for(let key in secKill){
            const {day, hou, min, sec} = countDown(secKill[key].timeStamp);
            const showDay = (day === '00' || day == 0) ? '' : `${day}天`;
            // secKill[key].value = `${showDay}${hou}   ${min}   ${sec}`;
            secKill[key].value = {
              showDay, hou, min, sec
            }
            isClear = Date.now() >= secKill[key].timeStamp;
          }
          this.setData({secKill})
          if(isClear){
            clearInterval(t1)
          }
        }, 1000)
      }
    },
    getRetailRecGoods(){
      let param = {
        sceneId: 'sy101',
        returnCount: 50,
        sceneType: 3,
        sourceId: SOURCEID_BRAND[brand],
        openId: wx.getStorageSync(KEYSTORAGE.openid) || '',
        brand
      };
      retailRecNew(param).then(res => {
        if(res && Array.isArray(res) && res.length){
          let result = res.filter(item => item.gsColorCode);
          let skuParam = {
            size: URL_CDN.IMGSIZE7201280
          };
          result.forEach(item => {
            skuParam.sku = item.gsColorCode;
            item.goodsImg  = cdn + item.gscMaincolPath
          });
          this.setData({
            hotSaleArr: result
          });
        }
      })
    },
    change(){
      let hotSaleArr = this.data.hotSaleArr;
      for (let i = 0; i < 4; i++) {
        let shift = hotSaleArr.shift();
        hotSaleArr.push(shift);
      }
      this.setData({
        hotSaleArr
      })
    },
  }
})
