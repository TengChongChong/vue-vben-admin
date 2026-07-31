<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';
import type { Key } from 'ant-design-vue/es/_util/type';
import type { AntTreeNodeDropEvent } from 'ant-design-vue/lib/tree';

import type { CmsArticle, CmsMenuItem, CmsPage } from '#/api';

import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue';

import { AccessControl } from '@vben/access';
import { useVbenDrawer } from '@vben/common-ui';
import { listToTree, treeToList } from '@vben/utils';

import {
  Button,
  Card,
  Checkbox,
  Empty,
  Input,
  message,
  Modal,
  Pagination,
  Space,
  Spin,
  Tabs,
  Tag,
  Tree,
} from 'ant-design-vue';

import {
  buildPageSizeOptions,
  DEFAULT_TABLE_PAGE_SIZE,
} from '#/adapter/vxe-table';
import {
  addCmsMenuItemApi,
  getCmsMenuItemApi,
  removeCmsMenuItemApi,
  saveCmsMenuItemApi,
  saveCmsMenuItemOrderApi,
  selectAllCmsColumnApi,
  selectCmsArticleApi,
  selectCmsMenuItemApi,
  selectCmsPageApi,
} from '#/api';
import {
  ButtonClose,
  ButtonEdit,
  ButtonRemove,
  ButtonSave,
} from '#/components/button';
import {
  LucideMinus,
  LucidePlus,
  LucideSearch,
} from '#/components/icons';

import { BUILTIN_ADD_OPTIONS, MENU_ITEM_TYPE_LABEL } from './data';
import ItemInputDrawer from './item-input.vue';

type CheckedKeys =
  | Key[]
  | { checked: Key[]; halfChecked: Key[] };

interface MenuTreeNode {
  children?: MenuTreeNode[];
  id: string;
  key: string;
  orderNo?: number;
  parentId?: string;
  title: string;
  type?: string;
}

interface ColumnCheckNode {
  children?: ColumnCheckNode[];
  key: string;
  title: string;
}
type ChecklistTabKey = 'article' | 'page';

const menuId = ref('');
const menuName = ref('');
const activeTab = ref('column');
const adding = ref(false);
const saveOrderLoading = ref(false);
const structureDirty = ref(false);

const treeData = ref<MenuTreeNode[]>([]);
const expandedKeys = ref<string[]>([]);

/** 左侧资源搜索 / 分页条件 */
const searchForm = reactive({
  columnKeyword: '',
  pageKeyword: '',
  articleKeyword: '',
  articleCurrent: 1,
  articlePageSize: DEFAULT_TABLE_PAGE_SIZE,
});
const articlePageSizeOptions = buildPageSizeOptions();
let articleSearchTimer: null | ReturnType<typeof setTimeout> = null;

const columnTree = ref<ColumnCheckNode[]>([]);
const columnCheckedKeys = ref<CheckedKeys>([]);
const columnLoaded = ref(false);
const columnLoading = ref(false);

const pageList = ref<CmsPage[]>([]);
const pageCheckedIds = ref<string[]>([]);
const pageLoaded = ref(false);
const pageLoading = ref(false);

const articleList = ref<CmsArticle[]>([]);
const articleCheckedIds = ref<string[]>([]);
const articleTitleMap = ref<Record<string, string>>({});
const articleTotal = ref(0);
const articleLoading = ref(false);

const filteredColumnTree = computed(() =>
  filterTree(columnTree.value, searchForm.columnKeyword.trim().toLowerCase()),
);
const filteredPages = computed(() => {
  const kw = searchForm.pageKeyword.trim().toLowerCase();
  if (!kw) {
    return pageList.value;
  }
  return pageList.value.filter(
    (item) =>
      item.title?.toLowerCase().includes(kw) ||
      item.slug?.toLowerCase().includes(kw),
  );
});

