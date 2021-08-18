<template>
  <div
    v-if="thumbnail"
    :style="{ backgroundColor }"
    :class="backgroundColor && 'pr-6 pl-6'"
    class="flex h-32 md:h-64 items-center justify-center rounded-md shadow-lg"
  >
    <img
      :src="require(`~/assets/${thumbnail}`)"
      alt="Article thumbnail"
      :class="backgroundColor ? 'object-contain' : 'object-cover'"
      class="rounded-md h-full w-full"
    />
  </div>
</template>

<script>
export default {
  props: {
    thumbnail: {
      type: String,
      default: null,
    },
    backgroundColor: {
      type: String,
      default: null,
    },
  },
};
</script>
