<template>
  <div class="prose max-w-none grid grid-cols-1 gap-8">
    <section
      v-for="app in apps"
      :key="app.title"
      class="bg-gray-700 md:p-6 p-4 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      <div class="-mt-8 -mb-8">
        <img :src="require(`~/assets/${app.thumbnail}`)" class="md:max-h-96 shadow-lg mb-8 rounded-md" />
      </div>

      <div class="md:col-span-2">
        <AppHeader :app="app" title-link />

        <nuxt-content :document="{ body: app.excerpt }" class="text-light md:text-lg xl:text-xl" />
      </div>
    </section>
  </div>
</template>

<script lang="ts">
export default {
  async asyncData({ $content }: any) {
    const apps = await $content('apps', { deep: true }).sortBy('title', 'asc').fetch();

    return {
      apps,
    };
  },
};
</script>
