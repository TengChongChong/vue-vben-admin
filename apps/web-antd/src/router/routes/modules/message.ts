import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const messageRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      title: '消息',
      keepAlive: true,
      hideInMenu: true,
    },
    path: '/sys/message',
    name: 'SysMessage',
    children: [
      {
        meta: {
          title: '消息',
          keepAlive: true,
          hideInMenu: true,
          icon: 'lucide:bell',
        },
        path: '/sys/message/:key',
        name: 'SysMessageIndex',
        component: () => import('#/views/sys/message/index.vue'),
      },
    ],
  },
];

export default messageRoutes;
