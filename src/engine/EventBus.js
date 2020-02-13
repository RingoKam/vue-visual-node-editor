import { BehaviorSubject, combineLatest } from "rxjs"
import { pluck, map } from "rxjs/operators"

export default (config) => {

    const nodePos$ = new BehaviorSubject(config || {});
    const panning$ = new BehaviorSubject({ x: 0, y: 0 });
    const scaling$ = new BehaviorSubject(1);

    const updateNodePos = (id, node) => {
        const current = nodePos$.getValue();
        const next = { ...current, ...{ [id]: node } };
        nodePos$.next(next);
    }

    const updatePanning = (x, y) => {
        panning$.next({ x, y });
    }

    const updateScaling = (scale) => {
        this.scaling$.next(scale);
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