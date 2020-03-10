import { ObservableStore } from "@codewithdan/observable-store"

export class NodeStore extends ObservableStore {

    defaultState = {};

    constructor() {
        super({
            stateSliceSelector: (state) => state.node
        });
    }

    add(newNode) {
        const oldNode = this.getState();
        this.setState((prevState) => {
            prevState.node = { ...prevState.node, ...newNode }
            return prevState;
        }, "ADD_NODE");
    }

    /**
     * Update Node State
     * @param {*} id 
     * @param {*} node 
     */
    update(id, node) {
        this.setState(prevState => {
            const { x, y } = node;
            const { x: pX, y: pY } = prevState[id].pos;
            const pos = {
                x: x + pX,
                y: y + pY
            }
            const newState = {
                [id]: {
                    pos
                }
            }
            return {
                node: { ...prevState, ...newState}
            }
        }, "UPDATE_NODE")
    }

    remove(id) {

    }
}