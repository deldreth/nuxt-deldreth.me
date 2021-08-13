<template>
  <header
    class="
      bg-gray-900
      border-b-2 border-purple
      grid grid-cols-2
      md:gap-0 md:grid-cols-3 md:grid-rows-1 md:p-8
      p-4
      place-items-center
      shadow-xl
      text-dracula
    "
  >
    <div
      class="
        col-span-2
        flex
        gap-8
        md:col-span-1 md:mt-0 md:order-first md:place-self-start md:self-center
        mt-8
        order-last
      "
    >
      <NavItem
        :active="
          $route.name === 'index' || $route.name === 'articles-year-slug'
        "
        :to="'/'"
        >Blog</NavItem
      >
      <NavItem :active="$route.name === 'apps'" :to="'/apps'">Apps</NavItem>
    </div>

    <div class="md:text-4xl text-3xl font-light">@deldreth</div>

    <Icons />
  </header>
</template>

<script lang="ts">
export default {
  watch: {
    $route() {
      console.log(this.$route.name);
    },
  },
};
</script>
