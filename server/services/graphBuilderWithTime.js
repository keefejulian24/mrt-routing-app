const stationMap = require('./stationMap');
const { getLines } = require("./graphBuilder");

const nightNotOperating = ['DT', 'CG', 'CE'];

const travelCost = {
    'Peak': {'NS': 12, 'EW':10, 'CG':10, 'NE':12, 'CC':10, 'CE':10, 'DT':10, 'TE':10},
    'Night': {'NS': 10, 'EW':10, 'CG':Infinity, 'NE':10, 'CC':10, 'CE':Infinity, 'DT':Infinity, 'TE':8},
    'NonPeak': {'NS': 10, 'EW':10, 'CG':10, 'NE':10, 'CC':10, 'CE':10, 'DT':8, 'TE':8},
};

const changeCost = {
    'Peak': 15,
    'Night': 10,
    'NonPeak': 10,
};

// Build graph for bonus case (with time)
// Each vertex in the graph represent a station code (interchange is split into multiple vertex since changing line will incur cost)
// Edges have weight according to the time cost
function buildGraphWithTime(startTime) {
    // Get list of mrt line and initialize empty graph
    let lines = getLines();
    let graph = {};

    // Iterate each station
    for (let [station, substations] of Object.entries(stationMap)) {
        // Iterate each substation
        // 1 station can have many substations (e.g. Buona Vista has 2 substasions: EW21 and CC22)
        for (let substation of substations) {
            // Get substation code and open date
            substationLine = substation['Line'];
            substationNumber = substation['Number'];
            substationCode = substationLine + substationNumber;
            substationOpenDate = new Date(substation['Open']);

            // Get time category
            timeCategory = getTimeCategory(startTime);
            // Skip DT, CG, CE line if night time
            if (timeCategory == 'Night' && nightNotOperating.includes(substationLine)) {
                continue;
            }

            // Check if station already opened
            if (startTime > substationOpenDate) {
                // Initialize vertex
                graph[substationCode] = {};
                // Get the station list of the current substation line
                let line = lines[substationLine];
                // Find index of current station within the line
                let idx = line.indexOf(substationNumber);

                // Add station before and after the current station in the same line into the adjacency list
                if (idx != 0) {
                    let prevStationCode = substationLine + line[idx-1];
                    let prevStationOpenDate = new Date(getOpenDateByCode(substationLine, line[idx-1]));
                    // Check whether previous station already opened, operating, and not in the adjacency list
                    if (startTime >= prevStationOpenDate && !(timeCategory == 'Night' && nightNotOperating.includes(substationLine)) && !(prevStationCode in graph[substationCode])) {
                        let travelTime = getTravelTime(substationCode,prevStationCode,timeCategory);
                        graph[substationCode][prevStationCode] = travelTime;
                    }
                }
                if (idx != line.length - 1) {
                    let nextStationCode = substationLine + line[idx+1];
                    let nextStationOpenDate = new Date(getOpenDateByCode(substationLine, line[idx+1]));
                    // Check whether next station already opened, operating, and not in the adjacency list
                    if (startTime >= nextStationOpenDate && !(timeCategory == 'Night' && nightNotOperating.includes(substationLine)) && !(nextStationCode in graph[substationCode])) {
                        let travelTime = getTravelTime(substationCode,nextStationCode,timeCategory);
                        graph[substationCode][nextStationCode] = travelTime;
                    }
                }

                // Add interchange to adjacency list
                for (let interchange of stationMap[station]) {
                    interchangeLine = interchange['Line'];
                    interchangeNumber = interchange['Number'];
                    interchangeCode = interchangeLine + interchangeNumber;
                    interchangeOpenDate = new Date(interchange['Open']);

                    // Check if it is the current substation
                    if (interchangeCode == substationCode) {
                        continue;
                    // Check if interchange already opened and operating
                    } else if (startTime >= interchangeOpenDate && !(timeCategory == 'Night' && nightNotOperating.includes(interchangeLine))) {
                        let travelTime = getTravelTime(substationCode,interchangeCode,timeCategory);
                        graph[substationCode][interchangeCode] = travelTime;
                    }
                }
            }
        }
    }

    return graph;
}
exports.buildGraphWithTime = buildGraphWithTime;

// Get time category from start time (Peak / Night / Non Peak)
function getTimeCategory(startTime) {
    let day = startTime.getDay();
    let hour = startTime.getHours();

    if (day >= 1 && day <= 5 && ((hour >= 6 && hour < 9) || (hour >= 18 && hour < 21))) {
        return "Peak"
    } else if (hour >= 22 || (hour >= 0 && hour < 6)) {
        return "Night"
    } else {
        return "NonPeak"
    }
}
exports.getTimeCategory = getTimeCategory;

// Get station opening date from line and number (e.g. Line: CC, Number: 21 => '2011-10-08')
function getOpenDateByCode(line, number) {
    for (let substations of Object.values(stationMap)) {
        for (substation of substations) {
            if (substation['Line'] == line && substation['Number'] == number) {
                return substation['Open'];
            }
        }
    }
}

// Get travel time between source and destination
function getTravelTime(source, destination, timeCategory) {
    let sourceLine = source.substring(0,2);
    let destinationLine = destination.substring(0,2);
    if (sourceLine != destinationLine) {
        return changeCost[timeCategory];
    } else {
        return travelCost[timeCategory][sourceLine];
    }
}