<template>
  <svg>
    <g>
      <path :d="renderPath" style="lineStyle" />
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
        Math.sqrt(output.x - input.x) + Math.sqrt(output.y - input.y)
      );
    },
    renderPath() {
      const input = this.input;
      const output = this.output;
      const path = `M ${input.x},${input.y} C ${input.x + this.distance}, ${
        input.y
      }, ${output.x - this.distance}, ${output.y}, ${output.x}, ${output.y}`;
      window.console.log(path);
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
</style>