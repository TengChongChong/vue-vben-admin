import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const userRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      title: '用户信息',
      keepAlive: true,
      hideInMenu: true,
    },
    name: 'AuthPersonal',
    path: '/auth/personal',
    children: [
      {
        meta: {
          title: '个人中心',
          keepAlive: true,
          hideInMenu: true,
          icon: 'lucide:user-round',
        },
        name: 'AuthPersonalIndex',
        path: '/auth/personal/index',
        component: () => import('#/views/auth/personal/index.vue'),
      },
    ],
  },
];

export default userRoutes;
