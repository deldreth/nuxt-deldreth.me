<template>
  <div
    class="
      flex
      gap-3
      md:place-self-end md:self-center
      text-2xl
      md:text-4xl
      text-green
    "
  >
    <a href="/melon">
      <img
        :src="require('~/assets/walter.png')"
        class="max-h-8 md:max-h-10"
        alt="Walter Melon"
      />
    </a>
    <a href="http://github.com/deldreth" target="_blank">
      <font-awesome-icon :icon="['fab', 'github']" />
    </a>
    <a href="http://twitter.com/deldreth" target="_blank">
      <font-awesome-icon :icon="['fab', 'twitter']" />
    </a>
    <a href="https://www.linkedin.com/in/deldreth" target="_blank">
      <font-awesome-icon :icon="['fab', 'linkedin']" />
    </a>
  </div>
</template>