const columnCheckedCount = computed(() => getColumnCheckedIds().length);
const pageCheckedCount = computed(() => pageCheckedIds.value.length);
const articleCheckedCount = computed(() => articleCheckedIds.value.length);
const checklistTabs = computed(() => [
  {
    count: pageCheckedCount.value,
    emptyText: '暂无页面',
    key: 'page' as const,
    loading: pageLoading.value,
    tab: '页面',
  },
  {
    count: articleCheckedCount.value,
    emptyText: '暂无文章',
    key: 'article' as const,
    loading: articleLoading.value,
    tab: '文章',
  },
]);

function resetSearchForm() {
  searchForm.columnKeyword = '';
  searchForm.pageKeyword = '';
  searchForm.articleKeyword = '';
  searchForm.articleCurrent = 1;
  searchForm.articlePageSize = DEFAULT_TABLE_PAGE_SIZE;
}

function getAddButtonText(count: number) {
  return `添加到菜单${count > 0 ? ` (${count})` : ''}`;
}

function getKeywordByTab(key: ChecklistTabKey) {
  return key === 'page' ? searchForm.pageKeyword : searchForm.articleKeyword;
}

function setKeywordByTab(key: ChecklistTabKey, value: string) {
  if (key === 'page') {
    searchForm.pageKeyword = value;
    return;
  }
  searchForm.articleKeyword = value;
}

function getChecklistItems(key: ChecklistTabKey) {
  return key === 'page' ? filteredPages.value : articleList.value;
}

function getCheckedIdsByTab(key: ChecklistTabKey) {
  return key === 'page' ? pageCheckedIds.value : articleCheckedIds.value;
}

function handleChecklistItemCheck(
  key: ChecklistTabKey,
  id: string,
  checked: boolean,
) {
  if (key === 'page') {
    togglePageCheck(id, checked);
    return;
  }
  toggleArticleCheck(id, checked);
}

function handleChecklistAdd(key: ChecklistTabKey) {
  if (key === 'page') {
    handleAddPages();
    return;
  }
  handleAddArticles();
}

function getChecklistItemSuffix(key: ChecklistTabKey, item: CmsArticle | CmsPage) {
  if (key === 'page') {
    return (item as CmsPage).slug || '';
  }
  return '';
}

const [BaseItemInputDrawer, baseItemInputDrawerApi] = useVbenDrawer({
  connectedComponent: ItemInputDrawer,
});

function getColumnCheckedIds(): string[] {
  const keys = columnCheckedKeys.value;
  if (Array.isArray(keys)) {
    return keys.map(String);
  }
  return (keys?.checked || []).map(String);
}

function filterTree(
  nodes: ColumnCheckNode[],
  keyword: string,
): ColumnCheckNode[] {
  if (!keyword) {
    return nodes;
  }
  const result: ColumnCheckNode[] = [];
  for (const node of nodes) {
    const children = filterTree(node.children || [], keyword);
    if (node.title.toLowerCase().includes(keyword) || children.length > 0) {
      result.push({ ...node, children });
    }
  }
  return result;
}

function collectExpandedKeys(nodes: MenuTreeNode[]): string[] {
  const keys: string[] = [];
  const walk = (list: MenuTreeNode[]) => {
    list.forEach((node) => {
      keys.push(node.key);
      if (node.children?.length) {
        walk(node.children);
      }
    });
  };
  walk(nodes);
  return keys;
}

async function loadMenuTree() {
  if (!menuId.value) {
    treeData.value = [];
    return;
  }
  const res = await selectCmsMenuItemApi({
    menuId: menuId.value,
  } as CmsMenuItem);
  const nodes: MenuTreeNode[] = (res || []).map((item) => ({
    key: item.id,
    ...item
  }));
  treeData.value = listToTree(nodes) as MenuTreeNode[];
  expandedKeys.value = collectExpandedKeys(treeData.value);
  structureDirty.value = false;
}

