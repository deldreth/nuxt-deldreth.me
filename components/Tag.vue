<template>
  <a
    :href="`/tags/${tag}`"
    class="
      bg-orange
      inline-block
      mb-4
      mr-4
      pl-4
      pr-4
      p-1
      rounded-full
      shadow-lg
      tag
      text-sm
    "
  >
    {{ tag }}
  </a>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      required: true,
    },
  },
};
</script>
