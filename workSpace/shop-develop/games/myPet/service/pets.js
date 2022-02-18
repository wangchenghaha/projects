import { request } from '../../../utils/request.js'
import { URL, KEYSTORAGE } from '../../../src/const.js'

// 查询用户积分信息
function sign(_userid) {
    return new Promise(((resolve, reject) => {
      request({
        url: URL.PETSIGN,
        data: {
            userid: _userid
        }
      }).then(res => {
        res.code === 0 ? resolve(res.data) : reject(res.msg);
      }).catch(err=>{
        reject(new Error(err.msg))
      })
    }))
  }

    // 修改爱心值及饲料
    function editFeedHeart(_data) {
        return new Promise(((resolve, reject) => {
        request({
            url: URL.EDITFEEDHEART,
            data: _data
        }).then(res => {
            res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
            reject(new Error(err.msg))
        })
        }))
    }

    // 获取奖品列表
    function getCouponList() {
      return new Promise(((resolve, reject) => {
        request({
          url: URL.PETLISTCOUPON,
        }).then(res => {
          res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
          reject(new Error(err.msg))
        })
      }))
    }

    // 查询兑奖记录
    function couponRecords(_userid) {
      return new Promise(((resolve, reject) => {
        request({
          url: URL.PETCOUPONRECORDS,
          data: {
              userid: _userid
          }
        }).then(res => {
          res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
          reject(new Error(err.msg))
        })
      }))
    }

    // 获取好友助力列表
    function helpForIndex(_userid) {
      return new Promise(((resolve, reject) => {
        request({
          url: URL.PETLISTHELPFORINDEX,
          data: {
              userid: _userid
          }
        }).then(res => {
          res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
          reject(new Error(err.msg))
        })
      }))
    }

    function addHelp(_data){
      return new Promise(((resolve, reject) => {
        request({
          url: URL.PETADDHELP,
          data: _data,
          method: 'POST'
        }).then(res => {
          res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
          reject(new Error(err.msg))
        })
      }))
    }

    // 开宝箱
    function openBox(_userid, _phone){
      return new Promise(((resolve, reject) => {
        request({
          url: URL.PETOPENBOX,
          data: {
              userid: _userid,
              phone: _phone
          }
        }).then(res => {
          res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
          reject(new Error(err.msg))
        })
      }))
    }

    function getCoupon(_data){
      return new Promise(((resolve, reject) => {
        request({
          url: URL.PETGETCOUPON,
          data: _data,
          method: 'POST'
        }).then(res => {
          res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
          reject(new Error(err.msg))
        })
      }))
    }
    // 宠物 - 获取任务列表
    function getTaskList(){
      wx.showLoading({
        title: '加载中……',
        mask: true
      });
      return new Promise(((resolve, reject) => {
        request({
          url: URL.PETTASKLIST
        }).then(res => {
          wx.hideLoading();
          res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
          wx.hideLoading();
          reject(new Error(err.msg))
        })
      }))
    }
    // 完成任务
    function finishTask(taskid,userid){
      wx.showLoading({
        title: '加载中……',
        mask: true
      });
      return new Promise(((resolve, reject) => {
        request({
          url: URL.PETFINISHTASK,
          data: {
            taskid,
            userid
          }
        }).then(res => {
          wx.hideLoading();
          res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
          wx.hideLoading();
          reject(new Error(err.msg))
        })
      }))
    }
    // 获取用户完成任务列表
    function userFinishTaskList(userid){
      wx.showLoading({
        title: '加载中……',
        mask: true
      });
      return new Promise(((resolve, reject) => {
        request({
          url: URL.PETGETUSERFINISHITASKLIST,
          data: {
            userid
          }
        }).then(res => {
          wx.hideLoading();
          res.code === 0 ? resolve(res.data) : reject(res.msg);
        }).catch(err=>{
          wx.hideLoading();
          reject(new Error(err.msg))
        })
      }))
    }

  export {
    sign,
    editFeedHeart,
    getCouponList,
    couponRecords,
    helpForIndex,
    addHelp,
    openBox,
    getCoupon,
    getTaskList,
    finishTask,
    userFinishTaskList
}
