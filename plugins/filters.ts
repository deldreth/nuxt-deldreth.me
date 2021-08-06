import Vue from 'vue';

Vue.filter('formatDate', (date: string) =>
  new Date(date).toLocaleDateString('en-US')
);