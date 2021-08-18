<template>
  <div>
    <h1 class="flex justify-between">
      <nuxt-link v-if="titleLink" :to="app.path">{{ app.title }}</nuxt-link>
      <span v-else>{{ app.title }}</span>

      <a v-if="app.github" :href="app.github" target="_blank" alt="Github">
        <font-awesome-icon :icon="['fab', 'github']" class="text-green" />
      </a>
    </h1>

    <span class="text-lg md:text-xl">
      <a v-if="app.link" :href="app.link" target="_blank">
        <font-awesome-icon :icon="['fas', 'external-link-alt']" />
      </a>
      <a v-if="app.link" :href="app.link" target="_blank">
        {{ app.link }}
      </a>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    titleLink: {
      type: Boolean,
      default: false,
    },
    app: {
      type: Object,
      default() {
        return {
          title: '',
        };
      },
    },
  },
};
</script>
