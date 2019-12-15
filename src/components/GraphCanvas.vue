<template>
  <div
    class="graph-canvas"
    :style="{ ...gridBackgroundStyle, ...cursorStyle }"
    @mousedown.prevent.self="mousedown"
  >
    <!-- <pre>coordinatesDict:{{coordinatesDict}}</pre>
    <pre>Drag</pre>
    <pre>temporaryConnection:{{temporaryConnection}}</pre>
    <pre>nodesArray:{{nodesArray}}</pre>
    <pre>mousePos:{{mousePos}}</pre>
    <pre>isConnecting:{{isConnecting}}</pre>
    <pre>Edges:{{edges}}</pre>
    <pre>Edge Coordinate: {{ edgesCoordinate }}</pre>-->
    <GraphNode
      v-for="n in nodesArray"
      :dragOffSetX="dragOffSetX"
      :dragOffSetY="dragOffSetY"
      :panningX="panningX"
      :panningY="panningY"
      :isDragging.sync="isDragging"
      :selected="n.selected"
      :context="n.context"
      :coordinates="coordinatesDict[n.id]"
      :id="n.id"
      :key="n.id"
      @move-node="moveNodeStart"
      @select-id="selectId($event)"
      @update:position="updatePosition($event, n.id)"
    >
      <!-- graph connector connect GraphNode together -->
      <slot name="body" v-bind:body="({ ...n, coordinates:coordinatesDict[n.id]})"></slot>
      <div class="input-output-container">
        <div>
          <!-- input, need to keep track and be able to query their position -->
          <GraphConnector
            v-for="(i, index) in n.input"
            :isConnecting="isConnecting"
            :isDragging="isDragging"
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
    <div>
      <GraphEdge v-for="(e, i) in edgesCoordinate" :key="i" :input="e.input" :output="e.output" />
    </div>

    <!--ContextMenu-->
  </div>
</template>

<script>
// import GraphLinker from "./GraphLinker";
import GraphNode from "./GraphNode";
import GraphConnector from "./GraphConnector";
import GraphEdge from "./GraphEdge";
import { getMousePosition } from "../helper/MouseHelper.js";
import { fromEvent } from "rxjs";
import { takeUntil, finalize, startWith } from "rxjs/operators";
import startEngine from "../engine.js";

export default {
  components: {
    GraphNode,
    GraphConnector,
    GraphEdge
  },
  provide() {
    const engine = startEngine();
    return {
      engine: engine
    };
  },
  // subscriptions: function() {
  //   const { connectorLookup$ } = this._provided.engine;
  //   return {
  //     connectorLookup$
  //   };
  // },
  props: {
    //node context information (title, input, output)
    nodes: {
      type: Object,
      default() {
        return {};
      }
    },
    edges: {
      type: Array,
      default() {
        return [];
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
      return Object.keys(this.localNodes).map(key => ({
        id: key,
        ...this.localNodes[key]
      }));
    },
    linksArray: function() {
      return Object.values(this.coordinatesDict);
    },
    edgesCoordinate: function() {
      const { connectorLookup$ } = this._provided.engine;
      if (!connectorLookup$) {
        console.log("this is not working");
        return [];
      }
      const lookupDict = connectorLookup$.getValue();
      const edgeCoordinate = this.localEdges.map(edge => {
        const { input, output } = edge;
        const isSelected = this.localNodes[input.id].selected;
        const inputPos = lookupDict[input.id].get(input.slot)();
        const outputPos = lookupDict[output.id].get(output.slot)();
        return { input: outputPos, output: inputPos };
      });
      return edgeCoordinate;
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
    },
    cursorStyle: function() {
      console.log(this.cursor);
      return {
        cursor: this.cursor
      };
    }
  },
  data: () => ({
    localNodes: {},
    localEdges: [],
    coordinatesDict: {},
    cursor: "auto",
    //
    dragOffSetX: 0,
    dragOffSetY: 0,
    panningX: 0,
    panningY: 0,
    isDragging: false,
    isConnecting: false,
    mousePos: { x: 0, y: 0 },
    temporaryConnection: null
  }),
  //my output
  methods: {
    addNodes(pos) {
      const { x, y } = pos || { x: 10, y: 100 };
      const ids = Object.keys(this.localNodes).sort();
      const id = ids.length > 0 ? ids.length : 0;
      this.$set(this.localNodes, id, { ...this.defaultContext });
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
        input: this.mousePos,
        output: {
          id,
          slot,
          x,
          y
        }
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
    //handle mouse movement
    mousedown(event) {
      //update cursor state to grabby hand ԅ( ˘ω˘ ԅ)
      this.cursor = "grabbing";
      //Capture mouse movement for panning...
      //TODO: capture touch event also?
      const mouseMove$ = fromEvent(document, "mousemove");
      const mouseUp$ = fromEvent(document, "mouseup");
      mouseMove$
        .pipe(
          finalize(() => {
            this.cursor = "auto";
          }),
          takeUntil(mouseUp$)
        )
        .subscribe(event => {
          const { movementX, movementY } = event;
          this.panningX += movementX;
          this.panningY += movementY;
        });
    },
    /*
    Completes a connection add it to local
    TODO: implement auto  
    */
    completeConnection({ event, id, slot }) {
      const outputId = this.temporaryConnection.output.id;
      const outputSlot = this.temporaryConnection.output.slot;
      this.localEdges.push({
        input: { id: outputId, slot: outputSlot },
        output: { id, slot }
      });
    },
    updatePosition({ x, y }, id) {
      this.coordinatesDict[id].x += x;
      this.coordinatesDict[id].y += y;
      this.dragOffSetX = 0;
      this.dragOffSetY = 0;
    },
    moveNodeStart(event) {
      const isMouse = true;
      const { clientX, clientY } = isMouse ? event : event.touches[0];
      const dragStartX = clientX + window.pageXOffset;
      const dragStartY = clientY + window.pageYOffset;
      //toggle dragging status
      //start listening to mouse/finger movement
      const movement$ = fromEvent(
        document,
        isMouse ? "mousemove" : "touchmove"
      );
      const endMovement$ = fromEvent(
        document,
        isMouse ? "mouseup" : "touchend"
      );
      const draggingSequence$ = movement$
        .pipe(
          finalize(e => {
            this.moveNodeEnd();
          }),
          takeUntil(endMovement$)
        )
        .subscribe(e => {
          this.movingNode(e, dragStartX, dragStartY, isMouse);
        });
    },
    movingNode(event, dragStartX, dragStartY, isMouse) {
      const { clientX, clientY } = isMouse ? event : event.touches[0];
      const x = clientX + window.pageXOffset - dragStartX;
      const y = clientY + window.pageYOffset - dragStartY;
      console.log(clientX, window.pageXOffset, dragStartY);
      this.dragOffSetX = x;
      this.dragOffSetY = y;
    },
    moveNodeEnd() {
      //find all the active node
      const ids = Object.entries(this.localNodes)
        .filter(([id, context]) => context.selected)
        .map(([id]) => id)
        .forEach(id => {
          const x = this.coordinatesDict[id];
          this.coordinatesDict[id].x += this.dragOffSetX;
          this.coordinatesDict[id].y += this.dragOffSetY;
        });
      //reset drag
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
        this.$set(this.localNodes, id, {
          ...this.localNodes[id],
          selected: !Boolean(this.localNodes[id].selected)
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
    this.localNodes = this.nodes;
    this.localEdges = this.edges;
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