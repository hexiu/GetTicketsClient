<template>
    <div id="layout">
        <Layout>
        <header :style="{width: '100%'}">
            <Menu mode="horizontal" theme="dark" active-name="ticket" @on-select="menuSelect">
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
            <Card style="width:90%;text-align:center;">
                <Form ref="FormQuery" style="margin:0px auto;"  :model="FormQuery" :label-width="80" label-position="right" inline>
                    <FormItem label="出发地" style="margin:0px auto;">
                        <AutoComplete icon="flag"
                            :model="FormQuery.start_code"
                            :data="station"
                            @on-search="searchInput"
                            @on-select="selectStationStart"
                            placeholder="出发地"></AutoComplete>
                    </FormItem>
                    <FormItem label="目的地" style="margin:0px auto;">
                        <AutoComplete icon="flag"
                            :model="FormQuery.end_code"
                            :data="station"
                            @on-search="searchInput"
                            @on-select="selectStationEnd"
                            placeholder="出发地"></AutoComplete>
                    </FormItem>
                    <FormItem label="出发时间" style="margin:0px auto;">
                        <DatePicker type="date" :options="disabledBeforeToday" @on-change="selectInputDate" placeholder="出发时间" format="yyyy-MM-dd" :value="FormQuery.date" style="width:87%"></DatePicker>
                    </FormItem>
                    <FormItem style="margin:0px auto;">
                        <Button type="primary"  @click="submitQueryScheduleInfo($event)" >提交</Button>
                    </FormItem>
                </Form>
            </Card>
            <Modal v-model="isShowGradTicket" width="90%">
                <div class="imgBox">
                    <Card :bordered="true">
                        <Row slot="title">
                          <span>列车信息</span>
                        </Row>
                        <Row>
                          <Col span="6"><Icon type="ios-time"></Icon>   {{ gradTicketForm.train_date }}</Col>
                          <Col span="6"><Icon type="android-train"></Icon>   {{ gradBefore.train_number }} 次</Col>
                          <Col span="6"><Icon type="flag"></Icon>   {{ gradTicketForm.start_station }}   ({{ gradBefore.start_time }})</Col>
                          <Col span="6"><Icon type="flag"></Icon>   {{ gradTicketForm.end_station }}   ({{ gradBefore.end_time }})</Col>
                        </Row>
                        <hr style="margin:10px auto" />
                        <Row>
                          <Col span="4">商务座 <strong>( {{ gradBefore.SW }} )</strong></Col>
                          <Col span="4">一等座 <strong>( {{ gradBefore.YD }} )</strong></Col>
                          <Col span="4">二等座 <strong>( {{ gradBefore.ED }} )</strong></Col>
                          <Col span="4">软卧 <strong>( {{ gradBefore.RW }} )</strong></Col>
                          <Col span="4">硬卧 <strong>( {{ gradBefore.YW }} )</strong></Col>
                          <Col span="4">硬座 <strong>( {{ gradBefore.YZ }} )</strong></Col>
                        </Row>
                    </Card>
                    <Card :bordered="true" style="margin-top:10px;" :padding="0" >
                        <Row slot="title">
                          <span>乘客信息</span>
                        </Row>
                        <Row>
                          <Table @on-select="selectGradTicketUser" :border="false" style="border:none;" :columns="GradTicketHeader" :data="GradTicketUser"></Table>
                        </Row>
                    </Card>
                </div>
                <div slot="footer" style="text-align:center;">
                    <Button type="primary" @click="submitAddTask" >添加任务</Button>
                </div>
            </Modal>
            <Card :bordered="true" :padding="0" v-show="isShowQueryData" style="width:90%;margin-top:10px;">
              <Row slot="title" style="text-align:left;">
                <span>车次信息</span>
              </Row>
              <Row>
                <Table stripe height="400" style="border:none;" border :columns="QueryHeader" :data="QueryData"></Table>
              </Row>
            </Card>
        </center>
        <footer></footer>
    </div>
</template>
<style>
.ivu-auto-complete{
  max-height: 200px !important
}
</style>

