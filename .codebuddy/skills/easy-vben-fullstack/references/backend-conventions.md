# easy-vben 后端开发规范速查

> 本文档总结 easy-vben 项目中后端（Spring Boot + MyBatis-Plus）的核心开发模式，用于 AI 辅助生成后端代码时参考。

---

## 1. 项目结构

```
easy-vben/
├── easy-api/              # 启动入口（含全局异常处理、响应包装）
├── easy-common/           # 公共模块
│   └── easy-core/
│       └── com.easy.admin.common.core/
│           ├── annotation/ResponseResult.java    # 响应包装注解
│           ├── base/BaseController.java          # 基础控制器
│           ├── common/pagination/Page.java        # 分页模型
│           ├── common/select/Select.java          # 下拉选择模型
│           ├── common/table/Column.java           # 表格列模型
│           ├── constant/CommonConst.java          # 公共常量
│           ├── exception/
│           │   ├── EasyException.java             # 自定义异常
│           │   └── GlobalException.java           # 全局异常枚举
│           └── util/Response.java                 # 统一响应
├── easy-sys/              # 系统管理模块
│   └── com.easy.admin.auth/
│       ├── controller/    # 控制器
│       ├── dao/           # Mapper 接口（XML 在 dao/mapping/）
│       ├── model/         # Entity + VO
│       │   └── vo/        # 视图对象
│       └── service/       # Service 接口 + impl/
└── ...
```

### 模块依赖

```
easy-api → easy-sys → easy-common (core/mybatis/redis/swagger)
```

---

## 2. 分层架构约定

```
Controller (@RestController + @ResponseResult + @SaCheckPermission)
    ↓ 调用
Service (interface + @Service impl)
    ↓ 继承 ServiceImpl<Mapper, Entity>
Mapper (extends BaseMapper<Entity>)
    ↓
XML Mapper (SQL 定义)
```

**关键约定**：
- Controller 只做路由和权限控制，不写业务逻辑
- Service 接口定义方法签名，ServiceImpl 实现
- ServiceImpl 必须 `extends ServiceImpl<Mapper, Entity>`
- Mapper 必须 `extends BaseMapper<Entity>`

---

## 3. Entity 实体模式

```java
package com.easy.admin.auth.model;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.activerecord.Model;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import jakarta.validation.constraints.NotBlank;
import java.io.Serial;
import java.io.Serializable;
import java.util.Date;

@Data
@TableName("sys_user")    // 映射表名
public class SysUser extends Model<SysUser> implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @TableId
    private String id;           // 主键（雪花ID，String 类型）

    @NotBlank(message = "用户名不能为空")
    private String username;     // 业务字段 + JSR303 校验

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;     // 返回时不输出到 JSON

    @Version
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer version;     // 乐观锁

    @TableField(fill = FieldFill.INSERT)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String createUser;   // 创建人（自动填充）

    @TableField(fill = FieldFill.INSERT)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date createDate;     // 创建时间（自动填充）

    @TableField(fill = FieldFill.INSERT_UPDATE)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private String editUser;     // 修改人（自动填充）

    @TableField(fill = FieldFill.INSERT_UPDATE)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Date editDate;       // 修改时间（自动填充）
}
```

**Entity 规范**：
- 继承 `Model<Entity>` + `implements Serializable`
- 主键用 `@TableId`，类型为 `String`（雪花ID）
- 公共字段（createUser/createDate/editUser/editDate）用 `@TableField(fill = ...)` 自动填充
- 乐观锁用 `@Version`
- 校验用 `jakarta.validation.constraints` 注解
- 敏感字段用 `@JsonProperty(access = WRITE_ONLY)` 隐藏
- null 值用 `@JsonInclude(NON_NULL)` 不输出

---

## 4. Mapper 模式

```java
package com.easy.admin.auth.dao;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.easy.admin.auth.model.SysUser;
import com.easy.admin.auth.model.vo.SysUserVO;
import com.easy.admin.common.core.common.pagination.Page;
import org.apache.ibatis.annotations.Param;
import java.util.List;

public interface SysUserMapper extends BaseMapper<SysUser> {

    /**
     * 列表查询
     */
    List<SysUserVO> select(Page<SysUserVO> page, @Param("ew") QueryWrapper<SysUser> queryWrapper);

    /**
     * 详情查询
     */
    SysUser getById(@Param("id") String id);

    /**
     * 更新操作
     */
    int updateUserStatus(@Param("status") String status, @Param("ew") QueryWrapper<SysUser> queryWrapper);
}
```

**Mapper 规范**：
- 继承 `BaseMapper<Entity>`
- 分页查询第一个参数传 `Page<VO>`，第二个传 `@Param("ew") QueryWrapper<Entity>`
- XML 文件放 `dao/mapping/` 下，命名 `EntityMapper.xml`
- 使用 `@Param` 标注参数名

---

## 5. Service 模式

### 5.1 Service 接口

