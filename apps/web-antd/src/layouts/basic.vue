<script lang="ts" setup>
import type { NotificationItem } from '@vben/layouts';
import type { TimeoutHandle } from '@vben/types';

import type { SysMessage } from '#/api/sys/model/sys-message-model';

import { computed, onMounted, ref, watch } from 'vue';

import { AuthenticationLoginExpiredModal, useVbenModal } from '@vben/common-ui';
import { VBEN_DOC_URL, VBEN_GITHUB_URL } from '@vben/constants';
import { useWatermark } from '@vben/hooks';
import {
  BasicLayout,
  LockScreen,
  Notification,
  UserDropdown,
} from '@vben/layouts';
import { preferences } from '@vben/preferences';
import { useAccessStore, useUserStore } from '@vben/stores';
import { openWindow } from '@vben/utils';

import { getByKeyApi } from '#/api/sys/sys-config';
import { infoApi, selectReceiveApi } from '#/api/sys/sys-message';
import { setReadApi } from '#/api/sys/sys-message-detail';
import {
  BookOpenText,
  CircleHelp,
  LucideUserRound,
  SvgGithubIcon,
} from '#/components/icons';
import { $t } from '#/locales';
import { router } from '#/router';
import { useAuthStore, useDictStore } from '#/store';
import { formatToNow } from '#/util/date';
import LoginForm from '#/views/_core/authentication/login.vue';
import { SysMessageDetailsStatus } from '#/views/sys/message/components/data';
import MessageInfoModal from '#/views/sys/message/components/info-modal.vue';

const notifications = ref<NotificationItem[]>([]);

const userStore = useUserStore();
const authStore = useAuthStore();
const accessStore = useAccessStore();
const dictStore = useDictStore();

const { destroyWatermark, updateWatermark } = useWatermark();

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
  }),
  async ({ enable, content }) => {
    if (enable) {
      await updateWatermark({
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
      await getByKeyApi('messageCheckInterval').then((res) => {
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
      />
    </template>
    <template #notification>
      <Notification
        :dot="showDot"
        :notifications="notifications"
        @make-all="handleMakeAllAsRead"
        @read="handleReadNotification"
        @view-all="handleViewAll"
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
