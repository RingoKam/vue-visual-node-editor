<template>
  <div id="app">
    <Playground />
  </div>
</template>

<script>
import Playground from "./components/version3/Playground"

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
