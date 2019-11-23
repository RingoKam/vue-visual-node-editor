<template>
  <div id="app">
    <GraphCanvas :coordinates="{}" :nodes="{}"></GraphCanvas>
  </div>
</template>

<script>
import GraphCanvas from './components/GraphCanvas'

export default {
  name: 'app',
  components: {
    GraphCanvas
  }
}
</script>

<style>
#app {
  height: 100vh;
  width: 100vh;
}
</style>
