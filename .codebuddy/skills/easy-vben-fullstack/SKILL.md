---
name: easy-vben-fullstack
description: |
  This skill is for the easy-vben full-stack project (Vue 3 + Vben Admin + Spring Boot + MyBatis-Plus).
  It should be used when the user needs to:
  - Create new CRUD modules (entities, pages, APIs)
  - Generate backend code (Controller, Service, ServiceImpl, Entity, Mapper, DDL)
  - Generate frontend code (list page, form modal, API functions, routes, i18n)
  - Design and integrate frontend-backend APIs
  - Debug frontend-backend integration issues
  - Scaffold full-stack features from an entity definition
  Trigger keywords: "创建模块", "新增实体", "生成CRUD", "全栈开发", "前后端对接", "加一个管理", "建表", "API对接", "新增管理页面"
---

# easy-vben 全栈开发 Skill

## 概述

此 skill 为 easy-vben 全栈项目（Vue 3 + Vben Admin + Spring Boot + MyBatis-Plus）提供标准化的全栈开发支持。核心能力包括：

1. **CRUD 代码生成** — 从实体定义出发，生成完整的前后端 CRUD 代码链路
2. **数据库表设计** — 生成符合项目规范的 DDL 建表语句
3. **API 接口设计** — 设计并生成前后端一致的 API 接口
4. **前端页面搭建** — 生成列表页、表单弹窗、路由、国际化
5. **联调验证** — 检查前后端接口的一致性

## 触发条件

当用户提出以下类型的请求时，应激活此 skill：

- "帮我创建一个 XX 管理模块"
- "新增 XX 实体，前后端都要"
- "生成 XX 的 CRUD 代码"
- "给 XX 表建一个管理页面"
- "前后端对接 XX 接口"
- "新增一个管理页面"
- 任何涉及 easy-vben 项目前后端同步开发的请求

## 前置要求

在生成代码前，确认以下信息（缺失时主动询问用户）：

1. **实体名称**（必须）— 如 `SysNotice`（PascalCase）
2. **中文名称**（必须）— 如 `通知公告`
3. **所属模块**（必须）— 如 `sys`（前端 views 路径）和 `sys`（后端 package 路径），默认推断
4. **业务字段**（必须）— 字段名、类型、是否必填、是否搜索条件、是否表格列

## 工作流程

### 步骤 1：需求分析

解析用户输入，提取以下变量：

- `{{EntityName}}` — 如 `SysNotice`
- `{{entityName}}` — 如 `sysNotice`
- `{{entity-name}}` — 如 `sys-notice`
- `{{entity_names}}` — 如 `sys_notice`
- `{{tableComment}}` — 如 `通知公告`
- `{{module}}` — 如 `sys`
- `{{module.name}}` — 如 `sys`

参考 `references/crud-template-guide.md` 获取完整的变量映射表。

### 步骤 2：生成后端代码

严格按照 `references/backend-conventions.md` 中的模式，依次生成以下文件：

| 文件 | 路径模板 | 关键规范 |
|------|----------|---------|
| Entity | `easy-sys/.../model/{{EntityName}}.java` | 继承 `Model<Entity>`, 包含公共字段, `@TableId String id` |
| Mapper | `easy-sys/.../dao/{{EntityName}}Mapper.java` | 继承 `BaseMapper`, 包含 `select(Page, QueryWrapper)` |
| Service | `easy-sys/.../service/{{EntityName}}Service.java` | 接口，声明完整 CRUD 方法 |
| ServiceImpl | `easy-sys/.../service/impl/{{EntityName}}ServiceImpl.java` | 继承 `ServiceImpl<Mapper, Entity>`, `@Transactional` |
| Controller | `easy-sys/.../controller/{{EntityName}}Controller.java` | 继承 `BaseController`, `@ResponseResult`, `@SaCheckPermission` |
| DDL | — | `sys_` 前缀, 公共字段, InnoDB |

**权限标识格式**：`{{module.name}}:{{entity-name}}:select` / `:save` / `:remove`

参考模板文件：
- `assets/backend-templates/Entity.java.tmpl`
- `assets/backend-templates/Mapper.java.tmpl`
- `assets/backend-templates/Service.java.tmpl`
- `assets/backend-templates/ServiceImpl.java.tmpl`
- `assets/backend-templates/Controller.java.tmpl`
- `assets/backend-templates/ddl.sql.tmpl`

### 步骤 3：生成前端代码

严格按照 `references/frontend-conventions.md` 中的模式，依次生成以下文件：

