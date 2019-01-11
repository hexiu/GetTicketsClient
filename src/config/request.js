//API地址
const HTTP_SERVER = 'http://12306.jaxiu.cn:9000';
//API版本
const API_VERSION = '/v1'
//请求列表
let config = {
    //登录验证图片
    login_verify : HTTP_SERVER + API_VERSION + "/auth/verifyCode",
    //用户登录
    user_login : HTTP_SERVER + API_VERSION + "/auth/login",
    //登录Init
    login_init : HTTP_SERVER + API_VERSION + "/auth/init",
    //站台信息查询
    station_query : HTTP_SERVER + API_VERSION + "/station",
    //车次查询init
    schedule_init : HTTP_SERVER + API_VERSION + "/schedule/init",
    //车次查询
    schedule_query : HTTP_SERVER + API_VERSION + "/schedule",
    //乘客查询
    passenger_query : HTTP_SERVER + API_VERSION + "/passenger",
    //抢票任务,添加和查看
    add_task : HTTP_SERVER + API_VERSION + "/task",
    //添加下单任务
    task_log : HTTP_SERVER + API_VERSION + "/task/log",
};
export default config;