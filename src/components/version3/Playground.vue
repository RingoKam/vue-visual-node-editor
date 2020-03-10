<template>
  <div class="playground">
    <div>
      <button @click="addNewNode()">Click</button>
    </div>
    <Canvas v-if="engine" :engine="engine"></Canvas>
  </div>
</template>

<script>
import Canvas from "./Canvas";
import { Engine } from "../../engine/engine"

export default {
  components: {
    Canvas
  },
  data() {
    return {
      engine: new Engine()
    };
  },
  methods: {
    addNewNode(node) {
      if(!node) node = { 1: { pos: { x: 0, y: 0} } };
      this.engine.addNode(node);
    }
  }
};
</script>

<style>
.playground {
  height: 80vh;
  width: 80vw;
}
</style>