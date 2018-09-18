<template>
    <div class="blastbuy">
        <div class="comcontairs" v-if="show==0">
            <div class="topHad">
                <el-select v-model="SearchDTO.status" placeholder="选择状态" @change='selectinit'>
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
                        <input :class = "SearchDTO.showSearch ? 'serActive':'search'" type="text" v-model="SearchDTO.multiCondition" :placeholder="SearchDTO.showSearch ?  '请输入项目名称' : '搜索'" @focus="searchAct" @blur="leave">
                    </div>
                </div>
            </div>
            <div class="blastlist">
                <el-table :data="dataList" style="width: 100%"  :row-class-name="tableRowClassName">
                    <el-table-column prop="projectName" label="项目名称"  width="240px"></el-table-column>
                    <el-table-column prop="buyMsg" label="本次购买爆破物品信息" width="360px"> </el-table-column>
                    <el-table-column label="运输时间"  width="240px">
                        <template slot-scope="scope" > 
                            <span v-if="!scope.row.transportTime">-</span>
                            <span v-else>{{scope.row.transportTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="applyTime" label="申请时间"  width="240px"></el-table-column>
                    <el-table-column prop="status" label="状态"  width="200px"  :formatter='formatState'></el-table-column>
                    <el-table-column label="许可证">
                        <template slot-scope="scope" > 
                            <span v-if="scope.row.status==0 || scope.row.status==2">-</span>
                            <span v-if="scope.row.status==3">已上传</span>
                            <el-button type="text" size="small" @click = "handleDetail(scope.row.id,scope.row.transportTime)"  v-if="scope.row.status==1">上传许可证</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <!-- <el-button type="text" size="small"  @click = "handleDetail(scope.row.id,scope.row.transportTime)">查看</el-button> -->
                             <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                                <i class = 'icon detail'  @click = "handleDetail(scope.row.id)"></i>
                            </el-tooltip>
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
        <el-dialog :title="diaglog.title" :visible.sync="diaglog.show"  :before-close="disClose" id="node"  :close-on-click-modal = "false" :close-on-press-escape = 'false'>
            <div v-if="show==2">
                 <el-form ref="form" :model="form"  label-width="0" class="project-form" style="margin:-20px 0 20px 0;">
                    <el-row :gutter="40">
                        <el-col :span="12">
                            <el-form-item label="项目：" label-width="140" v-if="details.status!=2">
                                <el-autocomplete  popper-class="my-autocomplete"  v-model="diaglog.state" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect" style="width:100%;">
                                    <template slot-scope="{ item }"><div class="name">{{ item.value }}</div></template>
                                </el-autocomplete>
                            </el-form-item>
                            <el-form-item label="项目：" label-width="140" v-else>
                                <el-input v-model="diaglog.state" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="项目级别：" label-width="140">
                                <el-input v-model="publics.Filters.convert(company.projectLevel || 0).projectLevel()" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="第几次购买：" label-width="140">
                                <el-input  v-model="company.order || 0" style="width: 100%;" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="仓库：" label-width="140" >
                                <el-input v-model="company.warehouseName" style="width: 100%;" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <table  border="1" class="table" width="100%"  v-if="blastlist">
                    <thead>
                        <td colspan="9">项目物品信息</td>
                    </thead>
                    <tbody>
                        <tr v-for="(i,index) in blastlist">
                            <td width='100'>
                            <span v-if="i.type==1">审批总量</span>  
                            <span v-if="i.type==2">可购买量</span>  
                            <span v-if="i.type==3">项目库余量</span>  
                            </td>
                            <td width='100'>炸药</td>
                            <td width='150'>{{i.zaYao}}千克</td>
                            <td>雷管</td>
                            <td width='100'>{{i.leiGuan}}发</td>
                            <td>导爆管</td>
                            <td width='100'>{{i.daoBaoGuan}}米</td>
                            <td>导爆索</td>
                            <td width='100'>{{i.daoBaoSuo}}米</td>
                        </tr>
                    </tbody>
                </table>
              
                <el-form ref="form" :model="form"  label-width="0" class="project-form" status-icon :rules="rules" :disabled='show==1'>
                    <table  border="1" class="table" width="100%"  v-if="company.projectId">
                        <thead>
                            <td colspan="6">购买物品信息</td>
                        </thead>
                        <tbody>
                            <tr>
                                <td :rowspan="form.blastlist.zy.length+1" colspan="2" width="80">炸药</td>
                                <td width="280">品名</td>
                                <td width="200">型号</td>
                                <td width="160">数量（千克）</td>
                                <td width="80">操作</td>
                            </tr>
                            <tr v-for="(i,index) in form.blastlist.zy">
                                <td>
                                    <el-select v-model="i.pyrotechnicsName">
                                        <el-option :label="j" :value="j" v-for="(j,ind) in form.blasttype.zytype" :key="j"></el-option>
                                    </el-select>
                                </td>
                                <td>
                                    <el-form-item  :prop="'blastlist.zy.' + index + '.pyrotechnicsModel'" :rules="[{required: true}]"  class="li" v-if="i.pyrotechnicsName">
                                        <el-input v-model="i.pyrotechnicsModel"  @keyup.native="i.pyrotechnicsModel=i.pyrotechnicsModel.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')"   @blur="zyblur(index,i.pyrotechnicsModel,i.pyrotechnicsName,0)"></el-input>
                                    </el-form-item>
                                </td>
                                <td>
                                    <el-form-item  :prop="'blastlist.zy.' + index + '.pyrotechnicsNumber'" :rules="[{required: true}]"  class="li"  v-if="i.pyrotechnicsName">
                                        <el-input v-model="i.pyrotechnicsNumber" @keyup.native="i.pyrotechnicsNumber=i.pyrotechnicsNumber.replace(/\D/g,'')"  ></el-input>
                                    </el-form-item>
                                </td>
        
                                <td>
                                    <i class="el-icon-plus"  title="新增" @click="addblast(0,index)" v-if="form.blastlist.zy.length==index+1"></i>
                                    <i class="el-icon-minus" title="删除" @click="badelete(0,index)" v-if="index>0"></i>
                                </td>
                            </tr>
                            <tr>
                                <td :rowspan="form.blastlist.lg.length+1" colspan="2" width="100">雷管</td>
                                <td>类型</td>
                                <td>段别</td>
                                <td>数量（发)</td>
                                <td>操作</td>
                            </tr>
                            <tr  v-for="(i,index) in form.blastlist.lg">
                                <td>
                                    <el-select v-model="i.pyrotechnicsName" placeholder="请选择">
                                        <el-option :label="j" :value="j" v-for="(j,ind) in form.blasttype.lgtype" :key="j"></el-option>
                                    </el-select>
                                </td>
                                <td>
                                    <div  class="lgsml">
                                        <el-input v-model="i.pyrotechnicsModel.d" @keyup.native="i.pyrotechnicsModel.d=i.pyrotechnicsModel.d.replace(/\D/g,'')" v-if="i.pyrotechnicsName">
                                            <template slot="append">段</template>
                                        </el-input>
                                        <el-input v-model="i.pyrotechnicsModel.m"  @keyup.native="i.pyrotechnicsModel.m=i.pyrotechnicsModel.m.replace(/\D/g,'')" v-if="i.pyrotechnicsName" @blur="zyblur(index,i.pyrotechnicsModel,i.pyrotechnicsName,1)">
                                            <template slot="append">米</template>
                                        </el-input>
                                    </div>
                                </td>
                                <td>
                                    <el-form-item  :prop="'blastlist.lg.' + index + '.pyrotechnicsNumber'" :rules="[{required: true}]" v-if="i.pyrotechnicsName" class="li">
                                        <el-input v-model="i.pyrotechnicsNumber" @keyup.native="i.pyrotechnicsNumber=i.pyrotechnicsNumber.replace(/\D/g,'')"></el-input>
                                    </el-form-item>
                                </td>
                                <td>
                                    <i class="el-icon-plus"  title="新增" @click="addblast(1,index)" v-if="form.blastlist.lg.length==index+1"></i>
                                    <i class="el-icon-minus" title="删除" @click="badelete(1,index)" v-if="index>0"></i>
                                </td>
                            </tr>
                            <tr>
                                <td width="100" colspan="2" rowspan="2">工业索类</td>
                                <td width="140">导爆索</td>
                                <td width="100">
                                    <el-form-item  label-width="0" >
                                        <el-input v-model="form.blastlist.dbs.pyrotechnicsNumber" @keyup.native="form.blastlist.dbs.pyrotechnicsNumber=form.blastlist.dbs.pyrotechnicsNumber.replace(/\D/g,'')">
                                                <template slot="append">米</template>
                                        </el-input>
                                    </el-form-item>
                                </td>
                                <td colspan="2">/</td>
                            </tr>
                            <tr>
                                <td width="50">导爆管</td>
                                <td width="100">
                                    <el-form-item  label-width="0" >
                                        <el-input v-model="form.blastlist.dbg.pyrotechnicsNumber" @keyup.native="form.blastlist.dbg.pyrotechnicsNumber=form.blastlist.dbg.pyrotechnicsNumber.replace(/\D/g,'')">
                                                <template slot="append">米</template>
                                        </el-input>
                                    </el-form-item>
                                </td>
                                <td colspan="2">/</td>
                            </tr>
                        </tbody>
                    </table>
                </el-form>
                <div class="subbtn" v-if="blastlist && details.status==0">
                    <el-button type="primary" @click="sub('form')" >提交申请</el-button>
                </div>
            </div>
            <div v-else>        <!--查看-->
                 <table border="1" class="table" width="100%" >
                    <tr>
                        <td width='100'>项目：</td>
                        <td width="200"> 
                            <span>{{details.projectName}}</span>
                        </td>
                        <td width="100">项目级别</td>
                        <td width="150">{{publics.Filters.convert(details.projectLevel).projectLevel()}} ,第   {{details.order}}   次购买</td>
                        <td width="100">仓库</td>
                        <td width="150">{{details.warehouseName}}</td>
                    </tr>
                </table>
                <table  border="1" class="table" width="100%">
                    <thead>
                        <td colspan="9">项目物品信息</td>
                    </thead>
                    <tbody>
                        <tr v-for="(i,index) in details.projectPurchaseNumberList">
                            <td width='100'>
                            <span v-if="i.type==1">审批总量</span>  
                            <span v-if="i.type==2">可购买量</span>  
                            <span v-if="i.type==3">项目库余量</span>  
                            </td>
                            <td width='100'>炸药</td>
                            <td width='150'>{{i.zaYao}}千克</td>
                            <td>雷管</td>
                            <td width='100'>{{i.leiGuan}}发</td>
                            <td>导爆管</td>
                            <td width='100'>{{i.daoBaoGuan}}米</td>
                            <td>导爆索</td>
                            <td width='100'>{{i.daoBaoSuo}}米</td>
                        </tr>
                    </tbody>
                </table>

                    <table  border="1" class="table" width="100%"  v-if="details.blastlist">
                        <thead>
                            <td colspan="5">购买物品信息</td>
                        </thead>
                        <tbody>
                            <tr>
                                <td :rowspan="form.blastlist.zy.length+1" colspan="2" width="140">炸药</td>
                                <td width="240">品名</td>
                                <td width="240">型号</td>
                                <td width="240">数量（ 千克 ）</td>
                            </tr>
                            <tr v-for="(i,index) in details.blastlist.zy">
                                <td>{{i.pyrotechnicsName}}</td>
                                <td>{{i.pyrotechnicsModel}}</td>
                                <td>{{i.pyrotechnicsNumber}}</td>
                            </tr>
                            <tr>
                                <td :rowspan="details.blastlist.lg.length+1" colspan="2" width="60">雷管</td>
                                <td>类型</td>
                                <td>段别</td>
                                <td>数量（发）</td>
                            </tr>
                            <tr  v-for="(i,index) in details.blastlist.lg" >
                                <td>{{i.pyrotechnicsName}}</td>
                                <td>
                                    <div  class="lgsml">
                                        <el-input v-model="i.pyrotechnicsModel.d" :disabled="true"> 
                                            <template slot="append">段</template>
                                        </el-input>
                                        <el-input v-model="i.pyrotechnicsModel.m" :disabled="true">
                                            <template slot="append">米</template>
                                        </el-input>
                                    </div>
                                </td>
                                <td>{{i.pyrotechnicsNumber}}</td>
                            </tr>
                            <tr>
                                <td width="100" colspan="2" rowspan="2">工业索类</td>
                                <td width="140">导爆索</td>
                                <td width="100">
                                    <el-input v-model="details.blastlist.dbs.pyrotechnicsNumber || 0" :disabled="true">
                                        <template slot="append">米</template>
                                    </el-input>
                                </td>
                                <td>/</td>
                            </tr>
                            <tr>
                                 <td width="50">导爆管</td>
                                <td width="100">
                                    <el-input v-model="details.blastlist.dbg.pyrotechnicsNumber || 0" :disabled="true">
                                        <template slot="append">米</template>
                                    </el-input>
                                </td>
                                <td>/</td>
                            </tr>
                        </tbody>
                    </table>
            </div>
            <div class="upbook" v-if="details.status>0">
                <div class="jgarea">
                    <img src="../../assets/img/err.png" v-if="details.status==2">
                    <dl>
                        <dt>审核信息</dt>
                        <dd v-for="(i,index) in details.projectSecurityApprovalDTOList">
                            <font color="#39ad00" v-if="i.status==0" >[申请]</font>
                            <font color="#f00" v-if="i.status==3 || i.status==1" >[驳回]</font>
                            <font color="#39ad00" v-if="i.status==4 || i.status==2">[同意]</font>
                            <span>{{i.opinion}}</span>
                            (<span>{{i.deptName}}</span>,<span>{{i.approvalManName}}</span>,<span>{{publics.Filters.timer(i.approvalTime)}}</span>)
                        </dd>
                    </dl>
                </div>
                <div class="psinfo" v-if="details.status==1 || details.status==3">
                      <el-form :model="newForm" ref = "newForm"  :rules="rules" :disabled="details.status==3">
                        <el-row :gutter="40">
                            <el-col :span="12">
                                <el-form-item label="运输起点" label-width="80" prop='startAddress'  :rules="[{ required: true, message: '运输起点不能为空'}]">
                                    <el-input v-model="newForm.startAddress" @keyup.native="newForm.startAddress = newForm.startAddress.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/g,'')" ></el-input>
                                </el-form-item>
                                <el-form-item label="运输终点" label-width="80">
                                    <el-input v-model="details.warehouseAddress" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="有效期至" label-width="80" prop='validityTime'  :rules="[{ required: true, message: '有效期不能为空'}]">
                                    <el-date-picker type="date" v-model="newForm.validityTime" style="width: 100%;" value-format="timestamp" :picker-options="pickerOptions0" ></el-date-picker>
                                </el-form-item>
                                <el-form-item label="配送时间" label-width="80" prop='transportTime'  :rules="[{ required: true, message: '配送时间不能为空'}]" v-if="newForm.validityTime">
                                    <el-date-picker type="date" v-model="newForm.transportTime" style="width: 100%;"  value-format="timestamp" :picker-options="pickerOptions0" @change="cktime"></el-date-picker></el-date-picker>
                                </el-form-item>
                            </el-col>
                             <el-col :span = '12'>
                                <el-form-item label="上传运输许可证" prop="transportImg" :rules="[{ required: true, message: '请上传照片'}]" class="upimg">
                                    <div class="uploadpic">
                                        <File :data="upload[0]" @bindValue="newForm.transportImg = upload[0].url"  :look = 'newForm.status'></File>
                                    </div>
                                </el-form-item>
                            </el-col>
                        
                        </el-row>
                        <div class="btn">
                             <el-button type="primary" @click="uploadxkz('newForm')" v-if="details.status==1">确认提交</el-button>
                        </div>
                    </el-form>
                </div>
                <div class="btn">
                      <el-button type="primary" v-if="details.status==2 && show!=2" @click='again'>重新申请</el-button>
                      <el-button type="primary" @click="sub('form',1)" v-if="details.status==2 && show==2">提交申请</el-button>
                </div>
            </div>
        </el-dialog> 
    </div>
</template>
<script>
    import file from "../../components/upload";
    export default {
        data(){
            return {
                pickerOptions0:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                dataList:null,
                blastlist:null,          //炸弹余量
                show:0,     //切换      0列表 1查看 2新增 
                user:this.publics.global().auth,
                page:1,
                size:10,
                total:0,
                SearchDTO:{
                    multiCondition:'',//搜索框
                    status:"",//状态
                    statuslist:[
                        {value:"",text:'全部'},
                        {value:0,text:'待审批'},
                        {value:1,text:'已通过'},
                        {value:2,text:'已驳回'},
                        {value:3,text:'已完成'},
                    ],
                    showSearch:false,//是否激活搜索
                },
                rules:{},
                company:{},
                diaglog:{       // 弹出框  
                     show:false, //是否现实
                     type:0,    // 弹出状态
                     title:"购买申请",      
                     data:[],   //存储数据
                     state:''
                },
                details:{},
                newForm:{   //上传许可证form
                    startAddress:"",
                    validityTime:"",
                    transportTime:"",
                    transportImg:"",
                    stauts:false,
                },             
                upload:[{type:0,dataurl:'',url:''}],
                form:{                  //购买初始form
                       blasttype:{              //炸药类型
                            lgtype:[],           //雷管类型
                            zytype:[]            //炸药类型
                       },
                       blastlist:{
                            zy:[{           
                                    pyrotechnicsModel:"",           //火工品型号 
                                    pyrotechnicsName:"",            //火工品名称 ,
                                    pyrotechnicsNumber:"",          //火工品数量 ,
                                    pyrotechnicsType:1,             //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"千克",          // 火工品单位
                                }, 
                            ],
                            lg:[
                                {
                                    pyrotechnicsModel:{d:"",m:""},  //火工品型号 
                                    pyrotechnicsName:"",            //火工品名称 ,
                                    pyrotechnicsNumber:"",          //火工品数量 ,
                                    pyrotechnicsType:2,             //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"发",          // 火工品单位
                                },
                            ],
                            dbg:{
                                    pyrotechnicsModel:"1",           //火工品型号 
                                    pyrotechnicsName:"导爆物",       //火工品名称 ,
                                    pyrotechnicsNumber:"",          //火工品数量 ,
                                    pyrotechnicsType:3,             //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"米",          // 火工品单位
                            },
                            dbs:{
                                    pyrotechnicsModel:"2",        //火工品型号 
                                    pyrotechnicsName:"导爆物",    //火工品名称 ,
                                    pyrotechnicsNumber:"",       //火工品数量 ,
                                    pyrotechnicsType:3,          //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"米",       // 火工品单位
                            }
                            
                        }
                },
                test:{
                    src:"",
                    show:false
                }
            }
        },
        created(){
            this.init();
            this.getcomplist()
            this.publics.AJAX.$POST({
                url:"dict/"+2,
                type:"get",
                success:(e)=>{
                  this.form.blasttype.zytype=e;
                }
            })
            this.publics.AJAX.$POST({
                url:"dict/"+1,
                type:"get",
                success:(e)=>{
                  this.form.blasttype.lgtype=e;
                }
            })
        },
        components:{
            File:file
        },
        methods:{
            selectinit(){
                this.page=1;
                this.init();
            },
            /*  {value:0,text:'待审批'},
                        {value:1,text:'已通过'},
                        {value:2,text:'已驳回'},
                        {value:3,text:'已上传许可证'}, */
            cktime(val){
               if(val>this.newForm.validityTime){
                   this.newForm.transportTime=this.newForm.validityTime
               }
            },            
            tableRowClassName(row) {
                if (row.row.status == 0) {
                    return 'blue';
                } else if (row.row.status == 2) {
                    return 'red';
                } else if (row.row.status == 1 || row.row.status == 3) {
                    return 'green';
                }else
                    return ''
                 
            },
            again(){        //重新申请
                let details=this.details;
                this.diaglog.state=details.projectName;
                this.company={
                    projectLevel:details.projectLevel,
                    order:details.order,
                    warehouseName:details.warehouseName,
                    projectId:details.projectId
                }
                this.blastlist=details.projectPurchaseNumberList;
                let blastlist={zy:[],lg:[],dbg:null,dbs:null};
                for(let val of details.pyrotechnics){
                    if(val.pyrotechnicsType==1){
                        blastlist.zy.push(val)
                    }
                    else if(val.pyrotechnicsType==2){
                        blastlist.lg.push(val)
                    }
                    else{
                        if(val.pyrotechnicsModel==1){
                            blastlist.dbg=val
                        }else{
                            blastlist.dbs=val
                        }
                    }
                }
                if(blastlist.zy.length==0){
                    blastlist.zy=[{           
                      //  pyrotechnicsModel:"",          
                        pyrotechnicsName:"",           
                        pyrotechnicsNumber:"",          
                        pyrotechnicsType:1,            
                        pyrotechnicsUnit:"千克",      
                   }]
                }
                if(blastlist.lg.length==0){
                    blastlist.lg=[ {
                        pyrotechnicsModel:{d:"",m:""},  
                        pyrotechnicsName:"雷管",           
                        pyrotechnicsNumber:"",         
                        pyrotechnicsType:2,             
                        pyrotechnicsUnit:"发",        
                    }]
                }
                if(blastlist.dbg==null){
                    blastlist.dbg={           
                        pyrotechnicsModel:"1",          
                        pyrotechnicsName:"导爆物",      
                        pyrotechnicsNumber:"",        
                        pyrotechnicsType:3,            
                        pyrotechnicsUnit:"米",         
                    }
                            
                }
                if(blastlist.dbs==null){
                    blastlist.dbs={
                        pyrotechnicsModel:"2",        
                        pyrotechnicsName:"导爆物",   
                        pyrotechnicsNumber:"",      
                        pyrotechnicsType:3,         
                        pyrotechnicsUnit:"米",     
                    }
                }
                this.form.blastlist=blastlist;
                this.show=2
            },
            pageChange(i){
                this.page=i;
                this.init();
            },
            uploadxkz(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.publics.AJAX.$POST({
                            url:"purchase/updateLicense",
                            data:{
                                "id": this.details.id,
                                "regLicense": {
                                    "startAddress": this.newForm.startAddress,
                                    "transportImg": this.newForm.transportImg,
                                    "transportTime": this.newForm.transportTime,
                                    "validityTime": this.newForm.validityTime
                                },
                                "updateMan": this.user.userId
                            },
                            success:(e)=>{
                                this.$message({
                                    type:"success",
                                    message:"上传许可证成功！"
                                })
                                setTimeout(e=>{
                                    window.history.go(0)
                                },1000)
                            }
                        })
                    }
                })
            },
            handleDetail(id){
                this.publics.AJAX.$POST({
                    url:"purchase/detail/"+id,
                    success:(e)=>{
                        let details=e;
                        details.blastlist={zy:[],lg:[],dbs:null,dbg:null}
                        for(let val of e.pyrotechnics){
                            if(val.pyrotechnicsType==1){
                                 details.blastlist.zy.push(val)
                            }
                            else if(val.pyrotechnicsType==2){
                                val.pyrotechnicsModel={
                                    d:val.pyrotechnicsModel.split("-")[0],
                                    m:val.pyrotechnicsModel.split("-")[1]
                                }
                                details.blastlist.lg.push(val)
                            }
                            else{
                                if(val.pyrotechnicsModel==1){
                                    details.blastlist.dbg=val
                                }else{
                                    details.blastlist.dbs=val
                                }
                            }
                        }
                        if(details.blastlist.zy.length==0){
                            details.blastlist.zy=[{           
                                    pyrotechnicsModel:"/",          
                                    pyrotechnicsName:"/",           
                                    pyrotechnicsNumber:"/",          
                                    pyrotechnicsType:1,            
                                    pyrotechnicsUnit:"千克",      
                                }
                            ]
                        }
                        if(details.blastlist.lg.length==0){
                            details.blastlist.lg=[ {
                                    pyrotechnicsModel:{d:"/",m:"/"},  
                                    pyrotechnicsName:"/",           
                                    pyrotechnicsNumber:"/",         
                                    pyrotechnicsType:2,             
                                    pyrotechnicsUnit:"发",        
                            },]
                        }
                        if(details.blastlist.dbg==null){
                            details.blastlist.dbg={           
                                    pyrotechnicsModel:"1",          
                                    pyrotechnicsName:"导爆物",      
                                    pyrotechnicsNumber:"/",        
                                    pyrotechnicsType:3,            
                                    pyrotechnicsUnit:"米",         
                            }
                            
                        }
                        if(details.blastlist.dbs==null){
                            details.blastlist.dbs={
                                    pyrotechnicsModel:"2",        
                                    pyrotechnicsName:"导爆物",   
                                    pyrotechnicsNumber:"/",      
                                    pyrotechnicsType:3,         
                                    pyrotechnicsUnit:"米",     
                            }
                        }
                        console.log(details.blastlist)
                        if(e.status==3){
                            this.newForm=e.regLicense
                            this.upload[0].url=this.upload[0].dataurl=e.regLicense.transportImg;
                            this.newForm.status=true;
                        }
                        else{
                            this.newForm={  
                                startAddress:"",
                                validityTime:"",
                                transportTime:"",
                                transportImg:"",
                            }
                            this.upload[0].dataurl="";
                            this.upload[0].url=""
                        }
                       
                        this.show=1;
                        this.diaglog.show=true;
                        this.details=details;
                        setTimeout(s=>{
                             if(e.status==1){
                                // this.$refs['newForm'].resetFields()
                                this.$refs['newForm'].clearValidate()
                            }
                        },100)
                        console.log(details)
                    }
                })
            },
            sub(formName,type){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let pyrotechnics=[];
                        let cloneblast=JSON.parse(JSON.stringify(this.form.blastlist));
                        if(cloneblast.zy[0].pyrotechnicsName){
                            let zyNum=0;
                            for(let val of cloneblast.zy){
                                if(!val.pyrotechnicsNumber || !val.pyrotechnicsModel){
                                    this.$message({
                                        message:"请填写完炸药信息",
                                        type:"error"
                                    })
                                    return false;
                                }
                                zyNum +=parseInt(val.pyrotechnicsNumber)
                            }
                            if(zyNum>this.blastlist[1].zaYao){
                                this.$message({
                                    message:"炸药超过购买量",
                                    type:"error"
                                })
                                return false;
                            }
                           pyrotechnics=pyrotechnics.concat(cloneblast.zy)
                        }
                        if(cloneblast.lg[0].pyrotechnicsName){
                            let lgNum=0;
                            for(let val of cloneblast.lg){
                                if((!val.pyrotechnicsModel.d || !val.pyrotechnicsModel.m)){
                                    this.$message({
                                        message:"请填写完雷管信息",
                                        type:"error"
                                    })
                                    return false;
                                }
                                lgNum +=parseInt(val.pyrotechnicsNumber)
                                val.pyrotechnicsModel=val.pyrotechnicsModel.d+"-"+val.pyrotechnicsModel.m
                            }
                            if(lgNum>this.blastlist[1].leiGuan){
                                this.$message({
                                    message:"雷管超过购买量",
                                    type:"error"
                                })
                                return false;
                            }
                            pyrotechnics=pyrotechnics.concat(cloneblast.lg)
                        }

                        if(parseInt(this.form.blastlist.dbg.pyrotechnicsNumber)>this.blastlist[1].daoBaoGuan){
                            this.$message({
                                message:"导爆管超过购买量",
                                type:"error"
                            })
                            return false;
                        }
                        
                        if(parseInt(this.form.blastlist.dbs.pyrotechnicsNumber)>this.blastlist[1].daoBaoSuo){
                            this.$message({
                                message:"导爆索超过购买量",
                                type:"error"
                            })
                            return false;
                        }   
                        
                        //let pyrotechnics=[...cloneblast.zy,...cloneblast.lg];
                        
                        if(parseInt(this.form.blastlist.dbs.pyrotechnicsNumber)>0){
                            pyrotechnics.push(cloneblast.dbs)
                        }
                        if(parseInt(this.form.blastlist.dbg.pyrotechnicsNumber)>0){
                            pyrotechnics.push(cloneblast.dbg)
                        }
                        if(pyrotechnics.length==0){
                            this.$message({
                                message:"至少购买一种火工品",
                                type:"error"
                            })
                            return false;
                        }
                        let dto = {
                            "pyrotechnics":pyrotechnics
                        }
                        if(type==1){
                            dto.id=this.details.id,
                            dto.updateMan=this.user.userId;
                            this.$confirm('重新申请购买, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.publics.AJAX.$POST({
                                    url:"purchase/upd",
                                    data:dto,
                                    success:(e)=>{
                                        this.diaglog.show=false;
                                        this.$message({
                                            type:"success",
                                            message:"重新申请购买成功！"
                                        })
                                        setTimeout(e=>{
                                            window.history.go(0)
                                        },1000)
                                    }   
                                })
                            })
                        }else{
                            dto.projectId=this.company.projectId;
                            dto.createMan=this.user.userId;
                            this.$confirm('申请购买, 是否继续?', '提示', {
                                confirmButtonText: '确定',
                                cancelButtonText: '取消',
                                type: 'warning'
                            }).then(() => {
                                this.publics.AJAX.$POST({
                                    url:"purchase/buy",
                                    data:dto,
                                    success:(e)=>{
                                        this.diaglog.show=false;
                                        this.$message({
                                            type:"success",
                                            message:"购买成功！"
                                        })
                                        setTimeout(e=>{
                                            window.history.go(0)
                                        },1000)
                                    }   
                                })
                            })
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                      
                })
            },
            zyblur(index,pyrotechnicsModel,pyrotechnicsName,type){
                let Arr=type==0?this.form.blastlist.zy:this.form.blastlist.lg;
                for(let [idx,val] of Arr.entries()){
                    if(pyrotechnicsName==val.pyrotechnicsName && idx!=index){
                        if(type==0){
                            if(pyrotechnicsModel==val.pyrotechnicsModel){
                                this.$message({
                                    type:"error",
                                    message:"同类型火工品型号不能相同！"
                                })
                                this.form.blastlist.zy[index].pyrotechnicsModel=""
                                return false;
                            }
                        }else{
                            if(pyrotechnicsModel.d==val.pyrotechnicsModel.d && pyrotechnicsModel.m==val.pyrotechnicsModel.m){
                                this.form.blastlist.lg[index].pyrotechnicsModel={d:"",m:""}
                                return false;
                            }
                        }
                    }
                }
            },
            badelete(type,index){
                if(type==0){
                     this.$confirm('此操作将删除此条火工品新增, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.form.blastlist.zy.splice(index,1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                }else{
                     this.$confirm('此操作将删除此条雷管新增, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.form.blastlist.lg.splice(index,1);
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                }
            },
            addblast(like,index){
                if(like==0){
                    for(let val of this.form.blastlist.zy){
                        if(!val.pyrotechnicsName){ this.$message({type:"error",message:"请选择炸药品名"});return false;}
                        if(!val.pyrotechnicsModel){ this.$message({type:"error",message:"请填写炸药型号"});return false;}
                        if(!val.pyrotechnicsNumber){ this.$message({type:"error",message:"请填写炸药数量"});return false;}
                      
                    }
                    let key={           
                        pyrotechnicsModel:"",  
                        pyrotechnicsName:"",   
                        pyrotechnicsNumber:"", 
                        pyrotechnicsType:1,  
                        pyrotechnicsUnit:"Kg", 
                    }
                    this.form.blastlist.zy.push(key)
                }else{
                     for(let val of this.form.blastlist.lg){
                        if(!val.pyrotechnicsName){ this.$message({type:"error",message:"请选择雷管类型"});return false;}
                        if(!val.pyrotechnicsModel.d || !val.pyrotechnicsModel.m){ this.$message({type:"error",message:"请填写雷管段别"});return false;}
                        if(!val.pyrotechnicsNumber){ this.$message({type:"error",message:"请填写雷管数量"});return false;}
                    
                    }
                    let key={           
                        pyrotechnicsModel:{d:"",m:""},  
                        pyrotechnicsName:"",   
                        pyrotechnicsNumber:"", 
                        pyrotechnicsType:2,  
                        pyrotechnicsUnit:"发", 
                    }
                    this.form.blastlist.lg.push(key)
                }
            },
            searchAct(){
                this.SearchDTO.showSearch = true;
            },
            leave(){//搜索blur
                if(this.SearchDTO.multiCondition == ''){
                    this.SearchDTO.showSearch = false;
                }
                this.page=1;
                this.init();
            },
            init(){
                this.publics.AJAX.$POST({
                    url:"purchase/select",
                    data:{
                        "projectName": this.SearchDTO.multiCondition,
                        "simplePage": {
                            "page": this.page,
                            "size": this.size,
                        },
                        "status":this.SearchDTO.status,
                        "userId": this.user.userId
                    },
                    success:(e)=>{
                       for(let val of e.list){
                          if(val.transportTime){
                             val.transportTime=this.publics.Filters.timer(val.transportTime)
                          }
                          val.applyTime=this.publics.Filters.timer(val.applyTime)
                       }
                       this.total=e.count;
                       this.dataList=e.list;
                       console.log(e)
                    }
                })
            },
            getcomplist(){          //获取可购买列表
                this.publics.AJAX.$POST({
                    url:"project/select/"+ this.user.userId,
                    success:(e)=>{
                       for(let val of e){
                            val.value=val.projectName;
                       }
                     //  console.log(val)
                       this.diaglog.data=e;
                    }
                })
            },
            getblast(id){         //查看炸弹余额
                this.publics.AJAX.$POST({
                    url:"project/"+id+"/purchaseRegNumber",
                    success:(e)=>{
                        this.blastlist=e;
                    }
                })
            },
            disClose(){
                this.show=0;
                this.diaglog.state="";
                this.diaglog.show=false;
               
            },
            
            formatState(res){
                let status=["待审批","已通过","已驳回","已完成"];
                return status[res.status];
                
              /*  let zynum =0,lgnum=0,gysnum=0;
                for(let val of res.pyrotechnics){
                    if(val.pyrotechnicsType=="1"){
                        zynum +=val.pyrotechnicsNumber
                    }
                    if(val.pyrotechnicsType=="2"){
                        lgnum +=val.pyrotechnicsNumber
                    }
                    else{
                        gysnum +=val.pyrotechnicsNumber
                    }
                }
                return "炸药："+zynum+"公斤，雷管："+lgnum+"发，工业索类："+gysnum+"米"*/
            },
            handleSelect(val){
               
                 if(val.status==3){
                    this.$message({
                        type:"error",
                        message:"该项目正在修改中"
                    })
                    this.diaglog.state=""
                    return false;
                }
                if(val.status==4){
                    this.$message({
                        type:"error",
                        message:"该项目正在购买中"
                    })
                    this.diaglog.state=""
                    return false;
                }
                 if(val.status==5){
                    this.$message({
                        type:"error",
                        message:"该项目有购买申请被驳回"
                    })
                    this.diaglog.state=""
                    this.diaglog.show=false;
                    this.show=0;
                    return false;
                }
                this.company=val;
                this.details.status=0;
                this.getblast(val.projectId)
                this.form.blastlist={
                            zy:[{           
                                    pyrotechnicsModel:"",           //火工品型号 
                                    pyrotechnicsName:"",            //火工品名称 ,
                                    pyrotechnicsNumber:"",          //火工品数量 ,
                                    pyrotechnicsType:1,             //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"千克",          // 火工品单位
                                }, 
                            ],
                            lg:[
                                {
                                    pyrotechnicsModel:{d:"",m:""},  //火工品型号 
                                    pyrotechnicsName:"",            //火工品名称 ,
                                    pyrotechnicsNumber:"",          //火工品数量 ,
                                    pyrotechnicsType:2,             //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"发",          // 火工品单位
                                },
                            ],
                            dbg:{
                                    pyrotechnicsModel:"1",           //火工品型号 
                                    pyrotechnicsName:"导爆物",       //火工品名称 ,
                                    pyrotechnicsNumber:"",          //火工品数量 ,
                                    pyrotechnicsType:3,             //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"米",          // 火工品单位
                            },
                            dbs:{
                                    pyrotechnicsModel:"2",        //火工品型号 
                                    pyrotechnicsName:"导爆物",    //火工品名称 ,
                                    pyrotechnicsNumber:"",       //火工品数量 ,
                                    pyrotechnicsType:3,          //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"米",       // 火工品单位
                            }
                            
                }
            },
            addNewForm(){
                this.show=2;
                this.details={};
                this.company={};
                this.blastlist=null;
                this.diaglog.show=true;
            },
            querySearch(queryString, cb) {
                var restaurants = this.diaglog.data;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) >= 0);
                };
            },
        }
    }
