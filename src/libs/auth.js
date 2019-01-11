import Cookie from 'vue-cookie';

const SERVER_URL = 'http://127.0.0.1:8989'
const LOGIN_URL = SERVER_URL+'/login'

export default{
    data:{
        access_toen:undefined
    },
    setAccessToken(token){
        this.access_toen = token;
    },
    checkAuth(){
        if(this.access_toen == undefined){
            return false;
        }
        var jwt_data = this.access_toen.split(".");
        var payload = JSON.parse(Base64.decode(jwt_data[1]));
        //检测JWT是否过期
        if(payload.exp <= Math.round(new Date().getTime()/1000) ){
            Cookie.delete('access_token');
            this.access_toen = undefined;
            return false;
        }
        //检测什么时间之后可用
        if(payload.nbf >= Math.round(new Date().getTime()/1000) ){
            this.access_toen = undefined;
            return false;
        }
        return true;
    },
    getUserName(){
        if(this.access_toen == undefined){
            return false;
        }
        var jwt_data = this.access_toen.split(".");
        var payload = JSON.parse(Base64.decode(jwt_data[1]));
        var user_info = JSON.parse(payload.data);
        return user_info.username;
    }
}