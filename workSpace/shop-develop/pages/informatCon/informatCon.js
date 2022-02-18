
import { fashionDetail } from '../../service/mini'
import { wxShowToast } from '../../utils/wxMethods'
import { splitImg, objToQuery } from '../../utils/utils'
const app = getApp();
const brand = app.config.brand;
var newsID = 0;
let curOptions = {};

Page({

  //页面的初始数据
  data: {
    // 判断是否是iphoneX
    isIphoneX: app.globalData.isIPhoneX,
    wrap : false,
    isVideo : false,  //判断类型，是否是视频类型  默认不是
    conList : {},

    footList : []
  },

  //生命周期函数--监听页面加载
  onLoad: function (options) {
  	curOptions = options;
    newsID = options.newsID;
    let conList = this.data.conList;
    if(options.createdTime){
    	options.createdTime = decodeURIComponent(options.createdTime)
    }
    if(options.title){
    	options.title = decodeURIComponent(options.title)
    }
    Object.assign(conList, options);
    this.setData({
      conList,
    });
    this.getFashionDetail();
	  app.setUtmOptions(options);
  },
  getFashionDetail(){
    fashionDetail(newsID).then(res => {
	    wx.stopPullDownRefresh();
      let conList = this.data.conList;
      res.forEach(item => {
        if(item.detailPic && item.detailPic.toLocaleLowerCase().endsWith('mp4')){
          item.mediaType = 'video'
        }else{
          item.mediaType = 'image'
        }
      });
      conList.data = res;
      this.setData({
        conList
      })
    }).catch(err => {
	    wx.stopPullDownRefresh();
      wxShowToast(err.message);
    })
  },
  onClick(e){
    const dataIndex = e.currentTarget.dataset.index;
    const {title, data} = this.data.conList;
    const curItem = data[dataIndex];
    const gioName = 'pageclick_trendyzone_article';
    const albumname = title || ''
    // 打开专辑页
    if(curItem.link){
      app.navigateTo(curItem.link);
      app.gioTrack(gioName, {
        albumname,
        url: curItem.link
      })
      return;
    }
    // 打开详情
    const code = curItem.code;
    if(code){
      const goodsDetail = `/pages/content/content?colorCode=${code}`;
      const goodsList = `/pages/goodsList/goodsList?list=${code}`;
      const url = code.length === 6 ? goodsList : goodsDetail
      app.gioTrack(gioName, { albumname,  url })
      wx.navigateTo({
        url
      });
    }
  },
  //生命周期函数--监听页面显示
  onShow: function () {
    app.track()
  },

  //跳转到详情页面
  toContent : function(e){
    var code = e.currentTarget.id;
    if( !code){
      return;
    }
    wx.setStorageSync('IWantBuy', false);
    const goodsDetail = `../content/content?colorCode=${code}`;
    const goodsList = `../goodsList/goodsList?list=${code}`;
    wx.navigateTo({
      url: code.length === 6 ? goodsList : goodsDetail
    });
  },

  openNewInformatCon: function(e){
    var _newId = e.currentTarget.id;

    wx.redirectTo({
      url: '/pages/informatCon/informatCon?newsID=' + _newId
    });
  },

  //转发
  onShareAppMessage: function(options){
    const con = this.data.conList;
    let title = con.title;
    const param = {
	    newsID,
	    createdTime: encodeURIComponent(con.createdTime),
	    title: encodeURIComponent(title),
	    utm_source: curOptions.utm_source || '',
	    utm_campaign: curOptions.utm_campaign || '',
	    utm_medium: curOptions.utm_medium || '',
	    utm_term: curOptions.utm_term || '',
    };
    let path = '/pages/informatCon/informatCon' + objToQuery(param);
    let imageUrl = con.coverPic;
    if(newsID + '' === '1199228609241604097' || newsID + '' === '1199208702546337794'){
    	imageUrl = splitImg('fashion_share_cover.jpg')
    }
    // 转发成功
    try{
      app.tdsdk.share({
        title,
        path: path,
        shareTickets: res.shareTickets
      });
      app.gioTrack('pageclick_trendyzone_article_viewproduct', {
        content_Id: newsID,
        title,
      })
    }catch (e) {}

    console.log('转发路径', path);
    return {
      title,
      path: path,
      imageUrl,
      success: function (res) {
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }


})
