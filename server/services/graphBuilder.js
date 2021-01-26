const stationMap = require('./stationMap');

// Build graph for normal case (without time)
// Each vertex in the graph represent a station name (interchange is combined into 1 vertex)
// Edges don't have weight since travel time is the same for all
function buildGraph() {
    // Get list of mrt line and initialize empty graph
    let lines = getLines();
    let graph = {};

    // Iterate each station
    for (let [station, substations] of Object.entries(stationMap)) {
        // If station not in graph, initialize vertex
        if (!(station in graph)) {
            graph[station] = [];
        }
        // Iterate each substation
        // 1 station can have many substations (e.g. Buona Vista has 2 substasions: EW21 and CC22)
        for (let substation of substations) {
            // Get substation line and number
            let substationLine = substation['Line'];
            let substationNumber = substation['Number'];
            // Get the station list of the current substation line
            let line = lines[substationLine];
            // Find index of current station within the line
            let idx = line.indexOf(substationNumber);
            // Add station before and after the current station into the adjacency list
            if (idx != 0) {
                let prevStationName = getStationNameByCode(substationLine, line[idx-1]);
                // Check whether previous station not already in the adjacency list
                if (!graph[station].includes(prevStationName)) {
                    graph[station].push(prevStationName);
                }
            }
            if (idx != line.length - 1) {
                let nextStationName = getStationNameByCode(substationLine, line[idx+1]);
                // Check whether next station not already in the adjacency list
                if (!graph[station].includes(nextStationName)) {
                    graph[station].push(nextStationName);
                }
            }
        }
    }
    return graph;
}
exports.buildGraph = buildGraph;

// Get list of station names from json
function getStationsFromMap() {
    return Object.keys(stationMap);
}
exports.getStationsFromMap = getStationsFromMap;

// Get list of MRT lines (e.g. NS: [1, 2, ... , 28])
function getLines() {
    var lines = {};

    for (const substations of Object.values(stationMap)) {
        for (const substation of substations) {
            if (!(substation['Line'] in lines)) {
                lines[substation['Line']] = [];
            }
            lines[substation['Line']].push(substation['Number']);
        }
    }

    for (const line in lines) {
        lines[line].sort((a, b) => a-b);
    }
    return lines;
}
exports.getLines = getLines;

// Get station name from line and number (e.g. Line: CC, Number: 21 => Holland Village)
function getStationNameByCode(line, number) {
    for (let [station, substations] of Object.entries(stationMap)) {
        for (substation of substations) {
            if (substation['Line'] == line && substation['Number'] == number) {
                return station;
            }
        }
    }
}