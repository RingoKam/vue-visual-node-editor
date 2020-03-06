import { ObservableStore } from "@codewithdan/observable-store-extensions";

export class PanningStore extends ObservableStore {
    constructor() {
        super();
    }

    update(x, y) {
        this.setState({ x, y }, "UPDATE_PANNING");
    }

    setInitial(state) {
        if (!state) {
            state = {
                x: 0,
                y: 0
            };
        }
        this.setState(state, "INIT_PANNING");
    }
}
