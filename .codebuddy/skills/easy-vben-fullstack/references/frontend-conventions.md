# easy-vben 前端开发规范速查

> 本文档总结 easy-vben 项目中前端（Vue 3 + Vben Admin + Ant Design Vue）的核心开发模式，用于 AI 辅助生成前端代码时参考。

---

## 1. 目录结构

```
apps/web-antd/src/
├── api/                    # API 请求（request.ts + 重导出）
├── components/             # 全局业务组件
│   ├── button/             # 统一按钮（ButtonAdd/ButtonEdit/ButtonRemove）
│   ├── tree/               # 树组件（BasicTree）
│   ├── dict/               # 字典组件
│   └── icons/              # 图标组件
├── views/<module>/         # 页面视图
│   ├── list.vue            # 列表页主入口
│   └── components/         # 模块私有组件
│       ├── user-list.vue   # 列表表格组件
│       ├── data.ts         # 表格列 + 表单 schema 配置
│       └── input.vue       # 新增/编辑表单弹窗
├── router/
│   ├── index.ts            # 路由实例
│   ├── guard.ts            # 路由守卫
│   ├── access.ts           # 动态权限路由
│   └── routes/modules/     # 路由定义文件
├── store/                  # Pinia Store
├── locales/langs/          # 国际化
│   ├── zh-CN/page.json
│   └── en-US/page.json
├── hooks/                  # 组合式函数
├── utils/                  # 工具函数
└── enums/                  # 枚举常量
```

---

## 2. API 请求层

### 2.1 请求客户端配置

文件：`apps/web-antd/src/api/request.ts`

```typescript
import { RequestClient } from '@vben/request';

const client = new RequestClient({ baseURL });

// 请求拦截：注入 token、语言、租户头
client.addRequestInterceptor({
  fulfilled: async (config) => {
    config.headers.Authorization = formatToken(accessStore.accessToken);
    config.headers['Accept-Language'] = preferences.app.locale;
    // 多租户头
    if (tenantId && shouldAttachTenantHeader(url)) {
      config.headers[TENANT_HEADER] = tenantId;
    }
    return config;
  },
});

// 响应拦截：数据解包 (success: true → 直接返回 data)
client.addResponseInterceptor(
  defaultResponseInterceptor({
    codeField: 'success',
    dataField: 'data',
    successCode: true,
  }),
);

// Token 刷新拦截器
client.addResponseInterceptor(
  authenticateResponseInterceptor({ client, doReAuthenticate, doRefreshToken }),
);

// 错误消息拦截器
client.addResponseInterceptor(
  errorMessageResponseInterceptor((msg, error) => {
    const { errorMessage, showType } = error.response?.data;
    if (errorMessage) {
      message.open({ type: showType || 'error', content: errorMessage });
    }
  }),
);

// 导出：responseReturn: 'data' 使响应直接返回 data 字段
export const requestClient = createRequestClient(apiURL, {
  responseReturn: 'data',
});
```

### 2.2 API 函数命名规范

```typescript
// 命名：动词 + 模块名 + 实体 + Api
// selectXxxApi    - 分页列表查询
// getXxxApi       - 获取详情
// addXxxApi       - 新增（返回默认值/空对象）
// saveXxxApi      - 保存（新增或更新）
// removeXxxApi    - 删除
// setXxxApi       - 设置状态
```

---

## 3. 列表页模式

### 3.1 list.vue（主入口页）

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { ColPage } from '@vben/common-ui';
import { listToTree } from '@vben/utils';
import { selectAllSysDeptApi } from '#/api';
import { BasicTree } from '#/components/tree';
import UserList from './components/user-list.vue';

const selectedKeys = ref<string[]>([]);
function initData() {
  selectAllSysDeptApi().then((res) => {
    // 转换树数据
    deptTreeData.value = listToTree(treeNodes);
  });
}
initData();
</script>

<template>
  <ColPage :resizable="true" :left-width="20" auto-content-height>
    <template #left>
      <BasicTree v-model:selected-keys="selectedKeys" :tree-data="deptTreeData" title="部门" />
    </template>
    <div class="ml-2 h-full">
      <UserList :dept-id="selectedKeys[0]" />
    </div>
  </ColPage>
</template>
```

### 3.2 列表表格组件（user-list.vue）

核心模式：
1. 使用 `useVbenVxeGrid` 组合式函数
2. 表单搜索用 `VbenFormProps` schema 驱动
3. 表格用 `VxeGridProps` + proxyConfig 远程分页
4. 工具栏用 `<template #toolbar-tools>`
5. 操作列用 `<template #action="{ row }>`

