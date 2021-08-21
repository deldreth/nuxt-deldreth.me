<template>
  <ArticleGroups :articles="articles" />
</template>

<script lang="ts">
export default {
  async asyncData({ $content }: any) {
    const articles = await $content('articles', { deep: true })
      .where({ published: true })
      .sortBy('date', 'desc')
      .fetch();

    return {
      articles,
    };
  },
};
</script>
