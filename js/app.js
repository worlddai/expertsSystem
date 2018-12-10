/*
 * @Description: 路由入口文件
 * @Author: daiyujie
 * @Date: 2018-11-23 18:24:32
 * @LastEditTime: 2018-12-10 18:57:13
 * @LastEditors: Please set LastEditors
 */
var routes = [
    {
        name: 'home',
        path: "/",
        component: { template: "#home" }
    },
    {
        name: 'detail',
        path: "/detail/:expertId",
        component: { template: "#detail" }
    },
];
// 定义路由组件
var router = new VueRouter({
    routes
});

const global_vue = new Vue({
    router
}).$mount('#app')