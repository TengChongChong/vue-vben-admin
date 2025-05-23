interface TreeHelperConfig {
  children: string;
  id: string;
  pid: string;
}

// 默认配置
const DEFAULT_CONFIG: TreeHelperConfig = {
  id: 'id',
  pid: 'parentId',
  children: 'children',
};

// 获取配置。  Object.assign 从一个或多个源对象复制到目标对象
const getConfig = (config: Partial<TreeHelperConfig>) =>
  Object.assign({}, DEFAULT_CONFIG, config);

// tree from list
// 列表中的树
export function listToTree<T = any>(
  list: any[],
  config: Partial<TreeHelperConfig> = {},
): T[] {
  const conf = getConfig(config) as TreeHelperConfig;
  const nodeMap = new Map();
  const result: T[] = [];
  const { id, pid, children } = conf;

  for (const node of list) {
    node[children] = node[children] || [];
    nodeMap.set(node[id], node);
  }
  for (const node of list) {
    const parent = nodeMap.get(node[pid]);
    (parent ? parent[children] : result).push(node);
  }
  return result;
}

export function treeToList<T = any>(
  tree: any,
  config: Partial<TreeHelperConfig> = {},
): T {
  config = getConfig(config);
  const { children } = config;
  const result: any = [...tree];
  for (let i = 0; i < result.length; i++) {
    if (!result[i][children!]) continue;
    result.splice(i + 1, 0, ...result[i][children!]);
  }
  return result;
}

export function clearTreeEmptyChildren<T = any>(
  tree: any[],
  children: string,
): T[] {
  tree.forEach((item) => {
    item[children] =
      item[children] &&
      Array.isArray(item[children]) &&
      item[children].length === 0
        ? undefined
        : clearTreeEmptyChildren(item[children], children);
  });
  return tree;
}

export function findNode<T = any>(
  tree: any,
  func: any,
  config: Partial<TreeHelperConfig> = {},
): null | T {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  for (const node of list) {
    if (func(node)) return node;
    node[children!] && list.push(...node[children!]);
  }
  return null;
}

export function findNodeAll<T = any>(
  tree: any,
  func: any,
  config: Partial<TreeHelperConfig> = {},
): T[] {
  config = getConfig(config);
  const { children } = config;
  const list = [...tree];
  const result: T[] = [];
  for (const node of list) {
    func(node) && result.push(node);
    node[children!] && list.push(...node[children!]);
  }
  return result;
}

export function findPath<T = any>(
  tree: any,
  func: any,
  config: Partial<TreeHelperConfig> = {},
): null | T | T[] {
  config = getConfig(config);
  const path: T[] = [];
  const list = [...tree];
  const visitedSet = new Set();
  const { children } = config;
  while (list.length > 0) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      if (func(node)) {
        return path;
      }
    }
  }
  return null;
}

export function findPathAll(
  tree: any,
  func: any,
  config: Partial<TreeHelperConfig> = {},
) {
  config = getConfig(config);
  const path: any[] = [];
  const list = [...tree];
  const result: any[] = [];
  const { children } = config;
  const visitedSet = new Set();
  while (list.length > 0) {
    const node = list[0];
    if (visitedSet.has(node)) {
      path.pop();
      list.shift();
    } else {
      visitedSet.add(node);
      node[children!] && list.unshift(...node[children!]);
      path.push(node);
      func(node) && result.push([...path]);
    }
  }
  return result;
}

export function filter<T = any>(
  tree: T[],
  func: (n: T) => boolean,
  // Partial 将 T 中的所有属性设为可选
  config: Partial<TreeHelperConfig> = {},
): T[] {
  // 获取配置
  config = getConfig(config);
  const children = config.children as string;

  function listFilter(list: T[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        // 递归调用 对含有children项  进行再次调用自身函数 listFilter
        node[children] = node[children] && listFilter(node[children]);
        // 执行传入的回调 func 进行过滤
        return func(node) || (node[children] && node[children].length);
      });
  }

  return listFilter(tree);
}

export function forEach<T = any>(
  tree: T[],
  func: (n: T) => any,
  config: Partial<TreeHelperConfig> = {},
): void {
  config = getConfig(config);
  const list: any[] = [...tree];
  const { children } = config;
  for (let i = 0; i < list.length; i++) {
    // func 返回true就终止遍历，避免大量节点场景下无意义循环，引起浏览器卡顿
    if (func(list[i])) {
      return;
    }
    children &&
      list[i][children] &&
      list.splice(i + 1, 0, ...list[i][children]);
  }
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMap<T = any>(
  treeData: T[],
  opt: { children?: string; conversion: any },
): T[] {
  return treeData.map((item) => treeMapEach(item, opt));
}

/**
 * @description: Extract tree specified structure
 * @description: 提取树指定结构
 */
export function treeMapEach(
  data: any,
  { conversion, children = 'children' }: { children?: string; conversion: any },
) {
  const haveChildren =
    Array.isArray(data[children]) && data[children].length > 0;
  const conversionData = conversion(data) || {};
  return haveChildren
    ? {
        ...conversionData,
        [children]: data[children].map((i: number) =>
          treeMapEach(i, {
            children,
            conversion,
          }),
        ),
      }
    : {
        ...conversionData,
      };
}

/**
 * 将后端返回的选中数据转为Tree所需的选中数据
 *
 * @param treeData 树数据
 * @param checkedKeys 选中节点key
 */
export function convertCheckedKeys(treeData: any[], checkedKeys: string[]) {
  if (!checkedKeys || !Array.isArray(checkedKeys) || checkedKeys.length === 0) {
    return [];
  }
  const checked: {
    checked: string[];
    halfChecked: string[];
  } = {
    checked: [],
    halfChecked: [],
  };

  checkedKeys.forEach((key) => {
    const currentNode = findNode(treeData, (n: any) => n.key === key);
    if (currentNode) {
      if (currentNode.children && currentNode.children.length > 0) {
        const childrenArray = treeToList(currentNode.children);
        let hav = true;
        for (let i = 0; i < childrenArray.length && hav; i++) {
          if (!checkedKeys.includes(childrenArray[i].key)) {
            // 子节点未全部选中
            hav = false;
          }
        }
        if (hav) {
          checked.checked.push(key);
        } else {
          checked.halfChecked.push(key);
        }
      } else {
        // 没有子节点，全选状态
        checked.checked.push(key);
      }
    }
  });

  return checked;
}
