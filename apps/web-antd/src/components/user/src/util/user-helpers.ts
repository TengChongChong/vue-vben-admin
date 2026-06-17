import type { SysUserVO } from '#/api';

import type { TreeDataItem } from 'ant-design-vue/es/tree/Tree';

export function formatUserLabel(
  user: Pick<SysUserVO, 'deptName' | 'nickname' | 'username'>,
) {
  const name = user.nickname || user.username;
  return user.deptName ? `${name} (${user.deptName})` : name;
}

export function formatUserOptionText(
  user: Pick<SysUserVO, 'deptName' | 'nickname' | 'username'>,
) {
  return `${user.username} - ${user.nickname} - ${user.deptName || ''}`;
}

export function enrichUserDeptName(
  user: SysUserVO,
  deptName?: string,
): SysUserVO {
  if (user.deptName || !deptName) {
    return user;
  }
  return { ...user, deptName };
}

export function findDeptTitle(
  nodes: TreeDataItem[],
  deptId?: string,
): string | undefined {
  if (!deptId) {
    return undefined;
  }
  for (const node of nodes) {
    const key = String(node.key ?? node.id ?? '');
    if (key === deptId) {
      return String(node.title ?? '');
    }
    if (node.children?.length) {
      const found = findDeptTitle(node.children, deptId);
      if (found) {
        return found;
      }
    }
  }
  return undefined;
}
