<script setup lang="ts">
import type { TreeProps } from 'ant-design-vue/es/tree/Tree';
import type { FieldNames } from 'ant-design-vue/es/vc-cascader';

import {
  computed,
  h,
  onMounted,
  reactive,
  ref,
  toRaw,
  unref,
  useAttrs,
  type VNode,
  watch,
  watchEffect,
} from 'vue';

import { VbenScrollbar } from '@vben/common-ui';
import { Icon } from '@vben/icons';
import { cn, filter, treeToList } from '@vben/utils';

import { EllipsisOutlined } from '@ant-design/icons-vue';
import { useDebounceFn } from '@vueuse/shared';
import {
  Button,
  Card,
  Dropdown,
  Empty,
  InputSearch,
  Menu,
  MenuDivider,
  MenuItem,
  type MenuProps,
  Space,
  Tree,
} from 'ant-design-vue';
import { difference, isArray, isString, omit } from 'lodash-es';

import { HighlightText } from '#/components/highlight-text';
import { useTree } from '#/components/tree/src/hooks/useTree';
import {
  type BasicTreeProps,
  ToolbarEnum,
  type TreeActionType,
  type TreeItem,
  type TreeState,
} from '#/components/tree/src/types';

defineOptions({
  inheritAttrs: false,
});

const props = withDefaults(defineProps<BasicTreeProps>(), {
  height: 400,
  expandOnSearch: true,
  highlight: false,
  loading: false,
});

const emit = defineEmits([
  'update:expandedKeys',
  'update:selectedKeys',
  'update:value',
  'change',
  'check',
  'update:searchValue',
]);

const attrs = useAttrs();

const state = reactive<TreeState>({
  checkStrictly: props.checkStrictly,
  expandedKeys: props.expandedKeys || [],
  selectedKeys: props.selectedKeys || [],
  checkedKeys: props.checkedKeys || [],
});

const searchState = reactive({
  startSearch: false,
  searchText: '',
  searchData: [] as TreeItem[],
});

const treeDataRef = ref<TreeItem[]>([]);
const getFieldNames = computed((): Required<FieldNames> => {
  const { fieldNames } = props;
  return {
    children: 'children',
    title: 'title',
    key: 'key',
    ...fieldNames,
  };
});
const {
  deleteNodeByKey,
  insertNodeByKey,
  insertNodesByKey,
  filterByLevel,
  updateNodeByKey,
  getAllKeys,
  getChildrenKeys,
  getEnabledKeys,
  getSelectedNode,
} = useTree(treeDataRef, getFieldNames);

const getBindValues = computed(() => {
  const propsData = {
    blockNode: true,
    ...attrs,
    ...props,
    expandedKeys: state.expandedKeys,
    selectedKeys: state.selectedKeys,
    checkedKeys: state.checkedKeys,
    checkStrictly: state.checkStrictly,
    fieldNames: unref(getFieldNames),
    'onUpdate:expandedKeys': (v: KeyType[]) => {
      state.expandedKeys = v;
      emit('update:expandedKeys', v);
    },
    'onUpdate:selectedKeys': (v: KeyType[]) => {
      state.selectedKeys = v;
      emit('update:selectedKeys', v);
    },
    onCheck: (v: CheckKeys, e) => {
      let currentValue = toRaw(state.checkedKeys) as KeyType[];
      if (isArray(currentValue) && searchState.startSearch) {
        const value = e.node.eventKey;
        currentValue = difference(currentValue, getChildrenKeys(value));
        if (e.checked) {
          currentValue.push(value);
        }
        state.checkedKeys = currentValue;
      } else {
        state.checkedKeys = v;
      }

      const rawVal = state.checkStrictly
        ? toRaw(state.checkedKeys)
        : {
            checked: toRaw(state.checkedKeys),
            halfCheckedKeys: e.halfCheckedKeys,
          };
      emit('update:value', rawVal);
      emit('check', rawVal, e);
    },
  };
  return omit(propsData, 'treeData', 'class') as TreeProps;
});

