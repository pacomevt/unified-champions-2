<template>
  <header class="c-header">
    <div class="c-header__bar">
      <div class="c-header__container -is-left">
        <div class="c-header__logo">
          <img class="c-header__logo__image" src="../assets/logo/white-logo.png" alt="logo">
        </div>
        <div class="c-header__blur"></div>
      </div>  
      <div class="c-header__container -is-right">
        <nav class="c-header__nav">
          <ul class="c-header__ul">
            <li class="c-header__li"><a class="c-header__link" href="#">Merch</a></li>
            <li class="c-header__li"><a class="c-header__link" href="#">About</a></li>
            <li class="c-header__li"><a class="c-header__link" href="#">Contact</a></li>
            <nav class="c-header__socials">
                <ul class="c-header__socials__ul">
                  <li class="c-header__socials__li"><a class="c-header__socials__link" href="#"><Discord/></a></li>
                  <li class="c-header__socials__li"><a class="c-header__socials__link" href="#"><Twitter/></a></li>
                  <li class="c-header__socials__li"><a class="c-header__socials__link" href="#"><Twitch/></a></li>
                </ul>
            </nav>
          </ul>
        </nav>
      </div>
    </div>
    <div class="c-header__scrolling-bar">
      <span class="c-header__scrolling-bar__title">Progression : &nbsp;<span class="c-header__scrolling-bar__percent">0</span>%</span>
      <div class="c-header__scrolling-bar__progress"></div>
    </div>
    
  </header>
</template>

<script>
import  Twitter from '@/components/icons/Twitter.vue';
import  Discord from '@/components/icons/Discord.vue';
import  Twitch from '@/components/icons/Twitch.vue';


import { ScrollProgression } from '@/assets/script/classes/ScrollProgression';
import gsap from 'gsap';

export default {

  name: 'Header',
  components: {
    Twitter,
    Discord,
    Twitch
  },
  methods : {
    start() {
      const header = document.querySelector('.c-header');
      header.style.opacity = 1;
      //animation
      const tl = new gsap.timeline({paused:true});
      tl.from('.c-header__bar', {duration: 1, y: -100, opacity: 0, ease: 'power4.out'}, 0);
      tl.from('.c-header__scrolling-bar', {duration: 1, y: -100, opacity: 0, ease: 'power4.out'}, 0);
      tl.from('.c-header__bar', {duration: 2, width: 80, ease: 'power4.out'}, 1);
      tl.from('.c-header__scrolling-bar', {duration: 2, width: 80, ease: 'power4.out'}, 1.3);
      tl.from('.c-header__container.-is-right', {duration: 3, opacity: 0, ease: 'power4.out'}, 2);
      tl.from('.c-header__scrolling-bar__title', {duration: 3, opacity: 0, ease: 'power4.out'}, 2.1  );
      header.querySelectorAll('.c-header__li').forEach((li, index) => {
        tl.from(li, {duration: 1, opacity: 0, ease: 'power4.out'}, (index * 0.2) + 2  );
      })
      tl.play();

      // progressbar 
      const scrollProgression = new ScrollProgression(
        document.querySelector('.c-header__scrolling-bar__progress'),
        document.querySelector('.c-header__scrolling-bar__percent')
        );
      }
  },
}
</script>

<style lang="scss">

// $blur-white: rgba(211, 172, 255, 0.1);
$blur-white: rgba(255, 255, 255, 0.1);
// $blur-purple : rgba(5, 5, 5, 0.5);
$blur-purple: rgba(255, 255, 255, 0.1);
$white: #fff;

$header-height: 60px;


.c-header {

  opacity: 0;

  position: fixed;
  z-index: 5;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  &__bar {
    margin: 20px 2.5% 0 2.5%;
    border: 1px solid $blur-white;
    display: flex;
    width: 95%;
    height: $header-height;
    overflow: hidden;
  }
  &__container {
    flex: 1;
    width: 100%;
    display: flex;
  }
  &__nav {
    width: 100%;
    height: 100%;
    border-left: 1px solid $blur-white;
  }
  &__blur {
    width: 100%;
    height: 100%;
    backdrop-filter: blur(10px);
    background-color: rgb(5, 5, 5, 0.1);
    border: 1px solid $blur-white;
  }
  &__logo {
    height: 100%;
    aspect-ratio: 1;
    border: 1px solid $blur-white;
    background-color: $blur-white;
    backdrop-filter: blur(10px);
    transition: background-color 0.3s ease-in-out, aspect-ratio 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background-color: $blur-purple;
      aspect-ratio: 1.2;
    }
    &__image {
      height: 60%;
      width: auto;
      
    }
  }

  &__socials {
    margin: 0 auto;
    width: 95%;
    height: 40px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    & a {
      color: $white;
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0 10px;
    }
  }



  &__ul {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    height: 100%;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__li {
    height: 100%;
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    color: $white;
    border: 1px solid $blur-white;
    background-color: $blur-white;
    backdrop-filter: blur(10px);

    transition: background-color 0.3s ease-in-out, flex 0.3s ease-in-out;

    &:hover {
      background-color: $blur-purple;
      flex: 1.2;
    }
  }

  &__link {
    color: $white;
    text-decoration: none;
    font-size: 1.2rem;
    font-weight: 600;
    letter-spacing: 0.2rem;
    text-transform: uppercase;
  }

  &__socials {
    height: 100%;
    flex: 1.5;
    justify-content: center;
    display: flex;
    border: 1px solid $blur-white;
    backdrop-filter: blur(10px);

    &__ul {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      width: 80%;
      align-items: center;
      height: 100%;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    &__li {
      height: 100%;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      color: $white;
      backdrop-filter: blur(10px);
    }

    &__link {
      height: 100%;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;

      & svg {
        height: 2rem;
        width: auto;
      }
    }
  }

  &__scrolling-bar {
    margin: 10px 2.5% 0 2.5%;
    position: relative;
    border: 1px solid $blur-white;
    display: flex;
    width: 95%;
    height: $header-height / 3;
    overflow: hidden;

    &__title {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $white;
      font-size: 0.8rem;
      margin-left: 1rem;
    }

    &__progress {
      height: 100%;
      width: 0%;
      background-color: $blur-white;
      backdrop-filter: blur(10px);
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
    }
  }
}

</style>