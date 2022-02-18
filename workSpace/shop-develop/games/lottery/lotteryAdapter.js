const app = getApp();

function lotteryAdaper0501(){
    let adapter = {};
    switch(app.config.brand){
        case 'ONLY':
            adapter.bigBackGround = '#2ca6f1'
            adapter.lotterBgColor = "#ffef38"
            adapter.btnBgColor1 = "#ffef38"
            adapter.btnBgColor2 = "#ffef38"
            adapter.btnTextColor1 = '#000'
            adapter.btnTextColor2 = '#000'
            adapter.ruleColor = '#fff'
            break;
        case 'JACKJONES':
            adapter.bigBackGround = '#06aef7'
            adapter.lotterBgColor = "#038bd5"
            adapter.btnBgColor1 = "#fff"
            adapter.btnBgColor2 = "#000"
            adapter.btnTextColor1 = '#000'
            adapter.btnTextColor2 = '#fff'
            adapter.ruleColor = '#000'
            break;
    }

    return adapter;
}



function lotteryAdaperBeiFu(){
    let adapter = {};
    switch(app.config.brand){
        case 'ONLY':
            adapter.bigBackGround= '#76c0e7'
            adapter.brand = 'ONLY'
            break;
        case 'JACKJONES':
            adapter.bigBackGround= '#bbcad1'
            adapter.brand = 'JACK&JONES'
            break;
        case 'SELECTED':
            adapter.bigBackGround= '#000'
            adapter.brand = 'SELECTED'
            break;
        case 'VEROMODA':
            adapter.bigBackGround= '#000'
            adapter.brand = 'VEROMODA'
            break;
    }

    return adapter;
}

function lotteryAdaperMay(){
    let adapter = {};
    switch(app.config.brand){
        case 'ONLY':
            adapter.bigBackGround = '#2ca6f1'
            adapter.lotterBgColor = "#ffef38"
            adapter.btnBgColor1 = "#ffef38"
            adapter.btnBgColor2 = "#ffef38"
            adapter.btnTextColor1 = '#000'
            adapter.btnTextColor2 = '#000'
            adapter.ruleColor = '#fff'
            break;
        case 'JACKJONES':
            adapter.bigBackGround= '#c0c2b7'
            adapter.lotterBgColor = "#dfae84"
            adapter.ruleColor = '#000'
            adapter.brand = 'JACK&JONES'
            break;
        case 'SELECTED':
            adapter.bigBackGround= '#567152'
            adapter.lotterBgColor = "#dfae84"
            adapter.ruleColor = '#000'
            adapter.brand = 'SELECTED'
            break;
        case 'VEROMODA':
            adapter.bigBackGround= '#c1b29f'
            adapter.lotterBgColor = "#dfae84"
            adapter.ruleColor = '#000'
            adapter.brand = 'VEROMODA'
            break;
    }

    return adapter;
}



export{
    lotteryAdaper0501,
    lotteryAdaperBeiFu,
    lotteryAdaperMay
}

