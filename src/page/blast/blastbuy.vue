<template>
    <div class="blastbuy">
        <div class="comcontairs" v-if="show==0">
            <div class="topHad">
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
                        <input :class = "SearchDTO.showSearch ? 'serActive':'search'" type="text" v-model="SearchDTO.multiCondition" :placeholder="SearchDTO.showSearch ?  '请输入项目名' : '搜索'" @focus="searchAct" @blur="leave">
                    </div>
                </div>
            </div>
            <div class="blastlist">
                <el-table :data="dataList" style="width: 100%">
                    <el-table-column prop="name" label="项目名称"  width="240px"></el-table-column>
                    <el-table-column prop="projectAddress" label="作业地点" width="200px"> </el-table-column>
                    <el-table-column prop="status" label="状态" :formatter='formatState' width="140px"></el-table-column>
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
        <el-dialog :title="diaglog.title" :visible.sync="diaglog.show"  :before-close="disClose" id="node">
            <table  border="1" class="table" width="100%" >
                <tr>
                    <td width='100'>项目：</td>
                    <td width="200"> 
                        <el-autocomplete  popper-class="my-autocomplete"  v-model="diaglog.state" :fetch-suggestions="querySearch" placeholder="请输入内容" @select="handleSelect">
                            <template slot-scope="{ item }"><div class="name">{{ item.value }}</div></template>
                        </el-autocomplete>
                    </td>
                    <td width="100">项目级别：</td>
                    <td width="150">{{publics.Filters.convert(company.projectLevel || 0).projectLevel()}} ,第   {{company.order || 0}}   次购买</td>
                    <td width="100">仓库：</td>
                    <td width="150">{{company.warehouseName}}</td>
                </tr>
            </table>
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
                        <td width='150'>{{i.zaYao}}</td>
                        <td>雷管</td>
                        <td width='100'>{{i.leiGuan}}</td>
                        <td>导爆管</td>
                        <td width='100'>{{i.daoBaoGuan}}</td>
                        <td>导爆索</td>
                        <td width='100'>{{i.daoBaoSuo}}</td>
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
                            <td :rowspan="form.blastlist.zy.length+1" colspan="2" width="120">炸药</td>
                            <td width="180">品名</td>
                            <td width="180">型号</td>
                            <td width="180">数量（kg）</td>
                            <td width="180">操作</td>
                        </tr>
                        <tr v-for="(i,index) in form.blastlist.zy">
                            <td>
                                <el-select v-model="i.pyrotechnicsName">
                                    <el-option :label="j" :value="j" v-for="(j,ind) in form.blasttype.zytype" :key="j"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <el-form-item  :prop="'blastlist.zy.' + index + '.pyrotechnicsModel'" :rules="[{required: true}]"  class="li" >
                                    <el-input v-model="i.pyrotechnicsModel" @blur="zyblur(index,i.pyrotechnicsModel,i.pyrotechnicsName,0)"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <el-form-item  :prop="'blastlist.zy.' + index + '.pyrotechnicsNumber'" :rules="[{required: true}]"  class="li">
                                    <el-input v-model="i.pyrotechnicsNumber"></el-input>
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
                        <tr  v-for="(i,index) in form.blastlist.lg" >
                            <td>
                                <el-select v-model="i.pyrotechnicsName" placeholder="">
                                    <el-option :label="j" :value="j" v-for="(j,ind) in form.blasttype.lgtype" :key="j"></el-option>
                                </el-select>
                            </td>
                            <td>
                                <div  class="lgsml">
                                    <el-input v-model="i.pyrotechnicsModel.d">
                                        <template slot="append">段</template>
                                    </el-input>
                                    <el-input v-model="i.pyrotechnicsModel.m" @blur="zyblur(index,i.pyrotechnicsModel,i.pyrotechnicsName,1)">
                                        <template slot="append">米</template>
                                    </el-input>
                                </div>
                            </td>
                            <td>
                                <el-form-item  :prop="'blastlist.lg.' + index + '.pyrotechnicsNumber'" :rules="[{required: true}]"  class="li">
                                    <el-input v-model="i.pyrotechnicsNumber"></el-input>
                                </el-form-item>
                            </td>
                            <td>
                                <i class="el-icon-plus"  title="新增" @click="addblast(1,index)" v-if="form.blastlist.lg.length==index+1"></i>
                                <i class="el-icon-minus" title="删除" @click="badelete(1,index)" v-if="index>0"></i>
                            </td>
                        </tr>
                        <tr>
                            <td width="100" colspan="2">工业索类</td>
                            <td width="140">导爆索</td>
                            <td width="100">
                                <el-form-item  label-width="0" >
                                      <el-input v-model="form.blastlist.dbg.pyrotechnicsNumber">
                                            <template slot="append">米</template>
                                      </el-input>
                                </el-form-item>
                            </td>
                            <td width="50">导爆索</td>
                            <td width="100">
                                 <el-form-item  label-width="0" >
                                      <el-input v-model="form.blastlist.dbs.pyrotechnicsNumber">
                                            <template slot="append">米</template>
                                      </el-input>
                                </el-form-item>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </el-form>
            <div class="subbtn" v-if="blastlist && !test.show">
                <el-button type="primary" @click="sub('form')">提交申请</el-button>
            </div>
        </el-dialog> 
        <toast v-bind:img="test" @tosub="endsub"></toast>
    </div>
