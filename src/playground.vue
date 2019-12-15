<template>
  <div class="playground">
    <button @click="addNodes()">Add New</button>
    <GraphCanvas :coordinates="coordinates" :nodes="nodes" :edges="edges">
      <template v-slot:body="slotProps">
        <div class="graph-node">
          <h2>{{slotProps.body.title}} -- {{ slotProps.body.id }}</h2>
          <button @click.prevent="log(slotProps)">Log</button>
          <input />
          <div class="input-output-section">
            <button @click.prevent="addInput(id, slotProps.body.connections)">Add Input</button>
            <Button @click.prevent="addOutput(id, slotProps.body.connections)">Add Output</Button>
          </div>
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
      edges: [],
      coordinates: {}
    };
  },
  methods: {
    addNodes() {
      const ids = Object.keys(this.nodes).sort();
      const id = ids.length > 0 ? parseInt(ids[ids.length - 1]) + 1 : 0;
      this.$set(this.nodes, id, { title: "new node", connections: [] });
      this.$set(this.coordinates, id, { x: 10, y: 100 });
    },
    addInput(connections, id) {
      const orders = connections
        .filter(cn => cn.type[])
        .map(cn => cn.order)
        .sort()
        .reverse();
      const lastItem = orders[]
      connections.push({ type: "input" });
    },
    addOutput(connections, id) {
      this.connections.push({ type: "input" });
    },
    log(props) {
      console.log(props);
    }
  }
};
</script>

<style>
.playground {
  height: 100vh;
  width: 100vh;
}

.input-output-section {
  display: flex;
  justify-content: space-between;
}

.graph-node {
  background-color: #0000003b;
}
</style>