<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';
import type { TimeoutHandle } from '@vben/types';

import type { SysMessage } from '#/api';

import { computed, onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationLoginExpiredModal, useVbenModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { useWatermark } from '@vben/hooks';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences, usePreferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { formatToNow, openWindow } from '@vben/utils';

import {
  getSysConfigByKeyApi,
  infoApi,
  selectReceiveApi,
  setReadApi,
} from '#/api';
import {
  BookOpenText,
  CircleHelp,
  LucideUserRound,
  SvgGithubIcon,
} from '#/components/icons';
import { $t } from '#/locales';
import { useAuthStore, useDictStore } from '#/store';
import LoginForm from '#/views/_core/authentication/login.vue';
import { SysMessageDetailsStatus } from '#/views/sys/message/components/data';
import MessageInfoModal from '#/views/sys/message/components/info-modal.vue';

const notifications = ref<NotificationItem[]>([]);

const router = useRouter();
const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const dictStore = useDictStore();

const { destroyWatermark, updateWatermark } = useWatermark();
const { isDark } = usePreferences();

// 消息检查定时任务间隔时间
let timeStamp: null | number = null;
// 消息检查定时任务
let messageCheckTimeout: null | TimeoutHandle = null;

const [BaseMessageInfoModal, baseMessageInfoModalApi] = useVbenModal({
  connectedComponent: MessageInfoModal,
});

const showDot = computed(() =>
  notifications.value.some((item) => !item.isRead),
);

dictStore.initDict(true);

const menus = computed(() => [
  {
    handler: () => {
      router.push({ name: 'Profile' });
    },
    icon: 'lucide:user',
    text: $t('page.auth.profile'),
  },
  {
    handler: () => {
      openWindow(VBEN_DOC_URL, {
        target: '_blank',
      });
    },
    icon: BookOpenText,
    text: $t('ui.widgets.document'),
  },
  {
    handler: () => {
      openWindow(VBEN_GITHUB_URL, {
        target: '_blank',
      });
    },
    icon: SvgGithubIcon,
    text: 'GitHub',
  },
  {
    handler: () => {
      openWindow(`${VBEN_GITHUB_URL}/issues`, {
        target: '_blank',
      });
    },
    icon: CircleHelp,
    text: $t('ui.widgets.qa'),
  },
  {
    handler: () => {
      router.push('/auth/personal/index');
    },
    icon: LucideUserRound,
    text: '个人中心',
  },
]);

const avatar = computed(() => {
  return userStore.userInfo?.avatar ?? preferences.app.defaultAvatar;
});

async function handleLogout() {
  await authStore.logout(false);
}

/**
 * 加载未读消息
 */
function loadNotification() {
  selectReceiveApi(
    {
      detailsStatus: SysMessageDetailsStatus.RECEIVE_STATUS_UNREAD,
    },
    { pageSize: 10 },
  ).then((res) => {
    notifications.value = res.records.map((item: SysMessage) => {
      const { id, messageId, avatar, title, detailsStatus } = item;

      return {
        id,
        messageId,
        avatar,
        title,
        date: formatToNow(item.sendDate),
        isRead:
          detailsStatus === SysMessageDetailsStatus.RECEIVE_STATUS_ALREADY_READ,
      };
    });
  });
}

function refreshMessage() {
  loadNotification();
}

function refreshData() {
  if (timeStamp) {
    messageCheckTimeout = setTimeout(() => {
      if (checkAuth()) {
        refreshMessage();
      }
    }, timeStamp);
  }
}

/**
 * 检查是否已登录
 */
function checkAuth() {
  if (accessStore.accessToken) {
    return true;
  } else {
    if (messageCheckTimeout) {
      clearTimeout(messageCheckTimeout);
    }
    return false;
  }
}

/**
 * 消息全部标记为已读
 */
function handleMakeAllAsRead() {
  setReadApi().then(() => {
    refreshMessage();
  });
}

const handleClick = (item: NotificationItem) => {
  // 如果通知项有链接，点击时跳转
  if (item.link) {
    navigateTo(item.link, item.query, item.state);
  }
};

function navigateTo(
  link: string,
  query?: Record<string, any>,
  state?: Record<string, any>,
) {
  if (link.startsWith('http://') || link.startsWith('https://')) {
    // 外部链接，在新标签页打开
    window.open(link, '_blank');
  } else {
    // 内部路由链接，支持 query 参数和 state
    router.push({
      path: link,
      query: query || {},
      state,
    });
  }
}

/**
 * 查看所有消息
 */
function handleViewAll() {
  router.push(`/sys/message/receive`);
}

/**
 * 查看消息详情
 */
function handleReadNotification(notification: NotificationItem) {
  infoApi(notification.id, notification.messageId).then((res) => {
    // 未读消息，更新列表页消息状态
    refreshMessage();
    baseMessageInfoModalApi.setData(res);
    baseMessageInfoModalApi.open();
  });
}

watch(
  () => ({
    enable: preferences.app.watermark,
    content: preferences.app.watermarkContent,
    isDark: isDark.value,
  }),
  async ({ enable, content, isDark: isDarkValue }) => {
    if (enable) {
      const watermarkColor = isDarkValue
        ? 'rgba(255, 255, 255, 0.12)'
        : 'rgba(0, 0, 0, 0.12)';

      await updateWatermark({
        advancedStyle: {
          colorStops: [
            {
              color: watermarkColor,
              offset: 0,
            },
            {
              color: watermarkColor,
              offset: 1,
            },
          ],
          type: 'linear',
        },
        content:
          content ||
          `${userStore.userInfo?.username} - ${userStore.userInfo?.nickname}`,
      });
    } else {
      destroyWatermark();
    }
  },
  {
    immediate: true,
  },
);

onMounted(async () => {
  // 立即加载消息
  refreshMessage();

  if (timeStamp === null) {
    try {
      // 获取后台配置的 新消息检查间隔时长
      await getSysConfigByKeyApi('messageCheckInterval').then((res) => {
        timeStamp = Number(res.value) * 1000;
      });
    } catch {
      timeStamp = 1000 * 60 * 5;
    } finally {
      if (messageCheckTimeout === null) {
        refreshData();
      }
    }
  }
});
</script>

<template>
  <BasicLayout @clear-preferences-and-logout="handleLogout">
    <template #user-dropdown>
      <UserDropdown
        :avatar
        :description="userStore.userInfo?.dept?.name"
        :menus="menus"
        :text="userStore.userInfo?.nickname"
        @logout="handleLogout"
        @clear-preferences-and-logout="handleLogout"
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @make-all="handleMakeAllAsRead"
        @read="handleReadNotification"
        @view-all="handleViewAll"
        @clear="handleNoticeClear"
        @remove="(item) => item.id && remove(item.id)"
        @on-click="handleClick"
      />
    </template>
    <template #extra>
      <AuthenticationLoginExpiredModal
        v-model:open="accessStore.loginExpired"
        :avatar
      >
        <LoginForm />
      </AuthenticationLoginExpiredModal>
    </template>
    <template #lock-screen>
      <LockScreen :avatar @to-login="handleLogout" />
    </template>
  </BasicLayout>
  <BaseMessageInfoModal />
</template>
