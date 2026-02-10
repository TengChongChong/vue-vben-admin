/**
 * 分页
 */
export interface Page<T> {
  // 当前页
  current?: number;
  // 每页显示条数，默认 15
  pageSize?: number;
  // 查询数据列表
  records?: T[];
  // 排序字段
  sortField?: string;

  // 排序方式
  sortOrder?: string;
  // 总数
  total?: number;
}
