<script setup lang="ts">
import { computed, useTemplateRef } from 'vue';

import gsap from 'gsap';

const props = withDefaults(
  defineProps<{ avatarUrl?: string; dark?: boolean }>(),
  { avatarUrl: '/logo.png', dark: false },
);

const modelRef = useTemplateRef('modelRef');

const modelStyle = computed(() => ({
  '--avatar-url': `url(${props.avatarUrl})`,
  '--dark': props.dark ? '1' : '0',
}));

const clouds = ['cloud--one', 'cloud--two', 'cloud--three'];

const wingParts = [
  { wrapper: 'wings__top', cuboid: 'cuboid--wings-top' },
  { wrapper: 'wings__ghost', cuboid: 'cuboid--wings-ghost' },
  { wrapper: 'wings__bottom', cuboid: 'cuboid--wings-bottom' },
];

const planeParts = [
  { wrapper: 'plane__body', cuboid: 'cuboid--body' },
  { wrapper: 'plane__nose', cuboid: 'cuboid--nose' },
  { wrapper: 'plane__screen', cuboid: 'cuboid--screen' },
  { wrapper: 'plane__tail', cuboid: 'cuboid--tail' },
  {
    wrapper: 'plane__stabilizer plane__stabilizer--horizontal',
    cuboid: 'cuboid--horizontal-stabilizer',
  },
  {
    wrapper: 'plane__stabilizer plane__stabilizer--vertical',
    cuboid: 'cuboid--vertical-stabilizer',
  },
  { wrapper: 'plane__beacon', cuboid: 'cuboid--beacon' },
];

const BOUNDS = 20;

function onPointerMove({ x, y }: PointerEvent) {
  const newX = gsap.utils.mapRange(0, window.innerWidth, -BOUNDS, BOUNDS, x);
  const newY = gsap.utils.mapRange(0, window.innerHeight, BOUNDS, -BOUNDS, y);
  gsap.set(modelRef.value, {
    '--rotate-x': newY,
    '--rotate-y': newX,
  });
}
</script>

