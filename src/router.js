const routers = [
    {
        path: '/',
        name: 'home',
        meta: {
            title: '出发去旅行咯'
        },
        component: (resolve) => require(['./views/index.vue'], resolve)
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '用户登录'
        },
        component: (resolve) => require(['./views/login.vue'], resolve)
    },
    {
        path: '/task',
        name: 'task',
        meta: {
            title: '任务列表'
        },
        component: (resolve) => require(['./views/task.vue'], resolve)
    },
    {
        path: '/ticket',
        name: 'ticket',
        meta: {
            title: '任务列表'
        },
        component: (resolve) => require(['./views/ticket.vue'], resolve)
    }
];
export default routers;