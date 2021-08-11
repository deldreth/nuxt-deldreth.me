<template>
  <a
    class="font-medium mr-8 p-1 pl-6 pr-6 rounded-full text-xl"
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
