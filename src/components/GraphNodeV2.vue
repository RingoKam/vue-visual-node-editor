<template>
  <div
    class="GraphNode"
    @mousedown.stop.prevent="startDrag"
    @dblclick="selectId"
    :style="GraphNodeStyle"
  >
    <div>Node V2</div>
    <div>Description</div>
    <div class="input-output">
      <div>
        <GraphConnector v-for="input in inputs" :id="input.id" :key="id + '_' + input.id" />
      </div>
      <div>
        <GraphConnector v-for="output in outputs" :id="output.id" :key="id + '_' + output.id" />
      </div>
    </div>
  </div>
</template>

<script>
import GraphConnector from "./GraphConnector";

export default {
  props: {
    id: String,
    selected: Boolean,
    connections: Object,
    x: Number,
    y: Number,
    dragOffSetX: Number,
    dragOffSetY: Number,
    panningX: Number,
    panningY: Number
  },
  provide() {
    return { nodeId: this.id };
  },
  components: {
    GraphConnector
  },
  computed: {
    connectionsAsArray() {
      return Object.entries(this.connections).map(([id, connection]) => ({
        id,
        connection
      }));
    },
    inputs() {
      const inputs = this.connectionsAsArray.filter(
        ({ id, connection }) => connection.type === "input"
      );
      return inputs;
    },
    outputs() {
      const outputs = this.connectionsAsArray.filter(
        ({ id, connection }) => connection.type === "output"
      );
      return outputs;
    },
    GraphNodeStyle() {
      return {
        cursor: this.selected ? "move" : "pointer",
        color: this.selected ? "red" : "black",
        top: `${this.y || 0}px`,
        left: `${this.x || 0}px`,
        transform: this.selected
          ? `translate(${this.dragOffSetX + this.panningX}px, ${this
              .dragOffSetY + this.panningY}px)`
          : `translate(${this.panningX}px, ${this.panningY}px`
      };
    }
  },
  methods: {
    startDrag(event) {
      if (!this.selected) {
        return;
      }
      this.$emit("move-node", event);
    },
    selectId() {
      this.$emit("select-id", { id: this.id, isMultiSelect: false });
    },
    addConnection(context) {
      this.$emit("add-connection", { id, context });
    }
  }
};
</script>

<style>
.input-output {
  display: flex;
  justify-content: space-between;
}
.GraphNode {
  background: white;
  border: 1px solid #000000;
  border-radius: 1px;
  position: absolute;
  box-sizing: border-box;
}
</style>