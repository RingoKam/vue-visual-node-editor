import {  ObservableStore } from "@codewithdan/observable-store-extensions"

export class ConnectionStore extends ObservableStore {
    constructor() {
        super();
    }

    add() {

    }

    remove() {

    }

    setInitial(state) {
        this.setState(state, "INIT_CONNECTIONS");
    }
}