async function loadColumns() {
  if (columnLoaded.value) {
    return;
  }
  columnLoading.value = true;
  try {
    const res = await selectAllCmsColumnApi();
    columnTree.value = listToTree(
      (res || []).map((item) => ({
        key: item.id || item.key,
        title: item.title || item.label || '',
        parentId: item.parentId,
        id: item.id || item.key,
      })),
    ) as ColumnCheckNode[];
    columnLoaded.value = true;
  } finally {
    columnLoading.value = false;
  }
}

async function loadPages() {
  if (pageLoaded.value) {
    return;
  }
  pageLoading.value = true;
  try {
    const res = await selectCmsPageApi({} as CmsPage, {
      current: 1,
      pageSize: 500,
    });
    pageList.value = res.records || [];
    pageLoaded.value = true;
  } finally {
    pageLoading.value = false;
  }
}

async function loadArticles() {
  articleLoading.value = true;
  try {
    const res = await selectCmsArticleApi(
      {
        title: searchForm.articleKeyword.trim() || undefined,
      } as CmsArticle,
      {
        current: searchForm.articleCurrent,
        pageSize: searchForm.articlePageSize,
      },
    );
    articleList.value = res.records || [];
    articleTotal.value = res.total ?? 0;
    for (const item of articleList.value) {
      if (item.id) {
        articleTitleMap.value[item.id] = item.title || '文章';
      }
    }
  } finally {
    articleLoading.value = false;
  }
}

function scheduleArticleSearch() {
  if (articleSearchTimer) {
    clearTimeout(articleSearchTimer);
  }
  articleSearchTimer = setTimeout(() => {
    searchForm.articleCurrent = 1;
    loadArticles();
  }, 300);
}

watch(
  () => searchForm.articleKeyword,
  () => {
    if (activeTab.value !== 'article') {
      return;
    }
    scheduleArticleSearch();
  },
);

function handleArticlePageChange(page: number, size: number) {
  searchForm.articleCurrent = page;
  searchForm.articlePageSize = size;
  loadArticles();
}

async function handleTabChange(key: number | string) {
  activeTab.value = String(key);
  switch (key) {
    case 'article': {
      await loadArticles();
      break;
    }
    case 'column': {
      await loadColumns();
      break;
    }
    case 'page': {
      await loadPages();
      break;
    }
    default: {
      break;
    }
  }
}

function findColumnTitles(
  nodes: ColumnCheckNode[],
  keys: Set<string>,
  map: Map<string, string>,
) {
  nodes.forEach((node) => {
    if (keys.has(node.key)) {
      map.set(node.key, node.title);
    }
    if (node.children?.length) {
      findColumnTitles(node.children, keys, map);
    }
  });
}

async function createMenuItem(partial: Partial<CmsMenuItem>) {
  if (!menuId.value) {
    return;
  }
  const defaults = await addCmsMenuItemApi(menuId.value);
  await saveCmsMenuItemApi({
    ...defaults,
    ...partial,
    menuId: menuId.value,
    parentId: undefined,
  } as CmsMenuItem);
}

async function handleAddColumns() {
  const ids = getColumnCheckedIds();
  if (ids.length === 0) {
    message.warning('请先勾选栏目');
    return;
  }
  const titleMap = new Map<string, string>();
  findColumnTitles(columnTree.value, new Set(ids), titleMap);
  adding.value = true;
  try {
    for (const id of ids) {
      await createMenuItem({
        type: 'column',
        title: titleMap.get(id) || '栏目',
        refId: id,
        target: '_self',
      });
    }
    message.success(`已添加 ${ids.length} 个栏目到菜单`);
    columnCheckedKeys.value = [];
    await loadMenuTree();
  } catch (error) {
    console.error(error);
  } finally {
    adding.value = false;
  }
}

