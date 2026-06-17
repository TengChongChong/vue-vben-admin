<script setup lang="ts">
import type {
  BasicsConfigModel,
  ImportCellConfig,
  SelectModel,
  TableCellConfig,
  WizardGeneratorConfig,
} from '#/api';

import { computed, ref, unref, watch } from 'vue';

import { useVbenModal } from '@vben/common-ui';

import { Button, Card, Space, Tooltip, TypographyText } from 'ant-design-vue';

import { Divider } from '#/components/divider';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideMinus,
  LucideSettings,
} from '#/components/icons';

import { useFieldConfigSortable } from '../composables/use-field-config-sortable';
import {
  EXPORT_CONFIG_COLUMNS,
  IMPORT_CONFIG_COLUMNS,
} from '../types/modal-columns';
import { needGeneratorExport, needGeneratorImport } from '../util/util';
import FieldConfigEmpty from './field-config-empty.vue';
import HiddenFieldsPanel from './hidden-fields-panel.vue';
import FieldConfigTableModal from './modal/field-config-table-modal.vue';
import FieldMetaPopover from './modal/field-meta-popover.vue';

const props = defineProps<{
  dictTypeOptions: SelectModel[];
  generatorConfig: WizardGeneratorConfig;
}>();

const emit = defineEmits(['next', 'prev', 'updateConfig']);

const importConfig = ref<ImportCellConfig[]>([]);
const exportConfig = ref<TableCellConfig[]>([]);

const enabledImportConfig = computed(() =>
  importConfig.value.filter((item) => item.isEnable),
);
const enabledExportConfig = computed(() =>
  exportConfig.value.filter((item) => item.isEnable),
);
const hiddenImportConfig = computed(() =>
  importConfig.value.filter((item) => !item.isEnable),
);
const hiddenExportConfig = computed(() =>
  exportConfig.value.filter((item) => !item.isEnable),
);

const [BaseImportConfigModal, importConfigModalApi] = useVbenModal({
  connectedComponent: FieldConfigTableModal,
});

const [BaseExportConfigModal, exportConfigModalApi] = useVbenModal({
  connectedComponent: FieldConfigTableModal,
});

useFieldConfigSortable('config-items-import', importConfig);
useFieldConfigSortable('config-items-export', exportConfig);

watch(
  () => props.generatorConfig,
  () => {
    initData();
  },
  { deep: true, immediate: true },
);

function initData() {
  importConfig.value = props.generatorConfig?.importConfig || [];
  exportConfig.value = props.generatorConfig?.exportConfig || [];
}

function openImportConfigModal() {
  importConfigModalApi.setData({
    title: '导入配置',
    columns: IMPORT_CONFIG_COLUMNS,
    config: unref(importConfig),
    dictTypeOptions: props.dictTypeOptions,
  });
  importConfigModalApi.open();
}

function openExportConfigModal() {
  exportConfigModalApi.setData({
    title: '导出配置',
    columns: EXPORT_CONFIG_COLUMNS,
    config: unref(exportConfig),
    dictTypeOptions: props.dictTypeOptions,
  });
  exportConfigModalApi.open();
}

function updateImportConfig(config: ImportCellConfig[]) {
  importConfig.value = config;
}

function updateExportConfig(config: TableCellConfig[]) {
  exportConfig.value = config;
}

function hideImportConfig(propertyName: string) {
  importConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
    }
  });
}

function hideExportConfig(propertyName: string) {
  exportConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
    }
  });
}

function restoreImportConfig(propertyName: string) {
  importConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = true;
    }
  });
}

function restoreExportConfig(propertyName: string) {
  exportConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = true;
    }
  });
}

const generatorImport = computed(() => {
  return needGeneratorImport(
    props.generatorConfig?.basicsConfig as BasicsConfigModel,
  );
});

const generatorExport = computed(() => {
  return needGeneratorExport(
    props.generatorConfig?.basicsConfig as BasicsConfigModel,
  );
});

function handleStepPrev() {
  emit('prev');
}

