<script lang="ts" setup>
import type { CmsRelease, CmsReleaseProgress, TreeNodeModel } from '#/api';
import type { CheckKeys, TreeItem } from '#/components/tree/src/types';

import { computed, ref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { listToTree } from '@vben/utils';

import { Modal as AModal, Col, Divider, message, Progress, Result, Row, Space, Steps } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';
import {
  cancelCmsReleaseApi,
  getCmsReleaseProgressApi,
  saveCmsReleaseApi,
  selectCmsReleaseAssetsApi,
  startCmsReleaseApi,
} from '#/api';
import { ButtonClose, ButtonSave } from '#/components/button';
import { BasicTree } from '#/components/tree';

import {
  COLUMN_FOLDER_ID,
  IGNORE_ASSET_IDS,
  PAGE_FOLDER_ID,
  SELECTABLE_FOLDER_IDS,
  SITE_ROOT_ID,
} from './data';

const emit = defineEmits(['success', 'viewQueue']);

const saveBtnLoading = ref(false);
const treeLoading = ref(false);
const cancelBtnLoading = ref(false);
const assetTree = ref<TreeItem[]>([]);
const assetMap = ref<Map<string, TreeNodeModel>>(new Map());
const checkedKeys = ref<CheckKeys>([]);
const currentStep = ref(0);
const releaseTask = ref<CmsRelease | null>(null);
const releaseProgress = ref<CmsReleaseProgress>({
  end: false,
  done: 0,
  fail: 0,
});
const pollingTimer = ref<null | ReturnType<typeof setInterval>>(null);

const [BaseForm, baseFormApi] = useVbenForm({
  showDefaultActions: false,
  schema: [
    {
      fieldName: 'releaseArticle',
      label: '发布文章',
      component: 'DictRadio',
      componentProps: {
        dictType: 'whether',
      },
      defaultValue: '1',
      rules: 'selectRequired',
      description: '勾选栏目时，是否一并发布栏目下已发布文章',
    },
  ],
});

const checkedCount = computed(() => {
  const { pageIds, columnIds } = buildReleasePayload();
  return pageIds.length + columnIds.length;
});

const releaseTotal = computed(() => Number(releaseTask.value?.total || 0));

const progressPercent = computed(() => {
  if (releaseTotal.value <= 0) {
    return 0;
  }
  return Math.min(
    100,
    Math.round(
      ((Number(releaseProgress.value.done || 0) +
        Number(releaseProgress.value.fail || 0)) /
        releaseTotal.value) *
        100,
    ),
  );
});

const isPublishing = computed(
  () => currentStep.value === 1 && !releaseProgress.value.end,
);

const resultStatus = computed(() => {
  if (releaseTask.value?.status === '-1') {
    return 'warning';
  }
  if (Number(releaseProgress.value.fail || 0) > 0) {
    return 'warning';
  }
  return 'success';
});

const resultTitle = computed(() => {
  if (releaseTask.value?.status === '-1') {
    return '发布已取消';
  }
  if (Number(releaseProgress.value.fail || 0) > 0) {
    return '发布完成（存在失败项）';
  }
  return '发布完成';
});

const resultSubTitle = computed(() => {
  const done = Number(releaseProgress.value.done || 0);
  const fail = Number(releaseProgress.value.fail || 0);
  return `成功 ${done} 项，失败 ${fail} 项，共 ${releaseTotal.value} 项`;
});

const stepTwoCompleted = computed(
  () =>
    Number(releaseProgress.value.done || 0) +
    Number(releaseProgress.value.fail || 0),
);

function normalizeCheckedKeys(): string[] {
  const raw = checkedKeys.value;
  if (Array.isArray(raw)) {
    return raw.map(String);
  }
  if (raw && typeof raw === 'object' && Array.isArray(raw.checked)) {
    return raw.checked.map(String);
  }
  return [];
}

function isFolderSelected(keys: string[], folderId: string) {
  return keys.includes(folderId);
}

async function loadAssets() {
  treeLoading.value = true;
  try {
    const res = await selectCmsReleaseAssetsApi();
    const map = new Map<string, TreeNodeModel>();
    const nodes: TreeItem[] = [];
    (res ?? []).forEach((item) => {
      map.set(item.id, item);
      nodes.push({
        key: item.id,
        title: item.title ?? item.label,
        disableCheckbox:
          !item.type && !SELECTABLE_FOLDER_IDS.has(String(item.id)),
        parentId: item.parentId,
        id: item.id,
        type: item.type,
      } as TreeItem);
    });
    assetMap.value = map;
    assetTree.value = listToTree(nodes);
    checkedKeys.value = [];
  } finally {
    treeLoading.value = false;
  }
}

function stopPolling() {
  if (pollingTimer.value) {
    clearInterval(pollingTimer.value);
    pollingTimer.value = null;
  }
}

function resetReleaseState() {
  stopPolling();
  currentStep.value = 0;
  releaseTask.value = null;
  releaseProgress.value = {
    end: false,
    done: 0,
    fail: 0,
  };
}

function buildReleasePayload() {
  const keys = normalizeCheckedKeys();
  const pageIdSet = new Set<string>();
  const columnIdSet = new Set<string>();

  const selectAllPages =
    isFolderSelected(keys, SITE_ROOT_ID) ||
    isFolderSelected(keys, PAGE_FOLDER_ID);
  const selectAllColumns =
    isFolderSelected(keys, SITE_ROOT_ID) ||
    isFolderSelected(keys, COLUMN_FOLDER_ID);

  if (selectAllPages || selectAllColumns) {
    assetMap.value.forEach((node, id) => {
      if (IGNORE_ASSET_IDS.has(id) || !node.type) {
        return;
      }
      if (selectAllPages && node.type === 'page') {
        pageIdSet.add(id);
      }
      if (selectAllColumns && node.type === 'column') {
        columnIdSet.add(id);
      }
    });
  }

  keys.forEach((id) => {
    if (IGNORE_ASSET_IDS.has(id)) {
      return;
    }
    const node = assetMap.value.get(id);
    if (!node?.type) {
      return;
    }
    if (node.type === 'page') {
      pageIdSet.add(id);
    } else if (node.type === 'column') {
      columnIdSet.add(id);
    }
  });

  return {
    pageIds: [...pageIdSet],
    columnIds: [...columnIdSet],
  };
}

async function handleSave() {
  const { pageIds, columnIds } = buildReleasePayload();
  if (pageIds.length === 0 && columnIds.length === 0) {
    message.warning('请选择要发布的页面或栏目');
    return;
  }
  try {
    saveBtnLoading.value = true;
    const { valid } = await baseFormApi.validate();
    if (!valid) {
      return;
    }
    modalApi.lock();
    const values = await baseFormApi.getValues();
    const created = await saveCmsReleaseApi({
      pageIds: pageIds.join(','),
      columnIds: columnIds.join(','),
      releaseArticle: values.releaseArticle as string,
    } as any);
    releaseTask.value = created;
    await startCmsReleaseApi(created.id);
    message.success('发布已开始');
    currentStep.value = 1;
    await pollProgress();
    startPolling();
    emit('success');
  } catch (error) {
    console.error('创建发布任务失败', error);
  } finally {
    modalApi.unlock();
    saveBtnLoading.value = false;
  }
}

function startPolling() {
  stopPolling();
  pollingTimer.value = setInterval(() => {
    pollProgress();
  }, 2000);
}

async function pollProgress() {
  if (!releaseTask.value?.id) {
    return;
  }
  try {
    const progress = await getCmsReleaseProgressApi(releaseTask.value.id);
    releaseProgress.value = progress;
    if (progress.end) {
      stopPolling();
      currentStep.value = 2;
      emit('success');
    }
  } catch (error) {
    stopPolling();
    console.error('获取发布进度失败', error);
  }
}

async function handleCancelRelease() {
  if (!releaseTask.value?.id) {
    return;
  }
  AModal.confirm({
    title: '取消发布',
    content: '确定要取消当前发布任务吗？',
    onOk: async () => {
      const task = releaseTask.value;
      if (!task?.id) {
        return;
      }
      try {
        cancelBtnLoading.value = true;
        const progress = await cancelCmsReleaseApi(task.id);
        releaseTask.value = {
          ...task,
          status: '-1',
        };
        releaseProgress.value = progress;
        releaseProgress.value.end = true;
        stopPolling();
        currentStep.value = 2;
        emit('success');
        message.success('已取消发布');
      } finally {
        cancelBtnLoading.value = false;
      }
    },
  });
}

function handleViewQueue() {
  if (!releaseTask.value?.id) {
    return;
  }
  const parentId = releaseTask.value.id;
  modalApi.close();
  emit('viewQueue', parentId);
}

async function handleRetry() {
  resetReleaseState();
  await baseFormApi.resetForm();
  await baseFormApi.setValues({ releaseArticle: '1' });
  checkedKeys.value = [];
}

function handleClose() {
  if (!isPublishing.value) {
    modalApi.close();
    return;
  }
  AModal.confirm({
    title: '确认关闭',
    content: '发布仍在进行中，关闭窗口后可在列表继续查看进度，是否关闭？',
    onOk: () => {
      modalApi.close();
    },
  });
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      resetReleaseState();
      await baseFormApi.resetForm();
      await baseFormApi.setValues({ releaseArticle: '1' });
      await loadAssets();
    } else {
      stopPolling();
    }
  },
});
</script>

