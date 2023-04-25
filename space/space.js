"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.solarSystemL = exports.ssystem = exports.angularDiameter = exports.kmToAU = exports.orbitCoordinates = exports.systemPairs = exports.orbitDistance = exports.planetaryYear = exports.meanAnomaly = exports.unrestrictedTrueAnomaly = exports.trueAnomaly = exports.ab = exports.solarSystem = exports.orbitToSystemOrbit = exports.APPOrbit = exports.SimpleOrbit = exports.System = exports.NestedSystem = exports.testOrbit = exports.Orbit = exports.sun = exports.b = exports.a = exports.eris = exports.makemake = exports.haumea = exports.pluto = exports.ceres = exports.neptune = exports.uranus = exports.saturn = exports.jupiter = exports.mars = exports.venus = exports.mercury = exports.moon = exports.earth = exports.nine = exports.giant = exports.starRadius = exports.BinaryPlanet = exports.BinaryStar = exports.Star = exports.ConstructedStar = exports.gleems = exports.blops = exports.riddigs = exports.chirks = exports.fuggles = exports.hippers = exports.zookas = exports.wenzels = exports.centuries = exports.gcm3 = exports.astronomicalUnits = exports.solarRadiuses = exports.solarMasses = exports.earthRadiuses = exports.earthMasses = exports.Planet = exports.G = void 0;
const safe_units_1 = require("safe-units");
const titleCase = (t) => t.split(' ').map((x) => x[0].toUpperCase() + x.substring(1)).join(' ');
const rounder = (accuracy) => {
    return {
        formatValue: (x) => x >= 1 || x <= -1 || x === 0 ? (Math.round((x + Number.EPSILON) * Math.pow(10, accuracy !== null && accuracy !== void 0 ? accuracy : 4)) / Math.pow(10, accuracy !== null && accuracy !== void 0 ? accuracy : 4)).toString() : x.toPrecision(accuracy !== null && accuracy !== void 0 ? accuracy : 4),
    };
};
// const unitless = {
//     formatValue: (value: number) => value.toString(),
//     formatUnit: (unit: UnitWithSymbols) => ''
// };
// const sin = wrapUnaryFn(Math.sin);
// const cos = wrapUnaryFn(Math.cos);
// const tan = wrapUnaryFn(Math.tan);
// const atan = wrapUnaryFn(Math.atan);
const angleRound360 = ((x) => safe_units_1.Measure.of((((Number(x.in(safe_units_1.degrees.withSymbol(''))) % 360) + 360) % 360), safe_units_1.degrees));
console.log(safe_units_1.Measure.of(55, safe_units_1.degrees).in(safe_units_1.degrees.withSymbol('')));
exports.G = safe_units_1.Measure.of(6.6743015e-11, safe_units_1.meters.cubed()
    .times(safe_units_1.kilograms.inverse())
    .times(safe_units_1.seconds.squared().inverse()));
function objectMap(object, fn) {
    return Object.fromEntries(Object.entries(object).map(fn));
}
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
        toString: () => markdownTable([
            ['Name', titleCase(name)],
            ['Mass', mass.in(exports.earthMasses, rounder())],
            ['Radius', radius.in(exports.earthRadiuses, rounder())],
            ['Density', mass.over(radius.cubed()).in(exports.gcm3, rounder())]
        ])
    };
};
exports.earthMasses = safe_units_1.Measure.of(5.9722e+24, safe_units_1.kilograms, 'M🜨');
exports.earthRadiuses = safe_units_1.Measure.of(6371.000, safe_units_1.kilo(safe_units_1.meters), 'R🜨');
exports.solarMasses = safe_units_1.Measure.of(332967.75, exports.earthMasses, 'M☉');
exports.solarRadiuses = safe_units_1.Measure.of(695700, safe_units_1.kilo(safe_units_1.meters), 'R☉');
exports.astronomicalUnits = safe_units_1.Measure.of(149597870691, safe_units_1.meters, 'AU');
exports.gcm3 = safe_units_1.grams.div(safe_units_1.centi(safe_units_1.meters).cubed());
exports.centuries = safe_units_1.Measure.of(3155760000, safe_units_1.seconds, 'Cy');
exports.wenzels = safe_units_1.Measure.of(1.3341, safe_units_1.meters, 'wenzels');
exports.zookas = safe_units_1.Measure.of(7, exports.wenzels, 'zookas');
exports.hippers = safe_units_1.Measure.of(0.48, exports.zookas, 'hippers');
exports.fuggles = safe_units_1.Measure.of(5.2, exports.hippers, 'fuggles');
exports.chirks = safe_units_1.Measure.of(9, exports.fuggles, 'chirks');
exports.riddigs = safe_units_1.Measure.of(42, exports.chirks, 'riddigs');
exports.blops = safe_units_1.Measure.of(34, exports.riddigs, 'blops');
exports.gleems = safe_units_1.Measure.of(27, exports.blops, 'gleems');
/**
 * Constructor for IStar
 *
 * @param {string} name Star's name
 * @param {Mass} mass Stellar mass
 * @returns {IStar} IStar
 */
