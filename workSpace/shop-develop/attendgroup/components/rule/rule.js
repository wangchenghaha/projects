import main from '../../utils/utils'
import img from '../../model/img-model'
import API from '../../api/index';
/**
 * 规则
 */
Component({
  options: {
  },
  properties: {
    showrule : {
      type : Boolean,
      value:false
    },
    brand : {
      type : String,
      value : ''
    },
    campainExplain : {
      type : String,
      value : ''
    },
    basecolor : {
      type : String,
      value : ''
    },
  },
  data: {
    bigPhone : main.judgeBigScreen(),
    imgUrl:API.CrmImgUrl,
    pictureIdList: img.ruleList,
  },
  attached() {

  },
  ready: function() {
    var _this = this;

    main.getPictureList(API.getPictureList, '').then(res => {
      _this.setData({
        imgList: res.data.data
      });
    }); },
  methods: {
    closerule() {
      this.triggerEvent('closerule')
    },
  },

})