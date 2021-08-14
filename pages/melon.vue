<template>
  <div class="prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto">
    <section>
      <h1>About Me</h1>

      <p>
        I'm a father, husband, and front end software developer. I also have a
        penchant for watermelon iconography (and sometimes the fruiting bodies
        of citrullus lanatus). I've been developing software and web
        applications for 17 years. As a result I've worked on a lot of different
        projects, but my focus has always been web development (currently React,
        even). If you're super interested in my work then I suggest checking out
        some of my open source projects.
      </p>
    </section>

    <section>
      <h2>Current Position</h2>

      <p>Senior Front End Developer at eMoney Advisor, Inc.</p>

      <div class="flex justify-center">
        <img
          :src="require('~/assets/walter.png')"
          alt="walter melon"
          class="max-h-48"
        />
      </div>
    </section>
  </div>
</template>
