//index.js
//获取应用实例
import main from "../base/mains.js"
import {urls} from "../base/url.js"
import API from '../api/index'


Component({
  options: {
    multipleSlots: true,
  },
  properties: {
    // 组件的对外属性
    imageList: {
      type: Array,
      value: [],
    },
  },
  data: {
    loadCount:0,
    isShow:true,
  },
  attached() {
    
  },
  methods: {
    loadImage(){
      this.data.loadCount++;
      if(this.properties.imageList.length == this.data.loadCount){
        this.setData({
          isShow:false,
        })
        this.triggerEvent("finish", this.properties.imageList);
      }
    },
    catch() {
      return;
    },
  }
})