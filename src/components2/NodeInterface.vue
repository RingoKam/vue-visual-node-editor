<template>
  <div :id="id" :class="classes">
    <div class="node-interface-port" @mouseover="startHover" @mouseout="endHover"></div>
    <span>Test</span>
    <!-- <span
      v-if="data.connectionCount > 0 || !data.option || !getOptionComponent(data.option)"
      class="align-middle"
    >{{ displayName }}</span> -->
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  computed: {
    classes() {
      return "";
    }
  },
  methods: {
    //i need to know the start hover and hover position of the
    startHover() {
      // this.editor.hoveredOver(this.data);
    },
    endHover() {
      // this.editor.hoveredOver(undefined);
    }
  }
};
</script>

<style>
.node-interface-port {
  /* position: absolute; */
  width: 10px;
  height: 10px;
  background: red;
  border-radius: 50%;
  top: calc(50% - 5px);
  cursor: crosshair;
}
</style>