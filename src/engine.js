import { BehaviorSubject } from "rxjs"
// import { } from "rxjs/operators"

export default (config) => {

    const nodeState$ = new BehaviorSubject({});
    const edgeState$ = new BehaviorSubject({});
    const connectorLookup$ = new BehaviorSubject({});

    const changeNode = (newState) => {
        state$.next(newState);
    }

    const changeEdge = (edgeState) => {
        state$.next(edgeState);
    }

    const addOrUpdateConnector = (id, slot, lookup) => {
        const current = connectorLookup$.getValue();
        if(current[id]) {
            current[id].set(slot, lookup);
        } else {
            const newMap = new Map();
            newMap.set(slot, lookup);
            current[id] = newMap;
        }
        connectorLookup$.next(current);
    }

    return {
        nodeState$,
        edgeState$,
        connectorLookup$,
        addOrUpdateConnector,
        changeNode,
        changeEdge
    }
}
