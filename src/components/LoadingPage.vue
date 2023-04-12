<template>
  <section class="c-loading-page">
    <div id="loading-page-container" class="c-loading-page__container">
      <h2 class="c-loading-page__title">Chargement ...</h2>
    </div>
  </section>
</template>

<script>
import { LoadingPage } from '@/assets/script/LoadingPage.js';

export default {
  name: 'LoadingPage',
  mounted() {
      const loadingPage = new LoadingPage(document.querySelector('#loading-page-container'));
  }
}
</script>

<style lang="scss">
.c-loading-page {
  width: 100vw;
  height: 100vh;

  display: flex;
  justify-content: center;
  align-items: center;

  &__title {
    font-size: 2rem;
    color: white;
  }

  &__container {
    width: 100%;
    height: 100%;
    background-color: black;
    z-index: 100;
  }
}
</style>