</script>
<style lang="scss">
    .blastbuy{
        .icon{
            display: inline-block;
            width: 17px;
            height: 17px;
            margin: 0 7px;
        }
        .detail{
            background: url('../../assets/img/detail.png');
        }
        .jgarea{
            position: relative;
            img{
                width:150px;
                right:40px;
                position: absolute;
                top:-30px;
            }
            dt{
                line-height: 30px;
                font-size: 16px;
                color:#333;
            }
            dd{
                line-height: 24px;
            }
            span{
                display: inline-block;
                padding:0 4px;
            }
        }
        .my-autocomplete {
            li {
                line-height: normal;
                padding: 7px;

                .name {
                text-overflow: ellipsis;
                overflow: hidden;
                }
                .addr {
                font-size: 12px;
                color: #b4b4b4;
                }

                .highlighted .addr {
                color: #ddd;
                }
            }
        }
         .red td:nth-child(5){
                color:#f00;
            }
            .blue td:nth-child(5){
                color:#03A9F4;
            }
             .green td:nth-child(5){
                color:#0e9b0e;
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
                        text-align: center;
                    }
                   
                }
                .el-select{
                     .el-input__inner {
                         text-align: center;
                     }
                }
               
                i{
                    cursor: pointer;
                    margin:0 5px;
                }
                i:hover{
                    color:#03A9F4;
                }
                .el-icon-minus:hover{
                    color:#f00;
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
                 .lgsml{
                    width:100%;
                    .el-input{
                        float:left;
                        width:45%;
                        .el-input__inner{
                            padding:0;
                            text-align: center;
                        }
                        .el-input-group__append{
                            padding:0 10px 0 0;
                        }
                    }
                }
                
            }
           
            .el-range-editor.is-disabled{
                background: none!important;
            }
            .el-date-editor{
                width:100%;
            }
            .is-disabled input,.is-disabled .el-cascader__label{
                background: none!important;
                color:#333!important;
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
            .el-input-group__append, .el-input-group__prepend{
                background: none;
                border:0 none;
            }
        }
        .subbtn{
            margin-top:30px;
            text-align: center;
        }
        .btn{
            margin-top:30px;
            text-align: center;
        }
        .el-input.is-disabled .el-input__inner{
            background: none;
            text-align: center;
            color:#333;
        }
        .uploadpic{
            width:200px;
            height:200px;
        }
        .el-input__inner{
            text-align: center;
        }
        .upimg{
            width:200px;
            .el-form-item__error{
                width:100%;
                text-align: center;
            }
        }
    }
</style>

