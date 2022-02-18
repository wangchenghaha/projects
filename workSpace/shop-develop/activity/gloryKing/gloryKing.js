// activity//gloryKing/gloryKing.js
import {splitImg, objToQuery} from '../../utils/utils'
import {KEYSTORAGE} from '../../src/const'
import { gloryKing } from '../../service/index'
const app = getApp();
const brand = app.config.brand;
const cdn = app.config.cdn;
const goodsDetailUrl = (sku) => {
  return `/pages/content/content?colorCode=${sku}`
};
let curPath = 'activity/gloryKing/gloryKing';
let brandData = {
  ONLY: {
    border: 'solid 1rpx #7e1639',
    color: "#7e1639",
    webView: 'https://m.only.cn/customPage/ONLY/WZRY1112/indexw.html',
    nearShop: 'https://www.woaap.com/store-html/store/lbs_m?tpl_id=155&appid=c3259690d51106851a84cd0317d14a2d&tag=348',
    couponPage:{},
    mainImgList: [
      {
        autoplay: true,
        videoUrl: `${cdn}/assets/common/${brand}/video/wangzhe1.mp4?v=1`,
        text: '视频'
      },
      {
        imgUrl: '',
        linkUrl: '',
        text: "一键GET豪华大礼包",
        width: 380,
        bgColor: '#7e1639'
      },{
        imgUrl: splitImg('wangzhe1.jpg'),
        linkUrl: '',
        text: "99"
      },
      {
        imgUrl: '',
        linkUrl: '',
        text: "一键GET豪华大礼包",
        width: 380,
        bgColor: '#7e1639'
      },
      {
        imgUrl: splitImg('wangzhe2.jpg'),
        linkUrl: '',
        text: "潮流"
      },
      {
        videoUrl: `${cdn}/assets/common/${brand}/video/wangzhe2.mp4?v=1`,
        text: '视频'
      },
      {
        imgUrl: '',
        brand: 3,
        appId: 'wxccfd1cc23fce2fe5',
        linkUrl: curPath,
        text: "片尾闺蜜的故事，点击解锁",
        width: 440,
        bgColor: '#7e1639'
      },
      {
        imgUrl: splitImg('wangzhe3.jpg'),
        linkUrl: '',
        text: "潮流"
      },
      {
        imgUrl: '',
        linkUrl: '',
        text: "一键GET豪华大礼包",
        width: 440,
        bgColor: '#7e1639'
      },
      {
        videoUrl: `${cdn}/assets/common/${brand}/video/wangzhe3.mp4?v=1`,
        text: '视频'
      },
    ]
  },
  JACKJONES: {
    border: 'solid 1rpx #003f75',
    color: "#003f75",
    webView: 'https://m.jackjones.com.cn/customPage/JACKJONES/WZRY1114/indexw.html',
    nearShop: 'https://www.woaap.com/store-html/store/lbs_m?tpl_id=151&appid=b7359edb3407eefa5d415dc3a1506039&tag=349',
    couponPage: {},
    mainImgList: [
      {
        autoplay: true,
        videoUrl: `${cdn}/assets/common/${brand}/video/wangzhe1.mp4?v=1`,
        text: '视频'
      },
      {
        imgUrl: '',
        linkUrl: '',
        text: "一键GET豪华大礼包",
        width: 380,
        bgColor: '#003f75'
      },{
        imgUrl: splitImg('wangzhe1.jpg'),
        linkUrl: ''
      },
      {
        imgUrl: '',
        linkUrl: '',
        text: "一键GET豪华大礼包",
        width: 380,
        bgColor: '#003f75'
      },
      {
        imgUrl: splitImg('wangzhe2.jpg'),
        linkUrl: '',
      },
      {
        videoUrl: `${cdn}/assets/common/${brand}/video/wangzhe2.mp4?v=1`,
        text: '视频'
      },
      {
        imgUrl: '',
        brand: 1,
        appId: 'wxa3d9d2199eeded73',
        linkUrl: curPath,
        text: '片尾小姐姐故事，点击解锁',
        width: 500,
        bgColor: '#003f75'
      },
      {
        imgUrl: splitImg('wangzhe3.jpg'),
        linkUrl: ''
      },
      {
        imgUrl: splitImg('wangzhe4.jpg'),
        linkUrl: goodsDetailUrl('220109508C38')
      },
      {
        imgUrl: splitImg('wangzhe5.jpg'),
        linkUrl: goodsDetailUrl('220121527E39')
      },{
        imgUrl: splitImg('wangzhe6.jpg'),
        linkUrl: goodsDetailUrl('220133517C40')
      },
      {
        imgUrl: splitImg('wangzhe7.jpg'),
        linkUrl: goodsDetailUrl('220133514E03')
      }
    ],
  },
  VEROMODA: {
    border: 'solid 1rpx #fff',
    color: "#000",
    webView: 'https://m.veromoda.com.cn/customPage/VEROMODA/20191115WAARY/indexw.html',
    nearShop: 'https://www.woaap.com/store-html/store/lbs_m?tpl_id=154&appid=6dfd7b94c190bf7356a5b6c4f1f3a97c&tag=350',
    couponPage: {},
    mainImgList: [
      {
        autoplay: true,
        videoUrl: `${cdn}/assets/common/${brand}/video/wangzhe1.mp4?v=1`,
        text: '视频'
      },
      {
        imgUrl: '',
        linkUrl: '',
        text: "一键GET豪华大礼包",
        width: 380,
        bgColor: '#000',
      },{
        imgUrl: splitImg('wangzhe1.jpg'),
        linkUrl: '',
        text: "99"
      },
      {
        imgUrl: '',
        linkUrl: '',
        text: "一键GET豪华大礼包",
        width: 380,
        bgColor: '#000',
      },
      {
        imgUrl: splitImg('wangzhe2.jpg?v=1'),
        linkUrl: '',
        text: "秀场"
      },
      {
        videoUrl: `${cdn}/assets/common/${brand}/video/wangzhe2.mp4?v=1`,
        text: '视频'
      },
      {
        imgUrl: '',
        brand: 2,
        appId: 'wx7f1b0d611e93dea4',
        linkUrl: curPath,
        text: "片尾小哥哥的故事，点击解锁",
        width: 460,
        bgColor: '#000',
      },
      {
        imgUrl: splitImg('wangzhe3.jpg?v=1'),
        linkUrl: '',
      },
      {
        imgUrl: splitImg('wangzhe4.jpg'),
        linkUrl: '',
      },
      {
        imgUrl: splitImg('wangzhe5.jpg?v=1'),
        linkUrl: '',
      },
      {
        imgUrl: splitImg('wangzhe6.jpg'),
        linkUrl: '',
      },
      {
        imgUrl: splitImg('wangzhe7.jpg'),
        linkUrl: '',
      },
    ]
  },
  SELECTED: {},
  FOL:{},
  JLINDEBERG:{},
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: {},
    footer: {
      list: [
        {
          text: '去官网抢购',
          linkUrl: brandData[brand].webView,
        },
        {
          text: '去门店逛逛',
          linkUrl: brandData[brand].nearShop
        }
      ],
      bgColor: brandData[brand].color,
      border: brandData[brand].border
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getGloryKing(options);
    console.log(options,'****王者活动')
	  app.setUtmOptions(options);
  },
	getGloryKing(options){
		gloryKing().then(res => {
			if(res){
				brandData[brand].couponPage = res.couponPage;
				this.setData({
					imgList: brandData[brand]
				});
				this.handleLinkUrl(options);
			}
		}).catch(err => console.log(err))
	},
  // 根据utm_term 加载优惠券链接
  handleLinkUrl(options){
    let utmOptions = wx.getStorageSync(KEYSTORAGE.utmOptions);
    let localUtm = {};
    if(utmOptions && utmOptions.length){
      utmOptions.forEach(item => {
        let itemKey = item.key;
        if(itemKey && itemKey.includes('utm')){
          let key = itemKey.toLocaleLowerCase().replace('utm', 'utm_');
          localUtm[key] = item.value;
        }
      });
    }
    const utmTerm = options.utm_term || localUtm.utm_term || '';
    let imgList = this.data.imgList;
    imgList.mainImgList.forEach(item => {
      if(item.text && item.width){
        if(item.appId){
          // 跳转小程序
          const utm_term = item.brand + utmTerm.substr(1);
          // localUtm
          let newOptions = Object.assign(options, localUtm, {utm_term});
          item.linkUrl = curPath + objToQuery(newOptions);
        }else{
          // 领券链接
          item.linkUrl = `/${imgList.couponPage[utmTerm]}`
        }
      }
    });
    this.setData({imgList})
  },
  onClick(e){
    const dataType = e.currentTarget.dataset.type;
    switch (dataType) {
      case 'detail':
        this.openDetail(e);
        break;
      case 'footer':
        this.openFooter(e);
        break;
    }
  },
  openDetail(e){
    const dataIndex = e.currentTarget.dataset.index;
    const imgList = this.data.imgList;
    const url = imgList.mainImgList[dataIndex].linkUrl;
    if(url){
      app.navigateTo(url);
    }
  },
  openFooter(e){
    const footer = this.data.footer;
    const dataIndex = e.currentTarget.dataset.index;
    const url = footer.list[dataIndex].linkUrl;
    if(url){
      app.navigateTo(url);
    }
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
	  const {couponPage} = this.data.imgList;
	  const termArr = Object.keys(couponPage);
    const utmParam = {
      utm_medium: 'MP',
      utm_source: 'AD',
      utm_term: termArr[termArr.length - 1], // 取最后一个参数
      utm_campaign: '20191111HOK'
    };
    return {
      title: app.config.title,
      path: curPath + objToQuery(utmParam)
    }
  }
})