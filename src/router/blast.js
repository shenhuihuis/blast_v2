const project = resolve => require(['../page/blast/project'], resolve)  //总表
const prodetails = resolve => require(['../page/blast/prodetails'], resolve)  //总表详情
const projectChange= resolve => require(['../page/blast/projectChange'], resolve)     //总表修改
const Changedetails= resolve => require(['../page/blast/Changedetails'], resolve)     //总表修改详情
const blastbuy= resolve => require(['../page/blast/blastbuy'], resolve)     //总表修改详情
export default [
    { 
        path:'/project', 
        component: project,
        name:"project",
        meta: {
            title: '总表',
        },
    },
    { 
        path:'/project/prodetails', 
        component: prodetails,
        name:"prodetails",
        meta: {
            title: '总表详情',
        },
    },
    { 
        path:'/projectChange', 
        component: projectChange,
        name:"projectChange",
        meta: {
            title: '总表修改',
        },
    },
    { 
        path:'/Changedetails', 
        component: Changedetails,
        name:"Changedetails",
        meta: {
            title: '总表修改详情',
        },
    },
    { 
        path:'/blastbuy', 
        component: blastbuy,
        name:"blastbuy",
        meta: {
            title: '火工品购买',
        },
    },
    
];