import { ObservableStore } from "@codewithdan/observable-store"

export class PanningStore extends ObservableStore {
    constructor() {
        super({
            stateSliceSelector: (state) => state.panning
        });
    }

    update(x, y) {
        this.setState((prevState) => {
            return {
                panning: {
                    x: prevState.x + x,
                    y: prevState.y + y
                }
            }
        }, "UPDATE_PANNING");
    }

    set(x, y) {
        this.setState(() => {
            return {
                panning: { x, y }
            }
        }, "SET_PANNING");
    }
}
