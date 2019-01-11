<template>
    <div id="layout">
        <header></header>
        <center style="margin-top:15%;">
            <Form :model="FormLogin" inline>
                <Row>
                    <FormItem prop="账号">
                        <Input type="text" v-model="FormLogin.username" placeholder="360账号">
                            <Icon type="person" size="20" slot="prepend"></Icon>
                         </Input>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem prop="密码">
                        <Input type="password" v-model="FormLogin.password" placeholder="360密码">
                            <Icon type="locked" size="20" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                </Row>
                <Row>    
                    <FormItem prop="key">
                        <Input type="password" v-model="FormLogin.key" placeholder="key">
                            <Icon type="key" size="20" slot="prepend"></Icon>
                        </Input>
                    </FormItem>
                </Row>
                <Row>   
                    <FormItem>
                        <Button type="primary" @click="loadVerifyPage" >登录</Button>
                    </FormItem>
                </Row>
            </Form>
            <Modal v-model="isVerifyShow" width="360">
                <div style="text-align:center" class="imgBox">
                    <canvas width="293" height="190" @click="createVerifyCodePos($event)" id="verifyCanvas"></canvas>
                </div>
                <div slot="footer" style="text-align:center;">
                    <Button type="primary" @click="submitForm()" >提交</Button>
                </div>
            </Modal>
        </center>
        <footer></footer>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                isVerifyShow:false,
                canvasList:{},
                FormLogin: {
                    app_id:'',
                    username: '',
                    password: '',
                    verify:""
                }
            }
        },
        mounted: function () {
            var that = this;
            this.$nextTick(function () {
                this.$http.get(this.$config.RquestUrl.login_init, null).then(function (res) {
                    var response = JSON.parse(res.data);
                    if(!response.status){
                        that.$Message.error("登录页面加载失败");
                        that.Sleep(700).then(() => {
                            window.location.reload();
                        })
                    }else{
                        var data = JSON.parse(response.data)
                        that.FormLogin.app_id = data.app_id
                    }
                }).then((error)=> this.error = error)
            })
        },
        methods: {
            loadVerifyPage(){
                console.log(this.FormLogin)
                if(this.FormLogin.app_id == ""){
                    this.$Message.error("APPID为空");
                    return;
                }
                this.$Spin.show();
                var that = this;
                //获取验证码图片
                var canvas=document.getElementById('verifyCanvas');
                var ctx=canvas.getContext('2d');
                var img=new Image();
                img.onload=function() {
                    ctx.drawImage(img,0,0,293,190 );
                    //显示验证页面
                    that.$Spin.hide();
                    that.isVerifyShow = true;
                }
                img.src=this.$config.RquestUrl.login_verify +"?rand="+ Math.random()+"&app_id="+this.FormLogin.app_id;
                img.onerror = function(){
                    that.$Spin.hide();
                    that.$Message.error("验证码加载失败");
                    that.Sleep(700).then(() => {
                        window.location.reload();
                    })
                }
                //获取标记图片
                var tagImg=new Image();
                tagImg.src="https://cn.vuejs.org/images/logo.png";
            },
            createVerifyCodePos(event){
                var x = event["offsetX"];
                var y = event["offsetY"];
                if(this.FormLogin.verify == ""){
                    this.FormLogin.verify += x+","+ (y - 30)
                }else{
                    this.FormLogin.verify += "," + x+","+ (y - 30)
                }
                var canvas=document.getElementById('verifyCanvas');
                var ctx=canvas.getContext('2d');
                var img=new Image();
                img.onload=function() {
                    ctx.drawImage(img,x-10,y-10,20,20 );
                }
                img.src="https://cn.vuejs.org/images/logo.png";
            },
            submitForm(){
                let that = this;
                this.isVerifyShow = false;
                this.$http.post(this.$config.RquestUrl.user_login, this.FormLogin).then(function (res) {
                    if (res.status === 200) {
                        var response = JSON.parse(res.data);
                        if(response.status){
                            that.$Message.success(response.message);
                            var arr_data = response.data.access_token.split(".");
                            var payload = JSON.parse(Base64.decode(arr_data[1]));
                            var exp_date = new Date(payload.Exp * 1000);
                            that.$cookie.set("access_token",response.data.access_token, { expires: exp_date })
                            that.$router.push({ path: '/' });
                        }else{
                            that.FormLogin.verify = '';
                            that.isVerifyShow = false;
                            that.$Message.error(response.message);
                        }
                    }
                }).then((error)=> this.error = error)
            }
        }
    }
</script>
