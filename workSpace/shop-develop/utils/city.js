
//省份----------------------------------------------------------------------------------------------
var provinceArr = [{
  ProID: 0,
  name: "--省或市--",
  ProSort: 0,
  ProRemark: "--省或市--"
},
{
  ProID: "11",
  name: "北京市",
  ProSort: "0",
  ProRemark: ""
},
{
  ProID: "12",
  name: "天津市",
  ProSort: "1",
  ProRemark: ""
},
{
  ProID: "13",
  name: "河北省",
  ProSort: "2",
  ProRemark: ""
},
{
  ProID: "14",
  name: "山西省",
  ProSort: "3",
  ProRemark: ""
},
{
  ProID: "15",
  name: "内蒙古自治区",
  ProSort: "4",
  ProRemark: ""
},
{
  ProID: "21",
  name: "辽宁省",
  ProSort: "5",
  ProRemark: ""
},
{
  ProID: "22",
  name: "吉林省",
  ProSort: "6",
  ProRemark: ""
},
{
  ProID: "23",
  name: "黑龙江省",
  ProSort: "7",
  ProRemark: ""
},
{
  ProID: "31",
  name: "上海市",
  ProSort: "8",
  ProRemark: ""
},
{
  ProID: "32",
  name: "江苏省",
  ProSort: "9",
  ProRemark: ""
},
{
  ProID: "33",
  name: "浙江省",
  ProSort: "10",
  ProRemark: ""
},
{
  ProID: "34",
  name: "安徽省",
  ProSort: "11",
  ProRemark: ""
},
{
  ProID: "35",
  name: "福建省",
  ProSort: "12",
  ProRemark: ""
},
{
  ProID: "36",
  name: "江西省",
  ProSort: "13",
  ProRemark: ""
},
{
  ProID: "37",
  name: "山东省",
  ProSort: "14",
  ProRemark: ""
},
{
  ProID: "41",
  name: "河南省",
  ProSort: "15",
  ProRemark: ""
},
{
  ProID: "42",
  name: "湖北省",
  ProSort: "16",
  ProRemark: ""
},
{
  ProID: "43",
  name: "湖南省",
  ProSort: "17",
  ProRemark: ""
},
{
  ProID: "44",
  name: "广东省",
  ProSort: "18",
  ProRemark: ""
},
{
  ProID: "45",
  name: "广西壮族自治区",
  ProSort: "19",
  ProRemark: ""
},
{
  ProID: "46",
  name: "海南省",
  ProSort: "20",
  ProRemark: ""
},
{
  ProID: "50",
  name: "重庆市",
  ProSort: "21",
  ProRemark: ""
},
{
  ProID: "51",
  name: "四川省",
  ProSort: "22",
  ProRemark: ""
},
{
  ProID: "52",
  name: "贵州省",
  ProSort: "23",
  ProRemark: ""
},
{
  ProID: "53",
  name: "云南省",
  ProSort: "24",
  ProRemark: ""
},
{
  ProID: "54",
  name: "西藏自治区",
  ProSort: "25",
  ProRemark: ""
},
{
  ProID: "61",
  name: "陕西省",
  ProSort: "26",
  ProRemark: ""
},
{
  ProID: "62",
  name: "甘肃省",
  ProSort: "27",
  ProRemark: ""
},
{
  ProID: "63",
  name: "青海省",
  ProSort: "28",
  ProRemark: ""
},
{
  ProID: "64",
  name: "宁夏回族自治区",
  ProSort: "29",
  ProRemark: ""
},
{
  ProID: "65",
  name: "新疆维吾尔自治区",
  ProSort: "30",
  ProRemark: ""
}];


//城市----------------------------------------------------------------------------------------------
var cityArr = [{
  CityID: 0,
  name: "--城市--",
  ProID: 0,
  CitySort: 0
},
{
  CityID: "1101",
  name: "北京市",
  ProID: "11",
  CitySort: "0"
},
{
  CityID: "1201",
  name: "天津市",
  ProID: "12",
  CitySort: "1"
},
{
  CityID: "1301",
  name: "石家庄市",
  ProID: "13",
  CitySort: "2"
},
{
  CityID: "1302",
  name: "唐山市",
  ProID: "13",
  CitySort: "3"
},
{
  CityID: "1303",
  name: "秦皇岛市",
  ProID: "13",
  CitySort: "4"
},
{
  CityID: "1304",
  name: "邯郸市",
  ProID: "13",
  CitySort: "5"
},
{
  CityID: "1305",
  name: "邢台市",
  ProID: "13",
  CitySort: "6"
},
{
  CityID: "1306",
  name: "保定市",
  ProID: "13",
  CitySort: "7"
},
{
  CityID: "1307",
  name: "张家口市",
  ProID: "13",
  CitySort: "8"
},
{
  CityID: "1308",
  name: "承德市",
  ProID: "13",
  CitySort: "9"
},
{
  CityID: "1309",
  name: "沧州市",
  ProID: "13",
  CitySort: "10"
},
{
  CityID: "1310",
  name: "廊坊市",
  ProID: "13",
  CitySort: "11"
},
{
  CityID: "1311",
  name: "衡水市",
  ProID: "13",
  CitySort: "12"
},
{
  CityID: "1401",
  name: "太原市",
  ProID: "14",
  CitySort: "13"
},
{
  CityID: "1402",
  name: "大同市",
  ProID: "14",
  CitySort: "14"
},
{
  CityID: "1403",
  name: "阳泉市",
  ProID: "14",
  CitySort: "15"
},
{
  CityID: "1404",
  name: "长治市",
  ProID: "14",
  CitySort: "16"
},
{
  CityID: "1405",
  name: "晋城市",
  ProID: "14",
  CitySort: "17"
},
{
  CityID: "1406",
  name: "朔州市",
  ProID: "14",
  CitySort: "18"
},
{
  CityID: "1407",
  name: "晋中市",
  ProID: "14",
  CitySort: "19"
},
{
  CityID: "1408",
  name: "运城市",
  ProID: "14",
  CitySort: "20"
},
{
  CityID: "1409",
  name: "忻州市",
  ProID: "14",
  CitySort: "21"
},
{
  CityID: "1410",
  name: "临汾市",
  ProID: "14",
  CitySort: "22"
},
{
  CityID: "1411",
  name: "吕梁市",
  ProID: "14",
  CitySort: "23"
},
{
  CityID: "1501",
  name: "呼和浩特市",
  ProID: "15",
  CitySort: "24"
},
{
  CityID: "1502",
  name: "包头市",
  ProID: "15",
  CitySort: "25"
},
{
  CityID: "1503",
  name: "乌海市",
  ProID: "15",
  CitySort: "26"
},
{
  CityID: "1504",
  name: "赤峰市",
  ProID: "15",
  CitySort: "27"
},
{
  CityID: "1505",
  name: "通辽市",
  ProID: "15",
  CitySort: "28"
},
{
  CityID: "1506",
  name: "鄂尔多斯市",
  ProID: "15",
  CitySort: "29"
},
{
  CityID: "1507",
  name: "呼伦贝尔市",
  ProID: "15",
  CitySort: "30"
},
{
  CityID: "1508",
  name: "巴彦淖尔市",
  ProID: "15",
  CitySort: "31"
},
{
  CityID: "1509",
  name: "乌兰察布市",
  ProID: "15",
  CitySort: "32"
},
{
  CityID: "1522",
  name: "兴安盟",
  ProID: "15",
  CitySort: "33"
},
{
  CityID: "1525",
  name: "锡林郭勒盟",
  ProID: "15",
  CitySort: "34"
},
{
  CityID: "1529",
  name: "阿拉善盟",
  ProID: "15",
  CitySort: "35"
},
{
  CityID: "2101",
  name: "沈阳市",
  ProID: "21",
  CitySort: "36"
},
{
  CityID: "2102",
  name: "大连市",
  ProID: "21",
  CitySort: "37"
},
{
  CityID: "2103",
  name: "鞍山市",
  ProID: "21",
  CitySort: "38"
},
{
  CityID: "2104",
  name: "抚顺市",
  ProID: "21",
  CitySort: "39"
},
{
  CityID: "2105",
  name: "本溪市",
  ProID: "21",
  CitySort: "40"
},
{
  CityID: "2106",
  name: "丹东市",
  ProID: "21",
  CitySort: "41"
},
{
  CityID: "2107",
  name: "锦州市",
  ProID: "21",
  CitySort: "42"
},
{
  CityID: "2108",
  name: "营口市",
  ProID: "21",
  CitySort: "43"
},
{
  CityID: "2109",
  name: "阜新市",
  ProID: "21",
  CitySort: "44"
},
{
  CityID: "2110",
  name: "辽阳市",
  ProID: "21",
  CitySort: "45"
},
{
  CityID: "2111",
  name: "盘锦市",
  ProID: "21",
  CitySort: "46"
},
{
  CityID: "2112",
  name: "铁岭市",
  ProID: "21",
  CitySort: "47"
},
{
  CityID: "2113",
  name: "朝阳市",
  ProID: "21",
  CitySort: "48"
},
{
  CityID: "2114",
  name: "葫芦岛市",
  ProID: "21",
  CitySort: "49"
},
{
  CityID: "2201",
  name: "长春市",
  ProID: "22",
  CitySort: "50"
},
{
  CityID: "2202",
  name: "吉林市",
  ProID: "22",
  CitySort: "51"
},
{
  CityID: "2203",
  name: "四平市",
  ProID: "22",
  CitySort: "52"
},
{
  CityID: "2204",
  name: "辽源市",
  ProID: "22",
  CitySort: "53"
},
{
  CityID: "2205",
  name: "通化市",
  ProID: "22",
  CitySort: "54"
},
{
  CityID: "2206",
  name: "白山市",
  ProID: "22",
  CitySort: "55"
},
{
  CityID: "2207",
  name: "松原市",
  ProID: "22",
  CitySort: "56"
},
{
  CityID: "2208",
  name: "白城市",
  ProID: "22",
  CitySort: "57"
},
{
  CityID: "2224",
  name: "延边朝鲜族自治州",
  ProID: "22",
  CitySort: "58"
},
{
  CityID: "2301",
  name: "哈尔滨市",
  ProID: "23",
  CitySort: "59"
},
{
  CityID: "2302",
  name: "齐齐哈尔市",
  ProID: "23",
  CitySort: "60"
},
{
  CityID: "2303",
  name: "鸡西市",
  ProID: "23",
  CitySort: "61"
},
{
  CityID: "2304",
  name: "鹤岗市",
  ProID: "23",
  CitySort: "62"
},
{
  CityID: "2305",
  name: "双鸭山市",
  ProID: "23",
  CitySort: "63"
},
{
  CityID: "2306",
  name: "大庆市",
  ProID: "23",
  CitySort: "64"
},
{
  CityID: "2307",
  name: "伊春市",
  ProID: "23",
  CitySort: "65"
},
{
  CityID: "2308",
  name: "佳木斯市",
  ProID: "23",
  CitySort: "66"
},
{
  CityID: "2309",
  name: "七台河市",
  ProID: "23",
  CitySort: "67"
},
{
  CityID: "2310",
  name: "牡丹江市",
  ProID: "23",
  CitySort: "68"
},
{
  CityID: "2311",
  name: "黑河市",
  ProID: "23",
  CitySort: "69"
},
{
  CityID: "2312",
  name: "绥化市",
  ProID: "23",
  CitySort: "70"
},
{
  CityID: "2327",
  name: "大兴安岭地区",
  ProID: "23",
  CitySort: "71"
},
{
  CityID: "3101",
  name: "上海市",
  ProID: "31",
  CitySort: "72"
},
{
  CityID: "3201",
  name: "南京市",
  ProID: "32",
  CitySort: "73"
},
{
  CityID: "3202",
  name: "无锡市",
  ProID: "32",
  CitySort: "74"
},
{
  CityID: "3203",
  name: "徐州市",
  ProID: "32",
  CitySort: "75"
},
{
  CityID: "3204",
  name: "常州市",
  ProID: "32",
  CitySort: "76"
},
{
  CityID: "3205",
  name: "苏州市",
  ProID: "32",
  CitySort: "77"
},
{
  CityID: "3206",
  name: "南通市",
  ProID: "32",
  CitySort: "78"
},
{
  CityID: "3207",
  name: "连云港市",
  ProID: "32",
  CitySort: "79"
},
{
  CityID: "3208",
  name: "淮安市",
  ProID: "32",
  CitySort: "80"
},
{
  CityID: "3209",
  name: "盐城市",
  ProID: "32",
  CitySort: "81"
},
{
  CityID: "3210",
  name: "扬州市",
  ProID: "32",
  CitySort: "82"
},
{
  CityID: "3211",
  name: "镇江市",
  ProID: "32",
  CitySort: "83"
},
{
  CityID: "3212",
  name: "泰州市",
  ProID: "32",
  CitySort: "84"
},
{
  CityID: "3213",
  name: "宿迁市",
  ProID: "32",
  CitySort: "85"
},
{
  CityID: "3301",
  name: "杭州市",
  ProID: "33",
  CitySort: "86"
},
{
  CityID: "3302",
  name: "宁波市",
  ProID: "33",
  CitySort: "87"
},
{
  CityID: "3303",
  name: "温州市",
  ProID: "33",
  CitySort: "88"
},
{
  CityID: "3304",
  name: "嘉兴市",
  ProID: "33",
  CitySort: "89"
},
{
  CityID: "3305",
  name: "湖州市",
  ProID: "33",
  CitySort: "90"
},
{
  CityID: "3306",
  name: "绍兴市",
  ProID: "33",
  CitySort: "91"
},
{
  CityID: "3307",
  name: "金华市",
  ProID: "33",
  CitySort: "92"
},
{
  CityID: "3308",
  name: "衢州市",
  ProID: "33",
  CitySort: "93"
},
{
  CityID: "3309",
  name: "舟山市",
  ProID: "33",
  CitySort: "94"
},
{
  CityID: "3310",
  name: "台州市",
  ProID: "33",
  CitySort: "95"
},
{
  CityID: "3311",
  name: "丽水市",
  ProID: "33",
  CitySort: "96"
},
{
  CityID: "3401",
  name: "合肥市",
  ProID: "34",
  CitySort: "97"
},
{
  CityID: "3402",
  name: "芜湖市",
  ProID: "34",
  CitySort: "98"
},
{
  CityID: "3403",
  name: "蚌埠市",
  ProID: "34",
  CitySort: "99"
},
{
  CityID: "3404",
  name: "淮南市",
  ProID: "34",
  CitySort: "100"
},
{
  CityID: "3405",
  name: "马鞍山市",
  ProID: "34",
  CitySort: "101"
},
{
  CityID: "3406",
  name: "淮北市",
  ProID: "34",
  CitySort: "102"
},
{
  CityID: "3407",
  name: "铜陵市",
  ProID: "34",
  CitySort: "103"
},
{
  CityID: "3408",
  name: "安庆市",
  ProID: "34",
  CitySort: "104"
},
{
  CityID: "3410",
  name: "黄山市",
  ProID: "34",
  CitySort: "105"
},
{
  CityID: "3411",
  name: "滁州市",
  ProID: "34",
  CitySort: "106"
},
{
  CityID: "3412",
  name: "阜阳市",
  ProID: "34",
  CitySort: "107"
},
{
  CityID: "3413",
  name: "宿州市",
  ProID: "34",
  CitySort: "108"
},
{
  CityID: "3414",
  name: "巢湖市",
  ProID: "34",
  CitySort: "109"
},
{
  CityID: "3415",
  name: "六安市",
  ProID: "34",
  CitySort: "110"
},
{
  CityID: "3416",
  name: "亳州市",
  ProID: "34",
  CitySort: "111"
},
{
  CityID: "3417",
  name: "池州市",
  ProID: "34",
  CitySort: "112"
},
{
  CityID: "3418",
  name: "宣城市",
  ProID: "34",
  CitySort: "113"
},
{
  CityID: "3501",
  name: "福州市",
  ProID: "35",
  CitySort: "114"
},
{
  CityID: "3502",
  name: "厦门市",
  ProID: "35",
  CitySort: "115"
},
{
  CityID: "3503",
  name: "莆田市",
  ProID: "35",
  CitySort: "116"
},
{
  CityID: "3504",
  name: "三明市",
  ProID: "35",
  CitySort: "117"
},
{
  CityID: "3505",
  name: "泉州市",
  ProID: "35",
  CitySort: "118"
},
{
  CityID: "3506",
  name: "漳州市",
  ProID: "35",
  CitySort: "119"
},
{
  CityID: "3507",
  name: "南平市",
  ProID: "35",
  CitySort: "120"
},
{
  CityID: "3508",
  name: "龙岩市",
  ProID: "35",
  CitySort: "121"
},
{
  CityID: "3509",
  name: "宁德市",
  ProID: "35",
  CitySort: "122"
},
{
  CityID: "3601",
  name: "南昌市",
  ProID: "36",
  CitySort: "123"
},
{
  CityID: "3602",
  name: "景德镇市",
  ProID: "36",
  CitySort: "124"
},
{
  CityID: "3603",
  name: "萍乡市",
  ProID: "36",
  CitySort: "125"
},
{
  CityID: "3604",
  name: "九江市",
  ProID: "36",
  CitySort: "126"
},
{
  CityID: "3605",
  name: "新余市",
  ProID: "36",
  CitySort: "127"
},
{
  CityID: "3606",
  name: "鹰潭市",
  ProID: "36",
  CitySort: "128"
},
{
  CityID: "3607",
  name: "赣州市",
  ProID: "36",
  CitySort: "129"
},
{
  CityID: "3608",
  name: "吉安市",
  ProID: "36",
  CitySort: "130"
},
{
  CityID: "3609",
  name: "宜春市",
  ProID: "36",
  CitySort: "131"
},
{
  CityID: "3610",
  name: "抚州市",
  ProID: "36",
  CitySort: "132"
},
{
  CityID: "3611",
  name: "上饶市",
  ProID: "36",
  CitySort: "133"
},
{
  CityID: "3701",
  name: "济南市",
  ProID: "37",
  CitySort: "134"
},
{
  CityID: "3702",
  name: "青岛市",
  ProID: "37",
  CitySort: "135"
},
{
  CityID: "3703",
  name: "淄博市",
  ProID: "37",
  CitySort: "136"
},
{
  CityID: "3704",
  name: "枣庄市",
  ProID: "37",
  CitySort: "137"
},
{
  CityID: "3705",
  name: "东营市",
  ProID: "37",
  CitySort: "138"
},
{
  CityID: "3706",
  name: "烟台市",
  ProID: "37",
  CitySort: "139"
},
{
  CityID: "3707",
  name: "潍坊市",
  ProID: "37",
  CitySort: "140"
},
{
  CityID: "3708",
  name: "济宁市",
  ProID: "37",
  CitySort: "141"
},
{
  CityID: "3709",
  name: "泰安市",
  ProID: "37",
  CitySort: "142"
},
{
  CityID: "3710",
  name: "威海市",
  ProID: "37",
  CitySort: "143"
},
{
  CityID: "3711",
  name: "日照市",
  ProID: "37",
  CitySort: "144"
},
{
  CityID: "3712",
  name: "莱芜市",
  ProID: "37",
  CitySort: "145"
},
{
  CityID: "3713",
  name: "临沂市",
  ProID: "37",
  CitySort: "146"
},
{
  CityID: "3714",
  name: "德州市",
  ProID: "37",
  CitySort: "147"
},
{
  CityID: "3715",
  name: "聊城市",
  ProID: "37",
  CitySort: "148"
},
{
  CityID: "3716",
  name: "滨州市",
  ProID: "37",
  CitySort: "149"
},
{
  CityID: "3717",
  name: "菏泽市",
  ProID: "37",
  CitySort: "150"
},
{
  CityID: "4101",
  name: "郑州市",
  ProID: "41",
  CitySort: "151"
},
{
  CityID: "4102",
  name: "开封市",
  ProID: "41",
  CitySort: "152"
},
{
  CityID: "4103",
  name: "洛阳市",
  ProID: "41",
  CitySort: "153"
},
{
  CityID: "4104",
  name: "平顶山市",
  ProID: "41",
  CitySort: "154"
},
{
  CityID: "4105",
  name: "安阳市",
  ProID: "41",
  CitySort: "155"
},
{
  CityID: "4106",
  name: "鹤壁市",
  ProID: "41",
  CitySort: "156"
},
{
  CityID: "4107",
  name: "新乡市",
  ProID: "41",
  CitySort: "157"
},
{
  CityID: "4108",
  name: "焦作市",
  ProID: "41",
  CitySort: "158"
},
{
  CityID: "4109",
  name: "濮阳市",
  ProID: "41",
  CitySort: "159"
},
{
  CityID: "4110",
  name: "许昌市",
  ProID: "41",
  CitySort: "160"
},
{
  CityID: "4111",
  name: "漯河市",
  ProID: "41",
  CitySort: "161"
},
{
  CityID: "4112",
  name: "三门峡市",
  ProID: "41",
  CitySort: "162"
},
{
  CityID: "4113",
  name: "南阳市",
  ProID: "41",
  CitySort: "163"
},
{
  CityID: "4114",
  name: "商丘市",
  ProID: "41",
  CitySort: "164"
},
{
  CityID: "4115",
  name: "信阳市",
  ProID: "41",
  CitySort: "165"
},
{
  CityID: "4116",
  name: "周口市",
  ProID: "41",
  CitySort: "166"
},
{
  CityID: "4117",
  name: "驻马店市",
  ProID: "41",
  CitySort: "167"
},
{
  CityID: "4201",
  name: "武汉市",
  ProID: "42",
  CitySort: "168"
},
{
  CityID: "4202",
  name: "黄石市",
  ProID: "42",
  CitySort: "169"
},
{
  CityID: "4203",
  name: "十堰市",
  ProID: "42",
  CitySort: "170"
},
{
  CityID: "4205",
  name: "宜昌市",
  ProID: "42",
  CitySort: "171"
},
{
  CityID: "4206",
  name: "襄阳市",
  ProID: "42",
  CitySort: "172"
},
{
  CityID: "4207",
  name: "鄂州市",
  ProID: "42",
  CitySort: "173"
},
{
  CityID: "4208",
  name: "荆门市",
  ProID: "42",
  CitySort: "174"
},
{
  CityID: "4209",
  name: "孝感市",
  ProID: "42",
  CitySort: "175"
},
{
  CityID: "4210",
  name: "荆州市",
  ProID: "42",
  CitySort: "176"
},
{
  CityID: "4211",
  name: "黄冈市",
  ProID: "42",
  CitySort: "177"
},
{
  CityID: "4212",
  name: "咸宁市",
  ProID: "42",
  CitySort: "178"
},
{
  CityID: "4213",
  name: "随州市",
  ProID: "42",
  CitySort: "179"
},
{
  CityID: "4228",
  name: "恩施土家族苗族自治州",
  ProID: "42",
  CitySort: "180"
},
{
  CityID: "4294",
  name: "仙桃市",
  ProID: "42",
  CitySort: "181"
},
{
  CityID: "4295",
  name: "潜江市",
  ProID: "42",
  CitySort: "182"
},
{
  CityID: "4296",
  name: "天门市",
  ProID: "42",
  CitySort: "183"
},
{
  CityID: "4299",
  name: "神农架林区",
  ProID: "42",
  CitySort: "184"
},
{
  CityID: "4301",
  name: "长沙市",
  ProID: "43",
  CitySort: "185"
},
{
  CityID: "4302",
  name: "株洲市",
  ProID: "43",
  CitySort: "186"
},
{
  CityID: "4303",
  name: "湘潭市",
  ProID: "43",
  CitySort: "187"
},
{
  CityID: "4304",
  name: "衡阳市",
  ProID: "43",
  CitySort: "188"
},
{
  CityID: "4305",
  name: "邵阳市",
  ProID: "43",
  CitySort: "189"
},
{
  CityID: "4306",
  name: "岳阳市",
  ProID: "43",
  CitySort: "190"
},
{
  CityID: "4307",
  name: "常德市",
  ProID: "43",
  CitySort: "191"
},
{
  CityID: "4308",
  name: "张家界市",
  ProID: "43",
  CitySort: "192"
},
{
  CityID: "4309",
  name: "益阳市",
  ProID: "43",
  CitySort: "193"
},
{
  CityID: "4310",
  name: "郴州市",
  ProID: "43",
  CitySort: "194"
},
{
  CityID: "4311",
  name: "永州市",
  ProID: "43",
  CitySort: "195"
},
{
  CityID: "4312",
  name: "怀化市",
  ProID: "43",
  CitySort: "196"
},
{
  CityID: "4313",
  name: "娄底市",
  ProID: "43",
  CitySort: "197"
},
{
  CityID: "4331",
  name: "湘西土家族苗族自治州",
  ProID: "43",
  CitySort: "198"
},
{
  CityID: "4401",
  name: "广州市",
  ProID: "44",
  CitySort: "199"
},
{
  CityID: "4402",
  name: "韶关市",
  ProID: "44",
  CitySort: "200"
},
{
  CityID: "4403",
  name: "深圳市",
  ProID: "44",
  CitySort: "201"
},
{
  CityID: "4404",
  name: "珠海市",
  ProID: "44",
  CitySort: "202"
},
{
  CityID: "4405",
  name: "汕头市",
  ProID: "44",
  CitySort: "203"
},
{
  CityID: "4406",
  name: "佛山市",
  ProID: "44",
  CitySort: "204"
},
{
  CityID: "4407",
  name: "江门市",
  ProID: "44",
  CitySort: "205"
},
{
  CityID: "4408",
  name: "湛江市",
  ProID: "44",
  CitySort: "206"
},
{
  CityID: "4409",
  name: "茂名市",
  ProID: "44",
  CitySort: "207"
},
{
  CityID: "4412",
  name: "肇庆市",
  ProID: "44",
  CitySort: "208"
},
{
  CityID: "4413",
  name: "惠州市",
  ProID: "44",
  CitySort: "209"
},
{
  CityID: "4414",
  name: "梅州市",
  ProID: "44",
  CitySort: "210"
},
{
  CityID: "4415",
  name: "汕尾市",
  ProID: "44",
  CitySort: "211"
},
{
  CityID: "4416",
  name: "河源市",
  ProID: "44",
  CitySort: "212"
},
{
  CityID: "4417",
  name: "阳江市",
  ProID: "44",
  CitySort: "213"
},
{
  CityID: "4418",
  name: "清远市",
  ProID: "44",
  CitySort: "214"
},
{
  CityID: "4419",
  name: "东莞市",
  ProID: "44",
  CitySort: "215"
},
{
  CityID: "4420",
  name: "中山市",
  ProID: "44",
  CitySort: "216"
},
{
  CityID: "4451",
  name: "潮州市",
  ProID: "44",
  CitySort: "217"
},
{
  CityID: "4452",
  name: "揭阳市",
  ProID: "44",
  CitySort: "218"
},
{
  CityID: "4453",
  name: "云浮市",
  ProID: "44",
  CitySort: "219"
},
{
  CityID: "4501",
  name: "南宁市",
  ProID: "45",
  CitySort: "220"
},
{
  CityID: "4502",
  name: "柳州市",
  ProID: "45",
  CitySort: "221"
},
{
  CityID: "4503",
  name: "桂林市",
  ProID: "45",
  CitySort: "222"
},
{
  CityID: "4504",
  name: "梧州市",
  ProID: "45",
  CitySort: "223"
},
{
  CityID: "4505",
  name: "北海市",
  ProID: "45",
  CitySort: "224"
},
{
  CityID: "4506",
  name: "防城港市",
  ProID: "45",
  CitySort: "225"
},
{
  CityID: "4507",
  name: "钦州市",
  ProID: "45",
  CitySort: "226"
},
{
  CityID: "4508",
  name: "贵港市",
  ProID: "45",
  CitySort: "227"
},
{
  CityID: "4509",
  name: "玉林市",
  ProID: "45",
  CitySort: "228"
},
{
  CityID: "4510",
  name: "百色市",
  ProID: "45",
  CitySort: "229"
},
{
  CityID: "4511",
  name: "贺州市",
  ProID: "45",
  CitySort: "230"
},
{
  CityID: "4512",
  name: "河池市",
  ProID: "45",
  CitySort: "231"
},
{
  CityID: "4513",
  name: "来宾市",
  ProID: "45",
  CitySort: "232"
},
{
  CityID: "4514",
  name: "崇左市",
  ProID: "45",
  CitySort: "233"
},
{
  CityID: "4601",
  name: "海口市",
  ProID: "46",
  CitySort: "234"
},
{
  CityID: "4602",
  name: "三亚市",
  ProID: "46",
  CitySort: "235"
},
{
  CityID: "4603",
  name: "五指山市",
  ProID: "46",
  CitySort: "236"
},
{
  CityID: "4604",
  name: "琼海市",
  ProID: "46",
  CitySort: "237"
},
{
  CityID: "4605",
  name: "儋州市",
  ProID: "46",
  CitySort: "238"
},
{
  CityID: "4606",
  name: "文昌市",
  ProID: "46",
  CitySort: "239"
},
{
  CityID: "4607",
  name: "万宁市",
  ProID: "46",
  CitySort: "240"
},
{
  CityID: "4608",
  name: "东方市",
  ProID: "46",
  CitySort: "241"
},
{
  CityID: "4609",
  name: "定安县",
  ProID: "46",
  CitySort: "242"
},
{
  CityID: "4610",
  name: "屯昌县",
  ProID: "46",
  CitySort: "243"
},
{
  CityID: "4611",
  name: "澄迈县",
  ProID: "46",
  CitySort: "244"
},
{
  CityID: "4612",
  name: "临高县",
  ProID: "46",
  CitySort: "245"
},
{
  CityID: "4613",
  name: "白沙黎族自治县",
  ProID: "46",
  CitySort: "246"
},
{
  CityID: "4614",
  name: "昌江黎族自治县",
  ProID: "46",
  CitySort: "247"
},
{
  CityID: "4615",
  name: "乐东黎族自治县",
  ProID: "46",
  CitySort: "248"
},
{
  CityID: "4616",
  name: "陵水黎族自治县",
  ProID: "46",
  CitySort: "249"
},
{
  CityID: "4617",
  name: "保亭黎族苗族自治县",
  ProID: "46",
  CitySort: "250"
},
{
  CityID: "4618",
  name: "琼中黎族苗族自治县",
  ProID: "46",
  CitySort: "251"
},
{
  CityID: "4619",
  name: "西沙群岛",
  ProID: "46",
  CitySort: "252"
},
{
  CityID: "4620",
  name: "南沙群岛",
  ProID: "46",
  CitySort: "253"
},
{
  CityID: "4621",
  name: "中沙群岛的岛礁及其海域",
  ProID: "46",
  CitySort: "254"
},
{
  CityID: "5001",
  name: "重庆市",
  ProID: "50",
  CitySort: "255"
},
{
  CityID: "5101",
  name: "成都市",
  ProID: "51",
  CitySort: "256"
},
{
  CityID: "5103",
  name: "自贡市",
  ProID: "51",
  CitySort: "257"
},
{
  CityID: "5104",
  name: "攀枝花市",
  ProID: "51",
  CitySort: "258"
},
{
  CityID: "5105",
  name: "泸州市",
  ProID: "51",
  CitySort: "259"
},
{
  CityID: "5106",
  name: "德阳市",
  ProID: "51",
  CitySort: "260"
},
{
  CityID: "5107",
  name: "绵阳市",
  ProID: "51",
  CitySort: "261"
},
{
  CityID: "5108",
  name: "广元市",
  ProID: "51",
  CitySort: "262"
},
{
  CityID: "5109",
  name: "遂宁市",
  ProID: "51",
  CitySort: "263"
},
{
  CityID: "5110",
  name: "内江市",
  ProID: "51",
  CitySort: "264"
},
{
  CityID: "5111",
  name: "乐山市",
  ProID: "51",
  CitySort: "265"
},
{
  CityID: "5113",
  name: "南充市",
  ProID: "51",
  CitySort: "266"
},
{
  CityID: "5114",
  name: "眉山市",
  ProID: "51",
  CitySort: "267"
},
{
  CityID: "5115",
  name: "宜宾市",
  ProID: "51",
  CitySort: "268"
},
{
  CityID: "5116",
  name: "广安市",
  ProID: "51",
  CitySort: "269"
},
{
  CityID: "5117",
  name: "达州市",
  ProID: "51",
  CitySort: "270"
},
{
  CityID: "5118",
  name: "雅安市",
  ProID: "51",
  CitySort: "271"
},
{
  CityID: "5119",
  name: "巴中市",
  ProID: "51",
  CitySort: "272"
},
{
  CityID: "5120",
  name: "资阳市",
  ProID: "51",
  CitySort: "273"
},
{
  CityID: "5132",
  name: "阿坝藏族羌族自治州",
  ProID: "51",
  CitySort: "274"
},
{
  CityID: "5133",
  name: "甘孜藏族自治州",
  ProID: "51",
  CitySort: "275"
},
{
  CityID: "5134",
  name: "凉山彝族自治州",
  ProID: "51",
  CitySort: "276"
},
{
  CityID: "5201",
  name: "贵阳市",
  ProID: "52",
  CitySort: "277"
},
{
  CityID: "5202",
  name: "六盘水市",
  ProID: "52",
  CitySort: "278"
},
{
  CityID: "5203",
  name: "遵义市",
  ProID: "52",
  CitySort: "279"
},
{
  CityID: "5204",
  name: "安顺市",
  ProID: "52",
  CitySort: "280"
},
{
  CityID: "5222",
  name: "铜仁市",
  ProID: "52",
  CitySort: "281"
},
{
  CityID: "5223",
  name: "黔西南布依族苗族自治州",
  ProID: "52",
  CitySort: "282"
},
{
  CityID: "5224",
  name: "毕节市",
  ProID: "52",
  CitySort: "283"
},
{
  CityID: "5226",
  name: "黔东南苗族侗族自治州",
  ProID: "52",
  CitySort: "284"
},
{
  CityID: "5227",
  name: "黔南布依族苗族自治州",
  ProID: "52",
  CitySort: "285"
},
{
  CityID: "5301",
  name: "昆明市",
  ProID: "53",
  CitySort: "286"
},
{
  CityID: "5303",
  name: "曲靖市",
  ProID: "53",
  CitySort: "287"
},
{
  CityID: "5304",
  name: "玉溪市",
  ProID: "53",
  CitySort: "288"
},
{
  CityID: "5305",
  name: "保山市",
  ProID: "53",
  CitySort: "289"
},
{
  CityID: "5306",
  name: "昭通市",
  ProID: "53",
  CitySort: "290"
},
{
  CityID: "5307",
  name: "丽江市",
  ProID: "53",
  CitySort: "291"
},
{
  CityID: "5308",
  name: "普洱市",
  ProID: "53",
  CitySort: "292"
},
{
  CityID: "5309",
  name: "临沧市",
  ProID: "53",
  CitySort: "293"
},
{
  CityID: "5323",
  name: "楚雄彝族自治州",
  ProID: "53",
  CitySort: "294"
},
{
  CityID: "5325",
  name: "红河哈尼族彝族自治州",
  ProID: "53",
  CitySort: "295"
},
{
  CityID: "5326",
  name: "文山壮族苗族自治州",
  ProID: "53",
  CitySort: "296"
},
{
  CityID: "5328",
  name: "西双版纳傣族自治州",
  ProID: "53",
  CitySort: "297"
},
{
  CityID: "5329",
  name: "大理白族自治州",
  ProID: "53",
  CitySort: "298"
},
{
  CityID: "5331",
  name: "德宏傣族景颇族自治州",
  ProID: "53",
  CitySort: "299"
},
{
  CityID: "5333",
  name: "怒江傈僳族自治州",
  ProID: "53",
  CitySort: "300"
},
{
  CityID: "5334",
  name: "迪庆藏族自治州",
  ProID: "53",
  CitySort: "301"
},
{
  CityID: "5401",
  name: "拉萨市",
  ProID: "54",
  CitySort: "302"
},
{
  CityID: "5421",
  name: "昌都地区",
  ProID: "54",
  CitySort: "303"
},
{
  CityID: "5422",
  name: "山南地区",
  ProID: "54",
  CitySort: "304"
},
{
  CityID: "5423",
  name: "日喀则地区",
  ProID: "54",
  CitySort: "305"
},
{
  CityID: "5424",
  name: "那曲地区",
  ProID: "54",
  CitySort: "306"
},
{
  CityID: "5425",
  name: "阿里地区",
  ProID: "54",
  CitySort: "307"
},
{
  CityID: "5426",
  name: "林芝地区",
  ProID: "54",
  CitySort: "308"
},
{
  CityID: "6101",
  name: "西安市",
  ProID: "61",
  CitySort: "309"
},
{
  CityID: "6102",
  name: "铜川市",
  ProID: "61",
  CitySort: "310"
},
{
  CityID: "6103",
  name: "宝鸡市",
  ProID: "61",
  CitySort: "311"
},
{
  CityID: "6104",
  name: "咸阳市",
  ProID: "61",
  CitySort: "312"
},
{
  CityID: "6105",
  name: "渭南市",
  ProID: "61",
  CitySort: "313"
},
{
  CityID: "6106",
  name: "延安市",
  ProID: "61",
  CitySort: "314"
},
{
  CityID: "6107",
  name: "汉中市",
  ProID: "61",
  CitySort: "315"
},
{
  CityID: "6108",
  name: "榆林市",
  ProID: "61",
  CitySort: "316"
},
{
  CityID: "6109",
  name: "安康市",
  ProID: "61",
  CitySort: "317"
},
{
  CityID: "6110",
  name: "商洛市",
  ProID: "61",
  CitySort: "318"
},
{
  CityID: "6201",
  name: "兰州市",
  ProID: "62",
  CitySort: "319"
},
{
  CityID: "6202",
  name: "嘉峪关市",
  ProID: "62",
  CitySort: "320"
},
{
  CityID: "6203",
  name: "金昌市",
  ProID: "62",
  CitySort: "321"
},
{
  CityID: "6204",
  name: "白银市",
  ProID: "62",
  CitySort: "322"
},
{
  CityID: "6205",
  name: "天水市",
  ProID: "62",
  CitySort: "323"
},
{
  CityID: "6206",
  name: "武威市",
  ProID: "62",
  CitySort: "324"
},
{
  CityID: "6207",
  name: "张掖市",
  ProID: "62",
  CitySort: "325"
},
{
  CityID: "6208",
  name: "平凉市",
  ProID: "62",
  CitySort: "326"
},
{
  CityID: "6209",
  name: "酒泉市",
  ProID: "62",
  CitySort: "327"
},
{
  CityID: "6210",
  name: "庆阳市",
  ProID: "62",
  CitySort: "328"
},
{
  CityID: "6211",
  name: "定西市",
  ProID: "62",
  CitySort: "329"
},
{
  CityID: "6212",
  name: "陇南市",
  ProID: "62",
  CitySort: "330"
},
{
  CityID: "6229",
  name: "临夏回族自治州",
  ProID: "62",
  CitySort: "331"
},
{
  CityID: "6230",
  name: "甘南藏族自治州",
  ProID: "62",
  CitySort: "332"
},
{
  CityID: "6301",
  name: "西宁市",
  ProID: "63",
  CitySort: "333"
},
{
  CityID: "6321",
  name: "海东市",
  ProID: "63",
  CitySort: "334"
},
{
  CityID: "6322",
  name: "海北藏族自治州",
  ProID: "63",
  CitySort: "335"
},
{
  CityID: "6323",
  name: "黄南藏族自治州",
  ProID: "63",
  CitySort: "336"
},
{
  CityID: "6325",
  name: "海南藏族自治州",
  ProID: "63",
  CitySort: "337"
},
{
  CityID: "6326",
  name: "果洛藏族自治州",
  ProID: "63",
  CitySort: "338"
},
{
  CityID: "6327",
  name: "玉树藏族自治州",
  ProID: "63",
  CitySort: "339"
},
{
  CityID: "6328",
  name: "海西蒙古族藏族自治州",
  ProID: "63",
  CitySort: "340"
},
{
  CityID: "6401",
  name: "银川市",
  ProID: "64",
  CitySort: "341"
},
{
  CityID: "6402",
  name: "石嘴山市",
  ProID: "64",
  CitySort: "342"
},
{
  CityID: "6403",
  name: "吴忠市",
  ProID: "64",
  CitySort: "343"
},
{
  CityID: "6404",
  name: "固原市",
  ProID: "64",
  CitySort: "344"
},
{
  CityID: "6405",
  name: "中卫市",
  ProID: "64",
  CitySort: "345"
},
{
  CityID: "6501",
  name: "乌鲁木齐市",
  ProID: "65",
  CitySort: "346"
},
{
  CityID: "6502",
  name: "克拉玛依市",
  ProID: "65",
  CitySort: "347"
},
{
  CityID: "6521",
  name: "吐鲁番地区",
  ProID: "65",
  CitySort: "348"
},
{
  CityID: "6522",
  name: "哈密地区",
  ProID: "65",
  CitySort: "349"
},
{
  CityID: "6523",
  name: "昌吉回族自治州",
  ProID: "65",
  CitySort: "350"
},
{
  CityID: "6527",
  name: "博尔塔拉蒙古自治州",
  ProID: "65",
  CitySort: "351"
},
{
  CityID: "6528",
  name: "巴音郭楞蒙古自治州",
  ProID: "65",
  CitySort: "352"
},
{
  CityID: "6529",
  name: "阿克苏地区",
  ProID: "65",
  CitySort: "353"
},
{
  CityID: "6530",
  name: "克孜勒苏柯尔克孜自治州",
  ProID: "65",
  CitySort: "354"
},
{
  CityID: "6531",
  name: "喀什地区",
  ProID: "65",
  CitySort: "355"
},
{
  CityID: "6532",
  name: "和田地区",
  ProID: "65",
  CitySort: "356"
},
{
  CityID: "6540",
  name: "伊犁哈萨克自治州",
  ProID: "65",
  CitySort: "357"
},
{
  CityID: "6542",
  name: "塔城地区",
  ProID: "65",
  CitySort: "358"
},
{
  CityID: "6543",
  name: "阿勒泰地区",
  ProID: "65",
  CitySort: "359"
},
{
  CityID: "6591",
  name: "石河子市",
  ProID: "65",
  CitySort: "360"
},
{
  CityID: "6592",
  name: "阿拉尔市",
  ProID: "65",
  CitySort: "361"
},
{
  CityID: "6593",
  name: "图木舒克市",
  ProID: "65",
  CitySort: "362"
},
{
  CityID: "6594",
  name: "五家渠市",
  ProID: "65",
  CitySort: "363"
}];


