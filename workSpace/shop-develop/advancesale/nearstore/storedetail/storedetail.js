Page({

    /**
     * 页面的初始数据
     */
    data: {
      storeinfo : {},
      longitude : '',
      latitude : '',
      markers : [],
      name : '',
      address : ''
    },
  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if(options.id && options.tpl_id) {
        this.storeinfo(options.id,options.tpl_id)
      }
    },
  
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      
    },
    gomap() {
      let latitude = this.data.latitude
      let longitude = this.data.longitude
      let name = this.data.name
      let address = this.data.address
      console.log(name)
      wx.openLocation({
        latitude,
        longitude,
        scale: 18,
        name,
        address
      })
    },
    //获取门店信息
    storeinfo(id,tpl_id) {
      let _this= this
      wx.request({
        url: 'https://www.woaap.com/store-lbs',
        method: 'get',
        data: {
            tpl_id,
            id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        responseType: 'text',
        success: (res) => {
          console.log(res)
          let {data} = res
          if(data.errcode == 0) {
            let markers = [
              {
                id: 0,
                latitude: data.data.stores[0].latitude,
                longitude: data.data.stores[0].longitude
              }
            ]
            _this.setData({
              longitude : data.data.stores[0].longitude,
              latitude : data.data.stores[0].latitude,
              name : data.data.stores[0].branch_name,
              address : data.data.stores[0].address,
              storeinfo : data.data.stores[0],
              markers : markers
            })
          }else{
            wx.showModal({
              title: '提示',
              content: data.errmsg,
              showCancel: false
            })
          }
        },
        fail: (err) => {
          console.log(err)
        },
      });
    }
  })