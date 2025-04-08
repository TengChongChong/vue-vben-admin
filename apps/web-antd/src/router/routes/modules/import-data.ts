import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '#/layouts';

const sysImportRoutes: RouteRecordRaw[] = [
  {
    path: '/sys/import',
    name: 'SysImport',
    component: BasicLayout,
    meta: {
      title: '导入',
      keepAlive: true,
      hideInMenu: true,
    },
    children: [
      {
        path: '/sys/import/excel/data/view/:importCode',
        name: 'SysImportExcelDataIndex',
        component: () => import('#/views/sys/import/excel/data/index.vue'),
        meta: {
          title: '导入数据',
        },
      },
    ],
  },
];

export default sysImportRoutes;
