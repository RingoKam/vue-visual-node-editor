<template>
  <div
    class="GraphNode"
    @dblclick="$emit('select-id', id)"
    @mousedown.stop="startDrag($event)"
    @touchstart.stop="startDrag($event)"
    :style="GraphNodeStyle"
  >
    <slot></slot>
  </div>
</template>

<script>
import { fromEvent } from "rxjs";
import { takeUntil, last } from "rxjs/operators";
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
        cursor: this.selected ? "move" : "pointer",
        color: this.selected ? "red" : "black",
        top: `${y}px`,
        left: `${x}px`,
        transform: this.selected
          ? `translate(${this.dragOffSetX}px, ${this.dragOffSetY}px)`
          : null
      };
    }
  },
  mounted() {},
  methods: {
    startDrag(event) {
      if (!this.selected) {
        return;
      }
      const isMouse = event.type === "mousedown";
      const { clientX, clientY } = isMouse ? event : event.touches[0];
      this.dragStartX = clientX + window.pageXOffset;
      this.dragStartY = clientY + window.pageYOffset;
      //toggle dragging status
      this.$emit("update:isDragging", true);
      //start listening to mouse/finger movement
      const movement$ = fromEvent(
        document,
        isMouse ? "mousemove" : "touchmove"
      );
      const endMovement$ = fromEvent(
        document,
        isMouse ? "mouseup" : "touchend"
      );
      const draggingSequence$ = movement$.pipe(takeUntil(endMovement$));
      draggingSequence$.subscribe(e => {
        this.followDrag(e);
      });
      draggingSequence$.pipe(last()).subscribe(e => {
        this.stopDrag(e);
      });
    },
    followDrag(event) {
      const isMouse = event.type === "mousemove";
      event.preventDefault();
      if (this.isDragging) {
        const { clientX, clientY } = isMouse ? event : event.touches[0];
        const x = clientX + window.pageXOffset - this.dragStartX;
        const y = clientY + window.pageYOffset - this.dragStartY;
        this.$emit("update:dragOffSetX", x);
        this.$emit("update:dragOffSetY", y);
      }
    },
    stopDrag(event) {
      //only update the node position if the node is selected and dragging around is true.
      if (!this.selected || !this.isDragging) {
        return;
      }
      const isMouse = event.type === "mouseup";
      window.console.log("stop drag", event);
      const { type, clientX, clientY } = event;
      const { x, y } = isMouse
        ? {
            x: clientX + window.pageXOffset - this.dragStartX,
            y: clientY + window.pageYOffset - this.dragStartY
          }
        : {
            x: this.dragOffSetX,
            y: this.dragOffSetY
          };
      this.$emit("update:position", { x, y });
      this.$emit("update:isDragging", false);
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