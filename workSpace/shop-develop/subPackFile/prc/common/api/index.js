import config from '../../config/index'
const baseUrl = config.debug ? config.local.origin : config.proxy.origin

export default {
    home: `${baseUrl}/api/beat-unhappy/index`, // get
    join: `${baseUrl}/api/beat-unhappy/join`, // post
    sendCoupon: `${baseUrl}/api/beat-unhappy/send-coupon`, // post 
    toggleCoupon: `${baseUrl}/api/beat-unhappy/update-coupon`, //post
}