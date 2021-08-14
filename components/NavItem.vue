<template>
  <nuxt-link
    class="
      font-medium
      p-1
      pl-6
      pr-6
      rounded-full
      text-md
      md:text-xl
      border-2 border-cyan
    "
    :class="active ? 'text-gray-900 shadow-lg bg-cyan' : 'text-cyan'"
    :to="to"
  >
    <slot></slot>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
    },
  },
};
</script>
