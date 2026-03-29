import type { HttpResponse, RequestClientOptions } from '@vben/request';

import { BUSINESS_SUCCESS_CODE, UNAUTHORIZED_CODE } from '@vben/constants';
import { useAppConfig } from '@vben/hooks';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import {
  authenticateResponseInterceptor,
  errorMessageResponseInterceptor,
  RequestClient,
  stringify,
} from '@vben/request';
import { useAccessStore } from '@vben/stores';

import { message, Modal } from 'ant-design-vue';
import { isEmpty, isNull } from 'lodash-es';

import { useAuthStore } from '#/store';

import { handleUnauthorizedLogout } from './helper';
import { refreshTokenApi } from './system/auth/auth';

const { apiURL } = useAppConfig(import.meta.env, import.meta.env.PROD);

function createRequestClient(baseURL: string, options?: RequestClientOptions) {
  const client = new RequestClient({
    ...options,
    // 后端地址
    baseURL,
    // 消息提示类型
    errorMessageMode: 'message',
    // 是否返回原生响应 比如：需要获取响应头时使用该属性
    isReturnNativeResponse: false,
    // 需要对返回数据进行处理
    isTransformResponse: true,
  });

  function formatToken(token: null | string) {
    return token ? `Bearer ${token}` : null;
  }

  /**
   * 重新认证逻辑
   */
  async function doReAuthenticate() {
    console.warn('Access token or refresh token is invalid or expired. ');

    const accessStore = useAccessStore();
    const authStore = useAuthStore();
    accessStore.setAccessToken(null);
    if (
      preferences.app.loginExpiredMode === 'modal' &&
      accessStore.isAccessChecked
    ) {
      accessStore.setLoginExpired(true);
    } else {
      await authStore.logout();
    }
  }

  /**
   * 刷新token逻辑
   */
  async function doRefreshToken() {
    const accessStore = useAccessStore();
    const resp = await refreshTokenApi({
      refreshToken: accessStore.refreshToken as string,
    });

    const { accessToken, refreshToken } = resp;
    accessStore.setAccessToken(accessToken);
    accessStore.setRefreshToken(refreshToken);
    return accessToken;
  }

  // 请求头处理
  client.addRequestInterceptor({
    fulfilled: async (config) => {
      const { accessToken } = useAccessStore();

      config.headers.Authorization = formatToken(accessToken);
      config.headers['Accept-Language'] = preferences.app.locale;

      /**
       * 格式化get/delete参数
       * 如果包含自定义的paramsSerializer则不走此逻辑
       */
      if (
        ['DELETE', 'GET'].includes(config.method?.toUpperCase() || '') &&
        config.params &&
        !config.paramsSerializer
      ) {
        /**
         * 1. 格式化参数 微服务在传递区间时间选择(后端的params Map类型参数)需要格式化key 否则接收不到
         * 2. 数组参数需要格式化 后端才能正常接收 会变成arr=1&arr=2&arr=3的格式来接收
         */
        config.paramsSerializer = (params) =>
          stringify(params, { arrayFormat: 'repeat' });
      }
      return config;
    },
  });

  // 通用的错误处理, 如果没有进入上面的错误处理逻辑，就会进入这里
  // 主要处理http状态码不为200(如网络异常/离线)的情况 必须放在在下面的响应拦截器之前
  client.addResponseInterceptor(
    errorMessageResponseInterceptor((msg: string, error: any) => {
      // 401 由 authenticateResponseInterceptor 专门处理，跳过避免提前弹出重复提示
      if (error?.response?.config.skipReAuthenticate && error?.response?.status === 401) return;

      message.error(msg);
    }),
  );

  // 处理返回的响应数据格式
  client.addResponseInterceptor<HttpResponse>({
    fulfilled: async (response) => {
      const { isReturnNativeResponse, isTransformResponse } = response.config;
      // 是否返回原生响应 比如：需要获取响应时使用该属性
      if (isReturnNativeResponse) {
        return response;
      }
      // 不进行任何处理，直接返回
      // 用于页面代码可能需要直接获取code，data，message这些信息时开启
      if (!isTransformResponse) {
        /**
         * @warning 注意 微服务版本在401(网关)会返回text/plain的头 所以这里代码会无效
         * 我建议你改后端而不是前端来做兼容
         */
        // json数据的判断
        if (response.headers['content-type']?.includes?.('application/json')) {
          /**
           * 需要判断是否登录超时/401
           * 执行登出操作
           */
          const resp = response.data as unknown as HttpResponse;
          // 抛出异常 不再执行
          if (
            typeof resp === 'object' &&
            Reflect.has(resp, 'code') &&
            resp.code === UNAUTHORIZED_CODE
          ) {
            handleUnauthorizedLogout();
          }

          /**
           * 需要判断下载二进制的情况 正常是返回二进制 报错会返回json
           * 当type为blob且content-type为application/json时 则判断已经下载出错
           */
          if (response.config.responseType === 'blob') {
            // 这时候的data为blob类型
            const blob = response.data as unknown as Blob;
            // 拿到字符串转json对象
            response.data = JSON.parse(await blob.text());
            // 然后按正常逻辑执行下面的代码(判断业务状态码)
          } else {
            // 其他类型数据 直接返回
            return response.data;
          }
        } else {
          // 非json数据 直接返回 不做校验
          return response.data;
        }
      }

      const axiosResponseData = response.data;
      if (!axiosResponseData) {
        throw new Error($t('http.apiRequestFailed'));
      }

      // 后端并没有采用严格的{code, msg, data}模式
      const { code, data, msg, ...other } = axiosResponseData;

      // 业务状态码为200 则请求成功
      const hasSuccess =
        Reflect.has(axiosResponseData, 'code') &&
        code === BUSINESS_SUCCESS_CODE;
      if (hasSuccess) {
        let successMsg = msg;

        if (isNull(successMsg) || isEmpty(successMsg)) {
          successMsg = $t(`http.operationSuccess`);
        }

        if (response.config.successMessageMode === 'modal') {
          Modal.success({
            content: successMsg,
            title: $t('http.successTip'),
          });
        } else if (response.config.successMessageMode === 'message') {
          message.success(successMsg);
        }
        // 分页情况下为code msg rows total 并没有data字段
        // 如果有data 直接返回data 没有data将剩余参数(...other)封装为data返回
        // 需要考虑data为null的情况(比如查询为空) 所以这里直接判断undefined
        if (data !== undefined) {
          return data;
        }
        // 没有data 将其他参数包装为data
        return other;
      }

      // 在此处根据自己项目的实际情况对不同的code执行不同的操作
      // 如果不希望中断当前请求，请return数据，否则直接抛出异常即可
      let timeoutMsg = '';
      switch (code) {
        // 登录超时
        case UNAUTHORIZED_CODE: {
          handleUnauthorizedLogout();
          break;
        }
        default: {
          if (msg) {
            timeoutMsg = msg;
          }
        }
      }

      // errorMessageMode='modal'的时候会显示modal错误弹窗，而不是消息提示，用于一些比较重要的错误
      // errorMessageMode='none' 一般是调用时明确表示不希望自动弹出错误提示
      if (response.config.errorMessageMode === 'modal') {
        Modal.error({
          content: timeoutMsg,
          title: $t('http.errorTip'),
        });
      } else if (response.config.errorMessageMode === 'message') {
        message.error(timeoutMsg);
      }

      throw new Error(timeoutMsg || $t('http.apiRequestFailed'));
    },
  });

  // 处理认证相关的响应 比如token过期/无效等
  client.addResponseInterceptor(
    authenticateResponseInterceptor({
      client,
      doReAuthenticate,
      doRefreshToken,
      formatToken,
      enableRefreshToken: preferences.app.enableRefreshToken,
    }),
  );

  return client;
}

export const requestClient = createRequestClient(apiURL);
