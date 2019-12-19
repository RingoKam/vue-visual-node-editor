<template>
  <g>
    <path :d="renderPath" :style="lineStyle" />
  </g>
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
        Math.pow(input.x - output.x, 2) + Math.pow(input.y - output.y, 2)
      );
    },
    renderPath() {
      const input = this.input;
      const output = this.output;
      const distance = this.distance;
      if (isNaN(distance)) {
        console.error(
          `unable to compute distance between ${this.input} and ${this.output}`
        );
        return;
      }
      const path = `M ${output.x},${output.y} C ${output.x + this.distance}, ${
        output.y
      }, ${input.x - this.distance}, ${input.y}, ${input.x}, ${input.y}`;
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

</style>