| 文件 | 路径模板 | 关键规范 |
|------|----------|---------|
| API 函数 | `apps/web-antd/src/.../{{entity-name}}.ts` | `select/get/add/save/remove + {{EntityName}} + Api` |
| 列表页 | `apps/web-antd/src/views/{{module}}/{{entity-name}}/list.vue` | `useVbenVxeGrid` + `useVbenDrawer` |
| 数据配置 | `apps/web-antd/src/views/{{module}}/{{entity-name}}/data.ts` | `initColumns()` 列定义 |
| 表单弹窗 | `apps/web-antd/src/views/{{module}}/{{entity-name}}/{{entity-name}}-modal.vue` | `useVbenForm` + `Modal` |
| 路由 | `apps/web-antd/src/router/routes/modules/{{entity-name}}.ts` | 自动注册, `$t()` 国际化 |
| 国际化 | `locales/langs/zh-CN/page.json` & `en-US/page.json` | `page.{{entity-name}}.*` |

**前端文件必须放在 `components/` 子目录还是模块根目录**：
- 简单模块（单个列表页）：文件直接放 `views/{{module}}/{{entity-name}}/`
- 复杂模块（多标签/多视图）：主入口 `list.vue` + 组件放 `components/`

参考模板文件：
- `assets/frontend-templates/api.ts.tmpl`
- `assets/frontend-templates/list.vue.tmpl`
- `assets/frontend-templates/data.ts.tmpl`
- `assets/frontend-templates/modal-form.vue.tmpl`
- `assets/frontend-templates/route.ts.tmpl`
- `assets/frontend-templates/i18n-zh.json.tmpl`

### 步骤 4：联调验证

生成完成后，按 `assets/integration-templates/full-crud-checklist.md` 逐项检查：

1. **路径一致性** — 前端 API 路径 vs 后端 `@RequestMapping`
2. **方法一致性** — GET/POST/DELETE vs `@GetMapping/@PostMapping/@DeleteMapping`
3. **参数一致性** — 请求参数 vs 后端接收参数
4. **响应字段一致性** — 注意后端 JSON 下划线风格
5. **权限一致性** — 前端 `auth-codes` vs 后端 `@SaCheckPermission`
6. **状态映射一致性** — '1'=启用, '2'=禁用 等

### 步骤 5：用户待办提示

生成完成后，明确提示用户需要手动完成的步骤：

1. ✋ 执行 DDL 创建数据库表
2. ✋ 在数据库菜单表中配置菜单项
3. ✋ 在数据库角色权限表中分配权限
4. ✋ 如需自定义 SQL，创建 XML mapper 文件
5. ✋ 运行后端项目验证接口
6. ✋ 运行前端项目验证页面

## API 设计参考

严格按照 `references/api-design-guide.md` 设计接口：

| 操作 | 方法 | 路径 | 权限 |
|------|------|------|------|
| 列表 | GET | `/api/{{module}}/{{entity-name}}` | `{{module.name}}:{{entity-name}}:select` |
| 详情 | GET | `/api/{{module}}/{{entity-name}}/{id}` | `{{module.name}}:{{entity-name}}:select` |
| 新增 | GET | `/api/{{module}}/{{entity-name}}/add` | `{{module.name}}:{{entity-name}}:save` |
| 保存 | POST | `/api/{{module}}/{{entity-name}}` | `{{module.name}}:{{entity-name}}:save` |
| 删除 | DELETE | `/api/{{module}}/{{entity-name}}/{ids}` | `{{module.name}}:{{entity-name}}:remove` |
| 状态 | POST | `/api/{{module}}/{{entity-name}}/{id}/status/{status}` | `{{module.name}}:{{entity-name}}:save` |

## 关键约束

1. **所有生成的代码必须使用项目已有的组件和模式**，不得引入新的依赖
2. **Entity 的主键必须使用 `String` 类型**
3. **Controller 必须有 `@ResponseResult` 注解**
4. **Controller 必须继承 `BaseController`**
5. **前端列表页必须使用 `useVbenVxeGrid` + `buildTenantGridId`**
6. **前端弹窗必须使用 `useVbenDrawer`**
7. **国际化 key 必须遵循 `page.{{entity-name}}.{{element}}` 格式**
8. **路由文件放在 `router/routes/modules/` 下即可自动注册**

## 参考文档索引

- `references/frontend-conventions.md` — 前端开发规范速查
- `references/backend-conventions.md` — 后端开发规范速查
- `references/api-design-guide.md` — API 设计约定
- `references/crud-template-guide.md` — 模板使用指南
- `assets/integration-templates/full-crud-checklist.md` — CRUD 全链路检查清单
