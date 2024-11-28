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
import {
  BookOpenText,
  CircleHelp,
  MdiGithub,
  UserRound,
} from '#/components/icons';
import { $t } from '#/locales';
import { router } from '#/router';
import { useAuthStore, useDictStore } from '#/store';
import { formatToNow } from '#/util/date';
import LoginForm from '#/views/_core/authentication/login.vue';
import { SysMessageDetailsStatus } from '#/views/sys/message/components/data';
import MessageInfoModal from '#/views/sys/message/components/info-modal.vue';

const notifications = ref<NotificationItem[]>([
  {
    avatar: 'https://avatar.vercel.sh/vercel.svg?text=VB',
    date: '3小时前',
    isRead: true,
    message: '描述信息描述信息描述信息',
    title: '收到了 14 份新周报',
  },
  {
    avatar: 'https://avatar.vercel.sh/1',
    date: '刚刚',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '朱偏右 回复了你',
  },
  {
    avatar: 'https://avatar.vercel.sh/1',
    date: '2024-01-01',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '曲丽丽 评论了你',
  },
  {
    avatar: 'https://avatar.vercel.sh/satori',
    date: '1天前',
    isRead: false,
    message: '描述信息描述信息描述信息',
    title: '代办提醒',
  },
]);

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
    icon: MdiGithub,
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
    icon: UserRound,
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

function handleNoticeClear() {
  notifications.value = [];
}

/**
 * 消息全部标记为已读
 */
function handleMakeAllAsRead() {
  notifications.value.forEach((item) => (item.isRead = true));
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
  () => preferences.app.watermark,
  async (enable) => {
    if (enable) {
      await updateWatermark({
        content: `${userStore.userInfo?.username}`,
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
        @clear="handleNoticeClear"
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
