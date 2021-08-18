<template>
  <div class="bg-gray-900 border-b-2 border-purple">
    <header
      class="
        grid grid-cols-1
        md:gap-0 md:grid-cols-3 md:grid-rows-1 md:p-8
        p-4
        place-items-center
        shadow-xl
        text-dracula
        max-w-screen-md
        xl:max-w-screen-xl
        md:p-8
        mx-auto
      "
    >
      <div
        class="
          flex
          gap-4
          md:col-span-1
          md:mt-0
          md:order-first
          md:place-self-start
          md:self-center
          mt-4
          order-last
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