<template>
  <!-- 事件捕获层：透明全屏，不设 z-index，能正常收到鼠标事件 -->
  <div class="auth-overlay" @pointermove="onPointerMove"></div>

  <!-- 视觉背景层：z-index: -1，纯展示 -->
  <div ref="modelRef" class="auth-bg" :style="modelStyle">
    <div class="scene">
      <!-- 云朵 -->
      <div v-for="cloud in clouds" :key="cloud" class="cloud" :class="[cloud]">
        <div class="cloud__shift">
          <div class="cloud__body">
            <div v-for="n in 3" :key="n">
              <div class="cuboid cuboid--cloud">
                <div v-for="s in 6" :key="s" class="cuboid__side"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 飞机 -->
      <div class="plane__floater">
        <div class="plane__looper">
          <div class="plane">
            <!-- 起落架 -->
            <div class="plane__wheels">
              <div class="plane__axle">
                <div class="cuboid cuboid--axle">
                  <div v-for="n in 6" :key="n" class="cuboid__side"></div>
                </div>
              </div>
              <div
                v-for="side in ['left', 'right']"
                :key="side"
                :class="`plane__wheel plane__wheel--${side}`"
              >
                <div :class="`cuboid cuboid--wheel-${side}`">
                  <div v-for="n in 6" :key="n" class="cuboid__side"></div>
                </div>
              </div>
            </div>

            <!-- 机身各部件 -->
            <div
              v-for="part in planeParts"
              :key="part.cuboid"
              :class="part.wrapper"
            >
              <div class="cuboid" :class="[part.cuboid]">
                <div v-for="n in 6" :key="n" class="cuboid__side"></div>
              </div>
            </div>

            <!-- 螺旋桨 -->
            <div class="plane__propellor">
              <div class="propellor"></div>
            </div>

            <!-- 机翼 -->
            <div class="plane__wings wings">
              <div
                v-for="wing in wingParts"
                :key="wing.cuboid"
                :class="wing.wrapper"
              >
                <div class="cuboid" :class="[wing.cuboid]">
                  <div v-for="n in 6" :key="n" class="cuboid__side"></div>
                </div>
              </div>
              <div
                v-for="side in ['left', 'right']"
                :key="side"
                :class="`wings__strobe wings__strobe--${side}`"
              >
                <div class="cuboid cuboid--strobe">
                  <div v-for="n in 6" :key="n" class="cuboid__side"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cuboid {
  position: relative;
  width: 100%;
  height: 100%;

  &__side {
    &:nth-of-type(1) {
      position: absolute;
      top: 0;
      width: 100%;
      height: calc(var(--thickness) * 1vmin);
      transform: translate(0, -50%) rotateX(90deg);
    }

    &:nth-of-type(2) {
      position: absolute;
      top: 50%;
      right: 0;
      width: calc(var(--thickness) * 1vmin);
      height: 100%;
      transform: translate(50%, -50%) rotateY(90deg);
    }

    &:nth-of-type(3) {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: calc(var(--thickness) * 1vmin);
      transform: translate(0%, 50%) rotateX(90deg);
    }

    &:nth-of-type(4) {
      position: absolute;
      top: 50%;
      left: 0;
      width: calc(var(--thickness) * 1vmin);
      height: 100%;
      transform: translate(-50%, -50%) rotateY(90deg);
    }

    &:nth-of-type(5) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: translate3d(0, 0, calc(var(--thickness) * 0.5vmin));
    }

    &:nth-of-type(6) {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      transform: translate3d(0, 0, calc(var(--thickness) * -0.5vmin))
        rotateY(180deg);
    }
  }

  &--body {
    --thickness: calc(var(--base-size) * 0.4);

    div {
      background: var(--white-two);

      &:nth-of-type(1) {
        background: var(--white-one);
      }

      &:nth-of-type(2) {
        background: var(--white-two);
      }

      &:nth-of-type(3) {
        background: var(--white-three);
      }

      &:nth-of-type(4) {
        background: var(--white-four);
      }

      &:nth-of-type(5),
      &:nth-of-type(6) {
        &::after {
          position: absolute;
          top: 50%;
          left: 50%;
          width: calc(var(--base-size) * 0.25vmin);
          height: calc(var(--base-size) * 0.25vmin);
          content: '';
          background-image: var(--avatar-url);
          background-size: cover;
          filter: saturate(0.65);
          transform: translate3d(-50%, -50%, 1px);
        }
      }
    }
  }

  &--screen {
    --thickness: calc(var(--base-size) * 0.26);

    div {
      background: var(--screen);
    }
  }

  &--tail {
    --thickness: calc(var(--base-size) * 0.3);

    div {
      background: var(--white-two);

      &:nth-of-type(1) {
        background: var(--white-one);

        &::after {
          position: absolute;
          top: 50%;
          right: 50%;
          width: 50%;
          height: 74%;
          content: '';
          background: var(--metal-three);
          transform: translate3d(-50%, -50%, 1px);
        }
      }

      &:nth-of-type(2) {
        background: linear-gradient(var(--white-two) 0 30%, transparent 30%);
      }

      &:nth-of-type(3) {
        background: linear-gradient(
          90deg,
          var(--white-two) 0 20%,
          transparent 20%
        );

        &::after {
          position: absolute;
          top: 0%;
          left: 20%;
          width: 87%;
          height: 100%;
          content: '';
          background: var(--white-four);
          transform: rotateY(-22deg);
          transform-origin: 0 50%;
        }
      }

      &:nth-of-type(5) {
        overflow: hidden;
        background: transparent;

        &::after {
          position: absolute;
          bottom: 70%;
          width: 100%;
          height: 100%;
          content: '';
          background: var(--white-two);
          transform: rotate(-22deg) scale(2) translate(10%, 0);
          transform-origin: 100% 100%;
        }
      }

      &:nth-of-type(6) {
        overflow: hidden;
        background: transparent;

        &::after {
          position: absolute;
          bottom: 70%;
          width: 100%;
          height: 100%;
          content: '';
          background: var(--white-two);
          transform: rotate(22deg) scale(2) translate(-10%, 0);
          transform-origin: 0% 100%;
        }
      }
    }
  }

  &--nose {
    --thickness: calc(var(--base-size) * 0.3);

    div {
      background: var(--metal-three);

      &:nth-of-type(1) {
        background: var(--metal-one);
      }

      &:nth-of-type(2) {
        background: var(--metal-two);
      }

      &:nth-of-type(3) {
        background: var(--metal-one);
      }
    }
  }

  &--wings-ghost,
  &--wings-top,
  &--wings-bottom {
    --thickness: calc(var(--base-size) * 2.2);

    div {
      background: var(--accent-one);

      &:nth-of-type(1) {
        background: var(--accent-two);
      }

      &:nth-of-type(2),
      &:nth-of-type(5) {
        background: var(--accent-three);
      }

      &:nth-of-type(3) {
        background: var(--accent-five);
      }

      &:nth-of-type(4) {
        background: var(--accent-four);
      }
    }
  }

  &--wings-ghost {
    div {
      &:nth-of-type(1),
      &:nth-of-type(3),
      &:nth-of-type(5),
      &:nth-of-type(6) {
        background: transparent;
      }

      &:nth-of-type(2),
      &:nth-of-type(4) {
        background: linear-gradient(
          90deg,
          transparent 0 5%,
          var(--metal-one) 5% 7%,
          transparent 7% 33%,
          var(--metal-one) 33% 35%,
          transparent 35% 65%,
          var(--metal-one) 65% 67%,
          transparent 67% 93%,
          var(--metal-one) 93% 95%,
          transparent 95%
        );
      }
    }
  }

  &--axle {
    --thickness: calc(var(--base-size) * 0.5);

    div {
      background: var(--metal-two);

      &:nth-of-type(1),
      &:nth-of-type(2),
      &:nth-of-type(6) {
        background: var(--metal-one);
      }

      &:nth-of-type(3) {
        background: var(--metal-three);
      }
    }
  }

  &--horizontal-stabilizer {
    --thickness: calc(var(--base-size) * 0.65);

    div {
      background: var(--accent-one);

      &:nth-of-type(1) {
        background: var(--accent-two);
      }

      &:nth-of-type(2),
      &:nth-of-type(5) {
        background: var(--accent-three);
      }

      &:nth-of-type(3),
      &:nth-of-type(4) {
        background: var(--accent-four);
      }
    }
  }

  &--vertical-stabilizer {
    --thickness: calc(var(--base-size) * 0.2);

    div {
      background: var(--accent-one);

      &:nth-of-type(1) {
        background: linear-gradient(
          270deg,
          var(--accent-two) 0 30%,
          transparent 30%
        );
      }

      &:nth-of-type(4) {
        background: transparent;

        &::after {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 150%;
          content: '';
          background: var(--accent-four);
          transform: rotateX(-48deg);
          transform-origin: 50% 100%;
        }
      }

      &:nth-of-type(5) {
        overflow: hidden;
        background: transparent;

        &::after {
          position: absolute;
          top: 100%;
          width: 160%;
          height: 150%;
          content: '';
          background: var(--accent-three);
          transform: rotate(-42deg);
          transform-origin: 0 0;
        }
      }

      &:nth-of-type(6) {
        overflow: hidden;
        background: transparent;

        &::after {
          position: absolute;
          top: 100%;
          right: 0;
          width: 160%;
          height: 150%;
          content: '';
          background: var(--accent-three);
          transform: rotate(42deg);
          transform-origin: 100% 0;
        }
      }
    }
  }

  &--wheel-left,
  &--wheel-right {
    --thickness: calc(var(--base-size) * 0.1);

    div {
      background: var(--wheel-one);

      &:nth-of-type(1),
      &:nth-of-type(2),
      &:nth-of-type(4) {
        background: var(--wheel-two);
      }

      &:nth-of-type(3) {
        background: var(--wheel-three);
      }

      &:nth-of-type(5),
      &:nth-of-type(6) {
        &::after {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 40%;
          height: 40%;
          content: '';
          background: var(--wheel-hub);
          transform: translate(-50%, -50%);
        }
      }
    }
  }

  &--cloud {
    div {
      &:nth-of-type(1) {
        background: var(--cloud-one);
      }

      &:nth-of-type(2) {
        background: var(--cloud-two);
      }

      &:nth-of-type(3) {
        background: var(--cloud-three);
      }

      &:nth-of-type(4) {
        background: var(--cloud-four);
      }

      &:nth-of-type(5) {
        background: var(--cloud-five);
      }

      &:nth-of-type(6) {
        background: var(--cloud-six);
      }
    }
  }

  &--beacon {
    --thickness: calc(var(--base-size) * 0.02);

    div {
      background: hsl(0deg 90% 50% / var(--alpha));
    }
  }

  &--strobe {
    --thickness: calc(var(--base-size) * 0.02);

    div {
      background: hsl(0deg 90% 98% / var(--alpha));
    }
  }
}

