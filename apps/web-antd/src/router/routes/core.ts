import type { RouteRecordRaw } from 'vue-router';

import { DEFAULT_HOME_PATH } from '@vben/constants';

import { AuthPageLayout } from '#/layouts';
import { $t } from '#/locales';

/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: () => import('#/views/fallback/not-found.vue'),
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: '404',
  },
  name: 'FallbackNotFound',
  path: '/:path(.*)*',
};

/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  {
    meta: {
      title: 'Root',
    },
    name: 'Root',
    path: '/',
    redirect: DEFAULT_HOME_PATH,
  },
  {
    component: AuthPageLayout,
    meta: {
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('#/views/auth/login/login.vue'),
        meta: {
          title: $t('page.core.login'),
        },
      },
      {
        name: 'CodeLogin',
        path: 'code-login',
        component: () => import('#/views/auth/login/code-login.vue'),
        meta: {
          title: $t('page.core.codeLogin'),
        },
      },
      {
        name: 'QrCodeLogin',
        path: 'qrcode-login',
        component: () => import('#/views/auth/login/qrcode-login.vue'),
        meta: {
          title: $t('page.core.qrcodeLogin'),
        },
      },
      {
        name: 'ForgetPassword',
        path: 'forget-password',
        component: () => import('#/views/auth/forget/forget-password.vue'),
        meta: {
          title: $t('page.core.forgetPassword'),
        },
      },
      {
        name: 'Register',
        path: 'register',
        component: () => import('#/views/auth/register/register.vue'),
        meta: {
          title: $t('page.core.register'),
        },
      },
    ],
  },
];

export { coreRoutes, fallbackNotFoundRoute };
