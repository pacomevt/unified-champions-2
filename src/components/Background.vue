<template>
  <div class="c-background">
    <div class="c-background__bar"></div>
  </div>
</template>

<script>
import { Background } from '@/assets/script/classes/Background';
export default {
  name: 'Background',
  data() {
    return {
      background: {},
    }
  },
  methods : {
    start() {
      this.background.start = true;
    }
  },
  mounted() {
    this.background = new Background(document.querySelector('.c-background'), () => {
      this.$emit('background-loaded');
    });
  }
}
</script>

<style lang="scss">
.c-background {
  position: fixed;
  z-index: -5;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-image: url('../assets/img/texture-dark.jpg');
  background-size: 100%;
  background-position: center;
  
  & canavs {
    position: absolute;
    top: 0;
    left: 0;
  }

  // &__bar {
  //   height: calc(100vh - 8rem);
  //   width: 0.1rem;
  //   position: absolute;
  //   top: 8rem;
  //   left: 2%;
  //   background-color: #fff;
  // }



}
</style>