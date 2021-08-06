<template>
  <div
    class="
      gap-8
      grid grid-cols-1
      lg:grid-cols-3
      max-w-screen-2xl
      md:grid-cols-2
      mx-auto
      p-8
      pb-16
      prose
      pt-16
      sm:grid-cols-1
    "
  >
    <Article
      v-for="article in articles"
      :key="article.slug"
      :article="article"
    />
  </div>
</template>

<script lang="ts">
export default {
  async asyncData({ $content }: any) {
    const articles = await $content('articles', { deep: true })
      .sortBy('date', 'desc')
      .fetch();

    return {
      articles,
    };
  },
  head: {
    bodyAttrs: {
      class: 'bg-gray-800',
    },
  },
};
</script>
