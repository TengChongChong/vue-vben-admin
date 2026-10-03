# easy-vben 前后端 API 设计约定

> 本文档定义 easy-vben 项目中前后端 API 接口的设计规范，确保前后端接口路径、参数、响应格式的一致性。

---

## 1. 接口路径规范

### 格式

```
/api/{模块}/{实体}
```

### 命名规则

- 全小写，单词用 `/` 或 `-` 分隔
- 模块：auth/sys/file/generator/cms 等
- 实体：sys/user、sys/role、sys/dept 等

### 示例

| 功能 | HTTP 方法 | 路径 | 权限 |
|------|-----------|------|------|
| 分页列表 | GET | `/api/auth/sys/user` | `sys:user:select` |
| 详情 | GET | `/api/auth/sys/user/{id}` | `sys:user:select` |
| 新增（获取默认值） | GET | `/api/auth/sys/user/add/{deptId}` | `sys:user:save` |
| 保存 | POST | `/api/auth/sys/user` | `sys:user:save` |
| 删除 | DELETE | `/api/auth/sys/user/{id}` | `sys:user:remove` |
| 设置状态 | POST | `/api/auth/sys/user/{id}/status/{status}` | `sys:user:save` |

---

## 2. 请求参数规范

### 2.1 GET 查询参数（分页）

```
GET /api/auth/sys/user?current=1&size=10&username=admin&status=1
```

前端传递 query 参数，Spring MVC 自动绑定到 VO 对象。

### 2.2 POST 请求体

```json
POST /api/auth/sys/user
Content-Type: application/json

{
  "id": "1234567890123456789",
  "username": "admin",
  "nickname": "管理员",
  "sex": "1",
  "status": "1",
  "deptId": "1234567890123456789"
}
```

使用 `@RequestBody @Valid` 接收并校验。

### 2.3 路径变量

```
GET  /api/auth/sys/user/1234567890123456789
POST /api/auth/sys/user/1234567890123456789/status/1
```

使用 `@PathVariable` 接收。

### 2.4 批量删除

```
DELETE /api/auth/sys/user/123,456,789
```

多个 ID 用逗号分隔，后端 `split(",")` 处理。

---

## 3. 响应格式规范

### 3.1 统一响应结构

```json
{
  "success": true,
  "code": 0,
  "message": "",
  "data": ...
}
```

后端使用 `@ResponseResult` 注解自动包装，前端 `defaultResponseInterceptor` 配置 `codeField: 'success'`, `dataField: 'data'` 自动解包。

### 3.2 分页响应

```json
{
  "success": true,
  "code": 0,
  "message": "",
  "data": {
    "total": 100,
    "current": 1,
    "size": 10,
    "page_result": [
      { "id": "1", "username": "admin", ... }
    ]
  }
}
```

**重要**：
- 后端 JSON key 使用下划线风格，`page_result` 而非 `pageResult`
- 前端 `responseReturn: 'data'` 后，API 调用直接返回 `{ total, current, size, page_result: [...] }`
- 前端 VxeTable 的 proxyConfig 自动处理分页字段

### 3.3 错误响应

```json
{
  "success": false,
  "code": 500,
  "message": "用户名不能为空",
  "errorMessage": "用户名不能为空",
  "showType": "error"
}
```

前端 `errorMessageResponseInterceptor` 自动提取 `errorMessage` + `showType` 并显示消息。

### 3.4 树形数据响应

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "parentId": "0",
      "title": "总公司",
      "value": "1",
      "key": "1",
      "children": [...]
    }
  ]
}
```

前端使用 `listToTree()` 转换平铺数据为树结构。

---

## 4. 前端 API 函数规范

### 4.1 函数命名

```
selectXxxApi    - 分页列表查询
getXxxApi       - 获取详情
addXxxApi       - 新增（返回默认值/空对象）
saveXxxApi      - 保存（新增或更新）
removeXxxApi    - 删除
resetXxxApi     - 重置操作
setXxxStatusApi - 设置状态
```

### 4.2 函数签名模板

```typescript
// 分页列表：params 查询条件 + page 分页参数
export function selectSysUserApi(params: SysUserVO, page: PageParams) {
  return requestClient.get<PageResult<SysUserVO>>('/auth/sys/user', { params: { ...params, ...page } });
}

// 详情
export function getSysUserApi(id: string) {
  return requestClient.get<SysUserVO>(`/auth/sys/user/${id}`);
}

// 新增（获取默认值）
export function addSysUserApi(deptId?: string) {
  return requestClient.get<SysUserVO>('/auth/sys/user/add', { params: { deptId } });
}

// 保存
export function saveSysUserApi(data: SysUserVO) {
  return requestClient.post<SysUserVO>('/auth/sys/user', data);
}

// 删除
export function removeSysUserApi(ids: string) {
  return requestClient.delete<boolean>(`/auth/sys/user/${ids}`);
}

// 设置状态
export function setSysUserStatusApi(id: string, status: string) {
  return requestClient.post<boolean>(`/auth/sys/user/${id}/status/${status}`);
}
```

---

## 5. 完整 CRUD 接口参考表

以实体 `{Entity}`（转换为 `{entity}` 小写）为例：

| 操作 | 方法 | 后端路径 | 前端函数名 | 权限 |
|------|------|----------|------------|------|
| 列表 | GET | `/api/{module}/{entity}` | `select{Entity}Api` | `{module}:{entity}:select` |
| 详情 | GET | `/api/{module}/{entity}/{id}` | `get{Entity}Api` | `{module}:{entity}:select` |
| 新增 | GET | `/api/{module}/{entity}/add` | `add{Entity}Api` | `{module}:{entity}:save` |
| 保存 | POST | `/api/{module}/{entity}` | `save{Entity}Api` | `{module}:{entity}:save` |
| 删除 | DELETE | `/api/{module}/{entity}/{ids}` | `remove{Entity}Api` | `{module}:{entity}:remove` |
| 状态 | POST | `/api/{module}/{entity}/{id}/status/{status}` | `set{Entity}StatusApi` | `{module}:{entity}:save` |

---

## 6. 前后端对接检查清单

生成代码后，逐项验证以下几点：

- [ ] 前端 API 路径与后端 `@RequestMapping` 一致
- [ ] GET/POST/DELETE 方法与后端 `@GetMapping/@PostMapping/@DeleteMapping` 一致
- [ ] 请求参数格式与后端接收参数一致（query/body/path）
- [ ] 响应字段名与前端使用字段名一致（注意后端 JSON 下划线风格）
- [ ] 分页参数 `current`/`size` 与后端 Page 一致
- [ ] 权限标识与后端 `@SaCheckPermission` 一致
- [ ] 前端路由路径与后端接口模块一致
- [ ] 国际化 key 完整覆盖所有页面文本