.auth-overlay {
  position: fixed;
  inset: 0;
}

.auth-bg {
  // CSS 变量定义在此，通过继承传递给所有子元素，不影响其他页面
  --dark: 0;
  --base-size: 20;
  --plane-height: calc(var(--base-size) * 1vmin);
  --plane-width: calc(var(--plane-height) * 1.6);
  --white-one: hsl(0deg, 0%, calc((90 - (var(--dark) * 30)) * 1%));
  --white-two: hsl(0deg, 0%, calc((85 - (var(--dark) * 30)) * 1%));
  --white-three: hsl(0deg, 0%, calc((80 - (var(--dark) * 30)) * 1%));
  --white-four: hsl(0deg, 0%, calc((75 - (var(--dark) * 30)) * 1%));
  --white-five: hsl(0deg, 0%, calc((70 - (var(--dark) * 30)) * 1%));
  --accent-hue: 10;
  --accent-one: hsl(var(--accent-hue) 80% calc((60 - (var(--dark) * 20)) * 1%));
  --accent-two: hsl(var(--accent-hue) 80% calc((55 - (var(--dark) * 20)) * 1%));
  --accent-three: hsl(
    var(--accent-hue) 80% calc((50 - (var(--dark) * 20)) * 1%)
  );
  --accent-four: hsl(
    var(--accent-hue) 80% calc((45 - (var(--dark) * 20)) * 1%)
  );
  --accent-five: hsl(
    var(--accent-hue) 80% calc((40 - (var(--dark) * 20)) * 1%)
  );
  --screen: hsla(210deg, 80%, calc((70 - (var(--dark) * 20)) * 1%), 25%);
  --metal-one: hsl(0deg, 0%, calc((60 - (var(--dark) * 20)) * 1%));
  --metal-two: hsl(0deg, 0%, calc((50 - (var(--dark) * 20)) * 1%));
  --metal-three: hsl(0deg, 0%, calc((40 - (var(--dark) * 20)) * 1%));
  --wheel-one: #1a1a1a;
  --wheel-two: #0d0d0d;
  --wheel-three: #000;
  --wheel-hub: hsl(0deg, 0%, calc((98 - (var(--dark) * 20)) * 1%));
  --bg: hsl(210deg, 80%, calc((90 - (var(--dark) * 76)) * 1%));
  --night: #082949;
  --cloud-one: hsl(0deg, 0%, calc((98 - (var(--dark) * 35)) * 1%));
  --cloud-two: hsl(0deg, 0%, calc((94 - (var(--dark) * 35)) * 1%));
  --cloud-three: hsl(0deg, 0%, calc((90 - (var(--dark) * 35)) * 1%));
  --cloud-four: hsl(0deg, 0%, calc((86 - (var(--dark) * 35)) * 1%));
  --cloud-five: hsl(0deg, 0%, calc((82 - (var(--dark) * 35)) * 1%));
  --cloud-six: hsl(0deg, 0%, calc((78 - (var(--dark) * 35)) * 1%));

  position: fixed;
  inset: 0;
  z-index: -1;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: var(--bg);

  // 3D 重置只作用于当前组件内的元素
  *,
  *::after,
  *::before {
    box-sizing: border-box;
    transform-style: preserve-3d;
    transition: background 0.25s;
  }
}

