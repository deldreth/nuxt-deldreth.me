<template>
  <div class="prose prose-sm max-w-none grid grid-cols-1 gap-6">
    <Card v-for="app in apps" :key="app.title">
      <CardThumbnail :thumbnail="app.thumbnail" />

      <div class="md:col-span-2">
        <AppHeader :app="app" title-link />

        <nuxt-content
          :document="{ body: app.excerpt }"
          class="text-light md:text-lg xl:text-xl"
        />
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
export default {
  async asyncData({ $content }: any) {
    const apps = await $content('apps', { deep: true })
      .sortBy('date', 'desc')
      .fetch();

    return {
      apps,
    };
  },
};
</script>
