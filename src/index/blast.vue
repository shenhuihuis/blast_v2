<template>
    <div class="contair">
        <myslide :sign="signs" :current="index" :hide="hide"></myslide>  
        <div class="main">
           <tophead></tophead>
           <div class="compt" :style="{'height':hei+'px'}">
              <happy-scroll>
                <router-view></router-view>
              </happy-scroll>
           </div>
        </div> 
    </div>
</template>

<script>
  import slide from "../components/slide";
  import head from "../components/head";
  import { HappyScroll } from 'vue-happy-scroll';
  import 'vue-happy-scroll/docs/happy-scroll.css';
  export default {
    data() {
      return {
         signs:'blast',
         index:null,
         hei:document.body.scrollHeight - 108,
         hide:{
           name:"",
           hide:[]
         }
      }
    },
    components: {
        "myslide": slide,
        "tophead": head,
        HappyScroll
    },
    mounted(){
      this.router();
      console.log(1)
    },
    methods:{
      router(){
        let router=this.$route.name;
        
        if(router=="prodetails"){
          this.index=2
        }
      }
    },
    watch: {
      '$route':"router"
    }
  }

</script>