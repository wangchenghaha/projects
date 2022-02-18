const app = getApp();

function brandAdapter() {
  let adapter = {};
  switch (app.config.brand) {
    case 'JACKJONES':
      adapter = {
        couponFirst: 60,
        couponScend: 80,
        couponLimit: 600,
        jumpLink: '/activity/jumpGame/welCome/index',
        backgroundColor: "#e2e2e2",
        textColor: '#1761a8'
      }
      break;
    case 'SELECTED':
      adapter = {
        couponFirst: 20,
        couponScend: 50,
        couponLimit: 300,
        jumpLink: '/pages/goodsList/goodsList?list=116306',
        backgroundColor: "#f4f4f4",
        textColor: '#8e71a0',
        activityRule(){
          return [
            {text: '1. 活动时间：2021.08.12-2021.08.30'},
            {text: '2. 点击活动入口参与膨胀券活动，即可获得指定专区消费满300-20优惠券，在活动有效期内将活动链接分享给1名好友，邀请好友助力。好友助力成功后，即可获得额外指定专区消费满300-50优惠券；'},
            {text: '3. 被分享者通过帮助好友助力即可获得一张指定专区消费满300-20优惠券，被分享者可通过再次转发该链接，并获得任意1名好友助力来获得指定专区消费满300-50优惠券；'},
            {text: '4. 活动期间，每位用户仅可成功点亮一次，获得300-20与300-50优惠券各一张；'},
            {text: '5. 优惠券具体使用方式及细则请见券面说明；'},
            {text: '6. 活动期间每位用户每天总共可以为不同好友助力3次。'}
          ]
        },
      }
      break;
    case 'VEROMODA':
      adapter = {
        couponFirst: 60,
        couponScend: 100,
        couponLimit: 600,
        jumpLink: '/pages/goodsList/goodsList?list=116180',
        backgroundColor: "#f9eded",
        textColor: '#e45959'
      }
      break;
    case 'ONLY':
      adapter = {
        couponFirst: 20,
        couponScend: 50,
        couponLimit: 300,
        jumpLink: '/pages/goodsList/goodsList?list=116161',
        backgroundColor: "#f1daae",
        textColor: '#000',
        activityTime: '2021.08.20-2021.08.31',
        endTime: '2021-08-31 23:59:59',
        activityRule(){
          return [
            {text: '1. 活动时间：2021.08.12-2021.08.30'},
            {text: '2. 点击活动入口参与膨胀券活动，即可获得指定专区消费满300-20优惠券，在活动有效期内将活动链接分享给1名好友，邀请好友助力。好友助力成功后，即可获得额外指定专区消费满300-50优惠券；'},
            {text: '3. 被分享者通过帮助好友助力即可获得一张指定专区消费满300-20优惠券，被分享者可通过再次转发该链接，并获得任意1名好友助力来获得指定专区消费满300-50优惠券；'},
            {text: '4. 活动期间，每位用户仅可成功点亮一次，获得300-20与300-50优惠券各一张；'},
            {text: '5. 优惠券具体使用方式及细则请见券面说明；'},
            {text: '6. 活动期间每位用户每天总共可以为不同好友助力3次。'}
          ]
        },
      }
      break;
    case 'FOL':
      adapter = {
        couponFirst: 25,
        couponScend: 39,
        couponLimit: 199,
        jumpLink: '/pages/index/index',
        backgroundColor: "#7f27a2",
        textColor: '#FFFFFF',
        activityTime: '2021.12.7-2021.12.11',
        // 月日必须为两位数
        endTime: '2021-12-11 23:59:59',
        helpCount: 2,
        activityRule(){
          return [
            {text: `1. 活动时间：${this.activityTime}`},
            {text: `2. 点击活动入口参与膨胀券活动，即可获得指定专区消费满${adapter.couponLimit}-${adapter.couponFirst}优惠券，在活动有效期内将活动链接分享给${adapter.helpCount}名好友，邀请好友助力。好友助力成功后，即可获得额外指定专区消费满${adapter.couponLimit}-${adapter.couponScend}优惠券；`},
            {text: `3. 被分享者通过帮助好友助力即可获得一张指定专区消费满${adapter.couponLimit}-${adapter.couponFirst}优惠券，被分享者可通过再次转发该链接，并获得任意2名好友助力来获得指定专区消费满${adapter.couponLimit}-${adapter.couponScend}优惠券；`},
            {text: `4. 活动期间，每位用户仅可成功点亮一次，获得${adapter.couponLimit}-${adapter.couponFirst}与${adapter.couponLimit}-${adapter.couponScend}优惠券各一张；`},
            {text: '5. 优惠券使用时间：2021.12.12-2021.12.14'},
            {text: '6. 活动期间每位用户每天总共可以为不同好友助力3次。'}
          ]
        },
      }
      break;
  }

  return adapter;
}

//把方法导出 被外界使用
module.exports = {
  brandAdapter
}
