const app = getApp();

function brandAdapter(){
    let adapter = {};
    switch(app.config.brand){
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
                couponFirst: 60,
                couponScend: 80,
                couponLimit: 600,
                jumpLink: '/pages/goodsList/goodsList?list=116306',
                backgroundColor: "#f4f4f4",
                textColor: '#8e71a0'

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
                backgroundColor: "#f6eee3",
                textColor: '#eac893'
            }
            break;
        case 'FOL':
            adapter = {
                couponFirst: 249,
                couponScend: 299,
                couponLimit: 499,
                jumpLink: '/pages/goodsList/goodsList?list=116884',
                backgroundColor: "#f5f5f5",
                textColor: '#244d83'
            }
            break;
    }

    return adapter;
}

//把方法导出 被外界使用
module.exports = {
    brandAdapter
}
