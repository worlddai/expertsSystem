
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