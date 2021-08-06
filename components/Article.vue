<template>
  <section class="bg-gray-700 p-6 rounded-lg shadow-lg">
    <img
      v-if="article.thumbnail"
      :src="require(`~/assets/${article.thumbnail}`)"
      class="thumbnail max-h-40"
      alt=""
    />

    <h2>
      <nuxt-link :to="article.path" class="text-indigo-900">{{
        article.title
      }}</nuxt-link>
    </h2>

    <h3>{{ article.date | formatDate }}</h3>

    <nuxt-content :document="{ body: article.excerpt }" />

    <Tag v-for="tag in article.tags" :key="tag" :tag="tag" />
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
