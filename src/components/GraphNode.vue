<template>
  <div
    class="GraphNode"
    @mousedown.stop="startDrag($event)"
    @touchstart.stop="startDrag($event)"
    :style="GraphNodeStyle"
  >TEST</div>
</template>

<script>
/**
 * The gra
 */
export default {
  props: {
    id: String,
    selected: Boolean,
    coordinates: Object,
    dragOffSetX: Number,
    dragOffSetY: Number,
    width: Number,
    height: Number
  },
  data() {
    return {
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0
    };
  },
  mounted() {
    // document.documentElement.addEventListener(
    //   "mousemove",
    //   this.followDrag,
    //   true
    // );
    // document.documentElement.addEventListener(
    //   "mousedown",
    //   this.startDrag,
    //   true
    // );
    // document.documentElement.addEventListener("mouseup", this.stopDrag, true);
  },
  destroyed() {
    // document.documentElement.removeEventListener(
    //   "mousemove",
    //   this.followDrag,
    //   true
    // );
    // document.documentElement.removeEventListener("mousedown", this.startDrag, true);
  },
  computed: {
    GraphNodeStyle() {
      const { x, y } = this.coordinates;
      console.log(this.dragOffSetY, this.dragOffSetX);
      return {
        top: `${y}px`,
        left: `${x}px`,
        transform: this.selected
          ? `translate(${this.dragOffSetX}px, ${this.dragOffSetY}px)`
          : null
      };
    }
  },
  methods: {
    startDrag(event) {
      const isMouse = event.type === "mousedown";
      const { clientX, clientY } = isMouse ? event : event.touches[0];
      this.dragStartX = clientX + window.pageXOffset;
      this.dragStartY = clientY + window.pageYOffset;
      this.isDragging = true;

      if (isMouse) {
        this.addEventListener("mousemove", this.followDrag);
        this.addEventListener("mouseup", this.stopDrag);
      } else {
        this.addEventListener("touchmove", this.followDrag);
        this.addEventListener("touchend", this.stopDrag);
      }
    },
    followDrag(event) {
      const isMouse = event.type === "mousemove";
      event.preventDefault();
      if (this.isDragging) {
        const { clientX, clientY } = isMouse ? event : event.touches[0];
        window.console.log("drag", event);
        const x = clientX + window.pageXOffset - this.dragStartX;
        const y = clientY + window.pageYOffset - this.dragStartY;
        this.$emit("update:dragOffSetX", x);
        this.$emit("update:dragOffSetY", y);
      }
    },
    stopDrag(event) {
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
      this.isDragging = false;

      if (isMouse) {
        this.removeEventListener("mousemove", this.followDrag);
        this.removeEventListener("mouseup", this.stopDrag);
      } else {
        this.removeEventListener("touchmove", this.followDrag);
        this.removeEventListener("touchend", this.stopDrag);
      }
    },
    addEventListener(event, callback, option = true) {
      window.document.documentElement.addEventListener(event, callback, option);
    },
    removeEventListener(event, callback, option = true) {
      window.document.documentElement.removeEventListener(event, callback, option);
    }
  }
};
</script>

<style>
.GraphNode {
  position: absolute;
  box-sizing: border-box;
  cursor: move;
}
</style>