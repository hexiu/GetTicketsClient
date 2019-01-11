import Vue from 'vue';
import iView from 'iview';
import VueRouter from 'vue-router';
import Routers from './router';
import _loadConfig from './config/config';
import Auth from './libs/auth';
import App from './app.vue';
import axios from 'axios';
import Qs from 'qs';
import Base64 from 'js-base64';
import VueCookie from 'vue-cookie';
import 'iview/dist/styles/iview.css';

Vue.prototype.$http = axios;
Vue.prototype.Qs = Qs;
Vue.prototype.$config = _loadConfig;
Vue.prototype.JWT = Auth;
Vue.prototype.Sleep = function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}
Vue.use(Base64);
Vue.use(VueCookie);
Vue.use(VueRouter);
Vue.use(iView);

// 路由配置
const RouterConfig = {
    mode: 'history',
    routes: Routers
};
const router = new VueRouter(RouterConfig);
//添加请求拦截器
Vue.prototype.$http.interceptors.request.use(config => {
    //在发送请求之前做某事，比如说 设置loading动画显示
    var access_token = VueCookie.get("access_token");
    if(access_token != undefined){
        config.headers['Authorization'] = 'Bearer ' + access_token;
    }
    config.data = Qs.stringify(config.data);
    return config
  })
// 添加响应拦截器
Vue.prototype.$http.interceptors.response.use(function (response) {
    // 对响应数据做点什么
    var data = JSON.parse(response.data);
    if(!data.login){
        VueCookie.delete("access_token");
        router.push({path:"/login"})
    }
    return response;
  });

router.beforeEach((to, from, next) => {
    Auth.setAccessToken(VueCookie.get("access_token"));
    //没有登录
    if (!Auth.checkAuth()) {
        //不是登录页面
        if(to['path'] !='/login'){
            iView.LoadingBar.start();
            router.push({path:"/login"})
        }
        //登录页
        iView.LoadingBar.start();
        next();
        return;
    }
    //已经登录
    if(Auth.checkAuth()){
        //判断是否访问登录页面
        if(to['path'] == '/login'){
            iView.LoadingBar.start();
            router.push({path:"/"})
        }
        iView.LoadingBar.start();
        next();
        return;
    }
    //其他
    iView.LoadingBar.start();
    next();
});

router.afterEach((to, from, next) => {
    iView.LoadingBar.finish();
    window.scrollTo(0, 0);
});

new Vue({
    el: '#app',
    router: router,
    render: h => h(App)
});
