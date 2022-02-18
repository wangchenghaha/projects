import rp from '../fetch/index'
import API from '../common/api/index'

class Service {
    constructor() {}

    home(data={}) {
        return rp({data, headerType: 0, url: API.home, method: 'get'})
    }

    join(data={}) {
        return rp({data, headerType: 0, url: API.join, method: 'post'})
    }

    sendCoupon(data={}) {
        return rp({data, headerType: 0, url: API.sendCoupon, method: 'post'})
    }

    toggleCoupon(data={}) {
        return rp({data, headerType: 0, url: API.toggleCoupon, method: 'post'})
    }

    // 转盘部分
    thome(data = {}) {
        return rp({data, headerType: 0, url: API.thome, method: 'get'})
    }
    award(data = {}) {
        return rp({data, headerType: 0, url: API.award, method: 'post'})
    }
    handleCoupon(data = {}) {
        return rp({data, headerType: 0, url: API.handleCoupon, method: 'post'})
    }
    couponStatus(data = {}) {
        return rp({data, headerType: 0, url: API.couponStatus, method: 'get'})
    }

    // 哆啦A梦转盘部分
    doraThome(data = {}) {
        return rp({data, headerType: 0, url: API.doraThome, method: 'get'})
    }
    doraAward(data = {}) {
        return rp({data, headerType: 0, url: API.doraAward, method: 'post'})
    }
    doraHandleCoupon(data = {}) {
        return rp({data, headerType: 0, url: API.doraHandleCoupon, method: 'post'})
    }
    doraCouponStatus(data = {}) {
        return rp({data, headerType: 0, url: API.doraCouponStatus, method: 'get'})
    }
}

export default new Service()