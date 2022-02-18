import {getGoodsDetail} from '../../service/goods'
import {wxShowToast} from '../../utils/wxMethods'
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      colorCode: String,
      colorList: Array,
    },
    lifetimes: {
      ready() {
        this.init();
      }
    },
    /**
     * 组件的初始数据
     */
    data: {
      show: false,
      className: false,
      // 颜色索引
      colorCodeIndex: -1,
      // 尺码索引
      sizeIndex: -1,
      // 购买数量
      count: 1,
      goodsName: ''
    },

    /**
     * 组件的方法列表
     */
    methods: {
      init(){
        const {colorList, colorCode} = this.properties;
        if(colorCode){
          const colorCodeIndex = colorList.findIndex(item => item.colorCode === colorCode);
          this.setData({
            show: true,
            className: true,
            colorCodeIndex
          });
        }
      },

      // 切换颜色
      selectColor(e){
        const {index} = e.currentTarget.dataset;
        const {colorList} = this.properties;
        if(colorList[index].sellStock <= 0){
          return
        }
        this.setData({
          colorCodeIndex: index,
          sizeIndex: -1,
          count: 1
        })
      },
      selectSize(e){
        const {index} = e.currentTarget.dataset;
        const { colorList } = this.properties;
        const { colorCodeIndex } = this.data;
        if(colorCodeIndex < 0){
          wxShowToast('请选择颜色');
          return
        }
        if(colorList[colorCodeIndex].sellStock <= 0){
          wxShowToast('请选择其他颜色')
          return;
        }
        const { sizes } = colorList[colorCodeIndex];
        if(sizes[index].sellStock <= 0){
          wxShowToast('库存不足')
          return;
        }
        this.setData({
          sizeIndex: index,
          count: 1
        })
      },
      // 选择数量
      changeCount(e){
        const {type} = e.currentTarget.dataset;
        const { colorList } = this.properties;
        let { count, colorCodeIndex, sizeIndex } = this.data;
        const curSize = colorList[colorCodeIndex].sizes[sizeIndex];
        if(sizeIndex < 0){
          wxShowToast('请选择尺码')
          return
        }
        if(type > 0){
          // 增加
          if(count < curSize.sellStock){
            count++
          }
        }else{
          if(count > 1){
            count--;
          }
        }
        this.setData({count})
      },
      confirmGoods(){
        const { colorList } = this.properties;
        let { count, colorCodeIndex, sizeIndex, goodsName } = this.data;
        if(colorCodeIndex < 0){
          wxShowToast('选择颜色');
          return;
        }
        if(sizeIndex < 0){
          wxShowToast('选择尺码');
          return
        }
        this.hidePop();
        this.triggerEvent('confirmGoods', {
          color: colorList[colorCodeIndex],
          sizeIndex,
          count,
          goodsName
        })
        console.log(colorList[colorCodeIndex], sizeIndex, count)
      },
      hidePop(){
        this.triggerEvent('confirmGoods', {});
        this.setData({
          className: false
        })
      },
      transitionend(){
        const {className} = this.data;
        this.setData({
          show: className
        })
      }
    }
})
