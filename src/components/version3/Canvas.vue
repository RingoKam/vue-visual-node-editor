<template>
  <div
    class="graph-canvas"
    @mousemove.self="mouseMoveHandler"
    @mousedown="mouseDown"
    @mouseup="mouseUp"
    @wheel.self.prevent="mouseWheel"
    @keydown="keyDown"
    @keyup="keyUp"
  >
    <button @click="hideDebug = !hideDebug">show</button>
    <div class="debug" v-if="!hideDebug">
      <pre>
        {{ scaling }}
        {{ panning }}
        {{ nodes }}
        {{ connection }}
      </pre>
    </div>
    <div class="graph-canvas-node-container" :style="canvasPositonMeta">
      <Node v-for="node in nodes" :id="node.id" :key="node.id" :node="node"></Node>
    </div>
  </div>
</template>

<script>
import Node from "./Node";

export default {
  components: {
    Node
  },
  props: {
    engine: {
      type: Object
    }
  },
  data() {
    return {
      hideDebug: false
    }
  },
  provide() {
    return {
      engine: this.engine
    };
  },
  subscriptions: function() {
    return {
      nodes: this.engine.getNode$(),
      scaling: this.engine.getScaling$(),
      panning: this.engine.getPanning$(),
      connection: this.engine.getConnection$()
    };
  },
  computed: {
    canvasPositonMeta: function() {
      return {
        "transform-origin": "0 0", //set the point where element will rotate on
        transform: `scale(${this.scaling}) translate(${this.panning.x}px, ${this.panning.y}px)`
      };
    },

  },
  methods: {
    //capture mouse movement when creating connenction...
    mouseMoveHandler(ev) {
      const { movementX, movementY } = ev;
      if (this.temporaryConnection) {
        // this.temporaryConnection.mx = (ev.offsetX / this.plugin.scaling) - this.plugin.panning.x;
        // this.temporaryConnection.my = (ev.offsetY / this.plugin.scaling) - this.plugin.panning.y;
      } else if (this.dragging) {
        this.engine.updatePanning(movementX, movementY);
        // this.plugin.panning.x += ev.movementX / this.plugin.scaling;
        // this.plugin.panning.y += ev.movementY / this.plugin.scaling;
      }
    },
    mouseDown(ev) {
      if (ev.button === 0) {
          if (this.hoveringOver) {
              // if this interface is an input and already has a connection
              // to it, remove the connection and make it temporary
              // const connection = this.connections.find((c) => c.to === this.hoveringOver);
              // if (this.hoveringOver.isInput && connection) {
              //     this.temporaryConnection = {
              //         status: TemporaryConnectionState.NONE,
              //         from: connection.from
              //     };
              //     this.plugin.editor.removeConnection(connection);
              // } else { 
              //     this.temporaryConnection = {
              //         status: TemporaryConnectionState.NONE,
              //         from: this.hoveringOver
              //     };
              // }
              // this.$set(this.temporaryConnection, "mx", null);
              // this.$set(this.temporaryConnection, "my", null);
          } else if (ev.target === this.$el) {
              // this.unselectAllNodes();
              this.dragging = true;
          }
      }
    },
    mouseUp(ev) {
      this.dragging = false;
      // const tc = this.temporaryConnection;
      // if (tc && this.hoveringOver) {
      //     this.plugin.editor.addConnection(tc.from, tc.to!);
      // }
      // this.temporaryConnection = null;
    },
    mouseWheel(ev) {
      // this.engine.updateScaling(ev);
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
  border: 1px solid black;

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

.graph-canvas-node-container {
  width: 100%;
  height: 100%;
  pointer-events: none;

  & * {
    pointer-events: all;
  }
}
</style>