exports.ConstructedStar = (name, mass) => {
    return {
        name: () => name,
        mass: () => mass,
        radius: () => safe_units_1.Measure.of((Math.pow(Number(mass.in(exports.solarMasses.withSymbol(''))), 0.74)) * 695508, safe_units_1.kilo(safe_units_1.meters)),
        density: () => mass.over(safe_units_1.Measure.of((Math.pow(Number(mass.in(exports.solarMasses.withSymbol(''))), 0.74)) * 695508, safe_units_1.kilo(safe_units_1.meters)).cubed()),
        toString: () => markdownTable([
            ['Name', titleCase(name)],
            ['Mass', mass.in(exports.solarMasses, rounder())],
            ['Radius', safe_units_1.Measure.of((Math.pow(Number(mass.in(exports.solarMasses.withSymbol(''))), 0.74)) * 695508, safe_units_1.kilo(safe_units_1.meters)).in(exports.solarRadiuses, rounder())],
            ['Density', mass.over(safe_units_1.Measure.of((Math.pow(Number(mass.in(exports.solarMasses.withSymbol(''))), 0.74)) * 695508, safe_units_1.kilo(safe_units_1.meters)).cubed()).in(exports.gcm3, rounder())]
        ])
    };
};
/**
 * Constructor for IStar
 *
 * @param {string} name Star's name
 * @param {Mass} mass Stellar mass
 * @param {Length} radius Stellar radius
 * @returns {IStar} IStar
 */
