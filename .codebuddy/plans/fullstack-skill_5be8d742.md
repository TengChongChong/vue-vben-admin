---
name: fullstack-skill
overview: 为 easy-vben 项目创建「Vue 3 + Spring Boot 全栈开发」团队级 skill，覆盖 CRUD 代码生成、数据库设计、API 对接、前端页面搭建、前后端联调五大核心能力。
todos:
  - id: init-skill-structure
    content: 初始化 skill 目录结构，创建 .codebuddy/skills/easy-vben-fullstack/ 及子目录
    status: completed
  - id: collect-frontend-patterns
    content: 使用 [subagent:code-explorer] 收集前端关键代码模式（API 请求、list.vue、data.ts、modal-form、路由定义），编写 references/frontend-conventions.md
    status: completed
    dependencies:
      - init-skill-structure
  - id: collect-backend-patterns
    content: 使用 [subagent:code-explorer] 收集后端关键代码模式（Controller、Service、ServiceImpl、Entity、Mapper），编写 references/backend-conventions.md
    status: completed
    dependencies:
      - init-skill-structure
  - id: write-api-guide
    content: 编写 references/api-design-guide.md，定义前后端 API 设计约定（命名、路径、参数、响应格式、分页规范）
    status: completed
    dependencies:
      - collect-frontend-patterns
      - collect-backend-patterns
  - id: create-asset-templates
    content: 创建 assets/ 下的全部代码模板文件（后端 6 个、前端 6 个、集成检查清单 1 个）
    status: completed
    dependencies:
      - collect-frontend-patterns
      - collect-backend-patterns
  - id: write-crud-template-guide
    content: 编写 references/crud-template-guide.md，说明各模板的使用方法和变量替换规则
    status: completed
    dependencies:
      - create-asset-templates
  - id: write-skill-md
    content: 使用 [skill:skill-creator] 编写 SKILL.md，定义触发条件、工作流程和指令，引用所有 references 和 assets
    status: completed
    dependencies:
      - write-api-guide
      - write-crud-template-guide
---

## 产品概述

为 easy-vben 全栈项目创建一个团队共享的项目级 CodeBuddy skill，使 AI 助手能够按照项目既有规范和约定，高效完成全栈开发任务。

## 核心能力

### 1. 前后端 CRUD 代码生成

从一个业务实体定义出发，自动生成完整的前后端 CRUD 代码链路：

- 后端：Entity 实体类 → Mapper 接口 → Service 接口及实现 → Controller 控制器
- 前端：API 请求函数 → 列表页（list.vue）→ 表单配置（data.ts）→ 路由注册 → 国际化词条

### 2. 数据库表设计与迁移

基于实体设计，生成符合 MyBatis-Plus 规范的 DDL 建表语句，包含 BaseEntity 公共字段（id、create_time、update_time、create_by、update_by、del_flag 等），并关联到项目现有的数据库迁移方案。

### 3. API 接口设计与对接

- 定义符合项目规范的后端接口：使用 R 统一响应、TableResult 分页、@PreAuthorize 权限控制、@Validated 参数校验
- 生成前端 API 调用函数：基于 requestClient，遵循 getXxx/createXxx/updateXxx/deleteXxx 命名规范

### 4. 前端页面快速搭建

- 列表页：VxeTable 表格 + VbenForm 搜索表单 + 分页 + 批量操作工具栏
- 表单弹窗：VbenForm schema 驱动的新增/编辑表单，支持字典下拉、部门/用户选择等组件
- 按照 views/模块/list.vue + components/ + data.ts 的标准结构组织

### 5. 前后端联调与调试

- 确认前后端接口路径、参数、响应格式一致性
- 验证路由、权限、租户头配置
- 检查国际化 key 映射完整性

## 技术方案

### Skill 结构设计

采用标准的 skill 三层结构：SKILL.md（核心指令）+ references/（参考文档）+ assets/（模板资源）。