.scene {
  position: fixed;
  top: 50%;
  left: 35%;
  transform: translate(-50%, -50%);
  transform: translate3d(-50%, -50%, 100vmin) rotateX(-24deg) rotateY(44deg)
    rotateX(calc(var(--rotate-x, 0) * 1deg))
    rotateY(calc(var(--rotate-y, 0) * 1deg));
}

.plane {
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--plane-width);
  height: var(--plane-height);
  transform: translate(-50%, -50%);

  * {
    position: absolute;
  }

  &__floater {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--plane-width);
    height: var(--plane-width);
    transform: translate(-50%, -50%);
  }

  &__looper {
    position: absolute;
    top: 50%;
    left: 50%;
    width: var(--plane-width);
    height: var(--plane-width);
    transform: translate(-50%, -50%);
    transform-origin: 50% 0;
  }

  &__body {
    bottom: 20%;
    left: 10%;
    width: 36%;
    height: 40%;
  }

  &__wheels {
    bottom: 0;
    left: 32%;
    width: calc(var(--plane-height) * 0.2);
    height: 20%;
    transform: translate(-50%, 0);
  }

  &__axle {
    top: 50%;
    left: 50%;
    width: 50%;
    height: 50%;
    transform: translate(-50%, -50%);
  }

  &__wheel {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    &--left {
      transform: translate3d(0, 0, calc(var(--base-size) * 0.3vmin));
    }

    &--right {
      transform: translate3d(0, 0, calc(var(--base-size) * -0.3vmin));
    }
  }

  &__wings {
    bottom: 19%;
    left: 12%;
    width: 40%;
    height: 70%;
  }

  &__tail {
    bottom: 20%;
    left: 46%;
    width: 54%;
    height: 40%;
  }

  &__nose {
    bottom: 25%;
    width: 10%;
    height: 30%;
  }

  &__stabilizer {
    &--horizontal {
      right: 1%;
      bottom: 50%;
      width: 16%;
      height: 9%;
    }

    &--vertical {
      right: 0;
      bottom: 60%;
      width: 20%;
      height: 20%;
    }
  }

  &__screen {
    bottom: 60%;
    left: 30%;
    width: 6%;
    height: 14%;
  }

  &__propellor {
    bottom: 40%;
    left: -1%;
    width: calc(var(--base-size) * 0.75vmin);
    height: calc(var(--base-size) * 0.75vmin);
    transform: translate(-50%, 50%) rotateY(-90deg);

    &::after {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 16%;
      height: 16%;
      content: '';
      background: var(--white-one);
      border-radius: 50%;
      transform: translate3d(-50%, -50%, 2px);
    }
  }

  &__beacon {
    right: 1%;
    bottom: 80%;
    width: 2%;
    height: 2%;
  }
}

