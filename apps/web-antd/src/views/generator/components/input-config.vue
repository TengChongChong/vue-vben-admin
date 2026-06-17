<script setup lang="ts">
import type { FieldConfig, SelectModel, WizardGeneratorConfig } from '#/api';

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
import { INPUT_CONFIG_COLUMNS } from '../types/modal-columns';
import FieldConfigEmpty from './field-config-empty.vue';
import HiddenFieldsPanel from './hidden-fields-panel.vue';
import FieldConfigTableModal from './modal/field-config-table-modal.vue';
import FieldMetaPopover from './modal/field-meta-popover.vue';

const props = defineProps<{
  dictTypeOptions: SelectModel[];
  generatorConfig: WizardGeneratorConfig;
}>();

const emit = defineEmits(['next', 'prev', 'updateConfig']);

const inputConfig = ref<FieldConfig[]>([]);

const enabledInputConfig = computed(() =>
  inputConfig.value.filter((item) => item.isEnable),
);
const hiddenInputConfig = computed(() =>
  inputConfig.value.filter((item) => !item.isEnable),
);

const [BaseInputConfigModal, inputConfigModalApi] = useVbenModal({
  connectedComponent: FieldConfigTableModal,
});

useFieldConfigSortable('config-items-input', inputConfig);

watch(
  () => props.generatorConfig,
  () => {
    initData();
  },
  { deep: true, immediate: true },
);

function initData() {
  inputConfig.value = props.generatorConfig?.inputConfig || [];
}

function openInputConfigModal() {
  inputConfigModalApi.setData({
    title: '表单配置',
    columns: INPUT_CONFIG_COLUMNS,
    config: unref(inputConfig),
    dictTypeOptions: props.dictTypeOptions,
  });
  inputConfigModalApi.open();
}

function updateInputConfig(config: FieldConfig[]) {
  inputConfig.value = config;
}

function hideInputConfig(propertyName: string) {
  inputConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
    }
  });
}

function restoreInputConfig(propertyName: string) {
  inputConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = true;
    }
  });
}

function handleStepPrev() {
  emit('prev');
}

function handleStepNext() {
  emit('updateConfig', 'inputConfig', unref(inputConfig));
  emit('next');
}
</script>

<template>
  <div class="input-config">
    <div class="generator-form">
      <Card>
        <template #title> 表单 </template>
        <template #extra>
          <Button size="small" type="primary" @click="openInputConfigModal">
            <template #icon>
              <LucideSettings />
            </template>
            字段设置
          </Button>
        </template>
        <FieldConfigEmpty
          v-if="enabledInputConfig.length === 0"
          description="暂无启用的表单字段"
          @open-settings="openInputConfigModal"
        />
        <div v-else class="config-input config-items config-items-input">
          <template v-for="item in enabledInputConfig" :key="item.name">
            <div class="config-item">
              <div class="config-item-body">
                <div class="config-item-body-label">
                  <FieldMetaPopover :field="item">
                    <label>
                      <TypographyText v-if="item.required" type="danger">
                        *
                      </TypographyText>
                      {{ item.label }}
                    </label>
                  </FieldMetaPopover>
                </div>
                <div class="config-item-body-control">
                  <span class="component-type">
                    {{ item.componentType }}
                    {{ item.dictType ? ` / ${item.dictType}` : '' }}
                  </span>

                  <div class="config-item-body-control-tool">
                    <Tooltip>
                      <template #title>隐藏</template>
                      <Button
                        shape="circle"
                        size="small"
                        @click="hideInputConfig(item.propertyName)"
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
          :fields="hiddenInputConfig"
          @restore="restoreInputConfig"
        />
      </Card>

      <Divider>说明</Divider>
      <div class="my-4">
        <p>1、点击"字段设置"按钮配置字段；2、拖动"虚线框"进行排序</p>
      </div>

      <BaseInputConfigModal @update-config="updateInputConfig" />

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
