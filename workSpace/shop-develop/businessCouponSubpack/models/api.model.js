

import config from '../models/config.model'
const { apiUrl } = config
export default {
  is_member: `${apiUrl}/api/valentine/isMember`, //判断是否是会员
  coupon_exchange: `${apiUrl}/page/shop/mini-coupon-exchange`, //获取优惠券
  coupon_update: `${apiUrl}/page/mini-update-coupon`, //更新券状态
  coupon_card_data: `${apiUrl}/page/shop/mini-is-getcoupon`, //获取打开数据
  coupon_location: `${apiUrl}/api/getLocation`, //记录地址信息
  gzh_data:`${apiUrl}/api/launch/index`,//公众号数据

}