//地区----------------------------------------------------------------------------------------------
var areaArr = [{
  Id: 0,
  DisName: "--地区--",
  CityID: 0,
  DisSort: ""
}, {
  Id: "110101",
  DisName: "东城区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110102",
  DisName: "西城区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110103",
  DisName: "崇文区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110104",
  DisName: "宣武区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110105",
  DisName: "朝阳区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110106",
  DisName: "丰台区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110107",
  DisName: "石景山区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110108",
  DisName: "海淀区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110109",
  DisName: "门头沟区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110111",
  DisName: "房山区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110112",
  DisName: "通州区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110113",
  DisName: "顺义区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110114",
  DisName: "昌平区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110115",
  DisName: "大兴区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110116",
  DisName: "怀柔区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110117",
  DisName: "平谷区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110128",
  DisName: "密云县",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110129",
  DisName: "延庆县",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "110130",
  DisName: "其它区",
  CityID: "1101",
  DisSort: ""
},
{
  Id: "120101",
  DisName: "和平区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120102",
  DisName: "河东区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120103",
  DisName: "河西区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120104",
  DisName: "南开区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120105",
  DisName: "河北区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120106",
  DisName: "红桥区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120107",
  DisName: "塘沽区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120108",
  DisName: "汉沽区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120109",
  DisName: "大港区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120110",
  DisName: "东丽区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120111",
  DisName: "西青区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120112",
  DisName: "津南区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120113",
  DisName: "北辰区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120114",
  DisName: "武清区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120115",
  DisName: "宝坻区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120116",
  DisName: "滨海新区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120121",
  DisName: "宁河县",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120123",
  DisName: "静海县",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120125",
  DisName: "蓟县",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "120126",
  DisName: "其它区",
  CityID: "1201",
  DisSort: ""
},
{
  Id: "130102",
  DisName: "长安区",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130103",
  DisName: "桥东区",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130104",
  DisName: "桥西区",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130105",
  DisName: "新华区",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130107",
  DisName: "井陉矿区",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130108",
  DisName: "裕华区",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130121",
  DisName: "井陉县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130123",
  DisName: "正定县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130124",
  DisName: "栾城县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130125",
  DisName: "行唐县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130126",
  DisName: "灵寿县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130127",
  DisName: "高邑县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130128",
  DisName: "深泽县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130129",
  DisName: "赞皇县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130130",
  DisName: "无极县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130131",
  DisName: "平山县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130132",
  DisName: "元氏县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130133",
  DisName: "赵县",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130181",
  DisName: "辛集市",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130182",
  DisName: "藁城市",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130183",
  DisName: "晋州市",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130184",
  DisName: "新乐市",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130185",
  DisName: "鹿泉市",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130186",
  DisName: "其它区",
  CityID: "1301",
  DisSort: ""
},
{
  Id: "130202",
  DisName: "路南区",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130203",
  DisName: "路北区",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130204",
  DisName: "古冶区",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130205",
  DisName: "开平区",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130207",
  DisName: "丰南区",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130208",
  DisName: "丰润区",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130223",
  DisName: "滦县",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130224",
  DisName: "滦南县",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130225",
  DisName: "乐亭县",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130227",
  DisName: "迁西县",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130229",
  DisName: "玉田县",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130230",
  DisName: "唐海县",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130281",
  DisName: "遵化市",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130283",
  DisName: "迁安市",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130284",
  DisName: "其它区",
  CityID: "1302",
  DisSort: ""
},
{
  Id: "130302",
  DisName: "海港区",
  CityID: "1303",
  DisSort: ""
},
{
  Id: "130303",
  DisName: "山海关区",
  CityID: "1303",
  DisSort: ""
},
{
  Id: "130304",
  DisName: "北戴河区",
  CityID: "1303",
  DisSort: ""
},
{
  Id: "130321",
  DisName: "青龙满族自治县",
  CityID: "1303",
  DisSort: ""
},
{
  Id: "130322",
  DisName: "昌黎县",
  CityID: "1303",
  DisSort: ""
},
{
  Id: "130323",
  DisName: "抚宁县",
  CityID: "1303",
  DisSort: ""
},
{
  Id: "130324",
  DisName: "卢龙县",
  CityID: "1303",
  DisSort: ""
},
{
  Id: "130398",
  DisName: "其它区",
  CityID: "1303",
  DisSort: ""
},
{
  Id: "130399",
  DisName: "经济技术开发区",
  CityID: "1303",
  DisSort: ""
},
{
  Id: "130402",
  DisName: "邯山区",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130403",
  DisName: "丛台区",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130404",
  DisName: "复兴区",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130406",
  DisName: "峰峰矿区",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130421",
  DisName: "邯郸县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130423",
  DisName: "临漳县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130424",
  DisName: "成安县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130425",
  DisName: "大名县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130426",
  DisName: "涉县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130427",
  DisName: "磁县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130428",
  DisName: "肥乡县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130429",
  DisName: "永年县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130430",
  DisName: "邱县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130431",
  DisName: "鸡泽县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130432",
  DisName: "广平县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130433",
  DisName: "馆陶县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130434",
  DisName: "魏县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130435",
  DisName: "曲周县",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130481",
  DisName: "武安市",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130482",
  DisName: "其它区",
  CityID: "1304",
  DisSort: ""
},
{
  Id: "130502",
  DisName: "桥东区",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130503",
  DisName: "桥西区",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130521",
  DisName: "邢台县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130522",
  DisName: "临城县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130523",
  DisName: "内丘县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130524",
  DisName: "柏乡县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130525",
  DisName: "隆尧县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130526",
  DisName: "任县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130527",
  DisName: "南和县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130528",
  DisName: "宁晋县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130529",
  DisName: "巨鹿县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130530",
  DisName: "新河县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130531",
  DisName: "广宗县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130532",
  DisName: "平乡县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130533",
  DisName: "威县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130534",
  DisName: "清河县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130535",
  DisName: "临西县",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130581",
  DisName: "南宫市",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130582",
  DisName: "沙河市",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130583",
  DisName: "其它区",
  CityID: "1305",
  DisSort: ""
},
{
  Id: "130602",
  DisName: "新市区",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130603",
  DisName: "北市区",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130604",
  DisName: "南市区",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130621",
  DisName: "满城县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130622",
  DisName: "清苑县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130623",
  DisName: "涞水县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130624",
  DisName: "阜平县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130625",
  DisName: "徐水县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130626",
  DisName: "定兴县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130627",
  DisName: "唐县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130628",
  DisName: "高阳县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130629",
  DisName: "容城县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130630",
  DisName: "涞源县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130631",
  DisName: "望都县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130632",
  DisName: "安新县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130633",
  DisName: "易县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130634",
  DisName: "曲阳县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130635",
  DisName: "蠡县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130636",
  DisName: "顺平县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130637",
  DisName: "博野县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130638",
  DisName: "雄县",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130681",
  DisName: "涿州市",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130682",
  DisName: "定州市",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130683",
  DisName: "安国市",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130684",
  DisName: "高碑店市",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130698",
  DisName: "高开区",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130699",
  DisName: "其它区",
  CityID: "1306",
  DisSort: ""
},
{
  Id: "130702",
  DisName: "桥东区",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130703",
  DisName: "桥西区",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130705",
  DisName: "宣化区",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130706",
  DisName: "下花园区",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130721",
  DisName: "宣化县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130722",
  DisName: "张北县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130723",
  DisName: "康保县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130724",
  DisName: "沽源县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130725",
  DisName: "尚义县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130726",
  DisName: "蔚县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130727",
  DisName: "阳原县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130728",
  DisName: "怀安县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130729",
  DisName: "万全县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130730",
  DisName: "怀来县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130731",
  DisName: "涿鹿县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130732",
  DisName: "赤城县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130733",
  DisName: "崇礼县",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130734",
  DisName: "其它区",
  CityID: "1307",
  DisSort: ""
},
{
  Id: "130802",
  DisName: "双桥区",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130803",
  DisName: "双滦区",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130804",
  DisName: "鹰手营子矿区",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130821",
  DisName: "承德县",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130822",
  DisName: "兴隆县",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130823",
  DisName: "平泉县",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130824",
  DisName: "滦平县",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130825",
  DisName: "隆化县",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130826",
  DisName: "丰宁满族自治县",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130827",
  DisName: "宽城满族自治县",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130828",
  DisName: "围场满族蒙古族自治县",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130829",
  DisName: "其它区",
  CityID: "1308",
  DisSort: ""
},
{
  Id: "130902",
  DisName: "新华区",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130903",
  DisName: "运河区",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130921",
  DisName: "沧县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130922",
  DisName: "青县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130923",
  DisName: "东光县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130924",
  DisName: "海兴县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130925",
  DisName: "盐山县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130926",
  DisName: "肃宁县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130927",
  DisName: "南皮县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130928",
  DisName: "吴桥县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130929",
  DisName: "献县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130930",
  DisName: "孟村回族自治县",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130981",
  DisName: "泊头市",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130982",
  DisName: "任丘市",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130983",
  DisName: "黄骅市",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130984",
  DisName: "河间市",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "130985",
  DisName: "其它区",
  CityID: "1309",
  DisSort: ""
},
{
  Id: "131002",
  DisName: "安次区",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131003",
  DisName: "广阳区",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131022",
  DisName: "固安县",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131023",
  DisName: "永清县",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131024",
  DisName: "香河县",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131025",
  DisName: "大城县",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131026",
  DisName: "文安县",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131028",
  DisName: "大厂回族自治县",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131051",
  DisName: "开发区",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131052",
  DisName: "燕郊经济技术开发区",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131081",
  DisName: "霸州市",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131082",
  DisName: "三河市",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131083",
  DisName: "其它区",
  CityID: "1310",
  DisSort: ""
},
{
  Id: "131102",
  DisName: "桃城区",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131121",
  DisName: "枣强县",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131122",
  DisName: "武邑县",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131123",
  DisName: "武强县",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131124",
  DisName: "饶阳县",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131125",
  DisName: "安平县",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131126",
  DisName: "故城县",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131127",
  DisName: "景县",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131128",
  DisName: "阜城县",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131181",
  DisName: "冀州市",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131182",
  DisName: "深州市",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "131183",
  DisName: "其它区",
  CityID: "1311",
  DisSort: ""
},
{
  Id: "140105",
  DisName: "小店区",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140106",
  DisName: "迎泽区",
  CityID: "1401",

  DisSort: ""
},
{
  Id: "140107",
  DisName: "杏花岭区",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140108",
  DisName: "尖草坪区",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140109",
  DisName: "万柏林区",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140110",
  DisName: "晋源区",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140121",
  DisName: "清徐县",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140122",
  DisName: "阳曲县",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140123",
  DisName: "娄烦县",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140181",
  DisName: "古交市",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140182",
  DisName: "其它区",
  CityID: "1401",
  DisSort: ""
},
{
  Id: "140202",
  DisName: "城区",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140203",
  DisName: "矿区",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140211",
  DisName: "南郊区",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140212",
  DisName: "新荣区",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140221",
  DisName: "阳高县",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140222",
  DisName: "天镇县",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140223",
  DisName: "广灵县",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140224",
  DisName: "灵丘县",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140225",
  DisName: "浑源县",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140226",
  DisName: "左云县",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140227",
  DisName: "大同县",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140228",
  DisName: "其它区",
  CityID: "1402",
  DisSort: ""
},
{
  Id: "140302",
  DisName: "城区",
  CityID: "1403",
  DisSort: ""
},
{
  Id: "140303",
  DisName: "矿区",
  CityID: "1403",
  DisSort: ""
},
{
  Id: "140311",
  DisName: "郊区",
  CityID: "1403",
  DisSort: ""
},
{
  Id: "140321",
  DisName: "平定县",
  CityID: "1403",
  DisSort: ""
},
{
  Id: "140322",
  DisName: "盂县",
  CityID: "1403",
  DisSort: ""
},
{
  Id: "140323",
  DisName: "其它区",
  CityID: "1403",
  DisSort: ""
},
{
  Id: "140421",
  DisName: "长治县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140423",
  DisName: "襄垣县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140424",
  DisName: "屯留县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140425",
  DisName: "平顺县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140426",
  DisName: "黎城县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140427",
  DisName: "壶关县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140428",
  DisName: "长子县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140429",
  DisName: "武乡县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140430",
  DisName: "沁县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140431",
  DisName: "沁源县",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140481",
  DisName: "潞城市",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140482",
  DisName: "城区",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140483",
  DisName: "郊区",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140484",
  DisName: "高新区",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140485",
  DisName: "其它区",
  CityID: "1404",
  DisSort: ""
},
{
  Id: "140502",
  DisName: "城区",
  CityID: "1405",
  DisSort: ""
},
{
  Id: "140521",
  DisName: "沁水县",
  CityID: "1405",
  DisSort: ""
},
{
  Id: "140522",
  DisName: "阳城县",
  CityID: "1405",
  DisSort: ""
},
{
  Id: "140524",
  DisName: "陵川县",
  CityID: "1405",
  DisSort: ""
},
{
  Id: "140525",
  DisName: "泽州县",
  CityID: "1405",
  DisSort: ""
},
{
  Id: "140581",
  DisName: "高平市",
  CityID: "1405",
  DisSort: ""
},
{
  Id: "140582",
  DisName: "其它区",
  CityID: "1405",
  DisSort: ""
},
{
  Id: "140602",
  DisName: "朔城区",
  CityID: "1406",
  DisSort: ""
},
{
  Id: "140603",
  DisName: "平鲁区",
  CityID: "1406",
  DisSort: ""
},
{
  Id: "140621",
  DisName: "山阴县",
  CityID: "1406",
  DisSort: ""
},
{
  Id: "140622",
  DisName: "应县",
  CityID: "1406",
  DisSort: ""
},
{
  Id: "140623",
  DisName: "右玉县",
  CityID: "1406",
  DisSort: ""
},
{
  Id: "140624",
  DisName: "怀仁县",
  CityID: "1406",
  DisSort: ""
},
{
  Id: "140625",
  DisName: "其它区",
  CityID: "1406",
  DisSort: ""
},
{
  Id: "140702",
  DisName: "榆次区",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140721",
  DisName: "榆社县",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140722",
  DisName: "左权县",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140723",
  DisName: "和顺县",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140724",
  DisName: "昔阳县",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140725",
  DisName: "寿阳县",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140726",
  DisName: "太谷县",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140727",
  DisName: "祁县",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140728",
  DisName: "平遥县",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140729",
  DisName: "灵石县",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140781",
  DisName: "介休市",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140782",
  DisName: "其它区",
  CityID: "1407",
  DisSort: ""
},
{
  Id: "140802",
  DisName: "盐湖区",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140821",
  DisName: "临猗县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140822",
  DisName: "万荣县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140823",
  DisName: "闻喜县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140824",
  DisName: "稷山县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140825",
  DisName: "新绛县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140826",
  DisName: "绛县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140827",
  DisName: "垣曲县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140828",
  DisName: "夏县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140829",
  DisName: "平陆县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140830",
  DisName: "芮城县",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140881",
  DisName: "永济市",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140882",
  DisName: "河津市",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140883",
  DisName: "其它区",
  CityID: "1408",
  DisSort: ""
},
{
  Id: "140902",
  DisName: "忻府区",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140921",
  DisName: "定襄县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140922",
  DisName: "五台县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140923",
  DisName: "代县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140924",
  DisName: "繁峙县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140925",
  DisName: "宁武县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140926",
  DisName: "静乐县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140927",
  DisName: "神池县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140928",
  DisName: "五寨县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140929",
  DisName: "岢岚县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140930",
  DisName: "河曲县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140931",
  DisName: "保德县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140932",
  DisName: "偏关县",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140981",
  DisName: "原平市",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "140982",
  DisName: "其它区",
  CityID: "1409",
  DisSort: ""
},
{
  Id: "141002",
  DisName: "尧都区",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141021",
  DisName: "曲沃县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141022",
  DisName: "翼城县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141023",
  DisName: "襄汾县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141024",
  DisName: "洪洞县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141025",
  DisName: "古县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141026",
  DisName: "安泽县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141027",
  DisName: "浮山县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141028",
  DisName: "吉县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141029",
  DisName: "乡宁县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141030",
  DisName: "大宁县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141031",
  DisName: "隰县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141032",
  DisName: "永和县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141033",
  DisName: "蒲县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141034",
  DisName: "汾西县",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141081",
  DisName: "侯马市",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141082",
  DisName: "霍州市",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141083",
  DisName: "其它区",
  CityID: "1410",
  DisSort: ""
},
{
  Id: "141102",
  DisName: "离石区",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141121",
  DisName: "文水县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141122",
  DisName: "交城县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141123",
  DisName: "兴县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141124",
  DisName: "临县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141125",
  DisName: "柳林县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141126",
  DisName: "石楼县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141127",
  DisName: "岚县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141128",
  DisName: "方山县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141129",
  DisName: "中阳县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141130",
  DisName: "交口县",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141181",
  DisName: "孝义市",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141182",
  DisName: "汾阳市",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "141183",
  DisName: "其它区",
  CityID: "1411",
  DisSort: ""
},
{
  Id: "150102",
  DisName: "新城区",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150103",
  DisName: "回民区",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150104",
  DisName: "玉泉区",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150105",
  DisName: "赛罕区",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150121",
  DisName: "土默特左旗",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150122",
  DisName: "托克托县",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150123",
  DisName: "和林格尔县",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150124",
  DisName: "清水河县",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150125",
  DisName: "武川县",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150126",
  DisName: "其它区",
  CityID: "1501",
  DisSort: ""
},
{
  Id: "150202",
  DisName: "东河区",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150203",
  DisName: "昆都仑区",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150204",
  DisName: "青山区",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150205",
  DisName: "石拐区",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150206",
  DisName: "白云矿区",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150207",
  DisName: "九原区",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150221",
  DisName: "土默特右旗",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150222",
  DisName: "固阳县",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150223",
  DisName: "达尔罕茂明安联合旗",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150224",
  DisName: "其它区",
  CityID: "1502",
  DisSort: ""
},
{
  Id: "150302",
  DisName: "海勃湾区",
  CityID: "1503",
  DisSort: ""
},
{
  Id: "150303",
  DisName: "海南区",
  CityID: "1503",
  DisSort: ""
},
{
  Id: "150304",
  DisName: "乌达区",
  CityID: "1503",
  DisSort: ""
},
{
  Id: "150305",
  DisName: "其它区",
  CityID: "1503",
  DisSort: ""
},
{
  Id: "150402",
  DisName: "红山区",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150403",
  DisName: "元宝山区",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150404",
  DisName: "松山区",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150421",
  DisName: "阿鲁科尔沁旗",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150422",
  DisName: "巴林左旗",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150423",
  DisName: "巴林右旗",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150424",
  DisName: "林西县",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150425",
  DisName: "克什克腾旗",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150426",
  DisName: "翁牛特旗",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150428",
  DisName: "喀喇沁旗",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150429",
  DisName: "宁城县",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150430",
  DisName: "敖汉旗",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150431",
  DisName: "其它区",
  CityID: "1504",
  DisSort: ""
},
{
  Id: "150502",
  DisName: "科尔沁区",
  CityID: "1505",
  DisSort: ""
},
{
  Id: "150521",
  DisName: "科尔沁左翼中旗",
  CityID: "1505",
  DisSort: ""
},
{
  Id: "150522",
  DisName: "科尔沁左翼后旗",
  CityID: "1505",
  DisSort: ""
},
{
  Id: "150523",
  DisName: "开鲁县",
  CityID: "1505",
  DisSort: ""
},
{
  Id: "150524",
  DisName: "库伦旗",
  CityID: "1505",
  DisSort: ""
},
{
  Id: "150525",
  DisName: "奈曼旗",
  CityID: "1505",
  DisSort: ""
},
{
  Id: "150526",
  DisName: "扎鲁特旗",
  CityID: "1505",
  DisSort: ""
},
{
  Id: "150581",
  DisName: "霍林郭勒市",
  CityID: "1505",
  DisSort: ""
},
{
  Id: "150582",
  DisName: "其它区",
  CityID: "1505",
  DisSort: ""
},
{
  Id: "150602",
  DisName: "东胜区",
  CityID: "1506",
  DisSort: ""
},
{
  Id: "150621",
  DisName: "达拉特旗",
  CityID: "1506",
  DisSort: ""
},
{
  Id: "150622",
  DisName: "准格尔旗",
  CityID: "1506",
  DisSort: ""
},
{
  Id: "150623",
  DisName: "鄂托克前旗",
  CityID: "1506",
  DisSort: ""
},
{
  Id: "150624",
  DisName: "鄂托克旗",
  CityID: "1506",
  DisSort: ""
},
{
  Id: "150625",
  DisName: "杭锦旗",
  CityID: "1506",
  DisSort: ""
},
{
  Id: "150626",
  DisName: "乌审旗",
  CityID: "1506",
  DisSort: ""
},
{
  Id: "150627",
  DisName: "伊金霍洛旗",
  CityID: "1506",
  DisSort: ""
},
{
  Id: "150628",
  DisName: "其它区",
  CityID: "1506",
  DisSort: ""
},
{
  Id: "150702",
  DisName: "海拉尔区",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150721",
  DisName: "阿荣旗",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150722",
  DisName: "莫力达瓦达斡尔族自治旗",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150723",
  DisName: "鄂伦春自治旗",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150724",
  DisName: "鄂温克族自治旗",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150725",
  DisName: "陈巴尔虎旗",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150726",
  DisName: "新巴尔虎左旗",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150727",
  DisName: "新巴尔虎右旗",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150781",
  DisName: "满洲里市",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150782",
  DisName: "牙克石市",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150783",
  DisName: "扎兰屯市",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150784",
  DisName: "额尔古纳市",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150785",
  DisName: "根河市",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150786",
  DisName: "其它区",
  CityID: "1507",
  DisSort: ""
},
{
  Id: "150802",
  DisName: "临河区",
  CityID: "1508",
  DisSort: ""
},
{
  Id: "150821",
  DisName: "五原县",
  CityID: "1508",
  DisSort: ""
},
{
  Id: "150822",
  DisName: "磴口县",
  CityID: "1508",
  DisSort: ""
},
{
  Id: "150823",
  DisName: "乌拉特前旗",
  CityID: "1508",
  DisSort: ""
},
{
  Id: "150824",
  DisName: "乌拉特中旗",
  CityID: "1508",
  DisSort: ""
},
{
  Id: "150825",
  DisName: "乌拉特后旗",
  CityID: "1508",
  DisSort: ""
},
{
  Id: "150826",
  DisName: "杭锦后旗",
  CityID: "1508",
  DisSort: ""
},
{
  Id: "150827",
  DisName: "其它区",
  CityID: "1508",
  DisSort: ""
},
{
  Id: "150902",
  DisName: "集宁区",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150921",
  DisName: "卓资县",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150922",
  DisName: "化德县",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150923",
  DisName: "商都县",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150924",
  DisName: "兴和县",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150925",
  DisName: "凉城县",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150926",
  DisName: "察哈尔右翼前旗",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150927",
  DisName: "察哈尔右翼中旗",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150928",
  DisName: "察哈尔右翼后旗",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150929",
  DisName: "四子王旗",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150981",
  DisName: "丰镇市",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "150982",
  DisName: "其它区",
  CityID: "1509",
  DisSort: ""
},
{
  Id: "152201",
  DisName: "乌兰浩特市",
  CityID: "1522",
  DisSort: ""
},
{
  Id: "152202",
  DisName: "阿尔山市",
  CityID: "1522",
  DisSort: ""
},
{
  Id: "152221",
  DisName: "科尔沁右翼前旗",
  CityID: "1522",
  DisSort: ""
},
{
  Id: "152222",
  DisName: "科尔沁右翼中旗",
  CityID: "1522",
  DisSort: ""
},
{
  Id: "152223",
  DisName: "扎赉特旗",
  CityID: "1522",
  DisSort: ""
},
{
  Id: "152224",
  DisName: "突泉县",
  CityID: "1522",
  DisSort: ""
},
{
  Id: "152225",
  DisName: "其它区",
  CityID: "1522",
  DisSort: ""
},
{
  Id: "152501",
  DisName: "二连浩特市",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152502",
  DisName: "锡林浩特市",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152522",
  DisName: "阿巴嘎旗",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152523",
  DisName: "苏尼特左旗",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152524",
  DisName: "苏尼特右旗",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152525",
  DisName: "东乌珠穆沁旗",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152526",
  DisName: "西乌珠穆沁旗",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152527",
  DisName: "太仆寺旗",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152528",
  DisName: "镶黄旗",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152529",
  DisName: "正镶白旗",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152530",
  DisName: "正蓝旗",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152531",
  DisName: "多伦县",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152532",
  DisName: "其它区",
  CityID: "1525",
  DisSort: ""
},
{
  Id: "152921",
  DisName: "阿拉善左旗",
  CityID: "1529",
  DisSort: ""
},
{
  Id: "152922",
  DisName: "阿拉善右旗",
  CityID: "1529",
  DisSort: ""
},
{
  Id: "152923",
  DisName: "额济纳旗",
  CityID: "1529",
  DisSort: ""
},
{
  Id: "152924",
  DisName: "其它区",
  CityID: "1529",
  DisSort: ""
},
{
  Id: "210102",
  DisName: "和平区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210103",
  DisName: "沈河区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210104",
  DisName: "大东区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210105",
  DisName: "皇姑区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210106",
  DisName: "铁西区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210111",
  DisName: "苏家屯区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210112",
  DisName: "东陵区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210113",
  DisName: "新城子区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210114",
  DisName: "于洪区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210122",
  DisName: "辽中县",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210123",
  DisName: "康平县",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210124",
  DisName: "法库县",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210181",
  DisName: "新民市",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210182",
  DisName: "浑南新区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210183",
  DisName: "张士开发区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210184",
  DisName: "沈北新区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210185",
  DisName: "其它区",
  CityID: "2101",
  DisSort: ""
},
{
  Id: "210202",
  DisName: "中山区",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210203",
  DisName: "西岗区",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210204",
  DisName: "沙河口区",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210211",
  DisName: "甘井子区",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210212",
  DisName: "旅顺口区",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210213",
  DisName: "金州区",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210224",
  DisName: "长海县",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210251",
  DisName: "开发区",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210281",
  DisName: "瓦房店市",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210282",
  DisName: "普兰店市",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210283",
  DisName: "庄河市",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210297",
  DisName: "岭前区",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210298",
  DisName: "其它区",
  CityID: "2102",
  DisSort: ""
},
{
  Id: "210302",
  DisName: "铁东区",
  CityID: "2103",
  DisSort: ""
},
{
  Id: "210303",
  DisName: "铁西区",
  CityID: "2103",
  DisSort: ""
},
{
  Id: "210304",
  DisName: "立山区",
  CityID: "2103",
  DisSort: ""
},
{
  Id: "210311",
  DisName: "千山区",
  CityID: "2103",
  DisSort: ""
},
{
  Id: "210321",
  DisName: "台安县",
  CityID: "2103",
  DisSort: ""
},
{
  Id: "210323",
  DisName: "岫岩满族自治县",
  CityID: "2103",
  DisSort: ""
},
{
  Id: "210351",
  DisName: "高新区",
  CityID: "2103",
  DisSort: ""
},
{
  Id: "210381",
  DisName: "海城市",
  CityID: "2103",
  DisSort: ""
},
{
  Id: "210382",
  DisName: "其它区",
  CityID: "2103",
  DisSort: ""
},
{
  Id: "210402",
  DisName: "新抚区",
  CityID: "2104",
  DisSort: ""
},
{
  Id: "210403",
  DisName: "东洲区",
  CityID: "2104",
  DisSort: ""
},
{
  Id: "210404",
  DisName: "望花区",
  CityID: "2104",
  DisSort: ""
},
{
  Id: "210411",
  DisName: "顺城区",
  CityID: "2104",
  DisSort: ""
},
{
  Id: "210421",
  DisName: "抚顺县",
  CityID: "2104",
  DisSort: ""
},
{
  Id: "210422",
  DisName: "新宾满族自治县",
  CityID: "2104",
  DisSort: ""
},
{
  Id: "210423",
  DisName: "清原满族自治县",
  CityID: "2104",
  DisSort: ""
},
{
  Id: "210424",
  DisName: "其它区",
  CityID: "2104",
  DisSort: ""
},
{
  Id: "210502",
  DisName: "平山区",
  CityID: "2105",
  DisSort: ""
},
{
  Id: "210503",
  DisName: "溪湖区",
  CityID: "2105",
  DisSort: ""
},
{
  Id: "210504",
  DisName: "明山区",
  CityID: "2105",
  DisSort: ""
},
{
  Id: "210505",
  DisName: "南芬区",
  CityID: "2105",
  DisSort: ""
},
{
  Id: "210521",
  DisName: "本溪满族自治县",
  CityID: "2105",
  DisSort: ""
},
{
  Id: "210522",
  DisName: "桓仁满族自治县",
  CityID: "2105",
  DisSort: ""
},
{
  Id: "210523",
  DisName: "其它区",
  CityID: "2105",
  DisSort: ""
},
{
  Id: "210602",
  DisName: "元宝区",
  CityID: "2106",
  DisSort: ""
},
{
  Id: "210603",
  DisName: "振兴区",
  CityID: "2106",
  DisSort: ""
},
{
  Id: "210604",
  DisName: "振安区",
  CityID: "2106",
  DisSort: ""
},
{
  Id: "210624",
  DisName: "宽甸满族自治县",
  CityID: "2106",
  DisSort: ""
},
{
  Id: "210681",
  DisName: "东港市",
  CityID: "2106",
  DisSort: ""
},
{
  Id: "210682",
  DisName: "凤城市",
  CityID: "2106",
  DisSort: ""
},
{
  Id: "210683",
  DisName: "其它区",
  CityID: "2106",
  DisSort: ""
},
{
  Id: "210702",
  DisName: "古塔区",
  CityID: "2107",
  DisSort: ""
},
{
  Id: "210703",
  DisName: "凌河区",
  CityID: "2107",
  DisSort: ""
},
{
  Id: "210711",
  DisName: "太和区",
  CityID: "2107",
  DisSort: ""
},
{
  Id: "210726",
  DisName: "黑山县",
  CityID: "2107",
  DisSort: ""
},
{
  Id: "210727",
  DisName: "义县",
  CityID: "2107",
  DisSort: ""
},
{
  Id: "210781",
  DisName: "凌海市",
  CityID: "2107",
  DisSort: ""
},
{
  Id: "210782",
  DisName: "北镇市",
  CityID: "2107",
  DisSort: ""
},
{
  Id: "210783",
  DisName: "其它区",
  CityID: "2107",
  DisSort: ""
},
{
  Id: "210802",
  DisName: "站前区",
  CityID: "2108",
  DisSort: ""
},
{
  Id: "210803",
  DisName: "西市区",
  CityID: "2108",
  DisSort: ""
},
{
  Id: "210804",
  DisName: "鲅鱼圈区",
  CityID: "2108",
  DisSort: ""
},
{
  Id: "210811",
  DisName: "老边区",
  CityID: "2108",
  DisSort: ""
},
{
  Id: "210881",
  DisName: "盖州市",
  CityID: "2108",
  DisSort: ""
},
{
  Id: "210882",
  DisName: "大石桥市",
  CityID: "2108",
  DisSort: ""
},
{
  Id: "210883",
  DisName: "其它区",
  CityID: "2108",
  DisSort: ""
},
{
  Id: "210902",
  DisName: "海州区",
  CityID: "2109",
  DisSort: ""
},
{
  Id: "210903",
  DisName: "新邱区",
  CityID: "2109",
  DisSort: ""
},
{
  Id: "210904",
  DisName: "太平区",
  CityID: "2109",
  DisSort: ""
},
{
  Id: "210905",
  DisName: "清河门区",
  CityID: "2109",
  DisSort: ""
},
{
  Id: "210911",
  DisName: "细河区",
  CityID: "2109",
  DisSort: ""
},
{
  Id: "210921",
  DisName: "阜新蒙古族自治县",
  CityID: "2109",
  DisSort: ""
},
{
  Id: "210922",
  DisName: "彰武县",
  CityID: "2109",
  DisSort: ""
},
{
  Id: "210923",
  DisName: "其它区",
  CityID: "2109",
  DisSort: ""
},
{
  Id: "211002",
  DisName: "白塔区",
  CityID: "2110",
  DisSort: ""
},
{
  Id: "211003",
  DisName: "文圣区",
  CityID: "2110",
  DisSort: ""
},
{
  Id: "211004",
  DisName: "宏伟区",
  CityID: "2110",
  DisSort: ""
},
{
  Id: "211005",
  DisName: "弓长岭区",
  CityID: "2110",
  DisSort: ""
},
{
  Id: "211011",
  DisName: "太子河区",
  CityID: "2110",
  DisSort: ""
},
{
  Id: "211021",
  DisName: "辽阳县",
  CityID: "2110",
  DisSort: ""
},
{
  Id: "211081",
  DisName: "灯塔市",
  CityID: "2110",
  DisSort: ""
},
{
  Id: "211082",
  DisName: "其它区",
  CityID: "2110",
  DisSort: ""
},
{
  Id: "211102",
  DisName: "双台子区",
  CityID: "2111",
  DisSort: ""
},
{
  Id: "211103",
  DisName: "兴隆台区",
  CityID: "2111",
  DisSort: ""
},
{
  Id: "211121",
  DisName: "大洼县",
  CityID: "2111",
  DisSort: ""
},
{
  Id: "211122",
  DisName: "盘山县",
  CityID: "2111",
  DisSort: ""
},
{
  Id: "211123",
  DisName: "其它区",
  CityID: "2111",
  DisSort: ""
},
{
  Id: "211202",
  DisName: "银州区",
  CityID: "2112",
  DisSort: ""
},
{
  Id: "211204",
  DisName: "清河区",
  CityID: "2112",
  DisSort: ""
},
{
  Id: "211221",
  DisName: "铁岭县",
  CityID: "2112",
  DisSort: ""
},
{
  Id: "211223",
  DisName: "西丰县",
  CityID: "2112",
  DisSort: ""
},
{
  Id: "211224",
  DisName: "昌图县",
  CityID: "2112",
  DisSort: ""
},
{
  Id: "211281",
  DisName: "调兵山市",
  CityID: "2112",
  DisSort: ""
},
{
  Id: "211282",
  DisName: "开原市",
  CityID: "2112",
  DisSort: ""
},
{
  Id: "211283",
  DisName: "其它区",
  CityID: "2112",
  DisSort: ""
},
{
  Id: "211302",
  DisName: "双塔区",
  CityID: "2113",
  DisSort: ""
},
{
  Id: "211303",
  DisName: "龙城区",
  CityID: "2113",
  DisSort: ""
},
{
  Id: "211321",
  DisName: "朝阳县",
  CityID: "2113",
  DisSort: ""
},
{
  Id: "211322",
  DisName: "建平县",
  CityID: "2113",
  DisSort: ""
},
{
  Id: "211324",
  DisName: "喀喇沁左翼蒙古族自治县",
  CityID: "2113",
  DisSort: ""
},
{
  Id: "211381",
  DisName: "北票市",
  CityID: "2113",
  DisSort: ""
},
{
  Id: "211382",
  DisName: "凌源市",
  CityID: "2113",
  DisSort: ""
},
{
  Id: "211383",
  DisName: "其它区",
  CityID: "2113",
  DisSort: ""
},
{
  Id: "211402",
  DisName: "连山区",
  CityID: "2114",
  DisSort: ""
},
{
  Id: "211403",
  DisName: "龙港区",
  CityID: "2114",
  DisSort: ""
},
{
  Id: "211404",
  DisName: "南票区",
  CityID: "2114",
  DisSort: ""
},
{
  Id: "211421",
  DisName: "绥中县",
  CityID: "2114",
  DisSort: ""
},
{
  Id: "211422",
  DisName: "建昌县",
  CityID: "2114",
  DisSort: ""
},
{
  Id: "211481",
  DisName: "兴城市",
  CityID: "2114",
  DisSort: ""
},
{
  Id: "211482",
  DisName: "其它区",
  CityID: "2114",
  DisSort: ""
},
{
  Id: "220102",
  DisName: "南关区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220103",
  DisName: "宽城区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220104",
  DisName: "朝阳区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220105",
  DisName: "二道区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220106",
  DisName: "绿园区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220112",
  DisName: "双阳区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220122",
  DisName: "农安县",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220181",
  DisName: "九台市",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220182",
  DisName: "榆树市",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220183",
  DisName: "德惠市",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220184",
  DisName: "高新技术产业开发区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220185",
  DisName: "汽车产业开发区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220186",
  DisName: "经济技术开发区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220187",
  DisName: "净月旅游开发区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220188",
  DisName: "其它区",
  CityID: "2201",
  DisSort: ""
},
{
  Id: "220202",
  DisName: "昌邑区",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220203",
  DisName: "龙潭区",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220204",
  DisName: "船营区",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220211",
  DisName: "丰满区",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220221",
  DisName: "永吉县",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220281",
  DisName: "蛟河市",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220282",
  DisName: "桦甸市",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220283",
  DisName: "舒兰市",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220284",
  DisName: "磐石市",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220285",
  DisName: "其它区",
  CityID: "2202",
  DisSort: ""
},
{
  Id: "220302",
  DisName: "铁西区",
  CityID: "2203",
  DisSort: ""
},
{
  Id: "220303",
  DisName: "铁东区",
  CityID: "2203",
  DisSort: ""
},
{
  Id: "220322",
  DisName: "梨树县",
  CityID: "2203",
  DisSort: ""
},
{
  Id: "220323",
  DisName: "伊通满族自治县",
  CityID: "2203",
  DisSort: ""
},
{
  Id: "220381",
  DisName: "公主岭市",
  CityID: "2203",
  DisSort: ""
},
{
  Id: "220382",
  DisName: "双辽市",
  CityID: "2203",
  DisSort: ""
},
{
  Id: "220383",
  DisName: "其它区",
  CityID: "2203",
  DisSort: ""
},
{
  Id: "220402",
  DisName: "龙山区",
  CityID: "2204",
  DisSort: ""
},
{
  Id: "220403",
  DisName: "西安区",
  CityID: "2204",
  DisSort: ""
},
{
  Id: "220421",
  DisName: "东丰县",
  CityID: "2204",
  DisSort: ""
},
{
  Id: "220422",
  DisName: "东辽县",
  CityID: "2204",
  DisSort: ""
},
{
  Id: "220423",
  DisName: "其它区",
  CityID: "2204",
  DisSort: ""
},
{
  Id: "220502",
  DisName: "东昌区",
  CityID: "2205",
  DisSort: ""
},
{
  Id: "220503",
  DisName: "二道江区",
  CityID: "2205",
  DisSort: ""
},
{
  Id: "220521",
  DisName: "通化县",
  CityID: "2205",
  DisSort: ""
},
{
  Id: "220523",
  DisName: "辉南县",
  CityID: "2205",
  DisSort: ""
},
{
  Id: "220524",
  DisName: "柳河县",
  CityID: "2205",
  DisSort: ""
},
{
  Id: "220581",
  DisName: "梅河口市",
  CityID: "2205",
  DisSort: ""
},
{
  Id: "220582",
  DisName: "集安市",
  CityID: "2205",
  DisSort: ""
},
{
  Id: "220583",
  DisName: "其它区",
  CityID: "2205",
  DisSort: ""
},
{
  Id: "220602",
  DisName: "八道江区",
  CityID: "2206",
  DisSort: ""
},
{
  Id: "220621",
  DisName: "抚松县",
  CityID: "2206",
  DisSort: ""
},
{
  Id: "220622",
  DisName: "靖宇县",
  CityID: "2206",
  DisSort: ""
},
{
  Id: "220623",
  DisName: "长白朝鲜族自治县",
  CityID: "2206",
  DisSort: ""
},
{
  Id: "220625",
  DisName: "江源县",
  CityID: "2206",
  DisSort: ""
},
{
  Id: "220681",
  DisName: "临江市",
  CityID: "2206",
  DisSort: ""
},
{
  Id: "220682",
  DisName: "其它区",
  CityID: "2206",
  DisSort: ""
},
{
  Id: "220702",
  DisName: "宁江区",
  CityID: "2207",
  DisSort: ""
},
{
  Id: "220721",
  DisName: "前郭尔罗斯蒙古族自治县",
  CityID: "2207",
  DisSort: ""
},
{
  Id: "220722",
  DisName: "长岭县",
  CityID: "2207",
  DisSort: ""
},
{
  Id: "220723",
  DisName: "乾安县",
  CityID: "2207",
  DisSort: ""
},
{
  Id: "220724",
  DisName: "扶余县",
  CityID: "2207",
  DisSort: ""
},
{
  Id: "220725",
  DisName: "其它区",
  CityID: "2207",
  DisSort: ""
},
{
  Id: "220802",
  DisName: "洮北区",
  CityID: "2208",
  DisSort: ""
},
{
  Id: "220821",
  DisName: "镇赉县",
  CityID: "2208",
  DisSort: ""
},
{
  Id: "220822",
  DisName: "通榆县",
  CityID: "2208",
  DisSort: ""
},
{
  Id: "220881",
  DisName: "洮南市",
  CityID: "2208",
  DisSort: ""
},
{
  Id: "220882",
  DisName: "大安市",
  CityID: "2208",
  DisSort: ""
},
{
  Id: "220883",
  DisName: "其它区",
  CityID: "2208",
  DisSort: ""
},
{
  Id: "222401",
  DisName: "延吉市",
  CityID: "2224",
  DisSort: ""
},
{
  Id: "222402",
  DisName: "图们市",
  CityID: "2224",
  DisSort: ""
},
{
  Id: "222403",
  DisName: "敦化市",
  CityID: "2224",
  DisSort: ""
},
{
  Id: "222404",
  DisName: "珲春市",
  CityID: "2224",
  DisSort: ""
},
{
  Id: "222405",
  DisName: "龙井市",
  CityID: "2224",
  DisSort: ""
},
{
  Id: "222406",
  DisName: "和龙市",
  CityID: "2224",
  DisSort: ""
},
{
  Id: "222424",
  DisName: "汪清县",
  CityID: "2224",
  DisSort: ""
},
{
  Id: "222426",
  DisName: "安图县",
  CityID: "2224",
  DisSort: ""
},
{
  Id: "222427",
  DisName: "其它区",
  CityID: "2224",
  DisSort: ""
},
{
  Id: "230102",
  DisName: "道里区",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230103",
  DisName: "南岗区",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230104",
  DisName: "道外区",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230106",
  DisName: "香坊区",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230107",
  DisName: "动力区",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230108",
  DisName: "平房区",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230109",
  DisName: "松北区",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230111",
  DisName: "呼兰区",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230123",
  DisName: "依兰县",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230124",
  DisName: "方正县",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230125",
  DisName: "宾县",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230126",
  DisName: "巴彦县",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230127",
  DisName: "木兰县",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230128",
  DisName: "通河县",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230129",
  DisName: "延寿县",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230181",
  DisName: "阿城市",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230182",
  DisName: "双城市",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230183",
  DisName: "尚志市",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230184",
  DisName: "五常市",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230185",
  DisName: "阿城市",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230186",
  DisName: "其它区",
  CityID: "2301",
  DisSort: ""
},
{
  Id: "230202",
  DisName: "龙沙区",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230203",
  DisName: "建华区",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230204",
  DisName: "铁锋区",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230205",
  DisName: "昂昂溪区",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230206",
  DisName: "富拉尔基区",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230207",
  DisName: "碾子山区",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230208",
  DisName: "梅里斯达斡尔族区",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230221",
  DisName: "龙江县",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230223",
  DisName: "依安县",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230224",
  DisName: "泰来县",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230225",
  DisName: "甘南县",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230227",
  DisName: "富裕县",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230229",
  DisName: "克山县",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230230",
  DisName: "克东县",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230231",
  DisName: "拜泉县",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230281",
  DisName: "讷河市",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230282",
  DisName: "其它区",
  CityID: "2302",
  DisSort: ""
},
{
  Id: "230302",
  DisName: "鸡冠区",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230303",
  DisName: "恒山区",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230304",
  DisName: "滴道区",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230305",
  DisName: "梨树区",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230306",
  DisName: "城子河区",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230307",
  DisName: "麻山区",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230321",
  DisName: "鸡东县",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230381",
  DisName: "虎林市",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230382",
  DisName: "密山市",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230383",
  DisName: "其它区",
  CityID: "2303",
  DisSort: ""
},
{
  Id: "230402",
  DisName: "向阳区",
  CityID: "2304",
  DisSort: ""
},
{
  Id: "230403",
  DisName: "工农区",
  CityID: "2304",
  DisSort: ""
},
{
  Id: "230404",
  DisName: "南山区",
  CityID: "2304",
  DisSort: ""
},
{
  Id: "230405",
  DisName: "兴安区",
  CityID: "2304",
  DisSort: ""
},
{
  Id: "230406",
  DisName: "东山区",
  CityID: "2304",
  DisSort: ""
},
{
  Id: "230407",
  DisName: "兴山区",
  CityID: "2304",
  DisSort: ""
},
{
  Id: "230421",
  DisName: "萝北县",
  CityID: "2304",
  DisSort: ""
},
{
  Id: "230422",
  DisName: "绥滨县",
  CityID: "2304",
  DisSort: ""
},
{
  Id: "230423",
  DisName: "其它区",
  CityID: "2304",
  DisSort: ""
},
{
  Id: "230502",
  DisName: "尖山区",
  CityID: "2305",
  DisSort: ""
},
{
  Id: "230503",
  DisName: "岭东区",
  CityID: "2305",
  DisSort: ""
},
{
  Id: "230505",
  DisName: "四方台区",
  CityID: "2305",
  DisSort: ""
},
{
  Id: "230506",
  DisName: "宝山区",
  CityID: "2305",
  DisSort: ""
},
{
  Id: "230521",
  DisName: "集贤县",
  CityID: "2305",
  DisSort: ""
},
{
  Id: "230522",
  DisName: "友谊县",
  CityID: "2305",
  DisSort: ""
},
{
  Id: "230523",
  DisName: "宝清县",
  CityID: "2305",
  DisSort: ""
},
{
  Id: "230524",
  DisName: "饶河县",
  CityID: "2305",
  DisSort: ""
},
{
  Id: "230525",
  DisName: "其它区",
  CityID: "2305",
  DisSort: ""
},
{
  Id: "230602",
  DisName: "萨尔图区",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230603",
  DisName: "龙凤区",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230604",
  DisName: "让胡路区",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230605",
  DisName: "红岗区",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230606",
  DisName: "大同区",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230621",
  DisName: "肇州县",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230622",
  DisName: "肇源县",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230623",
  DisName: "林甸县",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230624",
  DisName: "杜尔伯特蒙古族自治县",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230625",
  DisName: "其它区",
  CityID: "2306",
  DisSort: ""
},
{
  Id: "230702",
  DisName: "伊春区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230703",
  DisName: "南岔区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230704",
  DisName: "友好区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230705",
  DisName: "西林区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230706",
  DisName: "翠峦区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230707",
  DisName: "新青区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230708",
  DisName: "美溪区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230709",
  DisName: "金山屯区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230710",
  DisName: "五营区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230711",
  DisName: "乌马河区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230712",
  DisName: "汤旺河区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230713",
  DisName: "带岭区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230714",
  DisName: "乌伊岭区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230715",
  DisName: "红星区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230716",
  DisName: "上甘岭区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230722",
  DisName: "嘉荫县",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230781",
  DisName: "铁力市",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230782",
  DisName: "其它区",
  CityID: "2307",
  DisSort: ""
},
{
  Id: "230802",
  DisName: "永红区",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230803",
  DisName: "向阳区",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230804",
  DisName: "前进区",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230805",
  DisName: "东风区",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230811",
  DisName: "郊区",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230822",
  DisName: "桦南县",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230826",
  DisName: "桦川县",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230828",
  DisName: "汤原县",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230833",
  DisName: "抚远县",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230881",
  DisName: "同江市",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230882",
  DisName: "富锦市",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230883",
  DisName: "其它区",
  CityID: "2308",
  DisSort: ""
},
{
  Id: "230902",
  DisName: "新兴区",
  CityID: "2309",
  DisSort: ""
},
{
  Id: "230903",
  DisName: "桃山区",
  CityID: "2309",
  DisSort: ""
},
{
  Id: "230904",
  DisName: "茄子河区",
  CityID: "2309",
  DisSort: ""
},
{
  Id: "230921",
  DisName: "勃利县",
  CityID: "2309",
  DisSort: ""
},
{
  Id: "230922",
  DisName: "其它区",
  CityID: "2309",
  DisSort: ""
},
{
  Id: "231002",
  DisName: "东安区",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231003",
  DisName: "阳明区",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231004",
  DisName: "爱民区",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231005",
  DisName: "西安区",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231024",
  DisName: "东宁县",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231025",
  DisName: "林口县",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231081",
  DisName: "绥芬河市",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231083",
  DisName: "海林市",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231084",
  DisName: "宁安市",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231085",
  DisName: "穆棱市",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231086",
  DisName: "其它区",
  CityID: "2310",
  DisSort: ""
},
{
  Id: "231102",
  DisName: "爱辉区",
  CityID: "2311",
  DisSort: ""
},
{
  Id: "231121",
  DisName: "嫩江县",
  CityID: "2311",
  DisSort: ""
},
{
  Id: "231123",
  DisName: "逊克县",
  CityID: "2311",
  DisSort: ""
},
{
  Id: "231124",
  DisName: "孙吴县",
  CityID: "2311",
  DisSort: ""
},
{
  Id: "231181",
  DisName: "北安市",
  CityID: "2311",
  DisSort: ""
},
{
  Id: "231182",
  DisName: "五大连池市",
  CityID: "2311",
  DisSort: ""
},
{
  Id: "231183",
  DisName: "其它区",
  CityID: "2311",
  DisSort: ""
},
{
  Id: "231202",
  DisName: "北林区",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231221",
  DisName: "望奎县",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231222",
  DisName: "兰西县",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231223",
  DisName: "青冈县",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231224",
  DisName: "庆安县",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231225",
  DisName: "明水县",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231226",
  DisName: "绥棱县",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231281",
  DisName: "安达市",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231282",
  DisName: "肇东市",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231283",
  DisName: "海伦市",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "231284",
  DisName: "其它区",
  CityID: "2312",
  DisSort: ""
},
{
  Id: "232721",
  DisName: "呼玛县",
  CityID: "2327",
  DisSort: ""
},
{
  Id: "232722",
  DisName: "塔河县",
  CityID: "2327",
  DisSort: ""
},
{
  Id: "232723",
  DisName: "漠河县",
  CityID: "2327",
  DisSort: ""
},
{
  Id: "232724",
  DisName: "加格达奇区",
  CityID: "2327",
  DisSort: ""
},
{
  Id: "232725",
  DisName: "其它区",
  CityID: "2327",
  DisSort: ""
},
{
  Id: "310101",
  DisName: "黄浦区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310103",
  DisName: "卢湾区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310104",
  DisName: "徐汇区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310105",
  DisName: "长宁区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310106",
  DisName: "静安区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310107",
  DisName: "普陀区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310108",
  DisName: "闸北区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310109",
  DisName: "虹口区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310110",
  DisName: "杨浦区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310112",
  DisName: "闵行区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310113",
  DisName: "宝山区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310114",
  DisName: "嘉定区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310115",
  DisName: "浦东新区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310116",
  DisName: "金山区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310117",
  DisName: "松江区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310118",
  DisName: "青浦区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310119",
  DisName: "南汇区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310120",
  DisName: "奉贤区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310130",
  DisName: "崇明县",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310131",
  DisName: "其它区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "310152",
  DisName: "川沙区",
  CityID: "3101",
  DisSort: ""
},
{
  Id: "320102",
  DisName: "玄武区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320103",
  DisName: "白下区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320104",
  DisName: "秦淮区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320105",
  DisName: "建邺区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320106",
  DisName: "鼓楼区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320107",
  DisName: "下关区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320111",
  DisName: "浦口区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320113",
  DisName: "栖霞区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320114",
  DisName: "雨花台区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320115",
  DisName: "江宁区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320116",
  DisName: "六合区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320124",
  DisName: "溧水县",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320125",
  DisName: "高淳县",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320126",
  DisName: "其它区",
  CityID: "3201",
  DisSort: ""
},
{
  Id: "320202",
  DisName: "崇安区",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320203",
  DisName: "南长区",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320204",
  DisName: "北塘区",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320205",
  DisName: "锡山区",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320206",
  DisName: "惠山区",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320211",
  DisName: "滨湖区",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320281",
  DisName: "江阴市",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320282",
  DisName: "宜兴市",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320296",
  DisName: "新区",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320297",
  DisName: "其它区",
  CityID: "3202",
  DisSort: ""
},
{
  Id: "320302",
  DisName: "鼓楼区",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320303",
  DisName: "云龙区",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320304",
  DisName: "九里区",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320305",
  DisName: "贾汪区",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320311",
  DisName: "泉山区",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320321",
  DisName: "丰县",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320322",
  DisName: "沛县",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320323",
  DisName: "铜山县",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320324",
  DisName: "睢宁县",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320381",
  DisName: "新沂市",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320382",
  DisName: "邳州市",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320383",
  DisName: "其它区",
  CityID: "3203",
  DisSort: ""
},
{
  Id: "320402",
  DisName: "天宁区",
  CityID: "3204",
  DisSort: ""
},
{
  Id: "320404",
  DisName: "钟楼区",
  CityID: "3204",
  DisSort: ""
},
{
  Id: "320405",
  DisName: "戚墅堰区",
  CityID: "3204",
  DisSort: ""
},
{
  Id: "320411",
  DisName: "新北区",
  CityID: "3204",
  DisSort: ""
},
{
  Id: "320412",
  DisName: "武进区",
  CityID: "3204",
  DisSort: ""
},
{
  Id: "320481",
  DisName: "溧阳市",
  CityID: "3204",
  DisSort: ""
},
{
  Id: "320482",
  DisName: "金坛市",
  CityID: "3204",
  DisSort: ""
},
{
  Id: "320483",
  DisName: "其它区",
  CityID: "3204",
  DisSort: ""
},
{
  Id: "320502",
  DisName: "沧浪区",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320503",
  DisName: "平江区",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320504",
  DisName: "金阊区",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320505",
  DisName: "虎丘区",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320506",
  DisName: "吴中区",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320507",
  DisName: "相城区",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320581",
  DisName: "常熟市",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320582",
  DisName: "张家港市",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320583",
  DisName: "昆山市",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320584",
  DisName: "吴江市",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320585",
  DisName: "太仓市",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320594",
  DisName: "新区",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320595",
  DisName: "园区",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320596",
  DisName: "其它区",
  CityID: "3205",
  DisSort: ""
},
{
  Id: "320602",
  DisName: "崇川区",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320611",
  DisName: "港闸区",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320612",
  DisName: "通州区",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320621",
  DisName: "海安县",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320623",
  DisName: "如东县",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320681",
  DisName: "启东市",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320682",
  DisName: "如皋市",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320683",
  DisName: "通州市",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320684",
  DisName: "海门市",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320693",
  DisName: "开发区",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320694",
  DisName: "其它区",
  CityID: "3206",
  DisSort: ""
},
{
  Id: "320703",
  DisName: "连云区",
  CityID: "3207",
  DisSort: ""
},
{
  Id: "320705",
  DisName: "新浦区",
  CityID: "3207",
  DisSort: ""
},
{
  Id: "320706",
  DisName: "海州区",
  CityID: "3207",
  DisSort: ""
},
{
  Id: "320721",
  DisName: "赣榆县",
  CityID: "3207",
  DisSort: ""
},
{
  Id: "320722",
  DisName: "东海县",
  CityID: "3207",
  DisSort: ""
},
{
  Id: "320723",
  DisName: "灌云县",
  CityID: "3207",
  DisSort: ""
},
{
  Id: "320724",
  DisName: "灌南县",
  CityID: "3207",
  DisSort: ""
},
{
  Id: "320725",
  DisName: "其它区",
  CityID: "3207",
  DisSort: ""
},
{
  Id: "320802",
  DisName: "清河区",
  CityID: "3208",
  DisSort: ""
},
{
  Id: "320803",
  DisName: "楚州区",
  CityID: "3208",
  DisSort: ""
},
{
  Id: "320804",
  DisName: "淮阴区",
  CityID: "3208",
  DisSort: ""
},
{
  Id: "320811",
  DisName: "清浦区",
  CityID: "3208",
  DisSort: ""
},
{
  Id: "320826",
  DisName: "涟水县",
  CityID: "3208",
  DisSort: ""
},
{
  Id: "320829",
  DisName: "洪泽县",
  CityID: "3208",
  DisSort: ""
},
{
  Id: "320830",
  DisName: "盱眙县",
  CityID: "3208",
  DisSort: ""
},
{
  Id: "320831",
  DisName: "金湖县",
  CityID: "3208",
  DisSort: ""
},
{
  Id: "320832",
  DisName: "其它区",
  CityID: "3208",
  DisSort: ""
},
{
  Id: "320902",
  DisName: "亭湖区",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "320903",
  DisName: "盐都区",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "320921",
  DisName: "响水县",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "320922",
  DisName: "滨海县",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "320923",
  DisName: "阜宁县",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "320924",
  DisName: "射阳县",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "320925",
  DisName: "建湖县",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "320981",
  DisName: "东台市",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "320982",
  DisName: "大丰市",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "320983",
  DisName: "其它区",
  CityID: "3209",
  DisSort: ""
},
{
  Id: "321002",
  DisName: "广陵区",
  CityID: "3210",
  DisSort: ""
},
{
  Id: "321003",
  DisName: "邗江区",
  CityID: "3210",
  DisSort: ""
},
{
  Id: "321011",
  DisName: "维扬区",
  CityID: "3210",
  DisSort: ""
},
{
  Id: "321023",
  DisName: "宝应县",
  CityID: "3210",
  DisSort: ""
},
{
  Id: "321081",
  DisName: "仪征市",
  CityID: "3210",
  DisSort: ""
},
{
  Id: "321084",
  DisName: "高邮市",
  CityID: "3210",
  DisSort: ""
},
{
  Id: "321088",
  DisName: "江都市",
  CityID: "3210",
  DisSort: ""
},
{
  Id: "321092",
  DisName: "经济开发区",
  CityID: "3210",
  DisSort: ""
},
{
  Id: "321093",
  DisName: "其它区",
  CityID: "3210",
  DisSort: ""
},
{
  Id: "321102",
  DisName: "京口区",
  CityID: "3211",
  DisSort: ""
},
{
  Id: "321111",
  DisName: "润州区",
  CityID: "3211",
  DisSort: ""
},
{
  Id: "321112",
  DisName: "丹徒区",
  CityID: "3211",
  DisSort: ""
},
{
  Id: "321181",
  DisName: "丹阳市",
  CityID: "3211",
  DisSort: ""
},
{
  Id: "321182",
  DisName: "扬中市",
  CityID: "3211",
  DisSort: ""
},
{
  Id: "321183",
  DisName: "句容市",
  CityID: "3211",
  DisSort: ""
},
{
  Id: "321184",
  DisName: "其它区",
  CityID: "3211",
  DisSort: ""
},
{
  Id: "321202",
  DisName: "海陵区",
  CityID: "3212",
  DisSort: ""
},
{
  Id: "321203",
  DisName: "高港区",
  CityID: "3212",
  DisSort: ""
},
{
  Id: "321281",
  DisName: "兴化市",
  CityID: "3212",
  DisSort: ""
},
{
  Id: "321282",
  DisName: "靖江市",
  CityID: "3212",
  DisSort: ""
},
{
  Id: "321283",
  DisName: "泰兴市",
  CityID: "3212",
  DisSort: ""
},
{
  Id: "321284",
  DisName: "姜堰市",
  CityID: "3212",
  DisSort: ""
},
{
  Id: "321285",
  DisName: "其它区",
  CityID: "3212",
  DisSort: ""
},
{
  Id: "321302",
  DisName: "宿城区",
  CityID: "3213",
  DisSort: ""
},
{
  Id: "321311",
  DisName: "宿豫区",
  CityID: "3213",
  DisSort: ""
},
{
  Id: "321322",
  DisName: "沭阳县",
  CityID: "3213",
  DisSort: ""
},
{
  Id: "321323",
  DisName: "泗阳县",
  CityID: "3213",
  DisSort: ""
},
{
  Id: "321324",
  DisName: "泗洪县",
  CityID: "3213",
  DisSort: ""
},
{
  Id: "321325",
  DisName: "其它区",
  CityID: "3213",
  DisSort: ""
},
{
  Id: "330102",
  DisName: "上城区",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330103",
  DisName: "下城区",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330104",
  DisName: "江干区",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330105",
  DisName: "拱墅区",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330106",
  DisName: "西湖区",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330108",
  DisName: "滨江区",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330109",
  DisName: "萧山区",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330110",
  DisName: "余杭区",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330122",
  DisName: "桐庐县",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330127",
  DisName: "淳安县",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330182",
  DisName: "建德市",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330183",
  DisName: "富阳市",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330185",
  DisName: "临安市",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330186",
  DisName: "其它区",
  CityID: "3301",
  DisSort: ""
},
{
  Id: "330203",
  DisName: "海曙区",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330204",
  DisName: "江东区",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330205",
  DisName: "江北区",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330206",
  DisName: "北仑区",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330211",
  DisName: "镇海区",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330212",
  DisName: "鄞州区",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330225",
  DisName: "象山县",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330226",
  DisName: "宁海县",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330281",
  DisName: "余姚市",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330282",
  DisName: "慈溪市",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330283",
  DisName: "奉化市",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330284",
  DisName: "其它区",
  CityID: "3302",
  DisSort: ""
},
{
  Id: "330302",
  DisName: "鹿城区",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330303",
  DisName: "龙湾区",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330304",
  DisName: "瓯海区",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330322",
  DisName: "洞头县",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330324",
  DisName: "永嘉县",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330326",
  DisName: "平阳县",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330327",
  DisName: "苍南县",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330328",
  DisName: "文成县",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330329",
  DisName: "泰顺县",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330381",
  DisName: "瑞安市",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330382",
  DisName: "乐清市",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330383",
  DisName: "其它区",
  CityID: "3303",
  DisSort: ""
},
{
  Id: "330402",
  DisName: "南湖区",
  CityID: "3304",
  DisSort: ""
},
{
  Id: "330411",
  DisName: "秀洲区",
  CityID: "3304",
  DisSort: ""
},
{
  Id: "330421",
  DisName: "嘉善县",
  CityID: "3304",
  DisSort: ""
},
{
  Id: "330424",
  DisName: "海盐县",
  CityID: "3304",
  DisSort: ""
},
{
  Id: "330481",
  DisName: "海宁市",
  CityID: "3304",
  DisSort: ""
},
{
  Id: "330482",
  DisName: "平湖市",
  CityID: "3304",
  DisSort: ""
},
{
  Id: "330483",
  DisName: "桐乡市",
  CityID: "3304",
  DisSort: ""
},
{
  Id: "330484",
  DisName: "其它区",
  CityID: "3304",
  DisSort: ""
},
{
  Id: "330502",
  DisName: "吴兴区",
  CityID: "3305",
  DisSort: ""
},
{
  Id: "330503",
  DisName: "南浔区",
  CityID: "3305",
  DisSort: ""
},
{
  Id: "330521",
  DisName: "德清县",
  CityID: "3305",
  DisSort: ""
},
{
  Id: "330522",
  DisName: "长兴县",
  CityID: "3305",
  DisSort: ""
},
{
  Id: "330523",
  DisName: "安吉县",
  CityID: "3305",
  DisSort: ""
},
{
  Id: "330524",
  DisName: "其它区",
  CityID: "3305",
  DisSort: ""
},
{
  Id: "330602",
  DisName: "越城区",
  CityID: "3306",
  DisSort: ""
},
{
  Id: "330621",
  DisName: "绍兴县",
  CityID: "3306",
  DisSort: ""
},
{
  Id: "330624",
  DisName: "新昌县",
  CityID: "3306",
  DisSort: ""
},
{
  Id: "330681",
  DisName: "诸暨市",
  CityID: "3306",
  DisSort: ""
},
{
  Id: "330682",
  DisName: "上虞市",
  CityID: "3306",
  DisSort: ""
},
{
  Id: "330683",
  DisName: "嵊州市",
  CityID: "3306",
  DisSort: ""
},
{
  Id: "330684",
  DisName: "其它区",
  CityID: "3306",
  DisSort: ""
},
{
  Id: "330702",
  DisName: "婺城区",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330703",
  DisName: "金东区",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330723",
  DisName: "武义县",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330726",
  DisName: "浦江县",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330727",
  DisName: "磐安县",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330781",
  DisName: "兰溪市",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330782",
  DisName: "义乌市",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330783",
  DisName: "东阳市",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330784",
  DisName: "永康市",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330785",
  DisName: "其它区",
  CityID: "3307",
  DisSort: ""
},
{
  Id: "330802",
  DisName: "柯城区",
  CityID: "3308",
  DisSort: ""
},
{
  Id: "330803",
  DisName: "衢江区",
  CityID: "3308",
  DisSort: ""
},
{
  Id: "330822",
  DisName: "常山县",
  CityID: "3308",
  DisSort: ""
},
{
  Id: "330824",
  DisName: "开化县",
  CityID: "3308",
  DisSort: ""
},
{
  Id: "330825",
  DisName: "龙游县",
  CityID: "3308",
  DisSort: ""
},
{
  Id: "330881",
  DisName: "江山市",
  CityID: "3308",
  DisSort: ""
},
{
  Id: "330882",
  DisName: "其它区",
  CityID: "3308",
  DisSort: ""
},
{
  Id: "330902",
  DisName: "定海区",
  CityID: "3309",
  DisSort: ""
},
{
  Id: "330903",
  DisName: "普陀区",
  CityID: "3309",
  DisSort: ""
},
{
  Id: "330921",
  DisName: "岱山县",
  CityID: "3309",
  DisSort: ""
},
{
  Id: "330922",
  DisName: "嵊泗县",
  CityID: "3309",
  DisSort: ""
},
{
  Id: "330923",
  DisName: "其它区",
  CityID: "3309",
  DisSort: ""
},
{
  Id: "331002",
  DisName: "椒江区",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331003",
  DisName: "黄岩区",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331004",
  DisName: "路桥区",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331021",
  DisName: "玉环县",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331022",
  DisName: "三门县",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331023",
  DisName: "天台县",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331024",
  DisName: "仙居县",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331081",
  DisName: "温岭市",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331082",
  DisName: "临海市",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331083",
  DisName: "其它区",
  CityID: "3310",
  DisSort: ""
},
{
  Id: "331102",
  DisName: "莲都区",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "331121",
  DisName: "青田县",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "331122",
  DisName: "缙云县",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "331123",
  DisName: "遂昌县",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "331124",
  DisName: "松阳县",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "331125",
  DisName: "云和县",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "331126",
  DisName: "庆元县",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "331127",
  DisName: "景宁畲族自治县",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "331181",
  DisName: "龙泉市",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "331182",
  DisName: "其它区",
  CityID: "3311",
  DisSort: ""
},
{
  Id: "340102",
  DisName: "瑶海区",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340103",
  DisName: "庐阳区",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340104",
  DisName: "蜀山区",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340111",
  DisName: "包河区",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340121",
  DisName: "长丰县",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340122",
  DisName: "肥东县",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340123",
  DisName: "肥西县",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340151",
  DisName: "高新区",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340191",
  DisName: "中区",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340192",
  DisName: "其它区",
  CityID: "3401",
  DisSort: ""
},
{
  Id: "340202",
  DisName: "镜湖区",
  CityID: "3402",
  DisSort: ""
},
{
  Id: "340203",
  DisName: "弋江区",
  CityID: "3402",
  DisSort: ""
},
{
  Id: "340207",
  DisName: "鸠江区",
  CityID: "3402",
  DisSort: ""
},
{
  Id: "340208",
  DisName: "三山区",
  CityID: "3402",
  DisSort: ""
},
{
  Id: "340221",
  DisName: "芜湖县",
  CityID: "3402",
  DisSort: ""
},
{
  Id: "340222",
  DisName: "繁昌县",
  CityID: "3402",
  DisSort: ""
},
{
  Id: "340223",
  DisName: "南陵县",
  CityID: "3402",
  DisSort: ""
},
{
  Id: "340224",
  DisName: "其它区",
  CityID: "3402",
  DisSort: ""
},
{
  Id: "340302",
  DisName: "龙子湖区",
  CityID: "3403",
  DisSort: ""
},
{
  Id: "340303",
  DisName: "蚌山区",
  CityID: "3403",
  DisSort: ""
},
{
  Id: "340304",
  DisName: "禹会区",
  CityID: "3403",
  DisSort: ""
},
{
  Id: "340311",
  DisName: "淮上区",
  CityID: "3403",
  DisSort: ""
},
{
  Id: "340321",
  DisName: "怀远县",
  CityID: "3403",
  DisSort: ""
},
{
  Id: "340322",
  DisName: "五河县",
  CityID: "3403",
  DisSort: ""
},
{
  Id: "340323",
  DisName: "固镇县",
  CityID: "3403",
  DisSort: ""
},
{
  Id: "340324",
  DisName: "其它区",
  CityID: "3403",
  DisSort: ""
},
{
  Id: "340402",
  DisName: "大通区",
  CityID: "3404",
  DisSort: ""
},
{
  Id: "340403",
  DisName: "田家庵区",
  CityID: "3404",
  DisSort: ""
},
{
  Id: "340404",
  DisName: "谢家集区",
  CityID: "3404",
  DisSort: ""
},
{
  Id: "340405",
  DisName: "八公山区",
  CityID: "3404",
  DisSort: ""
},
{
  Id: "340406",
  DisName: "潘集区",
  CityID: "3404",
  DisSort: ""
},
{
  Id: "340421",
  DisName: "凤台县",
  CityID: "3404",
  DisSort: ""
},
{
  Id: "340422",
  DisName: "其它区",
  CityID: "3404",
  DisSort: ""
},
{
  Id: "340502",
  DisName: "金家庄区",
  CityID: "3405",
  DisSort: ""
},
{
  Id: "340503",
  DisName: "花山区",
  CityID: "3405",
  DisSort: ""
},
{
  Id: "340504",
  DisName: "雨山区",
  CityID: "3405",
  DisSort: ""
},
{
  Id: "340521",
  DisName: "当涂县",
  CityID: "3405",
  DisSort: ""
},
{
  Id: "340522",
  DisName: "其它区",
  CityID: "3405",
  DisSort: ""
},
{
  Id: "340602",
  DisName: "杜集区",
  CityID: "3406",
  DisSort: ""
},
{
  Id: "340603",
  DisName: "相山区",
  CityID: "3406",
  DisSort: ""
},
{
  Id: "340604",
  DisName: "烈山区",
  CityID: "3406",
  DisSort: ""
},
{
  Id: "340621",
  DisName: "濉溪县",
  CityID: "3406",
  DisSort: ""
},
{
  Id: "340622",
  DisName: "其它区",
  CityID: "3406",
  DisSort: ""
},
{
  Id: "340702",
  DisName: "铜官山区",
  CityID: "3407",
  DisSort: ""
},
{
  Id: "340703",
  DisName: "狮子山区",
  CityID: "3407",
  DisSort: ""
},
{
  Id: "340711",
  DisName: "郊区",
  CityID: "3407",
  DisSort: ""
},
{
  Id: "340721",
  DisName: "铜陵县",
  CityID: "3407",
  DisSort: ""
},
{
  Id: "340722",
  DisName: "其它区",
  CityID: "3407",
  DisSort: ""
},
{
  Id: "340802",
  DisName: "迎江区",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340803",
  DisName: "大观区",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340811",
  DisName: "宜秀区",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340822",
  DisName: "怀宁县",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340823",
  DisName: "枞阳县",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340824",
  DisName: "潜山县",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340825",
  DisName: "太湖县",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340826",
  DisName: "宿松县",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340827",
  DisName: "望江县",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340828",
  DisName: "岳西县",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340881",
  DisName: "桐城市",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "340882",
  DisName: "其它区",
  CityID: "3408",
  DisSort: ""
},
{
  Id: "341002",
  DisName: "屯溪区",
  CityID: "3410",
  DisSort: ""
},
{
  Id: "341003",
  DisName: "黄山区",
  CityID: "3410",
  DisSort: ""
},
{
  Id: "341004",
  DisName: "徽州区",
  CityID: "3410",
  DisSort: ""
},
{
  Id: "341021",
  DisName: "歙县",
  CityID: "3410",
  DisSort: ""
},
{
  Id: "341022",
  DisName: "休宁县",
  CityID: "3410",
  DisSort: ""
},
{
  Id: "341023",
  DisName: "黟县",
  CityID: "3410",
  DisSort: ""
},
{
  Id: "341024",
  DisName: "祁门县",
  CityID: "3410",
  DisSort: ""
},
{
  Id: "341025",
  DisName: "其它区",
  CityID: "3410",
  DisSort: ""
},
{
  Id: "341102",
  DisName: "琅琊区",
  CityID: "3411",
  DisSort: ""
},
{
  Id: "341103",
  DisName: "南谯区",
  CityID: "3411",
  DisSort: ""
},
{
  Id: "341122",
  DisName: "来安县",
  CityID: "3411",
  DisSort: ""
},
{
  Id: "341124",
  DisName: "全椒县",
  CityID: "3411",
  DisSort: ""
},
{
  Id: "341125",
  DisName: "定远县",
  CityID: "3411",
  DisSort: ""
},
{
  Id: "341126",
  DisName: "凤阳县",
  CityID: "3411",
  DisSort: ""
},
{
  Id: "341181",
  DisName: "天长市",
  CityID: "3411",
  DisSort: ""
},
{
  Id: "341182",
  DisName: "明光市",
  CityID: "3411",
  DisSort: ""
},
{
  Id: "341183",
  DisName: "其它区",
  CityID: "3411",
  DisSort: ""
},
{
  Id: "341202",
  DisName: "颍州区",
  CityID: "3412",
  DisSort: ""
},
{
  Id: "341203",
  DisName: "颍东区",
  CityID: "3412",
  DisSort: ""
},
{
  Id: "341204",
  DisName: "颍泉区",
  CityID: "3412",
  DisSort: ""
},
{
  Id: "341221",
  DisName: "临泉县",
  CityID: "3412",
  DisSort: ""
},
{
  Id: "341222",
  DisName: "太和县",
  CityID: "3412",
  DisSort: ""
},
{
  Id: "341225",
  DisName: "阜南县",
  CityID: "3412",
  DisSort: ""
},
{
  Id: "341226",
  DisName: "颍上县",
  CityID: "3412",
  DisSort: ""
},
{
  Id: "341282",
  DisName: "界首市",
  CityID: "3412",
  DisSort: ""
},
{
  Id: "341283",
  DisName: "其它区",
  CityID: "3412",
  DisSort: ""
},
{
  Id: "341302",
  DisName: "埇桥区",
  CityID: "3413",
  DisSort: ""
},
{
  Id: "341321",
  DisName: "砀山县",
  CityID: "3413",
  DisSort: ""
},
{
  Id: "341322",
  DisName: "萧县",
  CityID: "3413",
  DisSort: ""
},
{
  Id: "341323",
  DisName: "灵璧县",
  CityID: "3413",
  DisSort: ""
},
{
  Id: "341324",
  DisName: "泗县",
  CityID: "3413",
  DisSort: ""
},
{
  Id: "341325",
  DisName: "其它区",
  CityID: "3413",
  DisSort: ""
},
{
  Id: "341402",
  DisName: "居巢区",
  CityID: "3414",
  DisSort: ""
},
{
  Id: "341421",
  DisName: "庐江县",
  CityID: "3414",
  DisSort: ""
},
{
  Id: "341422",
  DisName: "无为县",
  CityID: "3414",
  DisSort: ""
},
{
  Id: "341423",
  DisName: "含山县",
  CityID: "3414",
  DisSort: ""
},
{
  Id: "341424",
  DisName: "和县",
  CityID: "3414",
  DisSort: ""
},
{
  Id: "341425",
  DisName: "其它区",
  CityID: "3414",
  DisSort: ""
},
{
  Id: "341502",
  DisName: "金安区",
  CityID: "3415",
  DisSort: ""
},
{
  Id: "341503",
  DisName: "裕安区",
  CityID: "3415",
  DisSort: ""
},
{
  Id: "341521",
  DisName: "寿县",
  CityID: "3415",
  DisSort: ""
},
{
  Id: "341522",
  DisName: "霍邱县",
  CityID: "3415",
  DisSort: ""
},
{
  Id: "341523",
  DisName: "舒城县",
  CityID: "3415",
  DisSort: ""
},
{
  Id: "341524",
  DisName: "金寨县",
  CityID: "3415",
  DisSort: ""
},
{
  Id: "341525",
  DisName: "霍山县",
  CityID: "3415",
  DisSort: ""
},
{
  Id: "341526",
  DisName: "其它区",
  CityID: "3415",
  DisSort: ""
},
{
  Id: "341602",
  DisName: "谯城区",
  CityID: "3416",
  DisSort: ""
},
{
  Id: "341621",
  DisName: "涡阳县",
  CityID: "3416",
  DisSort: ""
},
{
  Id: "341622",
  DisName: "蒙城县",
  CityID: "3416",
  DisSort: ""
},
{
  Id: "341623",
  DisName: "利辛县",
  CityID: "3416",
  DisSort: ""
},
{
  Id: "341624",
  DisName: "其它区",
  CityID: "3416",
  DisSort: ""
},
{
  Id: "341702",
  DisName: "贵池区",
  CityID: "3417",
  DisSort: ""
},
{
  Id: "341721",
  DisName: "东至县",
  CityID: "3417",
  DisSort: ""
},
{
  Id: "341722",
  DisName: "石台县",
  CityID: "3417",
  DisSort: ""
},
{
  Id: "341723",
  DisName: "青阳县",
  CityID: "3417",
  DisSort: ""
},
{
  Id: "341724",
  DisName: "其它区",
  CityID: "3417",
  DisSort: ""
},
{
  Id: "341802",
  DisName: "宣州区",
  CityID: "3418",
  DisSort: ""
},
{
  Id: "341821",
  DisName: "郎溪县",
  CityID: "3418",
  DisSort: ""
},
{
  Id: "341822",
  DisName: "广德县",
  CityID: "3418",
  DisSort: ""
},
{
  Id: "341823",
  DisName: "泾县",
  CityID: "3418",
  DisSort: ""
},
{
  Id: "341824",
  DisName: "绩溪县",
  CityID: "3418",
  DisSort: ""
},
{
  Id: "341825",
  DisName: "旌德县",
  CityID: "3418",
  DisSort: ""
},
{
  Id: "341881",
  DisName: "宁国市",
  CityID: "3418",
  DisSort: ""
},
{
  Id: "341882",
  DisName: "其它区",
  CityID: "3418",
  DisSort: ""
},
{
  Id: "350102",
  DisName: "鼓楼区",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350103",
  DisName: "台江区",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350104",
  DisName: "仓山区",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350105",
  DisName: "马尾区",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350111",
  DisName: "晋安区",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350121",
  DisName: "闽侯县",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350122",
  DisName: "连江县",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350123",
  DisName: "罗源县",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350124",
  DisName: "闽清县",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350125",
  DisName: "永泰县",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350128",
  DisName: "平潭县",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350181",
  DisName: "福清市",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350182",
  DisName: "长乐市",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350183",
  DisName: "其它区",
  CityID: "3501",
  DisSort: ""
},
{
  Id: "350203",
  DisName: "思明区",
  CityID: "3502",
  DisSort: ""
},
{
  Id: "350205",
  DisName: "海沧区",
  CityID: "3502",
  DisSort: ""
},
{
  Id: "350206",
  DisName: "湖里区",
  CityID: "3502",
  DisSort: ""
},
{
  Id: "350211",
  DisName: "集美区",
  CityID: "3502",
  DisSort: ""
},
{
  Id: "350212",
  DisName: "同安区",
  CityID: "3502",
  DisSort: ""
},
{
  Id: "350213",
  DisName: "翔安区",
  CityID: "3502",
  DisSort: ""
},
{
  Id: "350214",
  DisName: "其它区",
  CityID: "3502",
  DisSort: ""
},
{
  Id: "350302",
  DisName: "城厢区",
  CityID: "3503",
  DisSort: ""
},
{
  Id: "350303",
  DisName: "涵江区",
  CityID: "3503",
  DisSort: ""
},
{
  Id: "350304",
  DisName: "荔城区",
  CityID: "3503",
  DisSort: ""
},
{
  Id: "350305",
  DisName: "秀屿区",
  CityID: "3503",
  DisSort: ""
},
{
  Id: "350322",
  DisName: "仙游县",
  CityID: "3503",
  DisSort: ""
},
{
  Id: "350323",
  DisName: "其它区",
  CityID: "3503",
  DisSort: ""
},
{
  Id: "350402",
  DisName: "梅列区",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350403",
  DisName: "三元区",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350421",
  DisName: "明溪县",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350423",
  DisName: "清流县",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350424",
  DisName: "宁化县",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350425",
  DisName: "大田县",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350426",
  DisName: "尤溪县",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350427",
  DisName: "沙县",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350428",
  DisName: "将乐县",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350429",
  DisName: "泰宁县",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350430",
  DisName: "建宁县",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350481",
  DisName: "永安市",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350482",
  DisName: "其它区",
  CityID: "3504",
  DisSort: ""
},
{
  Id: "350502",
  DisName: "鲤城区",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350503",
  DisName: "丰泽区",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350504",
  DisName: "洛江区",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350505",
  DisName: "泉港区",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350521",
  DisName: "惠安县",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350524",
  DisName: "安溪县",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350525",
  DisName: "永春县",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350526",
  DisName: "德化县",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350527",
  DisName: "金门县",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350581",
  DisName: "石狮市",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350582",
  DisName: "晋江市",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350583",
  DisName: "南安市",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350584",
  DisName: "其它区",
  CityID: "3505",
  DisSort: ""
},
{
  Id: "350602",
  DisName: "芗城区",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350603",
  DisName: "龙文区",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350622",
  DisName: "云霄县",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350623",
  DisName: "漳浦县",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350624",
  DisName: "诏安县",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350625",
  DisName: "长泰县",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350626",
  DisName: "东山县",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350627",
  DisName: "南靖县",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350628",
  DisName: "平和县",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350629",
  DisName: "华安县",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350681",
  DisName: "龙海市",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350682",
  DisName: "其它区",
  CityID: "3506",
  DisSort: ""
},
{
  Id: "350702",
  DisName: "延平区",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350721",
  DisName: "顺昌县",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350722",
  DisName: "浦城县",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350723",
  DisName: "光泽县",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350724",
  DisName: "松溪县",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350725",
  DisName: "政和县",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350781",
  DisName: "邵武市",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350782",
  DisName: "武夷山市",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350783",
  DisName: "建瓯市",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350784",
  DisName: "建阳市",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350785",
  DisName: "其它区",
  CityID: "3507",
  DisSort: ""
},
{
  Id: "350802",
  DisName: "新罗区",
  CityID: "3508",
  DisSort: ""
},
{
  Id: "350821",
  DisName: "长汀县",
  CityID: "3508",
  DisSort: ""
},
{
  Id: "350822",
  DisName: "永定县",
  CityID: "3508",
  DisSort: ""
},
{
  Id: "350823",
  DisName: "上杭县",
  CityID: "3508",
  DisSort: ""
},
{
  Id: "350824",
  DisName: "武平县",
  CityID: "3508",
  DisSort: ""
},
{
  Id: "350825",
  DisName: "连城县",
  CityID: "3508",
  DisSort: ""
},
{
  Id: "350881",
  DisName: "漳平市",
  CityID: "3508",
  DisSort: ""
},
{
  Id: "350882",
  DisName: "其它区",
  CityID: "3508",
  DisSort: ""
},
{
  Id: "350902",
  DisName: "蕉城区",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "350921",
  DisName: "霞浦县",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "350922",
  DisName: "古田县",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "350923",
  DisName: "屏南县",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "350924",
  DisName: "寿宁县",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "350925",
  DisName: "周宁县",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "350926",
  DisName: "柘荣县",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "350981",
  DisName: "福安市",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "350982",
  DisName: "福鼎市",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "350983",
  DisName: "其它区",
  CityID: "3509",
  DisSort: ""
},
{
  Id: "360102",
  DisName: "东湖区",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360103",
  DisName: "西湖区",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360104",
  DisName: "青云谱区",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360105",
  DisName: "湾里区",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360111",
  DisName: "青山湖区",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360121",
  DisName: "南昌县",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360122",
  DisName: "新建县",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360123",
  DisName: "安义县",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360124",
  DisName: "进贤县",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360125",
  DisName: "红谷滩新区",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360126",
  DisName: "经济技术开发区",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360127",
  DisName: "昌北区",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360128",
  DisName: "其它区",
  CityID: "3601",
  DisSort: ""
},
{
  Id: "360202",
  DisName: "昌江区",
  CityID: "3602",
  DisSort: ""
},
{
  Id: "360203",
  DisName: "珠山区",
  CityID: "3602",
  DisSort: ""
},
{
  Id: "360222",
  DisName: "浮梁县",
  CityID: "3602",
  DisSort: ""
},
{
  Id: "360281",
  DisName: "乐平市",
  CityID: "3602",
  DisSort: ""
},
{
  Id: "360282",
  DisName: "其它区",
  CityID: "3602",
  DisSort: ""
},
{
  Id: "360302",
  DisName: "安源区",
  CityID: "3603",
  DisSort: ""
},
{
  Id: "360313",
  DisName: "湘东区",
  CityID: "3603",
  DisSort: ""
},
{
  Id: "360321",
  DisName: "莲花县",
  CityID: "3603",
  DisSort: ""
},
{
  Id: "360322",
  DisName: "上栗县",
  CityID: "3603",
  DisSort: ""
},
{
  Id: "360323",
  DisName: "芦溪县",
  CityID: "3603",
  DisSort: ""
},
{
  Id: "360324",
  DisName: "其它区",
  CityID: "3603",
  DisSort: ""
},
{
  Id: "360402",
  DisName: "庐山区",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360403",
  DisName: "浔阳区",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360421",
  DisName: "九江县",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360423",
  DisName: "武宁县",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360424",
  DisName: "修水县",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360425",
  DisName: "永修县",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360426",
  DisName: "德安县",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360427",
  DisName: "星子县",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360428",
  DisName: "都昌县",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360429",
  DisName: "湖口县",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360430",
  DisName: "彭泽县",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360481",
  DisName: "瑞昌市",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360482",
  DisName: "其它区",
  CityID: "3604",
  DisSort: ""
},
{
  Id: "360502",
  DisName: "渝水区",
  CityID: "3605",
  DisSort: ""
},
{
  Id: "360521",
  DisName: "分宜县",
  CityID: "3605",
  DisSort: ""
},
{
  Id: "360522",
  DisName: "其它区",
  CityID: "3605",
  DisSort: ""
},
{
  Id: "360602",
  DisName: "月湖区",
  CityID: "3606",
  DisSort: ""
},
{
  Id: "360622",
  DisName: "余江县",
  CityID: "3606",
  DisSort: ""
},
{
  Id: "360681",
  DisName: "贵溪市",
  CityID: "3606",
  DisSort: ""
},
{
  Id: "360682",
  DisName: "其它区",
  CityID: "3606",
  DisSort: ""
},
{
  Id: "360702",
  DisName: "章贡区",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360721",
  DisName: "赣县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360722",
  DisName: "信丰县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360723",
  DisName: "大余县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360724",
  DisName: "上犹县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360725",
  DisName: "崇义县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360726",
  DisName: "安远县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360727",
  DisName: "龙南县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360728",
  DisName: "定南县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360729",
  DisName: "全南县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360730",
  DisName: "宁都县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360731",
  DisName: "于都县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360732",
  DisName: "兴国县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360733",
  DisName: "会昌县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360734",
  DisName: "寻乌县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360735",
  DisName: "石城县",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360751",
  DisName: "黄金区",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360781",
  DisName: "瑞金市",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360782",
  DisName: "南康市",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360783",
  DisName: "其它区",
  CityID: "3607",
  DisSort: ""
},
{
  Id: "360802",
  DisName: "吉州区",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360803",
  DisName: "青原区",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360821",
  DisName: "吉安县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360822",
  DisName: "吉水县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360823",
  DisName: "峡江县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360824",
  DisName: "新干县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360825",
  DisName: "永丰县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360826",
  DisName: "泰和县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360827",
  DisName: "遂川县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360828",
  DisName: "万安县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360829",
  DisName: "安福县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360830",
  DisName: "永新县",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360881",
  DisName: "井冈山市",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360882",
  DisName: "其它区",
  CityID: "3608",
  DisSort: ""
},
{
  Id: "360902",
  DisName: "袁州区",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360921",
  DisName: "奉新县",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360922",
  DisName: "万载县",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360923",
  DisName: "上高县",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360924",
  DisName: "宜丰县",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360925",
  DisName: "靖安县",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360926",
  DisName: "铜鼓县",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360981",
  DisName: "丰城市",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360982",
  DisName: "樟树市",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360983",
  DisName: "高安市",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "360984",
  DisName: "其它区",
  CityID: "3609",
  DisSort: ""
},
{
  Id: "361002",
  DisName: "临川区",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361021",
  DisName: "南城县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361022",
  DisName: "黎川县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361023",
  DisName: "南丰县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361024",
  DisName: "崇仁县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361025",
  DisName: "乐安县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361026",
  DisName: "宜黄县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361027",
  DisName: "金溪县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361028",
  DisName: "资溪县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361029",
  DisName: "东乡县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361030",
  DisName: "广昌县",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361031",
  DisName: "其它区",
  CityID: "3610",
  DisSort: ""
},
{
  Id: "361102",
  DisName: "信州区",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361121",
  DisName: "上饶县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361122",
  DisName: "广丰县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361123",
  DisName: "玉山县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361124",
  DisName: "铅山县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361125",
  DisName: "横峰县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361126",
  DisName: "弋阳县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361127",
  DisName: "余干县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361128",
  DisName: "鄱阳县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361129",
  DisName: "万年县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361130",
  DisName: "婺源县",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361181",
  DisName: "德兴市",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "361182",
  DisName: "其它区",
  CityID: "3611",
  DisSort: ""
},
{
  Id: "370102",
  DisName: "历下区",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370103",
  DisName: "市中区",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370104",
  DisName: "槐荫区",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370105",
  DisName: "天桥区",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370112",
  DisName: "历城区",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370113",
  DisName: "长清区",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370124",
  DisName: "平阴县",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370125",
  DisName: "济阳县",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370126",
  DisName: "商河县",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370181",
  DisName: "章丘市",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370182",
  DisName: "其它区",
  CityID: "3701",
  DisSort: ""
},
{
  Id: "370202",
  DisName: "市南区",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370203",
  DisName: "市北区",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370205",
  DisName: "四方区",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370211",
  DisName: "黄岛区",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370212",
  DisName: "崂山区",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370213",
  DisName: "李沧区",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370214",
  DisName: "城阳区",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370251",
  DisName: "开发区",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370281",
  DisName: "胶州市",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370282",
  DisName: "即墨市",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370283",
  DisName: "平度市",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370284",
  DisName: "胶南市",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370285",
  DisName: "莱西市",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370286",
  DisName: "其它区",
  CityID: "3702",
  DisSort: ""
},
{
  Id: "370302",
  DisName: "淄川区",
  CityID: "3703",
  DisSort: ""
},
{
  Id: "370303",
  DisName: "张店区",
  CityID: "3703",
  DisSort: ""
},
{
  Id: "370304",
  DisName: "博山区",
  CityID: "3703",
  DisSort: ""
},
{
  Id: "370305",
  DisName: "临淄区",
  CityID: "3703",
  DisSort: ""
},
{
  Id: "370306",
  DisName: "周村区",
  CityID: "3703",
  DisSort: ""
},
{
  Id: "370321",
  DisName: "桓台县",
  CityID: "3703",
  DisSort: ""
},
{
  Id: "370322",
  DisName: "高青县",
  CityID: "3703",
  DisSort: ""
},
{
  Id: "370323",
  DisName: "沂源县",
  CityID: "3703",
  DisSort: ""
},
{
  Id: "370324",
  DisName: "其它区",
  CityID: "3703",
  DisSort: ""
},
{
  Id: "370402",
  DisName: "市中区",
  CityID: "3704",
  DisSort: ""
},
{
  Id: "370403",
  DisName: "薛城区",
  CityID: "3704",
  DisSort: ""
},
{
  Id: "370404",
  DisName: "峄城区",
  CityID: "3704",
  DisSort: ""
},
{
  Id: "370405",
  DisName: "台儿庄区",
  CityID: "3704",
  DisSort: ""
},
{
  Id: "370406",
  DisName: "山亭区",
  CityID: "3704",
  DisSort: ""
},
{
  Id: "370481",
  DisName: "滕州市",
  CityID: "3704",
  DisSort: ""
},
{
  Id: "370482",
  DisName: "其它区",
  CityID: "3704",
  DisSort: ""
},
{
  Id: "370502",
  DisName: "东营区",
  CityID: "3705",
  DisSort: ""
},
{
  Id: "370503",
  DisName: "河口区",
  CityID: "3705",
  DisSort: ""
},
{
  Id: "370521",
  DisName: "垦利县",
  CityID: "3705",
  DisSort: ""
},
{
  Id: "370522",
  DisName: "利津县",
  CityID: "3705",
  DisSort: ""
},
{
  Id: "370523",
  DisName: "广饶县",
  CityID: "3705",
  DisSort: ""
},
{
  Id: "370589",
  DisName: "西城区",
  CityID: "3705",
  DisSort: ""
},
{
  Id: "370590",
  DisName: "东城区",
  CityID: "3705",
  DisSort: ""
},
{
  Id: "370591",
  DisName: "其它区",
  CityID: "3705",
  DisSort: ""
},
{
  Id: "370602",
  DisName: "芝罘区",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370611",
  DisName: "福山区",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370612",
  DisName: "牟平区",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370613",
  DisName: "莱山区",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370634",
  DisName: "长岛县",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370681",
  DisName: "龙口市",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370682",
  DisName: "莱阳市",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370683",
  DisName: "莱州市",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370684",
  DisName: "蓬莱市",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370685",
  DisName: "招远市",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370686",
  DisName: "栖霞市",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370687",
  DisName: "海阳市",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370688",
  DisName: "其它区",
  CityID: "3706",
  DisSort: ""
},
{
  Id: "370702",
  DisName: "潍城区",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370703",
  DisName: "寒亭区",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370704",
  DisName: "坊子区",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370705",
  DisName: "奎文区",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370724",
  DisName: "临朐县",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370725",
  DisName: "昌乐县",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370751",
  DisName: "开发区",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370781",
  DisName: "青州市",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370782",
  DisName: "诸城市",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370783",
  DisName: "寿光市",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370784",
  DisName: "安丘市",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370785",
  DisName: "高密市",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370786",
  DisName: "昌邑市",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370787",
  DisName: "其它区",
  CityID: "3707",
  DisSort: ""
},
{
  Id: "370802",
  DisName: "市中区",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370811",
  DisName: "任城区",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370826",
  DisName: "微山县",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370827",
  DisName: "鱼台县",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370828",
  DisName: "金乡县",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370829",
  DisName: "嘉祥县",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370830",
  DisName: "汶上县",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370831",
  DisName: "泗水县",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370832",
  DisName: "梁山县",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370881",
  DisName: "曲阜市",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370882",
  DisName: "兖州市",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370883",
  DisName: "邹城市",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370884",
  DisName: "其它区",
  CityID: "3708",
  DisSort: ""
},
{
  Id: "370902",
  DisName: "泰山区",
  CityID: "3709",
  DisSort: ""
},
{
  Id: "370903",
  DisName: "岱岳区",
  CityID: "3709",
  DisSort: ""
},
{
  Id: "370921",
  DisName: "宁阳县",
  CityID: "3709",
  DisSort: ""
},
{
  Id: "370923",
  DisName: "东平县",
  CityID: "3709",
  DisSort: ""
},
{
  Id: "370982",
  DisName: "新泰市",
  CityID: "3709",
  DisSort: ""
},
{
  Id: "370983",
  DisName: "肥城市",
  CityID: "3709",
  DisSort: ""
},
{
  Id: "370984",
  DisName: "其它区",
  CityID: "3709",
  DisSort: ""
},
{
  Id: "371002",
  DisName: "环翠区",
  CityID: "3710",
  DisSort: ""
},
{
  Id: "371081",
  DisName: "文登市",
  CityID: "3710",
  DisSort: ""
},
{
  Id: "371082",
  DisName: "荣成市",
  CityID: "3710",
  DisSort: ""
},
{
  Id: "371083",
  DisName: "乳山市",
  CityID: "3710",
  DisSort: ""
},
{
  Id: "371084",
  DisName: "其它区",
  CityID: "3710",
  DisSort: ""
},
{
  Id: "371102",
  DisName: "东港区",
  CityID: "3711",
  DisSort: ""
},
{
  Id: "371103",
  DisName: "岚山区",
  CityID: "3711",
  DisSort: ""
},
{
  Id: "371121",
  DisName: "五莲县",
  CityID: "3711",
  DisSort: ""
},
{
  Id: "371122",
  DisName: "莒县",
  CityID: "3711",
  DisSort: ""
},
{
  Id: "371123",
  DisName: "其它区",
  CityID: "3711",
  DisSort: ""
},
{
  Id: "371202",
  DisName: "莱城区",
  CityID: "3712",
  DisSort: ""
},
{
  Id: "371203",
  DisName: "钢城区",
  CityID: "3712",
  DisSort: ""
},
{
  Id: "371204",
  DisName: "其它区",
  CityID: "3712",
  DisSort: ""
},
{
  Id: "371302",
  DisName: "兰山区",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371311",
  DisName: "罗庄区",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371312",
  DisName: "河东区",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371321",
  DisName: "沂南县",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371322",
  DisName: "郯城县",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371323",
  DisName: "沂水县",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371324",
  DisName: "苍山县",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371325",
  DisName: "费县",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371326",
  DisName: "平邑县",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371327",
  DisName: "莒南县",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371328",
  DisName: "蒙阴县",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371329",
  DisName: "临沭县",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371330",
  DisName: "其它区",
  CityID: "3713",
  DisSort: ""
},
{
  Id: "371402",
  DisName: "德城区",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371421",
  DisName: "陵县",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371422",
  DisName: "宁津县",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371423",
  DisName: "庆云县",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371424",
  DisName: "临邑县",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371425",
  DisName: "齐河县",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371426",
  DisName: "平原县",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371427",
  DisName: "夏津县",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371428",
  DisName: "武城县",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371451",
  DisName: "开发区",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371481",
  DisName: "乐陵市",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371482",
  DisName: "禹城市",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371483",
  DisName: "其它区",
  CityID: "3714",
  DisSort: ""
},
{
  Id: "371502",
  DisName: "东昌府区",
  CityID: "3715",
  DisSort: ""
},
{
  Id: "371521",
  DisName: "阳谷县",
  CityID: "3715",
  DisSort: ""
},
{
  Id: "371522",
  DisName: "莘县",
  CityID: "3715",
  DisSort: ""
},
{
  Id: "371523",
  DisName: "茌平县",
  CityID: "3715",
  DisSort: ""
},
{
  Id: "371524",
  DisName: "东阿县",
  CityID: "3715",
  DisSort: ""
},
{
  Id: "371525",
  DisName: "冠县",
  CityID: "3715",
  DisSort: ""
},
{
  Id: "371526",
  DisName: "高唐县",
  CityID: "3715",
  DisSort: ""
},
{
  Id: "371581",
  DisName: "临清市",
  CityID: "3715",
  DisSort: ""
},
{
  Id: "371582",
  DisName: "其它区",
  CityID: "3715",
  DisSort: ""
},
{
  Id: "371602",
  DisName: "滨城区",
  CityID: "3716",
  DisSort: ""
},
{
  Id: "371621",
  DisName: "惠民县",
  CityID: "3716",
  DisSort: ""
},
{
  Id: "371622",
  DisName: "阳信县",
  CityID: "3716",
  DisSort: ""
},
{
  Id: "371623",
  DisName: "无棣县",
  CityID: "3716",
  DisSort: ""
},
{
  Id: "371624",
  DisName: "沾化县",
  CityID: "3716",
  DisSort: ""
},
{
  Id: "371625",
  DisName: "博兴县",
  CityID: "3716",
  DisSort: ""
},
{
  Id: "371626",
  DisName: "邹平县",
  CityID: "3716",
  DisSort: ""
},
{
  Id: "371627",
  DisName: "其它区",
  CityID: "3716",
  DisSort: ""
},
{
  Id: "371702",
  DisName: "牡丹区",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "371721",
  DisName: "曹县",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "371722",
  DisName: "单县",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "371723",
  DisName: "成武县",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "371724",
  DisName: "巨野县",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "371725",
  DisName: "郓城县",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "371726",
  DisName: "鄄城县",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "371727",
  DisName: "定陶县",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "371728",
  DisName: "东明县",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "371729",
  DisName: "其它区",
  CityID: "3717",
  DisSort: ""
},
{
  Id: "410102",
  DisName: "中原区",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410103",
  DisName: "二七区",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410104",
  DisName: "管城回族区",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410105",
  DisName: "金水区",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410106",
  DisName: "上街区",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410108",
  DisName: "惠济区",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410122",
  DisName: "中牟县",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410181",
  DisName: "巩义市",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410182",
  DisName: "荥阳市",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410183",
  DisName: "新密市",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410184",
  DisName: "新郑市",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410185",
  DisName: "登封市",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410186",
  DisName: "郑东新区",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410187",
  DisName: "高新区",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410188",
  DisName: "其它区",
  CityID: "4101",
  DisSort: ""
},
{
  Id: "410202",
  DisName: "龙亭区",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410203",
  DisName: "顺河回族区",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410204",
  DisName: "鼓楼区",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410205",
  DisName: "禹王台区",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410211",
  DisName: "金明区",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410221",
  DisName: "杞县",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410222",
  DisName: "通许县",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410223",
  DisName: "尉氏县",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410224",
  DisName: "开封县",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410225",
  DisName: "兰考县",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410226",
  DisName: "其它区",
  CityID: "4102",
  DisSort: ""
},
{
  Id: "410302",
  DisName: "老城区",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410303",
  DisName: "西工区",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410304",
  DisName: "廛河回族区",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410305",
  DisName: "涧西区",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410306",
  DisName: "吉利区",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410307",
  DisName: "洛龙区",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410322",
  DisName: "孟津县",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410323",
  DisName: "新安县",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410324",
  DisName: "栾川县",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410325",
  DisName: "嵩县",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410326",
  DisName: "汝阳县",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410327",
  DisName: "宜阳县",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410328",
  DisName: "洛宁县",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410329",
  DisName: "伊川县",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410381",
  DisName: "偃师市",
  CityID: "4103",
  DisSort: ""
},
{
  Id: "410402",
  DisName: "新华区",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410403",
  DisName: "卫东区",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410404",
  DisName: "石龙区",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410411",
  DisName: "湛河区",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410421",
  DisName: "宝丰县",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410422",
  DisName: "叶县",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410423",
  DisName: "鲁山县",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410425",
  DisName: "郏县",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410481",
  DisName: "舞钢市",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410482",
  DisName: "汝州市",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410483",
  DisName: "其它区",
  CityID: "4104",
  DisSort: ""
},
{
  Id: "410502",
  DisName: "文峰区",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410503",
  DisName: "北关区",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410505",
  DisName: "殷都区",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410506",
  DisName: "龙安区",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410522",
  DisName: "安阳县",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410523",
  DisName: "汤阴县",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410526",
  DisName: "滑县",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410527",
  DisName: "内黄县",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410581",
  DisName: "林州市",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410582",
  DisName: "其它区",
  CityID: "4105",
  DisSort: ""
},
{
  Id: "410602",
  DisName: "鹤山区",
  CityID: "4106",
  DisSort: ""
},
{
  Id: "410603",
  DisName: "山城区",
  CityID: "4106",
  DisSort: ""
},
{
  Id: "410611",
  DisName: "淇滨区",
  CityID: "4106",
  DisSort: ""
},
{
  Id: "410621",
  DisName: "浚县",
  CityID: "4106",
  DisSort: ""
},
{
  Id: "410622",
  DisName: "淇县",
  CityID: "4106",
  DisSort: ""
},
{
  Id: "410623",
  DisName: "其它区",
  CityID: "4106",
  DisSort: ""
},
{
  Id: "410702",
  DisName: "红旗区",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410703",
  DisName: "卫滨区",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410704",
  DisName: "凤泉区",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410711",
  DisName: "牧野区",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410721",
  DisName: "新乡县",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410724",
  DisName: "获嘉县",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410725",
  DisName: "原阳县",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410726",
  DisName: "延津县",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410727",
  DisName: "封丘县",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410728",
  DisName: "长垣县",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410781",
  DisName: "卫辉市",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410782",
  DisName: "辉县市",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410783",
  DisName: "其它区",
  CityID: "4107",
  DisSort: ""
},
{
  Id: "410802",
  DisName: "解放区",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410803",
  DisName: "中站区",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410804",
  DisName: "马村区",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410811",
  DisName: "山阳区",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410821",
  DisName: "修武县",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410822",
  DisName: "博爱县",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410823",
  DisName: "武陟县",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410825",
  DisName: "温县",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410881",
  DisName: "济源市",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410882",
  DisName: "沁阳市",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410883",
  DisName: "孟州市",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410884",
  DisName: "其它区",
  CityID: "4108",
  DisSort: ""
},
{
  Id: "410902",
  DisName: "华龙区",
  CityID: "4109",
  DisSort: ""
},
{
  Id: "410922",
  DisName: "清丰县",
  CityID: "4109",
  DisSort: ""
},
{
  Id: "410923",
  DisName: "南乐县",
  CityID: "4109",
  DisSort: ""
},
{
  Id: "410926",
  DisName: "范县",
  CityID: "4109",
  DisSort: ""
},
{
  Id: "410927",
  DisName: "台前县",
  CityID: "4109",
  DisSort: ""
},
{
  Id: "410928",
  DisName: "濮阳县",
  CityID: "4109",
  DisSort: ""
},
{
  Id: "410929",
  DisName: "其它区",
  CityID: "4109",
  DisSort: ""
},
{
  Id: "411002",
  DisName: "魏都区",
  CityID: "4110",
  DisSort: ""
},
{
  Id: "411023",
  DisName: "许昌县",
  CityID: "4110",
  DisSort: ""
},
{
  Id: "411024",
  DisName: "鄢陵县",
  CityID: "4110",
  DisSort: ""
},
{
  Id: "411025",
  DisName: "襄城县",
  CityID: "4110",
  DisSort: ""
},
{
  Id: "411081",
  DisName: "禹州市",
  CityID: "4110",
  DisSort: ""
},
{
  Id: "411082",
  DisName: "长葛市",
  CityID: "4110",
  DisSort: ""
},
{
  Id: "411083",
  DisName: "其它区",
  CityID: "4110",
  DisSort: ""
},
{
  Id: "411102",
  DisName: "源汇区",
  CityID: "4111",
  DisSort: ""
},
{
  Id: "411103",
  DisName: "郾城区",
  CityID: "4111",
  DisSort: ""
},
{
  Id: "411104",
  DisName: "召陵区",
  CityID: "4111",
  DisSort: ""
},
{
  Id: "411121",
  DisName: "舞阳县",
  CityID: "4111",
  DisSort: ""
},
{
  Id: "411122",
  DisName: "临颍县",
  CityID: "4111",
  DisSort: ""
},
{
  Id: "411123",
  DisName: "其它区",
  CityID: "4111",
  DisSort: ""
},
{
  Id: "411202",
  DisName: "湖滨区",
  CityID: "4112",
  DisSort: ""
},
{
  Id: "411221",
  DisName: "渑池县",
  CityID: "4112",
  DisSort: ""
},
{
  Id: "411222",
  DisName: "陕县",
  CityID: "4112",
  DisSort: ""
},
{
  Id: "411224",
  DisName: "卢氏县",
  CityID: "4112",
  DisSort: ""
},
{
  Id: "411281",
  DisName: "义马市",
  CityID: "4112",
  DisSort: ""
},
{
  Id: "411282",
  DisName: "灵宝市",
  CityID: "4112",
  DisSort: ""
},
{
  Id: "411283",
  DisName: "其它区",
  CityID: "4112",
  DisSort: ""
},
{
  Id: "411302",
  DisName: "宛城区",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411303",
  DisName: "卧龙区",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411321",
  DisName: "南召县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411322",
  DisName: "方城县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411323",
  DisName: "西峡县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411324",
  DisName: "镇平县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411325",
  DisName: "内乡县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411326",
  DisName: "淅川县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411327",
  DisName: "社旗县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411328",
  DisName: "唐河县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411329",
  DisName: "新野县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411330",
  DisName: "桐柏县",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411381",
  DisName: "邓州市",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411382",
  DisName: "其它区",
  CityID: "4113",
  DisSort: ""
},
{
  Id: "411402",
  DisName: "梁园区",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411403",
  DisName: "睢阳区",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411421",
  DisName: "民权县",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411422",
  DisName: "睢县",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411423",
  DisName: "宁陵县",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411424",
  DisName: "柘城县",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411425",
  DisName: "虞城县",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411426",
  DisName: "夏邑县",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411481",
  DisName: "永城市",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411482",
  DisName: "其它区",
  CityID: "4114",
  DisSort: ""
},
{
  Id: "411502",
  DisName: "浉河区",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411503",
  DisName: "平桥区",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411521",
  DisName: "罗山县",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411522",
  DisName: "光山县",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411523",
  DisName: "新县",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411524",
  DisName: "商城县",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411525",
  DisName: "固始县",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411526",
  DisName: "潢川县",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411527",
  DisName: "淮滨县",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411528",
  DisName: "息县",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411529",
  DisName: "其它区",
  CityID: "4115",
  DisSort: ""
},
{
  Id: "411602",
  DisName: "川汇区",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411621",
  DisName: "扶沟县",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411622",
  DisName: "西华县",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411623",
  DisName: "商水县",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411624",
  DisName: "沈丘县",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411625",
  DisName: "郸城县",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411626",
  DisName: "淮阳县",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411627",
  DisName: "太康县",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411628",
  DisName: "鹿邑县",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411681",
  DisName: "项城市",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411682",
  DisName: "其它区",
  CityID: "4116",
  DisSort: ""
},
{
  Id: "411702",
  DisName: "驿城区",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411721",
  DisName: "西平县",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411722",
  DisName: "上蔡县",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411723",
  DisName: "平舆县",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411724",
  DisName: "正阳县",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411725",
  DisName: "确山县",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411726",
  DisName: "泌阳县",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411727",
  DisName: "汝南县",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411728",
  DisName: "遂平县",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411729",
  DisName: "新蔡县",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "411730",
  DisName: "其它区",
  CityID: "4117",
  DisSort: ""
},
{
  Id: "420102",
  DisName: "江岸区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420103",
  DisName: "江汉区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420104",
  DisName: "硚口区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420105",
  DisName: "汉阳区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420106",
  DisName: "武昌区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420107",
  DisName: "青山区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420111",
  DisName: "洪山区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420112",
  DisName: "东西湖区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420113",
  DisName: "汉南区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420114",
  DisName: "蔡甸区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420115",
  DisName: "江夏区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420116",
  DisName: "黄陂区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420117",
  DisName: "新洲区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420118",
  DisName: "其它区",
  CityID: "4201",
  DisSort: ""
},
{
  Id: "420202",
  DisName: "黄石港区",
  CityID: "4202",
  DisSort: ""
},
{
  Id: "420203",
  DisName: "西塞山区",
  CityID: "4202",
  DisSort: ""
},
{
  Id: "420204",
  DisName: "下陆区",
  CityID: "4202",
  DisSort: ""
},
{
  Id: "420205",
  DisName: "铁山区",
  CityID: "4202",
  DisSort: ""
},
{
  Id: "420222",
  DisName: "阳新县",
  CityID: "4202",
  DisSort: ""
},
{
  Id: "420281",
  DisName: "大冶市",
  CityID: "4202",
  DisSort: ""
},
{
  Id: "420282",
  DisName: "其它区",
  CityID: "4202",
  DisSort: ""
},
{
  Id: "420302",
  DisName: "茅箭区",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420303",
  DisName: "张湾区",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420321",
  DisName: "郧县",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420322",
  DisName: "郧西县",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420323",
  DisName: "竹山县",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420324",
  DisName: "竹溪县",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420325",
  DisName: "房县",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420381",
  DisName: "丹江口市",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420382",
  DisName: "城区",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420383",
  DisName: "其它区",
  CityID: "4203",
  DisSort: ""
},
{
  Id: "420502",
  DisName: "西陵区",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420503",
  DisName: "伍家岗区",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420504",
  DisName: "点军区",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420505",
  DisName: "猇亭区",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420506",
  DisName: "夷陵区",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420525",
  DisName: "远安县",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420526",
  DisName: "兴山县",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420527",
  DisName: "秭归县",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420528",
  DisName: "长阳土家族自治县",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420529",
  DisName: "五峰土家族自治县",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420551",
  DisName: "葛洲坝区",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420552",
  DisName: "开发区",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420581",
  DisName: "宜都市",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420582",
  DisName: "当阳市",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420583",
  DisName: "枝江市",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420584",
  DisName: "其它区",
  CityID: "4205",
  DisSort: ""
},
{
  Id: "420602",
  DisName: "襄城区",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420606",
  DisName: "樊城区",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420607",
  DisName: "襄州区",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420624",
  DisName: "南漳县",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420625",
  DisName: "谷城县",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420626",
  DisName: "保康县",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420682",
  DisName: "老河口市",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420683",
  DisName: "枣阳市",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420684",
  DisName: "宜城市",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420685",
  DisName: "其它区",
  CityID: "4206",
  DisSort: ""
},
{
  Id: "420702",
  DisName: "梁子湖区",
  CityID: "4207",
  DisSort: ""
},
{
  Id: "420703",
  DisName: "华容区",
  CityID: "4207",
  DisSort: ""
},
{
  Id: "420704",
  DisName: "鄂城区",
  CityID: "4207",
  DisSort: ""
},
{
  Id: "420705",
  DisName: "其它区",
  CityID: "4207",
  DisSort: ""
},
{
  Id: "420802",
  DisName: "东宝区",
  CityID: "4208",
  DisSort: ""
},
{
  Id: "420804",
  DisName: "掇刀区",
  CityID: "4208",
  DisSort: ""
},
{
  Id: "420821",
  DisName: "京山县",
  CityID: "4208",
  DisSort: ""
},
{
  Id: "420822",
  DisName: "沙洋县",
  CityID: "4208",
  DisSort: ""
},
{
  Id: "420881",
  DisName: "钟祥市",
  CityID: "4208",
  DisSort: ""
},
{
  Id: "420882",
  DisName: "其它区",
  CityID: "4208",
  DisSort: ""
},
{
  Id: "420902",
  DisName: "孝南区",
  CityID: "4209",
  DisSort: ""
},
{
  Id: "420921",
  DisName: "孝昌县",
  CityID: "4209",
  DisSort: ""
},
{
  Id: "420922",
  DisName: "大悟县",
  CityID: "4209",
  DisSort: ""
},
{
  Id: "420923",
  DisName: "云梦县",
  CityID: "4209",
  DisSort: ""
},
{
  Id: "420981",
  DisName: "应城市",
  CityID: "4209",
  DisSort: ""
},
{
  Id: "420982",
  DisName: "安陆市",
  CityID: "4209",
  DisSort: ""
},
{
  Id: "420984",
  DisName: "汉川市",
  CityID: "4209",
  DisSort: ""
},
{
  Id: "420985",
  DisName: "其它区",
  CityID: "4209",
  DisSort: ""
},
{
  Id: "421002",
  DisName: "沙市区",
  CityID: "4210",
  DisSort: ""
},
{
  Id: "421003",
  DisName: "荆州区",
  CityID: "4210",
  DisSort: ""
},
{
  Id: "421022",
  DisName: "公安县",
  CityID: "4210",
  DisSort: ""
},
{
  Id: "421023",
  DisName: "监利县",
  CityID: "4210",
  DisSort: ""
},
{
  Id: "421024",
  DisName: "江陵县",
  CityID: "4210",
  DisSort: ""
},
{
  Id: "421081",
  DisName: "石首市",
  CityID: "4210",
  DisSort: ""
},
{
  Id: "421083",
  DisName: "洪湖市",
  CityID: "4210",
  DisSort: ""
},
{
  Id: "421087",
  DisName: "松滋市",
  CityID: "4210",
  DisSort: ""
},
{
  Id: "421088",
  DisName: "其它区",
  CityID: "4210",
  DisSort: ""
},
{
  Id: "421102",
  DisName: "黄州区",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421121",
  DisName: "团风县",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421122",
  DisName: "红安县",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421123",
  DisName: "罗田县",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421124",
  DisName: "英山县",
  CityID: "4211",
  DisSort: ""
},
{

  Id: "421125",
  DisName: "浠水县",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421126",
  DisName: "蕲春县",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421127",
  DisName: "黄梅县",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421181",
  DisName: "麻城市",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421182",
  DisName: "武穴市",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421183",
  DisName: "其它区",
  CityID: "4211",
  DisSort: ""
},
{
  Id: "421202",
  DisName: "咸安区",
  CityID: "4212",
  DisSort: ""
},
{
  Id: "421221",
  DisName: "嘉鱼县",
  CityID: "4212",
  DisSort: ""
},
{
  Id: "421222",
  DisName: "通城县",
  CityID: "4212",
  DisSort: ""
},
{
  Id: "421223",
  DisName: "崇阳县",
  CityID: "4212",
  DisSort: ""
},
{
  Id: "421224",
  DisName: "通山县",
  CityID: "4212",
  DisSort: ""
},
{
  Id: "421281",
  DisName: "赤壁市",
  CityID: "4212",
  DisSort: ""
},
{
  Id: "421282",
  DisName: "温泉城区",
  CityID: "4212",
  DisSort: ""
},
{
  Id: "421283",
  DisName: "其它区",
  CityID: "4212",
  DisSort: ""
},
{
  Id: "421302",
  DisName: "曾都区",
  CityID: "4213",
  DisSort: ""
},
{
  Id: "421321",
  DisName: "随县",
  CityID: "4213",
  DisSort: ""
},
{
  Id: "421381",
  DisName: "广水市",
  CityID: "4213",
  DisSort: ""
},
{
  Id: "421382",
  DisName: "其它区",
  CityID: "4213",
  DisSort: ""
},
{
  Id: "422801",
  DisName: "恩施市",
  CityID: "4228",
  DisSort: ""
},
{
  Id: "422802",
  DisName: "利川市",
  CityID: "4228",
  DisSort: ""
},
{
  Id: "422822",
  DisName: "建始县",
  CityID: "4228",
  DisSort: ""
},
{
  Id: "422823",
  DisName: "巴东县",
  CityID: "4228",
  DisSort: ""
},
{
  Id: "422825",
  DisName: "宣恩县",
  CityID: "4228",
  DisSort: ""
},
{
  Id: "422826",
  DisName: "咸丰县",
  CityID: "4228",
  DisSort: ""
},
{
  Id: "422827",
  DisName: "来凤县",
  CityID: "4228",
  DisSort: ""
},
{
  Id: "422828",
  DisName: "鹤峰县",
  CityID: "4228",
  DisSort: ""
},
{
  Id: "422829",
  DisName: "其它区",
  CityID: "4228",
  DisSort: ""
},
{
  Id: "430102",
  DisName: "芙蓉区",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430103",
  DisName: "天心区",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430104",
  DisName: "岳麓区",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430105",
  DisName: "开福区",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430111",
  DisName: "雨花区",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430121",
  DisName: "长沙县",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430122",
  DisName: "望城县",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430124",
  DisName: "宁乡县",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430181",
  DisName: "浏阳市",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430182",
  DisName: "其它区",
  CityID: "4301",
  DisSort: ""
},
{
  Id: "430202",
  DisName: "荷塘区",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430203",
  DisName: "芦淞区",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430204",
  DisName: "石峰区",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430211",
  DisName: "天元区",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430221",
  DisName: "株洲县",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430223",
  DisName: "攸县",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430224",
  DisName: "茶陵县",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430225",
  DisName: "炎陵县",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430281",
  DisName: "醴陵市",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430282",
  DisName: "其它区",
  CityID: "4302",
  DisSort: ""
},
{
  Id: "430302",
  DisName: "雨湖区",
  CityID: "4303",
  DisSort: ""
},
{
  Id: "430304",
  DisName: "岳塘区",
  CityID: "4303",
  DisSort: ""
},
{
  Id: "430321",
  DisName: "湘潭县",
  CityID: "4303",
  DisSort: ""
},
{
  Id: "430381",
  DisName: "湘乡市",
  CityID: "4303",
  DisSort: ""
},
{
  Id: "430382",
  DisName: "韶山市",
  CityID: "4303",
  DisSort: ""
},
{
  Id: "430383",
  DisName: "其它区",
  CityID: "4303",
  DisSort: ""
},
{
  Id: "430405",
  DisName: "珠晖区",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430406",
  DisName: "雁峰区",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430407",
  DisName: "石鼓区",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430408",
  DisName: "蒸湘区",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430412",
  DisName: "南岳区",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430421",
  DisName: "衡阳县",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430422",
  DisName: "衡南县",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430423",
  DisName: "衡山县",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430424",
  DisName: "衡东县",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430426",
  DisName: "祁东县",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430481",
  DisName: "耒阳市",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430482",
  DisName: "常宁市",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430483",
  DisName: "其它区",
  CityID: "4304",
  DisSort: ""
},
{
  Id: "430502",
  DisName: "双清区",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430503",
  DisName: "大祥区",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430511",
  DisName: "北塔区",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430521",
  DisName: "邵东县",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430522",
  DisName: "新邵县",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430523",
  DisName: "邵阳县",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430524",
  DisName: "隆回县",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430525",
  DisName: "洞口县",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430527",
  DisName: "绥宁县",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430528",
  DisName: "新宁县",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430529",
  DisName: "城步苗族自治县",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430581",
  DisName: "武冈市",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430582",
  DisName: "其它区",
  CityID: "4305",
  DisSort: ""
},
{
  Id: "430602",
  DisName: "岳阳楼区",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430603",
  DisName: "云溪区",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430611",
  DisName: "君山区",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430621",
  DisName: "岳阳县",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430623",
  DisName: "华容县",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430624",
  DisName: "湘阴县",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430626",
  DisName: "平江县",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430681",
  DisName: "汨罗市",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430682",
  DisName: "临湘市",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430683",
  DisName: "其它区",
  CityID: "4306",
  DisSort: ""
},
{
  Id: "430702",
  DisName: "武陵区",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430703",
  DisName: "鼎城区",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430721",
  DisName: "安乡县",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430722",
  DisName: "汉寿县",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430723",
  DisName: "澧县",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430724",
  DisName: "临澧县",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430725",
  DisName: "桃源县",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430726",
  DisName: "石门县",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430781",
  DisName: "津市市",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430782",
  DisName: "其它区",
  CityID: "4307",
  DisSort: ""
},
{
  Id: "430802",
  DisName: "永定区",
  CityID: "4308",
  DisSort: ""
},
{
  Id: "430811",
  DisName: "武陵源区",
  CityID: "4308",
  DisSort: ""
},
{
  Id: "430821",
  DisName: "慈利县",
  CityID: "4308",
  DisSort: ""
},
{
  Id: "430822",
  DisName: "桑植县",
  CityID: "4308",
  DisSort: ""
},
{
  Id: "430823",
  DisName: "其它区",
  CityID: "4308",
  DisSort: ""
},
{
  Id: "430902",
  DisName: "资阳区",
  CityID: "4309",
  DisSort: ""
},
{
  Id: "430903",
  DisName: "赫山区",
  CityID: "4309",
  DisSort: ""
},
{
  Id: "430921",
  DisName: "南县",
  CityID: "4309",
  DisSort: ""
},
{
  Id: "430922",
  DisName: "桃江县",
  CityID: "4309",
  DisSort: ""
},
{
  Id: "430923",
  DisName: "安化县",
  CityID: "4309",
  DisSort: ""
},
{
  Id: "430981",
  DisName: "沅江市",
  CityID: "4309",
  DisSort: ""
},
{
  Id: "430982",
  DisName: "其它区",
  CityID: "4309",
  DisSort: ""
},
{
  Id: "431002",
  DisName: "北湖区",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431003",
  DisName: "苏仙区",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431021",
  DisName: "桂阳县",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431022",
  DisName: "宜章县",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431023",
  DisName: "永兴县",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431024",
  DisName: "嘉禾县",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431025",
  DisName: "临武县",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431026",
  DisName: "汝城县",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431027",
  DisName: "桂东县",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431028",
  DisName: "安仁县",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431081",
  DisName: "资兴市",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431082",
  DisName: "其它区",
  CityID: "4310",
  DisSort: ""
},
{
  Id: "431102",
  DisName: "零陵区",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431103",
  DisName: "冷水滩区",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431121",
  DisName: "祁阳县",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431122",
  DisName: "东安县",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431123",
  DisName: "双牌县",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431124",
  DisName: "道县",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431125",
  DisName: "江永县",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431126",
  DisName: "宁远县",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431127",
  DisName: "蓝山县",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431128",
  DisName: "新田县",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431129",
  DisName: "江华瑶族自治县",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431130",
  DisName: "其它区",
  CityID: "4311",
  DisSort: ""
},
{
  Id: "431202",
  DisName: "鹤城区",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431221",
  DisName: "中方县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431222",
  DisName: "沅陵县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431223",
  DisName: "辰溪县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431224",
  DisName: "溆浦县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431225",
  DisName: "会同县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431226",
  DisName: "麻阳苗族自治县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431227",
  DisName: "新晃侗族自治县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431228",
  DisName: "芷江侗族自治县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431229",
  DisName: "靖州苗族侗族自治县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431230",
  DisName: "通道侗族自治县",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431281",
  DisName: "洪江市",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431282",
  DisName: "其它区",
  CityID: "4312",
  DisSort: ""
},
{
  Id: "431302",
  DisName: "娄星区",
  CityID: "4313",
  DisSort: ""
},
{
  Id: "431321",
  DisName: "双峰县",
  CityID: "4313",
  DisSort: ""
},
{
  Id: "431322",
  DisName: "新化县",
  CityID: "4313",
  DisSort: ""
},
{
  Id: "431381",
  DisName: "冷水江市",
  CityID: "4313",
  DisSort: ""
},
{
  Id: "431382",
  DisName: "涟源市",
  CityID: "4313",
  DisSort: ""
},
{
  Id: "431383",
  DisName: "其它区",
  CityID: "4313",
  DisSort: ""
},
{
  Id: "433101",
  DisName: "吉首市",
  CityID: "4331",
  DisSort: ""
},
{
  Id: "433122",
  DisName: "泸溪县",
  CityID: "4331",
  DisSort: ""
},
{
  Id: "433123",
  DisName: "凤凰县",
  CityID: "4331",
  DisSort: ""
},
{
  Id: "433124",
  DisName: "花垣县",
  CityID: "4331",
  DisSort: ""
},
{
  Id: "433125",
  DisName: "保靖县",
  CityID: "4331",
  DisSort: ""
},
{
  Id: "433126",
  DisName: "古丈县",
  CityID: "4331",
  DisSort: ""
},
{
  Id: "433127",
  DisName: "永顺县",
  CityID: "4331",
  DisSort: ""
},
{
  Id: "433130",
  DisName: "龙山县",
  CityID: "4331",
  DisSort: ""
},
{
  Id: "433131",
  DisName: "其它区",
  CityID: "4331",
  DisSort: ""
},
{
  Id: "440103",
  DisName: "荔湾区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440104",
  DisName: "越秀区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440105",
  DisName: "海珠区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440106",
  DisName: "天河区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440111",
  DisName: "白云区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440112",
  DisName: "黄埔区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440113",
  DisName: "番禺区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440114",
  DisName: "花都区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440115",
  DisName: "南沙区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440116",
  DisName: "萝岗区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440183",
  DisName: "增城市",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440184",
  DisName: "从化市",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440188",
  DisName: "东山区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440189",
  DisName: "其它区",
  CityID: "4401",
  DisSort: ""
},
{
  Id: "440203",
  DisName: "武江区",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440204",
  DisName: "浈江区",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440205",
  DisName: "曲江区",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440222",
  DisName: "始兴县",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440224",
  DisName: "仁化县",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440229",
  DisName: "翁源县",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440232",
  DisName: "乳源瑶族自治县",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440233",
  DisName: "新丰县",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440281",
  DisName: "乐昌市",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440282",
  DisName: "南雄市",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440283",
  DisName: "其它区",
  CityID: "4402",
  DisSort: ""
},
{
  Id: "440303",
  DisName: "罗湖区",
  CityID: "4403",
  DisSort: ""
},
{
  Id: "440304",
  DisName: "福田区",
  CityID: "4403",
  DisSort: ""
},
{
  Id: "440305",
  DisName: "南山区",
  CityID: "4403",
  DisSort: ""
},
{
  Id: "440306",
  DisName: "宝安区",
  CityID: "4403",
  DisSort: ""
},
{
  Id: "440307",
  DisName: "龙岗区",
  CityID: "4403",
  DisSort: ""
},
{
  Id: "440308",
  DisName: "盐田区",
  CityID: "4403",
  DisSort: ""
},
{
  Id: "440309",
  DisName: "其它区",
  CityID: "4403",
  DisSort: ""
},
{
  Id: "440402",
  DisName: "香洲区",
  CityID: "4404",
  DisSort: ""
},
{
  Id: "440403",
  DisName: "斗门区",
  CityID: "4404",
  DisSort: ""
},
{
  Id: "440404",
  DisName: "金湾区",
  CityID: "4404",
  DisSort: ""
},
{
  Id: "440486",
  DisName: "金唐区",
  CityID: "4404",
  DisSort: ""
},
{
  Id: "440487",
  DisName: "南湾区",
  CityID: "4404",
  DisSort: ""
},
{
  Id: "440488",
  DisName: "其它区",
  CityID: "4404",
  DisSort: ""
},
{
  Id: "440507",
  DisName: "龙湖区",
  CityID: "4405",
  DisSort: ""
},
{
  Id: "440511",
  DisName: "金平区",
  CityID: "4405",
  DisSort: ""
},
{
  Id: "440512",
  DisName: "濠江区",
  CityID: "4405",
  DisSort: ""
},
{
  Id: "440513",
  DisName: "潮阳区",
  CityID: "4405",
  DisSort: ""
},
{
  Id: "440514",
  DisName: "潮南区",
  CityID: "4405",
  DisSort: ""
},
{
  Id: "440515",
  DisName: "澄海区",
  CityID: "4405",
  DisSort: ""
},
{
  Id: "440523",
  DisName: "南澳县",
  CityID: "4405",
  DisSort: ""
},
{
  Id: "440524",
  DisName: "其它区",
  CityID: "4405",
  DisSort: ""
},
{
  Id: "440604",
  DisName: "禅城区",
  CityID: "4406",
  DisSort: ""
},
{
  Id: "440605",
  DisName: "南海区",
  CityID: "4406",
  DisSort: ""
},
{
  Id: "440606",
  DisName: "顺德区",
  CityID: "4406",
  DisSort: ""
},
{
  Id: "440607",
  DisName: "三水区",
  CityID: "4406",
  DisSort: ""
},
{
  Id: "440608",
  DisName: "高明区",
  CityID: "4406",
  DisSort: ""
},
{
  Id: "440609",
  DisName: "其它区",
  CityID: "4406",
  DisSort: ""
},
{
  Id: "440703",
  DisName: "蓬江区",
  CityID: "4407",
  DisSort: ""
},
{
  Id: "440704",
  DisName: "江海区",
  CityID: "4407",
  DisSort: ""
},
{
  Id: "440705",
  DisName: "新会区",
  CityID: "4407",
  DisSort: ""
},
{
  Id: "440781",
  DisName: "台山市",
  CityID: "4407",
  DisSort: ""
},
{
  Id: "440783",
  DisName: "开平市",
  CityID: "4407",
  DisSort: ""
},
{
  Id: "440784",
  DisName: "鹤山市",
  CityID: "4407",
  DisSort: ""
},
{
  Id: "440785",
  DisName: "恩平市",
  CityID: "4407",
  DisSort: ""
},
{
  Id: "440786",
  DisName: "其它区",
  CityID: "4407",
  DisSort: ""
},
{
  Id: "440802",
  DisName: "赤坎区",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440803",
  DisName: "霞山区",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440804",
  DisName: "坡头区",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440811",
  DisName: "麻章区",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440823",
  DisName: "遂溪县",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440825",
  DisName: "徐闻县",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440881",
  DisName: "廉江市",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440882",
  DisName: "雷州市",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440883",
  DisName: "吴川市",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440884",
  DisName: "其它区",
  CityID: "4408",
  DisSort: ""
},
{
  Id: "440902",
  DisName: "茂南区",
  CityID: "4409",
  DisSort: ""
},
{
  Id: "440903",
  DisName: "茂港区",
  CityID: "4409",
  DisSort: ""
},
{
  Id: "440923",
  DisName: "电白县",
  CityID: "4409",
  DisSort: ""
},
{
  Id: "440981",
  DisName: "高州市",
  CityID: "4409",
  DisSort: ""
},
{
  Id: "440982",
  DisName: "化州市",
  CityID: "4409",
  DisSort: ""
},
{
  Id: "440983",
  DisName: "信宜市",
  CityID: "4409",
  DisSort: ""
},
{
  Id: "440984",
  DisName: "其它区",
  CityID: "4409",
  DisSort: ""
},
{
  Id: "441202",
  DisName: "端州区",
  CityID: "4412",
  DisSort: ""
},
{
  Id: "441203",
  DisName: "鼎湖区",
  CityID: "4412",
  DisSort: ""
},
{
  Id: "441223",
  DisName: "广宁县",
  CityID: "4412",
  DisSort: ""
},
{
  Id: "441224",
  DisName: "怀集县",
  CityID: "4412",
  DisSort: ""
},
{
  Id: "441225",
  DisName: "封开县",
  CityID: "4412",
  DisSort: ""
},
{
  Id: "441226",
  DisName: "德庆县",
  CityID: "4412",
  DisSort: ""
},
{
  Id: "441283",
  DisName: "高要市",
  CityID: "4412",
  DisSort: ""
},
{
  Id: "441284",
  DisName: "四会市",
  CityID: "4412",
  DisSort: ""
},
{
  Id: "441285",
  DisName: "其它区",
  CityID: "4412",
  DisSort: ""
},
{
  Id: "441302",
  DisName: "惠城区",
  CityID: "4413",
  DisSort: ""
},
{
  Id: "441303",
  DisName: "惠阳区",
  CityID: "4413",
  DisSort: ""
},
{
  Id: "441322",
  DisName: "博罗县",
  CityID: "4413",
  DisSort: ""
},
{
  Id: "441323",
  DisName: "惠东县",
  CityID: "4413",
  DisSort: ""
},
{
  Id: "441324",
  DisName: "龙门县",
  CityID: "4413",
  DisSort: ""
},
{
  Id: "441325",
  DisName: "其它区",
  CityID: "4413",
  DisSort: ""
},
{
  Id: "441402",
  DisName: "梅江区",
  CityID: "4414",
  DisSort: ""
},
{
  Id: "441421",
  DisName: "梅县",
  CityID: "4414",
  DisSort: ""
},
{
  Id: "441422",
  DisName: "大埔县",
  CityID: "4414",
  DisSort: ""
},
{
  Id: "441423",
  DisName: "丰顺县",
  CityID: "4414",
  DisSort: ""
},
{
  Id: "441424",
  DisName: "五华县",
  CityID: "4414",
  DisSort: ""
},
{
  Id: "441426",
  DisName: "平远县",
  CityID: "4414",
  DisSort: ""
},
{
  Id: "441427",
  DisName: "蕉岭县",
  CityID: "4414",
  DisSort: ""
},
{
  Id: "441481",
  DisName: "兴宁市",
  CityID: "4414",
  DisSort: ""
},
{
  Id: "441482",
  DisName: "其它区",
  CityID: "4414",
  DisSort: ""
},
{
  Id: "441502",
  DisName: "城区",
  CityID: "4415",
  DisSort: ""
},
{
  Id: "441521",
  DisName: "海丰县",
  CityID: "4415",
  DisSort: ""
},
{
  Id: "441523",
  DisName: "陆河县",
  CityID: "4415",
  DisSort: ""
},
{
  Id: "441581",
  DisName: "陆丰市",
  CityID: "4415",
  DisSort: ""
},
{
  Id: "441582",
  DisName: "其它区",
  CityID: "4415",
  DisSort: ""
},
{
  Id: "441602",
  DisName: "源城区",
  CityID: "4416",
  DisSort: ""
},
{
  Id: "441621",
  DisName: "紫金县",
  CityID: "4416",
  DisSort: ""
},
{
  Id: "441622",
  DisName: "龙川县",
  CityID: "4416",
  DisSort: ""
},
{
  Id: "441623",
  DisName: "连平县",
  CityID: "4416",
  DisSort: ""
},
{
  Id: "441624",
  DisName: "和平县",
  CityID: "4416",
  DisSort: ""
},
{
  Id: "441625",
  DisName: "东源县",
  CityID: "4416",
  DisSort: ""
},
{
  Id: "441626",
  DisName: "其它区",
  CityID: "4416",
  DisSort: ""
},
{
  Id: "441702",
  DisName: "江城区",
  CityID: "4417",
  DisSort: ""
},
{
  Id: "441721",
  DisName: "阳西县",
  CityID: "4417",
  DisSort: ""
},
{
  Id: "441723",
  DisName: "阳东县",
  CityID: "4417",
  DisSort: ""
},
{
  Id: "441781",
  DisName: "阳春市",
  CityID: "4417",
  DisSort: ""
},
{
  Id: "441782",
  DisName: "其它区",
  CityID: "4417",
  DisSort: ""
},
{
  Id: "441802",
  DisName: "清城区",
  CityID: "4418",
  DisSort: ""
},
{
  Id: "441821",
  DisName: "佛冈县",
  CityID: "4418",
  DisSort: ""
},
{
  Id: "441823",
  DisName: "阳山县",
  CityID: "4418",
  DisSort: ""
},
{
  Id: "441825",
  DisName: "连山壮族瑶族自治县",
  CityID: "4418",
  DisSort: ""
},
{
  Id: "441826",
  DisName: "连南瑶族自治县",
  CityID: "4418",
  DisSort: ""
},
{
  Id: "441827",
  DisName: "清新县",
  CityID: "4418",
  DisSort: ""
},
{
  Id: "441881",
  DisName: "英德市",
  CityID: "4418",
  DisSort: ""
},
{
  Id: "441882",
  DisName: "连州市",
  CityID: "4418",
  DisSort: ""
},
{
  Id: "441883",
  DisName: "其它区",
  CityID: "4418",
  DisSort: ""
},
{
  Id: "441901",
  DisName: "东莞市",
  CityID: "4419",
  DisSort: ""
},
{
  Id: "442001",
  DisName: "中山市",
  CityID: "4420",
  DisSort: ""
},
{
  Id: "445102",
  DisName: "湘桥区",
  CityID: "4451",
  DisSort: ""
},
{
  Id: "445121",
  DisName: "潮安县",
  CityID: "4451",
  DisSort: ""
},
{
  Id: "445122",
  DisName: "饶平县",
  CityID: "4451",
  DisSort: ""
},
{
  Id: "445185",
  DisName: "枫溪区",
  CityID: "4451",
  DisSort: ""
},
{
  Id: "445186",
  DisName: "其它区",
  CityID: "4451",
  DisSort: ""
},
{
  Id: "445202",
  DisName: "榕城区",
  CityID: "4452",
  DisSort: ""
},
{
  Id: "445221",
  DisName: "揭东县",
  CityID: "4452",
  DisSort: ""
},
{
  Id: "445222",
  DisName: "揭西县",
  CityID: "4452",
  DisSort: ""
},
{
  Id: "445224",
  DisName: "惠来县",
  CityID: "4452",
  DisSort: ""
},
{
  Id: "445281",
  DisName: "普宁市",
  CityID: "4452",
  DisSort: ""
},
{
  Id: "445284",
  DisName: "东山区",
  CityID: "4452",
  DisSort: ""
},
{
  Id: "445285",
  DisName: "其它区",
  CityID: "4452",
  DisSort: ""
},
{
  Id: "445302",
  DisName: "云城区",
  CityID: "4453",
  DisSort: ""
},
{
  Id: "445321",
  DisName: "新兴县",
  CityID: "4453",
  DisSort: ""
},
{
  Id: "445322",
  DisName: "郁南县",
  CityID: "4453",
  DisSort: ""
},
{
  Id: "445323",
  DisName: "云安县",
  CityID: "4453",
  DisSort: ""
},
{
  Id: "445381",
  DisName: "罗定市",
  CityID: "4453",
  DisSort: ""
},
{
  Id: "445382",
  DisName: "其它区",
  CityID: "4453",
  DisSort: ""
},
{
  Id: "450102",
  DisName: "兴宁区",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450103",
  DisName: "青秀区",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450105",
  DisName: "江南区",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450107",
  DisName: "西乡塘区",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450108",
  DisName: "良庆区",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450109",
  DisName: "邕宁区",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450122",
  DisName: "武鸣县",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450123",
  DisName: "隆安县",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450124",
  DisName: "马山县",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450125",
  DisName: "上林县",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450126",
  DisName: "宾阳县",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450127",
  DisName: "横县",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450128",
  DisName: "其它区",
  CityID: "4501",
  DisSort: ""
},
{
  Id: "450202",
  DisName: "城中区",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450203",
  DisName: "鱼峰区",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450204",
  DisName: "柳南区",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450205",
  DisName: "柳北区",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450221",
  DisName: "柳江县",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450222",
  DisName: "柳城县",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450223",
  DisName: "鹿寨县",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450224",
  DisName: "融安县",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450225",
  DisName: "融水苗族自治县",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450226",
  DisName: "三江侗族自治县",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450227",
  DisName: "其它区",
  CityID: "4502",
  DisSort: ""
},
{
  Id: "450302",
  DisName: "秀峰区",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450303",
  DisName: "叠彩区",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450304",
  DisName: "象山区",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450305",
  DisName: "七星区",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450311",
  DisName: "雁山区",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450321",
  DisName: "阳朔县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450322",
  DisName: "临桂县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450323",
  DisName: "灵川县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450324",
  DisName: "全州县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450325",
  DisName: "兴安县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450326",
  DisName: "永福县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450327",
  DisName: "灌阳县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450328",
  DisName: "龙胜各族自治县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450329",
  DisName: "资源县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450330",
  DisName: "平乐县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450331",
  DisName: "荔浦县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450332",
  DisName: "恭城瑶族自治县",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450333",
  DisName: "其它区",
  CityID: "4503",
  DisSort: ""
},
{
  Id: "450403",
  DisName: "万秀区",
  CityID: "4504",
  DisSort: ""
},
{
  Id: "450404",
  DisName: "蝶山区",
  CityID: "4504",
  DisSort: ""
},
{
  Id: "450405",
  DisName: "长洲区",
  CityID: "4504",
  DisSort: ""
},
{
  Id: "450421",
  DisName: "苍梧县",
  CityID: "4504",
  DisSort: ""
},
{
  Id: "450422",
  DisName: "藤县",
  CityID: "4504",
  DisSort: ""
},
{
  Id: "450423",
  DisName: "蒙山县",
  CityID: "4504",
  DisSort: ""
},
{
  Id: "450481",
  DisName: "岑溪市",
  CityID: "4504",
  DisSort: ""
},
{
  Id: "450482",
  DisName: "其它区",
  CityID: "4504",
  DisSort: ""
},
{
  Id: "450502",
  DisName: "海城区",
  CityID: "4505",
  DisSort: ""
},
{
  Id: "450503",
  DisName: "银海区",
  CityID: "4505",
  DisSort: ""
},
{
  Id: "450512",
  DisName: "铁山港区",
  CityID: "4505",
  DisSort: ""
},
{
  Id: "450521",
  DisName: "合浦县",
  CityID: "4505",
  DisSort: ""
},
{
  Id: "450522",
  DisName: "其它区",
  CityID: "4505",
  DisSort: ""
},
{
  Id: "450602",
  DisName: "港口区",
  CityID: "4506",
  DisSort: ""
},
{
  Id: "450603",
  DisName: "防城区",
  CityID: "4506",
  DisSort: ""
},
{
  Id: "450621",
  DisName: "上思县",
  CityID: "4506",
  DisSort: ""
},
{
  Id: "450681",
  DisName: "东兴市",
  CityID: "4506",
  DisSort: ""
},
{
  Id: "450682",
  DisName: "其它区",
  CityID: "4506",
  DisSort: ""
},
{
  Id: "450702",
  DisName: "钦南区",
  CityID: "4507",
  DisSort: ""
},
{
  Id: "450703",
  DisName: "钦北区",
  CityID: "4507",
  DisSort: ""
},
{
  Id: "450721",
  DisName: "灵山县",
  CityID: "4507",
  DisSort: ""
},
{
  Id: "450722",
  DisName: "浦北县",
  CityID: "4507",
  DisSort: ""
},
{
  Id: "450723",
  DisName: "其它区",
  CityID: "4507",
  DisSort: ""
},
{
  Id: "450802",
  DisName: "港北区",
  CityID: "4508",
  DisSort: ""
},
{
  Id: "450803",
  DisName: "港南区",
  CityID: "4508",
  DisSort: ""
},
{
  Id: "450804",
  DisName: "覃塘区",
  CityID: "4508",
  DisSort: ""
},
{
  Id: "450821",
  DisName: "平南县",
  CityID: "4508",
  DisSort: ""
},
{
  Id: "450881",
  DisName: "桂平市",
  CityID: "4508",
  DisSort: ""
},
{
  Id: "450882",
  DisName: "其它区",
  CityID: "4508",
  DisSort: ""
},
{
  Id: "450902",
  DisName: "玉州区",
  CityID: "4509",
  DisSort: ""
},
{
  Id: "450921",
  DisName: "容县",
  CityID: "4509",
  DisSort: ""
},
{
  Id: "450922",
  DisName: "陆川县",
  CityID: "4509",
  DisSort: ""
},
{
  Id: "450923",
  DisName: "博白县",
  CityID: "4509",
  DisSort: ""
},
{
  Id: "450924",
  DisName: "兴业县",
  CityID: "4509",
  DisSort: ""
},
{
  Id: "450981",
  DisName: "北流市",
  CityID: "4509",
  DisSort: ""
},
{
  Id: "450982",
  DisName: "其它区",
  CityID: "4509",
  DisSort: ""
},
{
  Id: "451002",
  DisName: "右江区",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451021",
  DisName: "田阳县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451022",
  DisName: "田东县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451023",
  DisName: "平果县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451024",
  DisName: "德保县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451025",
  DisName: "靖西县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451026",
  DisName: "那坡县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451027",
  DisName: "凌云县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451028",
  DisName: "乐业县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451029",
  DisName: "田林县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451030",
  DisName: "西林县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451031",
  DisName: "隆林各族自治县",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451032",
  DisName: "其它区",
  CityID: "4510",
  DisSort: ""
},
{
  Id: "451102",
  DisName: "八步区",
  CityID: "4511",
  DisSort: ""
},
{
  Id: "451121",
  DisName: "昭平县",
  CityID: "4511",
  DisSort: ""
},
{
  Id: "451122",
  DisName: "钟山县",
  CityID: "4511",
  DisSort: ""
},
{
  Id: "451123",
  DisName: "富川瑶族自治县",
  CityID: "4511",
  DisSort: ""
},
{
  Id: "451124",
  DisName: "其它区",
  CityID: "4511",
  DisSort: ""
},
{
  Id: "451202",
  DisName: "金城江区",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451221",
  DisName: "南丹县",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451222",
  DisName: "天峨县",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451223",
  DisName: "凤山县",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451224",
  DisName: "东兰县",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451225",
  DisName: "罗城仫佬族自治县",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451226",
  DisName: "环江毛南族自治县",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451227",
  DisName: "巴马瑶族自治县",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451228",
  DisName: "都安瑶族自治县",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451229",
  DisName: "大化瑶族自治县",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451281",
  DisName: "宜州市",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451282",
  DisName: "其它区",
  CityID: "4512",
  DisSort: ""
},
{
  Id: "451302",
  DisName: "兴宾区",
  CityID: "4513",
  DisSort: ""
},
{
  Id: "451321",
  DisName: "忻城县",
  CityID: "4513",
  DisSort: ""
},
{
  Id: "451322",
  DisName: "象州县",
  CityID: "4513",
  DisSort: ""
},
{
  Id: "451323",
  DisName: "武宣县",
  CityID: "4513",
  DisSort: ""
},
{
  Id: "451324",
  DisName: "金秀瑶族自治县",
  CityID: "4513",
  DisSort: ""
},
{
  Id: "451381",
  DisName: "合山市",
  CityID: "4513",
  DisSort: ""
},
{
  Id: "451382",
  DisName: "其它区",
  CityID: "4513",
  DisSort: ""
},
{
  Id: "451402",
  DisName: "江州区",
  CityID: "4514",
  DisSort: ""
},
{
  Id: "451421",
  DisName: "扶绥县",
  CityID: "4514",
  DisSort: ""
},
{
  Id: "451422",
  DisName: "宁明县",
  CityID: "4514",
  DisSort: ""
},
{
  Id: "451423",
  DisName: "龙州县",
  CityID: "4514",
  DisSort: ""
},
{
  Id: "451424",
  DisName: "大新县",
  CityID: "4514",
  DisSort: ""
},
{
  Id: "451425",
  DisName: "天等县",
  CityID: "4514",
  DisSort: ""
},
{
  Id: "451481",
  DisName: "凭祥市",
  CityID: "4514",
  DisSort: ""
},
{
  Id: "451482",
  DisName: "其它区",
  CityID: "4514",
  DisSort: ""
},
{
  Id: "460105",
  DisName: "秀英区",
  CityID: "4601",
  DisSort: ""
},
{
  Id: "460106",
  DisName: "龙华区",
  CityID: "4601",
  DisSort: ""
},
{
  Id: "460107",
  DisName: "琼山区",
  CityID: "4601",
  DisSort: ""
},
{
  Id: "460108",
  DisName: "美兰区",
  CityID: "4601",
  DisSort: ""
},
{
  Id: "460109",
  DisName: "其它区",
  CityID: "4601",
  DisSort: ""
},
{
  Id: "500101",
  DisName: "万州区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500102",
  DisName: "涪陵区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500103",
  DisName: "渝中区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500104",
  DisName: "大渡口区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500105",
  DisName: "江北区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500106",
  DisName: "沙坪坝区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500107",
  DisName: "九龙坡区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500108",
  DisName: "南岸区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500109",
  DisName: "北碚区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500110",
  DisName: "万盛区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500111",
  DisName: "双桥区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500112",
  DisName: "渝北区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500113",
  DisName: "巴南区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500114",
  DisName: "黔江区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500115",
  DisName: "长寿区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500122",
  DisName: "綦江县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500123",
  DisName: "潼南县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500124",
  DisName: "铜梁县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500125",
  DisName: "大足县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500126",
  DisName: "荣昌县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500127",
  DisName: "璧山县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500128",
  DisName: "梁平县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500129",
  DisName: "城口县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500130",
  DisName: "丰都县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500131",
  DisName: "垫江县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500132",
  DisName: "武隆县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500133",
  DisName: "忠县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500134",
  DisName: "开县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500135",
  DisName: "云阳县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500136",
  DisName: "奉节县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500137",
  DisName: "巫山县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500138",
  DisName: "巫溪县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500140",
  DisName: "石柱土家族自治县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500141",
  DisName: "秀山土家族苗族自治县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500142",
  DisName: "酉阳土家族苗族自治县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500143",
  DisName: "彭水苗族土家族自治县",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500181",
  DisName: "江津区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500182",
  DisName: "合川区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500183",
  DisName: "永川区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500184",
  DisName: "南川区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "500185",
  DisName: "其它区",
  CityID: "5001",
  DisSort: ""
},
{
  Id: "510104",
  DisName: "锦江区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510105",
  DisName: "青羊区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510106",
  DisName: "金牛区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510107",
  DisName: "武侯区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510108",
  DisName: "成华区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510112",
  DisName: "龙泉驿区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510113",
  DisName: "青白江区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510114",
  DisName: "新都区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510115",
  DisName: "温江区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510121",
  DisName: "金堂县",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510122",
  DisName: "双流县",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510124",
  DisName: "郫县",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510129",
  DisName: "大邑县",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510131",
  DisName: "蒲江县",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510132",
  DisName: "新津县",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510181",
  DisName: "都江堰市",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510182",
  DisName: "彭州市",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510183",
  DisName: "邛崃市",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510184",
  DisName: "崇州市",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510185",
  DisName: "其它区",
  CityID: "5101",
  DisSort: ""
},
{
  Id: "510302",
  DisName: "自流井区",
  CityID: "5103",
  DisSort: ""
},
{
  Id: "510303",
  DisName: "贡井区",
  CityID: "5103",
  DisSort: ""
},
{
  Id: "510304",
  DisName: "大安区",
  CityID: "5103",
  DisSort: ""
},
{
  Id: "510311",
  DisName: "沿滩区",
  CityID: "5103",
  DisSort: ""
},
{
  Id: "510321",
  DisName: "荣县",
  CityID: "5103",
  DisSort: ""
},
{
  Id: "510322",
  DisName: "富顺县",
  CityID: "5103",
  DisSort: ""
},
{
  Id: "510323",
  DisName: "其它区",
  CityID: "5103",
  DisSort: ""
},
{
  Id: "510402",
  DisName: "东区",
  CityID: "5104",
  DisSort: ""
},
{
  Id: "510403",
  DisName: "西区",
  CityID: "5104",
  DisSort: ""
},
{
  Id: "510411",
  DisName: "仁和区",
  CityID: "5104",
  DisSort: ""
},
{
  Id: "510421",
  DisName: "米易县",
  CityID: "5104",
  DisSort: ""
},
{
  Id: "510422",
  DisName: "盐边县",
  CityID: "5104",
  DisSort: ""
},
{
  Id: "510423",
  DisName: "其它区",
  CityID: "5104",
  DisSort: ""
},
{
  Id: "510502",
  DisName: "江阳区",
  CityID: "5105",
  DisSort: ""
},
{
  Id: "510503",
  DisName: "纳溪区",
  CityID: "5105",
  DisSort: ""
},
{
  Id: "510504",
  DisName: "龙马潭区",
  CityID: "5105",
  DisSort: ""
},
{
  Id: "510521",
  DisName: "泸县",
  CityID: "5105",
  DisSort: ""
},
{
  Id: "510522",
  DisName: "合江县",
  CityID: "5105",
  DisSort: ""
},
{
  Id: "510524",
  DisName: "叙永县",
  CityID: "5105",
  DisSort: ""
},
{
  Id: "510525",
  DisName: "古蔺县",
  CityID: "5105",
  DisSort: ""
},
{
  Id: "510526",
  DisName: "其它区",
  CityID: "5105",
  DisSort: ""
},
{
  Id: "510603",
  DisName: "旌阳区",
  CityID: "5106",
  DisSort: ""
},
{
  Id: "510623",
  DisName: "中江县",
  CityID: "5106",
  DisSort: ""
},
{
  Id: "510626",
  DisName: "罗江县",
  CityID: "5106",
  DisSort: ""
},
{
  Id: "510681",
  DisName: "广汉市",
  CityID: "5106",
  DisSort: ""
},
{
  Id: "510682",
  DisName: "什邡市",
  CityID: "5106",
  DisSort: ""
},
{
  Id: "510683",
  DisName: "绵竹市",
  CityID: "5106",
  DisSort: ""
},
{
  Id: "510684",
  DisName: "其它区",
  CityID: "5106",
  DisSort: ""
},
{
  Id: "510703",
  DisName: "涪城区",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510704",
  DisName: "游仙区",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510722",
  DisName: "三台县",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510723",
  DisName: "盐亭县",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510724",
  DisName: "安县",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510725",
  DisName: "梓潼县",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510726",
  DisName: "北川羌族自治县",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510727",
  DisName: "平武县",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510751",
  DisName: "高新区",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510781",
  DisName: "江油市",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510782",
  DisName: "其它区",
  CityID: "5107",
  DisSort: ""
},
{
  Id: "510802",
  DisName: "利州区",
  CityID: "5108",
  DisSort: ""
},
{
  Id: "510811",
  DisName: "元坝区",
  CityID: "5108",
  DisSort: ""
},
{
  Id: "510812",
  DisName: "朝天区",
  CityID: "5108",
  DisSort: ""
},
{
  Id: "510821",
  DisName: "旺苍县",
  CityID: "5108",
  DisSort: ""
},
{
  Id: "510822",
  DisName: "青川县",
  CityID: "5108",
  DisSort: ""
},
{
  Id: "510823",
  DisName: "剑阁县",
  CityID: "5108",
  DisSort: ""
},
{
  Id: "510824",
  DisName: "苍溪县",
  CityID: "5108",
  DisSort: ""
},
{
  Id: "510825",
  DisName: "其它区",
  CityID: "5108",
  DisSort: ""
},
{
  Id: "510903",
  DisName: "船山区",
  CityID: "5109",
  DisSort: ""
},
{
  Id: "510904",
  DisName: "安居区",
  CityID: "5109",
  DisSort: ""
},
{
  Id: "510921",
  DisName: "蓬溪县",
  CityID: "5109",
  DisSort: ""
},
{
  Id: "510922",
  DisName: "射洪县",
  CityID: "5109",
  DisSort: ""
},
{
  Id: "510923",
  DisName: "大英县",
  CityID: "5109",
  DisSort: ""
},
{
  Id: "510924",
  DisName: "其它区",
  CityID: "5109",
  DisSort: ""
},
{
  Id: "511002",
  DisName: "市中区",
  CityID: "5110",
  DisSort: ""
},
{
  Id: "511011",
  DisName: "东兴区",
  CityID: "5110",
  DisSort: ""
},
{
  Id: "511024",
  DisName: "威远县",
  CityID: "5110",
  DisSort: ""
},
{
  Id: "511025",
  DisName: "资中县",
  CityID: "5110",
  DisSort: ""
},
{
  Id: "511028",
  DisName: "隆昌县",
  CityID: "5110",
  DisSort: ""
},
{
  Id: "511029",
  DisName: "其它区",
  CityID: "5110",
  DisSort: ""
},
{
  Id: "511102",
  DisName: "市中区",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511111",
  DisName: "沙湾区",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511112",
  DisName: "五通桥区",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511113",
  DisName: "金口河区",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511123",
  DisName: "犍为县",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511124",
  DisName: "井研县",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511126",
  DisName: "夹江县",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511129",
  DisName: "沐川县",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511132",
  DisName: "峨边彝族自治县",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511133",
  DisName: "马边彝族自治县",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511181",
  DisName: "峨眉山市",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511182",
  DisName: "其它区",
  CityID: "5111",
  DisSort: ""
},
{
  Id: "511302",
  DisName: "顺庆区",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511303",
  DisName: "高坪区",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511304",
  DisName: "嘉陵区",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511321",
  DisName: "南部县",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511322",
  DisName: "营山县",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511323",
  DisName: "蓬安县",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511324",
  DisName: "仪陇县",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511325",
  DisName: "西充县",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511381",
  DisName: "阆中市",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511382",
  DisName: "其它区",
  CityID: "5113",
  DisSort: ""
},
{
  Id: "511402",
  DisName: "东坡区",
  CityID: "5114",
  DisSort: ""
},
{
  Id: "511421",
  DisName: "仁寿县",
  CityID: "5114",
  DisSort: ""
},
{
  Id: "511422",
  DisName: "彭山县",
  CityID: "5114",
  DisSort: ""
},
{
  Id: "511423",
  DisName: "洪雅县",
  CityID: "5114",
  DisSort: ""
},
{
  Id: "511424",
  DisName: "丹棱县",
  CityID: "5114",
  DisSort: ""
},
{
  Id: "511425",
  DisName: "青神县",
  CityID: "5114",
  DisSort: ""
},
{
  Id: "511426",
  DisName: "其它区",
  CityID: "5114",
  DisSort: ""
},
{
  Id: "511502",
  DisName: "翠屏区",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511521",
  DisName: "宜宾县",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511522",
  DisName: "南溪县",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511523",
  DisName: "江安县",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511524",
  DisName: "长宁县",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511525",
  DisName: "高县",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511526",
  DisName: "珙县",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511527",
  DisName: "筠连县",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511528",
  DisName: "兴文县",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511529",
  DisName: "屏山县",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511530",
  DisName: "其它区",
  CityID: "5115",
  DisSort: ""
},
{
  Id: "511602",
  DisName: "广安区",
  CityID: "5116",
  DisSort: ""
},
{
  Id: "511621",
  DisName: "岳池县",
  CityID: "5116",
  DisSort: ""
},
{
  Id: "511622",
  DisName: "武胜县",
  CityID: "5116",
  DisSort: ""
},
{
  Id: "511623",
  DisName: "邻水县",
  CityID: "5116",
  DisSort: ""
},
{
  Id: "511681",
  DisName: "华蓥市",
  CityID: "5116",
  DisSort: ""
},
{
  Id: "511682",
  DisName: "市辖区",
  CityID: "5116",
  DisSort: ""
},
{
  Id: "511683",
  DisName: "其它区",
  CityID: "5116",
  DisSort: ""
},
{
  Id: "511702",
  DisName: "通川区",
  CityID: "5117",
  DisSort: ""
},
{
  Id: "511721",
  DisName: "达县",
  CityID: "5117",
  DisSort: ""
},
{
  Id: "511722",
  DisName: "宣汉县",
  CityID: "5117",
  DisSort: ""
},
{
  Id: "511723",
  DisName: "开江县",
  CityID: "5117",
  DisSort: ""
},
{
  Id: "511724",
  DisName: "大竹县",
  CityID: "5117",
  DisSort: ""
},
{
  Id: "511725",
  DisName: "渠县",
  CityID: "5117",
  DisSort: ""
},
{
  Id: "511781",
  DisName: "万源市",
  CityID: "5117",
  DisSort: ""
},
{
  Id: "511782",
  DisName: "其它区",
  CityID: "5117",
  DisSort: ""
},
{
  Id: "511802",
  DisName: "雨城区",
  CityID: "5118",
  DisSort: ""
},
{
  Id: "511821",
  DisName: "名山县",
  CityID: "5118",
  DisSort: ""
},
{
  Id: "511822",
  DisName: "荥经县",
  CityID: "5118",
  DisSort: ""
},
{
  Id: "511823",
  DisName: "汉源县",
  CityID: "5118",
  DisSort: ""
},
{
  Id: "511824",
  DisName: "石棉县",
  CityID: "5118",
  DisSort: ""
},
{
  Id: "511825",
  DisName: "天全县",
  CityID: "5118",
  DisSort: ""
},
{
  Id: "511826",
  DisName: "芦山县",
  CityID: "5118",
  DisSort: ""
},
{
  Id: "511827",
  DisName: "宝兴县",
  CityID: "5118",
  DisSort: ""
},
{
  Id: "511828",
  DisName: "其它区",
  CityID: "5118",
  DisSort: ""
},
{
  Id: "511902",
  DisName: "巴州区",
  CityID: "5119",
  DisSort: ""
},
{
  Id: "511921",
  DisName: "通江县",
  CityID: "5119",
  DisSort: ""
},
{
  Id: "511922",
  DisName: "南江县",
  CityID: "5119",
  DisSort: ""
},
{
  Id: "511923",
  DisName: "平昌县",
  CityID: "5119",
  DisSort: ""
},
{
  Id: "511924",
  DisName: "其它区",
  CityID: "5119",
  DisSort: ""
},
{
  Id: "512002",
  DisName: "雁江区",
  CityID: "5120",
  DisSort: ""
},
{
  Id: "512021",
  DisName: "安岳县",
  CityID: "5120",
  DisSort: ""
},
{
  Id: "512022",
  DisName: "乐至县",
  CityID: "5120",
  DisSort: ""
},
{
  Id: "512081",
  DisName: "简阳市",
  CityID: "5120",
  DisSort: ""
},
{
  Id: "512082",
  DisName: "其它区",
  CityID: "5120",
  DisSort: ""
},
{
  Id: "513221",
  DisName: "汶川县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513222",
  DisName: "理县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513223",
  DisName: "茂县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513224",
  DisName: "松潘县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513225",
  DisName: "九寨沟县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513226",
  DisName: "金川县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513227",
  DisName: "小金县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513228",
  DisName: "黑水县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513229",
  DisName: "马尔康县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513230",
  DisName: "壤塘县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513231",
  DisName: "阿坝县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513232",
  DisName: "若尔盖县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513233",
  DisName: "红原县",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513234",
  DisName: "其它区",
  CityID: "5132",
  DisSort: ""
},
{
  Id: "513321",
  DisName: "康定县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513322",
  DisName: "泸定县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513323",
  DisName: "丹巴县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513324",
  DisName: "九龙县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513325",
  DisName: "雅江县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513326",
  DisName: "道孚县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513327",
  DisName: "炉霍县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513328",
  DisName: "甘孜县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513329",
  DisName: "新龙县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513330",
  DisName: "德格县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513331",
  DisName: "白玉县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513332",
  DisName: "石渠县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513333",
  DisName: "色达县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513334",
  DisName: "理塘县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513335",
  DisName: "巴塘县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513336",
  DisName: "乡城县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513337",
  DisName: "稻城县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513338",
  DisName: "得荣县",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513339",
  DisName: "其它区",
  CityID: "5133",
  DisSort: ""
},
{
  Id: "513401",
  DisName: "西昌市",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513422",
  DisName: "木里藏族自治县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513423",
  DisName: "盐源县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513424",
  DisName: "德昌县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513425",
  DisName: "会理县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513426",
  DisName: "会东县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513427",
  DisName: "宁南县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513428",
  DisName: "普格县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513429",
  DisName: "布拖县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513430",
  DisName: "金阳县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513431",
  DisName: "昭觉县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513432",
  DisName: "喜德县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513433",
  DisName: "冕宁县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513434",
  DisName: "越西县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513435",
  DisName: "甘洛县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513436",
  DisName: "美姑县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513437",
  DisName: "雷波县",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "513438",
  DisName: "其它区",
  CityID: "5134",
  DisSort: ""
},
{
  Id: "520102",
  DisName: "南明区",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520103",
  DisName: "云岩区",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520111",
  DisName: "花溪区",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520112",
  DisName: "乌当区",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520113",
  DisName: "白云区",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520114",
  DisName: "小河区",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520121",
  DisName: "开阳县",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520122",
  DisName: "息烽县",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520123",
  DisName: "修文县",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520151",
  DisName: "金阳开发区",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520181",
  DisName: "清镇市",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520182",
  DisName: "其它区",
  CityID: "5201",
  DisSort: ""
},
{
  Id: "520201",
  DisName: "钟山区",
  CityID: "5202",
  DisSort: ""
},
{
  Id: "520203",
  DisName: "六枝特区",
  CityID: "5202",
  DisSort: ""
},
{
  Id: "520221",
  DisName: "水城县",
  CityID: "5202",
  DisSort: ""
},
{
  Id: "520222",
  DisName: "盘县",
  CityID: "5202",
  DisSort: ""
},
{
  Id: "520223",
  DisName: "其它区",
  CityID: "5202",
  DisSort: ""
},
{
  Id: "520302",
  DisName: "红花岗区",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520303",
  DisName: "汇川区",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520321",
  DisName: "遵义县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520322",
  DisName: "桐梓县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520323",
  DisName: "绥阳县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520324",
  DisName: "正安县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520325",
  DisName: "道真仡佬族苗族自治县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520326",
  DisName: "务川仡佬族苗族自治县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520327",
  DisName: "凤冈县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520328",
  DisName: "湄潭县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520329",
  DisName: "余庆县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520330",
  DisName: "习水县",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520381",
  DisName: "赤水市",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520382",
  DisName: "仁怀市",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520383",
  DisName: "其它区",
  CityID: "5203",
  DisSort: ""
},
{
  Id: "520402",
  DisName: "西秀区",
  CityID: "5204",
  DisSort: ""
},
{
  Id: "520421",
  DisName: "平坝县",
  CityID: "5204",
  DisSort: ""
},
{
  Id: "520422",
  DisName: "普定县",
  CityID: "5204",
  DisSort: ""
},
{
  Id: "520423",
  DisName: "镇宁布依族苗族自治县",
  CityID: "5204",
  DisSort: ""
},
{
  Id: "520424",
  DisName: "关岭布依族苗族自治县",
  CityID: "5204",
  DisSort: ""
},
{
  Id: "520425",
  DisName: "紫云苗族布依族自治县",
  CityID: "5204",
  DisSort: ""
},
{
  Id: "520426",
  DisName: "其它区",
  CityID: "5204",
  DisSort: ""
},
{
  Id: "522201",
  DisName: "铜仁市",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522222",
  DisName: "江口县",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522223",
  DisName: "玉屏侗族自治县",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522224",
  DisName: "石阡县",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522225",
  DisName: "思南县",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522226",
  DisName: "印江土家族苗族自治县",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522227",
  DisName: "德江县",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522228",
  DisName: "沿河土家族自治县",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522229",
  DisName: "松桃苗族自治县",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522230",
  DisName: "万山特区",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522231",
  DisName: "其它区",
  CityID: "5222",
  DisSort: ""
},
{
  Id: "522301",
  DisName: "兴义市",
  CityID: "5223",
  DisSort: ""
},
{
  Id: "522322",
  DisName: "兴仁县",
  CityID: "5223",
  DisSort: ""
},
{
  Id: "522323",
  DisName: "普安县",
  CityID: "5223",
  DisSort: ""
},
{
  Id: "522324",
  DisName: "晴隆县",
  CityID: "5223",
  DisSort: ""
},
{
  Id: "522325",
  DisName: "贞丰县",
  CityID: "5223",
  DisSort: ""
},
{
  Id: "522326",
  DisName: "望谟县",
  CityID: "5223",
  DisSort: ""
},
{
  Id: "522327",
  DisName: "册亨县",
  CityID: "5223",
  DisSort: ""
},
{
  Id: "522328",
  DisName: "安龙县",
  CityID: "5223",
  DisSort: ""
},
{
  Id: "522329",
  DisName: "其它区",
  CityID: "5223",
  DisSort: ""
},
{
  Id: "522401",
  DisName: "毕节市",
  CityID: "5224",
  DisSort: ""
},
{
  Id: "522422",
  DisName: "大方县",
  CityID: "5224",
  DisSort: ""
},
{
  Id: "522423",
  DisName: "黔西县",
  CityID: "5224",
  DisSort: ""
},
{
  Id: "522424",
  DisName: "金沙县",
  CityID: "5224",
  DisSort: ""
},
{
  Id: "522425",
  DisName: "织金县",
  CityID: "5224",
  DisSort: ""
},
{
  Id: "522426",
  DisName: "纳雍县",
  CityID: "5224",
  DisSort: ""
},
{
  Id: "522427",
  DisName: "威宁彝族回族苗族自治县",
  CityID: "5224",
  DisSort: ""
},
{
  Id: "522428",
  DisName: "赫章县",
  CityID: "5224",
  DisSort: ""
},
{
  Id: "522429",
  DisName: "其它区",
  CityID: "5224",
  DisSort: ""
},
{
  Id: "522601",
  DisName: "凯里市",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522622",
  DisName: "黄平县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522623",
  DisName: "施秉县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522624",
  DisName: "三穗县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522625",
  DisName: "镇远县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522626",
  DisName: "岑巩县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522627",
  DisName: "天柱县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522628",
  DisName: "锦屏县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522629",
  DisName: "剑河县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522630",
  DisName: "台江县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522631",
  DisName: "黎平县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522632",
  DisName: "榕江县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522633",
  DisName: "从江县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522634",
  DisName: "雷山县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522635",
  DisName: "麻江县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522636",
  DisName: "丹寨县",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522637",
  DisName: "其它区",
  CityID: "5226",
  DisSort: ""
},
{
  Id: "522701",
  DisName: "都匀市",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522702",
  DisName: "福泉市",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522722",
  DisName: "荔波县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522723",
  DisName: "贵定县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522725",
  DisName: "瓮安县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522726",
  DisName: "独山县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522727",
  DisName: "平塘县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522728",
  DisName: "罗甸县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522729",
  DisName: "长顺县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522730",
  DisName: "龙里县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522731",
  DisName: "惠水县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522732",
  DisName: "三都水族自治县",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "522733",
  DisName: "其它区",
  CityID: "5227",
  DisSort: ""
},
{
  Id: "530102",
  DisName: "五华区",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530103",
  DisName: "盘龙区",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530111",
  DisName: "官渡区",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530112",
  DisName: "西山区",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530113",
  DisName: "东川区",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530121",
  DisName: "呈贡县",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530122",
  DisName: "晋宁县",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530124",
  DisName: "富民县",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530125",
  DisName: "宜良县",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530126",
  DisName: "石林彝族自治县",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530127",
  DisName: "嵩明县",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530128",
  DisName: "禄劝彝族苗族自治县",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530129",
  DisName: "寻甸回族彝族自治县",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530181",
  DisName: "安宁市",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530182",
  DisName: "其它区",
  CityID: "5301",
  DisSort: ""
},
{
  Id: "530302",
  DisName: "麒麟区",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530321",
  DisName: "马龙县",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530322",
  DisName: "陆良县",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530323",
  DisName: "师宗县",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530324",
  DisName: "罗平县",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530325",
  DisName: "富源县",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530326",
  DisName: "会泽县",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530328",
  DisName: "沾益县",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530381",
  DisName: "宣威市",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530382",
  DisName: "其它区",
  CityID: "5303",
  DisSort: ""
},
{
  Id: "530402",
  DisName: "红塔区",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530421",
  DisName: "江川县",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530422",
  DisName: "澄江县",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530423",
  DisName: "通海县",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530424",
  DisName: "华宁县",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530425",
  DisName: "易门县",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530426",
  DisName: "峨山彝族自治县",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530427",
  DisName: "新平彝族傣族自治县",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530428",
  DisName: "元江哈尼族彝族傣族自治县",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530429",
  DisName: "其它区",
  CityID: "5304",
  DisSort: ""
},
{
  Id: "530502",
  DisName: "隆阳区",
  CityID: "5305",
  DisSort: ""
},
{
  Id: "530521",
  DisName: "施甸县",
  CityID: "5305",
  DisSort: ""
},
{
  Id: "530522",
  DisName: "腾冲县",
  CityID: "5305",
  DisSort: ""
},
{
  Id: "530523",
  DisName: "龙陵县",
  CityID: "5305",
  DisSort: ""
},
{
  Id: "530524",
  DisName: "昌宁县",
  CityID: "5305",
  DisSort: ""
},
{
  Id: "530525",
  DisName: "其它区",
  CityID: "5305",
  DisSort: ""
},
{
  Id: "530602",
  DisName: "昭阳区",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530621",
  DisName: "鲁甸县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530622",
  DisName: "巧家县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530623",
  DisName: "盐津县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530624",
  DisName: "大关县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530625",
  DisName: "永善县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530626",
  DisName: "绥江县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530627",
  DisName: "镇雄县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530628",
  DisName: "彝良县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530629",
  DisName: "威信县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530630",
  DisName: "水富县",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530631",
  DisName: "其它区",
  CityID: "5306",
  DisSort: ""
},
{
  Id: "530702",
  DisName: "古城区",
  CityID: "5307",
  DisSort: ""
},
{
  Id: "530721",
  DisName: "玉龙纳西族自治县",
  CityID: "5307",
  DisSort: ""
},
{
  Id: "530722",
  DisName: "永胜县",
  CityID: "5307",
  DisSort: ""
},
{
  Id: "530723",
  DisName: "华坪县",
  CityID: "5307",
  DisSort: ""
},
{
  Id: "530724",
  DisName: "宁蒗彝族自治县",
  CityID: "5307",
  DisSort: ""
},
{
  Id: "530725",
  DisName: "其它区",
  CityID: "5307",
  DisSort: ""
},
{
  Id: "530802",
  DisName: "思茅区",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530821",
  DisName: "宁洱哈尼族彝族自治县",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530822",
  DisName: "墨江哈尼族自治县",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530823",
  DisName: "景东彝族自治县",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530824",
  DisName: "景谷傣族彝族自治县",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530825",
  DisName: "镇沅彝族哈尼族拉祜族自治县",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530826",
  DisName: "江城哈尼族彝族自治县",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530827",
  DisName: "孟连傣族拉祜族佤族自治县",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530828",
  DisName: "澜沧拉祜族自治县",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530829",
  DisName: "西盟佤族自治县",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530830",
  DisName: "其它区",
  CityID: "5308",
  DisSort: ""
},
{
  Id: "530902",
  DisName: "临翔区",
  CityID: "5309",
  DisSort: ""
},
{
  Id: "530921",
  DisName: "凤庆县",
  CityID: "5309",
  DisSort: ""
},
{
  Id: "530922",
  DisName: "云县",
  CityID: "5309",
  DisSort: ""
},
{
  Id: "530923",
  DisName: "永德县",
  CityID: "5309",
  DisSort: ""
},
{
  Id: "530924",
  DisName: "镇康县",
  CityID: "5309",
  DisSort: ""
},
{
  Id: "530925",
  DisName: "双江拉祜族佤族布朗族傣族自治县",
  CityID: "5309",
  DisSort: ""
},
{
  Id: "530926",
  DisName: "耿马傣族佤族自治县",
  CityID: "5309",
  DisSort: ""
},
{
  Id: "530927",
  DisName: "沧源佤族自治县",
  CityID: "5309",
  DisSort: ""
},
{
  Id: "530928",
  DisName: "其它区",
  CityID: "5309",
  DisSort: ""
},
{
  Id: "532301",
  DisName: "楚雄市",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532322",
  DisName: "双柏县",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532323",
  DisName: "牟定县",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532324",
  DisName: "南华县",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532325",
  DisName: "姚安县",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532326",
  DisName: "大姚县",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532327",
  DisName: "永仁县",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532328",
  DisName: "元谋县",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532329",
  DisName: "武定县",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532331",
  DisName: "禄丰县",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532332",
  DisName: "其它区",
  CityID: "5323",
  DisSort: ""
},
{
  Id: "532501",
  DisName: "个旧市",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532502",
  DisName: "开远市",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532522",
  DisName: "蒙自县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532523",
  DisName: "屏边苗族自治县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532524",
  DisName: "建水县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532525",
  DisName: "石屏县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532526",
  DisName: "弥勒县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532527",
  DisName: "泸西县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532528",
  DisName: "元阳县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532529",
  DisName: "红河县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532530",
  DisName: "金平苗族瑶族傣族自治县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532531",
  DisName: "绿春县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532532",
  DisName: "河口瑶族自治县",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532533",
  DisName: "其它区",
  CityID: "5325",
  DisSort: ""
},
{
  Id: "532621",
  DisName: "文山县",
  CityID: "5326",
  DisSort: ""
},
{
  Id: "532622",
  DisName: "砚山县",
  CityID: "5326",
  DisSort: ""
},
{
  Id: "532623",
  DisName: "西畴县",
  CityID: "5326",
  DisSort: ""
},
{
  Id: "532624",
  DisName: "麻栗坡县",
  CityID: "5326",
  DisSort: ""
},
{
  Id: "532625",
  DisName: "马关县",
  CityID: "5326",
  DisSort: ""
},
{
  Id: "532626",
  DisName: "丘北县",
  CityID: "5326",
  DisSort: ""
},
{
  Id: "532627",
  DisName: "广南县",
  CityID: "5326",
  DisSort: ""
},
{
  Id: "532628",
  DisName: "富宁县",
  CityID: "5326",
  DisSort: ""
},
{
  Id: "532629",
  DisName: "其它区",
  CityID: "5326",
  DisSort: ""
},
{
  Id: "532801",
  DisName: "景洪市",
  CityID: "5328",
  DisSort: ""
},
{
  Id: "532822",
  DisName: "勐海县",
  CityID: "5328",
  DisSort: ""
},
{
  Id: "532823",
  DisName: "勐腊县",
  CityID: "5328",
  DisSort: ""
},
{
  Id: "532824",
  DisName: "其它区",
  CityID: "5328",
  DisSort: ""
},
{
  Id: "532901",
  DisName: "大理市",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532922",
  DisName: "漾濞彝族自治县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532923",
  DisName: "祥云县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532924",
  DisName: "宾川县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532925",
  DisName: "弥渡县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532926",
  DisName: "南涧彝族自治县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532927",
  DisName: "巍山彝族回族自治县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532928",
  DisName: "永平县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532929",
  DisName: "云龙县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532930",
  DisName: "洱源县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532931",
  DisName: "剑川县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532932",
  DisName: "鹤庆县",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "532933",
  DisName: "其它区",
  CityID: "5329",
  DisSort: ""
},
{
  Id: "533102",
  DisName: "瑞丽市",
  CityID: "5331",
  DisSort: ""
},
{
  Id: "533103",
  DisName: "潞西市",
  CityID: "5331",
  DisSort: ""
},
{
  Id: "533122",
  DisName: "梁河县",
  CityID: "5331",
  DisSort: ""
},
{
  Id: "533123",
  DisName: "盈江县",
  CityID: "5331",
  DisSort: ""
},
{
  Id: "533124",
  DisName: "陇川县",
  CityID: "5331",
  DisSort: ""
},
{
  Id: "533125",
  DisName: "其它区",
  CityID: "5331",
  DisSort: ""
},
{
  Id: "533321",
  DisName: "泸水县",
  CityID: "5333",
  DisSort: ""
},
{
  Id: "533323",
  DisName: "福贡县",
  CityID: "5333",
  DisSort: ""
},
{
  Id: "533324",
  DisName: "贡山独龙族怒族自治县",
  CityID: "5333",
  DisSort: ""
},
{
  Id: "533325",
  DisName: "兰坪白族普米族自治县",
  CityID: "5333",
  DisSort: ""
},
{
  Id: "533326",
  DisName: "其它区",
  CityID: "5333",
  DisSort: ""
},
{
  Id: "533421",
  DisName: "香格里拉县",
  CityID: "5334",
  DisSort: ""
},
{
  Id: "533422",
  DisName: "德钦县",
  CityID: "5334",
  DisSort: ""
},
{
  Id: "533423",
  DisName: "维西傈僳族自治县",
  CityID: "5334",
  DisSort: ""
},
{
  Id: "533424",
  DisName: "其它区",
  CityID: "5334",
  DisSort: ""
},
{
  Id: "540102",
  DisName: "城关区",
  CityID: "5401",
  DisSort: ""
},
{
  Id: "540121",
  DisName: "林周县",
  CityID: "5401",
  DisSort: ""
},
{
  Id: "540122",
  DisName: "当雄县",
  CityID: "5401",
  DisSort: ""
},
{
  Id: "540123",
  DisName: "尼木县",
  CityID: "5401",
  DisSort: ""
},
{
  Id: "540124",
  DisName: "曲水县",
  CityID: "5401",
  DisSort: ""
},
{
  Id: "540125",
  DisName: "堆龙德庆县",
  CityID: "5401",
  DisSort: ""
},
{
  Id: "540126",
  DisName: "达孜县",
  CityID: "5401",
  DisSort: ""
},
{
  Id: "540127",
  DisName: "墨竹工卡县",
  CityID: "5401",
  DisSort: ""
},
{
  Id: "540128",
  DisName: "其它区",
  CityID: "5401",
  DisSort: ""
},
{
  Id: "542121",
  DisName: "昌都县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542122",
  DisName: "江达县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542123",
  DisName: "贡觉县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542124",
  DisName: "类乌齐县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542125",
  DisName: "丁青县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542126",
  DisName: "察雅县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542127",
  DisName: "八宿县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542128",
  DisName: "左贡县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542129",
  DisName: "芒康县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542132",
  DisName: "洛隆县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542133",
  DisName: "边坝县",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542134",
  DisName: "其它区",
  CityID: "5421",
  DisSort: ""
},
{
  Id: "542221",
  DisName: "乃东县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542222",
  DisName: "扎囊县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542223",
  DisName: "贡嘎县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542224",
  DisName: "桑日县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542225",
  DisName: "琼结县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542226",
  DisName: "曲松县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542227",
  DisName: "措美县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542228",
  DisName: "洛扎县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542229",
  DisName: "加查县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542231",
  DisName: "隆子县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542232",
  DisName: "错那县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542233",
  DisName: "浪卡子县",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542234",
  DisName: "其它区",
  CityID: "5422",
  DisSort: ""
},
{
  Id: "542301",
  DisName: "日喀则市",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542322",

  DisName: "南木林县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542323",
  DisName: "江孜县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542324",
  DisName: "定日县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542325",
  DisName: "萨迦县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542326",
  DisName: "拉孜县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542327",
  DisName: "昂仁县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542328",
  DisName: "谢通门县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542329",
  DisName: "白朗县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542330",
  DisName: "仁布县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542331",
  DisName: "康马县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542332",
  DisName: "定结县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542333",
  DisName: "仲巴县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542334",
  DisName: "亚东县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542335",
  DisName: "吉隆县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542336",
  DisName: "聂拉木县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542337",
  DisName: "萨嘎县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542338",
  DisName: "岗巴县",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542339",
  DisName: "其它区",
  CityID: "5423",
  DisSort: ""
},
{
  Id: "542421",
  DisName: "那曲县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542422",
  DisName: "嘉黎县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542423",
  DisName: "比如县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542424",
  DisName: "聂荣县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542425",
  DisName: "安多县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542426",
  DisName: "申扎县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542427",
  DisName: "索县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542428",
  DisName: "班戈县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542429",
  DisName: "巴青县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542430",
  DisName: "尼玛县",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542431",
  DisName: "其它区",
  CityID: "5424",
  DisSort: ""
},
{
  Id: "542521",
  DisName: "普兰县",
  CityID: "5425",
  DisSort: ""
},
{
  Id: "542522",
  DisName: "札达县",
  CityID: "5425",
  DisSort: ""
},
{
  Id: "542523",
  DisName: "噶尔县",
  CityID: "5425",
  DisSort: ""
},
{
  Id: "542524",
  DisName: "日土县",
  CityID: "5425",
  DisSort: ""
},
{
  Id: "542525",
  DisName: "革吉县",
  CityID: "5425",
  DisSort: ""
},
{
  Id: "542526",
  DisName: "改则县",
  CityID: "5425",
  DisSort: ""
},
{
  Id: "542527",
  DisName: "措勤县",
  CityID: "5425",
  DisSort: ""
},
{
  Id: "542528",
  DisName: "其它区",
  CityID: "5425",
  DisSort: ""
},
{
  Id: "542621",
  DisName: "林芝县",
  CityID: "5426",
  DisSort: ""
},
{
  Id: "542622",
  DisName: "工布江达县",
  CityID: "5426",
  DisSort: ""
},
{
  Id: "542623",
  DisName: "米林县",
  CityID: "5426",
  DisSort: ""
},
{
  Id: "542624",
  DisName: "墨脱县",
  CityID: "5426",
  DisSort: ""
},
{
  Id: "542625",
  DisName: "波密县",
  CityID: "5426",
  DisSort: ""
},
{
  Id: "542626",
  DisName: "察隅县",
  CityID: "5426",
  DisSort: ""
},
{
  Id: "542627",
  DisName: "朗县",
  CityID: "5426",
  DisSort: ""
},
{
  Id: "542628",
  DisName: "其它区",
  CityID: "5426",
  DisSort: ""
},
{
  Id: "610102",
  DisName: "新城区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610103",
  DisName: "碑林区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610104",
  DisName: "莲湖区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610111",
  DisName: "灞桥区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610112",
  DisName: "未央区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610113",
  DisName: "雁塔区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610114",
  DisName: "阎良区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610115",
  DisName: "临潼区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610116",
  DisName: "长安区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610122",
  DisName: "蓝田县",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610124",
  DisName: "周至县",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610125",
  DisName: "户县",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610126",
  DisName: "高陵县",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610127",
  DisName: "其它区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610130",
  DisName: "高新区",
  CityID: "6101",
  DisSort: ""
},
{
  Id: "610202",
  DisName: "王益区",
  CityID: "6102",
  DisSort: ""
},
{
  Id: "610203",
  DisName: "印台区",
  CityID: "6102",
  DisSort: ""
},
{
  Id: "610204",
  DisName: "耀州区",
  CityID: "6102",
  DisSort: ""
},
{
  Id: "610222",
  DisName: "宜君县",
  CityID: "6102",
  DisSort: ""
},
{
  Id: "610223",
  DisName: "其它区",
  CityID: "6102",
  DisSort: ""
},
{
  Id: "610302",
  DisName: "渭滨区",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610303",
  DisName: "金台区",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610304",
  DisName: "陈仓区",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610322",
  DisName: "凤翔县",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610323",
  DisName: "岐山县",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610324",
  DisName: "扶风县",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610326",
  DisName: "眉县",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610327",
  DisName: "陇县",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610328",
  DisName: "千阳县",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610329",
  DisName: "麟游县",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610330",
  DisName: "凤县",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610331",
  DisName: "太白县",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610332",
  DisName: "其它区",
  CityID: "6103",
  DisSort: ""
},
{
  Id: "610402",
  DisName: "秦都区",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610403",
  DisName: "杨凌区",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610404",
  DisName: "渭城区",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610422",
  DisName: "三原县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610423",
  DisName: "泾阳县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610424",
  DisName: "乾县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610425",
  DisName: "礼泉县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610426",
  DisName: "永寿县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610427",
  DisName: "彬县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610428",
  DisName: "长武县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610429",
  DisName: "旬邑县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610430",
  DisName: "淳化县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610431",
  DisName: "武功县",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610481",
  DisName: "兴平市",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610482",
  DisName: "其它区",
  CityID: "6104",
  DisSort: ""
},
{
  Id: "610502",
  DisName: "临渭区",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610521",
  DisName: "华县",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610522",
  DisName: "潼关县",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610523",
  DisName: "大荔县",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610524",
  DisName: "合阳县",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610525",
  DisName: "澄城县",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610526",
  DisName: "蒲城县",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610527",
  DisName: "白水县",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610528",
  DisName: "富平县",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610581",
  DisName: "韩城市",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610582",
  DisName: "华阴市",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610583",
  DisName: "其它区",
  CityID: "6105",
  DisSort: ""
},
{
  Id: "610602",
  DisName: "宝塔区",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610621",
  DisName: "延长县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610622",
  DisName: "延川县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610623",
  DisName: "子长县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610624",
  DisName: "安塞县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610625",
  DisName: "志丹县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610626",
  DisName: "吴起县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610627",
  DisName: "甘泉县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610628",
  DisName: "富县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610629",
  DisName: "洛川县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610630",
  DisName: "宜川县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610631",
  DisName: "黄龙县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610632",
  DisName: "黄陵县",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610633",
  DisName: "其它区",
  CityID: "6106",
  DisSort: ""
},
{
  Id: "610702",
  DisName: "汉台区",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610721",
  DisName: "南郑县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610722",
  DisName: "城固县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610723",
  DisName: "洋县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610724",
  DisName: "西乡县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610725",
  DisName: "勉县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610726",
  DisName: "宁强县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610727",
  DisName: "略阳县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610728",
  DisName: "镇巴县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610729",
  DisName: "留坝县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610730",
  DisName: "佛坪县",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610731",
  DisName: "其它区",
  CityID: "6107",
  DisSort: ""
},
{
  Id: "610802",
  DisName: "榆阳区",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610821",
  DisName: "神木县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610822",
  DisName: "府谷县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610823",
  DisName: "横山县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610824",
  DisName: "靖边县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610825",
  DisName: "定边县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610826",
  DisName: "绥德县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610827",
  DisName: "米脂县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610828",
  DisName: "佳县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610829",
  DisName: "吴堡县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610830",
  DisName: "清涧县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610831",
  DisName: "子洲县",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610832",
  DisName: "其它区",
  CityID: "6108",
  DisSort: ""
},
{
  Id: "610902",
  DisName: "汉滨区",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610921",
  DisName: "汉阴县",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610922",
  DisName: "石泉县",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610923",
  DisName: "宁陕县",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610924",
  DisName: "紫阳县",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610925",
  DisName: "岚皋县",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610926",
  DisName: "平利县",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610927",
  DisName: "镇坪县",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610928",
  DisName: "旬阳县",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610929",
  DisName: "白河县",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "610930",
  DisName: "其它区",
  CityID: "6109",
  DisSort: ""
},
{
  Id: "611002",
  DisName: "商州区",
  CityID: "6110",
  DisSort: ""
},
{
  Id: "611021",
  DisName: "洛南县",
  CityID: "6110",
  DisSort: ""
},
{
  Id: "611022",
  DisName: "丹凤县",
  CityID: "6110",
  DisSort: ""
},
{
  Id: "611023",
  DisName: "商南县",
  CityID: "6110",
  DisSort: ""
},
{
  Id: "611024",
  DisName: "山阳县",
  CityID: "6110",
  DisSort: ""
},
{
  Id: "611025",
  DisName: "镇安县",
  CityID: "6110",
  DisSort: ""
},
{
  Id: "611026",
  DisName: "柞水县",
  CityID: "6110",
  DisSort: ""
},
{
  Id: "611027",
  DisName: "其它区",
  CityID: "6110",
  DisSort: ""
},
{
  Id: "620102",
  DisName: "城关区",
  CityID: "6201",
  DisSort: ""
},
{
  Id: "620103",
  DisName: "七里河区",
  CityID: "6201",
  DisSort: ""
},
{
  Id: "620104",
  DisName: "西固区",
  CityID: "6201",
  DisSort: ""
},
{
  Id: "620105",
  DisName: "安宁区",
  CityID: "6201",
  DisSort: ""
},
{
  Id: "620111",
  DisName: "红古区",
  CityID: "6201",
  DisSort: ""
},
{
  Id: "620121",
  DisName: "永登县",
  CityID: "6201",
  DisSort: ""
},
{
  Id: "620122",
  DisName: "皋兰县",
  CityID: "6201",
  DisSort: ""
},
{
  Id: "620123",
  DisName: "榆中县",
  CityID: "6201",
  DisSort: ""
},
{
  Id: "620124",
  DisName: "其它区",
  CityID: "6201",
  DisSort: ""
},
{
  Id: "620302",
  DisName: "金川区",
  CityID: "6203",
  DisSort: ""
},
{
  Id: "620321",
  DisName: "永昌县",
  CityID: "6203",
  DisSort: ""
},
{
  Id: "620322",
  DisName: "其它区",
  CityID: "6203",
  DisSort: ""
},
{
  Id: "620402",
  DisName: "白银区",
  CityID: "6204",
  DisSort: ""
},
{
  Id: "620403",
  DisName: "平川区",
  CityID: "6204",
  DisSort: ""
},
{
  Id: "620421",
  DisName: "靖远县",
  CityID: "6204",
  DisSort: ""
},
{
  Id: "620422",
  DisName: "会宁县",
  CityID: "6204",
  DisSort: ""
},
{
  Id: "620423",
  DisName: "景泰县",
  CityID: "6204",
  DisSort: ""
},
{
  Id: "620424",
  DisName: "其它区",
  CityID: "6204",
  DisSort: ""
},
{
  Id: "620502",
  DisName: "秦州区",
  CityID: "6205",
  DisSort: ""
},
{
  Id: "620503",
  DisName: "麦积区",
  CityID: "6205",
  DisSort: ""
},
{
  Id: "620521",
  DisName: "清水县",
  CityID: "6205",
  DisSort: ""
},
{
  Id: "620522",
  DisName: "秦安县",
  CityID: "6205",
  DisSort: ""
},
{
  Id: "620523",
  DisName: "甘谷县",
  CityID: "6205",
  DisSort: ""
},
{
  Id: "620524",
  DisName: "武山县",
  CityID: "6205",
  DisSort: ""
},
{
  Id: "620525",
  DisName: "张家川回族自治县",
  CityID: "6205",
  DisSort: ""
},
{
  Id: "620526",
  DisName: "其它区",
  CityID: "6205",
  DisSort: ""
},
{
  Id: "620602",
  DisName: "凉州区",
  CityID: "6206",
  DisSort: ""
},
{
  Id: "620621",
  DisName: "民勤县",
  CityID: "6206",
  DisSort: ""
},
{
  Id: "620622",
  DisName: "古浪县",
  CityID: "6206",
  DisSort: ""
},
{
  Id: "620623",
  DisName: "天祝藏族自治县",
  CityID: "6206",
  DisSort: ""
},
{
  Id: "620624",
  DisName: "其它区",
  CityID: "6206",
  DisSort: ""
},
{
  Id: "620702",
  DisName: "甘州区",
  CityID: "6207",
  DisSort: ""
},
{
  Id: "620721",
  DisName: "肃南裕固族自治县",
  CityID: "6207",
  DisSort: ""
},
{
  Id: "620722",
  DisName: "民乐县",
  CityID: "6207",
  DisSort: ""
},
{
  Id: "620723",
  DisName: "临泽县",
  CityID: "6207",
  DisSort: ""
},
{
  Id: "620724",
  DisName: "高台县",
  CityID: "6207",
  DisSort: ""
},
{
  Id: "620725",
  DisName: "山丹县",
  CityID: "6207",
  DisSort: ""
},
{
  Id: "620726",
  DisName: "其它区",
  CityID: "6207",
  DisSort: ""
},
{
  Id: "620802",
  DisName: "崆峒区",
  CityID: "6208",
  DisSort: ""
},
{
  Id: "620821",
  DisName: "泾川县",
  CityID: "6208",
  DisSort: ""
},
{
  Id: "620822",
  DisName: "灵台县",
  CityID: "6208",
  DisSort: ""
},
{
  Id: "620823",
  DisName: "崇信县",
  CityID: "6208",
  DisSort: ""
},
{
  Id: "620824",
  DisName: "华亭县",
  CityID: "6208",
  DisSort: ""
},
{
  Id: "620825",
  DisName: "庄浪县",
  CityID: "6208",
  DisSort: ""
},
{
  Id: "620826",
  DisName: "静宁县",
  CityID: "6208",
  DisSort: ""
},
{
  Id: "620827",
  DisName: "其它区",
  CityID: "6208",
  DisSort: ""
},
{
  Id: "620902",
  DisName: "肃州区",
  CityID: "6209",
  DisSort: ""
},
{
  Id: "620921",
  DisName: "金塔县",
  CityID: "6209",
  DisSort: ""
},
{
  Id: "620922",
  DisName: "安西县",
  CityID: "6209",
  DisSort: ""
},
{
  Id: "620923",
  DisName: "肃北蒙古族自治县",
  CityID: "6209",
  DisSort: ""
},
{
  Id: "620924",
  DisName: "阿克塞哈萨克族自治县",
  CityID: "6209",
  DisSort: ""
},
{
  Id: "620981",
  DisName: "玉门市",
  CityID: "6209",
  DisSort: ""
},
{
  Id: "620982",
  DisName: "敦煌市",
  CityID: "6209",
  DisSort: ""
},
{
  Id: "620983",
  DisName: "其它区",
  CityID: "6209",
  DisSort: ""
},
{
  Id: "621002",
  DisName: "西峰区",
  CityID: "6210",
  DisSort: ""
},
{
  Id: "621021",
  DisName: "庆城县",
  CityID: "6210",
  DisSort: ""
},
{
  Id: "621022",
  DisName: "环县",
  CityID: "6210",
  DisSort: ""
},
{
  Id: "621023",
  DisName: "华池县",
  CityID: "6210",
  DisSort: ""
},
{
  Id: "621024",
  DisName: "合水县",
  CityID: "6210",
  DisSort: ""
},
{
  Id: "621025",
  DisName: "正宁县",
  CityID: "6210",
  DisSort: ""
},
{
  Id: "621026",
  DisName: "宁县",
  CityID: "6210",
  DisSort: ""
},
{
  Id: "621027",
  DisName: "镇原县",
  CityID: "6210",
  DisSort: ""
},
{
  Id: "621028",
  DisName: "其它区",
  CityID: "6210",
  DisSort: ""
},
{
  Id: "621102",
  DisName: "安定区",
  CityID: "6211",
  DisSort: ""
},
{
  Id: "621121",
  DisName: "通渭县",
  CityID: "6211",
  DisSort: ""
},
{
  Id: "621122",
  DisName: "陇西县",
  CityID: "6211",
  DisSort: ""
},
{
  Id: "621123",
  DisName: "渭源县",
  CityID: "6211",
  DisSort: ""
},
{
  Id: "621124",
  DisName: "临洮县",
  CityID: "6211",
  DisSort: ""
},
{
  Id: "621125",
  DisName: "漳县",
  CityID: "6211",
  DisSort: ""
},
{
  Id: "621126",
  DisName: "岷县",
  CityID: "6211",
  DisSort: ""
},
{
  Id: "621127",
  DisName: "其它区",
  CityID: "6211",
  DisSort: ""
},
{
  Id: "621202",
  DisName: "武都区",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "621221",
  DisName: "成县",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "621222",
  DisName: "文县",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "621223",
  DisName: "宕昌县",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "621224",
  DisName: "康县",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "621225",
  DisName: "西和县",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "621226",
  DisName: "礼县",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "621227",
  DisName: "徽县",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "621228",
  DisName: "两当县",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "621229",
  DisName: "其它区",
  CityID: "6212",
  DisSort: ""
},
{
  Id: "622901",
  DisName: "临夏市",
  CityID: "6229",
  DisSort: ""
},
{
  Id: "622921",
  DisName: "临夏县",
  CityID: "6229",
  DisSort: ""
},
{
  Id: "622922",
  DisName: "康乐县",
  CityID: "6229",
  DisSort: ""
},
{
  Id: "622923",
  DisName: "永靖县",
  CityID: "6229",
  DisSort: ""
},
{
  Id: "622924",
  DisName: "广河县",
  CityID: "6229",
  DisSort: ""
},
{
  Id: "622925",
  DisName: "和政县",
  CityID: "6229",
  DisSort: ""
},
{
  Id: "622926",
  DisName: "东乡族自治县",
  CityID: "6229",
  DisSort: ""
},
{
  Id: "622927",
  DisName: "积石山保安族东乡族撒拉族自治县",
  CityID: "6229",
  DisSort: ""
},
{
  Id: "622928",
  DisName: "其它区",
  CityID: "6229",
  DisSort: ""
},
{
  Id: "623001",
  DisName: "合作市",
  CityID: "6230",
  DisSort: ""
},
{
  Id: "623021",
  DisName: "临潭县",
  CityID: "6230",
  DisSort: ""
},
{
  Id: "623022",
  DisName: "卓尼县",
  CityID: "6230",
  DisSort: ""
},
{
  Id: "623023",
  DisName: "舟曲县",
  CityID: "6230",
  DisSort: ""
},
{
  Id: "623024",
  DisName: "迭部县",
  CityID: "6230",
  DisSort: ""
},
{
  Id: "623025",
  DisName: "玛曲县",
  CityID: "6230",
  DisSort: ""
},
{
  Id: "623026",
  DisName: "碌曲县",
  CityID: "6230",
  DisSort: ""
},
{
  Id: "623027",
  DisName: "夏河县",
  CityID: "6230",
  DisSort: ""
},
{
  Id: "623028",
  DisName: "其它区",
  CityID: "6230",
  DisSort: ""
},
{
  Id: "630102",
  DisName: "城东区",
  CityID: "6301",
  DisSort: ""
},
{
  Id: "630103",
  DisName: "城中区",
  CityID: "6301",
  DisSort: ""
},
{
  Id: "630104",
  DisName: "城西区",
  CityID: "6301",
  DisSort: ""
},
{
  Id: "630105",
  DisName: "城北区",
  CityID: "6301",
  DisSort: ""
},
{
  Id: "630121",
  DisName: "大通回族土族自治县",
  CityID: "6301",
  DisSort: ""
},
{
  Id: "630122",
  DisName: "湟中县",
  CityID: "6301",
  DisSort: ""
},
{
  Id: "630123",
  DisName: "湟源县",
  CityID: "6301",
  DisSort: ""
},
{
  Id: "630124",
  DisName: "其它区",
  CityID: "6301",
  DisSort: ""
},
{
  Id: "632121",
  DisName: "平安县",
  CityID: "6321",
  DisSort: ""
},
{
  Id: "632122",
  DisName: "民和回族土族自治县",
  CityID: "6321",
  DisSort: ""
},
{
  Id: "632123",
  DisName: "乐都县",
  CityID: "6321",
  DisSort: ""
},
{
  Id: "632126",
  DisName: "互助土族自治县",
  CityID: "6321",
  DisSort: ""
},
{
  Id: "632127",
  DisName: "化隆回族自治县",
  CityID: "6321",
  DisSort: ""
},
{
  Id: "632128",
  DisName: "循化撒拉族自治县",
  CityID: "6321",
  DisSort: ""
},
{
  Id: "632129",
  DisName: "其它区",
  CityID: "6321",
  DisSort: ""
},
{
  Id: "632221",
  DisName: "门源回族自治县",
  CityID: "6322",
  DisSort: ""
},
{
  Id: "632222",
  DisName: "祁连县",
  CityID: "6322",
  DisSort: ""
},
{
  Id: "632223",
  DisName: "海晏县",
  CityID: "6322",
  DisSort: ""
},
{
  Id: "632224",
  DisName: "刚察县",
  CityID: "6322",
  DisSort: ""
},
{
  Id: "632225",
  DisName: "其它区",
  CityID: "6322",
  DisSort: ""
},
{
  Id: "632321",
  DisName: "同仁县",
  CityID: "6323",
  DisSort: ""
},
{
  Id: "632322",
  DisName: "尖扎县",
  CityID: "6323",
  DisSort: ""
},
{
  Id: "632323",
  DisName: "泽库县",
  CityID: "6323",
  DisSort: ""
},
{
  Id: "632324",
  DisName: "河南蒙古族自治县",
  CityID: "6323",
  DisSort: ""
},
{
  Id: "632325",
  DisName: "其它区",
  CityID: "6323",
  DisSort: ""
},
{
  Id: "632521",
  DisName: "共和县",
  CityID: "6325",
  DisSort: ""
},
{
  Id: "632522",
  DisName: "同德县",
  CityID: "6325",
  DisSort: ""
},
{
  Id: "632523",
  DisName: "贵德县",
  CityID: "6325",
  DisSort: ""
},
{
  Id: "632524",
  DisName: "兴海县",
  CityID: "6325",
  DisSort: ""
},
{
  Id: "632525",
  DisName: "贵南县",
  CityID: "6325",
  DisSort: ""
},
{
  Id: "632526",
  DisName: "其它区",
  CityID: "6325",
  DisSort: ""
},
{
  Id: "632621",
  DisName: "玛沁县",
  CityID: "6326",
  DisSort: ""
},
{
  Id: "632622",
  DisName: "班玛县",
  CityID: "6326",
  DisSort: ""
},
{
  Id: "632623",
  DisName: "甘德县",
  CityID: "6326",
  DisSort: ""
},
{
  Id: "632624",
  DisName: "达日县",
  CityID: "6326",
  DisSort: ""
},
{
  Id: "632625",
  DisName: "久治县",
  CityID: "6326",
  DisSort: ""
},
{
  Id: "632626",
  DisName: "玛多县",
  CityID: "6326",
  DisSort: ""
},
{
  Id: "632627",
  DisName: "其它区",
  CityID: "6326",
  DisSort: ""
},
{
  Id: "632721",
  DisName: "玉树县",
  CityID: "6327",
  DisSort: ""
},
{
  Id: "632722",
  DisName: "杂多县",
  CityID: "6327",
  DisSort: ""
},
{
  Id: "632723",
  DisName: "称多县",
  CityID: "6327",
  DisSort: ""
},
{
  Id: "632724",
  DisName: "治多县",
  CityID: "6327",
  DisSort: ""
},
{
  Id: "632725",
  DisName: "囊谦县",
  CityID: "6327",
  DisSort: ""
},
{
  Id: "632726",
  DisName: "曲麻莱县",
  CityID: "6327",
  DisSort: ""
},
{
  Id: "632727",
  DisName: "其它区",
  CityID: "6327",
  DisSort: ""
},
{
  Id: "632801",
  DisName: "格尔木市",
  CityID: "6328",
  DisSort: ""
},
{
  Id: "632802",
  DisName: "德令哈市",
  CityID: "6328",
  DisSort: ""
},
{
  Id: "632821",
  DisName: "乌兰县",
  CityID: "6328",
  DisSort: ""
},
{
  Id: "632822",
  DisName: "都兰县",
  CityID: "6328",
  DisSort: ""
},
{
  Id: "632823",
  DisName: "天峻县",
  CityID: "6328",
  DisSort: ""
},
{
  Id: "632824",
  DisName: "其它区",
  CityID: "6328",
  DisSort: ""
},
{
  Id: "640104",
  DisName: "兴庆区",
  CityID: "6401",
  DisSort: ""
},
{
  Id: "640105",
  DisName: "西夏区",
  CityID: "6401",
  DisSort: ""
},
{
  Id: "640106",
  DisName: "金凤区",
  CityID: "6401",
  DisSort: ""
},
{
  Id: "640121",
  DisName: "永宁县",
  CityID: "6401",
  DisSort: ""
},
{
  Id: "640122",
  DisName: "贺兰县",
  CityID: "6401",
  DisSort: ""
},
{
  Id: "640181",
  DisName: "灵武市",
  CityID: "6401",
  DisSort: ""
},
{
  Id: "640182",
  DisName: "其它区",
  CityID: "6401",
  DisSort: ""
},
{
  Id: "640202",
  DisName: "大武口区",
  CityID: "6402",
  DisSort: ""
},
{
  Id: "640205",
  DisName: "惠农区",
  CityID: "6402",
  DisSort: ""
},
{
  Id: "640221",
  DisName: "平罗县",
  CityID: "6402",
  DisSort: ""
},
{
  Id: "640222",
  DisName: "其它区",
  CityID: "6402",
  DisSort: ""
},
{
  Id: "640302",
  DisName: "利通区",
  CityID: "6403",
  DisSort: ""
},
{
  Id: "640303",
  DisName: "红寺堡区",
  CityID: "6403",
  DisSort: ""
},
{
  Id: "640323",
  DisName: "盐池县",
  CityID: "6403",
  DisSort: ""
},
{
  Id: "640324",
  DisName: "同心县",
  CityID: "6403",
  DisSort: ""
},
{
  Id: "640381",
  DisName: "青铜峡市",
  CityID: "6403",
  DisSort: ""
},
{
  Id: "640382",
  DisName: "其它区",
  CityID: "6403",
  DisSort: ""
},
{
  Id: "640402",
  DisName: "原州区",
  CityID: "6404",
  DisSort: ""
},
{
  Id: "640422",
  DisName: "西吉县",
  CityID: "6404",
  DisSort: ""
},
{
  Id: "640423",
  DisName: "隆德县",
  CityID: "6404",
  DisSort: ""
},
{
  Id: "640424",
  DisName: "泾源县",
  CityID: "6404",
  DisSort: ""
},
{
  Id: "640425",
  DisName: "彭阳县",
  CityID: "6404",
  DisSort: ""
},
{
  Id: "640426",
  DisName: "其它区",
  CityID: "6404",
  DisSort: ""
},
{
  Id: "640502",
  DisName: "沙坡头区",
  CityID: "6405",
  DisSort: ""
},
{
  Id: "640521",
  DisName: "中宁县",
  CityID: "6405",
  DisSort: ""
},
{
  Id: "640522",
  DisName: "海原县",
  CityID: "6405",
  DisSort: ""
},
{
  Id: "640523",
  DisName: "其它区",
  CityID: "6405",
  DisSort: ""
},
{
  Id: "650102",
  DisName: "天山区",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650103",
  DisName: "沙依巴克区",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650104",
  DisName: "新市区",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650105",
  DisName: "水磨沟区",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650106",
  DisName: "头屯河区",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650107",
  DisName: "达坂城区",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650108",
  DisName: "东山区",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650109",
  DisName: "米东区",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650121",
  DisName: "乌鲁木齐县",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650122",
  DisName: "其它区",
  CityID: "6501",
  DisSort: ""
},
{
  Id: "650202",
  DisName: "独山子区",
  CityID: "6502",
  DisSort: ""
},
{
  Id: "650203",
  DisName: "克拉玛依区",
  CityID: "6502",
  DisSort: ""
},
{
  Id: "650204",
  DisName: "白碱滩区",
  CityID: "6502",
  DisSort: ""
},
{
  Id: "650205",
  DisName: "乌尔禾区",
  CityID: "6502",
  DisSort: ""
},
{
  Id: "650206",
  DisName: "其它区",
  CityID: "6502",
  DisSort: ""
},
{
  Id: "652101",
  DisName: "吐鲁番市",
  CityID: "6521",
  DisSort: ""
},
{
  Id: "652122",
  DisName: "鄯善县",
  CityID: "6521",
  DisSort: ""
},
{
  Id: "652123",
  DisName: "托克逊县",
  CityID: "6521",
  DisSort: ""
},
{
  Id: "652124",
  DisName: "其它区",
  CityID: "6521",
  DisSort: ""
},
{
  Id: "652201",
  DisName: "哈密市",
  CityID: "6522",
  DisSort: ""
},
{
  Id: "652222",
  DisName: "巴里坤哈萨克自治县",
  CityID: "6522",
  DisSort: ""
},
{
  Id: "652223",
  DisName: "伊吾县",
  CityID: "6522",
  DisSort: ""
},
{
  Id: "652224",
  DisName: "其它区",
  CityID: "6522",
  DisSort: ""
},
{
  Id: "652301",
  DisName: "昌吉市",
  CityID: "6523",
  DisSort: ""
},
{
  Id: "652302",
  DisName: "阜康市",
  CityID: "6523",
  DisSort: ""
},
{
  Id: "652303",
  DisName: "米泉市",
  CityID: "6523",
  DisSort: ""
},
{
  Id: "652323",
  DisName: "呼图壁县",
  CityID: "6523",
  DisSort: ""
},
{
  Id: "652324",
  DisName: "玛纳斯县",
  CityID: "6523",
  DisSort: ""
},
{
  Id: "652325",
  DisName: "奇台县",
  CityID: "6523",
  DisSort: ""
},
{
  Id: "652327",
  DisName: "吉木萨尔县",
  CityID: "6523",
  DisSort: ""
},
{
  Id: "652328",
  DisName: "木垒哈萨克自治县",
  CityID: "6523",
  DisSort: ""
},
{
  Id: "652329",
  DisName: "其它区",
  CityID: "6523",
  DisSort: ""
},
{
  Id: "652701",
  DisName: "博乐市",
  CityID: "6527",
  DisSort: ""
},
{
  Id: "652722",
  DisName: "精河县",
  CityID: "6527",
  DisSort: ""
},
{
  Id: "652723",
  DisName: "温泉县",
  CityID: "6527",
  DisSort: ""
},
{
  Id: "652724",
  DisName: "其它区",
  CityID: "6527",
  DisSort: ""
},
{
  Id: "652801",
  DisName: "库尔勒市",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652822",
  DisName: "轮台县",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652823",
  DisName: "尉犁县",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652824",
  DisName: "若羌县",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652825",
  DisName: "且末县",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652826",
  DisName: "焉耆回族自治县",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652827",
  DisName: "和静县",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652828",
  DisName: "和硕县",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652829",
  DisName: "博湖县",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652830",
  DisName: "其它区",
  CityID: "6528",
  DisSort: ""
},
{
  Id: "652901",
  DisName: "阿克苏市",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "652922",
  DisName: "温宿县",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "652923",
  DisName: "库车县",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "652924",
  DisName: "沙雅县",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "652925",
  DisName: "新和县",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "652926",
  DisName: "拜城县",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "652927",
  DisName: "乌什县",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "652928",
  DisName: "阿瓦提县",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "652929",
  DisName: "柯坪县",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "652930",
  DisName: "其它区",
  CityID: "6529",
  DisSort: ""
},
{
  Id: "653001",
  DisName: "阿图什市",
  CityID: "6530",
  DisSort: ""
},
{
  Id: "653022",
  DisName: "阿克陶县",
  CityID: "6530",
  DisSort: ""
},
{
  Id: "653023",
  DisName: "阿合奇县",
  CityID: "6530",
  DisSort: ""
},
{
  Id: "653024",
  DisName: "乌恰县",
  CityID: "6530",
  DisSort: ""
},
{
  Id: "653025",
  DisName: "其它区",
  CityID: "6530",
  DisSort: ""
},
{
  Id: "653101",
  DisName: "喀什市",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653121",
  DisName: "疏附县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653122",
  DisName: "疏勒县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653123",
  DisName: "英吉沙县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653124",
  DisName: "泽普县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653125",
  DisName: "莎车县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653126",
  DisName: "叶城县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653127",
  DisName: "麦盖提县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653128",
  DisName: "岳普湖县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653129",
  DisName: "伽师县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653130",
  DisName: "巴楚县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653131",
  DisName: "塔什库尔干塔吉克自治县",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653132",
  DisName: "其它区",
  CityID: "6531",
  DisSort: ""
},
{
  Id: "653201",
  DisName: "和田市",
  CityID: "6532",
  DisSort: ""
},
{
  Id: "653221",
  DisName: "和田县",
  CityID: "6532",
  DisSort: ""
},
{
  Id: "653222",
  DisName: "墨玉县",
  CityID: "6532",
  DisSort: ""
},
{
  Id: "653223",
  DisName: "皮山县",
  CityID: "6532",
  DisSort: ""
},
{
  Id: "653224",
  DisName: "洛浦县",
  CityID: "6532",
  DisSort: ""
},
{
  Id: "653225",
  DisName: "策勒县",
  CityID: "6532",
  DisSort: ""
},
{
  Id: "653226",
  DisName: "于田县",
  CityID: "6532",
  DisSort: ""
},
{
  Id: "653227",
  DisName: "民丰县",
  CityID: "6532",
  DisSort: ""
},
{
  Id: "653228",
  DisName: "其它区",
  CityID: "6532",
  DisSort: ""
},
{
  Id: "654002",
  DisName: "伊宁市",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654003",
  DisName: "奎屯市",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654021",
  DisName: "伊宁县",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654022",
  DisName: "察布查尔锡伯自治县",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654023",
  DisName: "霍城县",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654024",
  DisName: "巩留县",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654025",
  DisName: "新源县",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654026",
  DisName: "昭苏县",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654027",
  DisName: "特克斯县",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654028",
  DisName: "尼勒克县",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654029",
  DisName: "其它区",
  CityID: "6540",
  DisSort: ""
},
{
  Id: "654201",
  DisName: "塔城市",
  CityID: "6542",
  DisSort: ""
},
{
  Id: "654202",
  DisName: "乌苏市",
  CityID: "6542",
  DisSort: ""
},
{
  Id: "654221",
  DisName: "额敏县",
  CityID: "6542",
  DisSort: ""
},
{
  Id: "654223",
  DisName: "沙湾县",
  CityID: "6542",
  DisSort: ""
},
{
  Id: "654224",
  DisName: "托里县",
  CityID: "6542",
  DisSort: ""
},
{
  Id: "654225",
  DisName: "裕民县",
  CityID: "6542",
  DisSort: ""
},
{
  Id: "654226",
  DisName: "和布克赛尔蒙古自治县",
  CityID: "6542",
  DisSort: ""
},
{
  Id: "654227",
  DisName: "其它区",
  CityID: "6542",
  DisSort: ""
},
{
  Id: "654301",
  DisName: "阿勒泰市",
  CityID: "6543",
  DisSort: ""
},
{
  Id: "654321",
  DisName: "布尔津县",
  CityID: "6543",
  DisSort: ""
},
{
  Id: "654322",
  DisName: "富蕴县",
  CityID: "6543",
  DisSort: ""
},
{
  Id: "654323",
  DisName: "福海县",
  CityID: "6543",
  DisSort: ""
},
{
  Id: "654324",
  DisName: "哈巴河县",
  CityID: "6543",
  DisSort: ""
},
{
  Id: "654325",
  DisName: "青河县",
  CityID: "6543",
  DisSort: ""
},
{
  Id: "654326",
  DisName: "吉木乃县",
  CityID: "6543",
  DisSort: ""
},
{
  Id: "654327",
  DisName: "其它区",
  CityID: "6543",
  DisSort: ""
},
{
  Id: "620201",
  DisName: "新城镇",
  CityID: "6202",
  DisSort: ""
},
{
  Id: "620202",
  DisName: "峪泉镇",
  CityID: "6202",
  DisSort: ""
},
{
  Id: "620203",
  DisName: "文殊镇",
  CityID: "6202",
  DisSort: ""
},
{
  Id: "620204",
  DisName: "雄关区",
  CityID: "6202",
  DisSort: ""
},
{
  Id: "620205",
  DisName: "镜铁区",
  CityID: "6202",
  DisSort: ""
},
{
  Id: "620206",
  DisName: "长城区",
  CityID: "6202",
  DisSort: ""
}];


