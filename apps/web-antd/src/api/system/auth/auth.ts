import type { GrantType } from '@vben/common-ui';
import type { HttpResponse } from '@vben/request';

import { useAppConfig } from '@vben/hooks';

import { requestClient } from '#/api/request';

const { sseEnable } = useAppConfig(import.meta.env, import.meta.env.PROD);

export namespace AuthApi {
  /**
   * @description: 所有登录类型都需要用到的
   * @param clientId 客户端ID 这里为必填项 但是在loginApi内部处理了 所以为可选
   * @param grantType 授权/登录类型
   * @param tenantId 租户id
   */
  export interface BaseLoginParams {
    clientId?: string;
    grantType: GrantType;
    tenantId: string;
  }

  /**
   * @description: 验证码登录需要用到的参数
   * @param code 验证码 可选(未开启验证码情况)
   * @param uuid 验证码ID 可选(未开启验证码情况)
   * @param username 用户名
   * @param password 密码
   */
  export interface SimpleLoginParams extends BaseLoginParams {
    code?: string;
    uuid?: string;
    username: string;
    password: string;
  }

  export type LoginParams = SimpleLoginParams;

  // /** 登录接口参数 */
  // export interface LoginParams {
  //   code?: string;
  //   grantType: string;
  //   password: string;
  //   tenantId: string;
  //   username: string;
  //   uuid?: string;
  // }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    client_id: string;
    expire_in: number;
  }

  /** 刷新token接口返回值 */
  export interface RefreshTokenResult {
    // 用户编号
    userId: number;

    // 用户名称
    username: string;

    // 昵称
    nickname: string;

    // 租户Id
    tenantId: string;

    // 访问令牌
    accessToken: string;

    // 刷新令牌
    refreshToken: string;
  }

  /** 刷新令牌请求接口参数 */
  export interface RefreshTokenBo {
    refreshToken: string;
  }
}

/**
 * @param companyName 租户/公司名称
 * @param domain 绑定域名(不带http(s)://) 可选
 * @param tenantId 租户id
 */
export interface TenantOption {
  companyName: string;
  domain?: string;
  tenantId: string;
}

/**
 * @param tenantEnabled 是否启用租户
 * @param voList 租户列表
 */
export interface TenantResp {
  tenantEnabled: boolean;
  voList: TenantOption[];
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/login/username', data, {
    encrypt: true,
  });
}

/**
 * 用户登出
 * @returns void
 */
export function doLogout() {
  return requestClient.post<HttpResponse<void>>('/auth/logout');
}

/**
 * 关闭sse连接
 * @returns void
 */
export function seeConnectionClose() {
  /**
   * 未开启sse 不需要处理
   */
  if (!sseEnable) {
    return;
  }
  return requestClient.get<void>('/resource/sse/close');
}

/**
 * 获取租户列表 下拉框使用
 */
export function tenantList() {
  return requestClient.get<TenantResp>('/auth/tenant/list');
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi(data: AuthApi.RefreshTokenBo) {
  return requestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh', data,{ skipReAuthenticate: true });
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return requestClient.post('/auth/logout', null, { skipReAuthenticate: true });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
