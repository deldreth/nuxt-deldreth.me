<template>
  <a
    class="font-medium p-1 pl-6 pr-6 rounded-full text-xl border-2 border-red"
    :class="active ? 'text-gray-900 shadow-lg bg-red' : 'text-red'"
  >
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
