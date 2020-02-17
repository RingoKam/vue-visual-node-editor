<template>
  <div class="graph-node" :style="GraphNodeStyle">
    <div class="graph-node-title" @mousedown.prevent.stop="startDrag($event)">
      <span>{{ title }}</span>
    </div>
    <div class="graph-node-content">
      <div class="graph-node-interface graph-node-interface-input">
        <label>Input</label>
        <NodeInterface :id="id" />
      </div>
      <div class="graph-node-interface graph-node-interface-output">
        <label>Output</label>
        <NodeInterface :id="id" />
      </div>
    </div>
  </div>
</template>

<script>
import NodeInterface from "./NodeInterface";

export default {
  components: {
    NodeInterface
  },
  data() {
    return {
      title: "test",
      dragging: true
    };
  },
  inject: ["eventBus"],
  subscriptions: function() {
    return {
      node: this.eventBus.getNode(this.id)
    };
  },
  computed: {
    GraphNodeStyle() {
      const { x, y } = this.node;
      return {
        top: `${y}px`,
        left: `${x}px`
      };
    }
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  methods: {
    startDrag() {
      console.log("triggered drag");
      this.dragging = true;
      document.addEventListener("mousemove", this.handleMove);
      document.addEventListener("mouseup", this.stopDrag);
      this.select();
    },
    select() {
      this.$emit("select", this);
    },
    stopDrag() {
      this.dragging = false;
      document.removeEventListener("mousemove", this.handleMove);
      document.removeEventListener("mouseup", this.stopDrag);
    },
    handleMove(ev) {
      console.log(ev);
      if (this.dragging) {
        const x = ev.movementX;
        const y = ev.movementY;
        this.eventBus.updateNodePos(this.id, { x, y });
        // this.data.position.x += ev.movementX / this.plugin.scaling;
        // this.data.position.y += ev.movementY / this.plugin.scaling;
      }
    },
    openContextMenu(ev) {
      // this.contextMenu.show = true;
      // this.contextMenu.x = ev.offsetX;
      // this.contextMenu.y = ev.offsetY;
    }
  }
};
</script>

<style lang="less">
.graph-node {
  max-width: 20rem;
  position: absolute;
  background: black;
  color: white;
  border-radius: 4px;
  box-sizing: border-box;
  overflow: hidden;
}

.graph-node-title {
  padding: 0.4em 0.75em;

  > span {
    pointer-events: none;
  }
}

.graph-node-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto;
  grid-template-areas: ". ." ". .";
}

.graph-node-interface {
  padding: 0.5rem;
}

.graph-node-interface-input {
  grid-row: 1;
  grid-column: 1;
}

.graph-node-interface-output {
  grid-row: 1;
  grid-column: 2;
}
</style>