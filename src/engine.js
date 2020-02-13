import { BehaviorSubject, combineLatest } from "rxjs"
// import { } from "rxjs/operators"

export default (config) => {

    //object with id and their {x,y}
    const nodePos$ = new BehaviorSubject({});
    //object with id and their width and height? or should this be combine with their Pos
    const nodeHeightWidth$ = new BehaviorSubject({});
    //object with id and their port label and position
    const nodePort$ = new BehaviorSubject({});


    const edgeState$ = new BehaviorSubject({});
    const connectorLookup$ = new BehaviorSubject({});
    const dragOffSetState$ = new BehaviorSubject({ x: 0, y: 0 });
    const panningState$ = new BehaviorSubject({ x: 0, y: 0 });
    const selectedIds$ = new BehaviorSubject(new Set([]));

    //derived states...
    //whenever node change, recompute position its position
    const nodeTranslate$ = combineLatest(
        panningState$,
        dragOffSetState$,
        (panningState, dragOffSetState) => {
            return {
                selected: {
                    x: dragOffSetState.x + panningState.x,
                    y: dragOffSetState.y + panningState.y
                },
                unselected: {
                    x: panningState.x,
                    y: panningState.y
                }
            }
        }
    );

    //pass in an id and return an observable...
    const getNodeTranslate$ = (id) => {
        return combineLatest(
            nodeTranslate$,
            selectedIds$
        ).pipe(
            map(
                (translate, selectedIds) => {
                    const { selected, unselected } = translate;
                    return selectedIds.has(id) ? selected : unselected;
                }
            )
        );
    }

    const addNode = (node) => {
        const current = nodeState$.getValue();
        nodeState$.next({ ...current, node });
    }

    const changeNode = (id, node) => {
        const current = nodeState$.getValue();
        nodeState$.next({ ...current, node });
    }

    const changeEdge = (edgeState) => {
        state$.next(edgeState);
    }

    const addOrUpdateConnector = (id, slot, lookup) => {
        const current = connectorLookup$.getValue();
        if (current[id]) {
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
