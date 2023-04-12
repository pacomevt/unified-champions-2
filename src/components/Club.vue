<template>
  <section class="c-club">
    <div class="c-club__wrapper">
      <div class="c-club__bar -v-1"></div>
      <div class="c-club__container">
        <div class="c-club__mask">
          <div class="c-club__scene"></div>
        </div>
        <div class="c-club__content">
          <h2 class="c-club__title">Club</h2>
          <p class="c-club__text -order-1">Depuis plus d’un an, on vibre ensemble.</p>
          <p class="c-club__text -order-2">Aujourd’hui, on peut vibrer ensemble sous les mêmes couleurs. Notre premier maillot Unified Champions voit le jour. </p>
          <p class="c-club__text -order-3">C’est une manière de vivre ses années étudiantes différemment. Maintenant, c’est également une nouvelle manière de s’habiller.</p>
          <p class="c-club__text -order-4">Soutenez Unified Champions Club en cours de sport, à la salle, et dans la vie de tous les jours.</p>
          <p class="c-club__text -order-5 -last">Devenez un champion.</p>
        </div>
      </div>
    </div>
  </section>
  <div class="c-club__bar -h-1"></div>
  </template>
  <script>
  
  import { VibrantFabric } from '../assets/script/classes/VibrantFabric';
  import { gsap } from 'gsap';
  import { ScrollTrigger } from 'gsap/ScrollTrigger';
  export default {
    name: 'Club',
    data() {
    return {
      club: {},
    }
  },
  methods : {
    start() {
      this.club.start = true;
      this.animate();
    },
    animate() {
      gsap.registerPlugin(ScrollTrigger);

      this.maskScrollTrigger = gsap.from('.c-club__mask', {
        scrollTrigger: {
          trigger: '.c-club__container',
          start: 'top 100%',
          end: 'bottom 30%',
          scrub: true,
          markers : true
        },
        width: '0px',
        height: '0px',
        duration: 1,
        ease: 'none',
        onComplete: () => {
          this.club.animate = true;
        }
      });

      this.text1 = gsap.to( '.c-club__text.-order-1', {
        scrollTrigger: {
          trigger: '.c-club',
          start: '20% 50%',
          end: 'bottom 20%',
        },
        opacity: 1,
        duration: 0.5,
        ease: 'none',
      });

      this.text2 = gsap.to( '.c-club__text.-order-2', {
        scrollTrigger: {
          trigger: '.c-club',
          start: '35% 50%',
          end: 'bottom 20%',
        },
        opacity: 1,
        duration: 0.5,
        ease: 'none',
      });

      this.text3 = gsap.to( '.c-club__text.-order-3', {
        scrollTrigger: {
          trigger: '.c-club',
          start: '50% 50%',
          end: 'bottom 20%',
        },
        opacity: 1,
        duration: 0.5,
        ease: 'none',
      });

      this.text4 = gsap.to( '.c-club__text.-order-4', {
        scrollTrigger: {
          trigger: '.c-club',
          start: '65% 50%',
          end: 'bottom 20%',
        },
        opacity: 1,
        duration: 0.5,
        ease: 'none',
      });

      this.text5 = gsap.to( '.c-club__text.-order-5', {
        scrollTrigger: {
          trigger: '.c-club',
          start: '80% 50%',
          end: 'bottom 20%',
        },
        opacity: 1,
        duration: 0.5,
        ease: 'none',
      });

      this.bar = gsap.to( '.c-club__bar.-h-1', {
        scrollTrigger: {
          trigger: '.c-club',
          start: '100% 50%',
          end: 'bottom 20%',
          scrub: true,
        },
        width: '100%',
      });

    }
  },
  beforeDestroy() {
    this.text1.scrollTrigger.kill();
    this.text2.scrollTrigger.kill();
    this.text3.scrollTrigger.kill();
    this.text4.scrollTrigger.kill();
    this.text5.scrollTrigger.kill();
    this.bar.scrollTrigger.kill();
    this.textTimeline.scrollTrigger.kill();
    this.club.dispose();
    this.club.destroy();

  },
  mounted() {
    this.club = new VibrantFabric(document.querySelector('.c-club__scene'), () => {
      this.$emit('club-loaded');
    });
  }
}
  </script>
  
  <style lang="scss">
  .c-club {
    position: relative;
    width: 100%;
    z-index: 1;
    padding-left: 10vw;
    height: 300vh;

    &__wrapper {
      position: sticky;
      top: 0;
      left: 0;
      width: 100%;
    }

    &__container {
      display: flex;
      gap: 12rem;
    }
    &__mask {
      overflow: hidden;
      border: 0.4rem solid #fff;
      width: 30vw;
      height: 30vw;
    }
    &__scene {
      width: 30vw;
      aspect-ratio: 1/1;
      // add a blur in center
      background-image: radial-gradient(circle at 50% 50%, transparent 0, transparent 20%, #25254450 40%, #4f4e5f50 100%);


    }

    &__content {
      display: flex;
      flex : 0.7;
      flex-direction: column;
      justify-content: center;
    }


    &__title {
      font-size: 8rem;
      font-weight: 900;
      margin-bottom: 2rem;
      color: #fff;
      text-transform: uppercase;
    }

    &__text {
      font-size: 2rem;
      font-weight: 400;
      line-height: 1.5;
      margin-bottom: 2rem;
      color: #fff;
      text-transform: uppercase;
      opacity: 0;
      &.-last {
        color : #B14CFD;
      }
    }


    &__bar {
      background-color: #fff;
      &.-v-1 {
        width: 0.4rem;
        height: 4rem;
      }
      &.-h-1 {
        margin-top: 16rem;
        margin-left: auto;
        width: 0;
        height: 0.4rem;
      }
    }

  }
  
  </style>