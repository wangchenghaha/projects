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
}

export default new Service()