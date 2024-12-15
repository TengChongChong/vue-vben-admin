import type { RouteRecordRaw } from 'vue-router';

const mailRoutes: RouteRecordRaw[] = [
  {
    meta: {
      title: '邮箱验证',
      ignoreAccess: true,
    },
    name: 'AuthPersonalMailVerifies',
    path: '/auth/personal/mail-verifies/:code',
    component: () => import('#/views/auth/personal/mail-verifies.vue'),
  },
];

export default mailRoutes;
