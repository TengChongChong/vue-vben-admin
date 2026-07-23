import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  getUserActiveSiteApi,
  selectCmsSiteApi,
  setUserActiveSiteApi,
} from '#/api';

import { useCmsSiteStore } from './cms-site';

vi.mock('#/api', () => ({
  getUserActiveSiteApi: vi.fn(),
  selectCmsSiteApi: vi.fn(),
  setUserActiveSiteApi: vi.fn(),
}));

describe('useCmsSiteStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it('starts without active site', () => {
    const store = useCmsSiteStore();
    expect(store.hasActiveSite).toBe(false);
    expect(store.activeSiteId).toBe('');
    expect(store.switchable).toBe(false);
  });

  it('refresh loads active site and enabled site list', async () => {
    vi.mocked(getUserActiveSiteApi).mockResolvedValue({
      id: 's1',
      name: '站点A',
      domainName: 'a.test',
      deploymentPath: '/a',
      status: '1',
    });
    vi.mocked(selectCmsSiteApi).mockResolvedValue([
      {
        id: 's1',
        name: '站点A',
        domainName: 'a.test',
        deploymentPath: '/a',
        status: '1',
      },
      {
        id: 's2',
        name: '站点B',
        domainName: 'b.test',
        deploymentPath: '/b',
        status: '1',
      },
      {
        id: 's3',
        name: '停用',
        domainName: 'c.test',
        deploymentPath: '/c',
        status: '0',
      },
    ]);

    const store = useCmsSiteStore();
    await store.refresh();

    expect(store.initialized).toBe(true);
    expect(store.activeSiteId).toBe('s1');
    expect(store.siteList).toHaveLength(2);
    expect(store.switchable).toBe(true);
  });

  it('switchSite updates active site', async () => {
    vi.mocked(setUserActiveSiteApi).mockResolvedValue(true);
    vi.mocked(getUserActiveSiteApi).mockResolvedValue({
      id: 's2',
      name: '站点B',
      domainName: 'b.test',
      deploymentPath: '/b',
      status: '1',
    });

    const store = useCmsSiteStore();
    const firstSite = {
      id: 's1',
      name: '站点A',
      domainName: 'a.test',
      deploymentPath: '/a',
      status: '1',
    };
    store.siteList = [
      firstSite,
      {
        id: 's2',
        name: '站点B',
        domainName: 'b.test',
        deploymentPath: '/b',
        status: '1',
      },
    ];
    store.activeSite = firstSite;

    await store.switchSite('s2');

    expect(setUserActiveSiteApi).toHaveBeenCalledWith({ id: 's2' });
    expect(store.activeSiteId).toBe('s2');
    expect(store.activeSiteName).toBe('站点B');
  });

  it('does not switch when site id unchanged', async () => {
    const store = useCmsSiteStore();
    store.activeSite = {
      id: 's1',
      name: '站点A',
      domainName: 'a.test',
      deploymentPath: '/a',
      status: '1',
    };

    await store.switchSite('s1');
    expect(setUserActiveSiteApi).not.toHaveBeenCalled();
  });
});
