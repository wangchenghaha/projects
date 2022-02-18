const child_process = require('child_process');
const fs = require('fs');
const os = require('os');
const readline = require('readline');
const path = require('path')
const copyDirSync = require('./utils/fsutils.js');

const workBranch = "develop"; // 工作分支
const workDir = path.resolve(__dirname, '..'); // 项目根路径(bin目录的上一级目录)
const parentDir = path.resolve(workDir, '..'); // 项目根路径的上一级目录
const appConfigFile = './app.json'; // app配置文件
const projectConfigFile = './project.config.json'; // 微信开发工具配置文件
const brandConfigFile = './config/brand.js'; // 品牌
const gitMarkPath = path.resolve(os.homedir(), '.gitmark'); // 记录git安装路径的配置文件
let gitBin = 'git'; // git安装路径
const { ID, TabBar } = require('./config.js'); // 配置文件
const supportBrand = Object.keys(ID); // 支持的品牌

/**
 *  1.介绍
 *    小程序项目包含 N 个品牌，N 个品牌使用一份代码，由于微信开发者工具不支持多渠道多品牌构建项目
 *  此处使用 Node.js 把代码复制为 N 份。
 *
 *  2.N 个品牌共用一份代码(一个git仓库)，如何做到各个品牌的代码互不影响？
 *      有三个关键性文件  config/brand.js (I) 、 project.config.json (II) 和  app.json (III)，
 *  I 里仅包含一个品牌号字段、II 里主要用于配置目标品牌的AppID，用于小程序开发工具加载使用、III是
 *  项目的配置文件，定义了界面视图（比如：每个品牌的底部导航按钮可能都不一样 ）。
 *      试想一下由于N个品牌使用的是一套代码，那么 I 、II 、III 里肯定要不停的修改，修改会造成开发期不同的
 *  开发者的配置及其混乱，要解决这个问题，就应该避免这三个文件的变动。 目前的解决方案是，有主项目(shop)复制出N
 *  个品牌，在N个品牌项目里使用Git把 I、II和III这三个文件加入到“不提交列表里”，即使你在N个品牌项目里修
 *  改了这三个文件，也不会被提交到Git仓库中。
 *
 * 3. 我要在III里增加一个页面时无法提交Git
 *       由于第2步具有的副作用，将无法再修改 I、II、III 。解决方法是在主项目(shop)里修改  app.json ，修改
 * 完成后在根路径下输入 node bin 在输入 2 即可(注意一点要把各个品牌所有的代码都提交到远程仓库)。
 */
