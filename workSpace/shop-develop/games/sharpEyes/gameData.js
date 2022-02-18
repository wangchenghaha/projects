
import {splitGameImg } from '../../utils/utils'
const app = getApp()


let gamesImg=[{
                id:1,
                image: splitGameImg('kilt_blue.png','sharpEyes'),  // 大图
                icon: splitGameImg('icon_kilt_blue.png','sharpEyes'), // 小图
                defaultImg: splitGameImg('card_defluat.png?v=1','sharpEyes'), // 亮色背景图
                lightImg: splitGameImg('card_light.png','sharpEyes'), // 默认背景图
                showImg: splitGameImg('card_defluat.png','sharpEyes'), // 显示图片
                currentOri: 0,  // 0 ：背面  1 ： 正面
                animationMain: '' ,// 正面动画
                animationBack: ''// 背面动画
              },
              {
                id:2,
                image: splitGameImg('kilt_pink.png','sharpEyes'),
                icon: splitGameImg('icon_kilt_pink.png','sharpEyes'),
                defaultImg: splitGameImg('card_defluat.png?v=1','sharpEyes'),
                lightImg: splitGameImg('card_light.png','sharpEyes'),
                showImg: splitGameImg('card_defluat.png','sharpEyes'),
                currentOri: 0, 
                animationMain: '' ,// 正面动画
                animationBack: ''// 背面动画
              },
              {
                id:3,
                image: splitGameImg('polo.png','sharpEyes'),
                icon: splitGameImg('icon_polo.png','sharpEyes'),
                defaultImg: splitGameImg('card_defluat.png?v=1','sharpEyes'),
                lightImg: splitGameImg('card_light.png','sharpEyes'),
                showImg: splitGameImg('card_defluat.png','sharpEyes'),
                currentOri: 0, 
                animationMain: '' ,// 正面动画
                animationBack: ''// 背面动画
              },
              {
                id:4,
                image: splitGameImg('socks_red.png','sharpEyes'),
                icon: splitGameImg('icon_socks_red.png','sharpEyes'),
                defaultImg: splitGameImg('card_defluat.png?v=1','sharpEyes'),
                lightImg: splitGameImg('card_light.png','sharpEyes'),
                showImg: splitGameImg('card_defluat.png','sharpEyes'),
                currentOri: 0, 
                animationMain: '' ,// 正面动画
                animationBack: ''// 背面动画
              },
              {
                id:5,
                image: splitGameImg('socks_yellow.png','sharpEyes'),
                icon: splitGameImg('icon_socks_yellow.png','sharpEyes'),
                defaultImg: splitGameImg('card_defluat.png?v=1','sharpEyes'),
                lightImg: splitGameImg('card_light.png','sharpEyes'),
                showImg: splitGameImg('card_defluat.png','sharpEyes'),
                currentOri: 0, 
                animationMain: '' ,// 正面动画
                animationBack: ''// 背面动画
              },
              {
                id:6,
                image: splitGameImg('txun.png','sharpEyes'),
                icon: splitGameImg('icon_txun.png','sharpEyes'),
                defaultImg: splitGameImg('card_defluat.png?v=1','sharpEyes'),
                lightImg: splitGameImg('card_light.png','sharpEyes'),
                showImg: splitGameImg('card_defluat.png','sharpEyes'),
                currentOri: 0, 
                animationMain: '' ,// 正面动画
                animationBack: ''// 背面动画
              },
              {
                id:7,
                image: splitGameImg('underwear.png','sharpEyes'),
                icon: splitGameImg('icon_underwear.png','sharpEyes'),
                defaultImg: splitGameImg('card_defluat.png?v=1','sharpEyes'),
                lightImg: splitGameImg('card_light.png','sharpEyes'),
                showImg: splitGameImg('card_defluat.png','sharpEyes'),
                currentOri: 0, 
                animationMain: '' ,// 正面动画
                animationBack: ''// 背面动画
              },
              {
                id:8,
                image: splitGameImg('waistcoat_green.png','sharpEyes'),
                icon: splitGameImg('icon_waistcoat_green.png','sharpEyes'),
                defaultImg: splitGameImg('card_defluat.png?v=1','sharpEyes'),
                lightImg: splitGameImg('card_light.png','sharpEyes'),
                showImg: splitGameImg('card_defluat.png','sharpEyes'),
                currentOri: 0, 
                animationMain: '' ,// 正面动画
                animationBack: ''// 背面动画
              },
              {
                id:9,
                image: splitGameImg('waistcoat_yellow.png','sharpEyes'),
                icon: splitGameImg('icon_waistcoat_yellow.png','sharpEyes'),
                defaultImg: splitGameImg('card_defluat.png?v=1','sharpEyes'),
                lightImg: splitGameImg('card_light.png','sharpEyes'),
                showImg: splitGameImg('card_defluat.png','sharpEyes'),
                currentOri: 0, 
                animationMain: '' ,// 正面动画
                animationBack: ''// 背面动画
              }]    