function handleStepNext() {
  emit('updateConfig', 'importConfig', unref(importConfig));
  emit('updateConfig', 'exportConfig', unref(exportConfig));
  emit('next');
}
</script>

<template>
  <div class="list-config">
    <div class="generator-form">
      <Card v-show="generatorImport" class="mb-4">
        <template #title>
          导入
          <small>
            <TypographyText type="danger">
              注：含圆点的表示元素包含"字典"
            </TypographyText>
          </small>
        </template>
        <template #extra>
          <Button size="small" type="primary" @click="openImportConfigModal">
            <template #icon>
              <LucideSettings />
            </template>
            字段设置
          </Button>
        </template>
        <FieldConfigEmpty
          v-if="enabledImportConfig.length === 0"
          description="暂无启用的导入字段"
          @open-settings="openImportConfigModal"
        />
        <div v-else class="config-items config-items-import config-table">
          <template v-for="item in enabledImportConfig" :key="item.name">
            <div :style="{ minWidth: `${item.width}px` }" class="config-item">
              <div class="config-item-body">
                <div class="config-item-body-control">
                  <FieldMetaPopover :field="item">
                    <span class="component-type">
                      <TypographyText v-if="item.required" type="danger">
                        *
                      </TypographyText>
                      {{ item.title }}
                    </span>
                  </FieldMetaPopover>

                  <div class="config-item-body-control-mark">
                    <Tooltip v-if="item.dictType">
                      <template #title>字典</template>
                      <span class="control-mark control-mark-2"></span>
                    </Tooltip>
                  </div>

                  <div class="config-item-body-control-tool">
                    <Tooltip>
                      <template #title>隐藏</template>
                      <Button
                        shape="circle"
                        size="small"
                        @click="hideImportConfig(item.propertyName)"
                      >
                        <template #icon>
                          <LucideMinus />
                        </template>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <HiddenFieldsPanel
          :fields="hiddenImportConfig"
          name-field="title"
          @restore="restoreImportConfig"
        />
      </Card>

      <Card v-show="generatorExport">
        <template #title>
          导出
          <small>
            <TypographyText type="danger">
              注：含圆点的表示元素包含"字典"
            </TypographyText>
          </small>
        </template>
        <template #extra>
          <Button size="small" type="primary" @click="openExportConfigModal">
            <template #icon>
              <LucideSettings />
            </template>
            字段设置
          </Button>
        </template>
        <FieldConfigEmpty
          v-if="enabledExportConfig.length === 0"
          description="暂无启用的导出字段"
          @open-settings="openExportConfigModal"
        />
        <div v-else class="config-items config-items-export config-table">
          <template v-for="item in enabledExportConfig" :key="item.name">
            <div :style="{ minWidth: `${item.width}px` }" class="config-item">
              <div class="config-item-body">
                <div class="config-item-body-control">
                  <FieldMetaPopover :field="item" show-extra>
                    <span>{{ item.title }}</span>
                  </FieldMetaPopover>

                  <div class="config-item-body-control-mark">
                    <Tooltip v-if="item.dictType">
                      <template #title>字典</template>
                      <span class="control-mark control-mark-2"></span>
                    </Tooltip>
                  </div>

                  <div class="config-item-body-control-tool">
                    <Tooltip>
                      <template #title>隐藏</template>
                      <Button
                        shape="circle"
                        size="small"
                        @click="hideExportConfig(item.propertyName)"
                      >
                        <template #icon>
                          <LucideMinus />
                        </template>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
        <HiddenFieldsPanel
          :fields="hiddenExportConfig"
          name-field="title"
          @restore="restoreExportConfig"
        />
      </Card>

      <Divider>说明</Divider>
      <div class="my-4">
        <p>1、点击"字段设置"按钮配置字段；2、拖动"虚线框"进行排序</p>
      </div>

      <BaseImportConfigModal @update-config="updateImportConfig" />
      <BaseExportConfigModal @update-config="updateExportConfig" />

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
