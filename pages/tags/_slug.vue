<template>
  <ArticleGroups :articles="articles" />
</template>

<script>
export default {
  async asyncData({ $content, params: { slug } }) {
    const articles = await $content('articles', { deep: true })
      .where({ tags: { $contains: slug }, published: true })
      .sortBy('date', 'desc')
      .fetch();

    return {
      articles,
    };
  },
};
</script>
