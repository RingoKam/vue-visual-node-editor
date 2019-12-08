<template>
  <div class="circle" @mouseup="slotMouseUp($event)" @mousedown="slotMouseDown($event)"></div>
</template>

<script>
//possible state, connected, connecting, notConnected
//
export default {
  name: "Connector",
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const position = this.$el.getBoundingClientRect();
    window.console.log(position);
  },
  methods: {
    slotMouseUp(e) {
        //start tracing the mouse movement...
        this.$emit("start-connection", e);
    },
    slotMouseDown(e) {
        //stop tracing mouse movement and see if mouse is on another Connector 
        console.log("slot down");
        this.$emit("complete-connection", e);
    }, 
    updateConnectorPosition() {
      
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