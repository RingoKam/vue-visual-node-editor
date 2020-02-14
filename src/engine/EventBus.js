import { BehaviorSubject, combineLatest } from "rxjs"
import { pluck, map } from "rxjs/operators"

export default (config) => {

    const nodePos$ = new BehaviorSubject(config || {});
    const panning$ = new BehaviorSubject({ x: 0, y: 0 });
    const scaling$ = new BehaviorSubject(1);

    const updateNodePos = (id, changeNode) => {
        const current = nodePos$.getValue();
        const scale = scaling$.getValue();
        const newPos = {
            x: current[id].x + (changeNode.x / scale),
            y: current[id].y + (changeNode.y / scale)
        }
        const next = { ...current, ...{ [id]: newPos } };
        nodePos$.next(next);
    }

    const updatePanning = (x, y) => {
        panning$.next({ x, y });
    }

    const updateScaling = (scale) => {
        scaling$.next(scale);
    }

    const getNodePos = (id) => {
        return nodePos$.pipe(pluck(id));
    }

    const nodeIds$ = nodePos$.pipe(map(nodes => Object.keys(nodes)));

    return {
        nodeIds$,
        panning$,
        scaling$,
        getNodePos,
        updateNodePos,
        updatePanning,
        updateScaling
    }
}