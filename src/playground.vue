<template>
  <div class="playground">
    <button @click="addNodes()">Add New</button>
    <GraphCanvas
      :eventBus="eventBus"
      :coordinates="coordinates"
      :nodes="nodes"
      :edges="edges"
      @add-new-edge="addNew"
    ></GraphCanvas>
  </div>
</template>

<script>
import GraphCanvas from "./components/GraphCanvas";
import GraphNodeV2 from "./components/GraphNodeV2";
import GraphConnector from "./components/GraphConnector";
import { createEventBus } from "./eventbus.js";

export default {
  components: {
    GraphCanvas,
    GraphConnector
  },
  data: () => {
    return {
      eventBus: null,
      nodes: {},
      edges: [],
      coordinates: {}
    };
  },
  created() {
    this.eventBus = createEventBus();
  },
  methods: {
    addNodes() {
      const ids = Object.keys(this.nodes).sort();
      const id = ids.length > 0 ? parseInt(ids[ids.length - 1]) + 1 : 0;
      this.$set(this.nodes, id, {
        title: "new node",
        componentType: "GraphNodeV2",
        connections: {
          input: { type: "input", order: 1 },
          output: { type: "output", order: 1 }
        }
      });
      this.$set(this.coordinates, id, { x: 10, y: 100 });
    },
    addNew(newEdge) {
      this.edges.push(newEdge);
    },
    addInput(connections, id) {
      const orders = connections
        .filter(cn => cn.type === "input")
        .map(cn => cn.order)
        .sort()
        .reverse();
      const lastItem = orders[0];
    },
    addOutput(connections, id) {
      const orders = connections
        .filter(cn => cn.type === "output")
        .map(cn => cn.order)
        .sort()
        .reverse();
      const lastItem = orders[0];
      this.connections.push({ type: "output", order: lastItem });
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
  width: 100vw;
}

.input-output-section {
  display: flex;
  justify-content: space-between;
}

.graph-node {
  background-color: #0000003b;
}
</style>