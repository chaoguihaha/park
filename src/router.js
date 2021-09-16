import Vue from 'vue'
import Router from 'vue-router'
import home from "@/home";
import Login from "@/components/Login";
import user from "@/components/HomeVue/user";
import park from "@/components/HomeVue/park";

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
                    path: '/park',
                    component: park
                },
            ]
        }
    ]
})