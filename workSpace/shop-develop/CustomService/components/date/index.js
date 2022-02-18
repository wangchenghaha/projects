// var lastMonth = [];
// let timelist = []
// let daylong = 86400000
// const num = num => {
//   num = parseInt(num)
//   if (num>9) {
//     return num
//   } else {
//     return '0'+num
//   }
// }
// const formatTime = (time) => {
//   let date = new Date(time)
//   var year = date.getFullYear()
//   var month = date.getMonth() + 1
//   var day = date.getDate()
//   return {
//     value: year+'-'+num(month) + '-' + num(day),
//     date: month + '月' + day +'日',
//     year: year+'年',
//     select: false
//   }
// }
// for(var i = 1;i<15;i++){
//   let time = new Date().getTime() + (i) * daylong
//   let date = formatTime(time)
//   lastMonth.push(date)
// }
// for (let i = 0;i<6;i++) {
//   timelist.push({
//     value: `${14+i}:00~${14+i+1}:00`,
//     select: false
//   })
// }
Component({
  properties: {
    showDateBol: {
      type: Boolean,
      value: false
    },
    showtype: {
      type: String,
      value: ''
    },
    ist: {
      type: Number,
      value: 1
    },
    dl: {
      type: Array,
      value: [],
      observer: function(nval, oval) {
        let arr = []
        if (nval) {
          arr = nval.map(el => {
            el.select = false
            el.value = el.date
            return el
          })
          this.setData({
            datelist: arr
          })
        }
      }
    },
    tl: {
      type: Array,
      value: [],
      observer: function(nval, oval) {
        let arr = []
        if (nval) {
          nval.forEach(el => {
            arr.push({
              value: el,
              select: false
            })
          })
          this.setData({
            timelist: arr
          })
        }
      }
    },
    dO: {
      type: Object,
      value: {},
      observer: function(nval, oval) {
        if (nval) {
          setTimeout(()=> {
            let obj = this.data.datelist
            let _i = obj.findIndex(el => el.value === nval.value)
            if (_i > -1) {
              obj[_i].select = true
              this.setData({
                datelist: obj
              })
            }
          }, 100)
        }
      }
    },
    tO: {
      type: Object,
      value: {},
      observer: function(nval, oval) {
        if (nval) {
          setTimeout(()=> {
            let obj = this.data.timelist
            let _i = obj.findIndex(el => el.value === nval.value)
            if (_i > -1) {
              obj[_i].select = true
              this.setData({
                timelist: obj
              })
            }
          }, 100)
        }
      }
    }
  },

  data: {
    datelist: [],
    selectItem: {},
    selecttime: {},
    timelist: []
  },

  methods: {
    // 选择日期
    backtodate() {
      this.triggerEvent('changeshowtype','date')
    },  
    hidemodal() {
      this.triggerEvent('hidedatemodal')
    },
    // 选择时间
    selecttime(e) {
      let { index } = e.currentTarget.dataset
      let {timelist,selecttime} = this.data
      index = parseInt(index)
      timelist.map(el => {
        el.select = false
        return el
      })
      timelist[index].select = !timelist[index].select
      if (timelist[index].select) {
        selecttime = timelist[index]
      } else {
        selecttime = {}
      }
      this.setData({
        timelist,
        selecttime
      })
    },
    stop() {
      return false
    },
    selectDate(e) {
      let { index } = e.currentTarget.dataset
      let {datelist,selectItem} = this.data
      index = parseInt(index)
      datelist.map(el => {
        el.select = false
        return el
      })
      if(datelist[index].is_reserve == 0) return
      datelist[index].select = !datelist[index].select
      if (datelist[index].select) {
        selectItem = datelist[index]
      } else {
        selectItem = {}
      }
      this.setData({
        datelist,
        selectItem
      })
    },
    submitForm() {
      let { selectItem, selecttime, dO, tO,showtype } = this.data
      if (showtype ==='date') {
        if (!selectItem.date && !dO.value) {
          wx.showToast({
            title: '请选择日期',
            icon: 'none'
          })
          return
        }
        if (this.data.ist == 0) {
          this.triggerEvent('chooseDate', {
            dateobj: selectItem.value ? selectItem : dO,
            timeobj: selecttime.value ? selecttime : tO
          })
          return
        }
        this.triggerEvent('changeshowtype','time')
        return
      }
      if (!selecttime.value && !tO.value) {
        wx.showToast({
          title: '请选择时间',
          icon: 'none'
        })
        return
      }

      this.triggerEvent('chooseDate', {
        dateobj: selectItem.value ? selectItem : dO,
        timeobj: selecttime.value ? selecttime : tO
      })
    }
  }
})
