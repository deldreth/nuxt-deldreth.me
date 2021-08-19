<template>
  <div class="bg-gray-900 border-b-2 border-purple shadow-xl">
    <header
      class="
        grid grid-cols-1
        lg:gap-0 lg:grid-cols-3 lg:grid-rows-1 lg:p-8
        p-4
        place-items-center
        text-dracula
        max-w-screen-lg
        xl:max-w-screen-xl
        lg:p-8
        mx-auto
      "
    >
      <div
        class="
          flex
          lg:col-span-1
          lg:mt-0
          lg:order-first
          lg:place-self-start
          lg:self-center
          mt-4
          order-last
          justify-around
          lg:justify-between
          w-full
          lg:w-1/2
        "
      >
        <NavItem
          :active="
            ['index', 'articles-year-slug', 'tags-slug'].includes($route.name)
          "
          :to="'/'"
          >Blog</NavItem
        >
        <NavItem
          :active="['apps', 'apps-slug'].includes($route.name)"
          :to="'/apps'"
          >Apps</NavItem
        >
        <!-- <NavItem
          :active="['arts', 'arts-slug'].includes($route.name)"
          :to="'/arts'"
          >Arts</NavItem
        > -->
      </div>

      <div
        class="md:text-4xl text-3xl font-light flex items-center mb-2 md:mb-0"
      >
        <img
          src="https://avatars1.githubusercontent.com/u/233009?v=4"
          alt="avatar"
          class="
            rounded-full
            border-2 border-white
            w-8
            mr-2
            shadow-lg
            align-middle
          "
        />
        deldreth
      </div>

      <Icons />
    </header>
  </div>
</template>

<script>
export default {
  watch: {
    $route() {},
  },
};
</script>
