<template>
  <div class="toc mt-6 flex flex-wrap">
    <NavItem
      v-for="entry in toc.filter((item) => item.depth <= 2)"
      :key="entry.id"
      :active="true"
      :to="`#${entry.id}`"
      class="mr-4 mb-4"
      >#{{ entry.text }}</NavItem
    >
  </div>
</template>

<script>
export default {
  props: {
    toc: {
      type: Array,
      required: true,
    },
  },
};
</script>
