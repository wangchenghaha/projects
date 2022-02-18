// components/orderCenter/orderCenter.js
import {formatDate, getdate, orderStatus, skuToImg} from '../../../utils/utils'
import {KEYSTORAGE, URL_CDN} from '../../../src/const'

const app = getApp();
let queryParam = {
  shareBy: wx.getStorageSync(KEYSTORAGE.guideInfo).employeeId || '',
    status: '',
    utmSource: '',
    startTime: '',
    endTime: '',
    page: 1,
    pageSize: 10
};

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    employeeId: String,
    orderList:Array,
  },

  /**
   * 组件的初始数据
   */
  data: {
    screenShow: false,
    condition:{
      date:{
        startTime:'2018-01-01',
        endTime: formatDate(Date.now()),
      },
      /*
      * '全部', '微信消息', '朋友圈'
      * */
      channel:[
        {
          name:'全部',
          value:''
        },
        {
          name:'微信消息',
          value:'wechat'
        },
        {
          name:'朋友圈',
          value:'wx_moment_web'
        }
      ],
      orderStatus: [
        [
          {name:'全部',
            selected: true,
            value:''
          },
          {name:'待付款',
            value:'WaitingPay'
          },
          {name:'待发货',
          value:'WaitingShipment',
          },
        ],
        [
          {name:'已发货',
            value:'WaitingReceive'
          },
          {name:'已申请退款',
            value:'ApplyRefunding'
          },
          {name:'已退款',
            value:'RefundSuccess'
          },
        ]
      ]
    },
    // orderList:[],

    channelIndex:0,
  },
  /*
  * 组件生命周期函数，在组件布局完成后执行，此时可以获取节点信息
  * */
  ready: function(){
    queryParam.shareBy = this.properties.employeeId;
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e){
      let dataCode = e.currentTarget.dataset.code;
      let index = e.currentTarget.dataset.index || 0;
      switch (dataCode){
        case 'screen':
          this.showScreen();
          break;
        case 'channel':
          this.selectChannel(index);
          break;
        case 'order':
          this.selectOrder(e);
          break;
        case 'hideScreen':
          this.hideScreen();
          break;
        case 'complete':
          this.completeScreen();
          break;
        case 'date':
          this.selectDate(e);
          break;
      }
    },
    showMore(e){
      const {orderList} = this.properties;
      const {index} = e.currentTarget.dataset;
      orderList[index].showMore =  !orderList[index].showMore;
      this.setData({orderList})
    },
    showScreen(){
      this.setData({screenShow: true});
    },
    hideScreen(){
      this.setData({screenShow: false});
    },
    // 筛选完成
    completeScreen: function(){
      this.hideScreen();
      queryParam.page = 1;
      this.triggerEvent('getOrderList', queryParam);
    },
    // 选择渠道
    selectChannel(index){
      this.setData({channelIndex: index});
      queryParam.utmSource = this.data.condition.channel[index].value;
    },
    selectDate(e){
      let type = e.currentTarget.dataset.type;
      let curTime = e.detail.value;
      let condition = this.data.condition;
      if(type === 'startTime'){
        condition.date.startTime = curTime;
        queryParam.startTime = curTime;
      }else{
        condition.date.endTime = curTime;
        queryParam.startTime = curTime;
      }
      this.setData({condition});
    },
    // 选择订单状态
    selectOrder(e){
      let dataItem = e.currentTarget.dataset.item;
      let condition = this.data.condition;
      condition.orderStatus.forEach(itemArr => {
        itemArr.forEach(item => {
          if(item.name === dataItem.name) {
            item.selected = true;
            queryParam.status = item.value;
          }else{
            item.selected = false
          }
        })
      });
      this.setData({ condition });
    },

    // 分享订单
    /*guideOrderList() {
      let t1 = setTimeout(()=>{
        wx.showLoading({
          title:'加载中',
          mask: true
        });
      },800);
      guideOrderList(queryParam).then( res => {
        if(Array.isArray(res.List) && res.List.length > 0){
          let goodsImgParam = {
              brand: brand,
            size: URL_CDN.IMGSIZE240400
          };
          res.List.forEach( item => {
            goodsImgParam.sku = item.goods_color_code;
            item.goodsImg = cdn + skuToImg(goodsImgParam);
            item.newStatus = orderStatus(item.status);
            item.payment_time = getdate(item.payment_time)
          });
          let orderList = this.data.orderList;
          orderList = orderList.concat(res.List);
          this.setData({orderList: orderList});
        }
        wx.hideLoading();
        clearTimeout(t1);
      }).catch( err => {
        clearTimeout(t1);
        wx.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        })
      });

    },*/

  },
  // 下拉加载
  moved: function(){
    console.log('下拉')
  },
});
