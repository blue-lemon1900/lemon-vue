import type { RouteMeta as IRouteMeta } from '@vben-core/typings';

import 'vue-router';

declare module 'vue-router' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface RouteMeta extends IRouteMeta {}
}

export interface VbenAdminProAppConfigRaw {
  VITE_GLOB_API_URL: string;
  // 是否开启sse  注意从配置文件获取的类型为string
  VITE_GLOB_SSE_ENABLE: string;
  // 开启websocket  注意从配置文件获取的类型为string
  VITE_GLOB_WEBSOCKET_ENABLE: string;
}

export interface ApplicationConfig {
  // 后端接口地址
  apiURL: string;
  // 是否开启sse
  sseEnable: boolean;
  // 是否开启
  websocketEnable: boolean;
}

declare global {
  interface Window {
    _VBEN_ADMIN_PRO_APP_CONF_: VbenAdminProAppConfigRaw;
  }
}
