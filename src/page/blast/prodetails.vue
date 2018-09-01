<template>
     <div class="commonContair">
            <div class="tp">
                <el-radio-group v-model="form.administrative" :disabled='show==1'>
                    <el-radio :label="true">行政许可项目</el-radio>
                    <el-radio :label="false">非行政许可项目</el-radio>
                </el-radio-group>
            </div>
            <el-form ref="form" :model="form"  label-width="124px" class="project-form" status-icon :rules="rules" :disabled='show==1'>
                <table  border="1" class="table" width="100%">
                    <tr>
                    <td width="100">项目名称</td>
                    <td width="60" colspan="3">
                        <el-form-item  prop="name" label-width="0" :rules="[{ required: true}]">
                            <el-input v-model="form.name" @keyup.native="form.name=form.name.replace(/[^\u4e00-\u9fa5]/g,'')"></el-input>
                        </el-form-item>
                    </td>
                    <td width="80">项目级别</td>
                    <td width="60">
                        <el-form-item  prop="level" label-width="0" :rules="[{ required: true}]">
                            <el-select v-model="form.level" placeholder="项目级别" @change="closeAll">
                                <el-option label="A级" :value="4"></el-option>
                                <el-option label="B级" :value="3"></el-option>
                                <el-option label="C级" :value="2"></el-option>
                                <el-option label="D级" :value="1"></el-option>
                                <el-option label="一般岩土" :value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </td>
                    <td width="80">审批时间</td>
                    <td width="120">
                            <el-form-item  prop="examineTime" label-width="0" :rules="[{ required: true}]">
                                <el-date-picker v-model="form.examineTime" type="date"  placeholder="选择日期" value-format="timestamp" ></el-date-picker>
                            </el-form-item>
                    </td>
                    </tr>
                    <tr>
                        <td width="100">委托单位</td>
                        <td width="120">
                            <el-form-item  prop="trustorName" label-width="0" :rules="[{ required: true}]" > 
                                <el-input v-model="form.trustorName" @keyup.native="form.trustorName=form.trustorName.replace(/[^\u4e00-\u9fa5]/g,'')"></el-input>
                            </el-form-item>
                        </td>
                        <td width="120">委托单位法人</td>
                        <td width="60">
                            <el-form-item  prop="trustorLegal" label-width="0" :rules="[{ required: true}]">
                                <el-input v-model="form.trustorLegal" @keyup.native="form.trustorLegal=form.trustorLegal.replace(/[^\u4e00-\u9fa5]/g,'')"></el-input>
                            </el-form-item>
                        </td>
                        <td width="80">委托人</td>
                        <td width="120">
                            <el-form-item  prop="trustorStaff" label-width="0" :rules="[{ required: true}]">
                                <el-input v-model="form.trustorStaff" @keyup.native="form.trustorStaff=form.trustorStaff.replace(/[^\u4e00-\u9fa5]/g,'')"></el-input>
                            </el-form-item>
                        </td>
                        <td width="80">委托人手机</td>
                        <td width="200">
                            <el-form-item  prop="trustorPhone" label-width="0">
                                <el-input v-model="form.trustorPhone"></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td width="100">所属辖区</td>
                        <td width="316" colspan="2">
                            <el-form-item label="" label-width="0" prop="policeIds" :rules="[{ required: true, message: ''}]">
                                <el-cascader
                                    :options="options"
                                    v-model="form.policeIds"
                                    class="selectcity">
                                </el-cascader>
                            </el-form-item>
                        </td>
                        <td width="80">作业地点</td>
                        <td width="180" colspan="2" @click="mapshow" class="point"> 
                            <el-form-item  prop="projectAddress" label-width="0"  :rules="[{ required: true}]" >
                                <el-input v-model="form.projectAddress" :disabled="true" ></el-input>
                            </el-form-item>
                        </td>
                        <td width="80">作业时间</td>
                        <td width="280">
                            <el-form-item prop="worktime" label-width="0" :rules="[{ required: true}]" >
                                <el-date-picker  v-model="form.worktime"  type="datetimerange" @change="dataFloat"  start-placeholder="开始日期"  value-format="timestamp" end-placeholder="结束日期"></el-date-picker>
                            </el-form-item>
                            
                        </td>
                    </tr>
                </table>
                <table  border="1" class="table" width="100%">
                    <tr>
                        <td rowspan="50" width="100">设计</br>施工</br>方案</td>
                        <td width="120">
                        
                        </td>
                        <td width="220">姓名</td>
                        <td width="240">作业级别</td>
                        <td width="240">许可证编号</td>
                        <td width="240">公民身份证号</td>
                    </tr>
                    <tr class="point" @click="addStaff(true,1,4,1,'施工方案设计人')" v-for="i in listStaff.Arr.list.sonArr.list">      <!-- 第一个 开启是否多人  第二个 1,施⼯方案人员列表 2,作业人员列列表 3,安全评估单位人员,4 安全监理单位人员  第三个请求类型 第四个 人员类型 -->
                        <td>设计人</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr class="point"  @click="addStaff(false,1,4,2,'施工方案审核人')" v-for="i in listStaff.Arr.list.sonBrr.list">   <!-- 5 项目审核人-->
                        <td>审核人</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr class="point" @click="addStaff(false,1,4,3,'施工方案批准人')" v-for="i in listStaff.Arr.list.sonCrr.list">
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
                    <tr class="point" @click="addStaff(false,2,4,4,'项目负责人')" v-for="i in listStaff.Brr.list.sonArr.list">
                        <td>项目负责人</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr class="point" @click="addStaff(false,2,4,5,'技术负责人')" v-for="i in listStaff.Brr.list.sonBrr.list">
                        <td>技术负责人</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr class="point" @click="addStaff(true,2,4,6,'技术员')" v-for="i in listStaff.Brr.list.sonCrr.list">
                        <td>技术员</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr class="point" @click="addStaff(true,2,1,7,'爆破员')" v-for="i in listStaff.Brr.list.sonDrr.list">
                        <td>爆破员</td>
                    <td>{{i.staffName}}</td>
                        <td>/</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr class="point" @click="addStaff(true,2,2,8,'安全员')" v-for="i in listStaff.Brr.list.sonErr.list">
                        <td>安全员</td>
                        <td>{{i.staffName}}</td>
                        <td>/</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    <tr class="point" @click="addStaff(true,2,3,9,'保管员')" v-for="i in listStaff.Brr.list.sonFrr.list">
                        <td>保管员</td>
                        <td>{{i.staffName}}</td>
                        <td>/</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                </table>
                <table  border="1" class="table" width="100%">
                    <thead>
                        <th colspan="6">安全评估单位及单位参与本项目的爆破作业人</th>
                    </thead>
                    <tr>
                        <td width="180">单位名称</td>
                        <td width="402">
                            <el-form-item prop="projectSecurityAndSupervisor[0].companyName" label-width="0" :rules="[{ required: true}]" > 
                                <el-input v-model="form.projectSecurityAndSupervisor[0].companyName"  @keyup.native="form.projectSecurityAndSupervisor[0].companyName=form.projectSecurityAndSupervisor[0].companyName.replace(/^\d+(\.\d+)?$/,'')" ></el-input>
                            </el-form-item>
                        </td>
                        <td width="180"  colspan="2">单位许可证编号</td>
                        <td width="402">
                            <el-form-item  prop="projectSecurityAndSupervisor[0].licenceNumber"  label-width="0" :rules="[{ required: true}]" > 
                                <el-input v-model="form.projectSecurityAndSupervisor[0].licenceNumber" ></el-input>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td >单位资质</td>
                        <td>
                            <el-form-item  prop="projectSecurityAndSupervisor[0].workingRange" label-width="0"  :rules="[{ required: true}]" > 
                                <el-input v-model="form.projectSecurityAndSupervisor[0].workingRange"></el-input>
                            </el-form-item>
                        
                        </td>
                        <td colspan="2">许可证有效期</td>
                        <td>
                            <el-form-item prop="projectSecurityAndSupervisor[0].licenceExpireTime"  label-width="0" :rules="[{ required: true}]">
                                <el-date-picker v-model="form.projectSecurityAndSupervisor[0].licenceExpireTime " type="date"  value-format="timestamp"  placeholder="选择日期"  ></el-date-picker>
                            </el-form-item>
                        </td>
                    </tr>
                    <tr>
                        <td width="120"></td>
                        <td width="180">姓名</td>
                        <td width="180">作业级别</td>
                        <td width="320">许可证编号</td>
                        <td width="320">公民身份证号</td>
                    </tr>
                    <tr class="point" @click="addStaff(true,3,null,10,'安全评估员')" v-for="i in listStaff.Crr.list.sonArr.list">
                        <td width="120">评估人员</td>
                        <td>{{i.staffName}}</td>
                        <td>/</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                </table>
                <table  border="1" class="table" width="100%">
                    <thead>
                        <th colspan="6">安全监理单位参与本项目的爆破作业人员名单</th>
                    </thead>
                    <tr>
                        <td width="180">单位名称</td>
                        <td width="402">
                        <el-form-item label-width="0" :rules="[{ required: true}]"  class="sml"> 
                                <el-input v-model="form.projectSecurityAndSupervisor[1].companyName"  @keyup.native="form.projectSecurityAndSupervisor[1].companyName=form.projectSecurityAndSupervisor[1].companyName.replace(/^\d+(\.\d+)?$/,'')"></el-input>
                            </el-form-item>
                            <a href="javascript:void(0);" class="find" @click="findCompany(0,form.projectSecurityAndSupervisor[1].companyName,1)" v-if="show==0">搜索</a>
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
                    <tr class="point" @click="addStaff(true,4,null,11,'监理员')" v-for="i in listStaff.Drr.list.sonArr.list">
                        <td width="120">监理人员</td>
                        <td>{{i.staffName}}</td>
                        <td>{{publics.Filters.convert(i.staffLevel).level()}}</td>
                        <td>{{i.licenceNumber}}</td>
                        <td>{{i.staffId}}</td>
                    </tr>
                    </tr>
                </table>
                <!-- <el-tooltip class="item" effect="dark" content="Left Top 提示文字" placement="top"> -->
                    <table  border="1" class="table" width="100%" >
                        <thead>
                            <th colspan="5">安全警戒距离</th>
                        </thead>
                        <tr>
                            <td width="300">方位</td>
                            <td width="300">被保护对象</td>
                            <td width="300">层核定安全距离</td>
                        </tr>
                        <tr class="point" @click="diaglog.type=1;diaglog.show=true;diaglog.title='安全警戒距离'" v-for="i in form.cautionDtoList" v-if="show==0">
                            <td>{{i.position}}</td>
                            <td>{{i.cautionObject}}</td>
                            <td>{{i.safeDistance}}</td>
                        </tr>
                        <tr v-for="i in form.cautionDtoList" v-else>
                            <td>{{i.position}}</td>
                            <td>{{i.cautionObject}}</td>
                            <td>{{i.safeDistance}}</td>
                        </tr>
                    </table>
                <!-- </el-tooltip> -->
                <table  border="1" class="table" width="100%">
                    <thead>
                        <th colspan="9">民爆物品、物品运输及物品存储</th>
                    </thead>
                    <tr>
                        <td>运输公司</td>
                        <td colspan="4" width="402">
                            <el-form-item  prop="companyIdList[0].companyName" label-width="0" :rules="[{ required: true}]"  style="width:80%;float:left;"> 
                                <el-input v-model="form.companyIdList[0].companyName"></el-input>
                            </el-form-item>
                            <a href="javascript:void(0);" class="find"  @click="findCompany(1,form.companyIdList[0].companyName,2)" v-if="show==0">搜索</a>
                        </td>
                        <td>仓储公司</td>
                        <td colspan="4" width="402">
                            <el-form-item  prop="companyIdList[1].companyName" label-width="0" :rules="[{ required: true}]"  style="width:80%;float:left;"> 
                                <el-input v-model="form.companyIdList[1].companyName"></el-input>
                            </el-form-item>
                            <a href="javascript:void(0);" class="find"  @click="findCompany(2,form.companyIdList[1].companyName,3)" v-if="show==0">搜索</a>
                        </td>
                    </tr>
                    <tr>
                        <td width="180">民爆物品</td>
                        <td width="124">炸药</td>
                        <td width="124">
                            <el-form-item  prop="projectPyrotechnicsList[0].pyrotechnicsNumber" label-width="0" :rules="[{ required: true}]"  style="width:100%;"> 
                                <el-input v-model="form.projectPyrotechnicsList[0].pyrotechnicsNumber"  @keyup.native="form.projectPyrotechnicsList[0].pyrotechnicsNumber=form.projectPyrotechnicsList[0].pyrotechnicsNumber.replace(/\D/g,'')"></el-input>
                            </el-form-item> 
                        </td>
                        <td width="124">雷管</td>
                        <td width="124">
                            <el-form-item  prop="projectPyrotechnicsList[0].pyrotechnicsNumber" label-width="0" :rules="[{ required: true}]"  style="width:100%;"> 
                                <el-input v-model="form.projectPyrotechnicsList[1].pyrotechnicsNumber"  @keyup.native="form.projectPyrotechnicsList[1].pyrotechnicsNumber=form.projectPyrotechnicsList[1].pyrotechnicsNumber.replace(/\D/g,'')"></el-input>
                            </el-form-item> 
                        </td>
                        <td width="124">导爆管</td>
                        <td width="124">
                            <el-form-item  prop="projectPyrotechnicsList[0].pyrotechnicsNumber" label-width="0" :rules="[{ required: true}]"  style="width:100%;"> 
                                <el-input v-model="form.projectPyrotechnicsList[2].pyrotechnicsNumber"  @keyup.native="form.projectPyrotechnicsList[2].pyrotechnicsNumber=form.projectPyrotechnicsList[2].pyrotechnicsNumber.replace(/\D/g,'')"></el-input>
                            </el-form-item> 
                        </td>
                        <td width="124">导爆索</td>
                        <td width="124">
                            <el-form-item  prop="projectPyrotechnicsList[0].pyrotechnicsNumber" label-width="0" :rules="[{ required: true}]"  style="width:100%;"> 
                                <el-input v-model="form.projectPyrotechnicsList[3].pyrotechnicsNumber"  @keyup.native="form.projectPyrotechnicsList[3].pyrotechnicsNumber=form.projectPyrotechnicsList[3].pyrotechnicsNumber.replace(/\D/g,'')"></el-input>
                            </el-form-item> 
                        </td>
                    </tr>
                </table>
                <div class="ossbox">
                    <div class="uploadOSS">
                        <el-form-item label="爆破评估报告" prop="assessmenTreportOssKey" :rules="[{ required: true, message: '请上传爆破评估报告'}]" class="files">
                            <File :data="upload[0]" @bindValue="form.assessmenTreportOssKey  = upload[0].url" :look="isedit"></File>
                        </el-form-item>
                    </div>
                    <div class="uploadOSS">
                        <el-form-item label="爆破工程项目 审批表" prop="examineOsskey" :rules="[{ required: true, message: '请上传爆破评估报告'}]" class="files">
                            <File :data="upload[1]" @bindValue="form.examineOsskey = upload[1].url" :look="isedit"></File>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <el-dialog :title="diaglog.title" :visible.sync="diaglog.show"   :before-close="disClose" >
                <el-form ref="stafflist" :model="form"  label-width="100px" class="diaglog" status-icon :rules="rules" v-if="diaglog.type==0">
                    <div class="clearbox"  v-for="(ele, index) in form.projectSecurityAndSupervisor[0].projectStaffList">
                            <div class="input">
                                <el-form-item :label="'人员姓名'"  :prop="'projectSecurityAndSupervisor[0].projectStaffList.' + index + '.staffName'" :rules="{ required: true, message: '人员姓名不能为空', trigger: 'blur'}" class="li">
                                    <el-input v-model="ele.staffName"></el-input>
                                </el-form-item>
                                <el-form-item :label="'作业证号'" :key="ele.key"  :prop="'projectSecurityAndSupervisor[0].projectStaffList.' + index + '.licenceNumber'" :rules="{ required: true, message: '人员作业号不能为空', trigger: 'blur'}" class="li">
                                    <el-input v-model="ele.licenceNumber"></el-input>
                                </el-form-item>
                                <!-- <el-form-item :label="'作业级别'" :key="ele.key"  :prop="'projectSecurityAndSupervisor[0].projectStaffList.' + index + '.staffLevel'" :rules="{ required: true, message: '人员作业号不能为空', trigger: 'blur'}" class="li">
                                    <el-select v-model="ele.staffLevel" placeholder="项目级别">
                                        <el-option label="初级/D" :value="0">初级/D</el-option>
                                        <el-option label="中级/C" :value="1">中级/C</el-option>
                                        <el-option label="高级/B" :value="2">高级/B</el-option>
                                        <el-option label="高级/A" :value="3">高级/A</el-option>
                                    </el-select>
                                </el-form-item> -->
                                <el-form-item  :label="'身份证号码'"  :prop="'projectSecurityAndSupervisor[0].projectStaffList.' + index + '.staffId'" :rules="{ required: true, message: '身份证号不能为空', trigger: 'blur'}" class="li">
                                    <el-input v-model="ele.staffId"></el-input>
                            </el-form-item>
                        </div>
                        <a href="javascript:void(0)" class="smbtn add" @click="Supervisoraddmore(0)" v-if="form.projectSecurityAndSupervisor[0].projectStaffList.length==index+1"><i class="el-icon-circle-plus-outline"></i></a>
                        <a href="javascript:void(0)" class="smbtn del" @click="Supervisordel(index,0)" v-if="index>0"><i class="el-icon-remove-outline"></i></a>
                    </div>
                    <div class="botbtn">
                        <el-button @click="disClose">取消</el-button>
                        <el-button type="primary" @click="add(0)">确定添加</el-button>
                    </div>
                </el-form>
                <el-form ref="cautionDtoList" :model="form"  label-width="100px" class="diaglog" status-icon :rules="rules" v-if="diaglog.type==1">
                    <div class="clearbox"  v-for="(ele, index) in form.cautionDtoList">
                        <div class="input">
                            <el-form-item :label="'方位'"  :prop="'cautionDtoList.'+index + '.position'" :rules="{ required: true, message: '方位不能为空', trigger: 'blur'}" class="li wid">
                                <el-input v-model="ele.position"></el-input>
                            </el-form-item>
                            <el-form-item :label="'被保护对象'" :key="ele.key"  :prop="'cautionDtoList.' + index + '.cautionObject'" :rules="{ required: true, message: '被保护对象不能为空', trigger: 'blur'}" class="li wid">
                                <el-input v-model="ele.cautionObject"></el-input>
                            </el-form-item>
                            <el-form-item  :label="'安全距离'"  :prop="'cautionDtoList.' + index + '.safeDistance'" :rules="{ required: true, message: '安全距离不能为空', trigger: 'blur'}" class="li wid">
                                <el-input v-model="ele.safeDistance"></el-input>
                            </el-form-item>
                        </div>
                        <a href="javascript:void(0)" class="smbtn add" @click="Supervisoraddmore(1)" v-if="form.cautionDtoList.length==index+1"><i class="el-icon-circle-plus-outline"></i></a>
                        <a href="javascript:void(0)" class="smbtn del" v-if="index>0" @click="Supervisordel(index,1)"><i class="el-icon-remove-outline"></i></a>
                    </div>
                    <div class="botbtn">
                        <el-button @click="disClose">取消</el-button>
                        <el-button @click="add(1)">确定添加</el-button>
                    </div>
                </el-form>
                <div class="transfer" v-if="diaglog.type==2">
                    <div class="person">
                        <el-transfer v-model="diaglog.data" :data="ALLstaff" :titles="['公司储蓄人员', '即将派遣人员']" v-if="diaglog.type==2" @change="dischange"></el-transfer>
                    </div>
                    <div class="botbtn">
                        <el-button @click="disClose">取消</el-button>
                        <el-button type="primary" @click="add(2)" >确定添加</el-button>
                    </div>
                </div>
                <div class="map" id="map" v-if="diaglog.type==3">
                    <el-amap-search-box class="search-box"  :on-search-result="onSearchResult"></el-amap-search-box>
                    <el-amap ref="map" vid="amapDemo"  :center="center" :zoom="zoom"  :events="events" class="amap">
                        <el-amap-marker vid="component-marker" :position="componentMarker.position" ></el-amap-marker>
                    </el-amap>
                </div>
            </el-dialog>
            <div class="subbtn">
                <el-button type="primary" @click="submitForm('form')" v-if="show==0">确认提交</el-button>
            </div>
        </div>