<script>
export default {
  created() {
    
  },
  mounted: function () {
    this.$nextTick(function () {
      this.initStation()
    })
  },
  data() {
    return {
      //设置不可选时间
      disabledBeforeToday:{
        disabledDate (date) {
          return date && date.valueOf() < Date.now() - 86400000;
        }
      },
      //设置用户名
      username:this.getUserName(),
      //是否显示车次列表界面
      isShowQueryData: false,
      //是否显示下单界面
      isShowGradTicket:false,
      //下单前预处理数
      gradBefore:{
        //座位类型
        seatType:[],
        //乘车人类型
        ticketType:[],
        //车次编号
        train_number:"",
        //发车时间
        strat_time:"",
        //到达时间
        end_time:""
      },
      //抢票下单数据
      gradTicketForm:{
        //始发站
        start_station:"",
        //终点站
        end_station:"",
        //始发站
        start_code:"",
        //终点站
        end_code:"",
        //时间
        train_date:"",
        //格式化时间
        format_date:"",
        //秘钥
        secret_key:"",
        //Tickter
        ticket_str:"",
        //passenger
        passenger_str:"",
        //列车编号
        train_no:"",
        //列车代码
        train_code:""
      },
      //站台搜索列表信息
      station: [],
      //站台列表信息
      station_list: [],
      //站台代码信息
      key_station:{},
      //站台查询表单
      FormQuery: {
        end_station: "",
        end_code:"",
        start_station: "",
        start_code:"",
        date: new Date()//this.formatDate(new Date())
      },
      //乘车人列表
      GradTicketUser:[],
      GradTicketHeader:[
        {
          title:"选择",
          key:"id",
          sortable: false,
          type: 'selection'
        },
        {
          title:"席别",
          key:"seatType",
          sortable: false,
          render: (h, params) => {
            let children = [];
            children.push(h("Option", {props:{label:"商务座",value:"9"}}))
            children.push(h("Option", { props:{label:"一等座",value:"M"}}))
            children.push(h("Option", { props:{label:"二等座",value:"O"}}))
            children.push(h("Option", { props:{label:"软卧",value:"4"}}))
            children.push(h("Option", { props:{label:"硬座",value:"1"}}))
            children.push(h("Option", { props:{label:"硬卧",value:"3"}}))
            this.gradBefore.seatType[params.row.passenger_id_no] = 3
            return h('Select', {
              props:{
                lable:"硬卧",
                value:"3"
              },
              style:{
                width:"110px"
              },
              on: {
                  "on-change": (event) => {
                    this.gradBefore.seatType[params.row.passenger_id_no] = event
                  }
              }
            },children)
          }
        },
        {
          title:"票种",
          key:"ticketType",
          sortable: false,
          render: (h, params) => {
            let children = [];
            children.push(h("Option", {props:{label:"成人票",value:"1"}}))
            children.push(h("Option", { props:{label:"儿童票",value:"2"}}))
            children.push(h("Option", { props:{label:"学生票",value:"3"}}))
            children.push(h("Option", { props:{label:"残军票",value:"4"}}))
            this.gradBefore.ticketType[params.row.passenger_id_no] = params.row.passenger_type
            return h('Select', {
              props:{
                lable:params.row.passenger_type_name+"票",
                value:params.row.passenger_type
              },
              style:{
                width:"75px"
              },
              on: {
                 "on-change": (event) => {
                   this.gradBefore.ticketType[params.row.passenger_id_no] = event
                }
              }
            },children)
          }
        },
        {
          title:"姓名",
          key:"passenger_name",
          sortable: false
        },
        {
          title:"证件类型",
          key:"passenger_id_type_name",
          sortable: false
        },
        {
          title:"证件号码",
          key:"passenger_id_no",
          sortable: false
        },
        {
          title:"手机号码",
          key:"mobile_no",
          sortable: false
        },
      ],
      QueryHeader: [
        {
          title:"车次",
          key:"train_number",
          width: 100,
          fixed: 'left',
          sortable: true
        },
        {
          title: "始发站",
          width: 100,
          key: "start_station",
          sortable: true
        },
        {
          title: "终点站",
          width: 100,
          key: "end_station",
          sortable: true
        },
        {
          title: "出发时间",
          width: 120,
          key: "start_time",
          sortable: true
        },
        {
          title: "到达时间",
          width: 120,
          key: "end_time",
          sortable: true
        },
        {
          title: "历时",
          width: 100,
          key: "duration",
          sortable: true
        },
        {
          title: "商务座",
          width: 100,
          key: "sw_num",
          sortable: true
        },
        {
          title: "一等座",
          width: 100,
          key: "yd_num",
          sortable: true
        },
        {
          title: "二等座",
          width: 100,
          key: "ed_num",
          sortable: true
        },
        {
          title: "软卧",
          width: 100,
          key: "rw_num",
          sortable: true
        },
        {
          title: "硬卧",
          width: 100,
          key: "yw_num",
          sortable: true
        },
        {
          title: "硬座",
          width: 100,
          key: "yz_num",
          sortable: true
        },
        {
          title: "无座",
          width: 100,
          key: "wz_num",
          sortable: true
        },
        {
          title: "抢票",
          width: 100,
          key: "qp_num",
          fixed: 'right',
          align: 'center',
          sortable: false,
          render: (h, params) => {
            return h('div', [
              h('Button', {
                props: {
                  type: 'success',
                  size: 'small'
                },
                style: {
                },
                on: {
                  click: () => {
                    this.showGradTicketAndSetParams(params.index)
                  }
                }
                }, '抢票')
            ]);
          }
        }
      ],
      QueryData: []
    };
  },
  methods: {
    submitAddTask(event){
      this.isShowGradTicket = false;
      this.$Spin.show();
      let that = this;
      this.$http.post(this.$config.RquestUrl.add_task, this.gradTicketForm).then(function (res) {
        if(res.status == 200){
          var response = JSON.parse(res.data);
          if(response.status){
            that.$Spin.hide();
            that.$Message.success(response.message);
          }else{
            that.$Spin.hide()
            that.$Message.error(response.message);
          }
        }
      }).then((error)=> this.error = error)
    },
    //提交车次查询
    submitQueryScheduleInfo(event){
      this.$Spin.show();
        event.preventDefault();
        let that = this;
        this.FormQuery.date = this.formatDate(this.FormQuery.date);
        this.$http.get(this.$config.RquestUrl.schedule_query, {params: this.FormQuery}).then(function (res) {
                if (res.status === 200) {
                  that.QueryData = new Array();
                    var response = JSON.parse(res.data);
                    if(response.status){
                      that.isShowQueryData = true;
                      var data = response.data.data;
                      for(var _k in data.result){
                        var result = data.result[_k].split("|");
                        //获取站台名称
                        var start_code = result[6];
                        var end_code = result[7];
                        for(var k in that.key_station){
                          if(result[6] == k){
                            result[6] = that.key_station[k];
                          }
                          if(result[7] == k){
                            result[7] = that.key_station[k];
                          }
                        }
                        var sw_kk = result[25] ? result[25] : result[32];
                        that.QueryData.push({
                          "key":result[0], //秘钥
                          "result":result,
                          "start_code":start_code,// #始发站信息在6号位置
                          "end_code":end_code,// #终点站信息在7号位置

                          "train_number": result[3],// #车次在3号位置
                          "start_station":result[6],// #始发站信息在6号位置
                          "end_station":result[7],// #终点站信息在7号位置
                          "start_time":result[8],// #出发时间信息在8号位置
                          "end_time":result[9],// #抵达时间在9号位置
                          "duration":result[10],// #经历时间在10号位置
                          "sw_num":sw_kk == "" ? "无" :sw_kk,// # 特别注意：商务座在32或25位置
                          "yd_num":result[31] == "" ? "无" :result[31],// #一等座信息在31号位置
                          "ed_num":result[30] == "" ? "无" :result[30],// #二等座信息在30号位置
                          "gr_num":result[21] == "" ? "无" :result[21],// #高级软卧信息在31号位置
                          "rw_num":result[23] == "" ? "无" :result[23],// #软卧信息在23号位置
                          "dw_num":result[27] == "" ? "无" :result[27],// #动卧信息在27号位置
                          "yw_num":result[28] == "" ? "无" :result[28],// #硬卧信息在28号位置
                          "rz_num":result[24] == "" ? "无" :result[24],// #软座信息在24号位置
                          "yz_num":result[29] == "" ? "无" :result[29],// #硬座信息在29号位置
                          "wz_num":result[26] == "" ? "无" :result[26],// #无座信息在26号位置
                          "qt_num":result[22],// #其他信息在22号位置
                          "qp_num": result[0] == "" ? false : true,
                        })
                      }
                      that.$Spin.hide();
                    }else{
                      that.$Spin.hide();
                      that.$Message.error(response.message);
                    }
                }
      }).then((error)=> this.error = error)
    },
    //选择出发时间    
    selectInputDate(value){
      if(value instanceof Date){
        this.FormQuery.date = value;
      }else{
        var date= new Date(Date.parse(value.replace(/-/g,   "/")));
        this.FormQuery.date = date
      }
    },
    //显示并设置抢票界面参数
    showGradTicketAndSetParams(index){
      // if(this.QueryData[index]["qp_num"]){
        this.$Spin.show();
        this.gradTicketForm.train_code = this.QueryData[index]['train_number'];
        this.gradTicketForm.train_no = this.QueryData[index]['result'][2];
        this.gradTicketForm.train_date = this.FormQuery.date;
        this.gradTicketForm.format_date = ""+this.parserDate(this.FormQuery.date);
        this.gradTicketForm.secret_key = this.QueryData[index]['key'];
        this.gradTicketForm.start_station = this.QueryData[index]['start_station'];
        this.gradTicketForm.end_station = this.QueryData[index]['end_station'];
        this.gradTicketForm.start_code = this.QueryData[index]['start_code'];
        this.gradTicketForm.end_code = this.QueryData[index]['end_code'];
        this.gradBefore.train_number = this.QueryData[index]['train_number'];
        this.gradBefore.start_time = this.QueryData[index]['start_time'];
        this.gradBefore.end_time = this.QueryData[index]['end_time'];
        this.gradBefore.SW = this.QueryData[index]['sw_num'];
        this.gradBefore.YD = this.QueryData[index]['yd_num'];
        this.gradBefore.ED = this.QueryData[index]['ed_num'];
        this.gradBefore.RW = this.QueryData[index]['rw_num'];
        this.gradBefore.YZ = this.QueryData[index]['yz_num'];
        this.gradBefore.YW = this.QueryData[index]['yw_num'];
        this.initPassenger();
      // }else{
      //   this.$Message.error("系统维护时间")
      // }
      
    },
    //选择抢票用户
    selectGradTicketUser(index){
      var ticketStrList = new Array()
      var UserStrList = new Array()
      for(var x in index){
        var beforeIndex = index[x]['passenger_id_no']
        var seatType = this.gradBefore.seatType[beforeIndex]
        var tickType = this.gradBefore.ticketType[beforeIndex]
        //座位类型,0,车票类型,姓名,证件类别,身份正号,电话,N
        var ticketStr = seatType+",0,"+tickType+","+index[x]["passenger_name"]+","+index[x]["passenger_id_type_code"]+","+index[x]["passenger_id_no"]+","+index[x]["mobile_no"]+",N"
        //姓名,证件类别,证件号码,用户类型
        var userStr = index[x]["passenger_name"]+","+index[x]["passenger_id_type_code"]+","+index[x]["passenger_id_no"]+","+index[x]["passenger_type"]
        ticketStrList.push(ticketStr)
        UserStrList.push(userStr)
      }
      this.gradTicketForm.ticket_str = ticketStrList.join("_")
      this.gradTicketForm.passenger_str = UserStrList.join("_")
    },
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
    //初始化站台信息  
    initStation() {
      let that = this;
      this.$http.get(this.$config.RquestUrl.station_query, null).then(function(res) {
        var response = JSON.parse(res.data);
        if (response.status) {
            // 分拆城市信息
            var cities = response.data.split("@");
            var item = undefined;
            while ((item = cities.pop())) {
              var data = item.split("|");
              var key = data[2];
              var val = data[1];
              that.key_station[key] = val;
              that.station_list.unshift(data);
            }
            that.initQuerySchedule()
          } else {
            that.$Message.error(response.message);
            that.Sleep(700).then(() => {
              window.location.reload();
            })
          }
      })
    },
    //初始化查询页面
    initQuerySchedule(){
      let that = this;
      this.$http.get(this.$config.RquestUrl.schedule_init, null).then(function(res) {
        var response = JSON.parse(res.data);
        if (!response.status) {
          that.$Message.error(response.message);
          that.Sleep(700).then(() => {
            window.location.reload();
          })
        }
      });
    },
    //获取乘车人信息
    initPassenger(){
      let that = this;
      this.$http.get(this.$config.RquestUrl.passenger_query, null).then(function(res) {
          if (res.status === 200) {
            var response = JSON.parse(res.data);
            if (response.status) {
               that.GradTicketUser = new Array();
              var passengers = response.data.data.normal_passengers;
              for(var k in passengers){
                that.GradTicketUser.push(passengers[k]);
              }
              that.$Spin.hide();
              that.isShowGradTicket = true;
            } else {
              that.$Spin.hide();
              that.$Message.error(response.message);
              that.isShowGradTicket = false;
            }
          }
        }).then(error => (this.error = error));
    },
    //站点选择搜索
    searchInput(value) {
      this.station = new Array();
      if (this.station_list != undefined || this.station_list.length != 0) {
        for (var i = 0; i < this.station_list.length; i++) {
          var item = this.station_list[i];
          var station_name = item[1];
          if (item[0].indexOf(value) >= 0) {
            if (this.station.indexOf(station_name) == -1) {
              this.station.push(station_name);
            }
          }
          if (item[4].indexOf(value) >= 0) {
            if (this.station.indexOf(station_name) == -1) {
              this.station.push(station_name);
            }
          }
          if (item[3].indexOf(value) >= 0) {
            if (this.station.indexOf(station_name) == -1) {
              this.station.push(station_name);
            }
          }
          if (station_name.indexOf(value) >= 0) {
            if (this.station.indexOf(station_name) == -1) {
              this.station.push(station_name);
            }
          }
        }
      }
    },
    //选择终点站
    selectStationEnd(value) {
      this.station = new Array();
      if (this.station_list != undefined || this.station_list.length != 0) {
        for (var i = 0; i < this.station_list.length; i++) {
          var item = this.station_list[i];
          if (item[1] == value) {
            this.FormQuery.end_station = item[1];
            this.FormQuery.end_code = item[2];
          }
        }
      }
    },
    //选择启始站
    selectStationStart(value) {
      this.station = new Array();
      if (this.station_list != undefined || this.station_list.length != 0) {
        for (var i = 0; i < this.station_list.length; i++) {
          var item = this.station_list[i];
          if (item[1] == value) {
            this.FormQuery.start_station = item[1];
            this.FormQuery.start_code = item[2];
          }
        }
      }
    },
    //格式化时间
    formatDate(date){
      var str = "";
      if(date instanceof Date){
        str = date.getFullYear()+"-"+((date.getMonth()+1)<10?"0":"")+(date.getMonth()+1)+"-"+(date.getDate()<10?"0":"")+date.getDate();
      }else{
        str = date;
      }
      return str
    },
    parserDate(date) {  
      var t = Date.parse(date);  
      if (!isNaN(t)) {  
        return new Date(Date.parse(date.replace(/-/g, "/")));  
      } else {  
        return new Date();  
      }  
    }
  }
};
</script>
