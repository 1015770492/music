<template>
  <div id="app">
    <Music/>
  </div>
</template>

<script>
import Music from './components/music/Music.vue'
// import Music from "@/components/VueAudio";
export default {
  name: 'App',
  components: {
    Music
  }
}
</script>

<style>
html,body,#app {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
