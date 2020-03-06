import {  ObservableStore } from "@codewithdan/observable-store-extensions"

export class NodeStore extends ObservableStore {
    
    defaultState = {};

    constructor() {
        super();
    }

    add(newNode){
        
    }

    /**
     * Update Node State
     * @param {*} id 
     * @param {*} node 
     */
    update(id, node) {
        
    }
    
    remove(id) {

    }
    
    setInitial(state) {
        if(!state || Object.keys(state).length === 0) {
            state = this.defaultState; 
        }
        this.setState(state, "INIT_NODES");
    }
}