const getTreeSearchData = computed((): TreeItem[] =>
  searchState.startSearch ? searchState.searchData : unref(treeDataRef),
);

const getNotFound = computed((): boolean => {
  return !getTreeSearchData.value || getTreeSearchData.value.length === 0;
});

function getTreeData() {
  return unref(treeDataRef);
}

function setExpandedKeys(keys: KeyType[]) {
  state.expandedKeys = keys;
}

function getExpandedKeys() {
  return state.expandedKeys;
}
function setSelectedKeys(keys: KeyType[]) {
  state.selectedKeys = keys;
}

function getSelectedKeys() {
  return state.selectedKeys;
}

function setCheckedKeys(keys: CheckKeys) {
  state.checkedKeys = keys;
}

function getCheckedKeys() {
  return state.checkedKeys;
}

function checkAll(checkAll: boolean) {
  state.checkedKeys = checkAll ? getEnabledKeys() : ([] as KeyType[]);
}

function expandAll(expandAll: boolean) {
  state.expandedKeys = expandAll ? getAllKeys() : ([] as KeyType[]);
}

function onStrictlyChange(strictly: boolean) {
  state.checkStrictly = strictly;
}

function handleSearch(searchValue: string) {
  if (searchValue !== searchState.searchText) {
    searchState.searchText = searchValue;
  }
  emit('update:searchValue', searchValue);
  if (!searchValue) {
    searchState.startSearch = false;
    return;
  }
  const {
    filterFn,
    checkable,
    expandOnSearch,
    checkOnSearch,
    selectedOnSearch,
  } = unref(props);
  searchState.startSearch = true;
  const { title: titleField, key: keyField } = unref(getFieldNames);

  const matchedKeys: string[] = [];
  searchState.searchData = filter(
    unref(treeDataRef),
    (node) => {
      const result = filterFn
        ? filterFn(searchValue, node, unref(getFieldNames))
        : (node[titleField]?.includes(searchValue) ?? false);
      if (result) {
        matchedKeys.push(node[keyField]);
      }
      return result;
    },
    unref(getFieldNames),
  );

  if (expandOnSearch) {
    const expandKeys = treeToList(searchState.searchData).map((val) => {
      return val[keyField];
    });
    if (expandKeys && expandKeys.length > 0) {
      setExpandedKeys(expandKeys);
    }
  }

  if (checkOnSearch && checkable && matchedKeys.length > 0) {
    setCheckedKeys(matchedKeys);
  }

  if (selectedOnSearch && matchedKeys.length > 0) {
    setSelectedKeys(matchedKeys);
  }
}

const debounceHandleSearch = useDebounceFn(handleSearch, 200);

