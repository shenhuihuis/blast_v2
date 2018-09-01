<template>
    <div class="messclearbox" v-if="datas.show">
        <div class="list">
             <a href="javascript:void(0);" @click="datas.show=false" class="close"></a>
             <div class="table">
                 <div class="thead">
                     <div class="td">标题</div>
                     <div class="td">发布人</div>
                     <div class="td">类型</div>
                     <div class="td">通知时间</div>
                     <div class="td">操作</div>
                 </div>
                 <div class="tbody">
                     <div class="tr" v-for='i in datas.list.data'>
                         <div class="td">{{i.title}}</div>
                         <div class="td">{{i.staffName}}</div>
                         <div class="td">
                            <span v-if="i.type==1">新闻</span>
                         </div>
                         <div class="td">{{i.createTime}}</div>
                         <div class="td"><a href="javascript:void(0);" @click="see(i)">查看</a></div>
                     </div>
                 </div>
             </div>
        </div>
    </div>
</template>
<script>
    export default {
        props:["datas"],
        data (){
          return{

          }
        },
        mounted(){

        },
        methods:{
            see(i){
                 this.$alert(i.msg, i.title, {
                    confirmButtonText: '确定',
                    callback: action => {
                       
                    }
                });
            }
        }
    }
</script>
