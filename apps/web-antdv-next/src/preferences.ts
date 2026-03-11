import { defineOverridesPreferences } from '@vben/preferences';

/**
 * @description 项目配置文件
 * 只需要覆盖项目中的一部分配置，不需要的配置不用覆盖，会自动使用默认配置
 * !!! 更改配置后请清空缓存，否则可能不生效
 */
export const overridesPreferences = defineOverridesPreferences({
  // overrides
  theme: {
    /** 当前主题 */
    mode: 'auto',
    /** 圆角 */
    radius: '0.25',
    /** 是否开启半深色菜单（只在theme='light'时生效） */
    semiDarkSidebar: true,
  },
  app: {
    /** 权限模式 */
    accessMode: 'backend',
    /** 是否开启refreshToken */
    enableRefreshToken: false,
    /** 应用名 */
    name: import.meta.env.VITE_APP_TITLE,
    /** 默认首页地址 */
    defaultHomePath: '/dashboard/workspace',
  },
  widget: {
    /** 是否启用语言切换部件 */
    languageToggle: false,
  },
});
