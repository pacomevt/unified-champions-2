<template>
<div class="l-landing-page">
  <main>
    <LoadingPage v-if="loading" />
    <Hero v-on:hero-loaded="handleLoading('hero')" ref="hero"/>
    <Club v-on:club-loaded="handleLoading('club')" ref="club"/>
    <Merch v-on:merch-loaded="handleLoading('merch')" ref="merch"/>
    <Background />
    </main>
</div>
</template>

<script>
import LoadingPage from '../components/LoadingPage.vue';
import Hero from '@/components/Hero.vue';
import Club from '@/components/Club.vue';
import Merch from '../components/Merch.vue';
import Background from '@/components/Background.vue';
export default {
  name: 'HomeView',
  data() {
    return {
      loader: [],
      loading: true
    }
  },
  components: {
    Hero,
    Background,
    Club,
    Merch,

    // Talent,
    // Universite,
    LoadingPage
  },
  methods: {
    handleLoading(component) {
      this.loader[component] = true;
      if (Object.values(this.loader).every(value => value === true)) {
        this.loading = false;
        this.start();
      }
    },
    start() {
      console.log('all files loaded -> ', this.loader);
        // document.querySelectorAll('.-js-animated-title').forEach(title => {
        //   const animatedTitle = new AnimatedTitle(title);
        // });
        this.$refs.hero.start();
        this.$refs.club.start();
        this.$refs.merch.start();
    }
  },
  mounted() {
    const components = [
      "hero",
      "club",
      "merch"
    ];
    components.forEach(component => {
      this.loader[component] = false;
    });
  }
}
</script>

<style lang="scss">
$blur-white: rgba(255, 255, 255, 0.1);
$blur-purple : rgba(164, 33, 240, 0.1);
$white: #fff;

body {
  background-color: rgb(0, 0, 0);
}
.l-landing-page {
  width: 100%;
  min-height: 500vh;
}
</style>