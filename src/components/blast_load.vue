<template>
    <div class='blast_load' v-if="form.show">
        <div class="syscontair" :style="{'height':hei+'px'}">
            <happy-scroll>
                <div class="storage">
                    <div class='htit'>
                        <span v-if="form.type==1">购买登记</span>
                        <span v-if="form.type==2">出库登记</span>
                        <span v-if="form.type==3">退库</span>
                        <span v-if="form.type==4">变更入库</span>
                        <span v-if="form.type==5">使用登记</span>
                        <span v-if="form.type==6">领用登记</span>
                        <span v-if="form.type==7">消耗登记</span>
                    </div>
                    <div class="newot">
                        <div class="sminput">
                            <div class="hti">工业炸药</div>
                            <div class="clearbox" v-for="(i,index) in form.pyrotechnicsList" v-if="i.pyrotechnicsFlag==1">
                                <label>品名</label>
                                <el-input class="input-with-select" v-model="i.pyrotechnicsName" :disabled="true"></el-input>
                                <label>型号</label>
                                <el-input class="input-with-select" v-model="i.pyrotechnicsType" :disabled="true">
                                    <template slot="append">毫米</template>
                                </el-input>
                                <label>数量</label>
                                <el-input class="input-with-select" v-model="i.pyrotechnicsNumber" :disabled="true">
                                    <template slot="append">
                                        公斤
                                    </template>
                                </el-input>
                            </div>
                        </div>
                        <div class="sminput">
                            <div class="hti">雷管</div>
                            <div v-if='form.type==1 || form.type==2'>
                                <div class="clearbox" v-for="(i,index) in form.pyrotechnicsList" v-if="i.pyrotechnicsFlag==2">
                                    <label>段别</label>
                                        <el-input class="sm" v-model="i.pyrotechnicsType.split('-')[0]" :disabled="true">
                                            <template slot="append">
                                            段
                                            </template>
                                        </el-input>
                                        <el-input class="sm" v-model="i.pyrotechnicsType.split('-')[1]" :disabled="true">
                                            <template slot="append">
                                            米
                                            </template>
                                        </el-input>

                                        <label>数量</label>
                                        <el-input v-model="i.pyrotechnicsNumber" :disabled="true">
                                            <template slot="append">
                                            发
                                            </template>
                                        </el-input>
                                </div>
                             </div>
                              <div v-for="i in form.detonatorSectionDtoList" class="lgmess" style="margin-bottom:10px;" v-else>
                                <dl>
                                    <dt>
                                        <span>{{i.section.split("-")[0]}}</span>段
                                        <span>{{i.section.split("-")[1]}}</span>米
                                        <span>{{i.detonatorDtoList|longer}}</span>发
                                    </dt>
                                    <dd v-for="j in i.detonatorDtoList" v-if="j.useStatus">{{j.detonator}}</dd>
                                </dl>
                            </div>
                        </div>
                       
                       <!-- <div v-for="i in form.detonatorSectionDtoList" class="lgmess" style="margin-bottom:10px;" v-if='form.type==1 || form.type==2 || form.type==6'>
                            <dl>
                                <dt>
                                    <span>{{i.section.split("-")[0]}}</span>段
                                    <span>{{i.section.split("-")[1]}}</span>米
                                    <span>{{i.detonatorDtoList.length}}</span>发
                                </dt>
                                <dd v-for="j in i.detonatorDtoList">{{j.detonator}}</dd>
                            </dl>
                        </div>-->
                       
                        <div class="sminput" style="margin-top:20px;">
                                <div class="clearbox">
                                    <label class="hti">导爆管</label>
                                    <el-input v-model="i.pyrotechnicsNumber" :disabled="true" class="lf" style="margin-right:20px;" :key="index" v-for="(i,index) in  form.pyrotechnicsList" v-if="i.pyrotechnicsFlag==3">
                                        <template slot="append">
                                            米
                                        </template>
                                    </el-input>
                                    <label class="hti">导爆索</label>
                                    <el-input v-model="i.pyrotechnicsNumber" :disabled="true" class="lf" style="margin-right:20px;" :key="index" v-for="(i,index) in  form.pyrotechnicsList" v-if="i.pyrotechnicsFlag==4">
                                        <template slot="append">
                                            米
                                        </template>
                                    </el-input>
                                </div>
                        </div>
                    </div>
                    <div class="clearbox" style="overflow:hidden;">
                        <div v-for="j in form.autographDtoList" class="strput">
                            <div class="name">
                                <span>{{publics.person[j.type-1]}}签名:</span>
                                 <img :src="j.autograph" width="80px">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="dis_sub">
                    <a href="javascript:void(0);" @click="form.show=false">查看完毕</a>
                </div>
            </happy-scroll>
        </div>
    </div>
</template>
<script>
import { HappyScroll } from "vue-happy-scroll";
import "vue-happy-scroll/docs/happy-scroll.css";
export default {
  props: ["form"],
  data() {
    return {
      hei: document.body.scrollHeight - 40
    };
  },
  filters: {
    longer(arr) {
      let much = 0;
      for (let val of arr) {
        if (val.useStatus == true) {
          much += 1;
        }
      }
      return much;
    }
  },
  components: {
    HappyScroll
  },
  mounted() {},
  methods: {}
};
</script>