# CRUD 模板使用指南

> 说明如何使用 `assets/` 下的模板文件生成完整的前后端 CRUD 代码。

---

## 1. 模板变量说明

生成代码时，根据用户定义的实体信息替换以下变量：

| 变量 | 说明 | 示例 |
|------|------|------|
| `{{EntityName}}` | PascalCase 实体名 | `SysNotice` |
| `{{entityName}}` | camelCase 实体名 | `sysNotice` |
| `{{entity-name}}` | kebab-case 实体名 | `sys-notice` |
| `{{entity_names}}` | snake_case 表名 | `sys_notice` |
| `{{module}}` | 模块名（java 包路径） | `auth`, `sys` |
| `{{module-path}}` | 前端 views 下模块路径 | `auth`, `sys` |
| `{{module.name}}` | 权限模块前缀 | `sys`（对应 `{{module}}` 的最后一段） |
| `{{tableComment}}` | 表注释/实体中文名 | `通知公告` |
| `{{author}}` | 作者名 | `TengChongChong` |
| `{{date}}` | 日期 | `2026-07-03` |
| `{{menu-icon}}` | 菜单图标（Phosphor Regular 名称，不含 `ph:` 前缀） | `bell` |
| `{{menu-order}}` | 菜单排序 | `100` |

---

## 2. 后端文件生成

### 2.1 Entity（基础）

文件路径：`easy-sys/src/main/java/com/easy/admin/{{module}}/model/{{EntityName}}.java`

- 确定表名 `@TableName("{{entity_names}}")`
- 根据用户需求添加业务字段
- 保留公共字段：`id`, `version`, `createUser`, `createDate`, `editUser`, `editDate`
- 必要时添加 `@NotBlank`, `@NotNull` 校验

### 2.2 Mapper

文件路径：`easy-sys/src/main/java/com/easy/admin/{{module}}/dao/{{EntityName}}Mapper.java`

- 必须包含 `select(Page, QueryWrapper)` 方法
- 如需自定义 SQL，创建 XML mapper 在 `dao/mapping/` 下

### 2.3 Service 接口

文件路径：`easy-sys/src/main/java/com/easy/admin/{{module}}/service/{{EntityName}}Service.java`

- 包含完整 CRUD 方法签名
- 返回类型使用 `Page<{{EntityName}}>` 分页

### 2.4 ServiceImpl

文件路径：`easy-sys/src/main/java/com/easy/admin/{{module}}/service/impl/{{EntityName}}ServiceImpl.java`

- 继承 `ServiceImpl<{{EntityName}}Mapper, {{EntityName}}>`
- 实现 `{{EntityName}}Service` 接口
- Select 方法用 `QueryWrapper` 构建条件
- 增删改加 `@Transactional`
- 使用 `baseMapper` 调用 Mapper 方法

### 2.5 Controller

文件路径：`easy-sys/src/main/java/com/easy/admin/{{module}}/controller/{{EntityName}}Controller.java`

- 继承 `BaseController`
- 加 `@ResponseResult` 注解
- 路径：`/api/{{module}}/{{entity-name}}`
- 每个方法加 `@SaCheckPermission`
- 限制为 6 个基本方法：select/get/add/remove/save/setStatus

### 2.6 DDL

- 表名：`{{entity_names}}`
- 包含所有业务字段 + 公共字段
- 使用 InnoDB + utf8mb4

---

## 3. 前端文件生成

### 3.1 API 函数（api.ts）

文件路径：`apps/web-antd/src/api/modules/{{entity-name}}.ts`

- 定义实体 TypeScript 类型接口
- 5 个 API 函数：select/get/add/save/remove
- 可选：setStatus

### 3.2 列表页（list.vue）

文件路径：`apps/web-antd/src/views/{{module-path}}/{{entity-name}}/list.vue`

- 使用 `useVbenVxeGrid` + `useVbenDrawer`
- 包含搜索表单 + 表格 + 工具栏 + 操作列
- 表格 id 使用 `buildTenantGridId('{{entity-name}}')`

### 3.3 表格数据配置（data.ts）

文件路径：`apps/web-antd/src/views/{{module-path}}/{{entity-name}}/data.ts`

- 导出 `initColumns()` 函数
- 包含 checkbox + seq + 业务列 + action 列
- 字典字段使用 `cellRender: { name: 'DictTag' }`

### 3.4 表单弹窗（modal-form.vue）

文件路径：`apps/web-antd/src/views/{{module-path}}/{{entity-name}}/{{entity-name}}-modal.vue`

- 使用 `useVbenForm` + `Modal`
- Schema 根据实体字段定义
- 字典下拉使用 `ApiSelect`
- 提交调用 save API

### 3.5 路由

文件路径：`apps/web-antd/src/router/routes/modules/{{entity-name}}.ts`

- 放在 `modules/` 下自动注册
- 使用 `$t()` 国际化函数
- 父级菜单 + 子级列表页结构

### 3.6 国际化

- `locales/langs/zh-CN/page.json`：添加中文翻译
- `locales/langs/en-US/page.json`：添加英文翻译

---

## 4. 生成流程

```
用户输入："帮我创建一个通知公告管理模块"
    ↓
1. 解析需求 → 确定 EntityName=SysNotice, tableComment=通知公告
    ↓
2. 后端生成（6 个文件）
   Entity → Mapper → Service → ServiceImpl → Controller → DDL
    ↓
3. 前端生成（6 个文件）
   api.ts → list.vue → data.ts → modal-form.vue → route.ts → i18n
    ↓
4. 联调验证（使用 checklist.md 逐项检查）
    ↓
5. 提示用户手动操作
   - 执行 DDL 创建表
   - 在后端菜单权限表中配置菜单
   - 分配角色权限
```

---

## 5. 注意事项

1. **文件已存在时**：询问用户是否覆盖，或只创建缺失的文件
2. **非标准 CRUD**：如果用户需求超出标准 CRUD（如特殊业务逻辑），先完成标准部分，再单独处理自定义逻辑
3. **关联关系**：如果实体有外键关联（如 deptId），额外生成关联查询方法和前端选择组件
4. **字典字段**：如果实体有字典类型的字段，需确认字典类型 code 并使用 ApiSelect 渲染
5. **权限标识**：始终生成正确的权限标识 `{{module.name}}:{{entity-name}}:select/save/remove`
