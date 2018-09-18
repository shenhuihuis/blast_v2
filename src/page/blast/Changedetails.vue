<template>
     <div class="changeContair">
            <div class="tp">
                <el-radio-group v-model="form.administrative" :disabled='true'>
                    <el-radio :label="true">行政许可项目</el-radio>
                    <el-radio :label="false">非行政许可项目</el-radio>
                </el-radio-group>
            </div>
            <div class="project-form">
                <table  border="1" class="table" width="100%">
                    <tr>
                    <td width="100">项目名称</td>
                    <td width="612" colspan="3">
                        <el-input v-model="form.name" :disabled="true"></el-input>
                    </td>
                    <td width="100">项目级别</td>
                    <td width="100">
                        <el-select v-model="form.level" placeholder="项目级别" :disabled='true'>
                            <el-option label="A级" :value="4"></el-option>
                            <el-option label="B级" :value="3"></el-option>
                            <el-option label="C级" :value="2"></el-option>
                            <el-option label="D级" :value="1"></el-option>
                            <el-option label="一般岩土" :value="0"></el-option>
                         </el-select>
                    </td>
                    <td width="100">审批时间</td>
                    <td width="150">
                        <el-date-picker v-model="form.examineTime" type="date"  placeholder="选择日期" value-format="timestamp" :disabled='true'></el-date-picker>
                    </td>
                    </tr>
                    <tr>
                        <td width="100">委托单位</td>
                        <td width="386">
                            <el-input v-model="form.trustorName" :disabled='true'></el-input>
                        </td>
                        <td width="130">委托单位法人</td>
                        <td width="100">
                            <el-input v-model="form.trustorLegal" :disabled='true'></el-input>
                        </td>
                        <td width="100">委托人</td>
                        <td width="100">
                            <el-input v-model="form.trustorStaff":disabled='true'></el-input>
                        </td>
                        <td width="100">委托人手机</td>
                        <td width="150">
                            <el-input v-model="form.trustorPhone":disabled='true'></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td width="100">所属辖区</td>
                        <td width="516" colspan="2">
                            <el-cascader :options="options" v-model="form.policeIds" class="selectcity" :disabled='true'></el-cascader>
                        </td>
                        <td width="100">作业地点</td>
                        <td width="200" colspan="2">
                            <el-input v-model="form.projectAddress" :disabled='true'></el-input>
                        </td>
                        <td width="100">作业时间</td>
                        <td width="150" class="pred" v-if="show==1">
                            <el-date-picker  v-model="form.worktime"  type="datetimerange" @change="dataFloat"  start-placeholder="开始日期"  value-format="timestamp" end-placeholder="结束日期"></el-date-picker>                      
                        </td>
                        <td width="150" v-else>
                            <el-date-picker  v-model="form.worktime"  type="datetimerange"   start-placeholder="开始日期"  value-format="timestamp" end-placeholder="结束日期"></el-date-picker>                      
                        </td>
                    </tr>
                </table>
                <table  border="1" class="table" width="100%">
                    <tr>
                        <td rowspan="50" width="100">设计</br>施工</br>方案</td>
                        <td width="120"></td>
                        <td width="220">姓名</td>
                        <td width="240">作业级别</td>
                        <td width="240">许可证编号</td>
                        <td width="240">公民身份证号</td>
                    </tr>
                    <tr v-for="i in listStaff.Arr.list.sonArr.list">      <!-- 第一个 开启是否多人  第二个 1,施⼯方案人员列表 2,作业人员列列表 3,安全评估单位人员,4 安全监理单位人员  第三个请求类型 第四个 人员类型 -->
                        <td>设计人</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr  v-for="i in listStaff.Arr.list.sonBrr.list">   <!-- 5 项目审核人-->
                        <td>审核人</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr v-for="i in listStaff.Arr.list.sonCrr.list">
                        <td>批准人</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                </table>
                <table  border="1" class="table" width="100%">
                    <thead>
                        <th colspan="5">设计施工单位参与本项目的作业人员名单</th>
                    </thead>
                    <tr>
                        <td width="120"></td>
                        <td width="180">姓名</td>
                        <td width="180">作业级别</td>
                        <td width="320">许可证编号</td>
                        <td width="320">公民身份证号</td>
                    </tr>
                    <tr v-for="i in listStaff.Brr.list.sonArr.list">
                        <td>项目负责人</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr  v-for="i in listStaff.Brr.list.sonBrr.list">
                        <td>技术负责人</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr :class="{'point pred':show==1}" @click="addStaff(true,2,4,6,'技术员')" v-for="i in listStaff.Brr.list.sonCrr.list">
                        <td>技术员</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr :class="{'point pred':show==1}"  @click="addStaff(true,2,1,7,'爆破员')" v-for="i in listStaff.Brr.list.sonDrr.list">
                        <td>爆破员</td>
                         <td>{{i.staffName}}</td>
                        <td>/</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr :class="{'point pred':show==1}"  @click="addStaff(true,2,2,8,'安全员')" v-for="i in listStaff.Brr.list.sonErr.list">
                        <td>安全员</td>
                        <td>{{i.staffName}}</td>
                        <td>/</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr :class="{'point pred':show==1}"  @click="addStaff(true,2,3,9,'保管员')" v-for="i in listStaff.Brr.list.sonFrr.list">
                        <td>保管员</td>
                        <td>{{i.staffName}}</td>
                        <td>/</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                </table>
                <table  border="1" class="table" width="100%">
                    <thead>
                        <th colspan="6">安全评估单位及单位参与本项目的爆破作业人员名单</th>
                    </thead>
                    <tr>
                        <td width="180">单位名称</td>
                        <td width="402">
                            <el-input v-model="form.projectSecurityAndSupervisor[0].companyName" :disabled="true"></el-input>
                        </td>
                        <td width="180"  colspan="2">单位许可证编号</td>
                        <td width="402">
                            <el-input v-model="form.projectSecurityAndSupervisor[0].licenceNumber" :disabled="true"></el-input>
                        </td>
                    </tr>
                    <tr>
                        <td >单位资质</td>
                        <td>
                            <el-input v-model="form.projectSecurityAndSupervisor[0].workingRange" :disabled="true"></el-input>
                        </td>
                        <td colspan="2">许可证有效期</td>
                        <td>
                            <el-date-picker v-model="form.projectSecurityAndSupervisor[0].licenceExpireTime" type="date"  value-format="timestamp"  placeholder="选择日期"  :disabled="true"></el-date-picker>
                        </td>
                    </tr>
                    <tr>
                        <td width="120"></td>
                        <td width="180">姓名</td>
                        <td width="180">作业级别</td>
                        <td width="320">许可证编号</td>
                        <td width="320">公民身份证号</td>
                    </tr>
                    <tr  v-for="i in listStaff.Crr.list.sonArr.list">
                        <td width="120">评估人员</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                </table>
                <table  border="1" class="table" width="100%" v-if="form.projectSecurityAndSupervisor.length>1">
                    <thead>
                        <th colspan="6">安全监理单位参与本项目的爆破作业人员名单</th>
                    </thead>
                    <tr>
                        <td width="180">单位名称</td>
                        <td width="402">
                            <el-input v-model="form.projectSecurityAndSupervisor[1].companyName"></el-input>
                        </td>
                        <td width="180" colspan="2">单位许可证编号</td>
                        <td width="402">{{form.projectSecurityAndSupervisor[1].licenceNumber}}</td>
                    </tr>
                    <tr>
                        <td>单位资质</td>
                        <td>{{form.projectSecurityAndSupervisor[1].workingRange}}</td>
                        <td colspan="2">许可证有效期</td>
                        <td>{{publics.Filters.timer(form.projectSecurityAndSupervisor[1].licenceExpireTime)}}</td>
                    </tr>
                    <tr>
                        <td width="120"></td>
                        <td width="180">姓名</td>
                        <td width="180">作业级别</td>
                        <td width="320">许可证编号</td>
                        <td width="320">公民身份证号</td>
                    
                    </tr>
                    <!-- <tr class="point pred" @click="addStaff(true,4,null,11,'监理员')" v-for="i in listStaff.Drr.list.sonArr.list">
                        <td width="120">监理人员</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr> -->
                    <tr  v-for="i in listStaff.Drr.list.sonArr.list">
                        <td width="120">监理人员</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                
                </table>
             
                    <table  border="1" class="table" width="100%" >
                        <thead>
                            <th colspan="5">安全警戒距离</th>
                        </thead>
                        <tr>
                            <td width="300">方位</td>
                            <td width="300">被保护对象</td>
                            <td width="300">层核定安全距离</td>
                        </tr>
                        <tr v-for="i in form.cautionDtoList">
                            <td>{{i.position}}</td>
                            <td>{{i.cautionObject}}</td>
                            <td>{{i.safeDistance}}</td>
                        </tr>
                    </table>
         
                <table  border="1" class="table" width="100%">
                    <thead>
                        <th colspan="9">民爆物品、物品运输及物品存储</th>
                    </thead>
                    <tr>
                        <td>运输公司</td>
                        <td colspan="3" width="402">
                            <el-input v-model="form.companyIdList[0].companyName" :disabled="true"></el-input>
                        </td>
                        <td>仓储公司</td>
                        <td colspan="5" width="402">
                            <el-input v-model="form.companyIdList[1].companyName" :disabled="true"></el-input>
                        </td>
                    </tr>
                    <tr  :class="{'point pred':show==1}"> 
                        <td width="180">民爆物品</td>
                        <td width="124">炸药</td>
                        <td width="100" :class="{'point':show==1}" @click="addblast(0)"><el-input v-model="form.projectPyrotechnicsList[0].pyrotechnicsNumber" :disabled="true"></el-input></td>
                        <td width="124">雷管</td>
                        <td width="124" :class="{'point':show==1}" @click="addblast(1)"><el-input v-model="form.projectPyrotechnicsList[1].pyrotechnicsNumber" :disabled="true" ></el-input></td>
                        <td width="124" >导爆管</td>
                        <td width="124" :class="{'point':show==1}" @click="addblast(2)">
                            <el-input v-model="form.projectPyrotechnicsList[2].pyrotechnicsNumber" :disabled="true"></el-input>
                        </td>
                        <td width="124">导爆索</td>
                        <td width="124" :class="{'point':show==1}" @click="addblast(3)">
                            <el-input v-model="form.projectPyrotechnicsList[3].pyrotechnicsNumber" :disabled="true"></el-input>
                        </td>
                    </tr>
                </table>
                <div class="ossbox">
                    <div class="uploadOSS">
                        <div class="el-form-item files el-form-item--feedback is-required">
                            <label for="assessmenTreportOssKey" class="el-form-item__label" style="width: 124px;">爆破评估报告</label>
                            <div class="el-form-item__content" style="margin-left: 124px;">
                                 <File :data="upload[0]" @bindValue="form.assessmenTreportOssKey  = upload[0].url" :look="isedit"></File>
                            </div>
                        </div>
                    </div>
                    <div class="uploadOSS">
                        <div class="el-form-item files el-form-item--feedback is-required">
                            <label for="assessmenTreportOssKey" class="el-form-item__label" style="width: 124px;">爆破评估报告</label>
                            <div class="el-form-item__content" style="margin-left: 124px;">
                                  <File :data="upload[1]" @bindValue="form.examineOsskey = upload[1].url" :look="isedit"></File>
                            </div>
                        </div>
                    </div>
                </div>
                <textarea  cols="30" rows="10" v-model="remark"></textarea>
            </div>
            <el-dialog :title="diaglog.title" :visible.sync="diaglog.show"   :before-close="disClose" >
                <div class="transfer" v-if="diaglog.type==2">
                    <div class="person">
                        <el-transfer v-model="diaglog.data" :data="ALLstaff" :titles="['公司储蓄人员', '即将派遣人员']"  @change="dischange"></el-transfer>
                    </div>
                    <div class="botbtn">
                        <el-button type="primary" @click="add(2)" >确定添加</el-button>
                    </div>
                </div>
            </el-dialog>
            <div class="subbtn">
                <el-button @click="submitForm('form')" type="primary" v-if="show==1">提交变更</el-button>
            </div>
        </div>
