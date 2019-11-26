<template>
  <div class="GraphNode" 
  @mousedown.stop="startDrag($event)"
  @mouseup.stop="stopDrag($event)"
  :style="GraphNodeStyle">TEST</div>
</template>

<script>
/**
 * The gra
 */
export default {
  props: {
    id: String,
    position: Object,
    width: Number,
    height: Number
  },
  data() {
    return {
      isDragging: false
    };
  },
  mounted() {
    document.documentElement.addEventListener(
      "mousemove",
      this.followDrag,
      true
    );
    // document.documentElement.addEventListener(
    //   "mousedown",
    //   this.startDrag,
    //   true
    // );
    // document.documentElement.addEventListener("mouseup", this.stopDrag, true);
  },
  destroyed() {
    document.documentElement.removeEventListener("mousemove", this.followDrag, true);
    // document.documentElement.removeEventListener("mousedown", this.startDrag, true);
   },
  computed: {
    GraphNodeStyle() {
      const { x, y } = this.position || { x: 10, y: 100 };
      return {
        top: `${y}px`,
        left: `${x}px`
      };
    }
  },
  methods: {
    startDrag(event) {
      //Get the exact point our DOM will get trigger
      //   const { clientX, clientY } =
      //     event.type === "mousedown" ? event : event.touches[0];
      //   window.console.log(clientY, clientX);
      // this.$on(window, "mousemove", this.followDrag, { passive: false });
      // this.$on(window, "mouseup", this.stopDrag);
      this.isDragging = true;
      //   this.followDrag(event);
    },
    followDrag(event) {
      event.preventDefault();
      if (this.isDragging) {
        const { clientX, clientY } = event;
        window.console.log("drag", event);
        this.$emit("updatePosition", { x: clientX, y: clientY });
      }
    },
    stopDrag(event) {
      window.console.log("stop drag", event);
      this.isDragging = false;
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