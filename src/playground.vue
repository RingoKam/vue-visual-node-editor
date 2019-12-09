<template>
  <div class>
    <button @click="addNodes()">Add New</button>
    <GraphCanvas :coordinates="coordinates" :nodes="nodes">
      <template v-slot:body="slotProps">
        <h2>{{slotProps.body.title}}</h2>
        <button @click.prevent="log(slotProps)">Click me!</button>
        <input />
      </template>
    </GraphCanvas>
  </div>
</template>
<script>
import GraphCanvas from "./components/GraphCanvas";

export default {
  components: {
    GraphCanvas
  },
  data: () => {
    return {
      nodes: {},
      coordinates: {}
    };
  },
  methods: {
    addNodes() {
      const ids = Object.keys(this.nodes).sort();
      const id = ids.length > 0 ? ids[ids.length - 1] + 1 : 0;
      this.$set(this.nodes, id, { title: "new node", input: [], output: [] });
      this.$set(this.coordinates, id, { x: 10, y: 100 });
    },
    log(props) {
      console.log(props);
    }
  }
};
</script>

<style>
</style>