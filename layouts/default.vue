<template>
  <div>
    <Header />

    <div
      class="max-w-screen-lg xl:max-w-screen-xl md:p-8 mx-auto p-4 pb-16 pt-8"
    >
      <Nuxt />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  head: {
    bodyAttrs: {
      class: 'bg-darker',
    },
  },
};
</script>

<style>
.nuxt-content-editor {
  background-color: #44475a;
}
</style>