```java
package com.easy.admin.auth.service;

import com.easy.admin.auth.model.SysUser;
import com.easy.admin.auth.model.vo.SysUserVO;
import com.easy.admin.common.core.common.pagination.Page;

public interface SysUserService {
    /** 列表查询 */
    Page<SysUserVO> select(SysUserVO sysUser, Page<SysUserVO> page);
    /** 详情查询 */
    SysUserVO get(String id);
    /** 新增（返回默认值） */
    SysUserVO add(String deptId);
    /** 保存 */
    SysUserVO saveData(SysUserVO sysUser, boolean updateAuthorization);
    /** 删除 */
    boolean remove(String ids);
    /** 设置状态 */
    boolean setStatus(String ids, String status);
}
```

### 5.2 ServiceImpl 实现

```java
package com.easy.admin.auth.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.easy.admin.auth.dao.SysUserMapper;
import com.easy.admin.auth.model.SysUser;
import com.easy.admin.auth.model.vo.SysUserVO;
import com.easy.admin.auth.service.SysUserService;
import com.easy.admin.common.core.common.pagination.Page;
import com.easy.admin.common.core.constant.CommonConst;
import com.easy.admin.exception.BusinessException;
import cn.hutool.core.util.StrUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Arrays;

@Service
public class SysUserServiceImpl extends ServiceImpl<SysUserMapper, SysUser> implements SysUserService {

    @Override
    public Page<SysUserVO> select(SysUserVO sysUser, Page<SysUserVO> page) {
        QueryWrapper<SysUser> queryWrapper = new QueryWrapper<>();
        // 条件构建
        if (StrUtil.isNotBlank(sysUser.getUsername())) {
            queryWrapper.like("t.username", sysUser.getUsername());
        }
        if (StrUtil.isNotBlank(sysUser.getStatus())) {
            if (sysUser.getStatus().contains(CommonConst.SPLIT)) {
                queryWrapper.in("t.status", sysUser.getStatus().split(CommonConst.SPLIT));
            } else {
                queryWrapper.eq("t.status", sysUser.getStatus());
            }
        }
        // 默认排序
        page.setDefaultDesc("t.create_date");
        // 执行查询
        page.setRecords(baseMapper.select(page, queryWrapper));
        return page;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean remove(String ids) {
        List<String> idList = Arrays.asList(ids.split(","));
        return removeByIds(idList);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public SysUserVO saveData(SysUserVO sysUser, boolean updateAuthorization) {
        // 使用 hutool BeanUtil.copyProperties() 转换
        SysUser user = new SysUser();
        BeanUtil.copyProperties(sysUser, user);
        if (StrUtil.isBlank(user.getId())) {
            baseMapper.insert(user);
        } else {
            baseMapper.updateById(user);
        }
        return sysUser;
    }
}
```

**Service 规范**：
- `extends ServiceImpl<Mapper, Entity>` 继承 MyBatis-Plus Service 基类
- 使用 `QueryWrapper` 构建查询条件，表别名用 `t.`
- 查询条件支持逗号分隔多值（`CommonConst.SPLIT`）
- 增删改方法加 `@Transactional`
- 使用 hutool 工具类（`StrUtil`, `BeanUtil`, `Validator`）
- 通过 `baseMapper` 调用 Mapper 方法

---

## 6. Controller 模式

```java
package com.easy.admin.auth.controller;

import cn.dev33.satoken.annotation.SaCheckPermission;
import com.easy.admin.auth.model.SysUser;
import com.easy.admin.auth.model.vo.SysUserVO;
import com.easy.admin.auth.service.SysUserService;
import com.easy.admin.common.core.annotation.ResponseResult;
import com.easy.admin.common.core.base.BaseController;
import com.easy.admin.common.core.common.pagination.Page;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@ResponseResult                          // 自动包装响应为 Response 对象
@RequestMapping("/api/auth/sys/user")    // 路径前缀
public class SysUserController extends BaseController {

    @Autowired
    private SysUserService service;

    /** 列表 */
    @GetMapping
    @SaCheckPermission("sys:user:select")
    public Page<SysUserVO> select(SysUserVO sysUser, Page<SysUserVO> page) {
        return service.select(sysUser, page);
    }

    /** 详情 */
    @GetMapping("{id}")
    @SaCheckPermission("sys:user:select")
    public SysUser get(@PathVariable("id") String id) {
        return service.get(id);
    }

    /** 新增（返回默认值） */
    @GetMapping("add/{deptId}")
    @SaCheckPermission("sys:user:save")
    public SysUserVO add(@PathVariable(value = "deptId", required = false) String deptId) {
        return service.add(deptId);
    }

    /** 保存（新增或更新） */
    @PostMapping
    @SaCheckPermission("sys:user:save")
    public SysUserVO save(@RequestBody @Valid SysUserVO sysUser) {
        return service.saveData(sysUser, true);
    }

    /** 删除 */
    @DeleteMapping("{id}")
    @SaCheckPermission("sys:user:remove")
    public boolean remove(@PathVariable("id") String id) {
        return service.remove(id);
    }

    /** 设置状态 */
    @PostMapping("{id}/status/{status}")
    @SaCheckPermission("sys:user:save")
    public boolean setStatus(@PathVariable("id") String ids, @PathVariable("status") String status) {
        return service.setStatus(ids, status);
    }
}
```

