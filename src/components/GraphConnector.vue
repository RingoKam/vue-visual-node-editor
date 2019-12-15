<template>
  <div
    class="circle"
    @mouseup.prevent="slotMouseUp($event)"
    @mousedown.prevent="slotMouseDown($event)"
  ></div>
</template>

<script>
import { fromEvent } from "rxjs";
import { filter } from "rxjs/operators";

//possible state, connected, connecting, notConnected
export default {
  name: "Connector",
  inject: ["engine"],
  props: {
    isDragging: {
      type: Boolean,
      default: false
    },
    isConnecting: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    x: {
      type: Number
    },
    y: {
      type: Number
    },
    index: {
      type: Number
    }
  },
  mounted() {
    //if the mouse is moving around and we are dragging
    const pos = this.getPosition();
    console.log(pos);
  },
  created() {
    this.engine.addOrUpdateConnector(this.id, this.index, () =>
      this.getPosition()
    );
  },
  methods: {
    slotMouseUp(e) {
      //start tracing the mouse movement...
      if (this.isConnecting) {
        this.$emit("complete-connection", {
          event: e,
          id: this.id,
          slot: this.index
        });
      }
    },
    slotMouseDown(e) {
      //stop tracing mouse movement and see if mouse is on another Connector
      this.$emit("start-connection", {
        event: e,
        id: this.id,
        slot: this.index
      });
    },
    /* report the current position of the node */
    getPosition() {
      const { x, y, top, left, width } = this.$el.getBoundingClientRect();
      const center = width / 2;
      return { x: left + center , y: top - width };
      // this.$emit("update:x", x);
      // this.$emit("update:y", y);
    }
  }
};
</script>

<style>
.circle {
  box-sizing: border-box;
  margin-top: 5 / 2 - 5 / 2;
  background: red;
  width: 15px;
  height: 15px;
  border: 1px solid rgba(0, 0, 0, 0.5);
  border-radius: 100%;
  cursor: crosshair;
}
</style>