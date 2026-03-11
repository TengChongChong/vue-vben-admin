<script lang="ts" setup>
import type {
  WorkbenchProjectItem,
  WorkbenchQuickNavItem,
  WorkbenchTodoItem,
} from '@vben/common-ui';

import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

import { WorkbenchProject, WorkbenchTodo } from '@vben/common-ui';
import { preferences } from '@vben/preferences';
import { useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import QuickNav from '#/views/dashboard/workspace/components/quick-nav.vue';
import ReceiveList from '#/views/sys/message/components/receive-list.vue';

import WorkbenchHeader from './components/workbench-header.vue';

const userStore = useUserStore();

// 这是一个示例数据，实际项目中需要根据实际情况进行调整
// url 也可以是内部路由，在 navTo 方法中识别处理，进行内部跳转
// 例如：url: /dashboard/workspace
const projectItems: WorkbenchProjectItem[] = [
  {
    color: '',
    content: '不要等待机会，而要创造机会。',
    date: '2021-04-01',
    group: '开源组',
    icon: 'carbon:logo-github',
    title: 'Github',
    url: 'https://github.com',
  },
  {
    color: '#3fb27f',
    content: '现在的你决定将来的你。',
    date: '2021-04-01',
    group: '算法组',
    icon: 'ion:logo-vue',
    title: 'Vue',
    url: 'https://vuejs.org',
  },
  {
    color: '#e18525',
    content: '没有什么才能比努力更重要。',
    date: '2021-04-01',
    group: '上班摸鱼',
    icon: 'ion:logo-html5',
    title: 'Html5',
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML',
  },
  {
    color: '#bf0c2c',
    content: '热情和欲望可以突破一切难关。',
    date: '2021-04-01',
    group: 'UI',
    icon: 'ion:logo-angular',
    title: 'Angular',
    url: 'https://angular.io',
  },
  {
    color: '#00d8ff',
    content: '健康的身体是实现目标的基石。',
    date: '2021-04-01',
    group: '技术牛',
    icon: 'bx:bxl-react',
    title: 'React',
    url: 'https://reactjs.org',
  },
  {
    color: '#EBD94E',
    content: '路是走出来的，而不是空想出来的。',
    date: '2021-04-01',
    group: '架构组',
    icon: 'ion:logo-javascript',
    title: 'Js',
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript',
  },
];

const todoItems = ref<WorkbenchTodoItem[]>([
  {
    completed: false,
    content: `审查最近提交到Git仓库的前端代码，确保代码质量和规范。`,
    date: '2024-07-30 11:00:00',
    title: '审查前端代码提交',
  },
  {
    completed: true,
    content: `检查并优化系统性能，降低CPU使用率。`,
    date: '2024-07-30 11:00:00',
    title: '系统性能优化',
  },
  {
    completed: false,
    content: `进行系统安全检查，确保没有安全漏洞或未授权的访问。 `,
    date: '2024-07-30 11:00:00',
    title: '安全检查',
  },
  {
    completed: false,
    content: `更新项目中的所有npm依赖包，确保使用最新版本。`,
    date: '2024-07-30 11:00:00',
    title: '更新项目依赖',
  },
  {
    completed: false,
    content: `修复用户报告的页面UI显示问题，确保在不同浏览器中显示一致。 `,
    date: '2024-07-30 11:00:00',
    title: '修复UI显示问题',
  },
]);

const router = useRouter();

// 这是一个示例方法，实际项目中需要根据实际情况进行调整
// This is a sample method, adjust according to the actual project requirements
function navTo(nav: WorkbenchProjectItem | WorkbenchQuickNavItem) {
  if (nav.url?.startsWith('http')) {
    openWindow(nav.url);
    return;
  }
  if (nav.url?.startsWith('/')) {
    router.push(nav.url).catch((error) => {
      console.error('Navigation failed:', error);
    });
  } else {
    console.warn(`Unknown URL for navigation item: ${nav.title} -> ${nav.url}`);
  }
}

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 9) {
    return '早上好';
  } else if (hour >= 9 && hour < 12) {
    return '上午好';
  } else if (hour >= 12 && hour < 14) {
    return '中午好';
  } else if (hour >= 14 && hour < 18) {
    return '下午好';
  } else if (hour >= 18 && hour < 22) {
    return '晚上好';
  } else {
    return '夜深了，注意休息';
  }
});
</script>

<template>
  <div class="p-5">
    <WorkbenchHeader
      :nickname="userStore.userInfo?.nickname"
      :avatar="userStore.userInfo?.avatar || preferences.app.defaultAvatar"
    >
      <template #title>
        {{ greeting }}, {{ userStore.userInfo?.nickname }}
      </template>
      <template #description> {{ userStore.userInfo?.dept?.name }} </template>
    </WorkbenchHeader>

    <div class="mt-5 flex flex-col lg:flex-row">
      <div class="w-full lg:w-2/5">
        <QuickNav class="mb-4" />
        <WorkbenchTodo :items="todoItems" class="mt-5" title="待办事项" />
      </div>
      <div class="ml-4 w-full lg:w-3/5">
        <WorkbenchProject :items="projectItems" title="项目" @click="navTo" />
        <div class="mt-4" style="height: 500px">
          <!-- 收信箱 -->
          <ReceiveList
            :show-query="false"
            title="未读消息"
            :params="{ detailsStatus: '0' }"
          />
        </div>
      </div>
    </div>
  </div>
</template>
