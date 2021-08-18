<template>
  <article class="prose-sm prose lg:prose-lg xl:prose-xl mx-auto">
    <img
      :src="require(`~/assets/${app.thumbnail}`)"
      alt="App Thumbnail"
      class="shadow-lg rounded-md"
    />

    <AppHeader :app="app" />

    <nuxt-content :document="app" />
  </article>
</template>

<script>
export default {
  async asyncData({ $content, params: { slug }, error }) {
    let app;
    try {
      app = await $content('apps', slug).fetch();
    } catch (e) {
      error({ message: 'App not found', status: 404 });
    }

    return {
      app,
    };
  },
};
</script>
