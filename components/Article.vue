<template>
  <Card>
    <CardThumbnail
      :thumbnail="article.thumbnail"
      :background-color="article.thumbnailBg"
    />

    <div class="sm:col-span-2" :class="!article.thumbnail && 'sm:col-span-3'">
      <h1>
        <nuxt-link :to="article.path">{{ article.title }}</nuxt-link>
      </h1>

      <h2 class="mb-4 text-green md:text-xl xl:text-2xl">
        <time :datetime="article.date">{{ article.date | formatDate }}</time>
      </h2>

      <nuxt-content
        :document="{ body: article.excerpt }"
        class="text-light md:text-lg xl:text-xl"
      />

      <Tag v-for="tag in article.tags" :key="tag" :tag="tag" />
    </div>
  </Card>
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
