<script setup lang="ts">
defineOptions({
  name: 'AuthenticationFormView',
});

defineProps<{
  dataSide?: 'bottom' | 'left' | 'right' | 'top';
}>();
</script>

<template>
  <div class="relative">
    <slot></slot>

    <!-- Router View with Transition and KeepAlive -->
    <RouterView v-slot="{ Component, route }">
      <Transition appear mode="out-in" name="slide-right">
        <KeepAlive :include="['Login']">
          <component
            :is="Component"
            :key="route.fullPath"
            class="side-content mt-6 w-full sm:mx-auto md:max-w-md"
            :data-side="dataSide"
          />
        </KeepAlive>
      </Transition>
    </RouterView>

    <!-- Footer Copyright -->
    <div class="absolute bottom-3 right-3 flex text-xs text-muted-foreground">
      <slot name="copyright"> </slot>
    </div>
  </div>
</template>
