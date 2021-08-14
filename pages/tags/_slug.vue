<template>
  <ArticleGroups :articles="articles" />
</template>

<script lang="ts">
export default {
  async asyncData({ $content, params: { slug } }) {
    const articles = await $content('articles', { deep: true })
      .where({ tags: { $contains: slug } })
      .sortBy('date', 'desc')
      .fetch();

    return {
      articles,
    };
  },
};
</script>
