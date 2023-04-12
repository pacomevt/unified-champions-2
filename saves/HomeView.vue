<template>
<div class="l-landing-page">
  <main>
    <span class="u-title">WE ARE</span>
    <div class="u-three" id="united-champion-canvas">
        <h1 class="u-three-title" id="united-three">UNITEED</h1>
        <h1 class="u-three-title" id="champion-three">CHAMPION</h1>
    </div>
  </main>
</div>
</template>

<script>
import { CustomText } from '@/assets/script/classes/three-text.js';
import UnitedURL from '@/assets/textures/texts/UNITEED.png'
import ChampionURL from '@/assets/textures/texts/CHAMPION.png'

export default {
  name: 'HomeView',
  mounted() {
    const renderUnited = new CustomText(document.querySelector('#united-three'), UnitedURL);
    const renderChampion = new CustomText(document.querySelector('#champion-three'), ChampionURL);
  }
}
</script>

<style lang="scss">
.l-landing-page {
  width: 100%;
  min-height: 100vh;
  background-color: black;
}

.u-three-title {
  font-family: 'StretchPro';
  font-size: 20rem;
  height: fit-content;
  color: white;
  display: block;
  position: relative;
  margin-top: 40px;
  color: black;  
  & > canvas {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
  }
}

.u-title {
  font-size: 6.6rem;
  // #300456 to rgb
  color: white;
  
}

</style>