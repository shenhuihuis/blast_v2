<template>
    <div class="mycontair">
        <el-dialog :title="diaglog.title" :visible.sync="diaglog.show"   :before-close="disClose"  class="disbody">
           <dl>
               <dt>请选择变更项目</dt>
               <dd v-for="i in changeList">
                   <a href="javascript:void(0)" @click="went(i.id)">{{i.name}}</a>
               </dd>
           </dl>
        </el-dialog>
         <div class = 'topBar'>
            <el-select v-model="SearchDTO.status" placeholder="选择状态" @change='init'>
                <el-option
                v-for="item in SearchDTO.statuslist"
                :key="item.value"
                :label="item.text"
                :value="item.value">
                </el-option>
            </el-select>
            <div class = 'right'>
                <div  @click="addNewForm" class="addBtn" style="display:inline-block;">新增</div>
                <div class = 'serBox'>
                    <input :class = "SearchDTO.showSearch ? 'serActive':'search'" type="text" v-model="SearchDTO.multiCondition" :placeholder="SearchDTO.showSearch ?  '请输入姓名或手机号' : '搜索'" @focus="searchAct" @blur="leave">
                </div>
            </div>
        </div>
        <div class="comlist">
              <el-table
                :data="dataList"
                style="width: 100%">
                <el-table-column
                    prop="name"
                    label="项目名称"
                    width="240px">
                </el-table-column>
                <el-table-column
                    prop="projectAddress"
                    label="作业地点"                
                    width="200px">
                </el-table-column>
                <el-table-column
                    prop="charge"
                    label="项目负责人"
                    width="200px">
                </el-table-column>
                <el-table-column
                    prop="examineTime"
                    label="审批时间"
                    width="200px">
                </el-table-column>
                <el-table-column
                    prop="timer"
                    label="作业时间"
                    width="260px">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    :formatter='formatState'
                    width="140px">
                </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                      <el-button type="text" size="small"  @click = "handleDetail(scope.row.id)">查看</el-button>
                      <el-button type="text" size="small"  @click = "completed(scope.row.id)"  v-if = 'scope.row.status == 0'>竣工</el-button>
                </template>
                </el-table-column>
               
            </el-table>
            <div style="text-align:center">
                <el-pagination
                    :page-size="size" @current-change = 'pageChange'
                    v-if = 'total > size'
                    layout="prev, pager, next"
                    :current-page="page"
                    :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import $http from "superagent";
    export default {
        data (){
            return{
                diaglog:{       // 弹出框  
                     show:false, //是否现实
                     title:"项目变更",
                },
                SearchDTO:{
                    multiCondition:'',//搜索框
                    type:'',//人员类型
                    status:'',//状态
                    statuslist:[
                        {value:null,text:'全部'},
                        {value:0,text:'待审批'},
                        {value:1,text:'已通过'},
                        {value:2,text:'已驳回'},
                    ],
                    showSearch:false,//是否激活搜索
                },
                dataList:[],
                changeList:[],
                show:0,     //切换
                user:this.publics.global().auth,
                isedit:false,
                page:1,
                size:10,
                total:0,
            }   
        },
        created(){
          //this.staff();
            this.init();
            this.list();
        },
        mounted(){
            
        },
        methods:{
            completed(id){
                this.publics.AJAX.$POST({
                    url:""
                })
            },
            went(id){
                this.$router.push({'name':'Changedetails',query:{id:this.publics.DES.encode(id)}})
            },
            disClose(){
                this.diaglog.show=false;
            },
            addNewForm(){
                this.diaglog.show=true;
            },
            handleDetail(id){         //查看详情
                this.$router.push({'name':'prodetails',query:{id:this.publics.DES.encode(id)}})
            },  
            searchAct(){
                this.SearchDTO.showSearch = true;
            },
            list(){
                 this.publics.AJAX.$POST({
                    url:"project/change/user/"+this.user.userId,
                    success:(e)=>{
                        console.log(e)
                        this.changeList=e;
                    }
                })
            },
            leave(){//搜索blur
                if(this.SearchDTO.multiCondition == ''){
                    this.SearchDTO.showSearch = false;
                }
                this.init();
            },
            formatState(row){//列表状态过滤器
                let messcode=["未完成","已竣工","已完成","修改中" ]
                return messcode[row.status];
            },
            init(){
                this.publics.AJAX.$POST({
                    url:"project/change/List",
                    data:{
                        "page": 1,
                        "size": 10,
                        "projectName":"",
                        "status":null,
                        "userId":this.user.userId
                    },
                    success:(e)=>{
                       for(let val of e.list){
                           val.timer=this.publics.Filters.timer(val.beginTime)+" 至 "+this.publics.Filters.timer(val.endTime)
                           val.examineTime=this.publics.Filters.timer(val.examineTime)
                       }
                       this.dataList=e.list;
                       this.total=e.count;
                    }
                })
            },
          
        }
        
    }
</script>
<style lang = 'scss'>
    .mycontair{
           .topBar{
                position: relative;
                background: #fff;
                height: 63px;
                padding:0 30px; 
                .el-select{
                    display:inline-block;
                    width:10%;
                    margin:10px;
                }
                .serBox{
                    display:inline-block;
                    margin-left:20px;
                    input{
                        cursor: pointer;
                        width: 80px;
                        height: 32px;
                        line-height: 32px;
                        transition: width .5s;
                    }
                    .search{
                        cursor: pointer;
                        padding-left: 10px;
                        text-align: center;
                        border: 1px solid #4B74FF;
                        background: url('../../assets/img/ser.png') no-repeat 15% 50%;
                        border-radius: 24px;
                    }
                    input::-webkit-input-placeholder{
                        color:#4B74FF;
                    }
                    input::-moz-placeholder{  
                        color:#4B74FF;
                    }
                    input:-moz-placeholder{   
                        color:#4B74FF;
                    }
                    input:-ms-input-placeholder{  
                        color:#4B74FF;
                    }
                    .serActive{
                        width: 200px;
                        padding: 0 10px;
                        color: #999;
                        border: 1px solid #4B74FF;
                        border-radius: 5px;
                    }
                }
                .right{
                    position: absolute;
                    top:15px;
                    left: 75%;

                }
                .addBtn{
                    cursor: pointer;
                    background: #4B74FF;
                    /* width: 88px; */
                    padding:0 10px;
                    height: 32px;
                    border-radius: 24px;
                    color: #fff;
                    font-size: 14px;
                    text-align: center;
                    line-height: 32px;
                }
          }   
          .comlist{
                  margin: 21px 40px;
                  background: #fff;
          }
          .disbody {
              .el-dialog__body{
                  padding:0;
                  height:500px;
              }
              .botbtn{
                 text-align: right;
                 margin-right: 40px;
                 margin-top:20px;
              }
              dl{
                height:400px;
                padding:0 25px;
                border-top:1px solid #D8D8D8;
                dt{
                    color:#333;
                    line-height: 20px;
                    font-size: 14px;
                    padding:20px 0;
                }
                dd{
                    margin-bottom: 10px;
                    line-height: 40px;
                   
                    font-size:14px;
                    overflow: hidden;
                    a{
                        background: #EDF0F4;
                        display: block;
                        padding-left:30px;
                        transition-duration: 800ms;
                    }
                    a:hover{
                        background: #D8D8D8;
                    }
                }
              }
          }
    }
</style>

 