exports.Star = (name, mass, radius) => {
    return {
        name: () => name,
        mass: () => mass,
        radius: () => radius,
        density: () => mass.over(radius.cubed()),
        toString: () => markdownTable([
            ['Name', titleCase(name)],
            ['Mass', mass.in(exports.solarMasses, rounder())],
            ['Radius', radius.in(exports.solarRadiuses, rounder())],
            ['Density', mass.over(radius.cubed()).in(exports.gcm3, rounder())]
        ])
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
        name: () => orbit.main().name() + ' + ' + orbit.satellite().name(),
        toString: () => markdownTable([
            ['Name', titleCase(orbit.main().name()), titleCase(orbit.satellite().name())],
            ['Mass', orbit.main().mass().in(exports.solarMasses, rounder()), orbit.satellite().mass().in(exports.solarMasses, rounder())],
            ['Radius', orbit.main().radius().in(exports.solarRadiuses, rounder()), orbit.satellite().radius().in(exports.solarRadiuses, rounder())],
            ['Density', orbit.main().density().toString(rounder()), orbit.satellite().density().in(exports.gcm3, rounder())],
        ])
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
        name: () => orbit.main().name() + ' + ' + orbit.satellite().name(),
        toString: () => markdownTable([
            ['Name', titleCase(orbit.main().name()), titleCase(orbit.satellite().name())],
            ['Mass', orbit.main().mass().in(exports.earthMasses, rounder()), orbit.satellite().mass().in(exports.earthMasses, rounder())],
            ['Radius', orbit.main().radius().in(exports.earthRadiuses, rounder()), orbit.satellite().radius().in(exports.earthRadiuses, rounder())],
            ['Density', orbit.main().density().toString(rounder()), orbit.satellite().density().toString(rounder())],
        ])
    };
};
// TODO: Check for validity
function starRadius(star) {
    return safe_units_1.Measure.of((Math.pow((Number(star.in(exports.solarMasses.withSymbol(''))) / 332967.75), 0.74)) * 695508, safe_units_1.meters);
}
exports.starRadius = starRadius;
exports.giant = exports.Planet('giant', safe_units_1.Measure.of(594.4858, exports.earthMasses), safe_units_1.Measure.of(11.444303, safe_units_1.kilo(safe_units_1.meters))); // Kilometers are broken?
exports.nine = exports.Planet('nine', safe_units_1.Measure.of(594.4858, exports.earthMasses), safe_units_1.Measure.of(11.444303, safe_units_1.kilo(safe_units_1.meters))); // NOT REAL
exports.earth = exports.Planet('earth', safe_units_1.Measure.of(1, exports.earthMasses), safe_units_1.Measure.of(6371.000, safe_units_1.kilo(safe_units_1.meters)));
exports.moon = exports.Planet('moon', safe_units_1.Measure.of(0.0123032, exports.earthMasses), safe_units_1.Measure.of(1738.1, safe_units_1.kilo(safe_units_1.meters)));
exports.mercury = exports.Planet('mercury', safe_units_1.Measure.of(0.05527, exports.earthMasses), safe_units_1.Measure.of(2439.7, safe_units_1.kilo(safe_units_1.meters)));
exports.venus = exports.Planet('venus', safe_units_1.Measure.of(0.81500, exports.earthMasses), safe_units_1.Measure.of(6051.8, safe_units_1.kilo(safe_units_1.meters)));
exports.mars = exports.Planet('mars', safe_units_1.Measure.of(0.10745, exports.earthMasses), safe_units_1.Measure.of(3389.5, safe_units_1.kilo(safe_units_1.meters)));
exports.jupiter = exports.Planet('jupiter', safe_units_1.Measure.of(317.83, exports.earthMasses), safe_units_1.Measure.of(69911, safe_units_1.kilo(safe_units_1.meters)));
exports.saturn = exports.Planet('saturn', safe_units_1.Measure.of(95.159, exports.earthMasses), safe_units_1.Measure.of(58232, safe_units_1.kilo(safe_units_1.meters)));
exports.uranus = exports.Planet('uranus', safe_units_1.Measure.of(14.536, exports.earthMasses), safe_units_1.Measure.of(25362, safe_units_1.kilo(safe_units_1.meters)));
exports.neptune = exports.Planet('neptune', safe_units_1.Measure.of(17.204, exports.earthMasses), safe_units_1.Measure.of(24622, safe_units_1.kilo(safe_units_1.meters)));
exports.ceres = exports.Planet('ceres', safe_units_1.Measure.of(0.00016, exports.earthMasses), safe_units_1.Measure.of(469.73, safe_units_1.kilo(safe_units_1.meters)));
exports.pluto = exports.Planet('pluto', safe_units_1.Measure.of(0.00220, exports.earthMasses), safe_units_1.Measure.of(1188.3, safe_units_1.kilo(safe_units_1.meters)));
exports.haumea = exports.Planet('haumea', safe_units_1.Measure.of(0.00070, exports.earthMasses), safe_units_1.Measure.of(780, safe_units_1.kilo(safe_units_1.meters)));
exports.makemake = exports.Planet('makemake', safe_units_1.Measure.of(0.0007, exports.earthMasses), safe_units_1.Measure.of(715, safe_units_1.kilo(safe_units_1.meters)));
exports.eris = exports.Planet('eris', safe_units_1.Measure.of(0.00278, exports.earthMasses), safe_units_1.Measure.of(1163, safe_units_1.kilo(safe_units_1.meters)));
exports.a = exports.ConstructedStar('a', safe_units_1.Measure.of(404698.375, exports.earthMasses));
exports.b = exports.ConstructedStar('b', safe_units_1.Measure.of(263859.877, exports.earthMasses));
exports.sun = exports.ConstructedStar('sun', safe_units_1.Measure.of(332967.75, exports.earthMasses));
exports.Orbit = (main, orbit, a, e, i, Ω, ω, θ) => {
    const p = () => safe_units_1.Measure.sqrt(a.cubed().div(main.mass().plus(orbit.mass())
        .times(exports.G))).scale(2 * Math.PI);
    const orbitDistance = () => a.times(e.squared().negate().plus(safe_units_1.Measure.dimensionless(1))
        .div(safe_units_1.Measure.dimensionless(1).plus(e.times(safe_units_1.Trig.cos(trueAnomaly(normθ))))));
    const normθ = angleRound360(θ);
    const trueAnomaly = (inp) => {
        let mean = inp;
        let iter = mean;
        for (var i = 0; i < 100; i++) {
            iter = mean.plus(e.times((safe_units_1.wrapUnaryFn(Math.sin))(iter)));
        }
        const out = angleRound360((safe_units_1.Trig.atan(safe_units_1.Measure.sqrt((e.plus(safe_units_1.Measure.dimensionless(1))).div(e.negate().plus(safe_units_1.Measure.dimensionless(1))))
            .times(safe_units_1.Trig.tan(iter.scale(.5)))).scale(2)));
        return out;
    };
    return {
        main: () => main,
        satellite: () => orbit,
        a: () => a,
        e: () => e,
        i: () => i,
        Ω: () => Ω,
        ω: () => ω,
        θ: () => normθ,
        ϖ: () => Ω.plus(ω),
        L: () => Ω.plus(ω).plus(θ),
        μ: () => exports.G.times(main.mass().plus(orbit.mass())),
        n: () => safe_units_1.Measure.sqrt(exports.G.times(main.mass().plus(orbit.mass())).div(a.cubed())),
        b: () => a.times(safe_units_1.Measure.sqrt(safe_units_1.Measure.dimensionless(1).minus(e.squared()))),
        orbitalPeriod: p,
        orbitalElements: () => {
            return {
                a: () => a,
                e: () => e,
                i: () => i,
                Ω: () => Ω,
                ω: () => ω,
                θ: () => normθ,
            };
        },
        changeMain: (body) => exports.Orbit(body, orbit, a, e, i, Ω, ω, θ),
        changeSatellite: (body) => exports.Orbit(main, body, a, e, i, Ω, ω, θ),
        addTime: (time) => exports.Orbit(main, orbit, a, e, i, Ω, ω, θ.plus(safe_units_1.Measure.of(360, safe_units_1.degrees).div(p()).times(time))),
        trueAnomaly: () => trueAnomaly(normθ),
        orbitDistance: orbitDistance,
        orbitCoordinates: () => {
            const r = orbitDistance();
            const ν = trueAnomaly(normθ);
            const Ω1 = Number(Ω.in(safe_units_1.degrees.withSymbol('')));
            const ω1 = Number(ω.in(safe_units_1.degrees.withSymbol('')));
            const ν1 = Number(ν.in(safe_units_1.degrees.withSymbol('')));
            const i1 = Number(ν.in(safe_units_1.degrees.withSymbol('')));
            //X = r*(np.cos(Om)*np.cos(w+nu) - np.sin(Om)*np.sin(w+nu)*np.cos(i))
            //Y = r*(np.sin(Om)*np.cos(w+nu) + np.cos(Om)*np.sin(w+nu)*np.cos(i))
            //Z = r*(np.sin(i)*np.sin(w+nu))
            const x = r.scale(Math.cos(Ω1) * Math.cos(ω1 + ν1) - Math.sin(Ω1) * Math.sin(ω1 + ν1) * Math.cos(i1));
            const y = r.scale(Math.sin(Ω1) * Math.cos(ω1 + ν1) + Math.cos(Ω1) * Math.sin(ω1 + ν1) * Math.cos(i1));
            const z = r.scale(Math.sin(i1) * Math.sin(ω1 + ν1));
            // const x = r.times(cos(Ω).times(cos(ω.plus(ν))).minus(sin(Ω).times(sin(ω.plus(ν))).times(cos(i))));
            // const y = r.times(sin(Ω).times(cos(ω.plus(ν))).plus(cos(Ω).times(sin(ω.plus(ν))).times(cos(i))));
            // const z = r.times(sin(i).times(sin(ω.plus(ν))));
            //let x = r * Math.sin(theta) * Math.cos(phi);
            //let y = r * Math.sin(theta) * Math.sin(phi);
            //let z = r * Math.cos(theta);
            return [x, y, z];
        },
        toString: () => markdownTable([
            ['Name', titleCase(main.name()) + ' -> ' + titleCase(orbit.name())],
            [titleCase(main.name()) + ' Mass', main.mass().in(exports.earthMasses, rounder())],
            [titleCase(orbit.name()) + ' Mass', orbit.mass().in(exports.earthMasses, rounder())],
            ['Period', p().in(safe_units_1.days, rounder())],
            ['Distance', orbitDistance().in(exports.astronomicalUnits, rounder())],
            ['Semimajor Axis', a.in(exports.astronomicalUnits, rounder())],
            ['Eccentricity', e.toString()],
            ['Inclination', i.in(safe_units_1.degrees, rounder())],
            ['Long. Asc. Node', Ω.in(safe_units_1.degrees, rounder())],
            ['Arg. Periapsis', ω.in(safe_units_1.degrees, rounder())],
            ['Mean Anomaly', normθ.in(safe_units_1.degrees, rounder())],
            ['True Anomaly', trueAnomaly(normθ).in(safe_units_1.degrees, rounder())]
        ])
    };
};
exports.testOrbit = exports.Orbit(exports.sun, exports.earth, safe_units_1.Measure.of(1, exports.astronomicalUnits), safe_units_1.Measure.dimensionless(0.0167), safe_units_1.Measure.of(0, safe_units_1.degrees), safe_units_1.Measure.of(100.46457166, safe_units_1.degrees), safe_units_1.Measure.of(102.93768193, safe_units_1.degrees), safe_units_1.Measure.of(0, safe_units_1.degrees));
exports.NestedSystem = (orbits, inputSystem) => {
    const orbit = orbits[0];
    if (orbits.length === 0) {
        return Object.assign({}, inputSystem);
    }
    if (inputSystem == null) {
        return exports.NestedSystem(orbits.slice(1), {
            center: () => orbit.main(),
            orbits: () => [
                Object.assign({ center: () => orbit.satellite(), orbits: () => [], toString: orbit.toString }, orbit.orbitalElements())
            ],
            toString: orbit.toString
        });
    }
    else {
        if (inputSystem.center().name() === orbit.satellite().name()) {
            return exports.NestedSystem(orbits.slice(1), {
                center: orbit.satellite,
                orbits: () => [Object.assign(Object.assign({}, orbit.orbitalElements()), inputSystem)],
                toString: () => inputSystem.toString() + '\n\n' + orbit.toString()
            });
        }
        let body = orbit.main();
        let queue = [inputSystem];
        let labels = [inputSystem.center().name()];
        while (queue.length > 0) {
            let v = queue.splice(0, 1)[0];
            if (v.center().name() === body.name()) {
                return exports.NestedSystem(orbits.slice(1), {
                    center: inputSystem.center,
                    orbits: () => inputSystem.orbits().concat(Object.assign({}, exports.orbitToSystemOrbit(orbit))),
                    toString: () => inputSystem.toString() + '\n\n' + orbit.toString()
                });
            }
            for (let w of v.orbits()) {
                if (labels.includes(v.center().name())) {
                    labels.push(w.center().name());
                    queue.push(w);
                }
            }
        }
        throw new Error('Unable to find root');
    }
};
exports.System = (orbits) => {
    return {
        orbits: () => orbits,
        bodies: () => {
            let out = {};
            for (let o of orbits) {
                out[o.main().name()] = o.main();
                out[o.satellite().name()] = o.satellite();
            }
            return Object.values(out);
        },
        bodyDictionary: () => {
            let out = {};
            for (let o of orbits) {
                out[o.main().name()] = o.main();
                out[o.satellite().name()] = o.satellite();
            }
            return out;
        },
        bodyTree: () => {
        },
        getBody: (name) => {
            for (let o of orbits) {
                if (o.main().name() === name)
                    return o.main();
                else if (o.satellite().name() === name)
                    return o.satellite();
            }
            throw new Error('Name not found');
        },
        getRadialBody: (name) => {
            for (let o of orbits) {
                let m = o.main();
                let s = o.satellite();
                if ('radius' in m && o.main().name() === name)
                    return m;
                else if ('radius' in s && o.satellite().name() === name)
                    return s;
            }
            throw new Error('Name not found');
        },
        findSatellites: (name) => {
            let out = [];
            for (let o of orbits)
                if (o.main().name() === name)
                    out.push(o);
            return out;
        },
        findParents: (name) => {
            let out = [];
            for (let o of orbits)
                if (o.satellite().name() === name)
                    out.push(o);
            return out;
        },
        changeBody: (name, body) => {
            let out = [];
            for (let o of orbits) {
                if (o.main().name() === name || o.satellite().name() === name) {
                    let newO = o;
                    if (o.main().name() === name)
                        newO = o.changeMain(body);
                    if (o.satellite().name() === name)
                        newO = o.changeSatellite(body);
                    out.push(newO);
                }
                else
                    out.push(o);
            }
            return exports.System(out);
        },
        map: (callbackfn, thisArg) => exports.System(orbits.map(callbackfn, thisArg)),
        addTime: (time) => {
            return exports.System(orbits.map(x => x.addTime(time)));
        },
        orbitCoordinates: (time) => {
            const addCoord = (input, addend) => {
                return [input[0].plus(addend[0]), input[1].plus(addend[1]), input[2].plus(addend[2])];
            };
            let self;
            if (time)
                self = exports.System(orbits.map(x => x.addTime(time)));
            else
                self = exports.System(orbits);
            let visited = {};
            for (let o of orbits) {
                visited[o.satellite().name()] = o.orbitCoordinates();
                self.findSatellites(o.satellite().name()).forEach(s => {
                    visited[s.satellite().name()] = addCoord(visited[o.satellite().name()], s.orbitCoordinates());
                });
            }
            return visited;
        },
        toGraphViz: () => 'digraph G {\n' + orbits.map(o => `\t"${titleCase(o.main().name())}" -> "${titleCase(o.satellite().name())}" [ label=<${o.orbitDistance().in(exports.astronomicalUnits, rounder(1))}<br/>${o.orbitalPeriod().in(safe_units_1.days, rounder(1))}> ];`).join('\n') + '\n}',
        toString: () => orbits.map(o => o.toString()).join('\n\n')
        // bodies: (() => {
        //     let out: IBody[] = [];
        //     let outNames: string[] = [];
        //     for (let o of orbits) {
        //         if (!outNames.includes(o.main().name())) {
        //             out.push(o.main());
        //             outNames.push(o.main().name());
        //         }
        //         else if (!outNames.includes(o.satellite().name())) {
        //             out.push(o.satellite());
        //             outNames.push(o.satellite().name());
        //         }
        //     }
        //     return out;
        // })(),
        // orbits: orbits.map((o) => {
        //     let { main: main, satellite: satellite, ...rest } = o;
        //     return { ...rest, mainName: main().name, satelliteName: satellite().name };
        // })
    };
};
// import collections
// def generate_tree0(edges):
//     indegrees = collections.defaultdict(int)
//     outdegrees = collections.defaultdict(set)
//     for u, v in edges:
//         indegrees[v] += 1
//         if u not in indegrees:
//             indegrees[u] = 0
//         outdegrees[u].add(v)
//     queue = [u for u, count in indegrees.items() if indegrees[u] == 0]
//     while queue:
//         curr_node = queue.pop(0)
//         for neighbor in list(outdegrees[curr_node]):
//             if indegrees[neighbor] == 1:
//                 queue.append(neighbor)
//             else:
//                 indegrees[neighbor] -= 1
//                 outdegrees[curr_node]remove(neighbor)
//     return outdegrees
const generateTree = (input, a, b) => {
    let indegrees = {};
    let outdegrees = {};
    for (let i of input) {
        let u = a(i);
        let v = b(i);
        if (indegrees[v] === undefined)
            indegrees[v] = 0;
        if (outdegrees[u] === undefined)
            outdegrees[u] = [];
        indegrees[v]++;
        outdegrees[u].push(v);
    }
    let queue = Object.keys(indegrees).filter(x => indegrees[x] === 0);
    while (queue.length > 0) {
        let curr_node = queue.shift();
        for (let neighbor of outdegrees[curr_node]) {
            if (indegrees[neighbor] === 1) {
                queue.push(neighbor);
            }
            else {
                indegrees[neighbor]--;
                outdegrees[curr_node].splice(outdegrees[curr_node].indexOf(neighbor), 1);
            }
        }
    }
    return outdegrees;
};
console.log(generateTree([
    ['a', 'b'],
    ['b', 'c'],
    ['c', 'd'],
    ['d', 'e'],
    ['e', 'f'],
    ['f', 'g'],
    ['c', 'h'],
    ['h', 'i'],
    ['i', 'j'],
    ['A', 'B'], ['A', 'D'], ['A', 'E'], ['A', 'C'], ['B', 'D'], ['B', 'E']
], (x) => x[0], (x) => x[1]));
exports.SimpleOrbit = (main, orbit, a, e, i, Ω, ω, θ) => {
    return exports.Orbit(main, orbit, safe_units_1.Measure.of(a, exports.astronomicalUnits), safe_units_1.Measure.dimensionless(e), safe_units_1.Measure.of(i, safe_units_1.degrees), safe_units_1.Measure.of(Ω, safe_units_1.degrees), safe_units_1.Measure.of(ω, safe_units_1.degrees), safe_units_1.Measure.of(θ, safe_units_1.degrees));
};
/**
 * https://ssd.jpl.nasa.gov/planets/approx_pos.html
 */
