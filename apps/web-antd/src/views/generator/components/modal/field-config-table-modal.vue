<script lang="ts" setup>
import type { SelectModel, TableField } from '#/api';
import type {
  FieldConfigColumn,
  FieldConfigTableModalData,
} from '../../types/modal-columns';

import { computed, ref, unref } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import {
  Button,
  Checkbox,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
} from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';

import { ButtonClose, ButtonSave } from '#/components/button';
import { DictSelect } from '#/components/dict';

import ComponentSelect from '../form/component-select.vue';
import FieldMetaPopover from './field-meta-popover.vue';

const emit = defineEmits(['updateConfig']);

const dictTypeOptions = ref<SelectModel[]>([]);
const columns = ref<FieldConfigColumn[]>([]);
const configData = ref<Record<string, unknown>[]>([]);
const modalTitle = ref('字段配置');
const searchKeyword = ref('');

const filteredConfigData = computed(() => {
  const keyword = searchKeyword.value.trim().toLowerCase();
  if (!keyword) {
    return configData.value;
  }
  return configData.value.filter((item) => {
    const propertyName = String(item.propertyName ?? '').toLowerCase();
    const comment = String(item.comment ?? '').toLowerCase();
    const label = String(item.label ?? item.title ?? '').toLowerCase();
    return (
      propertyName.includes(keyword) ||
      comment.includes(keyword) ||
      label.includes(keyword)
    );
  });
});

const hasEnableColumn = computed(() =>
  columns.value.some((col) => col.dataIndex === 'isEnable'),
);

function setAllEnable(checked: boolean) {
  configData.value.forEach((item) => {
    item.isEnable = checked;
  });
}

async function handleSave() {
  emit('updateConfig', unref(configData));
  modalApi.close();
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      const data = modalApi.getData<FieldConfigTableModalData>();
      columns.value = data.columns;
      configData.value = cloneDeep(data.config);
      modalTitle.value = data.title;
      dictTypeOptions.value = data.dictTypeOptions ?? [];
      searchKeyword.value = '';
    }
  },
});
</script>

<template>
  <Modal class="w-[1200px]" :title="modalTitle">
    <div class="mb-4 flex items-center justify-between gap-4">
      <Input
        v-model:value="searchKeyword"
        allow-clear
        placeholder="搜索字段名 / 注释 / 标题"
        style="width: 320px"
      />
      <Space v-if="hasEnableColumn">
        <Button size="small" @click="setAllEnable(true)">全选</Button>
        <Button size="small" @click="setAllEnable(false)">全不选</Button>
      </Space>
    </div>
    <Table
      :columns="columns"
      :data-source="filteredConfigData"
      :pagination="false"
      :scroll="{ y: 480 }"
      row-key="propertyName"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'isEnable'">
          <Checkbox v-model:checked="record.isEnable" />
        </template>
        <template v-if="column.dataIndex === 'required'">
          <Checkbox v-model:checked="record.required" />
        </template>
        <template v-if="column.dataIndex === 'name'">
          <FieldMetaPopover :field="record as TableField" />
        </template>
        <template v-if="column.dataIndex === 'label'">
          <Input v-model:value="record.label" />
        </template>
        <template v-if="column.dataIndex === 'title'">
          <Input v-model:value="record.title" />
        </template>
        <template v-if="column.dataIndex === 'componentType'">
          <ComponentSelect v-model:value="record.componentType" />
        </template>
        <template v-if="column.dataIndex === 'dictType'">
          <Select
            v-model:value="record.dictType"
            :options="dictTypeOptions"
            option-filter-prop="label"
            show-search
            style="width: 260px"
          />
        </template>
        <template v-if="column.dataIndex === 'col'">
          <Input v-model:value="record.col" />
        </template>
        <template v-if="column.dataIndex === 'matchingMode'">
          <DictSelect
            v-model:value="record.matchingMode"
            dict-type="matchingMode"
          />
        </template>
        <template v-if="column.dataIndex === 'width'">
          <InputNumber v-model:value="record.width" />
        </template>
      </template>
    </Table>

    <template #footer>
      <Space>
        <ButtonClose @click="modalApi.close()" />
        <ButtonSave @click="handleSave" />
      </Space>
    </template>
  </Modal>
</template>
