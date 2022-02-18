/**
 * 商家券组件（模态框）
 * 
 * create by ant.liu
 */

Component({
  options: {
    multipleSlots: true
  },
  properties: {},
  data: {
    compShow: false, // 组件是否显示
    successCb: null, // 成功回调
    failCb: null, // 失败回调
    sellerticket: null, // 商家券信息
  },
  pageLifetimes: {},
  attached() { },
  methods: {
    /**
     * 打开组件事件
     * @param {object} sellerticket 商家券信息
     * @param {function} success 成功回调
     * @param {function} fail 失败回调
     */
    openHandle(obj) {
      const successCb = obj.success, failCb = obj.fail, sellerticket = obj.sellerticket;
      if (!sellerticket) {
        throw new Error('组件传参错误');
      }
      if (successCb && Object.prototype.toString.call(successCb) != '[object Function]') {
        throw new Error('组件传参错误');
      }
      if (failCb && Object.prototype.toString.call(failCb) != '[object Function]') {
        throw new Error('组件传参错误');
      }
      this.data.successCb = successCb;
      this.data.failCb = failCb;
      this.setData({
        sellerticket,
        compShow: true,
      })
    },
    cancelHandle() {
      this.setData({
        compShow: false,
      })
      this.data.failCb && this.data.failCb();
    },
    successHandle(e) {
      this.setData({
        compShow: false,
      })
      this.data.successCb && this.data.successCb(e.detail);
    }
  }
})
