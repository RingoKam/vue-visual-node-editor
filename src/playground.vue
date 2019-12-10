<template>
  <div class>
    <button @click="addNodes()">Add New</button>
    <GraphCanvas :coordinates="coordinates" :nodes="nodes">
      <template v-slot:body="slotProps">
        <h2>{{slotProps.body.title}} -- {{ slotProps.body.id }}</h2>
        <button @click.prevent="log(slotProps)">Log</button>
        <input />
        <div class="input-output-section">
          <button @click.prevent="addInput(slotProps.body.input)">Add Input</button>
          <Button @click.prevent="addOutput(slotProps.body.output)">Add Output</Button>
        </div>
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
      const id = ids.length > 0 ? parseInt(ids[ids.length - 1]) + 1 : 0;
      this.$set(this.nodes, id, { title: "new node", input: [], output: [] });
      this.$set(this.coordinates, id, { x: 10, y: 100 });
    },
    addInput(input) {
      input.push({});
    },
    addOutput(output) {
      output.push({});
    },
    log(props) {
      console.log(props);
    }
  }
};
</script>

<style>
  .input-output-section {
    display: flex;
    justify-content: space-between;
  }
</style>