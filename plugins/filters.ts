import Vue from 'vue';

Vue.filter('formatDate', (date: string) =>
  new Intl.DateTimeFormat('en-US', { year: "numeric", month: "long", day: "numeric" }).format(new Date(date))
);
