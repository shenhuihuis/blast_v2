<template>
  <div class="logistics" v-if="load">
    <div class="bread">
      <div class="htit">消息</div>
    </div>
    <div class="messlist" v-if="lists">
      <ul>
        <li v-for="i in lists.data" @click="went(i)">
          <a href="javascript:void(0);">
            <div class="tit">{{i.msg}}</div>
            <div class="time">
              <i class="el-icon-time"></i>
              <span>{{i.createTime|timer}}</span>
            </div>
            <em>点击详情</em>
          </a>
        </li>
      </ul>
    </div>
    <div class="nobg" v-else></div>
  </div>
</template>
<script>
import Base64 from "js-base64";
export default {
  props:["datas"],
  data() {
    return {
      comlist: {
        //列表分页数据
        page: 1,
        size: 100
      },
      lists: null,
      load: false
    };
  },
  filters: {
    timer(e) {
      let data = new Date(e);
      return (e =
        data.getFullYear() +
        "年" +
        (data.getMonth() + 1) +
        "月" +
        data.getDate() +
        "日");
    }
  },
  mounted() {
    this.list();
  },
  methods: {
    went(json){
        let mess=[ 
                {type:1,mess:"人员许可证到期",to:null},  
                {type:2,mess:"公司许可证到期",to:null},
                {type:4,mess:"监理一爆一批审批",to:"pro_look"},
                {type:5,mess:"监理审批一爆一批变更",to:"pro_xgl"},
                {type:6,mess:"消耗完全无需退库配送",to:"dis_end"},
                {type:7,mess:"耗完全无需退库入库",to:"dep_get"},
                {type:8,mess:"通知",to:null},
                {type:9,mess:"爆破公司购买审批消息",to:"civil_buyApply"},
                {type:10,mess:"爆破公司一爆一批审批消息",to:"blast_plan"},
                {type:11,mess:"爆破公司项目变更审批",to:"bla_check"},
                {type:12,mess:"爆破公司项目销毁审批",to:"civil_die"},
                {type:13,mess:"爆破公司一爆一批变更审批",to:"blast_plan"},
                {type:14,mess:"配送公司销售配送消息",to:"dis_start"},
                {type:15,mess:"配送公司出库配送消息",to:"dis_ing"},
                {type:16,mess:"配送公司退库消息消息",to:"dis_end"},
                {type:17,mess:"配送公司变更配送消息",to:null},
                {type:18,mess:"仓储公司入库消息",to:"dep_send"},
                {type:19,mess:"派出所一爆一批审批消息",to:"pol_home"},
                {type:20,mess:"公安项目变更审批消息",to:"pol_replace"},
                {type:21,mess:"公安项目销毁审批消息",to:"pol_destroy"},
                {type:22,mess:"派出所购买审批消息",to:"pol_civil"},
                {type:23,mess:"派出所一爆一批变更消息",to:"ckhome"},
                {type:24,mess:"仓储出库消息",to:"dep_give"},
                {type:25,mess:"仓储退库入库消息",to:"dep_get"},
                {type:26,mess:"公安购买审批消息",to:null},
                {type:27,mess:"监理特殊变更消息",to:"pro_look"},
                {type:28,mess:"派出所特殊变更消息",to:null},
                {type:29,mess:"公安特殊变更消息",to:null},
        ];
        for(let val of mess){
            if(val.type==json.type){
                this.publics.$AJAX("news","get",{id:json.id},e=>{
                  if(val.to){
                    this.$router.push({"name":val.to,query:{"news":Base64.Base64.encode(json.mainId)}})
                  }else{
                     let types=e.status==0?"warning":"success";
                     this.$message({
                      message: e.msg,
                      type: types
                    });
                  }
              })
            }
        }
    },
    list() {
      let load = this.$loading({
        text: "页面加载中"
      });
      this.publics.$AJAX(
        "news/staff/" + this.datas.uid,
        "get",
        this.comlist,
        e => {
          if (e.count == 0) this.lists = null;
          else {
            this.lists = e;
          }
          setTimeout(e => {
            load.close();
          }, 500);
          this.load = true;
        }
      );
    }
  }
};
</script>