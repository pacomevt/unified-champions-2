<template>
  <section class="c-hero">
     <div class="c-hero__content">
        <div class="c-hero__titles">
          <span class="c-hero__prefix">We are</span>
          <h1 class="c-hero__title">Unified Champions</h1>
        </div>
        <div class="c-hero__h-bar"></div>
        <div class="c-hero__v-bar">
        </div>
     </div>
     <div class="c-hero__vibrant"></div>
  </section>
  </template>
  
  <script>
  import { VibrantPlane } from '../assets/script/classes/VibrantPlane';
  export default {
    name: 'Hero',
    data() {
    return {
      hero: {},
    }
  },
  methods : {
    start() {
      this.hero.start = true;
    }
  },
  mounted() {
    this.hero = new VibrantPlane(document.querySelector('.c-hero__vibrant'), () => {
      this.$emit('hero-loaded');
    });
  }
}
  </script>
  
  <style lang="scss">
  .c-hero {
    position: relative;
    height: 100vh;
    width: 100%;
    z-index: 1;
    &__vibrant {
      position: absolute;
      top: 5rem;
      right: 5rem;
      width: 60%;
      height: 80%;
      z-index: -1;
      & canvas {
        border: 0.4rem solid #fff;
      }
    }


    &__content {
      color: #fff;
      top: 0%;
      margin-left: 10vw;
      display: flex;
      flex-direction: column;
      height: 100vh;
    }

    &__titles {
      display: flex;
      flex-direction: column;
      justify-content: end;
      height: 70%;
    }

    &__prefix {
      font-size: 2vw;
      letter-spacing: 0.1rem;
      text-transform: uppercase;
      border-left: 0.4rem solid #fff;
      padding: 1rem 3rem;
    }

    &__title {
      font-size: 7vw;
      letter-spacing: 0.1rem;
      text-transform: uppercase;
    }

    &__h-bar {
      height: 0.4rem;
      width: 10vw;
      background-color: #fff;
    }
    &__v-bar {
      height: 30%;
      width: 0.4rem;
      background-color: #fff;
    }
  }
  
  </style>