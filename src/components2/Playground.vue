<template>
  <div class="playground">
    <Canvas v-if="eventBus" :eventBus="eventBus"></Canvas>
  </div>
</template>

<script>
import Canvas from "./Canvas";
import CreateEventBus from "../engine/EventBus";

export default {
  components: {
    Canvas
  },
  data() {
    return {
      eventBus: CreateEventBus({ 1: {x: 111, y:211} })
    };
  }
};
</script>

<style>
    .playground {
        height: 100vh;
        width: 100vw;
    }
</style>