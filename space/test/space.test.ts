// import * as space from '../space';
/// <reference path="../space.d.ts" />
const space = require('../space');

describe('Orbital Equations', () => {

    // for (let i = 0; i < 100; i++) {
    //     console.log(space.systemPairs(space.system).map((input) => { return space.trueAnomaly(input, i / 100); })[0]);
    //     //console.log(systemPairs(system).map((input) => { return orbitDistance(input, i / 100); })[0]);
    // }
    // console.log(space.systemPairs(space.systemPairs(space.earthMoonSystem)[0].orbit.body)[0]);
    // console.log(space.planetaryYear(space.systemPairs(space.systemPairs(earthMoonSystem)[0].orbit.body)[0]));
    // console.log(space.planetaryYear(space.systemPairs(space.earthMoonSystem)[0]));

    const sunEarth = space.systemPairs(space.earthMoonSystem)[0];
    const earthMoon = space.systemPairs(space.earthMoonSystem.orbits[0].body)[0];

    it('has the correct orbital period for the sun', () => {
        let orbits = 0;
        for (let i = 0; i < 10; i++)
            expect(space.unrestrictedTrueAnomaly(sunEarth, i)).toBe(Math.PI * 2 * i);
    });

    it('has the correct orbital period for the moon', () => {
        expect(space.unrestrictedTrueAnomaly(sunEarth, 1)).toBe(Math.PI * 2);
        //expect(space.unrestrictedTrueAnomaly(earthMoon, 1 / 365.256363004)).toBe(Math.PI * 2 / 27.32);
        expect(Math.floor((space.unrestrictedTrueAnomaly(earthMoon, 1) / (Math.PI * 2)) * 10) / 10).toBe(13.3);
    });

    it('calculates the correct angular diameter of the sun and moon', () => {
        let epoch = 1;//.856;
        //console.log(space.starRadius(space.earthMoonSystem.main), space.orbitDistance(sunEarth, 1));
        expect(Math.floor(space.angularDiameter(space.orbitCoordinates(space.earthMoonSystem, 0)[0], [0, 0, 0], space.starRadius(sunEarth.main)) * ((60 * 180) / Math.PI))).toBe(33);
        expect(Math.floor(space.angularDiameter(space.orbitCoordinates(space.earthMoonSystem, epoch)[0], space.orbitCoordinates(space.earthMoonSystem, epoch)[1], space.earthMoonSystem.orbits[0].body.orbits[0].body.main.radius) * ((60 * 180) / Math.PI))).toBe(32);
    });



});
