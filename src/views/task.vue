<template>
    <div id="layout">
        <Layout>
        <header :style="{width: '100%'}">
            <Menu mode="horizontal" theme="dark" active-name="task" @on-select="menuSelect">
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
        <center id="centent" style="margin-top:5%;">
            <Card :bordered="true" :padding="0" style="width:90%;margin-top:10px;">
              <Row slot="title" style="text-align:left;">
                <span>任务列表</span>
              </Row>
              <Row>
                <Table stripe height="400" style="border:none;" border :columns="TaskHeader" :data="TaskData"></Table>
              </Row>
            </Card>
            <Modal v-model="isShowTaskLogs" :scrollable="true" width="90%">
                <div class="imgBox">
                    
                </div>
                <div slot="footer" style="text-align:center;">
                    <Button type="primary" @click="closeShowTaskLogs" >关闭</Button>
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
                isShowTaskLogs:false,
                username:this.getUserName(),
                TaskHeader:[
                    {
                        title: "任务ID",
                        width: 150,
                        key: "task_id",
                        sortable: true
                    },
                    {
                        title: "车次",
                        width: 150,
                        key: "train_code",
                        sortable: true
                    },
                    {
                        title: "始发站",
                        width: 150,
                        key: "start_name",
                        sortable: true
                    },
                    {
                        title: "终点站",
                        width: 150,
                        key: "end_name",
                        sortable: true
                    },
                    {
                        title: "出发时间",
                        width: 200,
                        key: "date_time",
                        sortable: true
                    },
                    {
                        title: "任务状态",
                        width: 174,
                        key: "task_status_name",
                        sortable: true
                    },
                    {
                        title: "取票码",
                        width: 200,
                        key: "ticket_code",
                        sortable: true
                    },
                    {
                        title: "任务管理",
                        width: 250,
                        key: "task_option",
                        align: 'center',
                        sortable: false,
                        render: (h, params) => {
                            return h('div', [
                            h('Button',{
                                    props: {
                                        type: 'error',
                                        size: 'small'
                                    },
                                    style:{
                                        margin:"10px",
                                    }
                            },'结束任务'),
                            h('Button',{
                                    props: {
                                        type: 'success',
                                        size: 'small'
                                    },
                                    on:{
                                        click: () => {
                                            this.showTaskLogs(params.row)
                                        }
                                    }
                            },'查看日志')
                            ]);
                        }
                    }
                ],
                TaskData:[],
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                let that = this;
                this.$http.get(this.$config.RquestUrl.add_task,null).then(function (res) {
                    if(res.status == 200){
                        var response = JSON.parse(res.data);
                        if(response.status){
                            for(var x in response.data){
                                response.data[x].task_status_name = response.data[x].task_status == true ? "进行中" : "已结束"
                                that.TaskData.push(response.data[x])
                            }
                        }else{
                            that.$Message.error(response.message);
                        }
                    }
                }).then((error)=> this.error = error)
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
            showTaskLogs(index){
                console.log(index)
                this.isShowTaskLogs = true;
                let that = this;
                this.$http.get(this.$config.RquestUrl.task_log+"/"+index.task_id,null).then(function (res) {
                    if(res.status == 200){
                        console.log(res)
                    }
                }).then((error)=> this.error = error)
            },
            closeShowTaskLogs(event){

            }
        }
    }
</script>
