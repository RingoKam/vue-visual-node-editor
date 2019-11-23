<template>
    <div class="graph-canvas">
        <button @click="addNodes">Add New</button>
        <GraphNode 
            v-for="n in nodesArray"
            :x="n.x"
            :y="n.y" 
            :key="n.id">
        </GraphNode>
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
        }   
    },
    computed: {
        nodesArray: function() {
            return Object.values(this.nodesDict);
        },
        linksArray: function() {
            return Object.values(this.coordinatesDict);
        }
    },
    data: () => ({
        nodesDict: {},
        coordinatesDict: {} 
    }),
    //my output
    methods: {
        addNodes(pos) {
            const { x, y } = pos || { x: 10, y: 100 };
            const ids = Object.keys(this.nodesDict).sort();
            const id = ids.length > 0 ? ids.length : 0;
            const defaultNode = { id, x, y };
            this.$set(this.nodesDict, id, defaultNode);
        },
        deleteNodes() {

        },
        updateNodes() {

        },
        updateCoordinates() {

        }
    },
    created() {
        this.nodesDict = this.nodes;
        this.coordinatesDict = this.coordinates;
    } 
}
</script>

<style>
.graph-canvas {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
}
</style>