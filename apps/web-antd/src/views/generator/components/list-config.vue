<script setup lang="ts">
import type {
  FieldConfig,
  GeneratorConfig,
  TableCellConfig,
} from '#/api/generator/model/generatorModel';

import { DictTag } from '#/components/dict';
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

import QueryConfigModal from './modal/query-config-modal.vue';
import TableConfigModal from './modal/table-config-modal.vue';

const props = defineProps<{
  generatorConfig: GeneratorConfig;
}>();

const emit = defineEmits(['next', 'prev', 'updateConfig']);

const queryConfig = ref<FieldConfig[]>([]);
const tableConfig = ref<TableCellConfig[]>([]);

const [BaseQueryConfigModal, baseQueryConfigModalApi] = useVbenModal({
  connectedComponent: QueryConfigModal,
});

const [BaseTableConfigModal, baseTableConfigModalApi] = useVbenModal({
  connectedComponent: TableConfigModal,
});

onMounted(() => {
  initData();
  initQuerySortable();
  initTableSortable();
});

async function initQuerySortable() {
  await nextTick();
  const el = document.querySelectorAll(`.config-items-query`)?.[0];

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
      const currentTab = queryConfig.value[oldIndex];
      queryConfig.value.splice(oldIndex, 1);
      queryConfig.value.splice(newIndex, 0, currentTab);
    },
  });

  await initializeSortable();
}
async function initTableSortable() {
  await nextTick();
  const el = document.querySelectorAll(`.config-items-table`)?.[0];

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
      const currentTab = tableConfig.value[oldIndex];
      tableConfig.value.splice(oldIndex, 1);
      tableConfig.value.splice(newIndex, 0, currentTab);
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
  queryConfig.value = props.generatorConfig?.queryConfig || [];
  tableConfig.value = props.generatorConfig?.tableConfig || [];
}

/**
 * 打开配置查询条件模态框
 */
function openQueryConfigModal() {
  baseQueryConfigModalApi.setData({
    tableInfo: props.generatorConfig?.tableInfo,
    config: unref(queryConfig),
  });
  baseQueryConfigModalApi.open();
}

/**
 * 打开配置表格模态框
 */
function openTableConfigModal() {
  baseTableConfigModalApi.setData({
    tableInfo: props.generatorConfig?.tableInfo,
    config: unref(tableConfig),
  });
  baseTableConfigModalApi.open();
}

/**
 * 更新查询条件配置
 *
 * @param config config
 */
function updateQueryConfig(config) {
  queryConfig.value = config;
}

/**
 * 更新表格配置
 *
 * @param config config
 */
function updateTableConfig(config) {
  tableConfig.value = config;
}

function disableQueryConfig(propertyName: string) {
  queryConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
    }
  });
}

function disableTableConfig(propertyName: string) {
  tableConfig.value.forEach((item) => {
    if (item.propertyName === propertyName) {
      item.isEnable = false;
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
        <div class="config-items config-items-query">
          <template v-for="item in queryConfig" :key="item.name">
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
                    <label>{{ item.label }}</label>
                  </Popover>
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
                      <template #title>移除</template>
                      <Button
                        danger
                        shape="circle"
                        size="small"
                        @click="disableQueryConfig(item.propertyName)"
                      >
                        <template #icon> <LucideTrash /> </template>
                      </Button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
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
        <div class="config-table config-items config-items-table">
          <template v-for="item in tableConfig" :key="item.name">
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
                      <div>格式：{{ item.format ? item.format : '-' }}</div>
                      <div>字典：{{ item.dictType ? item.dictType : '-' }}</div>
                      <div>排序：{{ item.sorter ? '支持' : '不支持' }}</div>
                      <div>宽度：{{ item.width ? item.width : '-' }}</div>
                    </template>
                    <span>{{ item.title }}</span>
                  </Popover>

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
                      <template #title>移除</template>
                      <Button
                        danger
                        shape="circle"
                        size="small"
                        @click="disableTableConfig(item.propertyName)"
                      >
                        <template #icon> <LucideTrash /> </template>
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
