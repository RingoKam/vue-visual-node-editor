<template>
  <div id="app">
    <Playground2 />
    <!-- <Playground /> -->
  </div>
</template>

<script>
import Playground2 from "./components2/Playground";
import Playground from "./playground";

export default {
  name: 'app',
  components: {
    Playground2,
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
