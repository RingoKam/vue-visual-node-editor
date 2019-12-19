<template>
  <div class="playground">
    <div class="toolbar">
      <button @click="addNodes()">Add New</button>
      <v-select v-model="componentType" :options="['GraphNodeV2', 'GraphNodeV3']"></v-select>
    </div>
    <GraphCanvas
      :eventBus="eventBus"
      :coordinates="coordinates"
      :nodes="nodes"
      :edges="edges"
      :canvasConfig="canvasConfig"
      @add-new-edge="addNew"
    ></GraphCanvas>
  </div>
</template>

<script>
import GraphCanvas from "./components/GraphCanvas";
import { createEventBus } from "./eventbus.js";
import { fromEvent } from "rxjs";

export default {
  components: {
    GraphCanvas
  },
  data: () => {
    return {
      eventBus: null,
      nodes: {},
      edges: [],
      coordinates: {},
      componentType: "GraphNodeV2",
      canvasConfig: {
        gridSize: [100, 50, 25],
        gridColor: [
          "rgba(0, 0, 0, 0.2)",
          "rgba(0, 0, 0, 0.1)",
          "rgba(0, 0, 0, 0.5)"
        ]
      }
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
        componentType: this.componentType,
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

.toolbar {
  display: flex;
}

.input-output-section {
  display: flex;
  justify-content: space-between;
}

.graph-node {
  background-color: #0000003b;
}
</style>