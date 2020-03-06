import { NodeStore } from "./node";
import { PanningStore } from "./panning";
import { ConnectionStore } from "./connection";
import { ScaleStore } from "./scaling";
import { combineLatest } from "rxjs";

export class engine {

    constructor(nodeState, connectionState, scale, panning) {
        //take in the initial state and set it
        this.nodes = new NodeStore().setInitial(nodeState);
        this.connections = new ConnectionStore().setInitial(connectionState);
        this.scale = new ScaleStore().setInitial(scale);
        this.panning = new PanningStore().setInitial(panning);
    }

    //Grid Actions
    /**
     * Update
     * @param {int} x
     * @param {int} y
     */
    updatePanning(x, y) {
        this.panning.update(x, y);
    }

    updateScaling(scale) {
        this.scale.update(scale);
    }

    //Node Actions
    /**
     * Move the Node Position
     * @param {*} id the id of the node
     * @param {*} pos new x,y position of the node
     */
    updateNodePos(id, pos) {
        this.nodes.update(id, pos);
    }

    //Observable
    getNode$() {
        return this.nodes.stateChanged;
    }

    getPanning$() {
        return this.panning.stateChanged;
    }

    getConnection$() {
        return this.connectionState.stateChanged;
    }
}
