
const appId  = wx.getAccountInfoSync().miniProgram.appId
const brand = 'only'
const CDN = `https://tc.woaap.com/lingzhi/${brand}_shop/`

let Conf = Conf = {
    ENV: 'PROD',
    appId,
    config_name: 'miniapp_rol_redpacket_6',
    api: "https://bestseller-wechat.woaap.com",
    brand: 6,
    cdnUrl: `https://tc.woaap.com/lingzhi/${brand}_shop`,

    Awards: [{
        id: 2,
        name: '10元优惠券',
        icon: CDN+'reward4.png'
    },{
        id: 3,
        name: '波浪印花提包',
        icon: CDN+'reward2.png'
    },{
        id: 5,
        name: '防紫外线眼镜',
        icon: CDN+'reward3.png'
    },{
        id: 1,
        name: '5元优惠券',
        icon: CDN+'reward5.png'
    },{
        id: 4,
        name: '斜挎单肩包',
        icon: CDN+'reward1.png'
    }],
    Notifys: [
        'H0O4KHZihUjnegEKMMxhVD5fR8TcjVFyO0aZ8GDUUBU', // 解锁抽奖资格服务通知提醒
        'SXMS86I6f7JJ5PRd95gijBE09zCEm-Lw42yxVqQ-vXg', // 抽奖结果服务通知： 
    ]
}
  
export default Conf