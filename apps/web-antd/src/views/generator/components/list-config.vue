<script setup lang="ts">
import type {
  FieldConfig,
  SelectModel,
  TableCellConfig,
  WizardGeneratorConfig,
} from '#/api';

import { computed, ref, unref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Card, Space, Tooltip, TypographyText } from 'ant-design-vue';

import { DictTag } from '#/components/dict';
import { Divider } from '#/components/divider';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideMinus,
  LucideSettings,
} from '#/components/icons';

import { useFieldConfigSortable } from '../composables/use-field-config-sortable';
import {
  QUERY_CONFIG_COLUMNS,
  TABLE_CONFIG_COLUMNS,
} from '../types/modal-columns';
import FieldConfigEmpty from './field-config-empty.vue';
import HiddenFieldsPanel from './hidden-fields-panel.vue';
import FieldConfigTableModal from './modal/field-config-table-modal.vue';
import FieldMetaPopover from './modal/field-meta-popover.vue';

const props = defineProps<{
  dictTypeOptions: SelectModel[];
  generatorConfig: WizardGeneratorConfig;
}>();

const emit = defineEmits(['next', 'prev', 'updateConfig']);

const queryConfig = ref<FieldConfig[]>([]);
const tableConfig = ref<TableCellConfig[]>([]);

const enabledQueryConfig = computed(() =>
  queryConfig.value.filter((item) => item.isEnable),
);
const enabledTableConfig = computed(() =>
  tableConfig.value.filter((item) => item.isEnable),
);
const hiddenQueryConfig = computed(() =>
  queryConfig.value.filter((item) => !item.isEnable),
);
const hiddenTableConfig = computed(() =>
  tableConfig.value.filter((item) => !item.isEnable),
);

const [BaseQueryConfigModal, queryConfigModalApi] = useVbenModal({
  connectedComponent: FieldConfigTableModal,
});

const [BaseTableConfigModal, tableConfigModalApi] = useVbenModal({
  connectedComponent: FieldConfigTableModal,
});

useFieldConfigSortable('config-items-query', queryConfig);
useFieldConfigSortable('config-items-table', tableConfig);

watch(
  () => props.generatorConfig,
  () => {
    initData();
  },
  { deep: true, immediate: true },
);

function initData() {
  queryConfig.value = props.generatorConfig?.queryConfig || [];
  tableConfig.value = props.generatorConfig?.tableConfig || [];
}

function openQueryConfigModal() {
  queryConfigModalApi.setData({
    title: '查询条件配置',
    columns: QUERY_CONFIG_COLUMNS,
    config: unref(queryConfig),
    dictTypeOptions: props.dictTypeOptions,
  });
  queryConfigModalApi.open();
}

function openTableConfigModal() {
  tableConfigModalApi.setData({
    title: '表格配置',
    columns: TABLE_CONFIG_COLUMNS,
    config: unref(tableConfig),
    dictTypeOptions: props.dictTypeOptions,
  });
  tableConfigModalApi.open();
}

function updateQueryConfig(config: FieldConfig[]) {
  queryConfig.value = config;
}

function updateTableConfig(config: TableCellConfig[]) {
  tableConfig.value = config;
}

function hideQueryConfig(propertyName: string) {
  queryConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
    }
  });
}

function hideTableConfig(propertyName: string) {
  tableConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
    }
  });
}

function restoreQueryConfig(propertyName: string) {
  queryConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = true;
    }
  });
}

function restoreTableConfig(propertyName: string) {
  tableConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = true;
    }
  });
}

function handleStepPrev() {
  emit('prev');
}

function handleStepNext() {
  emit('updateConfig', 'queryConfig', unref(queryConfig));
  emit('updateConfig', 'tableConfig', unref(tableConfig));
  emit('next');
}
</script>

