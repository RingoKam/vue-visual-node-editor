<template>
  <div
    class="circle"
    @mouseup.prevent="slotMouseUp($event)"
    @mousedown.prevent="slotMouseDown($event)"
  ></div>
</template>

<script>
//possible state, connected, connecting, notConnected
export default {
  name: "Connector",
  props: {
    isConnecting: {
      type: Boolean,
      default: false
    },
    isActive: {
      type: Boolean,
      default: false
    },
    id: {
      type: String
    },
    index: {
      type: Number
    }
  },
  mounted() {
    const position = this.$el.getBoundingClientRect();
    window.console.log(position);
  },
  methods: {
    slotMouseUp(e) {
      //start tracing the mouse movement...
      if (this.isConnecting) {
        this.$emit("complete-connection", { event:e, id: this.id, slot: this.index });
      }
    },
    slotMouseDown(e) {
      //stop tracing mouse movement and see if mouse is on another Connector
      this.$emit("start-connection", { event:e, id: this.id, slot: this.index });
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