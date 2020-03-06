# EventBus Constructor takes in the initial data set. 
1. On load, figure out the position of each grid.
2. create the connection


Define my Action:
* Move Screen
    - Node
    - Connection
* Zoom in and out
    - Node
    - Connection

* Create Node
    - Node
        * ability to register default property
        
    
* Move Node 
    - Node
    - Connection
* Select Node
    - Node
* Update Option Data



* Create Connection
    - Connection
* Remove Connection
    - Connection
* Select Connection
    - Connection

* Option Factory to create observable store 


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
    id: [],
    connections: [],
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