function getPointImg(images, index){
    let pointImg = {};
    let randomNum = Math.floor(Math.random() * index + 0)
    pointImg = images[randomNum]
    return pointImg;
}        

function randomImgArr(list){
    let randomArr = list
    for(let i = 0, len = randomArr.length; i < len; i++){
        let currentRandom = parseInt(Math.random() * (len - 1));
        let current = randomArr[i];
        randomArr[i] = randomArr[currentRandom];
        randomArr[currentRandom] = current;
      }
    return randomArr;
}

function getRandomArrayElements(count) {
  let arr = gamesImg;
  var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
  while (i-- > min) {
    index = Math.floor((i + 1) * Math.random());
    temp = shuffled[index];
    shuffled[index] = shuffled[i];
    shuffled[i] = temp;
  }
  return shuffled.slice(min);
}


function randomMode(){
   let jsData = {}
   let tagIndex = 0;
   let zorjRan = Math.floor(Math.random() * 101 + 0)
    // 百分之十的概率是高难度 
    if(zorjRan >= 10 && zorjRan <= 90){
      let nums = [3, 5, 7]
      tagIndex = nums[Math.floor(Math.random() *2 + 0)]
    } else {
      tagIndex = 9
    }
   let tagList = getRandomArrayElements(tagIndex);
   let modeList = []
   for (let index = 0; index < 9; index+=tagList.length) {
      let  x = 0;
      let taglength = 9 - modeList.length > tagList.length ?  tagList.length : 9 - modeList.length;
      for (let j = x; j < taglength; j++) {
        modeList.push(JSON.parse(JSON.stringify(tagList[j])))
        if(x === j - 1){
          x = 0;
        }
      }
   }
   jsData.tagindex = tagIndex
   jsData.optionImage = getPointImg(tagList, tagIndex)
   jsData.optionList = randomImgArr(modeList)
   return jsData
}



function timeAdapter(){
  let adapter = {};
  switch(app.config.brand){
      case 'JACKJONES':
      case 'ONLY':
      case 'VEROMODA':
      case 'SELECTED':
      case 'FOL':
          adapter = {
              loading: 200,
              rotate: 1500,
              countNum: 6500,
              rotatePeiod: 2000,
          }
          break;
  }
  return adapter;
}


function goodsCodeAdapter(){
  let goodsCode = '';
  switch(app.config.brand){
      case 'JACKJONES':
        goodsCode = "221201284A06";
        break;
      case 'ONLY':
        goodsCode = "121243053J32";
        break;
      case 'VEROMODA':
        goodsCode = "3212SZ005E39";
        break;
      case 'SELECTED':
        goodsCode = "421205008B36";
        break;
      case 'FOL':
        goodsCode = "120105578A53";
        break;
  }
  return goodsCode;
}

function brandAdapter(){
  let brandName = '';
  switch(app.config.brand){
      case 'JACKJONES':
        brandName = "JACK&JONES";
        break;
      case 'ONLY':
        brandName = "ONLY";
        break;
      case 'VEROMODA':
        brandName = "VEROMODA";
        break;
      case 'SELECTED':
        brandName = "SELECTED";
        break;
      case 'FOL':
        brandName = "BESTSELLER折扣店";
        break;
  }
  return brandName;
}

export{
    getPointImg,
    randomImgArr,
    timeAdapter,
    randomMode,
    goodsCodeAdapter,
    brandAdapter
}