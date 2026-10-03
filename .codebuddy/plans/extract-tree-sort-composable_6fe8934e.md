---
name: extract-tree-sort-composable
overview: 将 `order.vue` 中的树形排序逻辑（`setProps` 和 `onDrop`）提取为独立的 composable 函数 `use-tree-sort.ts`，放在 `views/auth/menu/composables/` 目录下。
todos:
  - id: create-composable
    content: 创建 `apps/web-antd/src/views/auth/menu/composables/use-tree-sort.ts`，提取 `setProps` 和 `onDrop` 函数，接受 `Ref
    status: completed
---

## 用户需求

将 `apps/web-antd/src/views/auth/menu/order.vue` 中的排序相关逻辑（`setProps` 和 `onDrop` 函数）提取为独立的 composable 函数，放在 `auth/menu/composables/` 目录下。

## 核心功能

- 创建 `use-tree-sort.ts` composable，封装树形数据的排序编号分配和拖拽重排逻辑
- 改造 `order.vue`，移除内联的 `setProps` 和 `onDrop` 函数定义，改为使用 composable
- 提取后功能行为完全不变：`setProps` 递归为树节点分配顺序号 `orderNo` 和父节点 ID `parentId`；`onDrop` 处理 Ant Design Vue Tree 组件的拖拽事件，实现节点位置变更

## 技术栈

- 框架：Vue 3 + TypeScript
- UI 组件：Ant Design Vue Tree
- 工具函数：`@vben/utils`（已有 `listToTree`、`treeToList`）

## 实现方案

### 提取策略

将 `order.vue` 中的两个纯排序逻辑函数提取为独立的 composable：

1. **`setProps`**（L67-82）：接收 `TreeProps['treeData']` 和 `parentId`，递归遍历为每个节点设置 `orderNo`（从 1 递增）和 `parentId`
2. **`onDrop`**（L84-156）：接收 `AntTreeNodeDropEvent`，通过内置 `loop` 辅助函数遍历树定位拖拽/目标节点，根据 `dropToGap` 和 `dropPosition` 执行插入操作后更新 `treeData`

### Composable 接口设计

```typescript
// use-tree-sort.ts
export function useTreeSort(treeData: Ref<TreeProps['treeData']>) {
  function setProps(treeNodes: TreeProps['treeData'], parentId: string | undefined): void;
  function onDrop(info: AntTreeNodeDropEvent): void;
  return { setProps, onDrop };
}
```

- 接受响应式 `treeData` 引用，`onDrop` 内部直接通过 `treeData.value` 更新
- `setProps` 仍保持纯函数形式，调用方传入要处理的具体树节点

### 关键设计决策

- **放置位置**：`apps/web-antd/src/views/auth/menu/composables/use-tree-sort.ts`，遵循项目 composable 与功能模块同目录摆放的约定
- **类型处理**：保留原有 `@ts-expect-error` 注释（共 5 处），因为 Ant Design Vue Tree 的 TypeScript 类型定义不完全覆盖内部实现细节，强行修改类型可能引入更大的维护风险
- **职责边界**：`useTreeSort` 只负责排序/拖拽的数据操作，不涉及 API 调用和 Drawer 状态管理，这些仍留在 `order.vue` 组件中