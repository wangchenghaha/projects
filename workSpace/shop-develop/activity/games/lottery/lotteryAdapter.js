const app = getApp();

function lotteryAdaper0501(){
    let adapter = {};
    switch(app.config.brand){
        case 'ONLY':
            adapter.bigBackGround = '#fef4ac'
            adapter.lotterBgColor = "#27ddb7"
            adapter.btnBgColor1 = "#27ddb7"
            adapter.btnBgColor2 = "#27ddb7"
            adapter.btnTextColor1 = '#000'
            adapter.btnTextColor2 = '#000'
            adapter.ruleColor = '#000'
            break;
        case 'JACKJONES':
            adapter.bigBackGround = '#07b2f7'
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


export{
    lotteryAdaper0501,
    lotteryAdaperBeiFu
}

