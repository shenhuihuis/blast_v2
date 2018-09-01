<template>
    <div class="smallinput cksmll" style="float:right;" v-if="level">
        <el-select v-model="ssss.province.value" placeholder="请选择省级辖区" @change="cityselect(ssss.province,0)" v-if="level<=0">
            <el-option v-for="(item,index) in ssss.province.list" :label="item.name" :key="index" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="ssss.city.value" placeholder="请选择市级辖区" @change="cityselect(ssss.city,1)" v-if="level<=1">
            <el-option v-for="(item,index) in ssss.city.list" :label="item.name" :key="index" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="ssss.area.value" placeholder="请选择区级辖区" @change="cityselect(ssss.area,2)" v-if="level<=2">
            <el-option v-for="(item,index) in ssss.area.list" :label="item.name" :key="index" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="ssss.street.value" placeholder="请选择街道辖区" @change="cityselect(ssss.street,3)" v-if="level<=3">
            <el-option v-for="(item,index) in ssss.street.list" :label="item.name" :key="index" :value="item.id"></el-option>
        </el-select>
    </div>
</template>
<script>
    import Base64 from "js-base64";
    export default {
        data(){
            return {
                level:Base64.Base64.decode(sessionStorage.getItem("level")),
                 ssss: {
                    province: {
                        list: [],
                        value: ""
                    },
                    city: {
                        list: [],
                        value: ""
                    },
                    area: {
                        list: [],
                        value: ""
                    },
                    street: {
                        list: [],
                        value: ""
                    }
                },
            }
        },
        mounted(){
             this.publics.$AJAX("police/ssss", "get", null, e => {
                    this.ssss.province.list = e;
                    this.ssss.province.value=e[0].id;
                    //this.cityselect(this.ssss.province,0)
                }).then(e=>{
                  
              })
        },
        methods:{
            cityselect(Arr, type) {
                let index = Arr.list.findIndex(item => {
                return item.id == Arr.value;
                });
                let Brr = Arr.list[index];
                if (type == 0) {
                this.ssss.city = {
                    list: Brr.children,
                    value: Brr.children[0].id
                };
                this.ssss.area = {
                    list: Brr.children[0].children,
                    value: Brr.children[0].children[0].id
                };
                this.ssss.street = {
                    list: Brr.children[0].children[0].children,
                    value: Brr.children[0].children[0].children[0].id
                };
                this.list(this.ssss.province.value)
                }
                if (type == 1) {
                this.ssss.area = {
                    list: Brr.children,
                    value: Brr.children[0].id
                };
                this.ssss.street = {
                    list: Brr.children[0].children,
                    value: Brr.children[0].children[0].id
                };
                this.list(this.ssss.city.value)
                }
                if (type == 2) {
                this.ssss.street = {
                    list: Brr.children,
                    value: Brr.children[0].id
                };
                this.list(this.ssss.area.value)
                }
                if (type == 3) {
                this.list(this.ssss.street.value)
                }
                
            },  
        }
    }
</script>
