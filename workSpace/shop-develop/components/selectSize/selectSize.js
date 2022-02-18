// components/selectSize/selectSize.js
Component({
  /*options: {
    // styleIsolation: 'apply-shared',
    addGlobalClass: true
  },*/
  /**
   * 组件的属性列表
   */
  properties: {
    show: Boolean,
    bottom: String,
    goodsColor: Array, // 商品颜色信息
    colorIndex: Number, // 商品默认索引
  },
  /**
   * 组件的初始数据
   */
  data: {
    color: ['绿色', '红色', '黑色', '白色', '灰色'],
    size: ['150', '150', '150', '150', '150', '150', '150', '150', '150', '150'],
    goodsNum: [
      {
        type:'minus',
        value: '-',
        width: 52
      },
      {
        type:'num',
        value: 1,
        width: 100
      },
      {
        type: 'plus',
        value: '+',
        width: 52
      }
    ]
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log(this.properties.goodsColor,'**********')
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },
  created: function(){
    console.log(this.properties.goodsColor,'created**********')
  },
  attached: function(){
    console.log(this.properties.goodsColor,'attached**********')
  },ready: function(){
    console.log(this.properties.goodsColor,'ready**********')
  },
  pageLifetimes: {
    show: function() {
      // 页面被展示
      console.log(this.properties.goodsColor,'show**********')
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onClick(e){
      const dataType = e.currentTarget.dataset.type;
      switch (dataType){
        case 'close':
          this.triggerEvent('closeSelectSize', false);
          break;
        case 'selectColor':
          this.selectColorFn();
          break;
        case 'selectSize':
          this.selectSizeFn(e);
          break;
      }
    },
    selectColorFn() {
      console.log(this.properties.goodsColor,'show**********')
    },
    selectSizeFn(e){
      const dataIndex = e.currentTarget.dataset.index;
      const goodsColor = this.properties.goodsColor;
      const colorIndex = this.properties.colorIndex;
      let goodsColorSize = goodsColor[colorIndex].sizes;
      goodsColorSize.forEach((item, index) => {
        if(index === dataIndex){
          item.selected = !item.selected
        } else{
          item.selected = false
        }
      })

    }
  }
})
