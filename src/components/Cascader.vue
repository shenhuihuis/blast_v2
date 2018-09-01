<template>
    <el-cascader :options="options" change-on-select></el-cascader>
</template>
<script>
    export default {
        data (){
            return {
                list:[]
            }
        },
        mounted(){
           /*let  indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
            if(!indexedDB){
                console.log("你的浏览器不支持IndexedDB");
            }
            let request = indexedDB.open("provice", 2.0);
            request.onerror = function(e) {
                console.log(e.currentTarget.error.message);
            };
            request.onsuccess = function(e) {
                myDB.db = e.target.result;
                console.log('成功打开DB');
            };
            request.onupgradeneeded = function(e) {
                    let  db = e.target.result;
                    if (!db.objectStoreNames.contains('person')) {
                        console.log("我需要创建一个新的存储对象");
                        //如果表格不存在，创建一个新的表格（keyPath，主键 ； autoIncrement,是否自增），会返回一个对象（objectStore）
                        let objectStore = db.createObjectStore('person', {
                            keyPath: "id",
                            autoIncrement: true
                        });

                        //指定可以被索引的字段，unique字段是否唯一

                        objectStore.createIndex("name", "name", {
                            unique: false
                        });

                        objectStore.createIndex("phone", "phone", {
                            unique: false
                        });

                    }
                    console.log('数据库版本更改为： ' + version);
            };*/

        },
        created(){

        },
        methods:{
            
        }
    }
</script>