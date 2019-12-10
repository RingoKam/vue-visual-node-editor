<template>
  <div class="graph-canvas" :style="gridBackgroundStyle">
    <pre>{{coordinatesDict}}</pre>
    <pre>{{temporaryConnection}}</pre>
    <pre>{{nodesArray}}</pre>
    <pre>{{mousePos}}</pre>
    <pre>{{isConnecting}}</pre>
    <GraphNode
      v-for="n in nodesArray"
      :dragOffSetX.sync="dragOffSetX"
      :dragOffSetY.sync="dragOffSetY"
      :isDragging.sync="isDragging"
      :selected="n.selected"
      :context="n.context"
      :coordinates="coordinatesDict[n.id]"
      :id="n.id"
      :key="n.id"
      @select-id="selectId($event)"
      @update:position="updatePosition($event, n.id)"
    >
      <!-- graph connector connect GraphNode together -->
      <slot name="body" v-bind:body="({ ...n, coordinates:coordinatesDict[n.id]})"></slot>
      <div class="input-output-container">
        <div>
          <GraphConnector
            v-for="(i, index) in n.input"
            :isConnecting="isConnecting"
            :id="n.id"
            :index="index"
            :key="i"
            @start-connection="startConnection($event)"
            @complete-connection="completeConnection($event)"
          />
        </div>
        <div>
          <GraphConnector
            v-for="(i, index) in n.output"
            :isConnecting="isConnecting"
            :id="n.id"
            :index="index"
            :key="i"
            @start-connection="startConnection($event)"
            @complete-connection="completeConnection($event)"
          />
        </div>
      </div>
    </GraphNode>
    <!-- graph edge, the line that connects node together -->
    <div>
      <GraphEdge
        v-if="temporaryConnection"
        :input="temporaryConnection.input"
        :output="temporaryConnection.output"
      />
    </div>
    <!-- <GraphEdge :input="({x:0, y:100})" :output="({x: 100, y:200})" /> -->
  </div>
</template>

<script>
// import GraphLinker from "./GraphLinker";
import GraphNode from "./GraphNode";
import GraphConnector from "./GraphConnector";
import GraphEdge from "./GraphEdge";
import { getMousePosition } from "../helper/MouseHelper.js";
import { fromEvent } from "rxjs";
import { takeUntil, finalize } from "rxjs/operators";

export default {
  components: {
    GraphNode,
    GraphConnector,
    GraphEdge
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
    },
    canvasConfig: {
      type: Object,
      default() {
        return {
          gridSize: [100, 25],
          gridColor: ["rgba(0, 0, 0, 0.2)", "rgba(0, 0, 0, 0.1)"]
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
    },
    /* Grid Bacground CSS */
    gridBackgroundStyle: function() {
      const { gridSize, gridColor } = this.canvasConfig;
      const backgroundSize = gridSize
        .map(size => `${size}px ${size}px, ${size}px ${size}px`)
        .join(",");
      const backgroundGrid = gridColor
        .map(
          color => `
      linear-gradient(to right, ${color} 1px, transparent 1px),
      linear-gradient(to bottom, ${color} 1px, transparent 1px)
      `
        )
        .join(",");
      return {
        "background-image": backgroundGrid,
        "background-size": backgroundSize
      };
    }
  },
  data: () => ({
    nodesDict: {},
    coordinatesDict: {},
    dragOffSetX: 0,
    dragOffSetY: 0,
    isDragging: false,
    isConnecting: false,
    mousePos: { x: 0, y: 0 },
    temporaryConnection: null
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
    // deleteNodes() {
    //   //Test
    // },
    startConnection({ event, id, slot }) {
      const mouseMove$ = fromEvent(document, "mousemove");
      const mouseUp$ = fromEvent(document, "mouseup");
      /*
      Turn global isConnecting flag on, so all connector,
      all connecting will now await a potential connection. 
      Create an connection
      */
      this.isConnecting = true;
      const { x, y } = getMousePosition(this.$el, event);
      this.temporaryConnection = {
        input: {
          id,
          x,
          y
        },
        output: this.mousePos
      };
      //take mousemove until mouse let up
      mouseMove$
        .pipe(
          takeUntil(mouseUp$),
          finalize(() => {
            this.isConnecting = false;
            this.temporaryConnection = null;
          })
        )
        .subscribe(
          mouseMove => {
            this.followMouse(mouseMove);
          },
          e => {
            console.error(error);
          }
        );
    },
    completeConnection({ event, id, slot }) {
      const inputId = this.temporaryConnection.input.id;
      this.nodesDict.output.push()
      //update the 
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
    },
    selectId({ id, isMultiSelect }) {
      const idsToBeFlipped = new Set(id);
      if (!isMultiSelect) {
        const ids = this.nodesArray
          .filter(node => node.selected)
          .map(node => node.id)
          .forEach(id => {
            idsToBeFlipped.add(id);
          });
      }
      idsToBeFlipped.forEach(id => {
        this.$set(this.nodesDict, id, {
          ...this.nodesDict[id],
          selected: !Boolean(this.nodesDict[id].selected)
        });
      });
    },
    followMouse(event) {
      const { x, y } = getMousePosition(this.$el, event);
      this.mousePos.x = x;
      this.mousePos.y = y;
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

.input-output-container {
  display: flex;
  justify-content: space-between;
  padding: 5px;
}
</style>