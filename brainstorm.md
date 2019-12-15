1. on load, figure out the position of each grid.

we want to query the position whenever...
1. we move the node that it is connected to (input or output)
since we are moving with a global +x, +y, can we use that on the node
-> ON MOVE, Coordinate Position + TRANSFORM

2. we create the connection for the first time
-> ON CREATE: Query the DOM, Update the Coordinate Dictionary

what should be engine state, what should be in vue state?
vue state itself has reactivity built in...?

my current state...
nodes = {
    id: []
    connections: []
}

edges = {
    from: { id, index }
    to: { id, index }
    context: { ... }
    //potential life cycle hook
    OnCreate
    OnConnect
    OnDestroy
}

Coordinate based info
dragOffSetX //use for when moving nodes around 
dragOffSetY //use for when moving nodes around
isDragging //let us know if node dragging is on
isConnecting //let us know if we are trying to connect node
mousePos // use when we are creating the temporary connection
panningX //
panningY //
{

}
