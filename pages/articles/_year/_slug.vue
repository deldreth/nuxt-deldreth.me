<template>
  <article class="prose-sm prose lg:prose-lg xl:prose-xl mx-auto">
    <h1>{{ article.title }}</h1>
    <h2>
      <time :datetime="article.date">{{ article.date | formatDate }}</time>
    </h2>

    <nuxt-content :document="article" />
  </article>
</template>

<script>
export default {
  async asyncData({ $content, params: { year, slug }, error }) {
    let article;
    try {
      article = await $content('articles', year, slug).fetch();
    } catch (e) {
      error({ message: 'Article not found', status: 404 });
    }

    return {
      article,
    };
  },
};
</script>
