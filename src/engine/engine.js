import { NodeStore } from "./node";
import { PanningStore } from "./panning";
import { ConnectionStore } from "./connection";
import { ScaleStore } from "./scaling";
import { combineLatest } from "rxjs";
import { map, tap } from "rxjs/operators"
import { ObservableStore } from "@codewithdan/observable-store";

export class Engine {

    constructor(nodeState, connectionState, scaleState, panningState) {
        ObservableStore.resetState();
        ObservableStore.initializeState({
            node: nodeState || {},
            connection: connectionState || [],
            scale: scaleState || 1,
            panning: panningState || { x: 0, y: 0 }
        })

        // take in the initial state and set it
        this.nodes = new NodeStore();
        this.connections = new ConnectionStore();
        this.scale = new ScaleStore();
        this.panning = new PanningStore();
    }

    //Grid Actions
    /**
     * Update
     * @param {int} x
     * @param {int} y
     */
    updatePanning(x, y) {
        const scale = this.scale.getState();
        x /= scale;
        y /= scale;
        this.panning.update(x, y);
    }

    updateScaling(ev) {
        ev.preventDefault();

        let scrollAmount = ev.deltaY;
        if (ev.deltaMode === 1) {
            scrollAmount *= 32; // Firefox fix, multiplier is trial & error
        }
        const scaling = this.scale.getState();
        const panning = this.panning.getState();
        const newScale = scaling * (1 - scrollAmount / 3000);

        const currentPoint = [
            ev.offsetX / scaling - panning.x,
            ev.offsetY / scaling - panning.y
        ];

        const newPoint = [
            ev.offsetX / newScale - panning.x,
            ev.offsetY / newScale - panning.y
        ];
        const diff = [
            newPoint[0] - currentPoint[0],
            newPoint[1] - currentPoint[1]
        ];

        const panningX = panning.x + diff[0];
        const panningY = panning.y + diff[1];

        this.panning.update(panningX, panningY);
        this.scale.update(newScale);
    }

    //Node Actions
    /**
     * Move the Node Position
     * @param {*} id the id of the node
     * @param {*} pos new x,y position of the node
     */
    updateNodePos(id, pos) {
        const scale = this.scale.getState();
        pos.x /= scale;
        pos.y /= scale;
        this.nodes.update(id, pos);
    }

    addNode(node) {
        this.nodes.add(node);
    }

    //Observable
    getNode$() {
        return this.nodes.stateChanged.pipe(
            // tap(v => console.log(v)),
            map(state => {
                return state ? Object.entries(state).map(([key, value]) => {
                    return {
                        id: key,
                        ...value
                    }
                }) : [];
            }));
    }

    getPanning$() {
        return this.panning.stateChanged.pipe(
            map(state => {
                return state || { x: 0, y: 0 };
            })
        );
    }

    getScaling$() {
        return this.scale.stateChanged.pipe(map(scale => {
            return scale || 1;
        }));
    }

    getConnection$() {
        return this.connections.stateChanged;
    }
}
