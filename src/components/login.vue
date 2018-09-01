<template>
    <div class="login">
        <div class="tit">
            <span>民爆物流流向信息监管系统</span>
        </div>
        <div class="cter">
            <div class="form">
                <input type="text" placeholder="请输入手机" v-model="forms.tel" />
                <input type="password" placeholder="请输入密码" v-model="forms.password" @keyup.enter="sub" />
                <div class="long">
                    <input type="text" placeholder="请输入收到的验证码" v-model="forms.yzm" />
                    <a href="javascript:void(0);" id="yzm" class="code-btn" @click="getyzm($event)">获取验证码</a>
                </div>
                <a href="javascript:void(0);" class="sub" @click="sub" >登录</a>
            </div>
        </div>
    </div>
</template>
<script>
    import $http from "superagent";
    import Base64 from "js-base64";
    export default {
        data() {
            return {
                router: "",
                forms: {
                    tel: "",
                    password: "",
                    yzm: ""
                },
                count: 60,
                yzmsuccess: true,
            }
        },
        mounted() {
            this.publics.cook.delete("token");
            let router = this.$route.name;
            let routername=["blast_login","depot_login","police_login","logistics_login","system_login","project_login"];
            let toname=[
                {name:"blast_index",id:4},
                {name:"depot_index",id:3},
                {name:"police_index",id:1},
                {name:"logistics_index",id:2},
                {name:"system",id:5},
                {name:"project_index",id:6}
            ];
            for(let [index,val] of routername.entries()){
                if(val==router){
                    this.router=toname[index].name;
                }
            }
            

            // if (router == "blast_login") {            //4
            //     to = "blast_index";
            // } else if (router == "depot_login") {     //3
            //     to = "depot_index"
            // } else if (router == "police_login") {    //1
            //     to = "police_index"
            // } else if (router == "logistics_login") { //2
            //     to = "logistics_index"
            // } else if (router == "system_login") {    //5
            //     to = "system"
            // } else {
            //     to = "project_index";                 //6
            // }
            // this.router = to;
        },
        methods: {
            timer() {
                var countdown = this.count;
                document.getElementById('yzm').innerHTML = countdown + "秒后重发";
                this.yzmsuccess = false;
                if (countdown == 0) {
                    document.getElementById('yzm').innerHTML = "重新获取"
                    countdown = 60;
                    this.count = 60
                    this.yzmsuccess = true
                    return false;
                } else {
                    countdown--;
                }
                this.count = countdown
                setTimeout(function() {
                    this.timer()
                }.bind(this), 1000)
            },
            getyzm(e) {
                if (!this.forms.tel) {
                    this.$message({
                        type: "error",
                        message: "请输入手机号"
                    })
                    return false;
                } else {
                    if (!/^1[3|4|5|7|8]\d{9}$/.test(this.forms.tel)) {
                        this.$message({
                            type: "error",
                            message: "手机格式错误"
                        })
                        return false;
                    }
                    if (this.yzmsuccess == true) {
                        this.timer()
                    }
                }
            },
            sub() {
                let data = {
                    password: this.forms.password,
                    username: this.forms.tel
                };
                let json = JSON.stringify(data);
                $http.post("http://192.168.1.84:8898/auth/login", json)
                    .set("Content-Type", "application/json")
                    .end((err, res) => {
                        if (err || !res.ok) {
                            this.$message({
                                type: "error",
                                message: "传输数据错误,请检查填写参数！"
                            });
                            reject();
                        } else {
                            let BackJSON = JSON.parse(res.text);
                            if (res.status == "200") {
                                this.publics.setindex();
                                this.publics.cook.set("token", BackJSON.token)
                               /* let person={
                                    companyId:BackJSON.companyId,
                                    staffId:BackJSON.staffId,
                                    companyType:BackJSON.companyType
                                }
                                sessionStorage.setItem("person",Base64.Base64.encode(JSON.stringify(person)));*/
                                sessionStorage.setItem("person",Base64.Base64.encode(BackJSON.staffId));
                                sessionStorage.setItem("companyid",Base64.Base64.encode(BackJSON.companyId));
                                sessionStorage.setItem("names",BackJSON.companyName);
                                console.log(BackJSON.companyName)
                                return false;
                                let history = this.publics.cook.get("history");
                                let load=this.$loading({
                                    text: '登录中',
                                });
                                setTimeout(e => {
                                    if (history) {
                                        window.location.href = history
                                    } else {
                                        load.close()
                                        this.$router.push({
                                            name: this.router
                                        });
 
                                    }
                                    this.$router.push(0)
                                }, 1000)
                            } else {
                                Message({
                                    type: "error",
                                    message: "返回数据错误"
                                });
                            }
                        }
                    })
            }
        }
    }
</script>