async function handleAddPages() {
  if (pageCheckedIds.value.length === 0) {
    message.warning('请先勾选页面');
    return;
  }
  adding.value = true;
  try {
    const ids = [...pageCheckedIds.value];
    for (const id of ids) {
      const page = pageList.value.find((item) => item.id === id);
      await createMenuItem({
        type: 'page',
        title: page?.title || '页面',
        refId: id,
        target: '_self',
      });
    }
    message.success(`已添加 ${ids.length} 个页面到菜单`);
    pageCheckedIds.value = [];
    await loadMenuTree();
  } catch (error) {
    console.error(error);
  } finally {
    adding.value = false;
  }
}

async function handleAddArticles() {
  if (articleCheckedIds.value.length === 0) {
    message.warning('请先勾选文章');
    return;
  }
  adding.value = true;
  try {
    const ids = [...articleCheckedIds.value];
    for (const id of ids) {
      const title =
        articleTitleMap.value[id] ||
        articleList.value.find((item) => item.id === id)?.title ||
        '文章';
      await createMenuItem({
        type: 'article',
        title,
        refId: id,
        target: '_self',
      });
    }
    message.success(`已添加 ${ids.length} 篇文章到菜单`);
    articleCheckedIds.value = [];
    await loadMenuTree();
  } catch (error) {
    console.error(error);
  } finally {
    adding.value = false;
  }
}

async function handleAddBuiltin(type: string, title: string) {
  if (type === 'url' || type === 'folder') {
    const defaults = await addCmsMenuItemApi(menuId.value);
    baseItemInputDrawerApi.setData({
      ...defaults,
      menuId: menuId.value,
      type,
      title: type === 'url' ? '自定义链接' : '分组',
      target: '_self',
    });
    baseItemInputDrawerApi.open();
    return;
  }
  adding.value = true;
  try {
    await createMenuItem({
      type,
      title,
      target: '_self',
    });
    message.success(`已添加「${title}」到菜单`);
    await loadMenuTree();
  } catch (error) {
    console.error(error);
  } finally {
    adding.value = false;
  }
}

function handleEdit(id: string) {
  getCmsMenuItemApi(id).then((res) => {
    baseItemInputDrawerApi.setData(res);
    baseItemInputDrawerApi.open();
  });
}

function handleExpandAll() {
  expandedKeys.value = collectExpandedKeys(treeData.value);
}

function handleCollapseAll() {
  expandedKeys.value = [];
}

function setProps(
  treeNodes: MenuTreeNode[] | undefined,
  parentId: string | undefined,
) {
  if (!treeNodes) {
    return;
  }
  let index = 1;
  treeNodes.forEach((item) => {
    item.orderNo = index;
    item.parentId = parentId;
    if (item.children && item.children.length > 0) {
      setProps(item.children, item.id);
    }
    index++;
  });
}

async function handleSaveOrder() {
  try {
    saveOrderLoading.value = true;
    setProps(treeData.value, undefined);
    const params: CmsMenuItem[] = [];
    treeToList(treeData.value).forEach((item: MenuTreeNode) => {
      params.push({
        id: item.id,
        parentId: item.parentId,
        orderNo: item.orderNo,
      } as CmsMenuItem);
    });
    await saveCmsMenuItemOrderApi(params);
    structureDirty.value = false;
    message.success('菜单结构已保存');
    await loadMenuTree();
  } catch {
    message.error('保存结构失败，请稍后重试');
  } finally {
    saveOrderLoading.value = false;
  }
}

async function handleDrawerConfirm() {
  if (structureDirty.value) {
    await handleSaveOrder();
    if (structureDirty.value) {
      return;
    }
  }
  drawerApi.close();
}

