import { ObservableStore } from "@codewithdan/observable-store"

export class ConnectionStore extends ObservableStore {
    constructor() {
        super({ stateSliceSelector: (state) => state.connections });
    }

    add() {

    }

    remove() {

    }
    
}