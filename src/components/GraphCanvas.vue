<template>
  <div
    class="graph-canvas"
    :style="{ ...gridBackgroundStyle, ...cursorStyle }"
    @contextmenu.prevent.self=""
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
    <component
      v-for="n in nodesArray"
      :is="n.componentType"
      :dragOffSetX="dragOffSetX"
      :dragOffSetY="dragOffSetY"
      :panningX="panningX"
      :panningY="panningY"
      :isDragging.sync="canvasState.isDragging"
      :selected="selectedIds[n.id]"
      :context="n.context"
      :connections="n.connections"
      :x="coordinatesDict[n.id].x"
      :y="coordinatesDict[n.id].y"
      :id="n.id"
      :key="n.id"
      @move-node="moveNodeStart"
      @select-id="selectId($event)"
    ></component>
    <svg class="graph-edges">
      <GraphEdge
        v-if="temporaryConnection"
        :input="temporaryConnection.input"
        :output="temporaryConnection.output"
      />
      <GraphEdge v-for="(e, i) in edgeCoordinateArray" :key="i" :input="e.to" :output="e.from" />
    </svg>
    <!--ContextMenu-->
  </div>
</template>

<script>
// import GraphLinker from "./GraphLinker";
import GraphNode from "./GraphNode";
import GraphConnector from "./GraphConnector";
import GraphEdge from "./GraphEdge";
import GraphNodeV2 from "./GraphNodeV2";
import GraphNodeV3 from "./GraphNodeV3";
import { getMousePosition } from "../helper/MouseHelper.js";
import { fromEvent } from "rxjs";
import { takeUntil, finalize, startWith, filter } from "rxjs/operators";
import startEngine from "../engine.js";
import {
  createEventBus,
  nodeEventName,
  connectorEventName
} from "../eventbus.js";

