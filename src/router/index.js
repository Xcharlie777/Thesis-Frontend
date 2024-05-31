import Vue from 'vue'
import VueRouter from 'vue-router'

let originPush = VueRouter.prototype.push;  //备份原push方法

VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {    //如果传了回调函数，直接使用
        originPush.call(this, location, resolve, reject);
    } else {                     //如果没有传回调函数，手动添加
        originPush.call(this, location, () => {
        }, () => {
        });
    }
}

Vue.use(VueRouter)

const routes = [
    {
        path: '/nowload',
        name: 'nowload',
        component: () => import('../views/nowload')
    },
    {
        path: '/invoke',
        name: 'invoke',
        component: () => import('../views/invoke')
    },
    {
        path: '/result',
        name: 'result',
        component: () => import('../views/result')
    },
    {
        path: '/bursty',
        name: 'bursty',
        component: () => import('../views/bursty')
    },
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})
//
// router.beforeEach( (to,from,next) => {
//     let token = store.state.token;
//     const url = to.name;
//     if(url === 'login' || url === 'register') {
//         if(token !== '') {
//             window.alert("您已经登录");
//             router.push("/");
//         }
//         else {
//             next();
//         }
//     }
//     else {
//         if(token === '') {
//             window.alert("您还没有登录");
//             router.push("/login");
//         }
//         else {
//             next();
//         }
//     }
// });


export default router
