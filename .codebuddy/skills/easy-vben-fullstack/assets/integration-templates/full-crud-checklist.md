# CRUD 全链路检查清单

> 生成 CRUD 代码后，按此清单逐项验证前后端代码的一致性和完整性。

---

## 后端检查

### Entity
- [ ] Entity 类继承 `Model<{{EntityName}}>` + `implements Serializable`
- [ ] 包含 `@TableId private String id` 雪花主键
- [ ] 包含业务字段及对应的 JSR303 校验注解
- [ ] 包含公共字段：`version`, `createUser`, `createDate`, `editUser`, `editDate`
- [ ] 公共字段使用 `@TableField(fill = ...)` 自动填充
- [ ] 使用 `@Version` 标注乐观锁字段
- [ ] `@JsonInclude(NON_NULL)` 标注 null 不输出字段

### Mapper
- [ ] Mapper 接口 `extends BaseMapper<{{EntityName}}>`
- [ ] 包含 `select(Page<{{EntityName}}> page, @Param("ew") QueryWrapper<{{EntityName}}> queryWrapper)` 方法
- [ ] 如需复杂 SQL，创建对应的 XML mapper 在 `dao/mapping/` 下

### Service
- [ ] Service 接口包含完整的 CRUD 方法声明
- [ ] ServiceImpl 继承 `ServiceImpl<{{EntityName}}Mapper, {{EntityName}}>`
- [ ] ServiceImpl 实现 Service 接口
- [ ] Select 方法使用 `QueryWrapper` 构建条件，表别名 `t.`
- [ ] Save 方法区分 insert 和 update
- [ ] 增删改方法加 `@Transactional`

### Controller
- [ ] Controller 继承 `BaseController`
- [ ] 类注解：`@RestController` + `@ResponseResult` + `@RequestMapping`
- [ ] 每个方法加 `@SaCheckPermission` 权限注解
- [ ] GET 列表接口支持分页参数（Page 自动绑定）
- [ ] POST 保存接口使用 `@RequestBody @Valid`
- [ ] DELETE 接口支持逗号分隔多 ID

### DDL
- [ ] 表名使用 `sys_` 前缀 + 下划线
- [ ] 主键 `varchar(19) NOT NULL`
- [ ] 包含公共字段：version, tenant_id, status, create_user, create_date, edit_user, edit_date
- [ ] 使用 `ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`

---

## 前端检查

### API 函数
- [ ] 函数命名遵循 `select/get/add/save/remove/set + {{EntityName}} + Api` 规范
- [ ] 请求路径与后端 `@RequestMapping` 一致
- [ ] HTTP 方法与后端注解一致
- [ ] 请求参数类型与后端接收参数对应
- [ ] 分页接口 params 格式正确

### 列表页（list.vue）
- [ ] 使用 `useVbenVxeGrid` 组合式函数
- [ ] formOptions.schema 包含搜索字段
- [ ] gridOptions.proxyConfig.ajax.query 调用 select API
- [ ] toolbar-tools 包含 ButtonAdd 和 ButtonRemove
- [ ] action 列包含 ButtonEdit 和 ButtonRemove
- [ ] 按钮 auth-codes 与后端权限一致
- [ ] 新增/编辑弹窗通过 useVbenDrawer 管理

### 数据配置（data.ts）
- [ ] 列定义包含 checkbox 和序号列
- [ ] 每个业务字段有对应的列配置
- [ ] 操作列使用 `slots: { default: 'action' }`
- [ ] 字典字段使用 `cellRender: { name: 'DictTag' }`
- [ ] 日期字段使用 `formatter: 'dateTime'`

### 表单弹窗（modal-form.vue）
- [ ] 使用 `useVbenForm` 组合式函数
- [ ] schema 包含所有需要编辑的字段
- [ ] 必填字段加 `rules: 'required'`
- [ ] 字典字段使用 `ApiSelect` 组件
- [ ] 提交调用 save API
- [ ] 初始化时通过 watch 设置表单值

### 路由
- [ ] 路由文件放在 `router/routes/modules/` 下
- [ ] meta 包含 icon, order, title
- [ ] 使用 `$t()` 国际化函数
- [ ] component 路径正确指向 views 下的文件

### 国际化
- [ ] `locales/langs/zh-CN/page.json` 添加对应 key
- [ ] `locales/langs/en-US/page.json` 添加对应英文翻译
- [ ] Key 命名遵循 `page.{{entity-name}}.{{element}}` 格式

---

## 联调检查

- [ ] 前端 API 路径与后端 Controller `@RequestMapping` 一致
- [ ] 请求参数 key 与后端接收参数一致（注意后端 JSON 下划线风格 `page_result`）
- [ ] 响应数据字段与前端使用字段一致
- [ ] 分页参数 current/size 与后端 Page 绑定一致
- [ ] 权限标识前端 auth-codes 与后端 @SaCheckPermission 一致
- [ ] 状态值映射一致（'1'=启用, '2'=禁用 等）
- [ ] 操作后刷新列表数据
- [ ] 新增/编辑弹窗能正确初始化数据
- [ ] 删除操作有确认提示
