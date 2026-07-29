import { ref } from 'vue';

import { selectUnreadCountApi } from '#/api';

export function useMessageUnreadCount() {
  const unreadCount = ref(0);
  const loading = ref(false);

  async function refreshUnreadCount() {
    loading.value = true;
    try {
      unreadCount.value = (await selectUnreadCountApi()) ?? 0;
    } catch (error) {
      console.error('获取未读消息数量失败', error);
    } finally {
      loading.value = false;
    }
  }

  return {
    loading,
    refreshUnreadCount,
    unreadCount,
  };
}
