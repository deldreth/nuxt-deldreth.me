<template>
  <section
    class="
      bg-gray-700
      grid grid-cols-1
      mb-8
      md:grid-cols-3 md:p-6
      p-4
      place-content-center
      rounded-lg
      shadow-lg
    "
  >
    <img
      :src="require(`~/assets/${article.thumbnail}`)"
      :style="{ backgroundColor: article.thumbnailBg }"
      alt=""
      class="rounded-md max-h-32 md:max-h-full"
      v-if="article.thumbnail"
    />

    <div class="col-span-2 md:ml-6" :class="!article.thumbnail && 'col-span-3'">
      <h2 class="leading-normal mb-2 mt-4 text-lg md:text-2xl text-indigo-400">
        <nuxt-link :to="article.path">{{ article.title }}</nuxt-link>
      </h2>

      <h3 class="mb-4 text-green md:text-xl">
        {{ article.date | formatDate }}
      </h3>

      <nuxt-content
        :document="{ body: article.excerpt }"
        class="mb-4 text-sm md:text-lg text-white"
      />

      <Tag v-for="tag in article.tags" :key="tag" :tag="tag" />
    </div>
  </section>
</template>

<script lang="ts">
import { PropType } from 'vue';

interface IArticle {
  title: string;
  tags: string[];
}

export default {
  props: {
    article: {
      type: Object as PropType<IArticle>,
      required: true,
    },
  },
};
</script>