**Controller 规范**：
- 类注解：`@RestController` + `@ResponseResult` + `@RequestMapping`
- 必须继承 `BaseController`
- 使用 `@SaCheckPermission` 做权限校验
- 增删改查方法命名：`select` / `get` / `add` / `save` / `remove`
- RESTful 路径风格：`/api/{module}/{entity}`
- 使用 `@Valid` 触发 JSR303 校验
- 分页接口：Query 参数 + Page 自动绑定
- 权限标识格式：`{module}:{entity}:{action}`

---

## 7. 统一响应与分页

### 7.1 Response 统一响应

```java
// 使用 @ResponseResult 注解，响应自动包装为：
{
  "success": true,    // 是否成功
  "code": 0,         // 状态码
  "message": "",     // 消息
  "data": ...        // 响应数据
}
```

### 7.2 Page 分页模型

```java
// Page 继承 MyBatis-Plus IPage
public class Page<T> extends com.baomidou.mybatisplus.extension.plugins.pagination.Page<T> {
    // 支持 defaultAsc / defaultDesc 设置默认排序
    public void setDefaultDesc(String column) { ... }
}

// 前端传参方式（GET query 参数）：
// ?current=1&size=10&order=create_date&orderType=desc
```

**注意**：后端 JSON key 使用下划线风格（`page_result` 而非 `pageResult`），这是因为 JSON 序列化配置了 snake_case。

---

## 8. 数据库约定

### DDL 建表字段规范

所有表必须包含以下公共字段：

```sql
CREATE TABLE `sys_xxx` (
  `id` varchar(19) NOT NULL COMMENT '主键（雪花ID）',
  -- 业务字段 --

  `version` int DEFAULT 0 COMMENT '乐观锁',
  `tenant_id` varchar(50) DEFAULT NULL COMMENT '租户标识 NULL=未启用多租户',
  `status` varchar(1) DEFAULT '1' COMMENT '状态(1.正常 2.冻结 0.已删除)',
  `create_user` varchar(50) DEFAULT NULL COMMENT '创建人',
  `create_date` datetime DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `edit_user` varchar(50) DEFAULT NULL COMMENT '修改人',
  `edit_date` datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '修改时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='表说明';
```

- 表名：`sys_` 前缀 + 下划线（如 `sys_user`, `sys_role`）
- 主键：`varchar(19)` 雪花ID
- 不使用物理删除，用 `status` 标记（`@TableLogic` 如需逻辑删除额外配置）

---

## 9. 权限标识规范

```
{模块}:{实体}:{操作}
```

| 操作 | 含义 | HTTP 方法 |
|------|------|-----------|
| `select` | 查询（列表/详情） | GET |
| `save` | 新增/修改 | POST/PUT |
| `remove` | 删除 | DELETE |

示例：`sys:user:select`, `sys:role:save`, `sys:dept:remove`

---

## 10. 异常处理

```java
// 业务异常枚举
public enum BusinessException implements EasyServiceException {
    DEPT_EXIST_USER("部门中存在用户，无法删除", "sys:dept:remove"),
    USER_NOT_EXIST("用户不存在", "sys:user:select");
}

// 使用方式
throw new EasyException(BusinessException.USER_NOT_EXIST);
```

全局异常处理器 `ExceptionControllerAdvice` 自动捕获并转换为统一响应格式。

---

## 11. 常用工具与注解速查

| 工具/注解 | 来源 | 用途 |
|-----------|------|------|
| `@Data` | Lombok | 自动生成 getter/setter |
| `@TableName` | MyBatis-Plus | 表名映射 |
| `@TableId` | MyBatis-Plus | 主键标注 |
| `@TableField(fill=...)` | MyBatis-Plus | 自动填充 |
| `@Version` | MyBatis-Plus | 乐观锁 |
| `@SaCheckPermission` | Sa-Token | 权限校验 |
| `@ResponseResult` | 自定义 | 响应自动包装 |
| `@Valid` / `@NotBlank` | Jakarta Validation | 参数校验 |
| `@Transactional` | Spring | 事务控制 |
| `@JsonInclude(NON_NULL)` | Jackson | 不输出 null |
| `@JsonProperty(WRITE_ONLY)` | Jackson | 仅反序列化 |
| `StrUtil` | Hutool | 字符串工具 |
| `BeanUtil.copyProperties()` | Hutool | Bean 拷贝 |
| `Validator.isNotEmpty()` | Hutool | 校验工具 |
