<template>
  <div class="flex gap-4 md:place-self-end md:self-center text-2xl text-green">
    <a
      ><img
        :src="require('~/assets/walter.png')"
        class="max-h-8"
        alt="Walter Melon"
    /></a>
    <a href="http://github.com/deldreth" target="_blank"
      ><font-awesome-icon :icon="['fab', 'github']"
    /></a>
    <a href="http://twitter.com/deldreth" target="_blank"
      ><font-awesome-icon :icon="['fab', 'twitter']"
    /></a>
    <a href="https://www.linkedin.com/in/deldreth" target="_blank"
      ><font-awesome-icon :icon="['fab', 'linkedin']"
    /></a>
  </div>
</template>