</template>
<script>
    import file from "./../../components/upload";
    import Validator from "./../../assets/js/filters";
    import $http from "superagent";
    export default {
        data (){
            return{
                show:0,     //切换
                user:this.publics.global().auth,
                isedit:false,
                form:{
                    name: "",                                 //项目名称
                    administrative: true, 
                    assessmenTreportOssKey: "",         //项目评估报告
                    beginTime:"",                             //开始时间
                    endTime: "",                               //结束时间
                    trustorLegal: "",          //委托公司法人名称 
                    trustorName: "",           //委托公司名称
                    trustorPhone: "",          //委托人手机号
                    trustorStaff: "",          //委托人 
                    examineTime: null,         //审批时间
                    cautionDtoList: [                         //火⼯警戒范围列表
                        {
                            cautionObject:"",// 被保护对象 ,
                            position:"",    // 方位 
                            safeDistance:"" //安全距离
                        }
                    ],
                    companyIdList: [              //1.监理公司 3,运输公司 4,仓储公司 ,
                        // {
                        //     companyId: "",
                        //     companyName: "",
                        //     companyType: 1        //监理公司
                        // },
                        {
                            companyId: "",        
                            companyName: "",
                            companyType: 3        //运输公司
                        },
                        {
                            companyId: "",
                            companyName: "",
                            companyType: 4         //仓储公司
                        }
                    ],
                    examineOsskey: "",              //爆破工程项目审批表批文文件oss ,
                    level: null,                    //项⽬级别
                    listStaff: [                    // 1,施⼯方案人员列表 2,作业人员列列表 3,项目负责人4,项目设计人,5,项目审核人,6项目批准人 ,
                       
                    ],
                    policeIds: [],                   //省市区 { policeId: "",type: 0}
                    projectAddress: "",             // 作业地点 
                    projectPyrotechnicsList: [      //火⼯品列表
                       {
                          //  detonatorDto:"" ,       //雷管编号 可以为空 ,
                         //   pyrotechnicsModel:"1",  //火工品型号 
                            pyrotechnicsName:"炸药",   //火工品名称 ,
                            pyrotechnicsNumber:"", //火工品数量 ,
                            pyrotechnicsType:1,  //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                            pyrotechnicsUnit:"千克", // 火工品单位
                        },
                        {
                       //     detonatorDto:"" ,       //雷管编号 可以为空 ,
                       //     pyrotechnicsModel:"2",  //火工品型号 
                            pyrotechnicsName:"雷管",   //火工品名称 ,
                            pyrotechnicsNumber:"", //火工品数量 ,
                            pyrotechnicsType:2,  //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                            pyrotechnicsUnit:"发", // 火工品单位
                        },
                        {
                         //   detonatorDto:"" ,       //雷管编号 可以为空 ,
                            pyrotechnicsModel:"1",  //火工品型号 
                            pyrotechnicsName:"导爆物",   //火工品名称 ,
                            pyrotechnicsNumber:"", //火工品数量 ,
                            pyrotechnicsType:3,  //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                            pyrotechnicsUnit:"米", // 火工品单位
                        },
                        {
                        //    detonatorDto:"" ,       //雷管编号 可以为空 ,
                            pyrotechnicsModel:"2",  //火工品型号 
                            pyrotechnicsName:"导爆物",   //火工品名称 ,
                            pyrotechnicsNumber:"", //火工品数量 ,
                            pyrotechnicsType:3,  //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                            pyrotechnicsUnit:"米", // 火工品单位
                        }
                    ],
                    projectSecurityAndSupervisor: [       //1,项目安全评估信息 2,项目监理单位信
                        {
                         companyName: "",
                         licenceExpireTime: 0,
                         licenceNumber: "",
                         type: 1,
                         workingRange: "",        //作业范围
                         projectStaffList: [
                            {
                              //  id: "",
                                licenceNumber: "",
                                projectStaffType: 3,
                                staffId: "",
                                staffLevel: null,
                                staffName: "",
                                staffType: 10
                            }
                          ]
                        },
                        {
                         companyId: "",
                         companyName: "",
                         licenceExpireTime: 0,
                         licenceNumber: null,
                         type: 2,
                         workingRange: null,        //作业范围
                       }
                    ],
                    latitude:"111.9",
                    longitude:"111.1"
                },
                diaglog:{       // 弹出框  
                     show:false, //是否现实
                     type:2,    //评估单位人员 -0  警戒距离 -1  
                     title:"评估单位人员",
                     data:[],   //1,施工方案人员列表 2,作业人员列列表 3,项目负责人4,项目设计人,5,项目审核人,6项目批准人
                     protype:{
                         type:null,
                         son:null
                     },  
                },
                listStaff:{ //最终提交人员列表
                    Arr:{        //1.施工方案人员
                        key:1,
                        list:{
                            sonArr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],edit:false,type:1},//项目设计人
                            sonBrr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],edit:false,type:2}, //施工方案.审核人
                            sonCrr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],edit:false,type:3}, //施工方案.批准人
                        }
                    }, 
                    Brr:{   //2.作业人员
                        key:2,
                        list:{
                            sonArr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],type:4,edit:false},       //项目负责人
                            sonBrr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],type:5,edit:false},       //技术负责人
                            sonCrr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],type:6,edit:false},       //技术人
                            sonDrr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],type:7,edit:false},       //爆破员
                            sonErr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],type:8,edit:false},       //安全员
                            sonFrr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],type:9,edit:false},        //保管员
                        }
                    }, 
                    Crr:{        //3,安全评估单位人员
                        key:3,
                        list:{
                            sonArr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],edit:false,type:10},//评估人员
                        }
                    }, 
                    Drr:{        //4,监理单位人员
                        key:4,
                        list:{
                            sonArr:{list:[{staffName:"",staffLevel:"",licenceNumber:"",staffId:""}],edit:false,type:11},//监理人员
                        }
                        
                    }, 
                },   
                ALLstaff:[],        //每次多选穿梭人员的list列表
                rules:{trustorPhone: [{ required: true, validator:Validator.tels,trigger: "blur"} ]},
                options:[],
                upload:[
                    {type:2,dataurl:'',url:''},
                    {type:2,dataurl:'',url:''},
                ],
                remark:"",
                status:0    //状态管理
            }   
        },
        created(){
          //this.staff();
            this.publics.AJAX.$POST({
                url:"category/police/%22%22",
                type:"get",
                hastoken:false,
                success:(res)=>{
                    this.options=res;
                    
                }
            })
           
            if(this.$route.query.id){
                
                this.handleDetail(this.publics.DES.decode(this.$route.query.id))
            }
            
        },
        mounted(){
            //this.handleDetail("5b79258d3d9a88203c9f6751")
        },
        components:{
            File:file
        },
        methods:{
            handleDetail(id){         //查看详情
             this.publics.AJAX.$POST({
                 url:"project/"+id,
                 success:(e)=>{
                    console.log(e)
                    e.worktime = [e.beginTime, e.endTime];
                    let policeIds=[],listStaff=this.listStaff;
                    for(let val of e.policeIds){
                        policeIds.push(val.policeId)
                    }
                    e.policeIds=policeIds;
                    for(let val in listStaff){
                       for(let value in  listStaff[val].list){
                           listStaff[val].list[value].list=[]
                       }
                    }
                    for(let val of e.listStaff){
                        for(let value in listStaff){
                            if(val.projectStaffType==listStaff[value].key){
                                for(let values in listStaff[value].list){
                                    if(val.staffType==listStaff[value].list[values].type){
                                        listStaff[value].list[values].list.push(val)    
                                        listStaff[value].list[values].edit=true;
                                    }
                                }
                            }
                        }
                    }
                    this.upload[0].dataurl=e.assessmenTreportOssKey;
                    this.upload[0].url=e.assessmenTreportOssKey;
                    this.upload[1].dataurl=e.examineOsskey;
                    this.upload[1].url=e.examineOsskey;
                    this.isedit=true;
                    this.listStaff=listStaff;
                    this.form=e;
                    if(this.$route.query.t){
                        this.show=0;
                    }else{
                        this.show=1;
                    }
                 //   this.show=1;
                 }
              })
            },  
            dischange(keyArr,direction){                //穿梭框 穿梭
           
                for(let val of this.ALLstaff){
                    if(this.diaglog.data.length==0){           // 假设右边清空 左侧重新赋值
                         console.log(this.form.level > JSON.parse(val.key).staffLevel+1)
                        val.disabled=this.form.level > JSON.parse(val.key).staffLevel+1;
                    }else{
                        for(let value in this.listStaff){
                            val.disabled=false
                            const target = keyArr.filter(current => {
                                return current !== null && current !== undefined;
                            })
                            let m=target.find((value,index)=>{       // 假设右边必备成员全部消失  左侧重新制定规则 并且data重洗  
                                return (this.form.level <= JSON.parse(value).staffLevel+1) 
                            })

                            if(!m && direction=='left'){
                                this.diaglog.data=[];
                                val.disabled=this.form.level > JSON.parse(val.key).staffLevel+1
                            }
                        }
                       
                    }
                }
            },
            disClose(){                 //关闭diag
                this.ALLstaff=[];
                this.diaglog.data=[];
                this.diaglog.show=false;
            },
            add(type){      // diaglog穿梭框 确认提交
                let diaglog=this.diaglog;  //用来判断添加 到 哪个数组的东西
                let data=diaglog.data, //暂存数据
                    Allstafflist=this.listStaff ;// 可供选择人员列表
                    if(data.length==0){
                        this.$message({
                            type:"error",
                            message:"请添加人员!"
                        })
                        return false;
                    }
                    let list=[];
                    const target = data.filter(current => {
                        return current !== null && current !== undefined;
                    })
                     if(!diaglog.protype.bool && target.length>1){
                        this.$message({
                            type:"error",
                            message:"该类人员只能添加一个!"
                        })
                        return false;
                    }
                    for(let val in Allstafflist){               //对象一层
                        if(Allstafflist[val].key==diaglog.protype.projectStaffType){   //如果key匹配
                           for(let value in Allstafflist[val].list){            //对象二级list循环
                               for(let values of target){                       //data循环
                                    if(JSON.parse(values).staffType==Allstafflist[val].list[value].type && values){     
                                        list.push(JSON.parse(values))
                                        Allstafflist[val].list[value].list=list;
                                        Allstafflist[val].list[value].edit=true;
                                    }
                               }
                           }
                        }
                    } 
                this.disClose();
            },
            addStaff(bool,protype,posttype,staffType,tit){    
               if(this.show==0) return false;
               let Allstafflist=this.listStaff;
                  this.diaglog.data=[];
                    this.diaglog.type=2;
                    this.diaglog.protype={
                        projectStaffType:protype,
                        type:staffType,
                        bool:bool
                    };
                    this.diaglog.title=tit;
                    if(posttype){
                        let staff=[];
                        this.staff(posttype,e=>{
                            let newlist={key:staffType,list:[]};
                            if(staffType==1){newlist.list=Allstafflist.Arr.list.sonArr}
                            else if(staffType==2){newlist.list=Allstafflist.Arr.list.sonBrr}
                            else if(staffType==3){newlist.list=Allstafflist.Arr.list.sonCrr}
                            else if(staffType==4){newlist.list=Allstafflist.Brr.list.sonArr}
                            else if(staffType==5){newlist.list=Allstafflist.Brr.list.sonBrr}
                            else if(staffType==6){newlist.list=Allstafflist.Brr.list.sonCrr}
                            else if(staffType==7){newlist.list=Allstafflist.Brr.list.sonDrr}
                            else if(staffType==8){newlist.list=Allstafflist.Brr.list.sonErr}
                            else{newlist.list=Allstafflist.Brr.list.sonFrr}
                            if(newlist.list.edit){
                                for(let val of newlist.list.list){
                                    this.diaglog.data.push(JSON.stringify(val))
                                }
                            }else{
                                this.diaglog.data=[]
                            }
                            for(let [index,val] of e.entries()){
                                console.log(val.staffLevel,this.form.level)
                            // val.disabled=true && this.form.level > val.staffLevel+1 ;
                                let editbool;
                                if(this.diaglog.data.length>0 && bool){
                                    editbool=false;
                                }else{
                                    if((staffType<2 || staffType>3) && (this.form.level > val.staffLevel+1)){
                                        editbool=true;
                
                                    }
                                }
                                staff.push({
                                    key:JSON.stringify({
                                        id: val.id,
                                        licenceNumber: val.licenceNumber,
                                        projectStaffType:protype,
                                        staffId:val.identityId,
                                        staffLevel: val.staffLevel,
                                        staffName: val.name,
                                        staffType:staffType
                                    }),
                                    label:val.name,
                                    id:val.id,
                                    //disabled:((this.form.level > val.staffLevel+1 ) && (protype!=2|| protype!=3))  || false && this.diaglog.data.length>0    //项目级别 A：4 B：3  C：2 D：1 一般：0  人员级别 初级0 中级1  中级2 高级3
                                    disabled:editbool//项目级别 A：4 B：3  C：2 D：1 一般：0  人员级别 初级0 中级1  中级2 高级3
                                
                                })  
                                this.ALLstaff=staff;
                            }
                             this.diaglog.show=true;                       
                        })
                    }else{
                        if(staffType==11){
                            let staff=[]
                            if(!this.form.projectSecurityAndSupervisor[1].companyId) {return false};
                            this.publics.AJAX.$POST({
                                url:"dept/user/"+this.user.userId+"/staffList/dept/"+this.form.projectSecurityAndSupervisor[1].companyId,
                                type:"get",
                                success:(e)=>{
                                     let newlist={key:staffType,list:Allstafflist.Drr.list.sonArr};
                                        if(newlist.list.edit){
                                            for(let val of newlist.list.list){
                                                this.diaglog.data.push(JSON.stringify(val))
                                            }
                                        }else{
                                            this.diaglog.data=[]
                                        }
                                        for(let [index,val] of e.entries()){
                                        // val.disabled=true && this.form.level > val.staffLevel+1 ;
                                            let editbool;
                                            if(this.diaglog.data.length>0 && bool){
                                                editbool=false;
                                            }else{
                                                if(this.form.level > val.staffLevel+1){
                                                    editbool=true;
                                                }
                                            }
                                            staff.push({
                                                key:JSON.stringify({
                                                    id: val.id,
                                                    licenceNumber: val.licenceNumber,
                                                    projectStaffType:protype,
                                                    staffId:val.identityId,
                                                    staffLevel: val.staffLevel,
                                                    staffName: val.name,
                                                    staffType:staffType
                                                }),
                                                label:val.name,
                                                id:val.id,
                                                //disabled:((this.form.level > val.staffLevel+1 ) && (protype!=2|| protype!=3))  || false && this.diaglog.data.length>0    //项目级别 A：4 B：3  C：2 D：1 一般：0  人员级别 初级0 中级1  中级2 高级3
                                                disabled:editbool//项目级别 A：4 B：3  C：2 D：1 一般：0  人员级别 初级0 中级1  中级2 高级3
                                            
                                            })  
                                            this.ALLstaff=staff;
                                            this.diaglog.show=true;
                                        //  console.log(this.diaglog.data)
                                    }
                                }
                            })
                           
                        }
                    }
             
            },
            staff(type,callback){
                this.publics.AJAX.$POST({
                    url:"dept/user/"+this.user.userId+"/staffList/"+type,
                    type:"get",
                    success:(res)=>{
                       callback(res);
                    }
                })
            },
            dataFloat(e){           //作业时间选择
              //e.worktime = [e.beginTime, e.endTime];
                if(e[1]<this.form.endTime || e[0]!=this.form.beginTime){
                    this.$message({
                        message:"更改作业时间失败！",
                        type:"error"
                    })
                    this.form.worktime=[this.form.beginTime,this.form.endTime]
                    return false;
                }else{
                      this.$message({
                        message:"更改作业时间成功！",
                        type:"success"
                    })
                }
            },
            addblast(index){
                if(this.show==0){
                    return false;
                }
                 let arr=["新增炸药数","新增雷管数","新增导爆管","新增导爆索"]
                 this.$prompt('请输入'+arr[index], '新增', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /^[0-9]*[1-9][0-9]*$/,
                    inputErrorMessage: '只能输入数字'
                }).then(({ value }) => {
                  this.form.projectPyrotechnicsList[index].pyrotechnicsNumber += parseInt(value)
                })
            },
            submitForm(){
                let form=JSON.parse(JSON.stringify(this.form)),listStaff=JSON.parse(JSON.stringify(this.listStaff));
                let policeIdslist=[...listStaff.Brr.list.sonCrr.list,...listStaff.Brr.list.sonDrr.list,...listStaff.Brr.list.sonErr.list,...listStaff.Brr.list.sonFrr.list];
               /* let policeIdslist=[]
                for(let val in this.listStaff){
                        for(let value in listStaff[val].list){
                            newlist=newlist.concat(listStaff[val].list[value].list)
                        }
                }
                console.log(0)*/
                        //     "施工方案.审核人","施工方案.批准人","项目负责人","技术负责人","爆破工程技术人员","爆破员","安全员","保管员","评估人员","监理人员"
        
                let post={
                    "beginTime":form.beginTime,
                    "endTime": form.endTime,
                    "id": this.publics.DES.decode(this.$route.query.id),
                    "listStaff": policeIdslist,
                    "projectPyrotechnicsList":form.projectPyrotechnicsList,
                    "remark": this.remark,
                    "updateMan": this.user.userId
                }
                this.$confirm('提交更改信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.publics.AJAX.$POST({
                        url:"project/upd",
                        data:post,
                        success:(e)=>{
                            console.log(e)
                            this.$message({
                                type:"success",
                                message:"更改成功！"
                            })
                            setTimeout(e=>{
                                this.$router.push({name:'projectChange'})
                            },2000)
                                    
                        }
                    })
                }) 
            },
        }
        
    }