exports.APPOrbit = (main, orbit, a, e, i, L, ϖ, Ω) => {
    return exports.Orbit(main, orbit, safe_units_1.Measure.of(a, exports.astronomicalUnits), safe_units_1.Measure.dimensionless(e), safe_units_1.Measure.of(i, safe_units_1.degrees), safe_units_1.Measure.of(Ω, safe_units_1.degrees), safe_units_1.Measure.of(ϖ - Ω, safe_units_1.degrees), safe_units_1.Measure.of(L - ϖ, safe_units_1.degrees));
};
exports.orbitToSystemOrbit = (orbit) => {
    return Object.assign({ center: orbit.satellite, orbits: () => [] }, orbit.orbitalElements());
};
exports.solarSystem = exports.System([
    exports.APPOrbit(exports.sun, exports.earth, 1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0.0),
    exports.SimpleOrbit(//TODO: Fix Moon Elements
    exports.earth, exports.moon, 0.00256955529, 0.0549, 5.145 * (Math.PI / 180), 0, 0, 0),
    exports.APPOrbit(exports.sun, exports.mercury, 0.38709927, 0.20563593, 7.00497902, 252.25032350, 77.45779628, 48.33076593),
    exports.APPOrbit(exports.sun, exports.venus, 0.72333566, 0.00677672, 3.39467605, 181.97909950, 131.60246718, 76.67984255),
    exports.APPOrbit(exports.sun, exports.mars, 1.52371034, 0.09339410, 1.84969142, -4.55343205, -23.94362959, 49.55953891),
    exports.APPOrbit(exports.sun, exports.jupiter, 5.20288700, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909),
    exports.APPOrbit(exports.sun, exports.saturn, 9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448),
    exports.APPOrbit(exports.sun, exports.uranus, 19.18916464, 0.04725744, 0.77263783, 313.23810451, 170.95427630, 74.01692503),
    exports.APPOrbit(exports.sun, exports.neptune, 30.06992276, 0.00859048, 1.77004347, -55.12002969, 44.96476227, 131.78422574)
]);
//console.log(solarSystem.toString());
//console.log(solarSystem.toGraphViz());
console.log(Object.keys(exports.solarSystem.orbitCoordinates()).map(k => {
    return titleCase(k) + ' ' + exports.solarSystem.orbitCoordinates()[k].map(x => x.in(exports.astronomicalUnits, rounder())).join(', ');
}));
function shuffle(array) {
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
    return array;
}
// const searchForOrbit = (inputSystem: INestedSystem, orbit: IOrbit) => {
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
exports.ab = exports.BinaryStar(exports.SimpleOrbit(exports.a, exports.b, 0.2731 /* Not Real */, 0.4178, 0, 0, 0, 0));
console.log(exports.ab.a().name());
console.log(exports.solarSystem.orbitCoordinates().earth[0].in(exports.astronomicalUnits).slice(0, -3));
// export type System = {
//     main: Star | Planet | BinaryStar | BinaryPlanet;
//     orbits: Orbit[];
// };
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
// export const earthMoonSystem: INestedSystem = System([
//     SimpleOrbit(
//     )
// ]);
// {
//     main: sun,
//         orbits: [{
//             body: {
//                 main: earth,
//                 orbits: [{
//                     body: {
//                         main: moon,
//                         orbits: []
//                     },
//                     a: 0.00256955529,
//                     e: 0.0549,
//                     i: 5.145 * (Math.PI / 180),
//                     Ω: 0,
//                     ω: 0,
//                     θ: 0,
//                 }]
//             },
//             a: 1,
//             e: 0.0167,
//             i: 0,
//             Ω: 0,
//             ω: 0,
//             θ: 0,
//         }];
// };
// 0.38709927 0.20563593
// 7.00497902
// 252.25032350 77.45779628 48.33076593
exports.solarSystemL = {
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
