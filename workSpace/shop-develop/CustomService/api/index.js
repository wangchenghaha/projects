//var aimsUlr = "http://10.10.89.21:3000"; //目标服务器地址
var url = {
	"local":{
		"api":"https://bestseller-wechat-test.woaap.com",
		"ws":"https://bestseller-wechat-test.woaap.com"
	},
	"proxy":{
	    "api":"http://atest.woaap.com:11063",
	    "ws":"ws://bestseller-wechat.woaap.com"
    }
    

    
}
const BaseUrl = url['proxy'].api

export default {
    ETO_BRAND: {
        ONLY: 1,
        JACKJONES: 2,
        VEROMODA: 3,
        SELECTED: 4,
        JLINDEBERG: 5,
        FOL: 6,
        NAMEIT: 8,
    },
    user: {
        indexinfo: `${BaseUrl}/api/reserve_m/getActivity`,
        isMember: `${BaseUrl}/api/member/mini-is-member`,
        isOrderList: `${BaseUrl}/api/reserve_m/activity-info`,
        userInfo: `${BaseUrl}/api/reserve_m/user-info`,
        order: `${BaseUrl}/api/reserve_m/confirmreserve`,
        orderDetail: `${BaseUrl}/api/reserve_m/order-info`,
        cancelOrderDetail: `${BaseUrl}/api/reserve_m/update-order`,
        getAllShop: `${BaseUrl}/api/reserve_m/shop-list`,
        getTimeList: `${BaseUrl}/api/reserve_m/reserve-date`,
        
    },
    staff: {
        loginIn: `${BaseUrl}/api/reserve_s/store-login`,
        orderList: `${BaseUrl}/api/reserve_s/order-list`,
        orderDetail: `${BaseUrl}/api/reserve_s/order-info`,
        overOrder: `${BaseUrl}/api/reserve_s/cr-appoint`,
        cancelOrder: `${BaseUrl}/api/reserve_s/update-status`
    }
}