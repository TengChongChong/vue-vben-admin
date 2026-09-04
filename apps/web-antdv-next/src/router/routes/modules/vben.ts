import type { RouteRecordRaw } from 'vue-router';

import {
  VBEN_ANTDV_NEXT_PREVIEW_URL,
  VBEN_DOC_URL,
  VBEN_GITHUB_URL,
  VBEN_LOGO_URL,
  VBEN_TD_PREVIEW_URL,
} from '@vben/constants';

import { IFrameView } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      badgeType: 'dot',
      icon: VBEN_LOGO_URL,
      order: 9998,
      title: $t('demos.vben.title'),
    },
    name: 'VbenProject',
    path: '/vben-admin',
    children: [
      {
        name: 'VbenDocument',
        path: 'document',
        component: IFrameView,
        meta: {
          icon: 'ph:book-open-text',
          link: VBEN_DOC_URL,
          title: $t('demos.vben.document'),
        },
      },
      {
        name: 'VbenGithub',
        path: 'github',
        component: IFrameView,
        meta: {
          icon: 'ph:github-logo',
          link: VBEN_GITHUB_URL,
          title: 'Github',
        },
      },
      {
        name: 'VbenAntdVNext',
        path: 'antdv-next',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: 'svg:antdv-next',
          link: VBEN_ANTDV_NEXT_PREVIEW_URL,
          title: $t('demos.vben.antdv-next'),
        },
      },
      {
        name: 'VbenTDesign',
        path: 'tdesign',
        component: IFrameView,
        meta: {
          badgeType: 'dot',
          icon: 'ph:chat-teardrop-dots',
          link: VBEN_TD_PREVIEW_URL,
          title: $t('demos.vben.tdesign'),
        },
      },
    ],
  },
  {
    name: 'VbenAbout',
    path: '/vben-admin/about',
    component: () => import('#/views/_core/about/index.vue'),
    meta: {
      icon: 'ph:copyright',
      title: $t('demos.vben.about'),
      order: 9999,
    },
  },
  {
    name: 'Profile',
    path: '/profile',
    component: () => import('#/views/_core/profile/index.vue'),
    meta: {
      icon: 'ph:user',
      hideInMenu: true,
      title: $t('page.auth.profile'),
    },
  },
];

export default routes;
