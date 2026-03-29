import type { UserInfo } from '@vben/types';

import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { $t } from '@vben/locales';
import { preferences } from '@vben/preferences';
import { resetAllStores, useAccessStore, useUserStore } from '@vben/stores';

import { notification } from 'ant-design-vue';
import { defineStore } from 'pinia';

import { getUserInfoApi } from '#/api';
import {
  type AuthApi,
  loginApi,
  logoutApi,
  seeConnectionClose,
} from '#/api/system/auth';

import { useDictStore } from './dict';

export const useAuthStore = defineStore('auth', () => {
  const accessStore = useAccessStore();
  const userStore = useUserStore();
  const router = useRouter();

  const loginLoading = ref(false);

  /**
   * 异步处理登录操作
   * Asynchronously handle the login process
   * @param params 登录表单数据
   */
  async function authLogin(
    params: AuthApi.LoginParams,
    onSuccess?: () => Promise<void> | void,
  ) {
    // 异步处理用户登录操作并获取 accessToken
    let userInfo: null | UserInfo = null;
    try {
      loginLoading.value = true;
      const { accessToken, refreshToken } = await loginApi(params);

      // 如果成功获取到 accessToken
      if (accessToken) {
        accessStore.setAccessToken(accessToken);
        accessStore.setRefreshToken(refreshToken);

        // 获取用户信息并存储到 accessStore 中
        userInfo = await fetchUserInfo();
        /**
         * 设置角色信息
         */
        userStore.setUserRoles(userInfo.roles);

        if (accessStore.loginExpired) {
          accessStore.setLoginExpired(false);
        } else {
          // 登录成功后，如果 onSuccess 回调函数存在，则调用它；否则，导航到默认主页
          await (onSuccess
            ? onSuccess()
            : router.push(preferences.app.defaultHomePath));
        }

        if (userInfo?.realName) {
          notification.success({
            description: `${$t('authentication.loginSuccessDesc')}:${userInfo?.realName}`,
            duration: 3,
            message: $t('authentication.loginSuccess'),
          });
        }
      }
    } finally {
      loginLoading.value = false;
    }

    return {
      userInfo,
    };
  }

  /**
   * 登出操作
   * @param redirect
   */
  async function logout(redirect: boolean = true) {
    try {
      await Promise.all([seeConnectionClose(), logoutApi()]);
    } finally {
      resetAllStores();
      accessStore.setLoginExpired(false);

      // 回登录页带上当前路由地址
      await router.replace({
        path: LOGIN_PATH,
        query: redirect
          ? {
              redirect: encodeURIComponent(router.currentRoute.value.fullPath),
            }
          : {},
      });
    }
  }

  /**
   * 获取用户信息
   * @returns
   */
  async function fetchUserInfo() {
    const backUserInfo = await getUserInfoApi();
    /**
     * 登录超时的情况
     */
    if (!backUserInfo) {
      throw new Error('获取用户信息失败.');
    }
    const { permissions = [], roles = [], user } = backUserInfo;
    /**
     * 从后台user -> vben user转换
     */
    const userInfo: UserInfo = {
      userId: user.userId,
      username: user.userName,
      realName: user.nickName,
      avatar: user.avatar ?? '',
      email: user.email ?? '',
      roles,
      permissions,
    };
    userStore.setUserInfo(userInfo);
    // 无论是登录还是 guard 刷新用户信息，都需要同步更新权限码
    accessStore.setAccessCodes(permissions);
    /**
     * 需要重新加载字典
     * 比如退出登录切换到其他租户
     */
    const dictStore = useDictStore();
    dictStore.resetCache();
    return userInfo;
  }

  function $reset() {
    loginLoading.value = false;
  }

  return {
    $reset,
    authLogin,
    fetchUserInfo,
    loginLoading,
    logout,
  };
});
