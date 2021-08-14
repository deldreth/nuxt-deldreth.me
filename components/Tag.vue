<template>
  <a
    :href="`/tags/${tag}`"
    class="
      bg-orange
      inline-block
      mb-4
      mr-4
      p-1
      rounded-full
      shadow-lg
      tag
      text-sm
    "
  >
    <span class="ml-4 mr-4 text-gray-800 no-underline">{{ tag }}</span>
  </a>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
    },
  },
};
</script>
