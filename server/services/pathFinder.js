// Find k shortest paths for normal case (without time)
function findKShortestPaths(graph, source, destination) {
    // Handle if source same as destination
    if (source == destination) {
        return[{'route':[source], 'cost':0}];
    }

    // Use Yen's algorithm to find k shortest paths
    // Initialize empty list of shortest paths and potential shortest paths
    let shortestPaths = [];
    let potentialShortestPath = [];

    // Find shortest path using Djikstra algorithm and add to shortest path list
    let shortestPath = findShortestPath(graph, source, destination);
    shortestPaths.push({'route': shortestPath, 'cost': shortestPath.length-1});
    
    // Find until 5th shortest path, can be changed
    for (let k = 1; k < 5; k++) {
        // Iterate stations on previous shortest path
        for (let i = 0; i < shortestPaths[k-1]['route'].length - 1; i++) {
            // Create a graph copy
            let graphCopy = JSON.parse(JSON.stringify(graph));
            // Set current station as spur vertex (vertex where the path will branches out)
            let spurVertex = shortestPaths[k-1]['route'][i];
            // Root path is path from source to spur vertex from previous shortest path
            let rootPath = shortestPaths[k-1]['route'].slice(0,i+1);

            // If previous shorter paths have same root path, remove edges which are part of previous shortest paths from graph copy
            for(let path of shortestPaths) {
                let route = path['route'];
                if (JSON.stringify(rootPath) == JSON.stringify(route.slice(0, i+1))) {
                    graphCopy[route[i]].splice(graphCopy[route[i]].indexOf(route[i+1]), 1);
                    graphCopy[route[i+1]].splice(graphCopy[route[i+1]].indexOf(route[i]), 1);
                }
            }

            // Remove vertices in root path from graph copy except spur vertex
            for (let rootPathVertex of rootPath) {
                if (rootPathVertex != spurVertex) {
                    for (let neighbour of graphCopy[rootPathVertex]) {
                        graphCopy[neighbour].splice(graphCopy[neighbour].indexOf(rootPathVertex), 1);
                    }
                    delete graphCopy[rootPathVertex];
                }
            }

            // Find spur path using Djikstra algorithm
            // Spur path is shortest path from spur vertex to destination
            let spurPath = findShortestPath(graphCopy, spurVertex, destination);

            // Get full path and add to potential list
            // Full path is made of root path + spur path
            if (spurPath.length != 0) {
                let totalPath = rootPath.concat(spurPath.slice(1));
                if (!(potentialShortestPath.some(path => JSON.stringify(path) == JSON.stringify(totalPath)))) {
                    potentialShortestPath.push(totalPath);
                }
            }
        }

        // Break if no more path found
        if (potentialShortestPath.length == 0) {
            break;
        }

        // Find shortest path from potential list and move to shortest paths list
        shortestPath = findShortestPotential(potentialShortestPath);
        shortestPaths.push({'route': potentialShortestPath[shortestPath], 'cost': potentialShortestPath[shortestPath].length-1});
        potentialShortestPath.splice(shortestPath, 1)
    }
    return shortestPaths;
}
exports.findKShortestPaths = findKShortestPaths;

// Find shortest path using Djikstra algorithm for normal case (without time)
function findShortestPath(graph, source, destination) {
    let visited = [];
    let reachable = [];
    let previous = {};
    let distances = {};

    // Initialize all distance to infinity
    for (let vertex in graph){
        distances[vertex] = Infinity;
    }

    // Start with source vertex and set source's distance to 0
    distances[source] = 0;
    reachable.push(source);

    // Iterate until there is no reachable vertex
    while (reachable.length != 0) {
        // Find nearest reachable vertex, remove from reachable list, and add to visited list
        nearest = findNearestVertex(reachable, distances);
        reachable.splice(reachable.indexOf(nearest),1);
        visited.push(nearest);

        // Break if reached destination
        if (nearest == destination) {
            break;
        }
        
        // Iterate neighbours of nearest vertex
        for (let neighbour of graph[nearest]) {
            // Add neighbour of nearest to reachable list if not already in visited and reachable
            if (!visited.includes(neighbour) && !reachable.includes(neighbour)) {
                reachable.push(neighbour);
            }
            // Update distance and previous of the neighbour if there is shorter path
            let newDistance = distances[nearest] + 1;
            if (newDistance < distances[neighbour]) {
                distances[neighbour] = newDistance;
                previous[neighbour] = nearest;
            }
        }
    }

    // Get the resulting path by tracing back previous
    let path = [];
    if (destination in previous) {
        path.unshift(destination);
        let vertex = destination;
        while (vertex != source) {
            path.unshift(previous[vertex]);
            vertex = previous[vertex];
        }
    }

    return path;
}

// Find shortest path from list of potential shortest paths
function findShortestPotential(potentialPaths) {
    let shortestIndex = null;
    let shortestSteps = null;
    for (let idx = 0; idx < potentialPaths.length; idx++) {
        steps = potentialPaths[idx].length;
        if (shortestIndex == null || steps < shortestSteps) {
            shortestIndex = idx;
            shortestSteps = steps;
        }
    }
    return shortestIndex;
}

// Find nearest vertext from list of reachable vertices
function findNearestVertex(reachable, distances) {
    let nearest = null;
    for (let vertex of reachable) {
        if (nearest == null || distances[vertex] < distances[nearest]) {
            nearest = vertex;
        }
    }
    return nearest;
}
exports.findNearestVertex = findNearestVertex;