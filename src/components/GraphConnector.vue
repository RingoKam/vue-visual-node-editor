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
import { connectorEventName } from "../eventbus";

//possible state, connected, connecting, notConnected
export default {
  name: "Connector",
  inject: ["eventBus", "nodeId", "canvasState"],
  props: {
    id: [Number, String]
  },
  mounted() {
    //if the mouse is moving around and we are dragging
    const pos = this.getPosition();
        
    this.eventBus.connector.emit({
      id: this.id,
      nodeId: this.nodeId,
      event: connectorEventName.UPDATE_POSITION,
      position: pos,
      positionQuery: () => this.getPosition()
    });
  },
  methods: {
    slotMouseUp(e) {
      //start tracing the mouse movement...
      if (this.canvasState.isConnecting) {
        this.eventBus.connector.emit({
          nodeId: this.nodeId,
          event: connectorEventName.COMPLETE_CONNECTION,
          id: this.id
        });
      }
    },
    slotMouseDown(e) {
      //stop tracing mouse movement and see if mouse is on another Connector
      this.eventBus.connector.emit({
        nodeId: this.nodeId,
        event: connectorEventName.START_CONNECTION,
        id: this.id
      });
    },
    /* report the current position of the node */
    getPosition() {
      const { x, y, top, left, width } = this.$el.getBoundingClientRect();
      const center = width / 2;
      return { x: left + center, y: top - width };
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