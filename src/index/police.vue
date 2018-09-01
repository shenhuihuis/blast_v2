<template>
    <div class="contair" v-if="load">
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
  import { HappyScroll } from 'vue-happy-scroll'
  import 'vue-happy-scroll/docs/happy-scroll.css'
  export default {
    data() {
      return {
         signs:'police',
         index:null,
         load:true,
         hei:document.body.scrollHeight - 108,
      }
    },
    components: {
        "myslide": slide,
        "tophead": head,
        HappyScroll
    },
    mounted(){
      
     
    },
    methods:{
      
    }
  } 

</script>