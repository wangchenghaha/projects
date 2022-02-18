// components/allShare/allShare.js
import { shareTemplateState } from '../../../service/saleState'
let employeeId = '';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    employeeId: String,
    // allList: Array,
  },
  ready: function(){
    employeeId = this.properties.employeeId;
    //初始化DOM
    this._initDom();
    this._shareTemplateState();
  },

  /**
   * 组件的初始数据
   */
  data: {
    allList:[
      {
        name: "推荐搭配",
      },
      /*{
        name: "自由组合",
      },
      {
        name: "软文&活动",
      },
      {
        name: "总计"
      }*/
    ]
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e) {
      let dataIndex = e.currentTarget.dataset.index;
      let allList = this.data.allList;
      let id = e.currentTarget.dataset.id;
      if(id || id===0){ // 分享次数点击
        let curItem = allList[id].shareItem;
        curItem[dataIndex].isShow = !curItem[dataIndex].isShow;
      }else{ // 推荐搭配点击
        allList.forEach(item => {  // 只显示一个
          if(!item.isShow){
            item.shareItem.forEach(item => {
              item.isShow = false;
            })
          }
        });
        allList[dataIndex].isShow = !allList[dataIndex].isShow;
      }
      this.setData({allList})
    },
    subClick(e){
      // console.log(e);
      let dataIndex = e.currentTarget.dataset.index;

      let allList = this.data.allList;
      let curItem = allList[id];
      curItem.shareItem[dataIndex].isShow = !curItem.shareItem.isShow;
      this.setData({allList})

    },
    _initDom(){
      let allList = this.data.allList;
      let shareDetail = [
        {
          wxMsg: "微信消息",
          wxMsgNum: 0
        },
        {
          wxMsg: "朋友圈",
          wxMsgNum: 0
        },
      ];
      let shareItem = [
        {
          tempNameNum: '模板数量',
          tempNum: 0
        },
        {
          tempNameNum: '分享次数',
          tempNum: 0
        },
        {
          tempNameNum: '购买人数',
          tempNum: 0
        },
        {
          tempNameNum: '购买金额',
          tempNum: 0
        },
        {
          tempNameNum: '平均客单价',
          tempNum: 0
        },
        {
          tempNameNum: '平均客件数',
          tempNum: 0
        },
      ];
      shareItem.forEach(item => {
        if(item.tempNameNum !== '模板数量'){
          item.shareDetail = JSON.parse(JSON.stringify(shareDetail))
        }
      });
      allList.forEach( item => item.shareItem = shareItem);
      this.setData({allList})
    },
    /*
    * @arr 当前循环数组，
    * @shareFriend  分享给好友次数
    * @shareMoment  分享朋友圈次数
    * */
    _wxMsg(arr, shareFriend, shareMoment){
      arr.forEach(item => {
        item.wxMsg === '微信消息' ? item.wxMsgNum = shareFriend : item.wxMsgNum = shareMoment;
      })
    },
    _shareTemplateState(){
      let localOrdersResult = wx.getStorageSync('ordersResult');
      if(localOrdersResult){
        this.setData({allList: localOrdersResult});
        return;
      }
      shareTemplateState(employeeId).then(res => {
        let ordersResult = res.ordersResult;
        let orderFriendCount = 0;     // 微信消息购买人数
        let orderMomentCount = 0;     // 朋友圈购买人数
        let salesFriendCount = 0;     // 微信消息购买金额
        let salesMomentCount = 0;     // 朋友圈购买金额
        let avgOrderPriceFriend = 0;     // 微信消息平均客单价
        let avgOrderPriceMoment = 0;     // 朋友圈平均客单价
        let avgOrderGoodsFriend = 0;     // 微信消息平均客件数
        let avgOrderGoodsMoment = 0;     // 朋友圈平均客件数*/
        ordersResult.forEach((item, index) => {
          if(item.wemall_channel === '微信消息'){
            orderFriendCount = item.total_order_count || 0;
            salesFriendCount = item.total_sales * 100 || 0;
            avgOrderPriceFriend = item.avg_order_price * 100 || 0;
            avgOrderGoodsFriend = item.avg_order_goods_count || 0;
          }else if(item.wemall_channel === '朋友圈'){
            orderMomentCount = item.total_order_count || 0;
            salesMomentCount = item.total_sales * 100 || 0;
            avgOrderPriceMoment = item.avg_order_price * 100 || 0;
            avgOrderGoodsMoment = item.total_order_count || 0;
          }
        });
        let allList = this.data.allList;
        allList.forEach(item1 => {
          if(item1.name === '推荐搭配'){
            item1.shareItem.forEach(item2 => {
              if(item2.tempNameNum === '模板数量'){
                item2.tempNum = res.templateResult.total_template_count || 0
              }
              if(item2.tempNameNum === '分享次数'){
                let shareFriendCount = parseInt(res.templateResult.total_share_friend_count) || 0;
                let shareMomentCount = parseInt(res.templateResult.total_share_moment_count) || 0;
                item2.tempNum = shareFriendCount + shareMomentCount;
                this._wxMsg(item2.shareDetail, shareFriendCount, shareMomentCount)
              }
              if(item2.tempNameNum === '购买人数'){
                item2.tempNum = orderFriendCount + orderMomentCount;
                this._wxMsg(item2.shareDetail, orderFriendCount, orderMomentCount)
              }
              if(item2.tempNameNum === '购买金额'){
                item2.tempNum = ((salesFriendCount + salesMomentCount)/100).toFixed(2);
                this._wxMsg(item2.shareDetail, (salesFriendCount/100).toFixed(2), (salesMomentCount/100).toFixed(2));
              }
              if(item2.tempNameNum === '平均客单价'){
                item2.tempNum = ((avgOrderPriceFriend + avgOrderPriceMoment)/100).toFixed(2);
                this._wxMsg(item2.shareDetail, (avgOrderPriceFriend/100).toFixed(2), (avgOrderPriceMoment /100).toFixed(2));
              }
              if(item2.tempNameNum === '平均客件数'){
                item2.tempNum = avgOrderGoodsFriend + avgOrderGoodsMoment;
                this._wxMsg(item2.shareDetail, avgOrderGoodsFriend, avgOrderGoodsMoment );
              }
            })
          }
        });
        wx.setStorageSync('ordersResult', allList);
        this.setData({allList});
      }).catch(err => {
        wx.showToast({
          title: err.message,
          duration: 2000
        })
      })
    }
  }
});