function onDrop(info: AntTreeNodeDropEvent) {
  const dropKey = info.node.key;
  const dragKey = info.dragNode.key;
  const dropPos = String((info.node as any).pos || '').split('-');
  const dropPosition =
    info.dropPosition - Number(dropPos[dropPos.length - 1] || 0);

  const loop = (
    data: MenuTreeNode[],
    key: number | string,
    callback: (item: MenuTreeNode, index: number, arr: MenuTreeNode[]) => void,
  ) => {
    data.forEach((item, index) => {
      if (item.key === key) {
        return callback(item, index, data);
      }
      if (item.children) {
        return loop(item.children, key, callback);
      }
    });
  };

  const data = [...treeData.value];
  let dragObj!: MenuTreeNode;
  loop(data, dragKey, (item, index, arr) => {
    arr.splice(index, 1);
    dragObj = item;
  });

  if (!info.dropToGap) {
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      item.children.unshift(dragObj);
    });
  } else if (
    (info.node.children || []).length > 0 &&
    info.node.expanded &&
    dropPosition === 1
  ) {
    loop(data, dropKey, (item) => {
      item.children = item.children || [];
      item.children.unshift(dragObj);
    });
  } else {
    let ar: MenuTreeNode[] = [];
    let i = 0;
    loop(data, dropKey, (_item, index, arr) => {
      ar = arr;
      i = index;
    });
    if (dropPosition === -1) {
      ar.splice(i, 0, dragObj);
    } else {
      ar.splice(i + 1, 0, dragObj);
    }
  }
  treeData.value = data;
  structureDirty.value = true;
}

const [Drawer, drawerApi] = useVbenDrawer({
  onBeforeClose: () => {
    if (!structureDirty.value) {
      return true;
    }
    return new Promise<boolean>((resolve) => {
      Modal.confirm({
        title: '菜单结构尚未保存',
        content: '关闭将丢失拖拽调整，确定关闭吗？',
        onOk: () => {
          structureDirty.value = false;
          resolve(true);
        },
        onCancel: () => resolve(false),
      });
    });
  },
  onOpenChange: async (isOpen: boolean) => {
    if (!isOpen) {
      return;
    }
    const data = drawerApi.getData<{ menuId?: string; menuName?: string }>();
    menuId.value = data?.menuId || '';
    menuName.value = data?.menuName || '';
    activeTab.value = 'column';
    columnLoaded.value = false;
    pageLoaded.value = false;
    columnCheckedKeys.value = [];
    pageCheckedIds.value = [];
    articleCheckedIds.value = [];
    articleTitleMap.value = {};
    articleTotal.value = 0;
    articleList.value = [];
    resetSearchForm();
    drawerApi.setState({ loading: true });
    try {
      await Promise.all([loadMenuTree(), loadColumns()]);
    } catch {
      message.error('加载菜单数据失败');
    } finally {
      drawerApi.setState({ loading: false });
    }
  },
});

function togglePageCheck(id: string, checked: boolean) {
  if (checked) {
    if (!pageCheckedIds.value.includes(id)) {
      pageCheckedIds.value = [...pageCheckedIds.value, id];
    }
    return;
  }
  pageCheckedIds.value = pageCheckedIds.value.filter((item) => item !== id);
}

function toggleArticleCheck(id: string, checked: boolean) {
  if (checked) {
    if (!articleCheckedIds.value.includes(id)) {
      articleCheckedIds.value = [...articleCheckedIds.value, id];
    }
    return;
  }
  articleCheckedIds.value = articleCheckedIds.value.filter(
    (item) => item !== id,
  );
}

function showArticleTotal(total: number) {
  return `共 ${total} 篇`;
}

const treeFieldNames = { children: 'children', title: 'title', key: 'key' };

onBeforeUnmount(() => {
  if (articleSearchTimer) {
    clearTimeout(articleSearchTimer);
  }
});
</script>

