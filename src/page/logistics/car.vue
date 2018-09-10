<template>
    <div class = 'car'>
        <div class = 'topBar'>
            <el-select v-model="carSearchDTO.status" placeholder="选择状态" @change='init'>
                <el-option
                v-for="item in status"
                :key="item.value"
                :label="item.text"
                :value="item.value">
                </el-option>
            </el-select>
            <div class = 'right'>
                <div   @click="addNew = true"  class = 'addBtn'>新增车辆</div>
                <div class = 'serBox'>
                    <input :class = "showSearch ? 'serActive':'search'" type="text" v-model="carSearchDTO.carNumber"  :placeholder="showSearch ?  '请输入车辆牌照' : '搜索'" @focus="searchAct" @blur="leave">
                </div>
            </div>
        </div>
        <div class = 'table'>
            <el-table
                :data="dataList"
                :row-class-name="tableRowClassName"
                style="width: 100%">
                <el-table-column
                    prop="carNumber"
                    label="车辆牌照"
                    width="160px">
                </el-table-column>
                <el-table-column
                    prop="carBrand"
                    label="品牌"
                    width="200px">
                </el-table-column>
                <el-table-column
                    prop="engineNumber"
                    label="发动机号"
                    width="240px">
                </el-table-column>
                <el-table-column
                    prop="frameNumber"
                    label="车架号"
                    width="300px">
                </el-table-column>
                <el-table-column
                    prop="timer"
                    label="证件到期时间"
                    width="300px">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态"
                    :formatter='formatState'
                    width="200px">
                    </el-table-column>
                <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark" content="查看详情" placement="top">
                        <i class = 'icon detail'  @click = "handleDetail(scope.row.id)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if = 'scope.row.status != 1'>
                        <i class = 'icon delete' @click = "handleDelete(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="恢复" placement="top" v-if = 'scope.row.status == 1'>
                        <i class = 'icon reback' @click = "handleBack(scope.row)"></i>
                    </el-tooltip>
                </template>
                </el-table-column>
            </el-table>
            <div style="text-align:center">
                <el-pagination
                    v-if = 'total > carSearchDTO.size'
                    :page-size="carSearchDTO.size" @current-change = 'pageChange'
                    layout="prev, pager, next"
                    :current-page="carSearchDTO.page"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <el-dialog :title="title" :visible.sync="addNew" :before-close = 'close' :close-on-click-modal = "canClose" :close-on-press-escape = 'canClose'>
            <el-form :model="newForm" ref = "newForm" :rules="rules"  :disabled = 'isDetail' :status-icon = 'icon' v-if = 'addNew'>
                <div class = 'table'>
                    <p class = 'sub_title'>基本信息</p>
                    <div style = 'border:1px solid #666'>
                    <el-row>
                        <el-col :span = '3'>车牌号</el-col>
                        <el-col :span = '3'>
                            <el-form-item prop='carNumber'>
                                <el-input v-model="newForm.carNumber" @keyup.native="newForm.carNumber=newForm.carNumber.replace(/[^0-9A-Za-z\u4e00-\u9fa5]/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>车辆品牌</el-col>
                        <el-col :span = '3'>
                            <el-form-item prop='carBrand'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.carBrand" @keyup.native="newForm.carBrand=newForm.carBrand.replace(/[^A-Za-z\u4e00-\u9fa5]/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>车牌颜色</el-col>
                        <el-col :span = '3'>
                            <el-form-item prop='carNumberColor'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.carNumberColor" @keyup.native="newForm.carNumberColor=newForm.carNumberColor.replace(/[^\u4e00-\u9fa5]/g,'')"></el-input>
                            </el-form-item>
                        </el-col :span = '3'>
                        <el-col :span = '3'>车辆颜色</el-col>
                        <el-col :span = '3'>
                            <el-form-item prop='carColor'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.carColor" @keyup.native="newForm.carColor=newForm.carColor.replace(/[^\u4e00-\u9fa5]/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span = '3'>车辆类型</el-col>
                        <el-col :span = '6'>
                            <el-form-item prop="carType" :rules="[{ required: true}]">
                                <el-select v-model="newForm.carType" placeholder="请选择" >
                                <el-option-group v-for="group in carType" :key="group.label" :label="group.label">
                                    <el-option v-for="item in group.option" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-option-group>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>车架号</el-col>
                        <el-col :span = '6'>
                            <el-form-item prop='frameNumber' >
                                <el-input v-model="newForm.frameNumber" @keyup.native="newForm.frameNumber = newForm.frameNumber.replace(/[^A-Z0-9]/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>发动机号码</el-col>
                        <el-col :span = '3'>
                            <el-form-item prop='engineNumber'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.engineNumber"  @keyup.native="newForm.engineNumber = newForm.engineNumber.replace(/\D/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span = '3'>车辆尺寸(毫米)</el-col>
                        <el-col :span = '9'>
                            <el-row>
                                <el-col :span = '8'>
                                    <el-form-item prop="carLen" :rules="[{ required: true }]">
                                        <el-input v-model="newForm.carLen" placeholder="长" @keyup.native="newForm.carLen = newForm.carLen.replace(/[^0-9.]/g,'')"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span = '8'>
                                    <el-form-item prop="carWide" :rules="[{ required: true }]">
                                        <el-input v-model="newForm.carWide" placeholder="宽" @keyup.native="newForm.carWide = newForm.carWide.replace(/[^0-9.]/g,'')"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span = '8'>
                                    <el-form-item prop="carHight" :rules="[{ required: true }]">
                                        <el-input v-model="newForm.carHight" placeholder="高" @keyup.native="newForm.carHight = newForm.carHight.replace(/[^0-9.]/g,'')"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            
                        </el-col>
                        <el-col :span = '3'>核定载重(kg)</el-col>
                        <el-col :span = '3'>
                            <el-form-item prop='carAllowWeight'  :rules="[{ required: true}]" >
                                <el-input v-model="newForm.carAllowWeight" @keyup.native="newForm.carAllowWeight = newForm.carAllowWeight.replace(/[^0-9.]/g,'')" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>装备质量(kg)</el-col>
                        <el-col :span = '3'>
                            <el-form-item prop='carWeight'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.carWeight" @keyup.native="newForm.carWeight = newForm.carWeight.replace(/[^0-9.]/g,'')" ></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span = '6'>准备引总质量或挂车总质量(kg)</el-col>
                        <el-col :span = '3'>
                            <el-form-item prop='totalWeight'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.totalWeight" @keyup.native="newForm.totalWeight = newForm.totalWeight.replace(/[^0-9.]/g,'')" ></el-input>
                            </el-form-item>                           
                        </el-col>
                        <el-col :span = '6'>卫星定位运营商</el-col>
                        <el-col :span = '9'>
                            <el-form-item prop='satellite'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.satellite" @keyup.native="newForm.satellite=newForm.satellite.replace(/[^\u4e00-\u9fa5]/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span = '3'>持有类型</el-col>
                        <el-col :span = '6'>
                            <el-form-item  prop="ownType" :rules="[{ required: true}]">
                                <el-select v-model="newForm.ownType" placeholder="请选择" >
                                    <el-option label="自有" value="自有"></el-option>
                                    <el-option label="承包" value="承包"></el-option>
                                    <el-option label="社会" value="社会"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>经营范围</el-col>
                        <el-col :span = '12'>
                            <el-form-item prop='scope'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.scope" @keyup.native="newForm.scope=newForm.scope.replace(/[^\u4e00-\u9fa5]/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </div>
                </div>
                <div class = 'table'>
                    <p class = 'sub_title'>资质、证书信息</p>
                    <div style = 'border:1px solid #666'>
                    <el-row>
                        <el-col :span = '3' style = 'background:#ddd'>行驶证</el-col>
                        <el-col :span = '3'>行驶证编号</el-col>
                        <el-col :span = '4'>
                            <el-form-item prop='licenseNumber'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.licenseNumber" @keyup.native="newForm.licenseNumber = newForm.licenseNumber.replace(/[^0-9A-Za-z]/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>年审有效期</el-col>
                        <el-col :span = '4'>
                            <el-form-item prop='carTimeValidity[5].time'  :rules="[{ required: true }]">
                                <el-date-picker type="date" v-model="newForm.carTimeValidity[5].time" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>证件有效期</el-col>
                        <el-col :span = '4'>
                            <el-form-item prop='carTimeValidity[6].time'  :rules="[{ required: true }]">
                                <el-date-picker type="date" v-model="newForm.carTimeValidity[6].time" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span = '3' style = 'background:#ddd'>道路运输证</el-col>
                        <el-col :span = '3'>道路运输证编号</el-col>
                        <el-col :span = '4'>
                            <el-form-item prop='roadNumber'  :rules="[{ required: true }]">
                                <el-input v-model="newForm.roadNumber" @keyup.native="newForm.roadNumber = newForm.roadNumber.replace(/\D/g,'')"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>年审有效期</el-col>
                        <el-col :span = '4'>
                            <el-form-item prop='carTimeValidity[0].time'  :rules="[{ required: true }]">
                                <el-date-picker type="date" v-model="newForm.carTimeValidity[0].time" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '3'>证件有效期</el-col>
                        <el-col :span = '4'>
                            <el-form-item prop='carTimeValidity[1].time'  :rules="[{ required: true }]">
                                <el-date-picker type="date" v-model="newForm.carTimeValidity[1].time" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span = '3' style = 'background:#ddd'>其他</el-col>
                        <el-col :span = '5'>技术等级评定有效期</el-col>
                        <el-col :span = '5'>
                            <el-form-item prop='carTimeValidity[7].time'  :rules="[{ required: true }]">
                                <el-date-picker type="date" v-model="newForm.carTimeValidity[7].time" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '5'>二级维护有效期</el-col>
                        <el-col :span = '6'>
                            <el-form-item prop='carTimeValidity[8].time'  :rules="[{ required: true }]">
                                <el-date-picker type="date" v-model="newForm.carTimeValidity[8].time" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span = '1' style = 'background:#ddd'>保险</el-col>
                        <el-col :span = '3'>交强险有效期</el-col>
                        <el-col :span = '4'>
                            <el-form-item prop='carTimeValidity[2].time'  :rules="[{ required: true }]">
                                <el-date-picker type="date" v-model="newForm.carTimeValidity[2].time" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '4'>第三者责任有效期</el-col>
                        <el-col :span = '4'>
                            <el-form-item prop='carTimeValidity[3].time'  :rules="[{ required: true }]">
                                <el-date-picker type="date" v-model="newForm.carTimeValidity[3].time" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '4'>承运人责任险有效期</el-col>
                        <el-col :span = '4'>
                            <el-form-item prop='carTimeValidity[4].time'  :rules="[{ required: true }]">
                                <el-date-picker type="date" v-model="newForm.carTimeValidity[4].time" style="width: 100%;"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    </div>
                </div>
                <div class = 'img'>
                    <el-row :gutter="40">
                        <el-col :span = '6'>
                            <el-form-item label="道路运输证" prop="carPhoto[0].photoCode" :rules="[{ required: true, message: '请上传照片'}]">
                                <File :data="upload[0]" @bindValue="newForm.carPhoto[0].photoCode = upload[0].url" :look = 'isDetail'></File>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '6'>
                            <el-form-item label="代理证（正面）" prop="carPhoto[1].photoCode" :rules="[{ required: true, message: '请上传照片'}]">
                                <File :data="upload[1]" @bindValue="newForm.carPhoto[1].photoCode = upload[1].url" :look = 'isDetail'></File>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '6'>
                            <el-form-item label="代理证（反面）" prop="carPhoto[2].photoCode" :rules="[{ required: true, message: '请上传照片'}]">
                                <File :data="upload[2]" @bindValue="newForm.carPhoto[2].photoCode = upload[2].url" :look = 'isDetail'></File>
                            </el-form-item>
                        </el-col>
                        <el-col :span = '6'>
                            <el-form-item label="登记评定卡" prop="carPhoto[3].photoCode" :rules="[{ required: true, message: '请上传照片'}]">
                                <File :data="upload[3]" @bindValue="newForm.carPhoto[3].photoCode = upload[3].url" :look = 'isDetail'></File>
                            </el-form-item>
                        </el-col>
                </el-row>
                <el-row :gutter="40">
                    <el-col :span = '6'>
                        <el-form-item label="行驶证（正面）" prop="carPhoto[4].photoCode" :rules="[{ required: true, message: '请上传照片'}]">
                            <File :data="upload[4]" @bindValue="newForm.carPhoto[4].photoCode = upload[4].url" :look = 'isDetail'></File>
                        </el-form-item>
                    </el-col>
                    <el-col :span = '6'>
                        <el-form-item label="行驶证（反面）" prop="carPhoto[5].photoCode" :rules="[{ required: true, message: '请上传照片'}]">
                            <File :data="upload[5]" @bindValue="newForm.carPhoto[5].photoCode = upload[5].url" :look = 'isDetail'></File>
                        </el-form-item>
                    </el-col>
                    <el-col :span = '6'>
                        <el-form-item label="行驶证副本（正面）" prop="carPhoto[6].photoCode" :rules="[{ required: true, message: '请上传照片'}]">
                            <File :data="upload[6]" @bindValue="newForm.carPhoto[6].photoCode = upload[6].url" :look = 'isDetail'></File>
                        </el-form-item>
                    </el-col>
                    <el-col :span = '6'>
                        <el-form-item label="行驶证副本（反面）" prop="carPhoto[7].photoCode" :rules="[{ required: true, message: '请上传照片'}]">
                            <File :data="upload[7]" @bindValue="newForm.carPhoto[7].photoCode = upload[7].url" :look = 'isDetail'></File>
                        </el-form-item>
                    </el-col>
                </el-row>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleEdit(false)" v-if = 'isDetail'>编 辑</el-button>
                <el-button type="primary" @click="handleEdit(true)" v-if = 'isDetail'>修 正</el-button>
                <el-button type="primary" @click="save('newForm')" v-if = '!isDetail'>保 存</el-button>
                <el-button @click = "close">取 消</el-button>
            </div>
        </el-dialog>

    </div>
</template>
<script>
    import file from "../../components/upload";
    import Validator from "../../assets/js/filters";
    export default {
        components:{
            File:file
        },
        data (){
            return {
                auth:this.publics.global().auth,
                type:this.publics.global().auth.type,
                total:0,
                dataList:[],
                showSearch:false,//是否激活搜索
                personType:[],//车辆类型下拉
                carSearchDTO:{
                    staus:'',
                    carNumber:'',//搜索框 车牌
                    page:1,//车辆类型
                    size:10,//状态
                    userId:this.publics.global().auth.userId,
                },
                icon:true,//是否显示图标
                copyForm:{},//copyform
                status:[
                    {value:'',text:'全部'},
                    {value:0,text:'运营中'},
                    {value:1,text:'已删除'},
                    // {value:2,text:'信息不完整'},
                ],
                dataList:[],
                flag:true,
                mult:false,
                addNew:false,//新增车辆
                newForm:{},
                isEdit:false,//编辑状态
                isDetail:false,//详情状态
                isCorrect:false,//是否修正
                upload:[
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                ],
                canClose:false,
                rules:{
                    carNumber:[{ required: true, validator:Validator.carNumber,trigger: "blur"}],
                    frameNumber:[{ required: true, validator:Validator.frameNumber,trigger: "blur"}],
                },
                names:['','道路运输年审','道路运输证件','交强险','第三者责任','承运人责任险','行驶证年审','行驶证证件','技术等级评定','二级维护'],
                carType: [
                    {
                    label: "牵引车",
                    option: [
                        { value: "重型半挂牵引车", label: "重型半挂牵引车" },
                        { value: "中型半挂牵引车", label: "中型半挂牵引车" },
                        { value: "轻型半挂牵引车", label: "轻型半挂牵引车" },
                        { value: "重型罐式货车", label: "重型罐式货车" },
                        { value: "中型罐式货车", label: "中型罐式货车" },
                        { value: "仓栅式货车", label: "仓栅式货车" },
                        { value: "普通货车", label: "普通货车" },
                        { value: "厢式货车", label: "厢式货车" },
                        { value: "中型厢式货车", label: "中型厢式货车" },
                        { value: "栏板车", label: "栏板车" }
                    ]
                    },
                    {
                    label: "半挂车",
                    option: [
                        { value: "重型普通半挂车", label: "重型普通半挂车" },
                        { value: "重型厢式半挂车", label: "重型厢式半挂车" },
                        { value: "重型罐式半挂车", label: "重型罐式半挂车" },
                        { value: "重型平板半挂车", label: "重型平板半挂车" },
                        { value: "重型集装箱半挂车", label: "重型集装箱半挂车" },
                        { value: "重型自卸半挂车", label: "重型自卸半挂车" },
                        { value: "重型特殊结构半挂车", label: "重型特殊结构半挂车" },
                        { value: "中型普通半挂车", label: "中型普通半挂车" },
                        { value: "中型厢式半挂车", label: "中型厢式半挂车" },
                        { value: "中型罐式半挂车", label: "中型罐式半挂车" },
                        { value: "中型平板半挂车", label: "中型平板半挂车" },
                        { value: "中型集装箱半挂车", label: "中型集装箱半挂车" },
                        { value: "中型自卸半挂车", label: "中型自卸半挂车" },
                        { value: "中型特殊结构半挂车", label: "中型特殊结构半挂车" },
                        { value: "轻型普通半挂车", label: "轻型普通半挂车" },
                        { value: "轻型厢式半挂车", label: "轻型厢式半挂车" },
                        { value: "轻型罐式半挂车", label: "轻型罐式半挂车" },
                        { value: "轻型集装箱半挂车", label: "轻型集装箱半挂车" },
                        { value: "轻型平板半挂车", label: "轻型平板半挂车" },
                        { value: "轻型自卸半挂车", label: "轻型自卸半挂车" }
                    ]
                    },
                    {
                    label: "全挂车",
                    option: [
                        { value: "重型普通全挂车", label: "重型普通全挂车" },
                        { value: "重型厢式全挂车", label: "重型厢式全挂车" },
                        { value: "重型罐式全挂车", label: "重型罐式全挂车" },
                        { value: "重型平板全挂车", label: "重型平板全挂车" },
                        { value: "重型集装箱全挂车", label: "重型集装箱全挂车" },
                        { value: "重型自卸全挂车", label: "重型自卸全挂车" },
                        { value: "重型特殊结构全挂车", label: "重型特殊结构全挂车" },
                        { value: "中型普通全挂车", label: "中型普通全挂车" },
                        { value: "中型厢式全挂车", label: "中型厢式全挂车" },
                        { value: "中型罐式全挂车", label: "中型罐式全挂车" },
                        { value: "中型平板全挂车", label: "中型平板全挂车" },
                        { value: "中型集装箱全挂车", label: "中型集装箱全挂车" },
                        { value: "中型自卸全挂车", label: "中型自卸全挂车" },
                        { value: "中型特殊结构全挂车", label: "中型特殊结构全挂车" },
                        { value: "轻型普通全挂车", label: "轻型普通全挂车" },
                        { value: "轻型厢式全挂车", label: "轻型厢式全挂车" },
                        { value: "轻型罐式全挂车", label: "轻型罐式全挂车" },
                        { value: "轻型平板全挂车", label: "轻型平板全挂车" },
                        { value: "轻型自卸全挂车", label: "轻型自卸全挂车" }
                    ]
                    },
                    {
                    label: "其他",
                    option: [
                        {
                        value: "其他",
                        label: "其他"
                        }
                    ]
                    }
                ],

            }
        },
        computed:{
            title:function(){
                    if(this.isDetail){
                        return '查看详情'
                    }else if(this.isEdit){
                        return '修改车辆信息'
                    }else{
                        return '新增车辆'
                    }
                },
            
        },
        created(){
            // let type = this.auth.type
            // type 2 运输公司
            this.initNewForm();
            this.init();
            
        },
        mounted(){
        },
        methods:{
            initNewForm(){//表单初始
                if(this.$refs['newForm']!==undefined){
                    this.$refs['newForm'].clearValidate();
                }
                this.newForm = {
                    licenseNumber:'',
                    carNumberColor:'',
                    carColor:'',
                    frameNumber:'',
                    engineNumber:'',
                    carLen:'',
                    carWide:'',
                    carHight:'',
                    carAllowWeight:'',
                    carWeight:'',
                    totalWeight:'',
                    roadNumber:'',
                    carTimeValidity:[
                        {time: "",type: 1},
                        {time: "",type: 2},
                        {time: "",type: 3},
                        {time: "",type: 4},
                        {time: "",type: 5},
                        {time: "",type: 6},
                        {time: "",type: 7},
                        {time: "",type: 8},
                        {time: "",type: 9},
                    ],
                    carPhoto:[
                        {photoCode:'',type:1},
                        {photoCode:'',type:2},
                        {photoCode:'',type:3},
                        {photoCode:'',type:4},
                        {photoCode:'',type:5},
                        {photoCode:'',type:6},
                        {photoCode:'',type:7},
                        {photoCode:'',type:8},
                    ]
                };
                this.upload = [
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                    {type:0,dataurl:'',url:''},
                ]
            },
            init(){
                this.publics.AJAX.$POST({
                    url:"car/list/",
                    data:this.carSearchDTO,
                    success:(res)=>{
                        this.total = res.count;
                        if(res.list && res.list.length == 0){
                            this.dataList = res.list
                            return false
                        }
                        res.list = res.list.map((v,i)=>{

                               let now = new Date().getTime();
                               let day = (v.carTime - now) / 1000 / 3600 / 24;
                               if(day <= 30 && day > 0){//少于三十天
                                   v.timer = v.carTime + '剩余' + Math.ceil(day) + '天'  
                               }else if(day > 30){
                                   v.timer = this.publics.Filters.timer(v.carTime)
                               }else{
                                   v.timer = this.names[v.type] + '已过期'
                               }
                            return v
                        })
                        this.dataList = res.list
                    }
                }) 
            },
            searchAct(){
                this.showSearch = true;
            },
            leave(){//搜索blur
                if(this.carSearchDTO.carNumber == ''){
                    this.showSearch = false;
                }
                this.init();
            },
            formatState(row){//列表状态过滤器
                if(row.status == 0){
                    return '运营中'
                }else if(row.status == 1){
                    return '已删除'
                }else{
                    return '信息不完整'
                }
            },
            formatType(row){//列表状态过滤器
                    let data = this.personType.filter(v=>{
                        return v.value == row.type
                    })[0].text
                    return data
            },
            tableRowClassName(row) {
                if (row.row.status == 1) {
                return 'warning-row';
                } else if (row.row.status == 0) {
                return 'success-row';
                }
                return '';
            },
            save(formName){//新增 保存
            this.$refs[formName].validate((valid) => {
                if (valid) {
                        let data = this.newForm;
                        data.carTimeValidity = data.carTimeValidity.map(v=>{
                            v.time = new Date(v.time).getTime()
                            return v
                        })
                        if(!this.flag){
                            return false
                        }
                        this.flag = false;
                    this.$confirm('确认车辆信息无误？', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.flag = true;
                                if(this.isEdit){//编辑状态
                                    let copy = JSON.parse(JSON.stringify(this.copyForm));
                                    console.log(copy)
                                    let change = false;
                                    for (let key in copy){
                                        if(key == 'carPhoto'){
                                            let carPhoto = [];
                                            copy[key].forEach((v,i)=>{
                                                (v.photoCode != data.carPhoto[i].photoCode ) && imgs.push(data.carPhoto[i])
                                            })
                                            if(carPhoto.length == 0){
                                                copy.carPhoto = null
                                            }else{
                                                copy.carPhoto = carPhoto
                                            }
                                        }else if(key == 'carTimeValidity'){
                                            let carTimeValidity = [];
                                            copy[key].forEach((v,i)=>{
                                                (v.time != data.carTimeValidity[i].time) && carTimeValidity.push(data.carTimeValidity[i])
                                            })
                                            if(carTimeValidity.length == 0){
                                                copy.carTimeValidity = null
                                            }else{
                                                copy.carTimeValidity = carTimeValidity; 
                                                change == false && ( change = true ) 
                                            }
                                        }else{
                                            if(copy[key] == data[key]){
                                                copy[key] = null;
                                            }else{
                                                copy[key] = data[key]
                                                change == false && ( change = true ) 
                                            }
                                        }
                                    }
                                    if(!change){
                                        this.$message({
                                            message: '您未修改任何数据',
                                        });
                                        this.close()
                                        return 
                                    }
                                    copy.updateMan = this.auth.userId;//修改
                                    copy.id = data.id;//被修改车辆
                                    if(this.isCorrect){//修正
                                        this.publics.AJAX.$POST({
                                            url:"car/revise",
                                                data:copy,
                                                type:'patch',
                                                success:(res)=>{
                                                    this.init();
                                                    this.$message({
                                                        message: '车辆修正成功',
                                                        type:'success'
                                                    });
                                                    this.close()
                                                }
                                        }) 
                                    }else{//更新
                                        this.publics.AJAX.$POST({
                                            url:"car/upd",
                                                data:copy,
                                                type:'patch',
                                                success:(res)=>{
                                                    this.init();
                                                    this.$message({
                                                        message: '车辆更新成功',
                                                        type:'success'
                                                    });
                                                    this.close()
                                                }
                                        }) 

                                    }
                                }else{//新增
                                    data.createMan = this.auth.userId;
                                    this.publics.AJAX.$POST({
                                        url:"car/add",//新增车辆
                                            data:data,
                                            success:(res)=>{
                                                this.init();
                                                this.$message({
                                                    message: '新增车辆成功',
                                                    type: 'success'
                                                });
                                                this.close()
                                            }
                                    }) 

                                }
                        }).catch(() => {
                            this.flag = true;
                            // this.initNewForm()
                    });
                    
                } else {
                    return false;
                }
                });
            },
            pageChange(i){//分页
                this.carSearchDTO.page = i
                this.init();
            },
            handleDetail(id) {//查看
                    this.publics.AJAX.$POST({
                        url:"car/" + id + '/detail',
                        type:'get',
                        success:(res)=>{
              
                            this.addNew = true;
                            this.isDetail = true;
                            this.newForm = res;
                            if(this.$refs['newForm']!==undefined){
                                this.$refs['newForm'].clearValidate();
                            }
                            let imgs = this.newForm.carPhoto;
                            this.upload = this.upload.map((v,i)=>{
                                if(imgs[i]){
                                    v.url = 1;
                                    v.dataurl = imgs[i].photoCode;
                                }else{
                                    v.url = 1;
                                    v.dataurl = '';
                                }
                                return v
                            })
                        }
                    })                 
            },
            handleDelete(row) {//删除
                this.$confirm('确认删除车辆'+ row.carNumber +'？', '提示', {
                    confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                                this.publics.AJAX.$POST({
                                    url:"car/" + row.id + '/del/user/' + this.auth.userId,
                                    type:'get',
                                    success:(res)=>{
                                        this.init();
                                        this.$message({
                                            message: '删除车辆成功',
                                            type: 'success'
                                        });
                                    }
                                }) 
                        }).catch(() => {
                           
                    });
            },
            handleBack(row){
                this.$confirm('确认恢复车辆'+ row.carNumber +'？', '提示', {
                    confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                                this.publics.AJAX.$POST({
                                    url:"car/" + row.id + '/user/' + this.auth.userId,
                                    type:'get',
                                    success:(res)=>{
                                        this.init();
                                        this.$message({
                                            message: '恢复车辆成功',
                                            type: 'success'
                                        });
                                    }
                                }) 
                        }).catch(() => {
                           
                    });
            },
            handleEdit(flag){//切换为编辑状态
                this.isCorrect = flag;
                this.isEdit = true;
                this.isDetail = false;
                this.upload = this.upload.map((v,i)=>{
                    if(v){
                        v.url = v.dataurl;
                    }else{
                        v.url = '';
                        v.dataurl = '';
                    }
                        return v
                    })
                this.copyForm = JSON.parse(JSON.stringify(this.newForm));
                this.$refs['newForm'].clearValidate();
            },
            close(){
                this.initNewForm();
                this.addNew = false;
                this.isEdit = false;
                this.isDetail = false;
                this.copyForm = {};
                this.$refs['newForm'].clearValidate()//清除验证
                this.$refs['newForm'].resetFields()//清除验证
            }   
        }
    }
</script>
<style lang = 'scss'>
    .car{
        background: #F5F6FA;
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
            width: 88px;
            display: inline-block;
            padding:0 10px;
            height: 32px;
            border-radius: 24px;
            color: #fff;
            font-size: 14px;
            text-align: center;
            line-height: 32px;
        }
    }
    .table{
        margin: 21px 10px;
        background: #fff;
        .icon{
            display: inline-block;
            width: 17px;
            height: 17px;
            margin: 0 7px;
        }
        .detail{
            background: url('../../assets/img/detail.png')
        }
        .delete{
            background: url('../../assets/img/delete1.png')
        }
        .reback{
            background: url('../../assets/img/reback.png')
        }
    }
    .el-form-item__label{
        line-height: 40px;
    }
    /* .el-form-item{
        margin-bottom: 10px;
    } */
    .success-row td:nth-child(6) .cell{
        color: rgb(14, 155, 14);
    }
    .warning-row td:nth-child(6) .cell{
        color: #FF4B4B;
    }
    .el-dialog__body{
        box-sizing: border-box;
        padding:0 20px;
    }
    .el-select,.el-radio-group{
        width: 100%;
    }
    .uploadfile{
        width: 158px;
        height: 100px;
    }
    .dialog-footer{
        text-align: center;
    }
    .el-button+.el-button{
        margin-left: 28px;
    }
    .el-dialog{
        background: url('../../assets/img/dialog_bg.png') no-repeat 0% 100%;
        background-size: 100% 40%;
        background-color: #fafafa;
    }
    .sub_title{
        color: #333;
        font-size: 14px;
        margin: 8px 0;
    }
    .el-form{
        .table{
            .el-form-item__error{
                display: none;
            }
            .el-row{
                height: 40px;
                line-height: 40px;
            }
            .el-col{
                border: 1px solid #666;
                background: #fff;
                height: 40px;
                text-align: center;
                word-break: break-all;
                .el-col{
                    height: 38px;
                    border: none;
                }
            }
            .el-input__inner{
                border: none;
                height: 32px;
            }
        }
        .img{
            .el-form-item{
                padding: 0 20px;
            }
        }
        .el-input--suffix{
          .el-input__inner{
             height: 36px !important; 
          }    
        }
       
    }
     .el-form .table .el-input__inner{
            background: none;
            color:#333;
    }
}
</style>

  