<template>
  <div class="slider">
    <div class = 'title'></div>
    <div class="nav">
      <happy-scroll>
        <ul :style="{'height':hei+'px'}">
          <li v-for="(i,index) in slides" :class="{'drap':i.children}">
            <router-link :to="{'name':i.router,params:{tit:i.tit}}" :class="{'curs':i.checked || current==index}" >
            <!-- <router-link :to="{'name':i.router}" :class="{'curs':i.checked}"  @click.native="routerlink($event)"> -->
              <div class="tit">
                <i class="iconfont" v-html="i.ico"></i> {{i.tit}}
                <i class="triangle"></i>
              </div>
            </router-link>
            <!-- <dl v-if='i.children && i.show'>
              <dd v-for="j in i.children">
                <router-link :to="{'name':j.router}" href="javascript:void(0);">
                  <div class="tit">{{j.tit}}</div>
                </router-link>
              </dd>
            </dl> -->
          </li>
        </ul>
      </happy-scroll>
    </div>
  </div>
</template>

<script>
  import router from "./../assets/js/slide-router"
  import {
    HappyScroll
  } from 'vue-happy-scroll'
  import 'vue-happy-scroll/docs/happy-scroll.css'
  export default {
    props: ["current"],     //sign
    data() {
      return {
        company:"",
        hei: document.body.scrollHeight - 108,
        slides: [],
      }
    },
    created() {
      let routes = router.router;
      if(sessionStorage.getItem("auth")){
          let type=this.publics.global().auth.type
          switch (type) {
            case "0":
              this.slides = routes.blast;
              this.company="爆破公司";
              break;
            case "1":
              this.slides = routes.project;
              this.company="监理公司";
              break;
            case "2":
              this.slides = routes.logistics;
              this.company="配送公司";
              break;
            case "3":
              this.slides = routes.depot;
              this.company="仓库公司";
              break;
            case "4":
              this.slides = routes.police;
              break;
          }
          this.router();
            
       }else{
         this.$router.push({name:'login'})
       }
      
    },
    components: {
      HappyScroll
    },
    watch: {
      '$route': 'router'
    },
    methods: {
      router() {
        let router = this.$route.name;
        let index=this.current;
        for (let val of this.slides) {
          val.checked=false;
          if (val.router == router) {
            val.checked = true;
            this.$emit('titleChange',val.tit);
          }
          if (val.children) {
            val.show = true;
            for(let value of val.children){
              if(value.router==router){
                value.checked=true;
                val.checked=true;
              }
            }
          }
        
        }
      }
    }
  }
</script>
<style lang = 'scss'>
  .slider{
    .title{
      background: url('../assets/img/sub_title.png') no-repeat 30% 45%;
      padding: 15px 28px;
      height: 60px;
      /* border-bottom: 1px solid #D8D8D8; */
    }
  }
</style>

