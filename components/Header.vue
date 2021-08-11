<template>
  <header
    class="
      bg-gray-900
      border-b-2 border-purple
      p-8
      shadow-xl
      text-dracula
      grid
      md:grid-cols-3
      place-items-center
    "
  >
    <navigation class="place-self-start self-center">
      <NavItem :active="true">Blog</NavItem>
      <NavItem>Apps</NavItem>
    </navigation>
    <div class="text-4xl font-semibold">@deldreth</div>
    <div class="place-self-end self-center">Links</div>
  </header>
</template>

<script lang="ts">
export default {
  created() {
    console.log(this.$router.options.routes);
  },
};
</script>
