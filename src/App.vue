<template>
  <div id="app">
    <Playground />
  </div>
</template>

<script>
import Playground from "./playground"

export default {
  name: 'app',
  components: {
    Playground
  }
}
</script>

<style>
body {
  margin: 0;
  padding: 0;
}

#app {
  height: 100vh;
  width: 100vw;
}
</style>
