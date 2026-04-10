<script lang="ts" setup>
import { computed, ref } from 'vue';

import { $t } from '@vben/locales';

import { router } from '#/router';

const props = withDefaults(
  defineProps<{
    afterLeft?: string;
    afterTop?: string;
    beforeLeft?: string;
    beforeTop?: string;
    dropHeight?: string;
    dropWidth?: string;
    showForgetPassword?: boolean;
    showRegister?: boolean;
  }>(),
  {
    showForgetPassword: false,
    showRegister: false,
    dropWidth: '550px',
    dropHeight: '550px',
    beforeTop: '70px',
    beforeLeft: '135px',
    afterTop: '105px',
    afterLeft: '160px',
  },
);

const dropStyle = computed(() => ({
  width: props.dropWidth,
  height: props.dropHeight,
  '--before-top': props.beforeTop,
  '--before-left': props.beforeLeft,
  '--after-top': props.afterTop,
  '--after-left': props.afterLeft,
}));

function handleGo(path: string) {
  router.push(path);
}

// 忘记密码和注册路径
const forgetPasswordPath = ref('/auth/forget-password');
const registerPath = ref('/auth/register');
</script>

<template>
  <div class="container">
    <div class="drop" :style="dropStyle">
      <slot></slot>
    </div>
    <div
      v-if="showForgetPassword"
      class="btn"
      @click="handleGo(forgetPasswordPath)"
    >
      {{ $t('authentication.forgetPassword') }}
    </div>
    <div v-if="showRegister" class="btn signup" @click="handleGo(registerPath)">
      {{ $t('authentication.createAccount') }}
    </div>
  </div>
</template>

<style scoped lang="scss">
@import '@fontsource/poppins/200.css';
@import '@fontsource/poppins/300.css';
@import '@fontsource/poppins/400.css';
@import '@fontsource/poppins/500.css';
@import '@fontsource/poppins/600.css';
@import '@fontsource/poppins/700.css';
@import '@fontsource/poppins/800.css';
@import '@fontsource/poppins/900.css';

* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
  font-family: Poppins, sans-serif;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: #eff0f4;
}

.container {
  position: fixed;
  top: 50%;
  right: 250px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  max-width: none;
  transform: translateY(-50%);
}

.container .drop {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 550px;
  height: 550px;
  border-radius: 62% 38% 24% 76% / 59% 60% 40% 41%;
  box-shadow:
    inset 20px 20px 20px rgb(0 0 0 / 5%),
    25px 35px 20px rgb(0 0 0 / 5%),
    25px 30px 30px rgb(0 0 0 / 5%),
    inset -20px -20px 25px rgb(255 255 255 / 90%);
  transition: 0.5s;
}

.container .drop:hover {
  border-radius: 50%;
}

.container .drop::before {
  position: absolute;
  top: var(--before-top, 70px);
  left: var(--before-left, 135px);
  width: 35px;
  height: 35px;
  content: '';
  background: #fff;
  border-radius: 50%;
  opacity: 0.9;
}

.container .drop::after {
  position: absolute;
  top: var(--after-top, 105px);
  left: var(--after-left, 160px);
  width: 15px;
  height: 15px;
  content: '';
  background: #fff;
  border-radius: 50%;
  opacity: 0.9;
}

.container .drop .content {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
}

.container .drop .content h2 {
  position: relative;
  font-size: 1.5em;
  color: #333;
}

.container .drop .content form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.container .drop .content form .input-box {
  position: relative;
  width: 225px;
  border-radius: 25px;
  box-shadow:
    inset 2px 5px 10px rgb(0 0 0 / 10%),
    inset -2px -5px 10px rgb(255 255 255 / 100%),
    15px 15px 10px rgb(0 0 0 / 5%),
    15px 10px 15px rgb(0 0 0 / 2.5%);
}

.container .drop .content form .input-box::before {
  position: absolute;
  top: 8px;
  left: 50%;
  width: 65%;
  height: 5px;
  content: '';
  background: rgb(255 255 255 / 50%);
  border-radius: 5px;
  transform: translateX(-50%);
}

.container .drop .content form .input-box input {
  width: 100%;
  padding: 10px 15px;
  font-size: 1em;
  outline: none;
  background: transparent;
  border: none;
}

.container .drop .content form .input-box input[type='submit'] {
  font-size: 1em;
  font-weight: 500;
  color: #fff;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
}

.container .drop .content form .input-box:last-child {
  width: 120px;
  background: #3a86ff;
  box-shadow:
    inset 2px 5px 10px rgb(0 0 0 / 10%),
    15px 15px 10px rgb(0 0 0 / 5%),
    15px 10px 15px rgb(0 0 0 / 2.5%);
  transition: 0.5s;
}

.container .drop .content form .input-box:last-child:hover {
  width: 150px;
}

.btn {
  position: absolute;
  right: -120px;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  font-size: 0.8em;
  line-height: 1.2em;
  color: #fff;
  text-align: center;
  letter-spacing: 0.1em;
  text-decoration: none;
  cursor: pointer;
  background: #00b4d8;
  border-radius: 44% 56% 65% 35% / 57% 58% 42% 43%;
  box-shadow:
    inset 10px 10px 10px rgb(0 180 216 / 5%),
    15px 25px 10px rgb(0 180 216 / 10%),
    15px 20px 20px rgb(0 180 216 / 10%),
    inset -10px -10px 15px rgb(255 255 255 / 50%);
  transition: 0.25s;
}

.btn::before {
  position: absolute;
  top: 15px;
  left: 30px;
  width: 20px;
  height: 20px;
  content: '';
  background: #fff;
  border-radius: 50%;
  opacity: 0.45;
}

.btn.signup {
  right: -140px;
  bottom: 150px;
  width: 80px;
  height: 80px;
  background: #f77f00;
  border-radius: 49% 51% 52% 48% / 63% 59% 41% 37%;
  box-shadow:
    inset 10px 10px 10px rgb(247 127 0 / 5%),
    15px 25px 10px rgb(247 127 0 / 10%),
    15px 20px 20px rgb(247 127 0 / 10%),
    inset -10px -10px 15px rgb(255 255 255 / 50%);
}

.btn.signup::before {
  left: 20px;
  width: 15px;
  height: 15px;
}

.btn:hover {
  border-radius: 50%;
}
</style>