</template>
<script>
    import file from "./../../components/upload";
    import Validator from "./../../assets/js/filters";
    import $http from "superagent";
   // import { AMapManager } from 'vue-amap';
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
                            cautionObject:"",   //被保护对象 ,
                            position:"",        //方位 
                            safeDistance:""     //安全距离
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
                    level:null,                    //项⽬级别
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
                            pyrotechnicsUnit:"Kg", // 火工品单位
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
                    latitude:"",
                    longitude:""
                },
                diaglog:{       // 弹出框  
                     show:false, //是否现实
                     type:0,    //评估单位人员 -0  警戒距离 -1  
                     title:"",
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
                zoom: 12,
                center: [121.41975305378435, 30.159790305598523],
                componentMarker:{
                    position:[121.41975305378435, 30.159790305598523],
                },
                events: {
                    init: (o) => {
                        o.getCity(result => {
                            console.log(result)
                        })
                    },
                    'moveend': () => {
                    },
                    'zoomchange': () => {
                    },
                    'click': (e) => {
                        let position=[e.lnglat.O,e.lnglat.P]
                        this.componentMarker.position=position;
                        this.getplace(e.lnglat.O,e.lnglat.P)
                    }
                }   
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
            this.staff()
            //this.handleDetail("5b79258d3d9a88203c9f6751")
        },
        components:{
            File:file
        },
        methods:{
            mapshow(){
                if(this.show==1) return false;
                this.diaglog.show=true;
                this.diaglog.type=3;
            },
            onSearchResult(pois){
                let latSum = 0;
                let lngSum = 0;
                if (pois.length > 0) {
                    pois.forEach(poi => {
                        let {lng, lat} = poi;
                        lngSum += lng;
                        latSum += lat;
                      //  this.markers.push([poi.lng, poi.lat]);
                    });
                    let center = {
                        lng: lngSum / pois.length,
                        lat: latSum / pois.length
                    };
                    this.center = [center.lng, center.lat];
                    this.componentMarker.position=[center.lng, center.lat];
                    this.getplace(center.lng, center.lat)
                }
            },
            getplace(lng,lat){
                 $http.get("http://restapi.amap.com/v3/geocode/regeo?key=b8575409aa59a558b2674aaac213d18c&location="+lng+","+lat+"&poitype&radius=1000&extensions=all&batch=false%20&roadlevel=0")
                    .set('Content-Type', 'application/json') 
                    .end((err, res)=>{
                        let data=res.body;
                        if(data.infocode=="10000"){
                               this.form.projectAddress=res.body.regeocode.formatted_address;
                               this.form.latitude=lng;
                               this.form.longitude=lat;
                        }else{
                            this.$message({
                                type:"error",
                                message:"无法查询到该地址。"
                            })
                        }
                     
                })
            },
            handleDetail(id){         //查看详情
             this.publics.AJAX.$POST({
                 url:"project/"+id,
                 success:(e)=>{
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
                    this.show=1;
                 }
              })
            },  
            closeAll(){ //选择项目级别全部清空
               this.disClose();
               this.listStaff={ //最终提交人员列表
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
                };
            },
            findCompany(type,name,companyType){      //寻找公司
                let data={
                    "name":name,
                    "status":1,
                    "companyType":companyType
                }
               
                this.publics.AJAX.$POST({
                    url:"system/depts/1/1",
                    hastoken:false,
                    common:false,
                    data:data,
                    success:(e)=>{
                        if(e.count==0){
                             if(type==0){
                                this.form.projectSecurityAndSupervisor[1].companyId="";
                                this.form.projectSecurityAndSupervisor[1].companyName=""
                            }else if(type==1){
                                this.form.companyIdList[0].companyId="";
                                this.form.companyIdList[0].companyName="";
                            }else{
                                this.form.companyIdList[1].companyId="";
                                this.form.companyIdList[1].companyName="";
                            }
                            this.$message({
                                type:"error",
                                message:"无法查到该公司!"
                            })
                            return false;
                        }else{
                          //  this.form.projectSecurityAndSupervisor[1].companyId="";
                            let getcomP=e.list[0];
                            if(type==0){
                                let superlist= this.form.projectSecurityAndSupervisor[1];
                                superlist.companyId=getcomP.id;
                                superlist.companyName=getcomP.name;
                                superlist.licenceExpireTime=getcomP.licenceExpireTime;
                                superlist.licenceNumber=getcomP.licenceNumber;
                                superlist.workingRange=getcomP.workingRange;
                              
                            }
                            else if(type==1){
                                // this.form.companyIdList[0].companyId="";
            
                                let superlist= this.form.companyIdList[0];
                                superlist.companyId=getcomP.id;    
                            }else{
                             //   this.form.companyIdList[1].companyId="";
                                let superlist= this.form.companyIdList[1];
                                superlist.companyId=getcomP.id;  
                            }
                        }
                    },
                })
            },
            dischange(keyArr,direction){                //穿梭框 穿梭
               if(!this.diaglog.protype.bool){return false;}
                for(let val of this.ALLstaff){
                    if(this.diaglog.data.length==0){           // 假设右边清空 左侧重新赋值
                        val.disabled=this.form.level > JSON.parse(val.key).staffLevel+1 && (this.diaglog.protype.type<=4 || this.diaglog.protype.type==11);
                    }else{
                        for(let value in this.listStaff){
                            if(this.diaglog.protype.type==2 || this.diaglog.protype.type==3){ return false }
                            val.disabled=false
                            const target = keyArr.filter(current => {
                                return current !== null && current !== undefined;
                            })
                            let m=target.find((value,index)=>{       // 假设右边必备成员全部消失  左侧重新制定规则 并且data重洗  
                                return (this.form.level <= JSON.parse(value).staffLevel+1) 
                            })
                            if(!m && direction=='left' && (this.diaglog.protype.type<2 || this.diaglog.protype.type>3)){
                                this.diaglog.data=[];
                                val.disabled=this.form.level > JSON.parse(val.key).staffLevel+1 && (this.diaglog.protype.type<=4 || this.diaglog.protype.type==11);
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
            Supervisordel(index,type){           //删除人员功能
                if(type==0){
                    this.$alert('确定删除该人员？', '删除人员', {
                        confirmButtonText: '确定',
                        callback: action => {
                            this.form.projectSecurityAndSupervisor[0].projectStaffList.splice(index,1)
                        }
                    });
                }else{
                    this.$alert('确定删除该警戒？', '删除人员', {
                    confirmButtonText: '确定',
                        callback: action => {
                            this.form.cautionDtoList.splice(index,1)
                        }
                    });
                }
            },
            Supervisoraddmore(type){            //新增评估单位人员 和 警戒距离  0 评估 单位  1 警戒
                if(type==0){
                    let superlist=this.form.projectSecurityAndSupervisor[0].projectStaffList
                    let Arr={
                      //  id: "",
                        licenceNumber: "",
                        projectStaffType: 3,
                        staffId: "",
                        staffLevel: null,
                        staffName: "",
                        staffType: 10
                    };
                    
                    for(let val of superlist){
                        if(!val.licenceNumber ||  !val.staffName || !val.staffId){
                            this.$message({
                                type:"error",
                                message:"请完善人员信息!"
                            })
                            return false;
                        }
                    }
                   superlist.push(Arr);
               }else{
                   let cautionDtoList=this.form.cautionDtoList;
                   let Arr={
                        cautionObject:"",// 被保护对象 ,
                        position:"",    // 方位 
                        safeDistance:"" //安全距离
                   }
                   for(let val of cautionDtoList){
                        if(!val.cautionObject || !val.position || !val.safeDistance){
                            this.$message({
                                type:"error",
                                message:"请完善警戒信息!"
                            })
                            return false;
                        }
                   }
                   cautionDtoList.push(Arr)
               }
            },
            add(type){      // diaglog穿梭框 确认提交
                let diaglog=this.diaglog;  //用来判断添加 到 哪个数组的东西
                let data=diaglog.data, //暂存数据
                    Allstafflist=this.listStaff ;// 可供选择人员列表
                if(type==0){           //评估单位添加  奇葩
                    for(let val of this.form.projectSecurityAndSupervisor[0].projectStaffList){
                        if(!val.licenceNumber || !val.staffName || !val.staffId){
                            this.$message({
                                type:"error",
                                message:"请完善人员信息!"
                            })
                            return false;
                        }
                    }
                    Allstafflist.Crr.list.sonArr.list=this.form.projectSecurityAndSupervisor[0].projectStaffList;
                }
                else if(type==1){       //安全警戒距离 添加 
                    for(let val of this.form.cautionDtoList){
                         if(!val.cautionObject || !val.position || !val.safeDistance){
                            this.$message({
                                type:"error",
                                message:"请完善警戒信息!"
                            })
                            return false;
                        }
                    }
                }
                else{                   //工作人员  最麻烦的一个玩样
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
                }
                this.disClose();
            },
            addStaff(bool,protype,posttype,staffType,tit){     //   <!-- 第一个 开启是否多人  1,施⼯方案人员列表 2,作业人员列列表 3,项目负责人4,项目设计人,5,项目审核人,6项目批准人  -->
              //let title=['施工方案人员','作业人员列列表','项目负责人','项目设计人','项目审核人','项目批准人']
              //this.diaglog.title=title[type-1];
               if(this.show==1) return false;
               if(this.form.level==null){
                   this.$message({
                       type:"error",
                       message:"请选择项目级别"
                   })
                   return false;
               }else{
                    let  Allstafflist=this.listStaff;
                    this.diaglog.data=[];
                    this.diaglog.type=2;
                    this.diaglog.protype={
                        projectStaffType:protype,
                        type:staffType,
                        bool:bool,
                    };
                    this.diaglog.title=tit;
                    if(posttype){
                        let staff=[];
                       // console.log(JSON.parse(JSON.stringify(this.staff)))
                        let clonelist=JSON.parse(JSON.stringify(this.staff)),e;
                        if(posttype==1){e=clonelist.p1}     //爆破员
                        else if(posttype==2){e=clonelist.p2}    //安全员
                        else if(posttype==3){e=clonelist.p3}    //保管员
                        else  {e=clonelist.p4;} //技术员
                     //   this.staff(posttype,e=>{
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
                            if(staffType==1 || staffType==2 || staffType==3){
                                let adminlist=[...this.listStaff.Arr.list.sonArr.list,...this.listStaff.Arr.list.sonBrr.list,...this.listStaff.Arr.list.sonCrr.list]
                                for(let [ins,value] of adminlist.entries()){
                                    for(let [index,val] of e.entries()){
                                        if(val.id==value.id){
                                            val.iselect=true;
                                          //  e.splice(index,1)
                                        }
                                    }
                                }
                            }
                            
                            for(let [index,val] of e.entries()){
                              
                            // val.disabled=true && this.form.level > val.staffLevel+1 ;
                                let editbool;
                                if((this.diaglog.data.length>0 && bool) && !val.iselect){       
                                    editbool=false;
                                }else{
                                    if((staffType<2 || staffType>3) && (this.form.level > val.staffLevel+1)  || val.iselect){
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
                                console.log(staff)
                                this.ALLstaff=staff;
                            }
                            
                            this.diaglog.show=true;                       
                   //     })
                    }else{
                        if(staffType==10){
                            this.diaglog.type=0;
                             this.diaglog.show=true;
                        }
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
                   
                }
            },
            staffAjax(type,callback){
                 this.publics.AJAX.$POST({
                    url:"dept/user/"+this.user.userId+"/staffList/"+type,
                    type:"get",
                    success:(e)=>{
                       callback(e)
                    }
                })
            },
            staff(){    
                let p1 = new Promise((resolve, reject) => {           //爆破员
                    this.staffAjax(1,e=>{   
                        resolve(e)
                    })
                })
                let p2 = new Promise((resolve, reject) => {          //安全员
                    this.staffAjax(2,e=>{
                        resolve(e)
                    })
                })
                let p3 = new Promise((resolve, reject) => {          //保管员 
                    this.staffAjax(3,e=>{
                        resolve(e)
                    })
                })
                let p4 = new Promise((resolve, reject) => {         //技术员
                    this.staffAjax(4,e=>{
                        resolve(e)
                    })
                })
                Promise.all([p1,p2,p3,p4]).then(res=>{
                    for(let i=0;i<res.length;i++){
                        for(let val of res[i]){val.iselect=false}   
                    }
                    console.log(res)
                    this.staff={
                        p1:res[0],
                        p2:res[1],
                        p3:res[2],
                        p4:res[3]
                    };
                })
            },
            dataFloat(e){           //作业时间选择
                this.form.beginTime=e[0];
                this.form.endTime=e[1];
            },
            submitForm(formName){
             
               this.$refs[formName].validate((valid) => {
                    if (valid) {
                        let form=JSON.parse(JSON.stringify(this.form)),listStaff=JSON.parse(JSON.stringify(this.listStaff));
                        delete form.worktime;
                        let policeIdslist=[];
                        for(let [index,val] of form.policeIds.entries()){
                                policeIdslist.push({
                                    policeId:val,
                                    type:Math.abs(index-4)
                                })
                            }
                        //     "施工方案.审核人","施工方案.批准人","项目负责人","技术负责人","爆破工程技术人员","爆破员","安全员","保管员","评估人员","监理人员"
                        form.policeIds=policeIdslist;
                        let newlist=[];
                        if(!form.administrative){
                                if(!form.projectSecurityAndSupervisor[1].companyId){
                                    form.projectSecurityAndSupervisor.splice(1,1)
                                    delete listStaff.Drr
                                }
                        }
                        delete form.projectSecurityAndSupervisor[0].projectStaffList
                        for(let val in listStaff){
                            for(let value in listStaff[val].list){
                                newlist=newlist.concat(listStaff[val].list[value].list)
                            }
                        }

                        for(let val of newlist){
                            if(!val.staffName){
                                    this.$message({
                                        type:"error",
                                        message:"请仔细核对工作人员"
                                    })
                                    return false;
                            }
                        }
                        form.listStaff=newlist;
                        this.$confirm('提交项目, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(() => {
                            // console.log(form);
                            // return false;
                            this.publics.AJAX.$POST({
                                url:"project/user/"+this.user.userId,
                                data:form,
                                success:(e)=>{
                                    this.$message({
                                        type:"success",
                                        message:"登记成功！"
                                    })
                                   setTimeout(e=>{
                                        this.$router.push({name:'project'})
                                   },2000)
                                    
                                }
                            })
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
        
    }
</script>
<style lang="scss">
     .commonContair{
         .search-box{
             position: absolute;
             top:20px;
             left:20px;
         }
        .map{
            height:100%;
            position: relative;
        }
        .tp{
            padding:20px 0 40px 30px;
        }
        padding:0 35px;
        background: #fff;
        .ossbox{
            overflow:hidden;
            width:100%;
            margin:60px 0;
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
                .input{
                    width: 90%;
                    display: flex;
                    margin-right:20px;
                }
                .li{
                    flex: 3;
                    .el-input__inner{
                        border-radius:0;
                        line-height: 30px;
                        height:30px;
                    }
                }
                .smbtn{
                        width:30px;
                        height:30px;
                        display: block;
                        margin:4px 0 0 4px;
                        font-size: 24px;
                        text-align: center;
                        line-height: 30px;
                        transition-duration: 500ms;
                }

                .del:hover{
                    color:#f00;
                }
                .add:hover{
                    color:#03A9F4;
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
                text-align: center;
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
        }
        .el-range-editor.is-disabled{
            background: none!important;
        }
        .is-disabled .el-input__suffix{
            display: none;
        }
        .el-date-editor{
            width:100%;
        }
        .is-disabled input,.is-disabled .el-cascader__label{
            background: none!important;
            color:#333!important;
        }
    }
</style>