(function main() {

    /**
     * 检查环境变量
     */
    function checkENV() {
        try {
            // 检查环境变量里的Git
            child_process.execSync('git --version');
            return true;
        } catch (e) {
            // 检查用户是否手动指定Git
            if (fs.existsSync(gitMarkPath)) {
                gitBin = `"${fs.readFileSync(gitMarkPath)}"`;
                return true;
            } else {
                return false;
            }
        }
    }


    /**
     * 切换品牌,重置代码,增加忽略项目
     * @param {仓库目录} rep
     * @param {目标分支} brand
     */
    function switchBrand(rep, brand) {
        //切换分支重置代码
        child_process.execSync(`cd ${rep} && ${gitBin} fetch --all && ${gitBin} reset --hard origin/${workBranch} && ${gitBin} checkout ${workBranch}`);

        //小程序开发工具配置
        let ideConfigPath = path.resolve(rep, projectConfigFile);
        let ideConfig = fs.readFileSync(ideConfigPath);
        ideConfig = JSON.parse(ideConfig); //读取小程序开发工具配置文件
        let ideConfigNew = Object.assign(ideConfig, ID[brand]);
        fs.writeFileSync(ideConfigPath, JSON.stringify(ideConfigNew, null, 4)); //写入新的配置文件

        //项目运行时品牌配置
        fs.writeFileSync(path.resolve(rep, brandConfigFile), `module.exports = { brand: '${brand}' }`); //写入新的配置文件

        //项目app.json配置
        let appConfigPath = path.resolve(rep, appConfigFile);
        let appConfig = fs.readFileSync(appConfigPath);
        appConfig = JSON.parse(appConfig);
        if(brand === 'FOL'){
          appConfig.tabBar = ID[brand].tabBar
        }else{
          appConfig.tabBar.list = appConfig.tabBar.list.filter(item => {
            return TabBar[brand].includes(item.text);
          });
        }
        /*appConfig.tabBar.list.forEach(item => {
          if(item.text === '潮流资讯' && brand === 'FOL'){
            item.pagePath = 'pages/informat/informat'
          }
        })*/
        // 添加小程序插件
        appConfig.usingShopPlugin = ID[brand].usingShopPlugin
        // appConfig.navigateToMiniProgramAppIdList = [...appConfig.navigateToMiniProgramAppIdList, ...ID[brand].appIdList];
        fs.writeFileSync(appConfigPath, JSON.stringify(appConfig, null, 4)); //写入新的配置文件

        //忽略项目配置文件
        child_process.execSync(`cd ${rep} && ${gitBin} update-index --assume-unchanged config/brand.js && ${gitBin} update-index --assume-unchanged project.config.json && ${gitBin} update-index --assume-unchanged app.json`);
    }

    /**
     * 生成各个品牌项目
     */
    function createProjects() {
        console.log('[46;30m ♨  [0m', '正在生成各品牌项目，稍等片刻！')
        for (let brand of supportBrand) {
            //判断是否存在当前品牌的文件夹
            let brandDir = path.resolve(parentDir, brand);
            let isExists = fs.existsSync(brandDir);
            if (!isExists) {
                copyDirSync(workDir, brandDir); //复制出一个品牌目录
                switchBrand(brandDir, brand);  //配置
                console.log('[42;30m -> [0m', `生成<${brand}> to ${brandDir}.  OK`)
            } else {
                // console.log(`    √ ${brand} 已生成过副本!`);
            }
        }
        console.log('[42;30m √  [0m', '各品牌项目准备完毕.  OK')
        console.log('')
    }

    /**
     * 重新生成配置文件到各品牌目录
     */
    function patchProjects(b) {
        console.log('[46;30m ♨  [0m', '正在更新各品牌配置文件，稍等片刻！')
        if(supportBrand[b]){
            resetBrand(supportBrand[b]);
            return
        }
        for (let brand of supportBrand) {
            resetBrand(brand)
        }
        console.log('[42;30m √  [0m', '各品牌配置更新完毕.  OK')
    }

    function resetBrand (brand){
        let brandDir = path.resolve(parentDir, brand);
        // 暂时恢复追踪
        child_process.execSync(`cd ${brandDir} && ${gitBin} update-index --no-assume-unchanged app.json && ${gitBin} update-index --no-assume-unchanged project.config.json && ${gitBin} update-index --no-assume-unchanged config/brand.js`);
        switchBrand(brandDir, brand);
        console.log('[42;30m -> [0m', `更新 <${brand}> 配置.  OK`)
    }
    /**
     * 重置各品牌（先备份已有项目，再生成一份新的）
     */
    function resetProjects() {
        console.log('[46;30m ♨  [0m', '正在备份已有项目，稍等片刻！')
        let backupsDir = path.resolve(parentDir, "源码备份");
        try {
            fs.mkdirSync(backupsDir, { recursive: true })
        } catch (error) {
            //nothing
        }
        supportBrand.forEach(brand => fs.renameSync(path.resolve(parentDir, brand), path.resolve(backupsDir, `T${Date.now()}_${brand}`)))
        console.log('[42;30m √  [0m', '项目备份完毕.  OK')
        createProjects();
    }

    /**
     * 重置Git可执行文件目录
     */
    function resetGitMark() {
        try {
            fs.unlinkSync(gitMarkPath)
            console.log('[42;30m √  [0m', 'git.exe 路径已重置.  OK')
        } catch (error) {
            //nothing
        }
    }

    /**
     * 提示输入Git安装路径
     */
    function inputGitBinPath() {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        rl.question('请输入: ', (chunk) => {
            // 输入的Git可执行文件路径
            let gitBinPath = chunk.toString();
            let isExists = fs.existsSync(gitBinPath);
            if (isExists) {
                // 记录git可执行文件的路径
                fs.writeFileSync(gitMarkPath, gitBinPath);
                console.log('[42;30m √  [0m', 'Git环境变量配置成功.  OK')
                createProjects();
                menu();
            } else {
                console.log('[43;31m警告[40;31m 请输入一个有效的git.exe路径.[0m')
            }
            rl.close();
        });
    }

    function showBrand(){
        const brandObj = {
            '1': 'ONLY',
            '2': 'JACKJONES',
            '3': 'VEROMODA',
            '4': 'SELECTED',
            '6': 'FOL',
            '7': 'BESTSELLER'
        }
        console.log('[42;30m | _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ | [0m')
        console.log('[42;30m |  (0): 退出           | [0m')
        console.log('[42;30m |  (1): ONLY           | [0m')
        console.log('[42;30m |  (2): JACKJONES      | [0m')
        console.log('[42;30m |  (3): VEROMODA       | [0m')
        console.log('[42;30m |  (4): SELECTED       | [0m')
        console.log('[42;30m |  (6): FOL            | [0m')
        console.log('[42;30m |  (7): BESTSELLER      | [0m')
        console.log('[42;30m | _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ | [0m')
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });
        rl.question('请输入品牌: ', (chunk) => {
            chunk = Number.parseInt(chunk);
            console.log(chunk)
            if (Number.isInteger(chunk)) {
                if (chunk === 0) {
                    process.exit(0);
                } else if (brandObj[chunk]) {
                    console.log(brandObj[chunk])
                    patchProjects(brandObj[chunk]);
                }
            } else {
                console.log('[43;31m ㄨ [40;31m 请输入正确的序号,如: 0 [0m')
            }
            rl.close();
        });
    }

    /**
     * 打印一个可视化菜单
     */
    function menu() {
        console.log('[42;30m  _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ [0m')
        console.log('[42;35m |                                功能表                             | [0m')
        console.log('[42;30m |  (0): 退出脚本                                                    | [0m')
        console.log('[42;30m |  (1): 重置所有品牌项目                                              | [0m')
        console.log('[42;30m |  (2): 更新各品牌项目配置([42;31m 警告:为避免文件丢失请先提交你的代码)      | [0m')
        console.log('[42;30m |  (3): Window 系统重置git.exe目录                                    | [0m')
        console.log('[42;30m |  (4): Window 系统打印git.exe版本                                    | [0m')
        console.log('[42;30m | _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ _ | [0m')
        console.log('[42;30m                                                                          [0m')

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
            terminal: false
        });

        rl.question('请输入: ', (chunk) => {
            chunk = Number.parseInt(chunk);
            if (Number.isInteger(chunk)) {
                if (chunk === 0) {
                    process.exit(0);
                } else if (chunk === 1) {
                    resetProjects();
                } else if (chunk === 2) {
                    patchProjects();
                } else if (chunk === 3) {
                    if (os.platform() === 'win32') {
                        process.stdin.emit('end');
                        resetGitMark();
                    }else{
                        console.log(`→_→ 你的系统是: ${os.platform()}!`)
                    }
                } else if (chunk === 4) {
                    if (os.platform() === 'win32') {
                        let result = child_process.execSync(`${gitBin} --version`);
                        console.log('[42;30m √  [0m', result.toString())
                    }else{
                        console.log(`→_→ 你的系统是: ${os.platform()}!`)
                    }
                } else if(chunk === 5){
                    showBrand()
                }
            } else {
                console.log('[43;31m ㄨ [40;31m 请输入正确的序号,如: 0 [0m')
            }
            if(chunk !== 5){
                rl.close();
            }
        });
    }

    // 先检查环境变量是否支持
    if (checkENV()) {
        console.log('[42;30m √  [0m', '环境变量检查通过.  OK')
        createProjects();
        menu();

    } else {
        console.log('[43;31m警告[40;31m 终端里找不到Git，请手动指定git.exe路径: [0m', `如: C:\\Program\ Files\\Git\\bin\\git.exe (推荐Git Bash终端)`)
        inputGitBinPath()
    }
}());
