<template>
  <svg class="graph-edge">
    <g>
      <path :d="renderPath" :style="lineStyle" />
    </g>
  </svg>
</template>

<script>
// takes an input and destination, and draw an svg base on that
// allow customization on svg drawn algorthim
export default {
  props: {
    input: {
      type: Object
      //coordinates of x,y, where line begins
    },
    output: {
      type: Object
      //coordinates of x,y, where line ends
    }
  },
  computed: {
    distance() {
      const input = this.input;
      const output = this.output;
      return Math.sqrt(
        Math.pow(output.x - input.x, 2) + Math.pow(output.y - input.y, 2)
      );
    },
    renderPath() {
      const input = this.input;
      const output = this.output;
      const distance = this.distance;
    
      if (isNaN(distance)) {
        return;
      }

      const path = `M ${input.x},${input.y} C ${input.x + this.distance}, ${
        input.y
      }, ${output.x - this.distance}, ${output.y}, ${output.x}, ${output.y}`;
      window.console.info(path);
      return path;
    },
    lineStyle() {
      return {
        stroke: "black",
        strokeWidth: "1px",
        fill: "none"
      };
    }
  }
};
</script>

<style>
.graph-edge {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none !important;
}
</style>