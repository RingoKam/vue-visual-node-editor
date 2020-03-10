import { ObservableStore } from "@codewithdan/observable-store"

export class ScaleStore extends ObservableStore {
    constructor() {
        super({ 
            stateSliceSelector: (state) => {
                return state.scale;
            }
        });
    }

    update(newScale) {
        this.setState(() => {
            return { 
                scale: newScale
             }
        } , "UPDATE_SCALE");
    }
 
}
