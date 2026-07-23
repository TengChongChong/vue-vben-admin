export function buildUserColumnsBatchItems(
  selectedSiteIds: string[],
  columnSelections: Map<string, string[]>,
) {
  return selectedSiteIds.map((siteId) => ({
    siteId,
    columnIds: columnSelections.get(siteId) ?? [],
  }));
}

export function diffRemovedSiteIds(oldSiteIds: string[], newSiteIds: string[]) {
  const newSet = new Set(newSiteIds);
  return oldSiteIds.filter((siteId) => !newSet.has(siteId));
}

/**
 * BasicTree 在 checkStrictly 时会回传 `{ checked, halfChecked }`，统一成 key 数组。
 */
export function normalizeCheckedKeys(
  value:
    | null
    | number[]
    | string[]
    | undefined
    | { checked?: Array<number | string>; halfChecked?: Array<number | string> },
): string[] {
  if (!value) {
    return [];
  }
  if (Array.isArray(value)) {
    return value.map(String);
  }
  if (Array.isArray(value.checked)) {
    return value.checked.map(String);
  }
  return [];
}
