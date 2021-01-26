const { getNameFromCode } = require("./pathFinderWithTime");

// Build instructions for the given paths
function buildInstructionsWithTime(paths) {
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
            // Iterate through list of stations in the path
            for (let idx = 0; idx < route.length - 1; idx++) {
                let currentLine = route[idx].substring(0,2);
                let currentName = getNameFromCode(route[idx]);
                let nextLine = route[idx+1].substring(0,2);
                let nextName = getNameFromCode(route[idx+1]);
                // Check whether need to change line and add instructions accordingly
                if (nextLine != currentLine) {
                    steps.push(`Change from ${currentLine} line to ${nextLine} line`);
                } else {
                    steps.push(`Take ${currentLine} line from ${currentName} to ${nextName}`);
                }
            }
            steps.push(`You have arrived at destination`);
        }
        instructions.push({'route': route, 'cost': cost.length > 0 ? cost[cost.length - 1] : -1, 'steps': steps});
    }
    
    return instructions;
}
exports.buildInstructionsWithTime = buildInstructionsWithTime;