import type {
  ComponentRecordType,
  GenerateMenuAndRoutesOptions,
  RouteRecordStringComponent,
} from '@vben-core/typings';
import type { RouteRecordRaw } from 'vue-router';

import { cloneDeep, listToTree, mapTree } from '@vben-core/shared';

/**
 * 动态生成路由 - 后端方式
 */
async function generateRoutesByBackend(
  options: GenerateMenuAndRoutesOptions,
): Promise<RouteRecordRaw[]> {
  const { fetchMenuListAsync, layoutMap = {}, pageMap = {} } = options;
  try {
    const menuRoutes = await fetchMenuListAsync?.();
    if (!menuRoutes) {
      return [];
    }

    const normalizePageMap: ComponentRecordType = {};

    for (const [key, value] of Object.entries(pageMap)) {
      normalizePageMap[normalizeViewPath(key)] = value;
    }

    // 后端响应的路由为list，且外层无 BasicLayout
    const treeRoutes = listToTree(menuRoutes);
    // 加一级父路由，使用 BasicLayout布局，且不在面包屑中显示，生成菜单时也将忽略此层
    treeRoutes.forEach((route) => {
      route.children = [cloneDeep(route)];
      route.component = 'BasicLayout';
      route.name = `${route.name}Parent`;
      route.path = `${route.path}`;
      route.meta = {
        // 不在面包屑中显示
        hideInBreadcrumb: true,
      };
    });
    return convertRoutes(treeRoutes, layoutMap, normalizePageMap);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function convertRoutes(
  routes: RouteRecordStringComponent[],
  layoutMap: ComponentRecordType,
  pageMap: ComponentRecordType,
): RouteRecordRaw[] {
  return mapTree(routes, (node) => {
    const route = node as unknown as RouteRecordRaw;
    const { component, name } = node;

    if (!name) {
      console.error('route name is required', route);
    }
    if (!component) {
      // 如果后端设置的路由类型为目录，则没有 component
      return route;
    }
    // layout转换
    if (layoutMap[component]) {
      route.component = layoutMap[component];
      // 页面组件转换
    } else {
      const normalizePath = normalizeViewPath(component);
      let componentPage =
        pageMap[
          normalizePath.endsWith('.vue')
            ? normalizePath
            : `${normalizePath}.vue`
        ];
      if (!componentPage) {
        // 如果未找到对应的页面，视为尚未开发
        componentPage = pageMap['/_core/fallback/coming-soon.vue'];
      }
      route.component = componentPage;
    }
    return route;
  });
}

function normalizeViewPath(path: string): string {
  // 去除相对路径前缀
  const normalizedPath = path.replace(/^(\.\/|\.\.\/)+/, '');

  // 确保路径以 '/' 开头
  const viewPath = normalizedPath.startsWith('/')
    ? normalizedPath
    : `/${normalizedPath}`;

  // TODO: 这里耦合了vben-admin的目录结构
  return viewPath.replace(/^\/views/, '');
}
export { generateRoutesByBackend };