.propellor {
  width: 100%;
  height: 100%;

  &::after,
  &::before {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10%;
    height: 100%;
    content: '';
    background:
      linear-gradient(
        transparent 0 5%,
        var(--accent-two) 5% 15%,
        transparent 15% 85%,
        var(--accent-two) 85% 95%,
        transparent 95%
      ),
      #000;
    transform: translate(-50%, -50%) rotate(calc(var(--r, 45) * 1deg));
  }

  &::after {
    --r: -45;
  }
}

.wings {
  &__ghost {
    bottom: 10%;
    left: 50%;
    width: 80%;
    height: 80%;
    transform: translate(-50%, 0);
  }

  &__top {
    top: 0;
    left: 0;
    width: 100%;
    height: 10%;
  }

  &__bottom {
    bottom: 0;
    left: 0;
    width: 100%;
    height: 10%;
  }

  &__strobe {
    bottom: 10%;
    left: 50%;
    width: 4%;
    height: 4%;

    &--left {
      transform: translate3d(-50%, 0, calc(var(--base-size) * 1vmin));
    }

    &--right {
      transform: translate3d(-50%, 0, calc(var(--base-size) * -1vmin));
    }
  }
}

.cloud {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 15vmin;
  height: 10vmin;
  transform: translate(-50%, -50%);

  &--one {
    --speed: 2;
    --delay: 3;

    transform: translate(-50%, -50%) translate3d(-40vmin, 20vmin, 26vmin);
  }

  &--two {
    --speed: 4;
    --delay: 1;

    transform: translate(-50%, -50%) translate3d(30vmin, -15vmin, -34vmin);
  }

  &--three {
    --speed: 6;
    --delay: 2;

    transform: translate(-50%, -50%) translate3d(50vmin, 35vmin, -14vmin);
  }

  &__shift {
    width: 100%;
    height: 100%;
  }

  &__body {
    width: 100%;
    height: 100%;

    > div {
      position: absolute;

      &:nth-of-type(1) {
        --thickness: calc(var(--base-size) * 0.2);

        bottom: 0;
        left: 25%;
        width: 60%;
        height: 90%;
      }

      &:nth-of-type(2) {
        --thickness: calc(var(--base-size) * 0.3);

        bottom: 0;
        left: 0;
        width: 50%;
        height: 60%;
      }

      &:nth-of-type(3) {
        --thickness: calc(var(--base-size) * 0.4);

        right: 0%;
        bottom: 0;
        width: 60%;
        height: 40%;
      }
    }
  }
}

