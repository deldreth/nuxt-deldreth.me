<template>
  <div class="prose prose-sm max-w-none">
    <div
      v-for="group in groups"
      :key="group.year"
      class="gap-6 grid grid-cols-1 mb-10"
    >
      <div class="text-2xl md:text-3xl xl:text-4xl text-pink text-right">
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

<script>
export default {
  props: {
    articles: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      groups: this.articles.reduce((acc, article) => {
        const year = new Date(article.date).getFullYear();
        const found = acc.find((a) => a.year === year);
        if (!found) {
          acc.push({
            year,
            articles: [article],
          });
        } else {
          found.articles.push(article);
        }

        return acc;
      }, []),
    };
  },
};
</script>
