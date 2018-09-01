<template>
    <div class="perinfo" v-if="car.show">
        <div class="infofa">
             <a href="javascript:void(0);" @click="car.show=false" class="close"></a>
            <div class="clearbox">
                <div class="sminput">
                    <label>车牌号</label>
                    <span>{{car.carNumber}}</span>
                </div>
                <div class="sminput">
                    <label>车辆品牌</label>
                    <span>{{car.carBrand}}</span>
                </div>
            </div>
            
             <div class="clearbox">
                <div class="sminput">
                    <label>发动机号码</label>
                    <span>{{car.engineNumber}}</span>
                </div>
                <div class="sminput">
                    <label>车架号码</label>
                    <span>{{car.frameNumber}}</span>
                </div>
            </div>
            <div class="clearbox">
                <div class="sminput">
                    <label>车牌颜色</label>
                    <span>{{car.carNumberColor}}</span>
                </div>
                <div class="sminput">
                    <label>车辆颜色</label>
                    <span>{{car.carColor}}</span>
                </div>
            </div>
             <div class="clearbox">
                <div class="sminput">
                    <label>车辆类型</label>
                    <span>{{car.carType}}</span>
                </div>
                <div class="sminput">
                    <label>车辆尺寸(单位/mm)</label>
                    <span>长:{{car.carLen}} 宽:{{car.carWide}} 高:{{car.carHeight}}</span>
                </div>
            </div>
              <div class="clearbox">
                <div class="sminput">
                    <label>核定载重(kg)</label>
                    <span>{{car.carWeigh}}</span>
                </div>
                <div class="sminput">
                    <label>整备质量(单位/mm)</label>
                    <span>{{car.carAllowWweight}}</span>
                </div>
            </div>
              <div class="clearbox">
                <div class="sminput">
                    <label>准备引总质量或挂车总质量</label>
                    <span>{{car.totalWei}}</span>
                </div>
                <div class="sminput">
                    <label>持有类型</label>
                    <span>{{car.ownType}}</span>
                </div>
            </div>
            
            <div class="clearbox">
                <div class="sminput">
                    <label>道路运输许可证</label>
                    <span>{{car.certNum}}</span>
                </div>
                <div class="sminput">
                    <label>经营范围</label>
                    <span>{{car.scope}}</span>
                </div>
            </div>
              <div class="clearbox">
                <div class="sminput">
                    <label>交强险有效期</label>
                    <span>{{car.insuranceDate|fmtDate}}</span>
                </div>
                <div class="sminput">
                    <label>第三者责任险有效期</label>
                    <span>{{car.dutyInsurancedate|fmtDate}}</span>
                </div>
            </div>

            <div class="clearbox">
                <div class="sminput">
                    <label>承运人责任限有效期</label>
                    <span>{{car.dutypeoDate|fmtDate}}</span>
                </div>
                <div class="sminput">
                    <label>卫星定位系统营运商</label>
                    <span>{{car.satellite}}</span>
                </div>
            </div>
              <div class="clearbox">
                <div class="sminput">
                    <label>道路运输证年审有效期</label>
                    <span>{{car.roadDate|fmtDate}}</span>
                </div>
                <div class="sminput">
                    <label>道路运输证证件有效期</label>
                    <span>{{car.certDate|fmtDate}}</span>
                </div>
            </div>
            
            <div class="clearbox">
                <div class="sminput">
                    <label>行驶证年审有效期</label>
                    <span>{{car.certyearDate|fmtDate}}</span>
                </div>
                <div class="sminput">
                    <label>行驶证证件有效期</label>
                    <span>{{car.certagrDate|fmtDate}}</span>
                </div>
            </div>
              <div class="clearbox">
                <div class="sminput">
                    <label>技术等级评定有效期</label>
                    <span>{{car.tecDate|fmtDate}}</span>
                </div>
                <div class="sminput">
                    <label>二级维护有效期</label>
                    <span>{{car.secImprovedate|fmtDate}}</span>
                </div>
            </div>
             <div class="clearbox">
                <div class="sminput">
                    <label>所属公司</label>
                    <span>{{car.satellite}}</span>
                </div>
                
            </div>
            <div class="clearbox">
                <div class="sminput img">
                    <label>营运证证本</label>
                    <span>
                        <img :src="car.photoCodes[0].photoCode" alt="">
                    </span>
                </div>
                <div class="sminput img">
                    <label>等级评定卡</label>
                    <span>
                        <img :src="car.photoCodes[1].photoCode" alt="">
                    </span>
                </div>
            </div>
            <div class="clearbox">
                <div class="sminput longimg">
                    <label>代理证</label>
                    <span>
                        <img :src="car.photoCodes[2].photoCode" alt="">
                        <img :src="car.photoCodes[3].photoCode" alt="">
                    </span>
                </div>
            </div>

             <div class="clearbox">
                <div class="sminput longimg">
                    <label>行驶证照片</label>
                    <span>
                        <img :src="car.photoCodes[4].photoCode" alt="">
                        <img :src="car.photoCodes[5].photoCode" alt="">
                        <img :src="car.photoCodes[6].photoCode" alt="">
                        <img :src="car.photoCodes[7].photoCode" alt="">
                    </span>
                </div>
            </div>
        </div>

    </div>
</template>
<script>
    export default {
        props:["car"],
        data() {
            return{
               
            }
        },
        mounted(){
            
        },
         filters:{
            fmtDate(obj){
                var date =  new Date(obj);
                var y = 1900+date.getYear();
                var m = "0"+(date.getMonth()+1);
                var d = "0"+date.getDate();
                return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
            }
        },
        methods:{

        }
    }
</script>
