<script lang="ts" setup>
import type { LoginAndRegisterParams, VbenFormSchema } from '@vben/common-ui';

import type { TenantResp } from '#/api/system/auth/auth';
import type { CaptchaResponse } from '#/api/system/auth/captcha';

import { computed, markRaw, onMounted, ref, useTemplateRef } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { DEFAULT_TENANT_ID } from '@vben/constants';
import { $t } from '@vben/locales';

import { Input, Select } from 'ant-design-vue';
import { omit } from 'lodash-es';

import { tenantList } from '#/api/system/auth/auth';
import { captchaImage } from '#/api/system/auth/captcha';
import { useAuthStore } from '#/store';

import FormBg from './form-bg.vue';
import InputCaptcha from './input-captcha.vue';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

const loginFormRef = useTemplateRef('loginFormRef');

const captchaInfo = ref<CaptchaResponse>({
  captchaEnabled: false,
  img: '',
  uuid: '',
});
// 验证码loading
const captchaLoading = ref(false);

async function loadCaptcha() {
  try {
    captchaLoading.value = true;

    const resp = await captchaImage();
    if (resp.captchaEnabled) {
      resp.img = `data:image/png;base64,${resp.img}`;
    }
    captchaInfo.value = resp;
  } catch (error) {
    console.error(error);
  } finally {
    captchaLoading.value = false;
  }
}

const tenantInfo = ref<TenantResp>({
  tenantEnabled: false,
  voList: [],
});

async function loadTenant() {
  const resp = await tenantList();
  tenantInfo.value = resp;
  // 选中第一个租户
  if (resp.tenantEnabled && resp.voList.length > 0) {
    const firstTenantId = resp.voList[0]?.tenantId;
    loginFormRef.value?.getFormApi().setFieldValue('tenantId', firstTenantId);
  }
}

onMounted(async () => {
  await Promise.all([loadCaptcha(), loadTenant()]);
});

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      component: markRaw(Select),
      modelPropName: 'value',
      componentProps: {
        class: 'w-full',
        size: 'large',
        showSearch: true,
        optionFilterProp: 'label',
        options: tenantInfo.value.voList?.map((item) => ({
          label: item.companyName,
          value: item.tenantId,
        })),
        placeholder: $t('ui.formRules.selectRequired'),
      },
      defaultValue: DEFAULT_TENANT_ID,
      dependencies: {
        if: () => tenantInfo.value.tenantEnabled,
        triggerFields: ['', 'tenantId'],
      },
      fieldName: 'tenant',
      label: $t('authentication.selectAccount'),
      rules: z.string().min(1, { message: $t('authentication.selectAccount') }),
    },
    {
      component: markRaw(Input),
      modelPropName: 'value',
      componentProps: {
        size: 'large',
        placeholder: $t('authentication.usernameTip'),
        allowClear: true,
        autocomplete: 'username',
      },
      defaultValue: 'admin',
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: markRaw(Input.Password),
      modelPropName: 'value',
      componentProps: {
        size: 'large',
        placeholder: $t('authentication.passwordTip'),
        autocomplete: 'current-password',
      },
      defaultValue: '123456',
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(5, { message: $t('authentication.passwordTip') }),
    },
    {
      component: markRaw(InputCaptcha),
      componentProps: {
        captcha: captchaInfo.value.img,
        class: 'focus:border-primary',
        onCaptchaClick: loadCaptcha,
        placeholder: $t('authentication.code'),
        loading: captchaLoading.value,
      },
      dependencies: {
        if: () => captchaInfo.value.captchaEnabled,
        triggerFields: [''],
      },
      fieldName: 'captcha',
      label: $t('authentication.code'),
      rules: z
        .string()
        .min(1, { message: $t('authentication.verifyRequiredTip') }),
    },
  ];
});

async function handleAccountLogin(values: LoginAndRegisterParams) {
  try {
    const requestParam: any = omit(values, ['code']);
    // 验证码
    if (captchaInfo.value.captchaEnabled) {
      requestParam.code = values.code;
      requestParam.uuid = captchaInfo.value.uuid;
    }

    // 登录
    await authStore.authLogin(requestParam);
  } catch (error) {
    // 处理验证码错误
    if (error instanceof Error) {
      // 刷新验证码
      loginFormRef.value?.getFormApi().setFieldValue('code', '');
      await loadCaptcha();
    }
  }
}
</script>

<template>
  <FormBg :show-forget-password="true" :show-register="true">
    <AuthenticationLogin
      ref="loginFormRef"
      :form-schema="formSchema"
      :loading="authStore.loginLoading"
      :show-register="false"
      :show-code-login="false"
      :show-qrcode-login="false"
      :show-forget-password="false"
      @submit="handleAccountLogin"
    />
  </FormBg>
</template>
