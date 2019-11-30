<template>
  <div class="graph-canvas">
    <button @click="addNodes()">Add New</button>
    <pre>{{coordinatesDict}}</pre>
    <pre>{{nodesArray}}</pre>
    <GraphNode
      v-for="n in nodesArray"
      :dragOffSetX.sync="dragOffSetX"
      :dragOffSetY.sync="dragOffSetY"
      :selected="true"
      :coordinates="coordinatesDict[n.id]"
      @update:position="updatePosition($event, n.id)"
      :key="n.id"
    ></GraphNode>
  </div>
</template>

<script>
// import GraphLinker from "./GraphLinker";
import GraphNode from "./GraphNode";
//host of node and linkers
//takes in nodes and updatenodes
//on create
export default {
  components: {
    GraphNode
  },
  props: {
    //node context information (title, input, output)
    nodes: {
      type: Object,
      default() {
        return {};
      }
    },
    coordinates: {
      type: Object,
      default() {
        return {};
      }
    },
    defaultContext: {
      type: Object,
      default() {
        return {
          title: "New Node"
        };
      }
    }
  },
  computed: {
    nodesArray: function() {
      return Object.keys(this.nodesDict).map(key => ({
        id: key,
        ...this.nodesDict[key]
      }));
    },
    linksArray: function() {
      return Object.values(this.coordinatesDict);
    }
  },
  data: () => ({
    nodesDict: {},
    coordinatesDict: {},
    dragOffSetX: 0,
    dragOffSetY: 0
  }),
  //my output
  methods: {
    addNodes(pos) {
      const { x, y } = pos || { x: 10, y: 100 };
      const ids = Object.keys(this.nodesDict).sort();
      const id = ids.length > 0 ? ids.length : 0;
      this.$set(this.nodesDict, id, { ...this.defaultContext });
      this.$set(this.coordinatesDict, id, { x, y });
    },
    deleteNodes() {
      //Test
    },
    updateNodes() {
      //Test
    },
    updatePosition({ x, y }, id) {
      console.log("position updated", x, y, id);
      this.coordinatesDict[id].x += x;
      this.coordinatesDict[id].y += y;
      this.dragOffSetX = 0;
      this.dragOffSetY = 0;
    }
  },
  created() {
    this.nodesDict = this.nodes;
    this.coordinatesDict = this.coordinates;
  }
};
</script>

<style>
.graph-canvas {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  border: 1px solid black;
}
</style>