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
    componentType: ''
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

use provide and inject to pass some global flags to  

----part 2

1. Each node has a position (x,y) nodePos
2. Each connection within the node has a position (x,y) connectionPos
3. We can position the input output whatever ways we want, as long as we give it a unique ID, then we can query it anyway we want. 

SCENARIO When we move a node
1. we move the node the selecting the title, when mouseover title, the mouse pointer should change to move 
2. once a mousedown is detected, the drag movement should be use by the temporary connection
3. on mouseup, if the 
2. all the connection associate with that node has to change

Implementation: Every node has an ID, when we move, the connection need to subscribe to the change in x and y for id. 

SCENARIO When we create a connection
1. we create a temporay connection
2. query the pos of the connector we start out from, the to node should be whatever

Each connection need to have a hook, and a callback method, in case the action didnt go through user can call the callback method to cancel the interaction. 

