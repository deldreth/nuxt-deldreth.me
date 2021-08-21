<template>
  <div
    class="
      flex
      gap-3
      lg:place-self-end lg:self-center
      text-2xl
      lg:text-4xl
      text-green
    "
  >
    <a href="/melon">
      <img
        :src="require('~/assets/walter.png')"
        class="max-h-8 lg:max-h-10"
        alt="Walter Melon"
      />
    </a>
    <a
      href="http://github.com/deldreth"
      target="_blank"
      aria-label="github profile"
    >
      <font-awesome-icon :icon="['fab', 'github']" />
    </a>
    <a
      href="http://twitter.com/deldreth"
      target="_blank"
      aria-label="twitter profile"
    >
      <font-awesome-icon :icon="['fab', 'twitter']" />
    </a>
    <a
      href="https://www.linkedin.com/in/deldreth"
      target="_blank"
      aria-label="linkedin profile"
    >
      <font-awesome-icon :icon="['fab', 'linkedin']" />
    </a>
  </div>
</template>