var proviceData = new Array(), cityData = new Array(), districtData = new Array();
var proviceNum = 0, cityNum = 0, districtNum = 0;
var provice, city, district;




//修改地址 - 赋值
function xiugaiDizhi(that, obj) {
  for (var i = 0; i < provinceArr.length; i++) {
    if (provinceArr[i].ProID == obj.provinceCode) {
      proviceNum = i;
      cityData = provinceoCity(obj.provinceCode);
    };
  };

  //找到城市的索引
  for (var j = 0; j < cityData.length; j++) {
    if (cityData[j].CityID == obj.cityCode) {
      cityNum = j;
      districtData = cityDistrict(obj.cityCode, cityData[j].name);
    };
  };



  //找到地区的索引
  for (var i = 0; i < districtData.length; i++) {
    if (districtData[i].Id == obj.areaCode) {
      districtNum = i;
    };
  };

  that.setData({
    index1: proviceNum,
    index2: cityNum,
    index3: districtNum,
    cityData: cityData,
    districtData: districtData
  });

};

//初始化
function init(that) {
  proviceData = provinceArr;
  cityData = [{
    CityID: 0,
    name: "--城市--",
    ProID: 0,
    CitySort: 0
  }];
  districtData = [{
    Id: 0,
    DisName: "--地区--",
    CityID: 0,
    DisSort: ""
  }];
  cityData.length = 1;
  districtData.length = 1;
  that.setData({
    proviceData: proviceData,
    cityData: cityData,
    districtData: districtData
  });
};

