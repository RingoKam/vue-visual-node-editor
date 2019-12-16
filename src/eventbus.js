import { Subject } from "rxjs";

const nodeEventName = {
    START_MOVE_NODE: "start-move-node",
    SELECT_NODE: "select-node"
}

const connectorEventName = {
    UPDATE_POSITION: "update-position",
    COMPLETE_CONNECTION: "complete-connection",
    START_CONNECTION: "start-connection"
}

//TODO: make this a class?
const createEventBus = (config) => {
    const nodeSubject$ = new Subject();
    const connectorSubject$ = new Subject();

    const emitNodeEvents = ({ event, ...payload }) => {
        nodeSubject$.next({ event, payload });
    };

    const emitConnectorEvents = ({ event, ...payload }) => {
        connectorSubject$.next({ event, payload });
    }

    return {
        "node": {
            events$: nodeSubject$.asObservable(),
            emit: emitNodeEvents,
        },
        "connector": {
            events$: connectorSubject$.asObservable(),
            emit: emitConnectorEvents
        }
    }
}

export {
    connectorEventName,
    nodeEventName,
    createEventBus
} 
