<script setup lang="ts">
import type { UserProfile } from '#/api/system/profile/model';

import { onMounted, onUnmounted, ref } from 'vue';

import { useUserStore } from '@vben/stores';

import { userProfile } from '#/api/system/profile';
import { useAuthStore } from '#/store';

import ProfileBase from './base-setting.vue';
import { emitter } from './mitt';
import ProfilePasswordSetting from './password-setting.vue';
import Profile from './profile.vue';

const tabsValue = ref<string>('basic');

const tabs = ref([
  {
    label: '基本设置',
    value: 'basic',
  },
  {
    label: '修改密码',
    value: 'password',
  },
]);

const profile = ref<UserProfile>();
async function loadProfile() {
  const resp = await userProfile();
  profile.value = resp;
}

onMounted(loadProfile);

const authStore = useAuthStore();
const userStore = useUserStore();

/**
 * ToDo 接口重复
 */
async function handleUploadFinish() {
  // 重新加载用户信息
  await loadProfile();
  // 更新store
  const userInfo = await authStore.fetchUserInfo();
  userStore.setUserInfo(userInfo);
}

onMounted(() => emitter.on('updateProfile', loadProfile));
onUnmounted(() => emitter.off('updateProfile'));
</script>
<template>
  <Profile
    v-model:model-value="tabsValue"
    :tabs="tabs"
    :profile="profile"
    @upload-finish="handleUploadFinish"
  >
    <template #content>
      <ProfileBase v-if="tabsValue === 'basic' && profile" :profile="profile" />
      <ProfilePasswordSetting
        v-if="tabsValue === 'password'"
        :profile="profile"
      />
    </template>
  </Profile>
</template>
