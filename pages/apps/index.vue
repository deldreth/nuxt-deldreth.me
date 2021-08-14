<template>
  <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
    <section
      v-for="app in apps"
      :key="app.title"
      class="bg-gray-700 grid grid-cols-1 mb-8 md:p-6 p-4 rounded-lg shadow-lg"
    >
      <h2
        class="
          leading-normal
          mb-2
          mt-4
          text-indigo-300 text-lg
          md:text-2xl
          xl:text-3xl
        "
      >
        {{ app.title }}
      </h2>

      <h3 class="mb-4 text-green md:text-xl xl:text-2xl">
        <a :href="app.link" target="_blank" class="hover:underline">{{
          app.link
        }}</a>
      </h3>

      <img
        :src="require(`~/assets/${app.thumbnail}`)"
        class="place-self-center max-h-96 shadow-lg mb-8 rounded-md"
      />

      <nuxt-content
        :document="{ body: app.body }"
        class="text-light md:text-lg xl:text-xl"
      />

      <h4 :if="app.github" class="mb-4 text-red md:text-lg xl:text-xl">
        <a :href="app.github" target="_blank" class="hover:underline">{{
          app.github
        }}</a>
      </h4>

      <!-- <div>
        <Tag v-for="tag in app.tags" :key="tag" :tag="tag" />
      </div> -->
    </section>
  </div>
</template>

<script lang="ts">
export default {
  async asyncData({ $content }: any) {
    const apps = await $content('apps', { deep: true })
      .sortBy('title', 'asc')
      .fetch();

    console.log(apps);

    return {
      apps,
    };
  },
};
</script>
