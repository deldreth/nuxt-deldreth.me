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
      <NavItem :active="true">Blog</NavItem>
      <NavItem>Apps</NavItem>
    </div>
    <div class="font-semibold md:text-4xl text-2xl">@deldreth</div>
    <div
      class="flex gap-4 md:place-self-end md:self-center text-2xl text-green"
    >
      <a
        ><img
          :src="require('~/assets/walter.png')"
          class="max-h-8"
          alt="Walter Melon"
      /></a>
      <a><font-awesome-icon :icon="['fab', 'github']" /></a>
      <a><font-awesome-icon :icon="['fab', 'twitter']" /></a>
      <a><font-awesome-icon :icon="['fab', 'linkedin']" /></a>
    </div>
  </header>
</template>

<script lang="ts">
export default {
  created() {
    // console.log(this.$router.options.routes);
  },
};
</script>
