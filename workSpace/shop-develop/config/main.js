/*
 * @Author: your name
 * @Date: 2020-06-08 17:53:00
 * @LastEditTime: 2020-08-22 16:55:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /FOL/config/main.js
 */
//主配置(通用)

module.exports = {
  // 42022J541A06  0.02商品 42032J002   10.02

  //区别生产和测试 (true: 测试， false：正式)
  DEV: false,
  //版本号
  versionName: '3.6.588',
  //版本code
  versionCode: 788, //版本每次加1
  //ETO品牌映射
  ETO_BRAND: {
    ONLY: 1,
    JACKJONES: 2,
    VEROMODA: 3,
    SELECTED: 4,
    JLINDEBERG: 5,
    FOL: 6,
    NAMEIT: 8,
  },
  // weMember品牌映射
  WE_MEMBER_BRAND: {
    ONLY: 'only',
    JACKJONES: 'jj',
    VEROMODA: 'vm',
    SELECTED: 'selected',
    JLINDEBERG: 'jl',
    FOL: 'fold',
  },
  // 优惠券 品牌映射
  VOUCHER_BRAND: {
    ONLY: 'ONLY',
    JACKJONES: 'Jack & Jones',
    VEROMODA: 'Vero Moda',
    SELECTED: 'SELECTED',
    JLINDEBERG: 'J.LINDEBERG',
    FOL: 'FOL',
    NAMEIT: 'Name it'
  },
  SOURCEID_BRAND:{
    ONLY: '51',
    JACKJONES: '52',
    VEROMODA: '53',
    SELECTED: '54',
    JLINDEBERG: '1',
	  FOL: '56'
  },
  // 订单类型
  ORDER_TYPE: {
    NORMAL: 'NORMAL', // 普通订单(包括，优惠券，促销)
    POINT: 'POINT', //积分订单
    ONE: 'ONE',//1分钱订单
    ZERO : 'ZERO',//0元订单 emVybw==
    INNER : 'INNER', //内购
    PRESELL: 'PRESELL',//预售订单 //1,预售 2，
    BARGAIN: 'BARGAIN',//砍价
    CUSTOMER: 'CUSTOM', //定制
    PINTUAN: 'PINTUAN', //拼团
    FENXIAO: 'FENXIAO', // 分销
    WISH: 'XINYUANDAN', // 心愿单
  },
  // 订单渠道
  CHANNEL_ID: 9,

  //cdn主机地址
  cdn: 'https://cdn.bestseller.com.cn',
  // wemall cdn地址
  WE_MALL_CDN: 'https://wemall.truu.com.cn',
  // 相差天数
  differDay: 15,
  // 会员开卡 固定为此 appid，不可改动
  openCardAppId: 'wxeb490c6f9b154ef9',
  // 渠道
  channel: 'MINIPROGRAM',
  // ETO接口
	domainETO: 'https://bestseller-wechat.woaap.com',
	// weMember
  bestsellerWoaap: 'https://bestseller.woaap.com/bestseller/',
  // wemeber
  isUserWeMember: false,
	// 企业微信设备标识
	WX_WORK: 'wxWork',
  // orderToken
  ORDER_TOKEN: 'f215f9d75839fc716a6bd1ce82fe08fd',
  // 服务热线
  SERVER_HOT_LINE: '400-862-8888',
  // 买家秀图片域名 测试
  BUYERSHOW_USER_TEST: 'http://db.vm.cn/upload_pic/',
  // 买家秀图片域名
  BUYERSHOW_URL:" https://cdn.bestseller.com.cn/upload_pic/",
  //
  GIO_PROJECT_ID: 'b4c3710d08ba6a5d',
  // 储值卡路径
  STORE_VALUE_PATH: '/pages/giftcardModule/pages/index/index'
  /*plugin: {
    chiji: {
      "version": "1.2.3",
      "provider": "wx8841fc25f377dd0a"
    },
    wangzhe: {
      "version": "2.3.15",
      "provider": "wx7f7e7540b604d784"
    }
  }*/
}