```
.codebuddy/skills/easy-vben-fullstack/
├── SKILL.md                          # 核心指令：定义触发条件和工作流程
├── references/
│   ├── frontend-conventions.md       # 前端开发规范速查（VbenForm/VxeTable/路由/国际化模式）
│   ├── backend-conventions.md        # 后端开发规范速查（分层/MyBatis-Plus/R响应/分页模式）
│   ├── api-design-guide.md           # API 设计约定（命名/路径/参数/响应格式）
│   └── crud-template-guide.md        # CRUD 模板使用指南
└── assets/
    ├── backend-templates/
    │   ├── Controller.java.tmpl      # Controller 模板
    │   ├── Service.java.tmpl         # Service 接口模板
    │   ├── ServiceImpl.java.tmpl     # Service 实现模板
    │   ├── Entity.java.tmpl          # Entity 模板
    │   ├── Mapper.java.tmpl          # Mapper 模板
    │   └── ddl.sql.tmpl              # DDL 建表模板
    ├── frontend-templates/
    │   ├── list.vue.tmpl             # 列表页模板
    │   ├── data.ts.tmpl              # 表单/表格配置模板
    │   ├── api.ts.tmpl               # API 请求模板
    │   ├── route.ts.tmpl             # 路由定义模板
    │   ├── modal-form.vue.tmpl       # 新增/编辑弹窗模板
    │   └── i18n-zh.json.tmpl         # 中文国际化模板
    └── integration-templates/
        └── full-crud-checklist.md    # CRUD 全链路检查清单
```

### SKILL.md 核心设计

SKILL.md 作为 skill 的入口，定义清晰的三段式结构：

**1. 触发条件**

- 当用户提及"创建新模块""加一个XX管理""生成CRUD""新增实体"等关键词时自动激活
- 当用户需要在 easy-vben 项目中做前后端联调、API 对接、页面搭建时激活

**2. 工作流程**

```
[用户需求] → [分析实体结构]
    → [生成后端代码] → Entity → Mapper → Service → ServiceImpl → Controller
    → [生成 DDL] → 建表 SQL
    → [生成前端代码] → API 函数 → data.ts 配置 → list.vue 列表页 → modal-form.vue 弹窗
    → [注册路由] → router/routes/modules/
    → [注册国际化] → locales/langs/zh-CN/page.json
    → [联调检查] → 路径一致性 / 响应格式 / 权限配置
```

**3. 指令要点**

- 严格按照 references/ 中的约定生成代码
- 使用 assets/ 中的模板作为代码骨架
- 生成后自动执行 crud-checklist.md 中的检查项
- 提示用户需要手动完成的步骤（如菜单配置、权限分配）

### 关键技术决策

1. **模板驱动而非脚本驱动**：由于项目已高度规范化，用模板文件（.tmpl）比脚本更灵活，AI 可根据实体差异调整模板填充逻辑
2. **references/ 与 SKILL.md 分离**：将详细的约定文档放在 references/ 中，SKILL.md 只保留工作流程指令，避免上下文窗口膨胀
3. **检查清单内置**：在 assets/ 中包含 CRUD 全链路检查清单，确保每次生成后自动执行验证

## Agent Extensions

### Skill

- **skill-creator**
- 用途：指导 skill 的规范化创建，确保 SKILL.md 符合 skill 标准格式，正确使用 YAML frontmatter 和渐进式披露设计
- 预期结果：生成结构完整、符合 CodeBuddy skill 规范的 SKILL.md 文件和配套资源

### SubAgent

- **code-explorer**
- 用途：探索 easy-vben 项目中的具体代码模式，提取真实代码示例用于 references/ 文档编写，确保模板和规范与实际项目完全一致
- 预期结果：获取精确的前后端代码示例（Controller/Service/Entity/list.vue/data.ts 等），作为 references/ 和模板文件的内容基础