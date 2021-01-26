const stationMap = require('./stationMap');
const { findNearestVertex } = require("./pathFinder");

// Find k shortest paths for bonus case (with time)
function findKShortestPathsWithTime(graph, source, destination) {
    // Get the station codes for source and destination (can be more than 1 in the case of interchanges)
    let sourceCodes = getCodesFromName(source);
    let destinationCodes = getCodesFromName(destination);

    // Handle if source same as destination
    if (source == destination) {
        return[{'route':[sourceCodes[0]], 'cost':[0]}];
    }

    // Find k shortest paths using Yen's algorithm (extended for multiple sources and destinations)
    // Initialize empty list of shortest paths and potential shortest paths
    let shortestPaths = [];
    let potentialShortestPath = [];

    // When source is interchange, find potential shortest path starting from different lines
    for (let sourceCode of sourceCodes) {
        if (sourceCode in graph) {
            let lineShortestPath = findShortestPathWithTime(graph, sourceCode, sourceCodes, destinationCodes);
            potentialShortestPath.push(lineShortestPath);
        }
    }
    // Return if no potential shortest path
    if (potentialShortestPath.length == 0) {
        return [{'route': [], 'cost': []}];
    }
    // Find the shortest path among potential shortest paths
    let shortestPath = findShortestPotentialWithTime(potentialShortestPath);
    shortestPaths.push(potentialShortestPath[shortestPath]);
    potentialShortestPath.splice(shortestPath, 1);
    
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
            let rootCost = shortestPaths[k-1]['cost'].slice(0,i+1);

            // If previous shorter paths have same root path, remove edges which are part of previous shortest paths from graph copy
            for(let path of shortestPaths) {
                let route = path['route'];
                if (JSON.stringify(rootPath) == JSON.stringify(route.slice(0, i+1))) {
                    delete graphCopy[route[i]][route[i+1]];
                    delete graphCopy[route[i+1]][route[i]];
                }
            }

            // Remove vertices in root path from graph copy except spur vertex
            for (let rootPathVertex of rootPath) {
                if (rootPathVertex != spurVertex) {
                    for (let neighbour of Object.keys(graphCopy[rootPathVertex])) {
                        delete graphCopy[neighbour][rootPathVertex];
                    }
                    delete graphCopy[rootPathVertex];
                }
            }

            // Spur path is shortest path from spur vertex to destination
            // Find spur path using Djikstra algorithm
            let spurPath = findShortestPathWithTime(graphCopy, spurVertex, sourceCodes, destinationCodes);
            let spurCost = spurPath['cost'];

            // Get full path and add to potential list
            // Full path is made of root path + spur path
            if (spurPath['route'].length != 0) {
                let totalPath = rootPath.concat(spurPath['route'].slice(1));
                let totalCost = getTotalCost(rootCost, spurCost.slice(1));
                let potential = {'route': totalPath, 'cost': totalCost};
                if (!(potentialShortestPath.some(path => JSON.stringify(path['route']) == JSON.stringify(potential['route'])))) {
                    potentialShortestPath.push(potential);
                }
            }
        }

        // Break if no more path found
        if (Object.keys(potentialShortestPath).length == 0) {
            break;
        }

        // Find shortest path from potential list and move to shorter paths list
        shortestPath = findShortestPotentialWithTime(potentialShortestPath);
        shortestPaths.push(potentialShortestPath[shortestPath]);
        potentialShortestPath.splice(shortestPath, 1);
    }
    return shortestPaths;
}
exports.findKShortestPathsWithTime = findKShortestPathsWithTime;

// Find shortest path using Djikstra algorithm for bonus case (with time)
// Note that this function receive list of destinations (in case destination is interchange)
function findShortestPathWithTime(graph, source, sources, destinations) {
    let visited = [];
    let reachable = [];
    let previous = {};
    let distances = {};
    let destination = null;

    // Initialize all distance to infinity
    for (let vertex in graph){
        distances[vertex] = Infinity;
    }

    // Start with source vertex and set source's distance to 0
    distances[source] = 0;
    reachable.push(source);

    while (reachable.length != 0) {
        // Find nearest reachable vertex, remove from reachable list, and add to visited list
        nearest = findNearestVertex(reachable, distances);
        reachable.splice(reachable.indexOf(nearest),1);
        visited.push(nearest);

        // Break if reached one of the destinations and set destination variable
        if (destinations.includes(nearest)) {
            destination = nearest;
            break;
        }

        let nearestName = getNameFromCode(nearest);
        let nearestParentName = getNameFromCode(previous[nearest]);
        
        for (let [neighbour, cost] of Object.entries(graph[nearest])) {
            // Prevent from starting with change line
            if (nearest == source && sources.includes(neighbour)){
                continue;
            }
            // Prevent from change line twice in a row
            let neighbourName = getNameFromCode(neighbour);
            if (neighbourName == nearestName && neighbourName == nearestParentName){
                continue;
            }
            // Add neighbour of nearest to reachable list if not already in visited and reachable
            if (!visited.includes(neighbour) && !reachable.includes(neighbour)) {
                reachable.push(neighbour);
            }
            // Update distance and previous of the neighbour if there is shorter path
            let newDistance = distances[nearest] + cost;
            if (newDistance < distances[neighbour]) {
                distances[neighbour] = newDistance;
                previous[neighbour] = nearest;
            }
        }
    }

    // Get the resulting path and cost by tracing back previous
    let path = [];
    let cost = [];
    if (destination != null) {
        path.unshift(destination);
        cost.unshift(distances[destination]);
        let vertex = destination;
        while (vertex != source) {
            path.unshift(previous[vertex]);
            cost.unshift(distances[previous[vertex]]);
            vertex = previous[vertex];
        }
    }

    return {'route': path, 'cost': cost};
}

// Get total cost given root path's cost and spur path's cost
function getTotalCost(rootCost, spurCost) {
    let totalCost = [];
    let costToSpur = rootCost.slice(-1).pop();

    for (let cost of rootCost) {
        totalCost.push(cost);
    }

    for (let cost of spurCost) {
        totalCost.push(cost + costToSpur);
    }
    
    return totalCost;
}

// Find shortest path from list of potential shortest paths
function findShortestPotentialWithTime(potentialPaths) {
    let shortestIndex = null;
    let shortestCost = null;
    for (let idx = 0; idx < potentialPaths.length; idx++) {
        cost = potentialPaths[idx]['cost'].slice(-1).pop();
        if (shortestIndex == null || cost < shortestCost) {
            shortestIndex = idx;
            shortestCost = cost;
        }
    }
    return shortestIndex;
}

// Get station code from name (e.g Holland Village => CC21)
function getCodesFromName(name, startTime) {
    codes = [];
    substations = stationMap[name];
    for (let substation of substations) {
        codes.push(substation['Line'] + substation['Number']);
    }
    
    return codes;
}

// Get station name from code (e.g CC21 => Holland Village)
function getNameFromCode(code) {
    if (code == undefined) {
        return null;
    }
    let line = code.substring(0,2);
    let number = code.substring(2);
    for (let [station, substations] of Object.entries(stationMap)) {
      for (substation of substations) {
            if (substation['Line'] == line && substation['Number'] == number) {
                return station;
            }
        }
    }
}
exports.getNameFromCode = getNameFromCode;