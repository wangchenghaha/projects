const app = getApp();
const brand = app.config.brand;
import { areaarr } from '../area/area'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        ischange: false,
        imgurl: '',
        list: [],
        longitude: '',
        latitude: '',
        longitudeback: '',
        latitudeback: '',
        address: '',
        tpl_id: '',
        tag: '161_156',
        area: '',
        range: [],
        multiIndex: [0, 0, 0],
        text: '省、市、区'
            // provincearr: [],
            // cityarr: [],
            // areaarr: [],
            // provinceindex : -1,
            // cityindex : -1,
            // areaindex : -1
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        if (options.tpl_id) {
            this.setData({
                tpl_id: options.tpl_id,
                tag_id: options.tag_id || ''
            })
        }
    },
    areaSet(area, arealist) {
        console.log(arealist)
        const _this = this;
        const range = [
            [],
            [],
            []
        ];
        const multiIndex = this.data.multiIndex;
        area.forEach((item) => {
            range[0].push(item.name);
        });
        area[multiIndex[0]].list.forEach((item) => {
            range[1].push(item.name);
        });
        area[multiIndex[0]].list[multiIndex[1]].list.forEach((item) => {
            range[2].push(item);
        });
        _this.setData({
            range,
        });
        let result = _this.testarea(area, arealist)
        console.log(result)
        if (result) {
            this.setData({
                multiIndex: result
            })
            this.ran(0)
            this.ran(1)
        } else {
            _this.setData({
                address: ' '
            })
        }
        console.log('this.data.range', this.data.range)
    },
    testarea(area, arealist) {
        let arr = area
        let multiIndex = []
        let flag = false
        for (let i = 0; i < arealist.length; i++) {
            let nowname = arealist[i]
            console.log('nowname' + i, nowname)
            for (let j = 0; j < arr.length; j++) {
                let newname = ''
                if (i == 2) {
                    newname = arr[j]
                } else {
                    newname = arr[j].name
                }
                if (nowname == newname) {
                    flag = true
                    if (i == 2) {
                        arr = arr[j]
                    } else {
                        arr = arr[j].list
                    }
                    multiIndex.push(j)
                    continue
                }
            }
            if (!flag) {
                return flag
            }
            flag = false
        }
        console.log('multiIndex', multiIndex)
        return multiIndex
    },
    rangeChange(e) {
        const column = e.detail.column;
        const value = e.detail.value;
        if (column === 0) {
            this.setData({
                multiIndex: [value, 0, 0],
            });
        } else if (column === 1) {
            // ;
            const multiIndex = this.data.multiIndex;
            multiIndex[1] = value;
            multiIndex[2] = 0;
            this.setData({
                multiIndex,
            });
        } else {
            const multiIndex = this.data.multiIndex;
            multiIndex[2] = value;
            this.setData({
                multiIndex,
            });
        }
        this.ran(column, value);
    },
    setRangeData(e) {
        const multiIndex = e.detail.value;
        const range = this.data.range;
        this.setData({
            ischange: true,
            multiIndex,
            text: `${range[0][multiIndex[0]]} > ${range[1][multiIndex[1]]} > ${range[2][multiIndex[2]]}`,
        });
        this.getlist(multiIndex)
    },
    ran(index, subI) {
        const range = this.data.range;
        const multiIndex = this.data.multiIndex;
        if (index === 0) {
            range[1] = [];
            range[2] = [];
            areaarr[multiIndex[0]].list.forEach((item) => {
                range[1].push(item.name);
            });
            areaarr[multiIndex[0]].list[multiIndex[1]].list.forEach((item) => {
                range[2].push(item);
            });
        } else if (index === 1) {
            range[2] = [];
            areaarr[multiIndex[0]].list[multiIndex[1]].list.forEach((item) => {
                range[2].push(item);
            });
        }
        this.setData({
            range,
        });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (this.data.tpl_id) {
            this.getlocation()
        }
    },
    seedetail(e) {
        let id = e.currentTarget.dataset.id
        let tpl_id = this.data.tpl_id
        wx.navigateTo({
            url: `/store/storedetail/storedetail?id=${id}&tpl_id=${tpl_id}`
        })
    },
    //获取地理位置
    getlocation() {
        let _this = this
        wx.getLocation({
            type: 'gcj02', // 返回可以用于wx.openLocation的经纬度
            success(res) {
                console.log('地理位置', res)
                const latitude = res.latitude
                const longitude = res.longitude
                _this.setData({
                    latitude,
                    longitude
                })
                _this.getname(latitude, longitude)
                _this.storeinfo(_this.data.tpl_id, true)
                    // wx.openLocation({
                    //   latitude,
                    //   longitude,
                    //   scale: 18
                    // })
            },
            fail() {
                _this.storeinfo(_this.data.tpl_id, false)
            }
        })
    },
    getname(latitude, longitude) {
        let _this = this
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            url: 'https://apis.map.qq.com/ws/geocoder/v1/',
            method: 'get',
            data: {
                location: `${latitude},${longitude}`,
                key: 'K6OBZ-GNVRX-Z3G4J-Z46QC-RFASO-YHB4C'
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            responseType: 'text',
            success: (res) => {
                let { data } = res
                console.log('data-res', res)
                if (data.status == 0) {
                    let province = data.result.address_component.province
                    let city = data.result.address_component.city
                    let district = data.result.address_component.district
                    let address = `${province} > ${city} > ${district}`
                    _this.setData({
                        address
                    })
                    _this.areaSet(areaarr, [province, city, district])
                }
            },
            fail: (err) => {
                console.log('mingcheng2', err)
            },
            complete: () => {
                wx.hideLoading()
            },
        })
    },
    //获取门店信息
    storeinfo(tpl_id, falg) {
        let _this = this
        let obj = {
            tpl_id
        }
        if (this.data.tag_id) {
            obj['tag_id[]'] = this.data.tag_id
        } else if (tpl_id == 96) {
            obj['tag_id[]'] = '158'
        } else if (tpl_id == 93) {
            obj['tag_id[]'] = '154'
        } else if (tpl_id == 105) {
            obj['tag_id[]'] = '175'
        } else if (tpl_id == 106) {
            obj['tag_id[]'] = '174'
        } else if (tpl_id == 77) {
            obj['tag_id[]'] = '231'
        } else if (tpl_id == 104) {
            obj['tag_id[]'] = '247'
        } else if (tpl_id == 152) {
            obj['tag_id[]'] = '340'
        } else if (tpl_id == 155) {
            obj['tag_id[]'] = '348'
        } else if (tpl_id == 151) {
            obj['tag_id[]'] = '349'
        } else if (tpl_id == 154) {
            obj['tag_id[]'] = '350'
        }
        if (falg) {
            obj.latitude = this.data.latitude
            obj.longitude = this.data.longitude
        }
        wx.showLoading({
            title: '加载中',
            mask: true
        })
        wx.request({
            url: 'https://www.woaap.com/store-lbs',
            method: 'get',
            data: obj,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            responseType: 'text',
            success: (res) => {
                let { data } = res
                if (data.errcode == 0) {
                    _this.setData({
                        imgurl: data.data.tpl.bg_url || data.data.tpl.header_image,
                        list: data.data.stores
                    })
                    if (!falg) {
                        _this.setData({
                            longitude: data.data.location.longitude,
                            latitude: data.data.location.latitude
                        })
                        _this.getname(data.data.location.latitude, data.data.location.longitude)
                    }
                } else {
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
            complete: () => {
                wx.hideLoading();
            }
        });
    },
    getlist(multiIndex) {
        let _this = this
        const range = this.data.range;
        // this.setData({
        //   ischange : true,
        //   multiIndex,
        //   text: `${range[0][multiIndex[0]]} > ${range[1][multiIndex[1]]} > ${range[2][multiIndex[2]]}`,
        // });
        let obj = {
            latitude: this.data.latitude,
            longitude: this.data.longitude,
            tpl_id: this.data.tpl_id,
            province: range[0][multiIndex[0]],
            city: range[1][multiIndex[1]],
            district: range[2][multiIndex[2]]
        }
        let tpl_id = this.data.tpl_id
        if (this.data.tag_id) {
            obj['tag_id[]'] = this.data.tag_id
        } else if (tpl_id == 96) {
            obj['tag_id[]'] = '158'
        } else if (tpl_id == 93) {
            obj['tag_id[]'] = '154'
        } else if (tpl_id == 105) {
            obj['tag_id[]'] = '175'
        } else if (tpl_id == 106) {
            obj['tag_id[]'] = '174'
        } else if (tpl_id == 77) {
            obj['tag_id[]'] = '231'
        } else if (tpl_id == 104) {
            obj['tag_id[]'] = '247'
        } else if (tpl_id == 152) {
            obj['tag_id[]'] = '340'
        } else if (tpl_id == 155) {
            obj['tag_id[]'] = '348'
        } else if (tpl_id == 151) {
            obj['tag_id[]'] = '349'
        } else if (tpl_id == 154) {
            obj['tag_id[]'] = '350'
        }
        wx.request({
            url: 'https://www.woaap.com/store-lbs',
            method: 'get',
            data: obj,
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            responseType: 'text',
            success: (res) => {
                let { data } = res
                console.log('------------>', res)
                if (data.errcode == 0) {
                    _this.setData({
                        list: data.data.stores
                    })
                } else {
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