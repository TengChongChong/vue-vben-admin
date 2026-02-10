<script lang="ts" setup>
import type { SysImportExcelTemplateDetail } from '#/api';

import { nextTick, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';
import { useSortable } from '@vben/hooks';

import { Alert } from 'ant-design-vue';

import { ButtonClose, ButtonSave } from '#/components/button';
import { isNullOrUnDef } from '#/util/is';

const emit = defineEmits(['success']);

const orderFields = ref();

const saveBtnLoading = ref(false);

const sysImportExcelTemplateDetailList = ref<SysImportExcelTemplateDetail[]>(
  [],
);

const [Modal, modalApi] = useVbenModal({
  onOpened: async () => {
    sysImportExcelTemplateDetailList.value = modalApi.getData();
    if (
      !sysImportExcelTemplateDetailList.value ||
      sysImportExcelTemplateDetailList.value.length === 0
    ) {
      return;
    }
    await initSortable();
  },
});

async function initSortable() {
  await nextTick();
  const el = document.querySelectorAll(`.order-fields`)?.[0];

  const { initializeSortable } = useSortable(el, {
    onEnd: (evt) => {
      const { oldIndex, newIndex } = evt;

      if (
        isNullOrUnDef(oldIndex) ||
        isNullOrUnDef(newIndex) ||
        oldIndex === newIndex
      ) {
        return;
      }
      const currentTab = sysImportExcelTemplateDetailList.value[oldIndex];
      sysImportExcelTemplateDetailList.value.splice(oldIndex, 1);
      sysImportExcelTemplateDetailList.value.splice(newIndex, 0, currentTab);
    },
  });

  await initializeSortable();
}

function handleSave() {
  emit('success', unref(sysImportExcelTemplateDetailList));
  modalApi.close();
}
</script>
<template>
  <Modal class="w-[600px]" title="字段排序">
    <Alert banner message="拖动改变字段顺序" type="info" />

    <div ref="orderFields" class="order-fields">
      <div
        v-for="item in sysImportExcelTemplateDetailList"
        :key="item.fieldName"
        class="order-field"
      >
        <div>
          {{ item.fieldName }}
        </div>
      </div>
    </div>

    <template #footer>
      <ButtonClose @click="modalApi.close()" />
      <ButtonSave :loading="saveBtnLoading" @click="handleSave" />
    </template>
  </Modal>
</template>
<style lang="scss" scoped>
.order-fields {
  position: relative;
  margin: 0 -0.5rem;

  .order-field {
    display: inline-block;
    padding: 0.5rem;

    > div {
      padding: 0.5rem 1rem;
      cursor: pointer;
      background-color: #fff;
      border: 1px dashed hsl(var(--primary));
      border-radius: var(--radius);
    }
  }
}
</style>
