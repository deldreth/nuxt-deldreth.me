<template>
  <div class="gap-8 grid grid-cols-1">
    <div v-for="group in articles" :key="group.year">
      <div class="text-3xl 2xl:text-4xl text-pink mt-4 mb-4">
        {{ group.year }}
      </div>

      <Article
        v-for="article in group.articles"
        :key="article.slug"
        :article="article"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  async asyncData({ $content }: any) {
    let articles = await $content('articles', { deep: true })
      .sortBy('date', 'desc')
      .fetch();

    articles = articles.reduce((acc: any, article: any) => {
      const year = new Date(article.date).getFullYear();
      const found = acc.find((a: any) => a.year === year);
      if (!found) {
        acc.push({
          year,
          articles: [article],
        });
      } else {
        found.articles.push(article);
      }

      return acc;
    }, []);

    return {
      articles,
    };
  },
};
</script>