</template>
<script>
    import toast from "../../components/toast";
    import domtoimage from "dom-to-image";
    export default {
        data(){
            return {
                dataList:null,
                blastlist:null,          //炸弹余量
                show:0,     //切换 
                user:this.publics.global().auth,
                page:1,
                size:10,
                total:0,
                SearchDTO:{
                    multiCondition:'',//搜索框
                    status:'',//状态
                    statuslist:[
                        {value:"",text:'全部'},
                        {value:0,text:'待审批'},
                        {value:1,text:'已通过'},
                        {value:2,text:'已驳回'},
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
                form:{
                       blasttype:{              //炸药类型
                            lgtype:[],           //雷管类型
                            zytype:[]            //炸药类型
                       },
                       blastlist:{
                            zy:[{           
                                    pyrotechnicsModel:"",  //火工品型号 
                                    pyrotechnicsName:"",   //火工品名称 ,
                                    pyrotechnicsNumber:"", //火工品数量 ,
                                    pyrotechnicsType:1,  //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"Kg", // 火工品单位
                                }, 
                            ],
                            lg:[
                                {
                                    pyrotechnicsModel:{d:"",m:""},  //火工品型号 
                                    pyrotechnicsName:"",   //火工品名称 ,
                                    pyrotechnicsNumber:"", //火工品数量 ,
                                    pyrotechnicsType:2,  //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"发", // 火工品单位
                                },
                            ],
                            dbg:{
                                    pyrotechnicsModel:"1",  //火工品型号 
                                    pyrotechnicsName:"导爆物",   //火工品名称 ,
                                    pyrotechnicsNumber:"", //火工品数量 ,
                                    pyrotechnicsType:3,  //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"米", // 火工品单位
                            },
                            dbs:{
                                    pyrotechnicsModel:"2",  //火工品型号 
                                    pyrotechnicsName:"导爆物",   //火工品名称 ,
                                    pyrotechnicsNumber:"", //火工品数量 ,
                                    pyrotechnicsType:3,  //火工品类型 1.炸药（乳化炸药 硝铵炸药） 2.雷管（火雷管 电雷管） 3.导爆物（导爆管 导爆索） ,
                                    pyrotechnicsUnit:"米", // 火工品单位
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
            toast:toast
        },
        methods:{
            endsub(e){
                if(e==0){
                    
                        this.publics.AJAX.$POST({
                            url:"purchase/buy",
                            data:this.dto,
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
                }else{
                    this.test={
                        show:false,
                        src:""
                    }
                }
            },
            sub(formName){
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let zyNum=0,lgNum=0;
                        for(let val of this.form.blastlist.zy){
                            zyNum +=parseInt(val.pyrotechnicsNumber)
                        }
                        for(let val of this.form.blastlist.lg){
                            lgNum +=parseInt(val.pyrotechnicsNumber)
                        }
                        if(zyNum>this.blastlist[1].zaYao){
                            this.$message({
                                message:"炸药超过购买量",
                                type:"error"
                            })
                            return false;
                        }

                        if(lgNum>this.blastlist[1].leiGuan){
                            this.$message({
                                message:"雷管超过购买量",
                                type:"error"
                            })
                            return false;
                        }
                        //daoBaoSuo
                    
                        if(parseInt(this.form.blastlist.dbg.pyrotechnicsNumber)>this.blastlist[1].daoBaoGuan){
                            this.$message({
                                message:"导爆管超过购买量",
                                type:"error"
                            })
                            return false;
                        }
                        
                        if(parseInt(this.form.blastlist.dbs.pyrotechnicsNumber)>this.blastlist[1].daoBaoSuo){
                            this.$message({
                                message:"导爆索过购买量",
                                type:"error"
                            })
                            return false;
                        }   
                        let cloneblast=JSON.parse(JSON.stringify(this.form.blastlist));
                        for(let val of cloneblast.lg){
                            val.pyrotechnicsModel=val.pyrotechnicsModel.d+"-"+val.pyrotechnicsModel.m
                        }
                        let pyrotechnics=[...cloneblast.zy,...cloneblast.lg];
                        if(parseInt(this.form.blastlist.dbs.pyrotechnicsNumber)>0){
                            pyrotechnics.push(cloneblast.dbg)
                        }
                        if(parseInt(this.form.blastlist.dbg.pyrotechnicsNumber)>0){
                            pyrotechnics.push(cloneblast.dbs)
                        }
                        let dto = {
                            "createMan": this.user.userId,
                            "projectId": this.company.projectId,
                            "pyrotechnics":pyrotechnics
                        }
                        let load=this.$loading({
                            text:'生成预览中,请稍等'
                        })
                        this.test.show=true;
                        setTimeout(e=>{
                            let node=document.getElementById("node");
                            domtoimage.toPng(node)
                            .then(dataUrl=>{
                                load.close();
                                this.test.src=dataUrl;
                                this.dto=dto;
                            })
                        },1000)
                       
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

                }
            },
            addblast(like,index){
                if(like==0){
                    for(let val of this.form.blastlist.zy){
                        if(!val.pyrotechnicsModel){ this.$message({type:"error",message:"请输入炸药型号"});return false;}
                        if(!val.pyrotechnicsNumber){ this.$message({type:"error",message:"请输入炸药数量"});return false;}
                        if(!val.pyrotechnicsName){ this.$message({type:"error",message:"请选择炸药类型"});return false;}
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
                        console.log(val)
                        if(!val.pyrotechnicsModel.d || !val.pyrotechnicsModel.m){ this.$message({type:"error",message:"请输入雷管段别"});return false;}
                        if(!val.pyrotechnicsNumber){ this.$message({type:"error",message:"请输入雷管数量"});return false;}
                        if(!val.pyrotechnicsName){ this.$message({type:"error",message:"请选择雷管类型"});return false;}
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
                        "userId": this.user.userId
                    },
                    success:(e)=>{
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
                this.diaglog.show=false;
            },
            formatState(){

            },
            handleSelect(val){
                this.company=val;
                this.getblast(val.projectId)
            },
            addNewForm(){
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
    }
</style>

