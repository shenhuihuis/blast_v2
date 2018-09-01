<template>
    <div class="perinfo" v-if="details.show">
        <div class="infofa">
             <a href="javascript:void(0);" @click="details.show=false" class="close"></a>
            <div class="clearbox">
                <div class="sminput">
                    <label>人员姓名</label>
                    <span>{{details.staffName}}</span>
                </div>
                <div class="sminput">
                    <label>身份证号码</label>
                    <span>{{details.staffId}}</span>
                </div>
            </div>
            <div class="clearbox">
                <div class="sminput">
                    <label>实际居住地</label>
                    <span>{{details.address}}</span>
                </div>
                <div class="sminput">
                    <label>联系电话</label>
                    <span>{{details.phone}}</span>
                </div>
            </div>
            <div class="clearbox">
                <div class="sminput">
                    <label>作业证号</label>
                    <span>{{details.licenceNumber}}</span>
                </div>
                <div class="sminput">
                    <label>到期时间</label>
                    <span>{{new Date(details.txmExpireTime).toLocaleString()}}</span>
                </div>
            </div>
            <div class="clearbox">
                <div class="sminput">
                    <label>手机号码</label>
                    <span>{{details.mobilePhone}}</span>
                </div>
                <div class="sminput">
                    <label>人员类型</label>
                    <span>{{type[details.staffTypeFlag-1]}}</span>
                </div>
            </div>
            <div class="clearbox">
                <div class="sminput" v-show="details.staffTypeFlag==4">
                    <label>作业许可级别</label>
                    <span>{{level[details.staffLevel-1]}}</span>
                </div>
                <div class="sminput">
                    <label>户籍所在地</label>
                    <span>{{details.homeAddress}}</span>
                </div>
            </div>
            <div class="clearbox">
                <div class="sminput">
                    <label>　所属公司</label>
                    <span>{{details.companyName}}</span>
                </div>
            </div>
            <div class="clearbox ">
                <div class="sminput img">
                    <label>身份证照片</label>
                    <span>
                        <img :src="details.staffIdPhotoFrontOssCode" alt="">
                    </span>
                </div>
                <div class="sminput img">
                    <label>身份证照片（背面）</label>
                    <span>
                         <img :src="details.staffIdPhotoReverseOssCode" alt="">
                    </span>
                </div>
            </div>
            <div class="clearbox">
                <div class="sminput img">
                    <label>作业证书</label>
                    <span>
                        <img :src="details.staffDocumentOssCode" alt="">
                    </span>
                </div>
                <div class="sminput img">
                    <label>人员照片</label>
                    <span>
                        <img :src="details.staffPhotoOssCode" alt="">
                    </span>
                </div>
            </div>
         
        </div>

    </div>
</template>
<script>
    export default {
        props:["details"],
        data() {
            return{
                type:["爆破员","安全员","保管员","技术员"],
                level:["初级/D","中级/C","高级/B","高级/A"]
            }
        },
        mounted(){
            
        },
        methods:{

        }
    }
</script>
