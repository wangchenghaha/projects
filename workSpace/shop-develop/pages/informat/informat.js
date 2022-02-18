import { objToQuery } from '../../utils/utils'
import { getFashionList } from '../../service/mini'
import { wxShowToast } from '../../utils/wxMethods'
const app = getApp();

Page({
  data: {
    List : [],
  },

  //加载中
  onLoad : function(options){
    app.setUtmOptions(options);
  },
	// 下拉刷新
	onPullDownRefresh(){
  	this.initData();
		this._getFashionList();
	},
  _getFashionList: function(){
    if(!this.pageData.isPull){
      wxShowToast('数据加载完成');
      return;
    }
    let time = setTimeout( () => {
      wx.showLoading({
        title: '加载中...'
      });
    }, 500);
    let pageNumber = this.pageData.pageNum++;
    let param = {
      brand: app.config.brand,
      pageNumber,
      pageSize: 10
    };
    getFashionList(param).then(res => {
      this.clearTime(time);
      if(res.list){
        const List = this.data.List.concat(res.list);
        this.setData({ List  });
        this.pageData.isPull = this.pageData.pageNum <= res.totalPage
      }
    }).catch(err => {
      this.clearTime(time);
      wxShowToast(err.message)
    })
  },
  /*
  * 分页数据
  * */
  pageData: {
    isPull: true,
    pageNum: 1
  },
  clearTime(time){
    clearTimeout(time);
    wx.hideLoading();
  },
	initData(){
		this.setData({
			List: []
		});
		this.pageData = {
			isPull: true,
			pageNum: 1,
		};
	},
  //渲染
  onShow: function () {
    wx.setStorageSync('openOtherMiniprogram', true);
		this.initData();
    this._getFashionList();
    app.track()
  },

  //点击列表
  clickList: function(e){
    const _index = parseInt(e.currentTarget.id);
    const curItem = this.data.List[_index];
    const newsID = curItem.newsId;
    const title = curItem.title;
    const createdTime = curItem.createdTime;
    try {
      app.tdSdkEvent('pageclick_trendyzone_'+(_index+1), {
        ALBUM_NAME: title,
        NEWS_ID: newsID
      });
      app.tdSdkEvent('pageclick_trendyzone_all', {
        ALBUM_NAME: title,
        NEWS_ID: newsID
      })
    }catch (e) {}
    const param = {
    	newsID,
	    createdTime: encodeURIComponent(createdTime),
	    title: encodeURIComponent(title)
    };
    wx.navigateTo({
      url: '../informatCon/informatCon' + objToQuery(param)
    });
  },
  onReachBottom(){
    this._getFashionList()
  },

});  