watch(
  () => props.searchValue,
  (val) => {
    if (val !== searchState.searchText) {
      searchState.searchText = val;
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => props.treeData,
  (val) => {
    if (val) {
      handleSearch(searchState.searchText);
    }
  },
);

watch(
  () => searchState.searchText,
  () => {
    debounceHandleSearch(toRaw(searchState.searchText));
  },
);

const handleTreeToolbarClick: MenuProps['onClick'] = ({ key }) => {
  switch (key) {
    case ToolbarEnum.CHECK_STRICTLY: {
      onStrictlyChange(false);
      break;
    }
    case ToolbarEnum.CHECK_UN_STRICTLY: {
      onStrictlyChange(true);
      break;
    }
    case ToolbarEnum.EXPAND_ALL: {
      expandAll(true);
      break;
    }
    case ToolbarEnum.SELECT_ALL: {
      checkAll(true);
      break;
    }
    case ToolbarEnum.UN_EXPAND_ALL: {
      expandAll(false);
      break;
    }
    case ToolbarEnum.UN_SELECT_ALL: {
      checkAll(false);
      break;
    }
  }
};

watchEffect(() => {
  treeDataRef.value = props.treeData as TreeItem[];
});

onMounted(() => {
  const level = Number.parseInt(props.defaultExpandLevel);
  if (level > 0) {
    state.expandedKeys = filterByLevel(level);
  } else if (props.defaultExpandAll) {
    expandAll(true);
  }
});

watchEffect(() => {
  state.expandedKeys = props.expandedKeys;
});

watchEffect(() => {
  state.selectedKeys = props.selectedKeys;
});

watchEffect(() => {
  state.checkedKeys = props.checkedKeys;
});

watch(
  () => props.value,
  () => {
    state.checkedKeys = toRaw(props.value || []);
  },
  { immediate: true },
);

// watch(
//   () => state.checkedKeys,
//   () => {
//     const v = toRaw(state.checkedKeys);
//     emit('update:value', v);
//     emit('change', v);
//   },
// );

watchEffect(() => {
  state.checkStrictly = props.checkStrictly;
});

const instance: TreeActionType = {
  getTreeData,
  setExpandedKeys,
  getExpandedKeys,
  setSelectedKeys,
  getSelectedKeys,
  setCheckedKeys,
  getCheckedKeys,
  insertNodeByKey,
  insertNodesByKey,
  deleteNodeByKey,
  updateNodeByKey,
  getSelectedNode,
  checkAll,
  expandAll,
  filterByLevel: (level: number) => {
    state.expandedKeys = filterByLevel(level);
  },
  setSearchValue: (value: string) => {
    handleSearch(value);
  },
  getSearchValue: () => {
    return searchState.searchText;
  },
};

const TreeIcon = ({ icon }: { icon: string | undefined | VNode }) => {
  if (!icon) return null;
  if (isString(icon)) {
    return h(Icon, { icon, class: 'mr-1' });
  }
  return h(Icon);
};

defineExpose(instance);
</script>

<template>
  <Card
    v-bind="$attrs"
    :bordered="false"
    :class="cn(props.class)"
    :head-style="props.headStyle"
    :size="props.size"
    :title="props.title"
  >
    <template #extra>
      <Space>
        <InputSearch
          v-if="props.showSearch"
          v-model:value="searchState.searchText"
          :size="props.size"
          placeholder="输入节点名称搜索"
          style="width: 200px"
        />
        <Dropdown v-if="props.showToolbar">
          <Button :size="props.size">
            <template #icon>
              <EllipsisOutlined />
            </template>
          </Button>
          <template #overlay>
            <Menu @click="handleTreeToolbarClick">
              <MenuItem :key="0"> 选择全部 </MenuItem>
              <MenuItem :key="1"> 取消选择 </MenuItem>
              <MenuDivider />
              <MenuItem :key="2"> 展开全部 </MenuItem>
              <MenuItem :key="3"> 折叠全部 </MenuItem>
              <MenuDivider />
              <MenuItem :key="4"> 层级关联</MenuItem>
              <MenuItem :key="5">层级独立</MenuItem>
            </Menu>
          </template>
        </Dropdown>
      </Space>
    </template>
    <div
      :style="{ maxHeight: `${props.height}px` }"
      class="relative flex-1 overflow-y-auto"
    >
      <VbenScrollbar shadow shadow-border>
        <Tree
          v-if="!getNotFound"
          v-bind="getBindValues"
          :show-icon="false"
          :tree-data="getTreeSearchData"
        >
          <template #title="{ title, icon }">
            <TreeIcon :icon="icon" />

            <HighlightText :keyword="searchState.searchText" :text="title" />
          </template>
        </Tree>

        <Empty v-if="getNotFound" />
      </VbenScrollbar>
    </div>
  </Card>
</template>

<style lang="scss" scoped>
:deep(.ant-tree) {
  .ant-tree-title {
    position: relative;
    display: flex;
    align-items: center;
  }
}
</style>