//根据省份决定城市数据
function provinceoCity(provinceCode, that) {
  if (provinceCode == 0) {
    return;
  };
  var arr = new Array();
  arr.push(cityData[0]);
  for (var i = 0; i < cityArr.length; i++) {
    if (cityArr[i].ProID == provinceCode) {
      arr.push(cityArr[i]);
    };
  };
  return arr;
};


//根据城市决定地区数据
function cityDistrict(cityCode, cityName) {
  var arr = new Array();
  arr.push(districtData[0]);

  for (var i = 0; i < areaArr.length; i++) {
    if (areaArr[i].CityID == cityCode) {
      arr.push(areaArr[i]);
    };
  };
  if (arr.length == 1) {
    arr.push({
      Id: 1,
      DisName: cityName,
      CityID: 1,
      DisSort: ''
    });
  };
  return arr;
};

//滑动事件
function change(Type, num, that) {
  var nNumber = Number(num);
  if (nNumber == 0 && Type == 1) {
    that.setData({
      cityData: [{
        CityID: 0,
        name: "--城市--",
        ProID: 0,
        CitySort: 0
      }],
      districtData: [{
        Id: 0,
        DisName: "--地区--",
        CityID: 0,
        DisSort: ""
      }]
    });
    return;
  };
  if (nNumber == 0 && Type == 2) {
    that.setData({
      districtData: [{
        Id: 0,
        DisName: "--地区--",
        CityID: 0,
        DisSort: ""
      }]
    });
    return;
  };
  if (Type == 1) {
    //滑动省
    cityData = provinceoCity(proviceData[nNumber].ProID, that);
    that.setData({
      cityData: cityData,
      districtData: [{
        Id: 0,
        DisName: "--地区--",
        CityID: 0,
        DisSort: ""
      }]
    });
  } else if (Type == 2) {
    //滑动市
    districtData = cityDistrict(cityData[nNumber].CityID, cityData[nNumber].name);
    that.setData({
      districtData: districtData
    });
  };
};


