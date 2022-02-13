"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solarSystem = exports.earthMoonSystem = exports.system = exports.angularDiameter = exports.kmToAU = exports.orbitCoordinates = exports.systemPairs = exports.orbitDistance = exports.planetaryYear = exports.meanAnomaly = exports.unrestrictedTrueAnomaly = exports.trueAnomaly = exports.mass = exports.ab = exports.sun = exports.b = exports.a = exports.moon = exports.earth = exports.nine = exports.giant = exports.starRadius = exports.planetGravity = exports.planetDensity = void 0;
function planetDensity(planet) {
    return planet.mass / (planet.radius * planet.radius * planet.radius);
}
exports.planetDensity = planetDensity;
function planetGravity(planet) {
    return planet.mass / (planet.radius * planet.radius);
}
exports.planetGravity = planetGravity;
function starRadius(star) {
    return (Math.pow((star.mass / 332967.75), 0.74)) * 695508;
}
exports.starRadius = starRadius;
exports.giant = {
    mass: 594.4858,
    radius: 11.444303
};
exports.nine = {
    mass: 594.4858,
    radius: 11.444303
};
exports.earth = {
    mass: 1,
    radius: 6378.137
};
exports.moon = {
    mass: 0.0123032,
    radius: 1738.1
};
exports.a = {
    mass: 404698.375
};
exports.b = {
    mass: 263859.877
};
exports.sun = {
    mass: 332967.75
};
exports.ab = {
    starA: exports.a,
    starB: exports.b,
    a: 0.2731,
    e: 0.4178,
    i: 0,
    Ω: 0,
    ω: 0,
    θ: 0,
};
function mass(input) {
    if ('mass' in input) {
        return input.mass;
    }
    if ('starA' in input) {
        return input.starA.mass + input.starB.mass;
    }
    if ('planetA' in input) {
        return input.planetA.mass + input.planetB.mass;
    }
    return 0;
}
exports.mass = mass;
function trueAnomaly(input, epoch) {
    let mean = meanAnomaly(input, epoch) * (Math.PI / 180);
    let iter = mean;
    for (var i = 0; i < 100; i++) {
        iter = mean + input.orbit.e * Math.sin(iter);
    }
    const out = ((((2 * Math.atan(Math.pow((1 + input.orbit.e) / (1 - input.orbit.e), 1 / 2) * Math.tan(iter / 2))) * (180 / Math.PI)) % 360) + 360) % 360;
    return out * (Math.PI / 180);
}
exports.trueAnomaly = trueAnomaly;
////SUCKS + DOESN'T WORK + BAD
function unrestrictedTrueAnomaly(input, epoch) {
    let mean = meanAnomaly(input, epoch) * (Math.PI / 180);
    let iter = mean;
    let iterNext;
    for (let i = 0; i < 10000; i++) {
        iterNext = mean + input.orbit.e * Math.sin(iter);
        if (Math.abs(iterNext - iter) < 1E-14) {
            break;
        }
        iter = iterNext;
    }
    //console.log(Math.floor(meanAnomaly(input, epoch) / 360));
    //const out = Math.atan2(Math.pow(1 - input.orbit.e * input.orbit.e, .5) * Math.sin(iter), Math.cos(iter) - input.orbit.e);
    //const out = Math.atan2(Math.sqrt((1 - input.orbit.e) / (1 + input.orbit.e)) * Math.sin(iter), Math.cos(iter));
    //const out = 2 * Math.atan2(Math.sqrt(1 + input.orbit.e) * Math.sin(iter / 2), Math.sqrt(1 - input.orbit.e) * Math.cos(iter / 2));
    // const out = 2 * Math.atan(
    //         Math.pow((1 + input.orbit.e) / (1 - input.orbit.e), 1 / 2) * Math.tan(iter / 2)
    //     )
    // return out
    const out = ((2 * Math.atan(Math.pow((1 + input.orbit.e) / (1 - input.orbit.e), 1 / 2) * Math.tan(iter / 2))) * (180 / Math.PI)) + Math.floor(meanAnomaly(input, epoch) / 360) * 360;
    return out * (Math.PI / 180);
}
exports.unrestrictedTrueAnomaly = unrestrictedTrueAnomaly;
function meanAnomaly(input, epoch) {
    return (epoch / planetaryYear(input)) * 360;
}
exports.meanAnomaly = meanAnomaly;
function planetaryYear(input) {
    return Math.sqrt((Math.pow(input.orbit.a, 3)) / ((mass(input.main) / 332967.75)));
}
exports.planetaryYear = planetaryYear;
// sqrt(0.00256955529 ** 3 / (1 / x)) = 0.07480519764
// 0.00256955529 ** 3 / (1 / x) = 0.07480519764 ** 2
// 0.00256955529 ** 3 * x / 1 = 0.07480519764 ** 2
//console.log(((0.07480233042 ** 2) * 1) / (0.00256955529 ** 3));
//console.log(Math.sqrt(0.00256955529 ** 3 / (1 / 333030)));
function orbitDistance(input, epoch) {
    return (input.orbit.a * (1 - input.orbit.e)) / (1 + input.orbit.e * Math.cos(trueAnomaly(input, epoch)));
}
exports.orbitDistance = orbitDistance;
function systemPairs(input) {
    return input.orbits.map((orbit) => {
        return {
            main: input.main,
            orbit: orbit
        };
    });
}
exports.systemPairs = systemPairs;
function orbitCoordinates(inp, epoch) {
    return systemPairs(inp).map((input) => {
        const r = orbitDistance(input, epoch);
        const ν = trueAnomaly(input, epoch);
        const i = input.orbit.i;
        const Ω = input.orbit.Ω;
        const ω = input.orbit.ω;
        //X = r*(np.cos(Om)*np.cos(w+nu) - np.sin(Om)*np.sin(w+nu)*np.cos(i))
        //Y = r*(np.sin(Om)*np.cos(w+nu) + np.cos(Om)*np.sin(w+nu)*np.cos(i))
        //Z = r*(np.sin(i)*np.sin(w+nu))
        const x = r * (Math.cos(Ω) * Math.cos(ω + ν) - Math.sin(Ω) * Math.sin(ω + ν) * Math.cos(i));
        const y = r * (Math.sin(Ω) * Math.cos(ω + ν) + Math.cos(Ω) * Math.sin(ω + ν) * Math.cos(i));
        const z = r * (Math.sin(i) * Math.sin(ω + ν));
        //let x = r * Math.sin(theta) * Math.cos(phi);
        //let y = r * Math.sin(theta) * Math.sin(phi);
        //let z = r * Math.cos(theta);
        const relativeSatellites = orbitCoordinates(input.orbit.body, epoch);
        const satellites = relativeSatellites.map((sat) => {
            return [sat[0] + x, sat[1] + y, sat[2] + z];
        });
        return [[x, y, z], ...satellites];
    }).flat();
}
exports.orbitCoordinates = orbitCoordinates;
function kmToAU(km) {
    return km / 149700598.8024;
}
exports.kmToAU = kmToAU;
function angularDiameter(origin, body, radius) {
    return 2 * Math.atan(kmToAU(radius) / Math.sqrt(Math.pow((body[0] - origin[0]), 2) + Math.pow((body[1] - origin[1]), 2) + Math.pow((body[2] - origin[2]), 2)));
}
exports.angularDiameter = angularDiameter;
exports.system = {
    main: exports.ab,
    orbits: [{
            body: {
                main: exports.giant,
                orbits: [{
                        body: {
                            main: exports.nine,
                            orbits: []
                        },
                        a: 0.00826651492403,
                        e: 0.00074,
                        i: 33.7 * (Math.PI / 180),
                        Ω: 0,
                        ω: 0,
                        θ: 0,
                    }]
            },
            a: 1.1106,
            e: 0.00021,
            i: 58.23 * (Math.PI / 180),
            Ω: 0,
            ω: 0,
            θ: 0,
        }]
};
exports.earthMoonSystem = {
    main: exports.sun,
    orbits: [{
            body: {
                main: exports.earth,
                orbits: [{
                        body: {
                            main: exports.moon,
                            orbits: []
                        },
                        a: 0.00256955529,
                        e: 0.0549,
                        i: 5.145 * (Math.PI / 180),
                        Ω: 0,
                        ω: 0,
                        θ: 0,
                    }]
            },
            a: 1,
            e: 0.0167,
            i: 0,
            Ω: 0,
            ω: 0,
            θ: 0,
        }]
};
// 0.38709927 0.20563593
// 7.00497902
// 252.25032350 77.45779628 48.33076593
exports.solarSystem = {
    main: exports.sun,
    orbits: [{
            body: {
                main: exports.earth,
                orbits: [{
                        body: {
                            main: exports.moon,
                            orbits: []
                        },
                        a: 0.00256955529,
                        e: 0.0549,
                        i: 5.145 * (Math.PI / 180),
                        Ω: 0,
                        ω: 0,
                        θ: 0,
                    }]
            },
            a: 1,
            e: 0.0167,
            i: 0,
            Ω: 100.46457166 * (Math.PI / 180),
            ω: 102.93768193 * (Math.PI / 180),
            θ: 0,
        }]
};
