// 商家券组件配置项模拟数据 

export default {
  isAddCard: 1, // 是否已经领取到卡包
  couponDetail: {
    send_coupon_merchant: "1274787701",
    send_coupon_params: [
      {
        "stock_id": "1270860000000048",
        "out_request_no": "iXV60533b7c0177c",
        "coupon_code": "60533b7bf20de"
      },
      {
        "stock_id": "1270860000000047",
        "out_request_no": "wky60533b7c017d7",
        "coupon_code": "60533b7bf2131"
      },
      {
        "stock_id": "12708600000000",
        "out_request_no": "0aj60533b7c01825",
        "coupon_code": "60533b7bf2177"
      }
    ],
    sign: "22C6DE4D85416CC9D6E863A2D5226C5F8AE69D878532C2CCB0D64E43E6D0B65F",
  }, // 商家券数据
  cardList: [
    {
      "cardId": "1270860000000048",
      "code": "60533b7bf20de",
      "openCardParams": "mch_id=1274787701&sign=F85464493637BCA3CAE33AD914BE2F9EA10355CEF31B76F82C5AF0A3CBFBCA56"
    },
    {
      "cardId": "1270860000000047",
      "code": "60533b7bf2131",
      "openCardParams": "mch_id=1274787701&sign=3FFA346A47C40B4441C955DC37BE0C0DD97C7C6DB6EB91DA1B3828A41D4921D3"
    },
    {
      "cardId": "12708600000000",
      "code": "60533b7bf2177",
      "openCardParams": "mch_id=1274787701&sign=7B03EF5478E902D4E00AB3DD92686EE1F5BD454FA461ABC9EC3F323EDF8048E7"
    }
  ], // openCard数据
}