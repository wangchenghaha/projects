// weMall/components/guideScreen/guideScreen.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
  },

  /**
   * 组件的初始数据
   */
  data: {
    show: false,
    screenList: [
      {
        text: "入会时间",
        list: [
          {
            text: '全部',
            checked: true
          },
          {
            text: '今天',
          },
          {
            text: '昨天',
          },
          {
            text: '近7天',
          }
        ],
        showDate: true
      },
      {
        text: '会员等级'
      },
      {
        text: '最近下单时间'
      },
      {
        text: '付款金额(元)'
      },
      {
        text: '回购周期(元)'
      },
      {
        text: '属性标签'
      },

    ],
    startDate: '',
    endDate: ''
  },
  lifetimes:{
    ready(){
      console.log(this.data.show,'#')
      this.setData({show: true})
      console.log(this.data.show,'#')
    },
    moved(){
      this.setData({show: false})
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    hideScreen(){
      this.triggerEvent('hideScreen', false)
    },
    showScreen(){},
    selectTime(e){
      const {screenList} = this.data;
      const {index, ind} = e.currentTarget.dataset;
      screenList[index].list.forEach((item, i) => {
        item.checked = ind === i
      });
      this.setData({screenList})
    },
    changeTime(e){
      const {type} = e.currentTarget.dataset;
      this.setData({
        [type]: e.detail.value
      })
    }
  }
})
