const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
const app = require('../server');
const should = chai.should();
const expect = chai.expect;

// Get mock responses for testing
const normalRoutesMock = require('./mocks/normalRoutes.json');
const normalSameSourceAndDestMock = require('./mocks/normalSameSourceAndDest.json');
const bonusRoutesMock = require('./mocks/bonusRoutes.json');
const bonusSameSourceAndDestMock = require('./mocks/bonusSameSourceAndDest.json');
const bonusRouteNotFoundMock = require('./mocks/bonusRouteNotFound.json');

describe("Navigations", () => {
    // Test API for normal case (without time)
    describe("GET /navigation", () => {
        // Test to get route suggestions
        it("should return a list of route suggestions", (done) => {
            chai.request(app)
                .get('/navigation?source=Stevens&destination=Orchard')
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.deep.equal(normalRoutesMock);
                    done();
                });
         });
        // Test when source is same as destination for normal case
        it("should handle when source is same as destination", (done) => {
            chai.request(app)
                .get('/navigation?source=Dover&destination=Dover')
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.deep.equal(normalSameSourceAndDestMock);
                    done();
                });
        });
    });

    // Test API for bonus case (with time)
    describe("GET /navigationWithTime", () => {
        // Test to get route suggestions
        it("should return a list of route suggestions", (done) => {
            const id = 1;
            chai.request(app)
                .get(`/navigationWithTime?source=Stevens&destination=Orchard&starttime=2021-01-01T08:00`)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.deep.equal(bonusRoutesMock);
                    done();
                });
        });
        // Test when source is same as destination
        it("should handle when source is same as destination", (done) => {
            const id = 1;
            chai.request(app)
                .get(`/navigationWithTime?source=Dover&destination=Dover&starttime=2021-01-01T08:00`)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.deep.equal(bonusSameSourceAndDestMock);
                    done();
                });
        });
        // Test when there is no routes available
        it("should handle when there is no route available", (done) => {
            const id = 1;
            chai.request(app)
                .get(`/navigationWithTime?source=Dover&destination=Havelock&starttime=2021-01-01T08:00`)
                .end((err, res) => {
                    res.should.have.status(200);
                    expect(res.body).to.deep.equal(bonusRouteNotFoundMock);
                    done();
                });
        });
    });
});