</script>
<style lang="scss">
     .changeContair{
         textarea{
             width:100%;
             border:1px solid #ccc;
             padding:10px 20px;
             font-size: 14px;
         }
        .tp{
            padding:20px 0 40px 30px;
        }
        padding:0 35px;
        background: #fff;
        
        .ossbox{
            overflow:hidden;
            width:100%;
            margin-top:60px;
        }
        .uploadOSS{
            position:relative;
            width:300px;
            float:left;
           .files{
               width:150px;
               height:150px;
               .el-form-item__content{
                   height:100%;
                   width:100%;
               }
           }
        }
        .point{
            cursor: pointer;
            transition-duration: 500ms;
           
        }
        .point:hover{
            box-shadow: 0 0 6px #02912e inset;
            
        }
       
        .table{
            border-collapse: collapse;
            text-align: center;
            border:solid thin #979797;
            td,tr,th{
                border-color: #979797;   
                height:40px;
                font-size: 14px;
                color:#333;
                overflow: hidden;
                .el-form-item{
                    margin:0;
                    .el-input__inner {
                        border-radius:0;
                        border-color:#fff;
                    }
                   
                }
                 .point input{
                    cursor: pointer!important;
                }
                .find{
                    display: block;
                    line-height: 40px;
                    width: 20%;
                    text-align: center;
                    float:right;
                    text-align: center;
                }
                .find:hover{
                    color:#03A9F4;
                }
                .el-input__inner {
                    border:0 none;
                }
                .selectcity{
                    width:100%;
                }
                .sml{
                    width:80%;
                    float:left;
                }
            }
             .pred{
                background:  #e0f6ff;
                .el-input__inner,input{
                     background:  #e0f6ff;
                }
                td{
                    color:#000;
          
                }
            }
            .pgtable_add{
                color:#979797;
                font-size: 20px;
                cursor: pointer;
                height:20px;
            }
            .pgtable_add:hover{
                color:steelblue;
            }
            thead{
                font-weight: bold;
                td,tr,th{
                    height:38px;
                }
            }
            margin-bottom: 10px;
        }
      
        .project-form{
            width:100%;
        }
        .el-dialog{
               background: url("../../assets/img/dialog_bg.png") no-repeat 0% 100% #fafafa;
                background-size: 100% auto;
              .clearbox{
                width:100%;
                overflow: hidden;
                display: flex;
                padding-right:30px;
                position: relative;
                .li{
                    flex: 3;
                    .el-input__inner{
                        border-radius:0;
                        line-height: 30px;
                        height:30px;
                    }
                }
               
                .del{
                        width:30px;
                        height:30px;
                        display: block;
                        position: absolute;
                        right:-4px;
                        font-size: 24px;
                        text-align: center;
                        line-height: 30px;
                        top:6px;
                        transition-duration: 500ms;
                }
                .del:hover{
                    color:#f00;
                }
                
                .wid{
                    flex: 1;
                }
                .wid:nth-child(1){
                    flex: 1;
                }
                
            }
            .botbtn{
                margin-top: 40px;
            }
          .transfer{
              overflow: hidden;
              .botbtn{
                  text-align: center;
                  width:100%;
                  overflow: hidden;
              }
              .person{
                  position: relative;
                  overflow: hidden;
              }
              .el-transfer{
                  width:500px;
                  float:left;
              }
                .el-transfer-panel{
                    background: rgba(255,255,255,0.3);    
                }
            }
        }
        .subbtn{
            overflow:hidden;
            padding-bottom:60px;
            text-align:center;
            margin-top:40px;
        }
        .el-range-editor.is-disabled{
            background: none!important;
        }
        .is-disabled input,.is-disabled .el-cascader__label{
            background: none!important;
            color:#333!important;
            cursor: default!important;
        }
    }
</style>
