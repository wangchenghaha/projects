import { getExOrderDetail } from '../../service/order';
const URL_AUDITING = `https://cdn.bestseller.com.cn/assets/common/pub/image/icon_auditing.png`;
const URL_AUDIT_FAIL = `https://cdn.bestseller.com.cn/assets/common/pub/image/icon_audit_fail.png`;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reasonStr: '暂无',
    flagSuccess: false,
    imgUrl: URL_AUDITING,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let exchangeCode = options.exchangeCode;
    console.log(">>>>>>>>>>>>> onLoad   exchangeCode = " + exchangeCode);
    let queryParam = {
      brandCode: getApp().config.brand,
      exchangeCode: exchangeCode,
    }

    //==========================  正式代码 start =======================
    getExOrderDetail(queryParam)
      .then(exOrderBean => {
        this.setData({
          flagSuccess: true,
          exOrderBean: exOrderBean,
          imgUrl: exOrderBean.status == 'CHECK_FAIL' ? URL_AUDIT_FAIL : URL_AUDITING,
        });
        let reasonRaw = exOrderBean.exchangeReason;
        console.log(">>>>>>>>>>>>>>>>  reasonRaw =");
        console.log(reasonRaw);
        let reasonBean;
        let reasonStr = "暂无";
        try {
          reasonBean = JSON.parse(reasonRaw);
        } catch (e) {
          console.log(e);
        }
        if (reasonBean) {
          console.log(reasonBean);
          let a = reasonBean.A;
          let b = reasonBean.B;
          let c = reasonBean.C;
          let d = reasonBean.D;
          let e = reasonBean.E;
          reasonStr = (a ? a + "/" : "") + (b ? b + "/" : "") + (c ? c + "/" : "") + (d ? d + "/" : "") + (e ? e : "");
          if (reasonStr.lastIndexOf("/") == reasonStr.length - 1) {
            reasonStr = reasonStr.substring(0, reasonStr.length - 1);
          }
          this.setData({
            reasonStr: reasonStr,
          });
        }
      })
      .catch(e => {
        wx.showToast({
          title: `${e.message}`,
        })
      });
    //==========================  正式代码 end =======================



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

})