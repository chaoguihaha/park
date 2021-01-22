import Vue from 'vue'
import Router from 'vue-router'
import home from "@/home";
import Login from "@/components/Login";
import user from "@/components/HomeVue/user";
import water from "@/components/HomeVue/water";
import lighting from "@/components/HomeVue/lighting";
import gas from "@/components/HomeVue/gas";

Vue.use(Router)

export default new Router({
    mode: 'hash',//去掉#号
    routes: [
        {
            path: '/',
            name: 'Login',
            component: Login
        },{
            path: '/home',
            name: 'home',
            component: home,
            children: [
                {
                    path: '/user',
                    component: user
                },
                {
                    path: '/water',
                    component: water
                },
                {
                    path: '/lighting',
                    component: lighting
                },
                {
                    path: '/gas',
                    component: gas
                },
            ]
        }
    ]
})