<template>
  <div class="list-config">
    <div class="generator-form">
      <Card class="mb-4" title="查询条件">
        <template #extra>
          <Button size="small" type="primary" @click="openQueryConfigModal">
            <template #icon>
              <LucideSettings />
            </template>
            字段设置
          </Button>
        </template>
        <FieldConfigEmpty
          v-if="enabledQueryConfig.length === 0"
          description="暂无启用的查询字段"
          @open-settings="openQueryConfigModal"
        />
        <div v-else class="config-items config-items-query">
          <template v-for="item in enabledQueryConfig" :key="item.name">
            <div class="config-item">
              <div class="config-item-body">
                <div class="config-item-body-label">
                  <FieldMetaPopover :field="item">
                    <label>{{ item.label }}</label>
                  </FieldMetaPopover>
                </div>
                <div class="config-item-body-control">
                  <span class="component-type">
                    {{ item.componentType }}
                    {{ item.dictType ? ` / ${item.dictType}` : '' }}
                  </span>
                  <span class="component-other">
                    匹配规则：<DictTag
                      :code="item.matchingMode"
                      :use-tag="false"
                      dict-type="matchingMode"
                    />
                  </span>

                  <div class="config-item-body-control-tool">
                    <Tooltip>
                      <template #title>隐藏</template>
                      <Button
                        shape="circle"
                        size="small"
                        @click="hideQueryConfig(item.propertyName)"
                      >
                        <template #icon> <LucideMinus /> </template>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <HiddenFieldsPanel
          :fields="hiddenQueryConfig"
          @restore="restoreQueryConfig"
        />
      </Card>

      <Card>
        <template #title>
          表格
          <small>
            <TypographyText type="danger">
              注：含圆点的表示元素包含"formatter"或"cellRender"
            </TypographyText>
          </small>
        </template>
        <template #extra>
          <Button size="small" type="primary" @click="openTableConfigModal">
            <template #icon>
              <LucideSettings />
            </template>
            字段设置
          </Button>
        </template>
        <FieldConfigEmpty
          v-if="enabledTableConfig.length === 0"
          description="暂无启用的表格列"
          @open-settings="openTableConfigModal"
        />
        <div v-else class="config-items config-items-table config-table">
          <template v-for="item in enabledTableConfig" :key="item.name">
            <div :style="{ minWidth: `${item.width}px` }" class="config-item">
              <div class="config-item-body">
                <div class="config-item-body-control">
                  <FieldMetaPopover :field="item" show-extra>
                    <span>{{ item.title }}</span>
                  </FieldMetaPopover>

                  <div class="config-item-body-control-mark">
                    <Tooltip v-if="item.format">
                      <template #title>formatter</template>
                      <span class="control-mark control-mark-1"></span>
                    </Tooltip>
                    <Tooltip v-if="item.dictType">
                      <template #title>cellRender</template>
                      <span class="control-mark control-mark-2"></span>
                    </Tooltip>
                  </div>

                  <div class="config-item-body-control-tool">
                    <Tooltip>
                      <template #title>隐藏</template>
                      <Button
                        shape="circle"
                        size="small"
                        @click="hideTableConfig(item.propertyName)"
                      >
                        <template #icon> <LucideMinus /> </template>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <HiddenFieldsPanel
          :fields="hiddenTableConfig"
          name-field="title"
          @restore="restoreTableConfig"
        />
      </Card>

      <Divider>说明</Divider>
      <div class="my-4">
        <p>1、点击"字段设置"按钮配置字段；2、拖动"虚线框"进行排序</p>
      </div>

      <BaseQueryConfigModal @update-config="updateQueryConfig" />
      <BaseTableConfigModal @update-config="updateTableConfig" />

      <div class="footer-button bg-background">
        <Space>
          <Button @click="handleStepPrev">
            <template #icon>
              <LucideArrowLeft />
            </template>
            上一步
          </Button>
          <Button type="primary" @click="handleStepNext">
            <template #icon>
              <LucideArrowRight />
            </template>
            下一步
          </Button>
        </Space>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
