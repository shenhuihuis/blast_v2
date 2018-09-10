<template>
      <div class="comcontairs" v-if="show==0">
            <div class="topHad">
                <el-select v-model="SearchDTO.projectId" placeholder="选择状态" @change='init'>
                    <el-option
                    v-for="item in SearchDTO.projectlist"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                    </el-option>
                </el-select>
                <el-select v-model="SearchDTO.status" placeholder="选择状态" @change='init'>
                    <el-option
                    v-for="item in SearchDTO.statuslist"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value">
                    </el-option>
                </el-select>
            </div>
            <div class="blastlist">
                <el-table :data="dataList" style="width: 100%"  :row-class-name="tableRowClassName">
                    <el-table-column prop="projectName" label="项目名称"  width="240px"></el-table-column>
                    <el-table-column prop="buyMsg" label="委托单位" width="360px"> </el-table-column>
                    <el-table-column prop="projectName" label="入库时间"  width="240px"></el-table-column>
                    <el-table-column prop="buyMsg" label="操作人" width="360px"> </el-table-column>
                    <el-table-column prop="buyMsg" label="状态" width="360px"> </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small"  @click = "handleDetail(scope.row.id,scope.row.transportTime)">查看</el-button>
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
    export default {
        data (){
            return {
                size:10,
                page:1,
                total:0,
                SearchDTO:{
                    projectId:"",   
                    projectlist:[
                        {value:"",text:'全部'},
                        {value:0,text:'待审批'},
                        {value:1,text:'已通过'},
                        {value:2,text:'已驳回'},
                        {value:3,text:'已上传许可证'},
                    ],
                    status:"",
                    statuslist:[
                        {value:"",text:'全部'},
                        {value:0,text:'待审批'},
                        {value:1,text:'已通过'},
                        {value:2,text:'已驳回'},
                        {value:3,text:'已上传许可证'},
                    ]
                }
            }
        },
        methods:{
            
        },
        mounted() {
            
        }
    }
</script>