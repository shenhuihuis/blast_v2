const logistics_car = resolve => require(['../page/logistics/car'], resolve)  //注册
const distribution = resolve => require(['../page/logistics/distribution'], resolve)  //注册
export default [
    { 
        path:'/logistics_car', 
        component: logistics_car,
        name:"logistics_car",
        meta: {
            title: '车辆管理',
        },
    },
    { 
        path:'/distribution', 
        component: distribution,
        name:"distribution",
        meta: {
            title: '民爆物品配送',
        },
    },
]