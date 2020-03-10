<template>
  <div :id="index" class="node-interface">
    <div class="node-interface-port"
      @click.self.prevent 
      @mouseover="startHover" 
      @mouseout="endHover">
    </div>
  </div>
</template>

<script>
export default {
  props: {
    index: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {};
  },
  methods: {
    //i need to know the start hover and hover position of the
    startHover() {
      this.$emit("startHover", this.index);
    },
    endHover() {
      this.$emit("endHover", this.index);
    }
  }
};
</script>
<style lang="less">
.node-interface-port {
  position: absolute;
  width: 10px;
  height: 10px;
  background: white;
  border-radius: 50%;
  top: calc(50% - 5px);
  cursor: crosshair;
}
</style>
