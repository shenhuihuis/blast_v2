<template>
    <div class="staffbox" v-if="data.show">
        <div class="bindex">
            <el-transfer v-model="data.value" :data="data.data" :titles="['非本项人员', '本项人员']"></el-transfer>
            <div class="btn">
                 <el-button type="primary" @click="tosub">变更人员</el-button>
                 <el-button type="primary" @click="data.show=false" plain>取消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:["data"],
        data(){
            return {

            }
        },
        mounted(){

        },
        methods:{
            tosub(e){
                this.$emit("tosub")
            }
        }
    }
</script>
