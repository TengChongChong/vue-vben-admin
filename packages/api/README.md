# @vben/api

公共 API 层，供多应用（如 web-antd、web-antdv-next 等）复用接口定义与类型。

## 使用方式

1. **在应用中安装**：应用已依赖 `@vben/api`（workspace 内为 `workspace:*`）。

2. **注入请求客户端**：在应用内创建好 `requestClient` 与可选的 `baseRequestClient` 后，在入口（如 `request.ts` 末尾）调用：

   ```ts
   import { setRequestClient } from '@vben/api';
   setRequestClient(requestClient, baseRequestClient);
   ```

3. **在业务中引用**：
   ```ts
   import { selectSysUserApi } from '@vben/api';
   // 或在 web-antd 中继续使用 #/api/xxx（通过 re-export）
   ```

## 说明

- 本包只包含接口方法与类型，不创建请求实例；请求客户端由各应用在 `request.ts` 中创建并注入。
- 包内通过 `#/api/*` 路径别名（见 `tsconfig.json`）解析内部引用。
