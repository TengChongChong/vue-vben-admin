<script lang="ts" setup>
import type { SelectModel } from '#/api/base/model/select-model';
import type {
  FieldConfig,
  TableField,
} from '#/api/generator/model/generatorModel';

import { selectAllApi } from '#/api/sys/sys-dict-type';
import { ButtonClose, ButtonSave } from '#/components/button';
import { useVbenModal } from '@vben/common-ui';
import {
  Checkbox,
  Input,
  InputNumber,
  Popover,
  Select,
  Space,
  Table,
  TypographyLink,
} from 'ant-design-vue';
import { cloneDeep } from 'lodash-es';
import { onMounted, ref, unref } from 'vue';

const emit = defineEmits(['updateConfig']);

const dictTypeArray = ref<SelectModel[]>([]);
const fields = ref<TableField[]>([]);
const tableConfig = ref<FieldConfig[]>([]);
const columns = [
  {
    title: '显示',
    dataIndex: 'isEnable',
    width: 80,
  },
  {
    title: '字段',
    dataIndex: 'name',
    width: 160,
  },
  {
    title: '标题',
    dataIndex: 'title',
    width: 160,
  },
  {
    title: '字典类型',
    dataIndex: 'dictType',
    width: 320,
  },
  {
    title: '宽度',
    dataIndex: 'width',
    width: 120,
  },
];

onMounted(() => {
  selectAllApi().then((res) => {
    dictTypeArray.value = res;
  });
});

async function handleSave() {
  emit('updateConfig', unref(tableConfig));
  modalApi.close();
}

const [Modal, modalApi] = useVbenModal({
  onOpenChange: async (isOpen: boolean) => {
    if (isOpen) {
      // 打开时根据id获取详情
      const { tableInfo, config } = modalApi.getData<Record<string, any>>();
      fields.value = tableInfo.fields;
      tableConfig.value = cloneDeep(config);
    }
  },
});
</script>
<template>
  <Modal class="w-[1200px]" title="表格配置">
    <Table
      :columns="columns"
      :data-source="tableConfig"
      :pagination="false"
      size="small"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'isEnable'">
          <Checkbox v-model:checked="record.isEnable" />
        </template>
        <template v-if="column.dataIndex === 'name'">
          <Popover>
            <template #content>
              <div>列名：{{ record.name }}</div>
              <div>
                类型：{{ record.metaInfo.jdbcType?.toLowerCase() }}
                {{
                  record.metaInfo.length > 0
                    ? `(${record.metaInfo.length})`
                    : ''
                }}
              </div>
              <div>属性：{{ record.propertyName }}</div>
              <div>注释：{{ record.comment ? record.comment : '-' }}</div>
            </template>
            <TypographyLink>{{ record.propertyName }}</TypographyLink>
          </Popover>
        </template>
        <template v-if="column.dataIndex === 'title'">
          <Input v-model:value="record.title" />
        </template>
        <template v-if="column.dataIndex === 'dictType'">
          <Select
            v-model:value="record.dictType"
            :options="dictTypeArray"
            option-filter-prop="label"
            show-search
            style="width: 260px"
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
