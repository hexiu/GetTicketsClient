<template>
    <div id="layout">
        <Layout>
        <header :style="{width: '100%'}">
            <Menu mode="horizontal" theme="dark" active-name="home" @on-select="menuSelect">
                <div class="layout-logo"></div>
                <div class="layout-nav">
                  <MenuItem name="home">
                    <Icon type="home" size="18" style="vertical-align: text-bottom;"></Icon>首页
                  </MenuItem>
                  <MenuItem name="task">
                    <Icon type="calendar" size="18" style="vertical-align: text-bottom;"></Icon>任务列表
                  </MenuItem>
                  <MenuItem name="ticket">
                    <Icon type="plus-round" size="18" style="vertical-align: text-bottom;"></Icon>添加任务
                  </MenuItem>
                  <MenuItem name="logout" style="float:right">
                    <Icon type="person" size="18" style="vertical-align: text-bottom;"></Icon>Hi {{ username }}
                  </MenuItem>
                </div>
            </Menu>
        </Header>
        </Layout>
        <center id="centent" style="margin-top:18%;">
          <span>Welocme {{ username }}</span>
        </center>
        <footer></footer>
    </div>
</template>
<script>
    export default {
        data () {
            return {
                username:this.getUserName(),
            }
        },
        mounted: function () {
            this.$nextTick(function () {
            })
        },
        methods: {
            //选择菜单
            menuSelect(name){
            switch(name){
                case "home":
                this.$router.push({path:"/"})
                break;
                case "task":
                this.$router.push({path:"/task"})
                break;
                case "ticket":
                this.$router.push({path:"/ticket"})
                break;
                case "logout":
                this.$router.push({path:"/logout"})
                break;
            }
            },
            //获取登录用户名
            getUserName(){
            return this.JWT.getUserName()
            }, 
        }
    }
</script>
