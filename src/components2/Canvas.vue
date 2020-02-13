<template>
  <div
    class="graph-canvas"
    @mousemove.self="mouseMoveHandler"
    @mousedown="mouseDown"
    @mouseup="mouseUp"
    @wheel.self="mouseWheel"
    @keydown="keyDown"
    @keyup="keyUp"
  >
    <Node v-for="id in ids" :id="id" :key="id"></Node>
  </div>
</template>

<script>
import Node from "./Node";

export default {
  components: {
    Node
  },
  props: {
    eventBus: {
      type: Object
    }
  },
  provide() {
    return {
      eventBus: this.eventBus
    };
  },
  subscriptions: function() {
    return {
      ids: this.eventBus.nodeIds$,
      scaling: this.eventBus.scaling$,
      panning: this.eventBus.panning$
    };
  },
  methods: {
      //capture mouse movement when creating connenction...
      mouseMoveHandler(ev) {
        if (this.temporaryConnection) {
            // this.temporaryConnection.mx = (ev.offsetX / this.plugin.scaling) - this.plugin.panning.x;
            // this.temporaryConnection.my = (ev.offsetY / this.plugin.scaling) - this.plugin.panning.y;
        } else if (this.dragging) {
            // this.plugin.panning.x += ev.movementX / this.plugin.scaling;
            // this.plugin.panning.y += ev.movementY / this.plugin.scaling;
        }
    },
    mouseDown(ev) {
        // if (ev.button === 0) {
        //     if (this.hoveringOver) {
        //         // if this interface is an input and already has a connection
        //         // to it, remove the connection and make it temporary
        //         const connection = this.connections.find((c) => c.to === this.hoveringOver);
        //         if (this.hoveringOver.isInput && connection) {
        //             this.temporaryConnection = {
        //                 status: TemporaryConnectionState.NONE,
        //                 from: connection.from
        //             };
        //             this.plugin.editor.removeConnection(connection);
        //         } else {
        //             this.temporaryConnection = {
        //                 status: TemporaryConnectionState.NONE,
        //                 from: this.hoveringOver
        //             };
        //         }

        //         this.$set(this.temporaryConnection, "mx", null);
        //         this.$set(this.temporaryConnection, "my", null);

        //     } else if (ev.target === this.$el) {
        //         this.unselectAllNodes();
        //         this.dragging = true;
        //     }
        // }
    },
    mouseUp(ev) {
        // this.dragging = false;
        // const tc = this.temporaryConnection;
        // if (tc && this.hoveringOver) {
        //     this.plugin.editor.addConnection(tc.from, tc.to!);
        // }
        // this.temporaryConnection = null;
    },
    mouseWheel(ev) {
        ev.preventDefault();
        let scrollAmount = ev.deltaY;
        if (ev.deltaMode === 1) {
            scrollAmount *= 32; // Firefox fix, multiplier is trial & error
        }
        const newScale = this.scaling * (1 - scrollAmount / 3000);
        const currentPoint = [
            (ev.offsetX / this.scaling) - this.panning.x,
            (ev.offsetY / this.scaling) - this.panning.y
        ];
        const newPoint = [
            (ev.offsetX / newScale) - this.panning.x,
            (ev.offsetY / newScale) - this.panning.y
        ];
        const diff = [
            newPoint[0] - currentPoint[0],
            newPoint[1] - currentPoint[1]
        ];

        const panningX = this.panning.x + diff[0];
        const panningY = this.panning.y + diff[1];
        this.eventBus.updatePanning(panningX, panningY);
        this.eventBus.updateScaling(newScale);
    },
    keyDown(ev) {
        // if (ev.key === "Delete" && this.selectedNodes.length > 0) {
        //     this.selectedNodes.forEach((n) => this.plugin.editor.removeNode(n));
        // } else if (ev.key === "Tab") {
        //     ev.preventDefault();
        // } else if (ev.key === "Control") {
        //     this.ctrlPressed = true;
        // } else if (ev.key === "z" && ev.ctrlKey) {
        //     this.history.undo();
        // } else if (ev.key === "y" && ev.ctrlKey) {
        //     this.history.redo();
        // }
    },
    keyUp(ev) {
        // if (ev.key === "Control") {
        //     this.ctrlPressed = false;
        // }
    }

  }
};
</script>

<style lang="less">
.graph-canvas {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  outline: none !important;

  & *:not(input) {
    user-select: none;
    -moz-user-select: none;
  }

  & *,
  & *::after,
  & *::before {
    box-sizing: border-box;
  }

  &.--temporary-connection {
    cursor: crosshair;
  }
}
</style>