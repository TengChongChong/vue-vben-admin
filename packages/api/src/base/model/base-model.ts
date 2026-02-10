export interface BasicPageParams {
  page: number;
  pageSize: number;
}

export interface BasicFetchResult<T> {
  items: T[];
  total: number;
}

/**
 * Basic Model
 */
export interface BasicModel {
  // 创建时间
  createDate?: Date;
  // 创建人
  createUser?: string;
  // 创建人所属部门
  deptId?: string;
  // 修改时间
  editDate?: Date;
  // 修改人
  editUser?: string;
  // id
  id: string;
  // 排序值
  orderNo?: number;
  // 父id
  parentId?: string;
  // 备注
  remarks?: string;
  // 状态
  status?: string;
  // 租户id
  tenantId?: string;
  // 乐观锁
  version?: number;
}