```vue
<script lang="ts" setup>
import type { VbenFormProps } from '#/adapter/form';
import type { VxeGridProps } from '#/adapter/vxe-table';
import { watch } from 'vue';
import { useVbenDrawer } from '@vben/common-ui';
import { Button, Modal, Popconfirm, Space } from 'ant-design-vue';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { selectSysUserApi, getSysUserApi, removeSysUserApi, addSysUserApi } from '#/api';
import { ButtonAdd, ButtonEdit, ButtonRemove } from '#/components/button';
import { initColumns } from './data';
import InputDrawer from './input.vue';

const props = defineProps<{ deptId: string }>();
watch(() => props.deptId, () => handleSearch());

const formOptions: VbenFormProps = {
  collapsed: true,
  schema: [
    { fieldName: 'username', label: '用户名', component: 'Input' },
    { fieldName: 'phoneNumber', label: '手机号', component: 'Input' },
  ],
};

const gridOptions: VxeGridProps = {
  columns: initColumns(),
  proxyConfig: {
    ajax: {
      query: async ({ page }, formValues) => {
        return await selectSysUserApi({ ...formValues, deptId: props.deptId }, page);
      },
    },
  },
};

const [Grid, gridApi] = useVbenVxeGrid({
  tableTitle: '用户信息',
  formOptions,
  gridOptions,
});

const [BaseInputDrawer, baseInputDrawerApi] = useVbenDrawer({
  connectedComponent: InputDrawer,
});

function handleSearch() { gridApi.query(); }
async function handleCreate() {
  addSysUserApi(props.deptId).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}
function handleEdit(id: string) {
  getSysUserApi(id).then((res) => {
    baseInputDrawerApi.setData(res);
    baseInputDrawerApi.open();
  });
}
</script>

<template>
  <Grid>
    <template #toolbar-tools>
      <Space>
        <ButtonAdd :auth-codes="['permission:save']" @click="handleCreate" />
        <ButtonRemove :api="removeSysUserApi" :auth-codes="['permission:remove']" :grid-api="gridApi" @success="handleSearch" />
      </Space>
    </template>
    <template #action="{ row }">
      <ButtonEdit :auth-codes="['permission:save']" size="small" type="link" @click="handleEdit(row.id)" />
      <ButtonRemove :api="removeSysUserApi" :auth-codes="['permission:remove']" :ids="[row.id]" size="small" type="link" @success="handleSearch" />
    </template>
  </Grid>
  <BaseInputDrawer @success="handleSearch" />
</template>
```

### 3.3 data.ts（列定义 + 表单配置）

```typescript
import type { VxeGridPropTypes } from '@vben/plugins/vxe-table';
import { h } from 'vue';
import { message, Switch } from 'ant-design-vue';
import { setSysUserStatusApi } from '#/api';

export const initColumns = (): VxeGridPropTypes.Columns => {
  return [
    { type: 'checkbox', width: 50, fixed: 'left' },
    { title: '序号', type: 'seq', width: 50, fixed: 'left' },
    {
      title: '用户名',
      field: 'username',
      sortable: true,
      fixed: 'left',
      minWidth: 140,
    },
    {
      title: '状态',
      field: 'status',
      sortable: true,
      width: 100,
      slots: {
        default: ({ row }) => {
          return h(Switch, {
            checked: row.status === '1',
            checkedChildren: '启用',
            unCheckedChildren: '禁用',
            loading: row.pendingStatus,
            onChange(checked: boolean) {
              row.pendingStatus = true;
              const newStatus = checked ? '1' : '2';
              setSysUserStatusApi(row.id, newStatus)
                .then(() => { row.status = newStatus; message.success('操作成功'); })
                .finally(() => { row.pendingStatus = false; });
            },
          });
        },
      },
    },
    {
      title: '操作',
      field: 'action',
      width: 200,
      fixed: 'right',
      slots: { default: 'action' },
    },
  ];
};
```

**列配置关键属性**：
- `type: 'checkbox'` - 多选列
- `type: 'seq'` - 序号列
- `slots: { default: 'slotName' }` - 自定义插槽渲染
- `cellRender: { name: 'DictTag', props: { dictType: 'xxx' } }` - 字典标签渲染
- `formatter: 'dateTime'` - 日期格式化

---

## 4. 表单弹窗模式（input.vue）

使用 `VbenForm` 构建新增/编辑表单弹窗：

