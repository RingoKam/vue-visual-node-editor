import { BehaviorSubject, combineLatest } from "rxjs"
import { pluck, map } from "rxjs/operators"

export default (config) => {

    const node$ = new BehaviorSubject(config || {});

    const panning$ = new BehaviorSubject({ x: 0, y: 0 });
    const scaling$ = new BehaviorSubject(1);
    const connection$ = new BehaviorSubject([]);
    const temporaryConnection$ = new BehaviorSubject(null);

    const updateNodePos = (id, changeNode) => {
        const current = node$.getValue();
        const scale = scaling$.getValue();
        const newPos = {
            x: current[id].x + (changeNode.x / scale),
            y: current[id].y + (changeNode.y / scale)
        }
        const next = { ...current, ...{ [id]: { ...current[id] , ...newPos } } };
        node$.next(next);
    }

    const updateNode = (id, node) => {
        const current = node$.getValue();
        const next = { ...current, ...{ [id]: node }};
        node$.next(next);
    } 

    const updatePanning = (x, y) => {
        panning$.next({ x, y });
    }

    const getNode = (id) => {
        return node$.pipe(pluck(id));
    }

    const nodeIds$ = node$.pipe(map(nodes => Object.keys(nodes)));


    const updateScaling = (scale) => {
        scaling$.next(scale);
    }
    
    const setTemporaryConnection = () => {

    }




    return {
        
        getNode,
        nodeIds$,
        updateNode,
        updateNodePos,

        panning$,
        updatePanning,
        scaling$,
        updateScaling
        

    }
}