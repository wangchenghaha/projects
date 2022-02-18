import {orderCount} from '../../../service/order'
import events from "../../../src/events";
import {EVENTS} from "../../../src/const";
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    status: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    navBar: [
      {
        text: '全部',
        iconNum: 0,
        checked: true,
        status: ''
      },
      {
        text: '待付款',
        iconNum: 0,
        status: 'WaitingPay'
      },
      {
        text: '待拼购',
        iconNum: 0,
        status: 'waiting_for_pintuan'
      },
      {
        text: '待发货',
        iconNum: 0,
        status: 'WaitingShipment'
      },
      {
        text: '待收货',
        iconNum: 0,
        status: 'WaitingReceive'
      },
      {
        text: '退换货/售后',
        iconNum: 0,
        status: 'refund',
        list: [
          {
            text: '退货单',
          },
          {
            text: '换货单',
          }
        ]
      }
    ]
  },
  lifetimes: {
    ready(){
      this.getOrderIconNum();
      events.register(this, EVENTS.EVENT_OREDERCOUNT);
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    handleEvent: function (event, type) {
      if(type === EVENTS.EVENT_OREDERCOUNT){
        this.getOrderIconNum();
      }
    },
    getOrderIconNum(){
      // {"watShipmentCount":0,"watPayCount":10,"afterSaleCount":0,"watReceiveCount":0}
      orderCount().then(res => {
        if(res){
          const {navBar} = this.data;
          const {status} = this.properties;
          navBar.forEach(item => {
            item.checked = item.status === status;
            item.iconNum = res[item.status];
          });
          this.setData({navBar});
        }
      }).catch(err => console.log(err))
    },
    changeNav(e){
      const {index} = e.currentTarget.dataset;
      const {navBar} = this.data;
      const curOrderStatus = navBar[index].status;
      navBar.forEach( (item, ind) => {
        item.checked = index === ind;
      });
      this.setData({navBar});
      this.triggerEvent('changeNav', curOrderStatus)
    },
  }
})
