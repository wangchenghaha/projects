const app = getApp();
const BRAND = app.config.brand;
const CDN = app.config.cdn;
const imgUrl = `${CDN}/assets/common/image/`;
const NEW_ICON = imgUrl + 'new_icon.png';
const UP_ICON = imgUrl + 'up_icon.png';
const DOWN_ICON = imgUrl + 'down_icon.png';
const KEEP_ICON = imgUrl + 'keep_icon.png';
const status = '';
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rankingList: Array,
    rankingTitle: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    curRanking: [],
    moneyIcon: `${imgUrl}money-icon.png`,
    tabItem4: false,
    rankingIcon: NEW_ICON,
    rankingStatus: status
  },
  ready: function(){
    this.getRankingList();
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 获取排行
    getRankingList(){
      let curRanking = this.data.curRanking;
      let rankingList = this.properties.rankingList;
      let tabItem4 = this.data.tabItem4;
      // 判断是否tab栏个数大于4，大于4显示两行if(item.status.toUpperCase() === 'NEW'){
      //
      //                       }
      rankingList.length > 4 ? tabItem4 = true :'';
      rankingList.forEach( rankItem => {
        rankItem.active ? curRanking = rankItem.list :'';
        rankItem.list.forEach(item => {
          if(item.status && item.status.toUpperCase() === 'NEW'){
            item.rankingText = '新进榜';
            item.rankingIcon = NEW_ICON;
          }else{
            if(item.serialNum > 0){
              item.rankingText = '上升' + Math.abs(item.serialNum);
              item.rankingIcon = UP_ICON
            }else if(item.serialNum < 0) {
              item.rankingText = '下降'+ Math.abs(item.serialNum);
              item.rankingIcon = DOWN_ICON
            }else{
              item.rankingText = '持平';
              item.rankingIcon = KEEP_ICON
            }
          }
        })

      });
      this.setData({curRanking, tabItem4})
    },
    // 事件汇总
    onClick(e){
      let clickType = e.currentTarget.dataset.type;
      switch (clickType){
        case 'job':
          this.changeJob(e);
          break;
        case '':
          break;
      }
    },
    // 切换人群
    changeJob(e){
      let dataIndex = e.currentTarget.dataset.index;
      let rankingList = this.data.rankingList;
      let curRanking = this.data.curRanking;
      rankingList.forEach( (item, index) => {
        dataIndex === index ? item.active = true : item.active = false
      });
      curRanking = rankingList[dataIndex].list;
      this.setData({rankingList, curRanking})
    }
  }
});
