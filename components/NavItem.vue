<template>
  <nuxt-link
    class="font-semibold p-1 pl-6 pr-6 rounded-full text-md md:text-xl"
    :class="
      active
        ? 'text-gray-900 shadow-lg bg-gradient-to-b from-cyan to-purple'
        : 'text-cyan'
    "
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
      required: true,
    },
  },
};
</script>
