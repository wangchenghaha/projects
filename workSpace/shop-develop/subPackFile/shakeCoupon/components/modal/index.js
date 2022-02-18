import Utils from '../../common/utils/index'
import API from '../../request/index'
import Conf from '../../config/index'
import { getWeChatInfo, wxLogin } from '../../../../service/user'
import regeneratorRunTime from '../../common/regenerator/index.js'
import { KEYSTORAGE } from '../../../../src/const'
const AWARDS = Conf.Awards
let _Page = null
Component({
  properties: {
    modalConfig: {
      type: Object,
      value: {}
    },
    needType: {
      type: String,
      value: ''
    }
  },
  observers: {
    'modalConfig.type': function (val) {
      if (val == 'result') {
        setTimeout(() => {
          this.setData({
            modalType: 'result',
            modalList: ['doorModal', 'result'],
            animate: true
          })
        }, 500)
        return
      }
      if (val == 'cardone') {
        setTimeout(() => {
          this.setData({
            modalType: 'cardone',
            modalList: ['doorModal', 'cardone'],
            animate: true
          })
        }, 500)
        return
      }
      this.setData({
        animate: false
      }, () => {
        setTimeout(() => {
          this.setData({
            modalType: val,
            modalList: [val],
            animate: true
          })
        }, 500)
      })
    },
    modalType: function(val) {
      if (val == 'result') {
        this.getRecord()
      }
    },
  },

  data: {
    awards: {},
    isBigPhone: Utils.isBigPhone(),
    isEndTime: 1588176000000 <= new Date().getTime(),
    animate: false,
    modalType: '',
    currentIndex: 0,
    modalList: [],
    recordList: [],
    scrollTop: 0,
    authType: '',
    animation: false,
    animateData: {},
    awardList: [],
    btnDisabled: false,
    unionid: wx.getStorageSync('unionid'),
    handlerType: '',
    hasReward: false,
    hasJoin: false
  },
  ready() {
    _Page = this
    this.setData({
      unionid: wx.getStorageSync('unionid')
    })
    console.log(this.data.modalConfig, '---------弹窗入参数据--------')
  },

  methods: {
    checkJoin() {
      this.setData({
        hasJoin: true
      })
    },
    getAuth(e){
      let { type } = e.currentTarget.dataset
      let { modalList, modalType } = this.data
      modalList.push('authorize')
      modalType = 'authorize'
      this.setData({
        handlerType: type,
        modalList, 
        modalType
      })
    },
    async getuserinfo(e) {
      let { handlerType } = _Page.data
      if (e.detail.errMsg === 'getUserInfo:ok'){
        wx.showLoading({title:'正在登录...', mask: true});
        let js_code = await wxLogin()
        const wxInfoParam = {
          brand: Conf.brand,
          js_code,
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv
        };
        let res = await getWeChatInfo(wxInfoParam)
        wx.setStorageSync(KEYSTORAGE.authed, true);
        wx.setStorageSync(KEYSTORAGE.openid, res.openId || '');
        wx.setStorageSync(KEYSTORAGE.unionid, res.unionId || '');
        wx.setStorageSync(KEYSTORAGE.wxInfo, res)
        _Page.setData({
          unionid: res.unionId
        })
        if (handlerType == 'getRewardNow') {
          _Page.setData({
            modalList: ['doorModal', 'startReward'], 
            modalType: 'startReward'
          })
        } else if (handlerType=='getOneCard') {
          _Page.setData({
            modalList: ['doorModal', 'cardone'], 
            modalType: 'cardone'
          })
        } else if (handlerType == 'getOneCard2') {
          _Page.setData({
            modalList: ['doorModal'], 
            modalType: 'doorModal'
          })
        }
        wx.hideLoading()
          
      }
    },
    getRecord() {
      API.getHist({}).then(res => {
        if (res.errcode == 0) {
          let _arr = res.data || []
          let _ol = JSON.parse(JSON.stringify(AWARDS.find(el => el.id == _arr[0].gift_id)))
          this.setData({
            recordList: res.data,
            awards: Object.assign(_ol || {},_arr[0])
          })
        }
      })
    },
    stop() {
      return false
    },
    // 查看中奖优惠券
    checkCard(e) {
      let { recordList } = this.data
      let cardList = recordList[index].card_data.map(el => {
        return {
          cardId: el.card_id,
          code: el.code
        }
      })
      wx.openCard({
        cardList
      });

    },
    setRotate(awardIndex, data) {
      var runNum = 8;//旋转8周
      var duration = 2500;//时长
      let length = 5

      // 旋转角度

      let runDeg = runNum * 360 + awardIndex * (360 / length) - (360 / length) / 2
      //创建动画
      var animationRun = wx.createAnimation({
        duration: duration,
        timingFunction: 'ease-in-out',
      })
      animationRun.rotate(runDeg).step();
      this.setData({
        animationData: animationRun.export()
      })
      setTimeout(() => {
        animationRun.rotate(runDeg).step();
        this.data.btnDisabled = false
        this.setData({
          animationData: animationRun.export(),
          modalType: 'result',
          modalList: ['doorModal', 'result']
        })
      }, duration +200)
    },
    openMyAward() {
      let { card_data } = this.data.awards
      wx.openCard({
        cardList: card_data.map(el => {
          return {
            cardId: el.card_id,
            code: el.code
          }
        })
      })
    },
    checkRecord() {
      let { modalList } = this.data
      this.setData({
        modalList: modalList.concat('result'),
        modalType: 'result'
      })
    },
    needAuth(e) {
      let { modalList } = this.data
      this.setData({
        authType: e.currentTarget.dataset.type,
        modalList: modalList.concat('authorize'),
        modalType: 'authorize'
      })
    },
    // 立即领取衣服
    getSecAward: Utils.debounce((e) => {
      let { id } = e.currentTarget.dataset
      if (_Page.data.modalConfig.getSecAward) {
        _Page.data.modalConfig.getSecAward({ id })
      }
    }, 240),
    // 立即抽奖
    getRewardNow(){
      if (_Page.data.btnDisabled) return
      _Page.data.btnDisabled = true
      this.setData({
        hasReward: true
      })

      if (wx.getStorageSync('TEMPLATE_ID').length ==2) {
        if (_Page.data.modalConfig.getRewardNow) {
          _Page.data.modalConfig.getRewardNow()
        }
        return
      }
      wx.requestSubscribeMessage({
        tmplIds: Conf.Notifys,
        success:function(res){
          
        },
        complete:function(res) {
          if (res.errMsg === 'requestSubscribeMessage:ok') {
            let _keys = []
            for (const k in res) {
              if (k !== 'errMsg' && res.hasOwnProperty(k)) {
                if (res[k] == 'accept') {
                  _keys.push(k)
                }
              }
            }
            wx.setStorageSync('TEMPLATE_ID', _keys)
          }
          if (_Page.data.modalConfig.getRewardNow) {
            _Page.data.modalConfig.getRewardNow()
          }
        }
      })
    },
    // 逐层关闭弹窗
    HideMiniModal: Utils.debounce(() => {
      let { modalList, needType } = _Page.data

      console.log('HideMiniModal',modalList, needType)
      if (needType==='first') {
        _Page.setData({
          animate: false
        })
        setTimeout(() => {
          _Page.data.modalConfig.hideAllModal()
        }, 400)
        return
      }
      modalList.splice(modalList.length - 1, 1)
      _Page.setData({
        modalType: modalList[modalList.length - 1],
        modalList
      })
    }, 240),
    // 查看规则
    checkRule: Utils.debounce(() => {
      let { modalList } = _Page.data
      modalList.push('rulebox')
      _Page.setData({
        modalType: 'rulebox',
        modalList
      })
    }, 240),
    
    // 转到抽奖页面
    getReward: Utils.debounce(() => {
      let { modalList } = _Page.data
      modalList.push('startReward')
      _Page.setData({
        modalType: 'startReward',
        modalList
      })
    }, 240),
    // 打开优惠券
    openOneCard: Utils.debounce(() => {
      if (_Page.data.modalConfig.openOneCard) {
        _Page.data.modalConfig.openOneCard()
      }
    }, 240),
    // 领取优惠券
    getOneCard(){
      if (wx.getStorageSync('TEMPLATE_ID').length ==2) {
        if (_Page.data.modalConfig.getOneCard) {
          _Page.data.modalConfig.getOneCard()
        }
        return
      }
      wx.requestSubscribeMessage({
        tmplIds: Conf.Notifys,
        success:function(res){
          
        },
        complete:function(res) {
          if (res.errMsg === 'requestSubscribeMessage:ok') {
            let _keys = []
            for (const k in res) {
              if (k !== 'errMsg' && res.hasOwnProperty(k)) {
                if (res[k] == 'accept') {
                  _keys.push(k)
                }
              }
            }
            wx.setStorageSync('TEMPLATE_ID', _keys)
          }
          if (_Page.data.modalConfig.getOneCard) {
            _Page.data.modalConfig.getOneCard()
          }
        }
      })
      
    },
    // 跳转VM小程序
    navigateMini() {
      wx.redirectTo({
        url: "/pages/welcome/welcome"
      })
    }
  },
})
