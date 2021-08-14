<template>
  <ArticleGroups :articles="articles" />
</template>

<script>
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
