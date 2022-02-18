import main from '../../utils/utils'
import img from '../../imgmodel/imgmodel'
const app = getApp();
const cdn = app.config.cdn;
const brand = app.config.brand;
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
    }
  },
  data: {
    bigPhone : main.judgeBigScreen(),
    ruletext : img.ruletext
  },
  attached() {
    
  },
  methods: {
    closerule() {
      this.triggerEvent('closerule')
    }
  }
})