```vue
<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import { useVbenForm } from '@vben/common-ui';
import { message, Modal } from 'ant-design-vue';
import { saveSysUserApi } from '#/api';

// 通过 useVbenDrawer Data 传入
const props = defineProps<{ data: SysUserVO }>();

const emits = defineEmits<{ (e: 'success'): void }>();

const [BaseForm, baseFormApi] = useVbenForm({
  schema: [
    { fieldName: 'username', label: '用户名', component: 'Input', rules: 'required' },
    { fieldName: 'nickname', label: '昵称', component: 'Input', rules: 'required' },
    { fieldName: 'sex', label: '性别', component: 'ApiSelect', componentProps: { api: selectDictApi, params: { dictType: 'sex' } } },
    { fieldName: 'email', label: '邮箱', component: 'Input' },
    { fieldName: 'phoneNumber', label: '手机号', component: 'Input' },
  ],
  showDefaultActions: false,
});

async function handleSubmit() {
  const { valid } = await baseFormApi.validate();
  if (!valid) return;
  const formData = await baseFormApi.getValues();
  saveSysUserApi(formData).then(() => {
    message.success('保存成功');
    emits('success');
  });
}

// 初始化表单数据
watch(() => props.data, (val) => {
  if (val) { baseFormApi.setValues(val); }
}, { immediate: true });
</script>

<template>
  <Modal title="用户信息" @ok="handleSubmit">
    <BaseForm />
  </Modal>
</template>
```

**表单 Schema 常用组件**：
- `Input` - 文本输入
- `InputNumber` - 数字输入
- `Select` - 下拉选择
- `ApiSelect` - API 驱动下拉（字典等），`componentProps: { api, params }`
- `DatePicker` - 日期选择
- `RadioGroup` - 单选组
- `Switch` - 开关
- `Textarea` - 多行文本
- `ApiTreeSelect` - 树形选择

---

## 5. 路由定义模式

### 5.1 路由定义文件

文件位置：`router/routes/modules/<module>.ts`

```typescript
import type { RouteRecordRaw } from 'vue-router';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    meta: {
      icon: 'ph:users',
      order: 10,
      title: $t('page.user.title'),
    },
    name: 'User',
    path: '/user',
    children: [
      {
        name: 'UserList',
        path: '/user/list',
        component: () => import('#/views/auth/user/list.vue'),
        meta: {
          icon: 'ph:list',
          title: $t('page.user.list'),
        },
      },
    ],
  },
];

export default routes;
```

**路由自动注册**：
- `router/routes/index.ts` 使用 `import.meta.glob('./modules/**/*.ts', { eager: true })` 自动收集
- 路由文件放 `router/routes/modules/` 下即自动注册
- 无需手动 import

### 5.2 权限路由

```typescript
// router/access.ts
async function generateAccess(options) {
  return await generateAccessible(preferences.app.accessMode, {
    ...options,
    fetchMenuListAsync: async () => {
      return await getCurrentUserRouteApi();  // 从后端获取用户菜单
    },
    forbiddenComponent: () => import('#/views/_core/fallback/forbidden.vue'),
  });
}
```

---

## 6. 国际化模式

文件位置：`locales/langs/zh-CN/page.json`

```json
{
  "user": {
    "title": "用户管理",
    "list": "用户列表",
    "create": "新建用户",
    "edit": "编辑用户",
    "delete": "删除用户"
  }
}
```

Key 命名规范：`page.<模块>.<页面>.<元素>`
- 模板：`{{ $t('page.user.title') }}`
- 脚本：`const { t } = useI18n(); t('page.user.title')`

路由中直接使用 `$t()` 函数引用。

---

## 7. 按钮组件

项目封装了统一按钮组件，位于 `#/components/button`：

```vue
<!-- 新增按钮（带权限） -->
<ButtonAdd :auth-codes="['sys:user:save']" @click="handleCreate" />

<!-- 编辑按钮（带权限） -->
<ButtonEdit :auth-codes="['sys:user:save']" @click="handleEdit(row.id)" />

<!-- 删除按钮（带权限，支持批量） -->
<ButtonRemove :api="removeApi" :auth-codes="['sys:user:remove']" :ids="[row.id]" :grid-api="gridApi" @success="handleSearch" />
```

---

## 8. 导入别名

```typescript
import { requestClient } from '#/api';          // API 函数
import { $t } from '#/locales';                 // 国际化
import * from '#/components/xxx';               // 组件
import * from '#/views/xxx';                    // 页面
import * from '#/store';                        // Store
import * from '#/utils';                        // 工具
import * from '#/composables';                  // 组合式函数
```

---

## 9. 关键组件速查

| 组件 | 路径 | 用途 |
|------|------|------|
| `ColPage` | `@vben/common-ui` | 左右列分栏布局 |
| `BasicTree` | `#/components/tree` | 通用树组件 |
| `useVbenVxeGrid` | `#/adapter/vxe-table` | VxeGrid 表格组合式函数 |
| `useVbenDrawer` | `@vben/common-ui` | 抽屉弹窗 |
| `useVbenForm` | `@vben/common-ui` | 表单组合式函数 |
| `AccessControl` | `@vben/access` | 权限控制包裹组件 |
| `VbenAvatar` | `@vben/common-ui` | 头像组件 |
