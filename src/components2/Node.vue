<template>
  <div class="graph-node" :style="GraphNodeStyle" @mousedown.prevent.stop="startDrag($event)">
    <div class="graph-node-title" >
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
        title: "test",
        dragging: true
    };
  },
  inject: ["eventBus"],
  subscriptions: function() {
      return {
          pos: this.eventBus.getNodePos(this.id)
      }
  },
  computed: {
      GraphNodeStyle() {
          const { x, y } = this.pos;
          return {
              top: `${y}px`,
              left: `${x}px`
          }
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
    console.log("triggered drag")
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