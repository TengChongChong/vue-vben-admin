<script setup lang="ts">
import type {
  FieldConfig,
  GeneratorConfig,
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
import { nextTick, onMounted, ref, unref, watch } from 'vue';

import InputConfigModal from './modal/input-config-modal.vue';

const props = defineProps<{
  generatorConfig: GeneratorConfig;
}>();

const emit = defineEmits(['next', 'prev', 'updateConfig']);

const inputConfig = ref<FieldConfig[]>([]);

const [BaseInputConfigModal, baseInputConfigModalApi] = useVbenModal({
  connectedComponent: InputConfigModal,
});

onMounted(() => {
  initData();
  initInputSortable();
});

async function initInputSortable() {
  await nextTick();
  const el = document.querySelectorAll(`.config-items-input`)?.[0];

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
      const currentTab = inputConfig.value[oldIndex];
      inputConfig.value.splice(oldIndex, 1);
      inputConfig.value.splice(newIndex, 0, currentTab);
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
  inputConfig.value = props.generatorConfig?.inputConfig || [];
}

/**
 * 打开配置查询条件模态框
 */
function openInputConfigModal() {
  baseInputConfigModalApi.setData({
    tableInfo: props.generatorConfig?.tableInfo,
    config: unref(inputConfig),
  });
  baseInputConfigModalApi.open();
}

/**
 * 更新查询条件配置
 *
 * @param config config
 */
function updateInputConfig(config) {
  inputConfig.value = config;
}

function disableInputConfig(propertyName: string) {
  inputConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
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
        <div class="config-items config-input config-items-input">
          <template v-for="item in inputConfig" :key="item.name">
            <div v-show="item.isEnable" class="config-item">
              <div class="config-item-body">
                <div class="config-item-body-label">
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
                    <label>
                      <TypographyText v-if="item.required" type="danger">
                        *
                      </TypographyText>
                      {{ item.label }}
                    </label>
                  </Popover>
                </div>
                <div class="config-item-body-control">
                  <span class="component-type">
                    {{ item.componentType }}
                    {{ item.dictType ? ` / ${item.dictType}` : '' }}
                  </span>

                  <div class="config-item-body-control-tool">
                    <Tooltip>
                      <template #title>移除</template>
                      <Button
                        danger
                        shape="circle"
                        size="small"
                        @click="disableInputConfig(item.propertyName)"
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
