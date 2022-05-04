"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solarSystem = exports.earthMoonSystem = exports.ssystem = exports.angularDiameter = exports.kmToAU = exports.orbitCoordinates = exports.systemPairs = exports.orbitDistance = exports.planetaryYear = exports.meanAnomaly = exports.unrestrictedTrueAnomaly = exports.trueAnomaly = exports.mass = exports.ab = exports.orbitToSystemOrbit = exports.EasyOrbit = exports.System = exports.testOrbit = exports.Orbit = exports.sun = exports.b = exports.a = exports.moon = exports.earth = exports.nine = exports.giant = exports.BinaryPlanet = exports.BinaryStar = exports.Star = exports.astronomicalUnits = exports.solarMasses = exports.earthMasses = exports.Planet = void 0;
const safe_units_1 = require("safe-units");
/**
 * Constructor for IPlanet
 *
 * @param {string} name Planet's name
 * @param {Mass} mass Planetary mass
 * @param {Length} radius Planetary radius
 * @returns {IPlanet} IPlanet
 */
exports.Planet = (name, mass, radius) => {
    return {
        name: () => name,
        mass: () => mass,
        radius: () => radius,
        density: () => mass.over(radius.cubed()),
    };
};
exports.earthMasses = safe_units_1.Measure.of(5.9722e+24, safe_units_1.kilograms, 'M🜨');
exports.solarMasses = safe_units_1.Measure.of(332967.75, exports.earthMasses, 'M☉');
exports.astronomicalUnits = safe_units_1.Measure.of(149597870691, safe_units_1.meters, 'AU');
/**
 * Constructor for IStar
 *
 * @param {string} name Star's name
 * @param {Mass} mass Stellar mass
 * @returns {IStar} IStar
 */
exports.Star = (name, mass) => {
    return {
        name: () => name,
        mass: () => mass,
        radius: () => safe_units_1.Measure.of((Math.pow(Number(mass.in(exports.solarMasses).slice(0, -2)), 0.74)) * 695508, safe_units_1.kilo(safe_units_1.meters))
        //density: () => m.over(r.cubed()),
    };
};
/**
 * Constructor for IBinaryStar
 *
 * @param {IOrbit} orbit Orbit
 * @returns {IBinaryStar} IBinaryStar
 */
exports.BinaryStar = (orbit) => {
    return {
        orbit: () => orbit,
        a: orbit.main,
        b: orbit.satellite,
        mass: () => orbit.main().mass().plus(orbit.satellite().mass()),
    };
};
/**
 * Constructor for IBinaryPlanet
 *
 * @param {IOrbit} orbit Orbit
 * @returns {IBinaryPlanet} IBinaryPlanet
 */
