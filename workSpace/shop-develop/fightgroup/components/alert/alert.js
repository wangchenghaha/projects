import img from '../../model/img-model'
/**
 * 弹框
 */
Component({
  options: {
  },
  properties: {
    showoption : {
      type : Object,
      value:{}
    }
  },
  data: {
    groupsuc : img.groupsuc,
    alert_tip : img.alert_tip,
    succes : img.succes,
    basecolor : img.basecolor
  },
  attached() {
    
  },
  methods: {
    clicksure() {
      this.triggerEvent('clicksure',this.data.showoption)
    }
  }
})