<template>
  <Modal class="w-[760px]" title="创建发布任务">
    <Steps
      :current="currentStep"
      :items="[
        { title: '选择资源' },
        { title: '发布进度' },
        { title: '发布结果' },
      ]" />

    <div
      class="min-h-[430px] rounded-lg border border-gray-100 bg-gray-50/40 p-4 mt-4">
      <template v-if="currentStep === 0">
        <BaseForm />
        <div
          class="mb-3 mt-3 rounded-md border border-blue-100 bg-blue-50 px-3 py-2 text-sm text-blue-700">
          已选择 {{ checkedCount }} 项资源，请确认后开始发布
        </div>
        <BasicTree
          v-model:value="checkedKeys"
          :height="330"
          :loading="treeLoading"
          :show-search="true"
          :show-toolbar="true"
          :tree-data="assetTree"
          checkable
          title="发布资源"
          :use-card="false" />
      </template>

      <template v-else-if="currentStep === 1">
        <div class="rounded-lg border border-blue-100 bg-white p-5">
          <div class="text-base font-medium text-gray-900">
            正在发布静态页面
          </div>
          <div class="mt-1 text-sm text-gray-500">
            正在生成并发布静态内容，请稍候，发布期间可随时取消。
          </div>
          <Progress
            class="mt-5"
            :percent="progressPercent"
            status="active"
            :stroke-width="12" />
          <Divider class="my-4" />
          <Row :gutter="12">
            <Col :span="8">
              <div
                class="rounded border border-gray-100 bg-gray-50 px-3 py-2 text-center">
                <div class="text-xs text-gray-500">总任务</div>
                <div class="text-lg font-medium text-gray-900">
                  {{ releaseTotal }}
                </div>
              </div>
            </Col>
            <Col :span="8">
              <div
                class="rounded border border-green-100 bg-green-50 px-3 py-2 text-center">
                <div class="text-xs text-green-700">已完成</div>
                <div class="text-lg font-medium text-green-700">
                  {{ stepTwoCompleted }}
                </div>
              </div>
            </Col>
            <Col :span="8">
              <div
                class="rounded border border-red-100 bg-red-50 px-3 py-2 text-center">
                <div class="text-xs text-red-600">失败</div>
                <div class="text-lg font-medium text-red-600">
                  {{ releaseProgress.fail || 0 }}
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </template>

      <template v-else>
        <div class="rounded-lg border border-gray-200 bg-white p-5">
          <Result
            :status="resultStatus"
            :title="resultTitle"
            :sub-title="resultSubTitle" />
        </div>
      </template>
    </div>
    <template #footer>
      <Space v-if="currentStep === 0" class="w-full justify-end">
        <ButtonClose text="关闭" @click="handleClose" />
        <ButtonSave
          :auth-codes="['cms:release']"
          :loading="saveBtnLoading"
          text="开始发布"
          @click="handleSave" />
      </Space>
      <Space v-else-if="currentStep === 1" class="w-full justify-end">
        <ButtonClose text="关闭" @click="handleClose" />
        <ButtonSave
          :auth-codes="['cms:release']"
          :loading="cancelBtnLoading"
          text="取消发布"
          @click="handleCancelRelease" />
      </Space>
      <Space v-else class="w-full justify-end">
        <ButtonClose text="关闭" @click="modalApi.close()" />
        <ButtonSave
          :auth-codes="['cms:release']"
          text="查看队列"
          @click="handleViewQueue" />
        <ButtonSave
          :auth-codes="['cms:release']"
          text="再发一次"
          @click="handleRetry" />
      </Space>
    </template>
  </Modal>
</template>
