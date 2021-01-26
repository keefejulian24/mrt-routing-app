const { buildGraph, getStationsFromMap } = require('../services/graphBuilder');
const { buildGraphWithTime } = require('../services/graphBuilderWithTime');
const { findKShortestPaths } = require('../services/pathFinder');
const { findKShortestPathsWithTime } = require('../services/PathFinderWithTime');
const { buildInstructions } = require('../services/instructionBuilder');
const { buildInstructionsWithTime } = require('../services/instructionBuilderWithTime');

// Controller for normal case (without time)
function navigateWithoutTime(req,res) {
    let source = req.query.source;
    let destination = req.query.destination;

    // check if source and destination are valid station name
    let stations = getStationsFromMap();
    if (!(stations.includes(source))) {
        res.send('Source is not a valid station name');
    } else if (!(stations.includes(destination))) {
        res.send('Destination is not a valid station name');
    } else {
        let graph = buildGraph();
        let paths = findKShortestPaths(graph, source, destination);
        let instructions = buildInstructions(paths);
        res.send(instructions);
    }
};
exports.navigateWithoutTime = navigateWithoutTime;

// Controller for bonus case (with time)
function navigateWithTime(req,res) {
    let source = req.query.source;
    let destination = req.query.destination;
    let startTime = new Date(req.query.starttime);

    // check if source and destination are valid station name
    let stations = getStationsFromMap();
    if (!(stations.includes(source))) {
        res.send('Source is not a valid station name');
    } else if (!(stations.includes(destination))) {
        res.send('Destination is not a valid station name');
    // check if start time is a valid date
    } else if (isNaN(startTime)) {
        res.send('Start time is not a valid date');
    } else {
        let graph = buildGraphWithTime(startTime);
        let paths = findKShortestPathsWithTime(graph, source, destination);
        let instructions = buildInstructionsWithTime(paths);
        res.send(instructions);
    }
};
exports.navigateWithTime = navigateWithTime;

// Controller to get stations list for client
function getStations(req,res) {
    let stations = getStationsFromMap();
    res.send(stations);
};
exports.getStations = getStations;