<template>
  <Drawer class="menu-items-drawer w-[1200px]" :title="menuName ? `配置菜单项 - ${menuName}` : '配置菜单项'">
    <div class="flex gap-3">
      <!-- 左侧资源 -->
      <Card :body-style="{ padding: 0 }" class="flex w-[40%] min-w-0 flex-col overflow-hidden rounded-xl">
        <Tabs v-model:active-key="activeTab" class="menu-resource-tabs flex min-h-0 flex-1 flex-col" size="small"
          @change="handleTabChange">
          <Tabs.TabPane key="column" tab="栏目">
            <div class="flex h-full min-h-0 flex-col gap-2 p-2">
              <Input v-model:value="searchForm.columnKeyword" allow-clear placeholder="搜索栏目">
                <template #prefix>
                  <LucideSearch class="size-3.5 text-gray-400" />
                </template>
              </Input>
              <div class="min-h-0 flex-1 overflow-auto rounded-lg bg-gray-50/80 p-2 dark:bg-gray-800/40">
                <Spin :spinning="columnLoading">
                  <Tree v-if="filteredColumnTree.length > 0" v-model:checked-keys="columnCheckedKeys"
                    :tree-data="filteredColumnTree as TreeProps['treeData']" checkable check-strictly
                    default-expand-all />
                  <Empty v-else-if="!columnLoading" class="py-10" description="暂无栏目" />
                </Spin>
              </div>
              <AccessControl :codes="['cms:menu:save']">
                <Button block :disabled="columnCheckedCount === 0" :loading="adding" type="primary"
                  @click="handleAddColumns">
                  {{ getAddButtonText(columnCheckedCount) }}
                </Button>
              </AccessControl>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane v-for="tab in checklistTabs" :key="tab.key" :tab="tab.tab">
            <div class="flex h-full min-h-0 flex-col gap-2 p-2">
              <Input :value="getKeywordByTab(tab.key)" allow-clear :placeholder="tab.key === 'page' ? '搜索页面' : '搜索文章标题'"
                @update:value="
                  (value) => setKeywordByTab(tab.key, value || '')
                ">
                <template #prefix>
                  <LucideSearch class="size-3.5 text-gray-400" />
                </template>
              </Input>
              <div class="min-h-0 flex-1 space-y-0.5 overflow-auto rounded-lg bg-gray-50/80 p-1 dark:bg-gray-800/40">
                <Spin :spinning="tab.loading">
                  <label v-for="item in getChecklistItems(tab.key)" :key="item.id"
                    class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 transition-colors hover:bg-white dark:hover:bg-gray-800">
                    <Checkbox :checked="getCheckedIdsByTab(tab.key).includes(item.id)" @change="
                      (e) =>
                        handleChecklistItemCheck(
                          tab.key,
                          item.id,
                          e.target.checked,
                        )
                    " />
                    <span class="min-w-0 flex-1 truncate text-sm">
                      {{ item.title }}
                    </span>
                    <span v-if="tab.key === 'page'" class="shrink-0 text-xs text-gray-400">
                      {{ getChecklistItemSuffix(tab.key, item) }}
                    </span>
                  </label>
                  <Empty v-if="
                    !tab.loading &&
                    getChecklistItems(tab.key).length === 0
                  " class="py-10" :description="tab.emptyText" />
                </Spin>
              </div>
              <div v-if="tab.key === 'article' && articleTotal > 0"
                class="flex justify-end border-t border-gray-100 pt-2 dark:border-gray-800">
                <Pagination size="small" :current="searchForm.articleCurrent" :page-size="searchForm.articlePageSize"
                  :page-size-options="articlePageSizeOptions" :show-size-changer="true" :show-total="showArticleTotal"
                  :total="articleTotal" @change="handleArticlePageChange" />
              </div>
              <AccessControl :codes="['cms:menu:save']">
                <Button block :disabled="tab.count === 0" :loading="adding" type="primary"
                  @click="handleChecklistAdd(tab.key)">
                  {{ getAddButtonText(tab.count) }}
                </Button>
              </AccessControl>
            </div>
          </Tabs.TabPane>

          <Tabs.TabPane key="builtin" tab="内置">
            <div class="flex h-full min-h-0 flex-col gap-2 overflow-auto p-2">
              <div v-for="item in BUILTIN_ADD_OPTIONS" :key="item.type"
                class="flex items-center justify-between rounded-xl border border-gray-200 px-3 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5 dark:border-gray-700">
                <div class="min-w-0">
                  <div class="text-sm font-medium">{{ item.title }}</div>
                  <div class="text-xs text-gray-400">{{ item.description }}</div>
                </div>
                <AccessControl :codes="['cms:menu:save']">
                  <Button size="small" type="primary" ghost :loading="adding"
                    @click="handleAddBuiltin(item.type, item.title)">
                    添加
                  </Button>
                </AccessControl>
              </div>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <!-- 右侧菜单树 -->
      <Card :body-style="{ padding: 0 }" class="flex min-w-0 flex-1 flex-col overflow-hidden rounded-xl">
        <div class="flex items-center justify-between gap-2 border-b border-gray-100 px-4 py-2.5 dark:border-gray-800">
          <div class="flex min-w-0 items-center gap-2">
            <span class="text-sm font-medium">菜单结构</span>
            <span v-if="structureDirty"
              class="rounded bg-amber-50 px-1.5 py-0.5 text-xs text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
              未保存
            </span>
          </div>
          <Space>
            <Button size="small" @click="handleExpandAll">
              <template #icon>
                <LucidePlus />
              </template>
              展开
            </Button>
            <Button size="small" @click="handleCollapseAll">
              <template #icon>
                <LucideMinus />
              </template>
              折叠
            </Button>
          </Space>
        </div>
        <div class="px-4 pt-2 text-xs text-gray-400">
          拖动节点调整顺序或层级，完成后点击右下角「确认」
        </div>
        <div class="min-h-0 flex-1 overflow-auto p-3 pt-2">
          <Tree v-if="treeData.length > 0" v-model:expanded-keys="expandedKeys" :field-names="treeFieldNames"
            :tree-data="treeData as TreeProps['treeData']" block-node class="menu-structure-tree" draggable
            @drop="onDrop">
            <template #title="node">
              <div class="menu-tree-node group flex w-full items-center justify-between gap-2 pr-1">
                <div class="flex min-w-0 items-center gap-1.5">
                  <span class="truncate text-sm">{{ node.title }}</span>
                  <Tag class="mr-0! scale-90" color="blue">
                    {{ MENU_ITEM_TYPE_LABEL[node.type] || node.type }}
                  </Tag>
                </div>
                <Space :size="0" class="opacity-0 transition-opacity group-hover:opacity-100" @click.stop>
                  <ButtonEdit :auth-codes="['cms:menu:save']" size="small" type="link"
                    @click="handleEdit(node.id || node.key)" />
                  <ButtonRemove :api="removeCmsMenuItemApi" :auth-codes="['cms:menu:remove']"
                    :ids="[node.id || node.key]" size="small" type="link" @success="loadMenuTree" />
                </Space>
              </div>
            </template>
          </Tree>
          <Empty v-else class="py-16" description="暂无菜单项，请从左侧添加" />
        </div>
      </Card>
    </div>

    <BaseItemInputDrawer @success="loadMenuTree" />
    <template #footer>
      <Space>
        <ButtonClose @click="drawerApi.close()" />
        <ButtonSave
          :auth-codes="['cms:menu:save']"
          :loading="saveOrderLoading"
          text="保存"
          @click="handleDrawerConfirm" />
      </Space>
    </template>
  </Drawer>
</template>

<style scoped>
.menu-resource-tabs {
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.menu-resource-tabs :deep(.ant-tabs-nav) {
  padding: 0 12px;
  margin: 0;
}

.menu-resource-tabs :deep(.ant-tabs-content-holder) {
  flex: 1;
  min-height: 0;
  overflow: hidden;
}

.menu-resource-tabs :deep(.ant-tabs-content),
.menu-resource-tabs :deep(.ant-tabs-tabpane) {
  height: 100%;
}

.menu-structure-tree :deep(.ant-tree-node-content-wrapper) {
  width: 100%;
  min-width: 0;
}
</style>