@media (prefers-reduced-motion: no-preference) {
  .plane {
    animation: roll 10s infinite ease-out alternate;
  }

  .plane__floater {
    animation: float 2s infinite ease-in-out;
  }

  .plane__looper {
    animation: loop 10s infinite ease-in-out;
  }

  .cuboid--beacon {
    animation: flash calc(var(--dark) * 1s) infinite;
  }

  .cuboid--strobe {
    animation: flash calc(var(--dark) * 0.5s) infinite;
  }

  .propellor {
    animation: spin 0.35s infinite linear;
  }

  .cloud__shift {
    animation: pan calc(var(--speed, 5) * 1s) calc(var(--delay, 5) * -1s)
      infinite ease-in-out both;
  }

  .cloud__body {
    animation: scale calc(var(--speed, 5) * 1s) calc(var(--delay, 5) * -1s)
      infinite linear;
  }
}

@keyframes flash {
  50% {
    --alpha: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes float {
  50% {
    transform: translate(-50%, -40%);
  }
}

@keyframes loop {
  0%,
  40% {
    transform: translate(-50%, -50%);
  }

  50%,
  100% {
    transform: translate(-50%, -50%) rotateZ(360deg);
  }
}

@keyframes roll {
  0%,
  85% {
    transform: translate(-50%, -50%);
  }

  90%,
  100% {
    transform: translate(-50%, -50%) rotateX(-360deg);
  }
}

@keyframes nightshift {
  0%,
  50% {
    background: var(--bg);
  }

  75%,
  100% {
    background: var(--night);
  }
}

@keyframes scale {
  0%,
  5%,
  95%,
  100% {
    transform: scale(0);
  }

  10%,
  90% {
    transform: scale(1);
  }
}

@keyframes pan {
  0% {
    transform: translate(-1000%, 0);
  }

  100% {
    transform: translate(1000%, 0);
  }
}
</style>
