//主路由模块
const index = resolve => require(['../page/home'], resolve)  //主页 
const login = resolve => require(['../page/login'], resolve)  //项目监管 
import blast_router from "./blast"//爆破二级路由
import depot_router from "./depot"//仓库管理二级路由
import police_router from "./police"//公安监管二级路由
import logistics_router from "./logistics"//配送管理二级路由
import project_router from "./project"//项目监管二级路由
const register = resolve => require(['../page/register'], resolve)  //注册
const NotFoundComponent  = resolve => require(['../page/404'], resolve)//页面4004
const management=resolve => require(['../page/management'], resolve)
const message=resolve => require(['../page/message'], resolve)
const notice=resolve => require(['../page/notice'], resolve)
const repassword=resolve => require(['../page/repassword'], resolve)
export default [
  {
    path:'/home',   //爆破单位
    component: index,
    name:"home",
    meta: {
      title: '主页',
    },
    children:[
      ...blast_router,
      ...depot_router,
      ...police_router,
      ...logistics_router,
      ...project_router,
      { 
        path:'/management', 
        component: management,
        name:"management"
      },
      { 
        path:'/message', 
        component: message,
        name:"message"
      },
      { 
        path:'/notice', 
        component: notice,
        name:"notice"
      },

    ]
  },
  { 
    path:'', 
    component: login,
    name:"login"
  },
  { 
    path:'/register', 
    component: register,
    name:"register"
  },
  { 
    path:'/repassword', 
    component: repassword,
    name:"repassword"
  },
  { path: '*', component: NotFoundComponent,name:"404" }
]