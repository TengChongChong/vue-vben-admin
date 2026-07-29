<script lang="ts" setup>
import type { CmsResource } from '#/api';

import { ref } from 'vue';

import { AccessControl } from '@vben/access';
import { useVbenDrawer } from '@vben/common-ui';
import { formatSize, formatToDateTime } from '@vben/utils';

import { Button, message, Space, Spin } from 'antdv-next';

import {
  getCmsResourceApi,
  getCmsResourceDownloadIdApi,
  removeCmsResourceApi,
} from '#/api';
import { ButtonRemove } from '#/components/button';
import { LucideFile } from '#/components/icons';
import { downloadFileById } from '#/util/download';

import {
  getDisplayName,
  getSourceLabel,
  isAudio,
  isImage,
  isVideo,
} from './data';

const emit = defineEmits<{ success: [] }>();

const loading = ref(false);
const previewItem = ref<CmsResource | null>(null);

async function handleCopyUrl() {
  const item = previewItem.value;
  if (!item?.url) {
    message.warning('暂无可用链接');
    return;
  }
  try {
    await navigator.clipboard.writeText(item.url);
    message.success('链接已复制');
  } catch {
    message.error('复制失败，请手动复制');
  }
}

async function handleDownload() {
  const item = previewItem.value;
  if (!item?.id) {
    return;
  }
  const downloadId = await getCmsResourceDownloadIdApi(item.id);
  downloadFileById(downloadId);
}

function handleRemoveSuccess() {
  drawerApi.close();
  emit('success');
}

const [Drawer, drawerApi] = useVbenDrawer({
  onOpenChange: async (isOpen: boolean) => {
    if (!isOpen) {
      previewItem.value = null;
      return;
    }
    const data = drawerApi.getData<CmsResource>();
    previewItem.value = data;
    if (!data?.id) {
      return;
    }
    loading.value = true;
    try {
      previewItem.value = await getCmsResourceApi(data.id);
    } catch {
      previewItem.value = data;
    } finally {
      loading.value = false;
    }
  },
});
</script>

<template>
  <Drawer class="w-[720px]" title="资源预览">
    <Spin :spinning="loading">
      <div v-if="previewItem" class="space-y-4">
        <div
          class="flex min-h-48 items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-4">
          <img
            v-if="isImage(previewItem) && previewItem.url"
            :alt="getDisplayName(previewItem)"
            class="max-h-[420px] max-w-full object-contain"
            :src="previewItem.url" />
          <video
            v-else-if="isVideo(previewItem) && previewItem.url"
            class="max-h-[420px] w-full"
            controls
            :src="previewItem.url"></video>
          <audio
            v-else-if="isAudio(previewItem) && previewItem.url"
            class="w-full"
            controls
            :src="previewItem.url"></audio>
          <div v-else class="text-center text-gray-500">
            <LucideFile class="mx-auto mb-2 size-12" />
            <div>该类型暂不支持在线预览，请下载查看</div>
          </div>
        </div>

        <div class="grid grid-cols-1 gap-2 text-sm md:grid-cols-2">
          <div>
            <span class="text-gray-400">文件名：</span>
            {{ getDisplayName(previewItem) }}
          </div>
          <div>
            <span class="text-gray-400">来源：</span>
            {{ getSourceLabel(previewItem.objectType) }}
          </div>
          <div>
            <span class="text-gray-400">大小：</span>
            {{
              previewItem.size == null ? '-' : formatSize(previewItem.size)
            }}
          </div>
          <div>
            <span class="text-gray-400">扩展名：</span>
            {{ previewItem.ext || '-' }}
          </div>
          <div>
            <span class="text-gray-400">类型：</span>
            {{ previewItem.contentType || '-' }}
          </div>
          <div>
            <span class="text-gray-400">上传时间：</span>
            {{
              previewItem.createDate
                ? formatToDateTime(previewItem.createDate)
                : '-'
            }}
          </div>
          <div class="md:col-span-2">
            <span class="text-gray-400">链接：</span>
            <a
              class="break-all"
              :href="previewItem.url"
              rel="noopener noreferrer"
              target="_blank">
              {{ previewItem.url || '-' }}
            </a>
          </div>
        </div>
      </div>
    </Spin>
    <template #footer>
      <Space>
        <AccessControl :codes="['cms:media:select']">
          <Button @click="handleCopyUrl">复制链接</Button>
        </AccessControl>
        <AccessControl :codes="['cms:media:select']">
          <Button type="primary" @click="handleDownload">下载</Button>
        </AccessControl>
        <ButtonRemove
          v-if="previewItem?.id"
          :api="removeCmsResourceApi"
          :auth-codes="['cms:media:remove']"
          :ids="[previewItem.id]"
          @success="handleRemoveSuccess" />
      </Space>
    </template>
  </Drawer>
</template>
