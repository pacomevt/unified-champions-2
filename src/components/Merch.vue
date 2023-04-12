<template>
  <section class="c-merch">
      <h2 class="c-merch__title -js-animated-title">MERCH</h2>
      <div id="merch_three" class="c-merch__container">
      </div>
      <div class="c-merch__card">
          Nouveau maillot, portez nous <span class="-is-purple">couleurs</span> !
      </div>
      <div class="c-merch__card">
          Fiers de nos logos
      </div>
      <div class="c-merch__card">
          Autre lorem
      </div>
  </section>
</template>

<script>
import { Merch } from '@/assets/script/classes/Merch.js';
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default {
  name: 'Merch',
  data() {
    return {
      merch: {},
      triggers: [],

    }
  },
  methods: {
    start() {
      const merch = document.querySelector('.c-merch');
      merch.style.opacity = 1;
      this.merch.start = true;

      // gsap.registerPlugin(ScrollTrigger);

      // this.triggers = [];
      // document.querySelectorAll('.c-merch__card').forEach(el => {

      //   ScrollTrigger.create({
      //     trigger: el,
      //     start: 'top 80%',
      //     end: 'bottom 20%',
      //     onEnter: () => el.classList.add('visible'),
      //     onLeave: () => el.classList.remove('visible'),
      //     onEnterBack: () => el.classList.add('visible'),
      //     onLeaveBack: () => el.classList.remove('visible'),
      //   });
      // })
    }
  },
  beforeDestroy() {
    // this.triggers.forEach(t => {
    //   t.kill()
    // })
  },
  mounted() {
    this.merch = new Merch(
      document.querySelector('#merch_three'),
      document.querySelector('.c-merch'), 
      () => {
        this.$emit('merch-loaded');
      });  
    }
}
</script>

<style lang="scss">
.c-merch {


  & .-is-purple {
    color : #B14CFD;
  }
  opacity: 0;
  position: relative;
  width: 100%;
  margin-top: 20vh;
  height: 1000vh;
  justify-content: center;

  &__container {
    position: sticky;
    top: 0;
    width: 100vw;
    height: 110vh;
  }

  &__title {
    position: sticky;
    top: 10rem;
    font-size: 10rem;
    width: fit-content;
    height: fit-content;
    color: white;
    display: block;
    margin: 0rem auto;
    text-align: center;
  }

  &__card {
    background-color: black;
    display: block;
    max-width: 100%;
    width: 50rem;
    color: white;
    padding: 3rem;

    position: relative;
    font-size: 2rem;
    top: 40%;
    left: 50%;

    transition: opacity 200ms ease;

    &:not(.visible) {
      opacity: 0;
    }


  }

}
</style>