const stationMap = require('./stationMap');

// Build instructions for the given paths
function buildInstructions(paths) {
    let instructions = [];

    // Iterate list of paths
    for (let path of paths) {
        let route = path['route'];
        let cost = path['cost'];
        let steps = [];
        
        // If length is 1, it means the source is the destination
        if (route.length == 1) {
            steps.push(`You are already at destination`);
        // If length is 0, it means no available route
        } else if (route.length == 0) {
            steps.push('No route found');
        } else {
            let previousLine = null;
            // Iterate through list of stations in the path
            for (let idx = 0; idx < route.length - 1; idx++) {
                let currentLine = getLine(route[idx], route[idx+1], previousLine);
                // Check whether need to change line and add instructions accordingly
                if (previousLine != null && previousLine != currentLine) {
                    steps.push(`Change from ${previousLine} line to ${currentLine} line`);
                    steps.push(`Take ${currentLine} line from ${route[idx]} to ${route[idx+1]}`);
                } else {
                    steps.push(`Take ${currentLine} line from ${route[idx]} to ${route[idx+1]}`);
                }
                previousLine = currentLine;
            }
            steps.push(`You have arrived at destination`);
        }
        instructions.push({'route': route, 'cost': cost, 'steps': steps});
    }
    
    return instructions;
}
exports.buildInstructions = buildInstructions;

// Get the line from source to destination
function getLine(source, destination, previousLine) {
    currentStationLines = []
    nextStationLines = []

    // Get possible lines of source and destination respectively
    for (let substation of stationMap[source]) {
        currentStationLines.push(substation['Line']);
    }
    for (let substation of stationMap[destination]) {
        nextStationLines.push(substation['Line']);
    }

    // Find line intersection between source and destination
    connectedLines = currentStationLines.filter(line => nextStationLines.includes(line));

    // Always choose the same line as previous line if possible
    if (connectedLines.includes(previousLine)) {
        return previousLine;
    } else {
        return connectedLines[0];
    }
}