<template>
  <div
    class="GraphNode"
    @dblclick="selectId"
    @mousedown.stop.prevent="startDrag($event)"
    @touchstart.stop.prevent="startDrag($event)"
    :style="GraphNodeStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
import { takeUntil, last, delay } from "rxjs/operators";
/**
 * The graph Node
 */
export default {
  props: {
    id: String,
    selected: Boolean,
    isDragging: Boolean,
    coordinates: Object,
    dragOffSetX: Number,
    dragOffSetY: Number,
    panningX: Number,
    panningY: Number,
    dragOffSetY: Number,
    width: Number,
    height: Number
  },
  data() {
    return {
      dragStartX: 0,
      dragStartY: 0
    };
  },
  computed: {
    GraphNodeStyle() {
      const { x, y } = this.coordinates;
      return {
        // cursor: this.selected ? "move" : "pointer",
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
    addConnector() {
      this.$set("", {});
    }
  }
};
</script>

<style>
.GraphNode {
  position: absolute;
  box-sizing: border-box;
}
</style>