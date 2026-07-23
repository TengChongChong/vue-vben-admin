import { describe, expect, it } from 'vitest';

import {
  buildUserColumnsBatchItems,
  diffRemovedSiteIds,
  normalizeCheckedKeys,
} from './cms-user-auth';

describe('cms-user-auth', () => {
  it('builds batch items for selected sites only', () => {
    const selections = new Map<string, string[]>([
      ['s1', ['c1', 'c2']],
      ['s2', []],
    ]);

    expect(buildUserColumnsBatchItems(['s1', 's2'], selections)).toEqual([
      { siteId: 's1', columnIds: ['c1', 'c2'] },
      { siteId: 's2', columnIds: [] },
    ]);
  });

  it('detects removed sites for cascade cleanup', () => {
    expect(diffRemovedSiteIds(['s1', 's2', 's3'], ['s1', 's3'])).toEqual(['s2']);
  });

  it('normalizes checkStrictly tree value to key array', () => {
    expect(normalizeCheckedKeys(['c1', 'c2'])).toEqual(['c1', 'c2']);
    expect(
      normalizeCheckedKeys({ checked: ['c1'], halfChecked: ['c2'] }),
    ).toEqual(['c1']);
    expect(normalizeCheckedKeys(null)).toEqual([]);
  });
});
