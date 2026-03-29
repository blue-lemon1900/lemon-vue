<script setup lang="ts">
import type { VbenFormSchema } from '#/adapter/form';
import type { UpdatePasswordParam } from '#/api/system/profile/model';

import { computed } from 'vue';

import { ProfilePasswordSetting, z } from '@vben/common-ui';

import { Modal } from 'ant-design-vue';
import { omit } from 'lodash-es';

import { userUpdatePassword } from '#/api/system/profile';
import { useAuthStore } from '#/store';

const formSchema = computed((): VbenFormSchema[] => {
  return [
    {
      fieldName: 'oldPassword',
      label: '旧密码',
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: '请输入旧密码',
      },
    },
    {
      fieldName: 'newPassword',
      label: '新密码',
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: '请输入新密码',
      },
    },
    {
      fieldName: 'confirmPassword',
      label: '确认密码',
      component: 'VbenInputPassword',
      componentProps: {
        passwordStrength: true,
        placeholder: '请再次输入新密码',
      },
      dependencies: {
        rules(values) {
          const { newPassword } = values;
          return z
            .string({ required_error: '请再次输入新密码' })
            .min(1, { message: '请再次输入新密码' })
            .refine((value) => value === newPassword, {
              message: '两次输入的密码不一致',
            });
        },
        triggerFields: ['newPassword'],
      },
    },
  ];
});

const authStore = useAuthStore();

function handleSubmit(values: any) {
  Modal.confirm({
    content: '确认修改密码吗？',
    onOk: async () => {
       const data = omit(values, ['confirmPassword']) as UpdatePasswordParam;
        await userUpdatePassword(data);
        await authStore.logout(true);
    },
    title: '提示',
  });
}
</script>
<template>
  <ProfilePasswordSetting
    class="w-1/3"
    :form-schema="formSchema"
    @submit="handleSubmit"
  />
</template>
