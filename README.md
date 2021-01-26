# Problem
Build a routing service to help users find routes from any station to any other station on MRT future network ordered by some efficiency heuristics.\
Bonus: The routing service should take into account travel times which are changing dependent on the time of day.

# Assumptions
## Basic case
- Route suggestions are based on number of stations (station name) travelled.
- Interchange is considered as 1 station, thus changing lines does not incur additional cost.
- Route suggestions will be in station names format since changing lines does not add additional cost.
- A station can only be visited one time.
- Route cannot start with change line.
- Changing line twice in a row is not allowed. Example: NS24 => NE6 => CC1 (All are Dhoby Ghaut).
- Up to 5 route suggestions are returned.

## Bonus case
- Route suggestions are based on total travel time needed.
- Route suggestions will be in station codes format since changing lines will add additional cost.
- Travel time between stations are determined based on start time. Travel time cannot change in the middle of travel.
- Stations that are not open yet (relative to the start time) are not considered in route generation.
- A station can be visited more than once as long as different line.
- Route cannot start with change line.
- Changing line twice in a row is not allowed. Example: NS24 => NE6 => CC1 (All are Dhoby Ghaut).
- Up to 5 route suggestions are returned.

# System Requirements
The system requires npm and Node.js installed.

# Server

## How to run
1. Clone the project using `git clone https://github.com/keefejulian24/mrt-routing-app`.
2. Go to the project folder.
3. Run `npm install` to install dependencies.
4. Run `npm run test` to run test cases.
5. Run `npm run server` to start the server. The app will run on port 5000.

## API
### GET /navigation
Get route suggestions from source to destination without time consideration.
#### Request
Accept 2 query strings:
- `source`: Station name (String)
- `destination`: Station name (String)

Request Example: `http://localhost:5000/navigation?source=Cashew&destination=Hillview`.
#### Response
Response is an array of objects containing 3 items:
- `route`: Station names from source to destination (Array of strings)
- `cost`: Number of stations travelled (Integer)
- `steps`: Instructions to be followed (Array of strings)

Response example: `[{"route":["Cashew","Hillview"],"cost":1,"steps":["Take DT line from Cashew to Hillview","You have arrived at destination"]}]`.

### GET /navigationWithTime
Get route suggestions from source to destination with time consideration. (Bonus Problem)
#### Request
Accepts 3 query strings:
- `source`: Station name (String)
- `destination`: Station name (String)
- `starttime`: Starting time in "YYYY-MM-DDThh:mm" format (String)

Request Example: `http://localhost:5000/navigationWithTime?source=Cashew&destination=Hillview&starttime=2021-01-01T08:00`.
#### Response
Response is an array of objects containing 3 items:
- `route`: Station codes from source to destination (Array of strings)
- `cost`: Total travel time in minutes (Integer)
- `steps`: Instructions to be followed (Array of strings)

Response example: `[{"route":["DT2","DT3"],"cost":10,"steps":["Take DT line from Cashew to Hillview","You have arrived at destination"]}]`.\
In case of no available routes, response will be like this: `[{"route":[],"cost":-1,"steps":["No route found"]}]`.

# Client
Due to time limitation, only UI for basic case (without time consideration) is implemented.

## How to run
1. Go to the project folder.
2. Run `cd client`.
3. Run `npm install` to install dependencies.
4. Run `npm start` to start the client. The app will run on port 3000.
5. Go to `http:\\localhost:3000` to test.