import main from '../../utils/utils'
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
    ruleimg : {
      type : String,
      value:''
    }
  },
  data: {
    brand : main.config.brandname
  },
  attached() {},
  methods: {
    closerule() {
      this.triggerEvent('closerule')
    }
  }
})