<template>
  <div>
    <h3>{{title}}</h3>
    <div>{{description}}</div>
    <div class="input-output">
      <div>
        <GraphConnector v-for="(input, i) in inputs" :key="'i' + i"/>
      </div>
      <div>
        <GraphConnector v-for="(output, i) in outputs" :key="'e' + i"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    id: String,
    selected: Boolean,
    isDragging: Boolean,
    x: Number,
    y: Number,
    dragOffSetX: Number,
    dragOffSetY: Number,
    panningX: Number,
    panningY: Number,
    dragOffSetY: Number
  },
  computed: {
    inputs() {
      const inputs = Object.entries(this.connections).filter(
        (id, connection) => connection.type === "input"
      );
      return inputs;
    },
    outputs() {
      const outputs = Object.entries(this.connections).filter(
        (id, connection) => connection.type === "output"
      );
      return outputs;
    },
    GraphNodeStyle() {
      const { x, y } = this.coordinates;
      return {
        cursor: this.selected ? "move" : "pointer",
        color: this.selected ? "red" : "black",
        top: `${y}px`,
        left: `${x}px`,
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
</style>