export default {
  components: {
    GraphEdge,
    GraphNodeV2,
    GraphNodeV3
  },
  provide() {
    return {
      eventBus: this.eventBus,
      canvasState: this.canvasState
    };
  },
  mounted() {
    const { node, connector } = this.eventBus;
    const updateConnectionPosition$ = connector.events$.pipe(
      filter(({ event }) => event === connectorEventName.UPDATE_POSITION)
    );
    const startConnection$ = connector.events$.pipe(
      filter(({ event }) => event === connectorEventName.START_CONNECTION)
    );
    const completeConnection$ = connector.events$.pipe(
      filter(({ event }) => event === connectorEventName.COMPLETE_CONNECTION)
    );
    this.$subscribeTo(updateConnectionPosition$, p => {
      this.updateConnectorPosition(p);
    });
    this.$subscribeTo(startConnection$, p => {
      this.startConnection(p);
    });
    this.$subscribeTo(completeConnection$, p => {
      this.completeConnection(p);
    });
  },
  props: {
    //node context information (title, input, output)
    nodes: {
      type: Object,
      default() {
        return {};
      }
    },
    eventBus: {
      type: Object
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
  watch: {
    edges: function() {
      //everytime edge change compute the array again...
      this.computeEdgeCoordinateArray();
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
    // edgeCoordinates: function() {
    //   const obj = {};
    //   Object.entries(this.edgeCoordinateDict).forEach(([nodeId, ids]) => {
    //     obj[nodeId] = {};
    //     const parent = this.coordinatesDict[nodeId];
    //     Object.entries(ids).forEach(([id, posOffSet]) => {
    //       const x = parent.x - posOffSet.x;
    //       const y = parent.y - posOffSet.y;
    //       obj[nodeId][id] = { x, y };
    //     });
    //   });
    //   return obj;
    // },

    // edgesCoordinate: function() {
    //   const { connectorLookup$ } = this._provided.engine;
    //   if (!connectorLookup$) {
    //     console.log("this is not working");
    //     return [];
    //   }
    //   const lookupDict = connectorLookup$.getValue();
    //   const edgeCoordinate = this.localEdges.map(edge => {
    //     const { input, output } = edge;
    //     const isSelected = this.localNodes[input.id].selected;
    //     const inputPos = lookupDict[input.id].get(input.slot)();
    //     const outputPos = lookupDict[output.id].get(output.slot)();
    //     return { input: outputPos, output: inputPos };
    //   });
    //   return edgeCoordinate;
    // },
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
  data() {
    return {
      localNodes: {},
      localEdges: [],
      edgeCoordinateArray: [],
      coordinatesDict: {},
      edgeCoordinateDict: {},
      cursor: "auto",
      selectedIds: {},
      dragOffSetX: 0,
      dragOffSetY: 0,
      panningX: 0,
      panningY: 0,
      mousePos: { x: 0, y: 0 },
      temporaryConnection: null,
      canvasState: {
        isDragging: false,
        isConnecting: false
      }
    };
  },
  //my output
  methods: {
    openContextMenu() {
      
    },
    mousedown(event) {
      //update cursor state to grabby hand ԅ( ˘ω˘ ԅ)
      this.cursor = "grabbing";
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
          this.computeEdgeCoordinateArray();
        });
    },
    updateConnectorPosition({ payload }) {
      const { id, nodeId, position, positionQuery } = payload;
      if (!this.edgeCoordinateDict[nodeId]) {
        this.$set(this.edgeCoordinateDict, nodeId, {});
      }
      const parent = this.coordinatesDict[nodeId];
      const { x, y } = position;
      this.$set(this.edgeCoordinateDict[nodeId], id, {
        x: parent.x - (x - this.panningX),
        y: parent.y - (y - this.panningY),
        query: positionQuery
      });
    },
    startConnection({ payload }) {
      console.log(payload);
      const { id, nodeId } = payload;
      const mouseMove$ = fromEvent(document, "mousemove");
      const mouseUp$ = fromEvent(document, "mouseup");
      /*
      Turn global isConnecting flag on, so all connector,
      all connecting will now await a potential connection. 
      Create an connection
      */
      this.canvasState.isConnecting = true;
      const el = this.$el.getBoundingClientRect();
      const offsetX = el.x;
      const offsetY = el.y;
      const { x, y } = this.edgeCoordinateDict[nodeId][id].query();
      // const { x, y } = getMousePosition(this.$el, event);
      this.temporaryConnection = {
        input: this.mousePos,
        output: {
          id,
          nodeId,
          x: x - offsetX,
          y: y - offsetY
        }
      };
      //take mousemove until mouse let up
      mouseMove$
        .pipe(
          takeUntil(mouseUp$),
          finalize(() => {
            this.canvasState.isConnecting = false;
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
    /*
    Completes a connection add it to local
    TODO: implement auto  
    */
    completeConnection({ event, payload }) {
      const { nodeId, id } = payload;
      const output = this.temporaryConnection.output;
      const newEdge = {
        from: { nodeId: output.nodeId, id: output.id },
        to: { nodeId, id }
      };
      this.$emit("add-new-edge", newEdge);
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
          finalize(() => {
            this.moveNodeEnd();
          }),
          takeUntil(endMovement$)
        )
        .subscribe(e => {
          this.movingNode(e, dragStartX, dragStartY, isMouse);
        });
    },
    movingNode(event, dragStartX, dragStartY, isMouse) {
      const { clientX, clientY, movementX, movementY } = isMouse
        ? event
        : event.touches[0];
      const x = clientX + window.pageXOffset - dragStartX;
      const y = clientY + window.pageYOffset - dragStartY;
      console.log(clientX, window.pageXOffset, dragStartY);
      this.dragOffSetX = x;
      this.dragOffSetY = y;
      this.computeEdgeCoordinateArray();
      //TODO: move all the selected node as well
      // Object.entries(this.selectedIds)
      //   .filter(([nodeId, isSelected]) => isSelected)
      //   .map(([nodeId]) => nodeId)
      //   .forEach(nodeId => {
      //     //update all the child position with offsetx and offsety
      //     Object.keys(this.edgeCoordinateDict[nodeId]).forEach(id => {
      //       this.edgeCoordinateDict[nodeId][id].x += movementX;
      //       this.edgeCoordinateDict[nodeId][id].y += movementY;
      //     });
      //   });
    },
    moveNodeEnd(e) {
      //find all the active node
      const ids = Object.entries(this.localNodes)
        .filter(([id, context]) => Boolean(this.selectedIds[id]))
        .map(([id]) => id)
        .forEach(id => {
          this.coordinatesDict[id].x += this.dragOffSetX;
          this.coordinatesDict[id].y += this.dragOffSetY;
        });
      //reset drag
      this.dragOffSetX = 0;
      this.dragOffSetY = 0;
    },
    selectId({ id, isMultiSelect }) {
      if (!this.selectedIds[id]) {
        this.$set(this.selectedIds, id, true);
      } else {
        Object.keys(this.selectedIds)
          .filter(k => k !== id)
          .forEach(k => {
            this.selectedIds[k] = false;
          });
        this.selectedIds[id] = !this.selectedIds[id];
      }
    },
    followMouse(event) {
      const { x, y } = getMousePosition(this.$el, event);
      this.mousePos.x = x;
      this.mousePos.y = y;
    },
    computeEdgeCoordinateArray: function() {
      const el = this.$el.getBoundingClientRect();
      const offsetX = el.x;
      const offsetY = el.y;
      console.log(offsetX, offsetY);
      this.edgeCoordinateArray = this.edges.map(edge => {
        const { from, to } = edge;
        const fromPos = this.edgeCoordinateDict[from.nodeId][from.id].query();
        const toPos = this.edgeCoordinateDict[to.nodeId][to.id].query();
        return {
          from: { x: fromPos.x - offsetX, y: fromPos.y - offsetY },
          to: { x: toPos.x - offsetX, y: toPos.y - offsetY }
        };
      });
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

.graph-edges {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none !important;
}
</style>