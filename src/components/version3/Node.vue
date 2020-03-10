<template>
  <div class="graph-node" :style="GraphNodeStyle" @mousedown.prevent.stop="startDrag($event)">
    <div class="graph-node-title">
      <span>{{ title }}</span>
    </div>

    <!--Ability to add input/output-->
    <div class="graph-node-inputoutput-container">
      <div class="graph-node-input">
        <NodeInterface :index="'1'" :type="'input'"></NodeInterface>
      </div>
      <div class="graph-node-output">
        <NodeInterface :index="'1'" :type="'output'"></NodeInterface>
      </div>
    </div>
  </div>
</template>

<script>
import NodeInterface from "./NodeInterface";

export default {
  data() {
    return {
      title: "test",
      dragging: true
    };
  },
  components: {
    NodeInterface
  },
  inject: ["engine"],
  // subscriptions: function() {
  //     return {
  //         pos: this.eventBus.getNodePos(this.id),
  //     }
  // },
  computed: {
    GraphNodeStyle() {
      const { x, y } = this.node.pos;
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
    },
    node: {
      type: Object,
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
      // if (this.dragging) {
      const x = ev.movementX;
      const y = ev.movementY;
      this.engine.updateNodePos(this.id, { x, y });
      // this.data.position.x += ev.movementX / this.plugin.scaling;
      // this.data.position.y += ev.movementY / this.plugin.scaling;
      // }
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

.graph-node-inputoutput-container {
  display: flex;
  height: auto;
}

.graph-node {
  max-width: 20rem;
  min-width: 10rem;
  position: absolute;
  background: black;
  color: white;
  border-radius: 4px;
}

.graph-node-title {
  pointer-events: none;
}
</style>