exports.BinaryPlanet = (orbit) => {
    return {
        orbit: () => orbit,
        a: orbit.main,
        b: orbit.satellite,
        mass: () => orbit.main().mass().plus(orbit.satellite().mass()),
    };
};
// export function starRadius(star: Star): Radius {// * 695508
//     return ((star.mass / 332967.75) ** 0.74) * 695508;
// }
exports.giant = exports.Planet('giant', safe_units_1.Measure.of(594.4858, exports.earthMasses), safe_units_1.Measure.of(11.444303, safe_units_1.kilo(safe_units_1.meters))); // Kilometers are broken?
exports.nine = exports.Planet('nine', safe_units_1.Measure.of(594.4858, exports.earthMasses), safe_units_1.Measure.of(11.444303, safe_units_1.kilo(safe_units_1.meters))); // NOT REAL
exports.earth = exports.Planet('earth', safe_units_1.Measure.of(1, exports.earthMasses), safe_units_1.Measure.of(6371.000, safe_units_1.kilo(safe_units_1.meters)));
exports.moon = exports.Planet('moon', safe_units_1.Measure.of(0.0123032, exports.earthMasses), safe_units_1.Measure.of(1738.1, safe_units_1.kilo(safe_units_1.meters)));
exports.a = exports.Star('a', safe_units_1.Measure.of(404698.375, exports.earthMasses));
exports.b = exports.Star('b', safe_units_1.Measure.of(263859.877, exports.earthMasses));
exports.sun = exports.Star('sun', safe_units_1.Measure.of(332967.75, exports.earthMasses));
exports.Orbit = (main, orbit, a, e, i, Ω, ω, θ) => {
    return {
        main: () => main,
        satellite: () => orbit,
        a: () => a,
        e: () => e,
        i: () => i,
        Ω: () => Ω,
        ω: () => ω,
        θ: () => θ,
        orbitalPeriod: () => safe_units_1.Measure.sqrt(a.cubed().div(main.mass().plus(orbit.mass())
            .times(safe_units_1.Measure.of(6.6743015e-11, safe_units_1.meters.cubed()
            .times(safe_units_1.kilograms.inverse())
            .times(safe_units_1.seconds.squared().inverse()))))).scale(2 * Math.PI),
        orbitalElements: () => {
            return {
                a: () => a,
                e: () => e,
                i: () => i,
                Ω: () => Ω,
                ω: () => ω,
                θ: () => θ,
            };
        }
    };
};
exports.testOrbit = exports.Orbit(exports.sun, exports.earth, safe_units_1.Measure.of(1, exports.astronomicalUnits), safe_units_1.Measure.dimensionless(0.0167), safe_units_1.Measure.of(0, safe_units_1.degrees), safe_units_1.Measure.of(100.46457166, safe_units_1.degrees), safe_units_1.Measure.of(102.93768193, safe_units_1.degrees), safe_units_1.Measure.of(0, safe_units_1.degrees));
exports.System = (orbits, inputSystem) => {
    if (orbits.length === 0) {
        return inputSystem;
    }
    if (inputSystem === undefined) {
        return exports.System(orbits.slice(1), {
            center: () => orbits[0].main(),
            orbits: () => [
                Object.assign({ center: () => orbits[0].satellite(), orbits: () => [] }, orbits[0].orbitalElements())
            ]
        });
    }
    const orbit = orbits[0];
    if (inputSystem.center().name() === orbit.satellite().name()) {
        return exports.System(orbits.slice(1), {
            center: orbit.satellite,
            orbits: () => [Object.assign(Object.assign({}, orbit.orbitalElements()), inputSystem)]
        });
    }
    let body = orbit.main();
    let queue = [];
    while (true) {
        if (inputSystem.center().name() === body.name()) {
            return exports.System(orbits.slice(1), {
                center: inputSystem.center,
                orbits: () => inputSystem.orbits().concat(Object.assign({}, exports.orbitToSystemOrbit(orbit)))
            });
        }
    }
};
exports.EasyOrbit = (main, orbit, a, e, i, Ω, ω, θ) => {
    return exports.Orbit(main, orbit, safe_units_1.Measure.of(a, exports.astronomicalUnits), safe_units_1.Measure.dimensionless(e), safe_units_1.Measure.of(i, safe_units_1.degrees), safe_units_1.Measure.of(Ω, safe_units_1.degrees), safe_units_1.Measure.of(ω, safe_units_1.degrees), safe_units_1.Measure.of(θ, safe_units_1.degrees));
};
exports.orbitToSystemOrbit = (orbit) => {
    return Object.assign({ center: orbit.satellite, orbits: () => [] }, orbit.orbitalElements());
};
// const searchForOrbit = (inputSystem: ISystem, orbit: IOrbit) => {
//     if (inputSystem.body().name() === orbit.main().name()) {
//         return System(orbits.slice(1), {
//             center: inputSystem.center,
//             orbits: () => inputSystem.orbits().concat({
//                 ...orbitToSystemOrbit(orbit),
//             })
//         });
//     }
// };
//console.log(sun.radius().in(kilo(meters)));
//console.log(testOrbit.orbitalPeriod().in(u.days));
// const testSystem = System(
//     sun,
//     [[earth, testOrbit.orbitalElements()]],
//     {
//         "sun": [
//             {
//                 "earth": ["moon"]
//             }
//         ]
//     }
// );\
exports.ab = exports.BinaryStar(exports.EasyOrbit(exports.a, exports.b, 0.2731 /* Not Real */, 0.4178, 0, 0, 0, 0));
console.log(exports.ab.a().name());
// export type System = {
//     main: Star | Planet | BinaryStar | BinaryPlanet;
//     orbits: Orbit[];
// };7
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
exports.ssystem = {
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
