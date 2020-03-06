import { ObservableStore } from "@codewithdan/observable-store-extensions";

export class ScaleStore extends ObservableStore {
    constructor() {
        super();
    }

    updateScaling(newScale) {
        this.setState(newScale, "UPDATE_SCALE");
    }

    setInitial(state) {
        if (!state) {
            state = 1;
        }
        this.setState(state, "INIT_SCALE");
    }
}
