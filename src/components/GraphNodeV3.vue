<template>
  <div
    class="GraphNode"
    @click="selectId"
    :style="GraphNodeStyle"
  >
    <div class="input-output">
      <div>
        <GraphConnector v-for="input in inputs" :id="input.id" :key="id + '_' + input.id" />
      </div>
      <div>
        <div>Node v3</div>
      </div>
      <div>
        <GraphConnector v-for="output in outputs" :id="output.id" :key="id + '_' + output.id" />
      </div>
    </div>
  </div>
</template>

<script>
import GraphConnector from "./GraphConnector";
import GraphNode from "./GraphNodeV2"

export default {
  extends: GraphNode,
  methods: {
      /* your own implementation here...*/
  }
};
</script>

<style>
.input-output {
  display: flex;
  justify-content: space-between;
}
.GraphNode {
  position: absolute;
  box-sizing: border-box;
}
</style>