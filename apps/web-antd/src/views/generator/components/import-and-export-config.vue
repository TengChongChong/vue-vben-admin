<script setup lang="ts">
import type {
  BasicsConfigModel,
  GeneratorConfig,
  ImportCellConfig,
  TableCellConfig,
} from '#/api/generator/model/generatorModel';

import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideSettings,
  LucideTrash,
} from '#/components/icons';
import { isNullOrUnDef } from '#/util/is';
import { useVbenModal } from '@vben/common-ui';
import { useSortable } from '@vben/hooks';
import {
  Button,
  Card,
  Divider,
  Popover,
  Space,
  Tooltip,
  TypographyText,
} from 'ant-design-vue';
import { computed, nextTick, onMounted, ref, unref, watch } from 'vue';

import { needGeneratorExport, needGeneratorImport } from '../util/util';
import ExportConfigModal from './modal/export-config-modal.vue';
import ImportConfigModal from './modal/import-config-modal.vue';

const props = defineProps<{
  generatorConfig: GeneratorConfig;
}>();

const emit = defineEmits(['next', 'prev', 'updateConfig']);

const importConfig = ref<ImportCellConfig[]>([]);
const exportConfig = ref<TableCellConfig[]>([]);

const [BaseImportConfigModal, baseImportConfigModalApi] = useVbenModal({
  connectedComponent: ImportConfigModal,
});

const [BaseExportConfigModal, baseExportConfigModalApi] = useVbenModal({
  connectedComponent: ExportConfigModal,
});

onMounted(() => {
  initData();
  initImportSortable();
  initExportSortable();
});

async function initImportSortable() {
  await nextTick();
  const el = document.querySelectorAll(`.config-items-import`)?.[0];

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
      const currentTab = importConfig.value[oldIndex];
      importConfig.value.splice(oldIndex, 1);
      importConfig.value.splice(newIndex, 0, currentTab);
    },
  });

  await initializeSortable();
}
async function initExportSortable() {
  await nextTick();
  const el = document.querySelectorAll(`.config-items-export`)?.[0];

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
      const currentTab = exportConfig.value[oldIndex];
      exportConfig.value.splice(oldIndex, 1);
      exportConfig.value.splice(newIndex, 0, currentTab);
    },
  });

  await initializeSortable();
}
watch(
  () => props.generatorConfig,
  () => {
    initData();
  },
  { deep: true },
);

function initData() {
  importConfig.value = props.generatorConfig?.importConfig || [];
  exportConfig.value = props.generatorConfig?.exportConfig || [];
}

/**
 * 打开配置查询条件模态框
 */
function openImportConfigModal() {
  baseImportConfigModalApi.setData({
    tableInfo: props.generatorConfig?.tableInfo,
    config: unref(importConfig),
  });
  baseImportConfigModalApi.open();
}

/**
 * 打开配置表格模态框
 */
function openExportConfigModal() {
  baseExportConfigModalApi.setData({
    tableInfo: props.generatorConfig?.tableInfo,
    config: unref(exportConfig),
  });
  baseExportConfigModalApi.open();
}

/**
 * 更新查询条件配置
 *
 * @param config config
 */
function updateImportConfig(config) {
  importConfig.value = config;
}

/**
 * 更新表格配置
 *
 * @param config config
 */
function updateExportConfig(config) {
  exportConfig.value = config;
}

function disableImportConfig(propertyName: string) {
  importConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
    }
  });
}

function disableExportConfig(propertyName: string) {
  exportConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
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
        <div class="config-table config-items config-items-import">
          <template v-for="item in importConfig" :key="item.name">
            <div
              v-show="item.isEnable"
              :style="{ minWidth: `${item.width}px` }"
              class="config-item"
            >
              <div class="config-item-body">
                <div class="config-item-body-control">
                  <Popover>
                    <template #content>
                      <div>列名：{{ item.name }}</div>
                      <div>
                        类型：{{ item.metaInfo.jdbcType?.toLowerCase() }}
                        {{
                          item.metaInfo.length > 0
                            ? `(${item.metaInfo.length})`
                            : ''
                        }}
                      </div>
                      <div>属性：{{ item.propertyName }}</div>
                      <div>注释：{{ item.comment ? item.comment : '-' }}</div>
                    </template>
                    <span class="component-type">
                      <TypographyText v-if="item.required" type="danger">
                        *
                      </TypographyText>
                      {{ item.title }}
                    </span>

                    <div class="config-item-body-control-mark">
                      <Tooltip v-if="item.dictType">
                        <template #title>字典</template>
                        <span class="control-mark control-mark-2"></span>
                      </Tooltip>
                    </div>

                    <div class="config-item-body-control-tool">
                      <Tooltip>
                        <template #title>移除</template>
                        <Button
                          danger
                          shape="circle"
                          size="small"
                          @click="disableImportConfig(item.propertyName)"
                        >
                          <template #icon>
                            <LucideTrash />
                          </template>
                        </Button>
                      </Tooltip>
                    </div>
                  </Popover>
                </div>
              </div>
            </div>
          </template>
        </div>
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
        <div class="config-table config-items config-items-export">
          <template v-for="item in exportConfig" :key="item.name">
            <div
              v-show="item.isEnable"
              :style="{ minWidth: `${item.width}px` }"
              class="config-item"
            >
              <div class="config-item-body">
                <div class="config-item-body-control">
                  <Popover>
                    <template #content>
                      <div>列名：{{ item.name }}</div>
                      <div>
                        类型：{{ item.metaInfo.jdbcType?.toLowerCase() }}
                        {{
                          item.metaInfo.length > 0
                            ? `(${item.metaInfo.length})`
                            : ''
                        }}
                      </div>
                      <div>属性：{{ item.propertyName }}</div>
                      <div>注释：{{ item.comment ? item.comment : '-' }}</div>
                      <div>宽度：{{ item.width ? item.width : '-' }}</div>
                      <div>字典：{{ item.dictType ? item.dictType : '-' }}</div>
                    </template>
                    <span>{{ item.title }}</span>
                  </Popover>

                  <div class="config-item-body-control-mark">
                    <Tooltip v-if="item.dictType">
                      <template #title>字典</template>
                      <span class="control-mark control-mark-2"></span>
                    </Tooltip>
                  </div>

                  <div class="config-item-body-control-tool">
                    <Tooltip>
                      <template #title>移除</template>
                      <Button
                        danger
                        shape="circle"
                        size="small"
                        @click="disableExportConfig(item.propertyName)"
                      >
                        <template #icon>
                          <LucideTrash />
                        </template>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </Card>

      <Divider orientation="left">说明</Divider>
      <div class="mb-6">
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
