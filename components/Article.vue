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
      class="max-h-32 md:max-h-full rounded-md"
      v-if="article.thumbnail"
    />

    <div class="col-span-2 md:ml-6" :class="!article.thumbnail && 'col-span-3'">
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
        <nuxt-link :to="article.path">{{ article.title }}</nuxt-link>
      </h2>

      <h3 class="mb-4 text-green md:text-xl xl:text-2xl">
        <time :datetime="article.date">{{ article.date | formatDate }}</time>
      </h3>

      <nuxt-content
        :document="{ body: article.excerpt }"
        class="mb-4 text-light md:text-lg xl:text-xl"
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
