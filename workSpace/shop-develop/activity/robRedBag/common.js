import {KEYSTORAGE} from "../../src/const";
import {objToQuery, splitImg} from "../../utils/utils";
import {KEYSTORAGE_ACTIVITY, URL_ACTIVITY} from "../service/const";
import {addActivity} from "../service/robRedBag";

// 创建红包
const createRedBag = () =>{
  const gameUser = wx.getStorageSync(KEYSTORAGE_ACTIVITY.robRedBagUserInfo);
  let sponsorId = ''
  if(gameUser && gameUser.id){
    sponsorId = gameUser.id
  }
  const param = {
    sponsorId,
    activityStatus: 0,
    createdBy: "",
    updatedBy: ""
  }
  return new Promise((resolve, reject)=>{
    wx.showLoading({
      title: '',
      mask: true
    })
    addActivity(param).then(res => {
      wx.hideLoading();
      (res && res.id) ? resolve(res.id) : reject(new Error(res.message));
    }).catch(err => reject(err.message))
  })

}

// 分享用户
const shareUser = (id) => {
  const {nickName, avatarUrl} = wx.getStorageSync(KEYSTORAGE.wxInfo);
  const param = { id,nickName, avatarUrl }
  const path = `activity/robRedBag/home/home${objToQuery(param)}` ;
  console.log(path)
  return {
    title: '绫致给大家发红包了',
    path,
    imageUrl: splitImg('share_red_bag.png', 'common'),
  }
}
module.exports = {
  shareUser,
  createRedBag
}