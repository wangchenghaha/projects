import main from '../../utils/utils'
import img from '../../model/img-model'
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
    }
  },
  data: {
    bigPhone : main.judgeBigScreen(),
    rulebg : img.rulebg,
    rule_close : img.rule_close,
    rule_next : img.rule_next,
    rule_bottom : img.rule_bottom,
    basecolor:img.basecolor
  },
  attached() {},
  methods: {
    closerule() {
      this.triggerEvent('closerule')
    }
  }
})