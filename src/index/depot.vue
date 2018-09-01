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
//import Base64 from "js-base64";
  import slide from "../components/slide";
  import head from "../components/head";
  import { HappyScroll } from 'vue-happy-scroll'
  import Base64 from "js-base64";
  import 'vue-happy-scroll/docs/happy-scroll.css'
  //import footer from "../components/footer"
  export default {
    data() {
      return {
         signs:'depot',
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
       if(Base64.Base64.decode(sessionStorage.getItem("level"))!=0){
            this.hide.hide=[1]
        }
    },
    methods:{
      router(){
        
      }
    },
    watch: {
      '$route':"router"
    }
  }

</script>