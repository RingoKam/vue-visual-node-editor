import { BehaviorSubject } from "rxjs"

function connection() {

    const connection$ = new BehaviorSubject({});

    const newConnection = (input, output) => {
        let newConnection = {
            [`${input.id}_${output.id}`]: {
                input, 
                output
            }
        };
        const current = connection$.getValue();
        connection$.next({ ...current, ...newConnection });
    } 

    return {
        newConnection,
        connection$: connection$.asObservable();
    }
}