//通过省名 获取对应ID
function getCodeSheng(name) {
  for (var i = 0; i < provinceArr.length; i++) {
    if (provinceArr[i].name == name) {
      return provinceArr[i].ProID;
    };
  };
};

//通过城市名 获取对应ID
function getCodeCity(name) {
  for (var i = 0; i < cityArr.length; i++) {
    if (cityArr[i].name == name) {
      return cityArr[i].CityID;
    };
  };
};

//通过城市名 获取对应ID
function getCodeQu(name) {
  for (var i = 0; i < areaArr.length; i++) {
    if (areaArr[i].DisName == name) {
      return areaArr[i].Id;
    };
  };
};


function getCitys() {
  var provinces = provinceArr;
  provinces[0].name = '全国';
  return provinces;
};

function getProvinceIndex(provName) {
  for (let i = 0; i < provinceArr.length; i++) {
    if (provName == provinceArr[i].name) {
      return i;
    }
  }
}

function getCityIndex(cityName,that) {
  let cityData = that.data.cityData;
  for (let i = 0; i < cityData.length; i++) {
    if (cityName == cityData[i].name) {
      return i;
    }
  }
}

function getDistrictIndex(distName,that) {
  let districtData = that.data.districtData;
  for (let i = 0; i < districtData.length; i++) {
    if (distName == districtData[i].DisName) {
      return i;
    }
  }
}


module.exports = {
  provinceArr: provinceArr,
  init: init,
  change: change,
  xiugaiDizhi: xiugaiDizhi,
  getCodeSheng: getCodeSheng,
  getCodeCity: getCodeCity,
  getCodeQu: getCodeQu,
  getCitys: getCitys,
  getProvinceIndex: getProvinceIndex,
  getCityIndex: getCityIndex,
  getDistrictIndex:getDistrictIndex,

}