import { Measure, GenericMeasure, UnitWithSymbols, Trig, Length, Time, Mass, VolumeDensity, Dimensionless, PlaneAngle, wrapUnaryFn, kilograms, grams, meters, kilo, centi, days, seconds, degrees } from "safe-units";

import * as u from "safe-units"; // REMEMBER TO COMMENT OUT WHEN DONE

//import { markdownTable } from 'markdown-table';

export type IBasicBody = {
    /**
     * Function returning body's name
     *
     * @returns {string} string
     */
    name: () => string;
    /**
     * Function returning body's mass
     *
     * @returns {Mass} Mass
     */
    mass: () => Mass;
    /**
     * Function returning string representation
     *
     * @returns {string} String
     */
    toString: () => string;
};

/**
 * A planet with a name, mass, radius, and density
 */
export type IPlanet = {
    /**
     * Function returning planet's name
     *
     * @returns {string} string
     */
    name: () => string;
    /**
     * Function returning planet's mass
     *
     * @returns {Mass} Mass
     */
    mass: () => Mass;
    /**
     * Function returning planet's radius
     *
     * @returns {Length} Length
     */
    radius: () => Length;
    /**
     * Function returning planet's density
     *
     * @returns {VolumeDensity} VolumeDensity
     */
    density: () => VolumeDensity;
    /**
     * Function returning string representation
     *
     * @returns {string} String
     */
    toString: () => string;
};

const titleCase = (t) => t.split(' ').map((x) => x[0].toUpperCase() + x.substring(1)).join(' ');

const rounder = (accuracy?: number) => {
    return {
        formatValue: (x: number) => x >= 1 || x <= -1 || x === 0 ? (Math.round((x + Number.EPSILON) * Math.pow(10, accuracy ?? 4)) / Math.pow(10, accuracy ?? 4)).toString() : x.toPrecision(accuracy ?? 4),
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

const angleRound360 = ((x: PlaneAngle) => Measure.of((((Number(x.in(degrees.withSymbol(''))) % 360) + 360) % 360), degrees));

console.log(Measure.of(55, degrees).in(degrees.withSymbol('')));

export const G = Measure.of(6.6743015e-11,
    meters.cubed()
        .times(kilograms.inverse())
        .times(seconds.squared().inverse())
);

function objectMap<A, B>(object: { [key: string]: A; }, fn: ([k, v]: [string, A]) => [string, B]) {
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
export const Planet = (name: string, mass: Mass, radius: Length): IPlanet => {
    return {
        name: () => name,
        mass: () => mass,
        radius: () => radius,
        density: () => mass.over(radius.cubed()),
        toString: () => markdownTable(
            [
                ['Name', titleCase(name)],
                ['Mass', mass.in(earthMasses, rounder())],
                ['Radius', radius.in(earthRadiuses, rounder())],
                ['Density', mass.over(radius.cubed()).in(gcm3, rounder())]
            ])
    };
};

export const earthMasses = Measure.of(5.9722e+24, kilograms, 'M🜨');

export const earthRadiuses = Measure.of(6371.000, kilo(meters), 'R🜨');

export const solarMasses = Measure.of(332967.75, earthMasses, 'M☉');

export const solarRadiuses = Measure.of(695700, kilo(meters), 'R☉');

export const astronomicalUnits = Measure.of(149597870691, meters, 'AU');

export const gcm3 = grams.div(centi(meters).cubed());

export const centuries = Measure.of(3155760000, seconds, 'Cy');

export const wenzels = Measure.of(1.3341, meters, 'wenzels');

export const zookas = Measure.of(7, wenzels, 'zookas');

export const hippers = Measure.of(0.48, zookas, 'hippers');

export const fuggles = Measure.of(5.2, hippers, 'fuggles');

export const chirks = Measure.of(9, fuggles, 'chirks');

export const riddigs = Measure.of(42, chirks, 'riddigs');

export const blops = Measure.of(34, riddigs, 'blops');

export const gleems = Measure.of(27, blops, 'gleems');

/**
 * A star with a name, mass, radius, and density
 */
export type IStar = {
    /**
     * Function returning star's name
     *
     * @returns {string} string
     */
    name: () => string;
    /**
     * Function returning star's mass
     *
     * @returns {Mass} Mass
     */
    mass: () => Mass;
    /**
     * Function returning star's radius
     *
     * @returns {Length} Length
     */
    radius: () => Length;
    /**
     * Function returning star's density
     *
     * @returns {Length} Length
     */
    density: () => VolumeDensity;
    /**
     * Function returning string representation
     *
     * @returns {string} String
     */
    toString: () => string;
};

/**
 * Constructor for IStar
 *
 * @param {string} name Star's name
 * @param {Mass} mass Stellar mass
 * @returns {IStar} IStar
 */
export const ConstructedStar = (name: string, mass: Mass): IStar => {
    return {
        name: () => name,
        mass: () => mass,
        radius: () => Measure.of((Number(mass.in(solarMasses.withSymbol(''))) ** 0.74) * 695508, kilo(meters)), // TODO: Definitely very invalid (? might not be)
        density: () => mass.over(Measure.of((Number(mass.in(solarMasses.withSymbol(''))) ** 0.74) * 695508, kilo(meters)).cubed()),
        toString: () => markdownTable(
            [
                ['Name', titleCase(name)],
                ['Mass', mass.in(solarMasses, rounder())],
                ['Radius', Measure.of((Number(mass.in(solarMasses.withSymbol(''))) ** 0.74) * 695508, kilo(meters)).in(solarRadiuses, rounder())],
                ['Density', mass.over(Measure.of((Number(mass.in(solarMasses.withSymbol(''))) ** 0.74) * 695508, kilo(meters)).cubed()).in(gcm3, rounder())]
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
export const Star = (name: string, mass: Mass, radius: Length): IStar => {
    return {
        name: () => name,
        mass: () => mass,
        radius: () => radius,
        density: () => mass.over(radius.cubed()),
        toString: () => markdownTable(
            [
                ['Name', titleCase(name)],
                ['Mass', mass.in(solarMasses, rounder())],
                ['Radius', radius.in(solarRadiuses, rounder())],
                ['Density', mass.over(radius.cubed()).in(gcm3, rounder())]
            ])
    };
};

/**
 * A binary star system containing star a and b
 */
export type IBinaryStar = {
    /**
     * Function returning orbit
     *
     * @returns {IOrbit<IStar, IStar>} Orbit
     */
    orbit: () => IOrbit<IStar, IStar>;
    /**
     * Function returning star a
     *
     * @returns {IStar} Star a
     */
    a: () => IStar;
    /**
     * Function returning star b
     *
     * @returns {IStar} Star b
     */
    b: () => IStar;
    /**
     * Function returning system's mass
     *
     * @returns {Mass} Mass
     */
    mass: () => Mass;
    /**
     * Function returning system's name
     *
     * @returns {string} string
     */
    name: () => string;
    /**
     * Function returning string representation
     *
     * @returns {string} String
     */
    toString: () => string;
};

/**
 * Constructor for IBinaryStar
 *
 * @param {IOrbit} orbit Orbit
 * @returns {IBinaryStar} IBinaryStar
 */
export const BinaryStar = (orbit: IOrbit<IStar, IStar>): IBinaryStar => {
    return {
        orbit: () => orbit,
        a: orbit.main,
        b: orbit.satellite,
        mass: () => orbit.main().mass().plus(orbit.satellite().mass()),
        name: () => orbit.main().name() + ' + ' + orbit.satellite().name(),
        toString: () => markdownTable(
            [
                ['Name', titleCase(orbit.main().name()), titleCase(orbit.satellite().name())],
                ['Mass', orbit.main().mass().in(solarMasses, rounder()), orbit.satellite().mass().in(solarMasses, rounder())],
                ['Radius', orbit.main().radius().in(solarRadiuses, rounder()), orbit.satellite().radius().in(solarRadiuses, rounder())],
                ['Density', orbit.main().density().toString(rounder()), orbit.satellite().density().in(gcm3, rounder())],
            ])
    };
};

/**
 * A binary planet system containing planet a and b
 */
export type IBinaryPlanet = {
    /**
     * Function returning orbit
     *
     * @returns {IOrbit<IPlanet, IPlanet>} Orbit
     */
    orbit: () => IOrbit<IPlanet, IPlanet>;
    /**
     * Function returning planet a
     *
     * @returns {IPlanet} Planet a
     */
    a: () => IPlanet;
    /**
     * Function returning planet b
     *
     * @returns {IPlanet} Planet b
     */
    b: () => IPlanet;
    /**
     * Function returning system's mass
     *
     * @returns {Mass} Mass
     */
    mass: () => Mass;
    /**
     * Function returning system's name
     *
     * @returns {string} string
     */
    name: () => string;
    /**
     * Function returning string representation
     *
     * @returns {string} String
     */
    toString: () => string;
};

/**
 * Constructor for IBinaryPlanet
 *
 * @param {IOrbit} orbit Orbit
 * @returns {IBinaryPlanet} IBinaryPlanet
 */
export const BinaryPlanet = (orbit: IOrbit<IPlanet, IPlanet>): IBinaryPlanet => {
    return {
        orbit: () => orbit,
        a: orbit.main,
        b: orbit.satellite,
        mass: () => orbit.main().mass().plus(orbit.satellite().mass()),
        name: () => orbit.main().name() + ' + ' + orbit.satellite().name(),
        toString: () => markdownTable(
            [
                ['Name', titleCase(orbit.main().name()), titleCase(orbit.satellite().name())],
                ['Mass', orbit.main().mass().in(earthMasses, rounder()), orbit.satellite().mass().in(earthMasses, rounder())],
                ['Radius', orbit.main().radius().in(earthRadiuses, rounder()), orbit.satellite().radius().in(earthRadiuses, rounder())],
                ['Density', orbit.main().density().toString(rounder()), orbit.satellite().density().toString(rounder())],
            ])
    };
};

// TODO: Check for validity
export function starRadius(star: Mass): Length {// * 695508
    return Measure.of(((Number(star.in(solarMasses.withSymbol(''))) / 332967.75) ** 0.74) * 695508, meters);
}

export type IBody = IStar | IPlanet | IBinaryStar | IBinaryPlanet;

export const giant = Planet('giant', Measure.of(594.4858, earthMasses), Measure.of(11.444303, kilo(meters))); // Kilometers are broken?

export const nine = Planet('nine', Measure.of(594.4858, earthMasses), Measure.of(11.444303, kilo(meters))); // NOT REAL

export const earth = Planet('earth', Measure.of(1, earthMasses), Measure.of(6371.000, kilo(meters)));

export const moon = Planet('moon', Measure.of(0.0123032, earthMasses), Measure.of(1738.1, kilo(meters)));

export const mercury = Planet('mercury', Measure.of(0.05527, earthMasses), Measure.of(2439.7, kilo(meters)));

export const venus = Planet('venus', Measure.of(0.81500, earthMasses), Measure.of(6051.8, kilo(meters)));

export const mars = Planet('mars', Measure.of(0.10745, earthMasses), Measure.of(3389.5, kilo(meters)));

export const jupiter = Planet('jupiter', Measure.of(317.83, earthMasses), Measure.of(69911, kilo(meters)));

export const saturn = Planet('saturn', Measure.of(95.159, earthMasses), Measure.of(58232, kilo(meters)));

export const uranus = Planet('uranus', Measure.of(14.536, earthMasses), Measure.of(25362, kilo(meters)));

export const neptune = Planet('neptune', Measure.of(17.204, earthMasses), Measure.of(24622, kilo(meters)));

export const ceres = Planet('ceres', Measure.of(0.00016, earthMasses), Measure.of(469.73, kilo(meters)));

export const pluto = Planet('pluto', Measure.of(0.00220, earthMasses), Measure.of(1188.3, kilo(meters)));

export const haumea = Planet('haumea', Measure.of(0.00070, earthMasses), Measure.of(780, kilo(meters)));

export const makemake = Planet('makemake', Measure.of(0.0007, earthMasses), Measure.of(715, kilo(meters)));

export const eris = Planet('eris', Measure.of(0.00278, earthMasses), Measure.of(1163, kilo(meters)));

export const a = ConstructedStar('a', Measure.of(404698.375, earthMasses));

export const b = ConstructedStar('b', Measure.of(263859.877, earthMasses));

export const sun = ConstructedStar('sun', Measure.of(332967.75, earthMasses));

/**
 * Kepler's orbital elements
 */
export type IOrbitalElements = {
    /**
     * Semi-major axis
     */
    a: () => Length,
    /**
     * Orbital eccentricity
     */
    e: () => Dimensionless,
    i: () => PlaneAngle, // CONTINUE
    Ω: () => PlaneAngle,
    ω: () => PlaneAngle,
    θ: () => PlaneAngle,
};

export type IOrbitalBodies<A extends IBasicBody, B extends IBasicBody> = {
    main: () => A,
    satellite: () => B,
};

export type IOrbit<A extends IBasicBody, B extends IBasicBody> = IOrbitalBodies<A, B> & IOrbitalElements & {
    orbitalPeriod: () => Time,
    orbitalElements: () => IOrbitalElements,
    changeMain: (body: IBody) => IOrbit<IBody, B>;
    changeSatellite: (body: IBody) => IOrbit<A, IBody>;
    addTime: (time: Time) => IOrbit<A, B>;
    trueAnomaly: () => PlaneAngle;
    ϖ: () => PlaneAngle,
    L: () => PlaneAngle,
    μ: () => GenericMeasure<number, { length: "3"; time: "-2"; }>,
    n: () => GenericMeasure<number, { time: "-1"; }>,
    b: () => Length,
    orbitDistance: () => Length;
    orbitCoordinates: () => [Length, Length, Length];
    /**
     * Function returning string representation
     *
     * @returns {string} String
     */
    toString: () => string;
};

export const Orbit = <A extends IBasicBody, B extends IBasicBody>(
    main: A,
    orbit: B,
    a: Length,
    e: Dimensionless,
    i: PlaneAngle,
    Ω: PlaneAngle,
    ω: PlaneAngle,
    θ: PlaneAngle,
): IOrbit<A, B> => {

    const p = () => Measure.sqrt(
        a.cubed().div(
            main.mass().plus(orbit.mass())
                .times(G)
        )
    ).scale(2 * Math.PI);

    const orbitDistance = () => a.times(
        e.squared().negate().plus(Measure.dimensionless(1))
            .div(
                Measure.dimensionless(1).plus(
                    e.times(Trig.cos(trueAnomaly(normθ))))
            )
    );

    const normθ = angleRound360(θ);

    const trueAnomaly = (inp: PlaneAngle) => {
        let mean = inp;
        let iter = mean;
        for (var i = 0; i < 100; i++) {
            iter = mean.plus(e.times((wrapUnaryFn(Math.sin))(iter)));
        }
        const out = angleRound360((Trig.atan(
            Measure.sqrt(
                (e.plus(Measure.dimensionless(1))).div(e.negate().plus(Measure.dimensionless(1))))
                .times(Trig.tan(iter.scale(.5))
                )
        ).scale(2)));
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
        μ: () => G.times(main.mass().plus(orbit.mass())),
        n: () => Measure.sqrt(G.times(main.mass().plus(orbit.mass())).div(a.cubed())),
        b: () => a.times(Measure.sqrt(Measure.dimensionless(1).minus(e.squared()))),
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
        changeMain: (body: IBody) => Orbit(body, orbit, a, e, i, Ω, ω, θ),
        changeSatellite: (body: IBody) => Orbit(main, body, a, e, i, Ω, ω, θ),
        addTime: (time: Time) => Orbit(main, orbit, a, e, i, Ω, ω, θ.plus(Measure.of(360, degrees).div(p()).times(time))),
        trueAnomaly: () => trueAnomaly(normθ),
        orbitDistance: orbitDistance,
        orbitCoordinates: () => {
            const r = orbitDistance();
            const ν = trueAnomaly(normθ);

            const Ω1 = Number(Ω.in(degrees.withSymbol('')));
            const ω1 = Number(ω.in(degrees.withSymbol('')));
            const ν1 = Number(ν.in(degrees.withSymbol('')));
            const i1 = Number(ν.in(degrees.withSymbol('')));

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
        toString: () => markdownTable(
            [
                ['Name', titleCase(main.name()) + ' -> ' + titleCase(orbit.name())],
                [titleCase(main.name()) + ' Mass', main.mass().in(earthMasses, rounder())],
                [titleCase(orbit.name()) + ' Mass', orbit.mass().in(earthMasses, rounder())],
                ['Period', p().in(days, rounder())],
                ['Distance', orbitDistance().in(astronomicalUnits, rounder())],
                ['Semimajor Axis', a.in(astronomicalUnits, rounder())],
                ['Eccentricity', e.toString()],
                ['Inclination', i.in(degrees, rounder())],
                ['Long. Asc. Node', Ω.in(degrees, rounder())],
                ['Arg. Periapsis', ω.in(degrees, rounder())],
                ['Mean Anomaly', normθ.in(degrees, rounder())],
                ['True Anomaly', trueAnomaly(normθ).in(degrees, rounder())]
            ])
    };
};

export const testOrbit = Orbit(
    sun, earth,
    Measure.of(1, astronomicalUnits),
    Measure.dimensionless(0.0167),
    Measure.of(0, degrees),
    Measure.of(100.46457166, degrees),
    Measure.of(102.93768193, degrees),
    Measure.of(0, degrees)
);

//console.log(testOrbit.addTime(Measure.of(366, days)).toString());

export type IBasicNestedSystem = {
    center: () => IBasicBody;
    orbits: () => (IOrbitalElements & IBasicNestedSystem)[];
    /**
     * Function returning string representation
     *
     * @returns {string} String
     */
    toString: () => string;
};

export type INestedSystem = IBasicNestedSystem & {
    // epoch: () => ICoordinateSystem
};

export const NestedSystem = (
    orbits: IOrbit<IBasicBody, IBasicBody>[],
    inputSystem?: IBasicNestedSystem
): INestedSystem => {
    const orbit = orbits[0];
    if (orbits.length === 0) {
        return {
            ...inputSystem!,
        };
    }

    if (inputSystem == null) {
        return NestedSystem(orbits.slice(1), {
            center: () => orbit.main(),
            orbits: () => [
                {
                    center: () => orbit.satellite(),
                    orbits: () => [],
                    toString: orbit.toString,
                    ...orbit.orbitalElements()
                }
            ],
            toString: orbit.toString
        });

    } else {

        if (inputSystem.center().name() === orbit.satellite().name()) {

            return NestedSystem(orbits.slice(1), {
                center: orbit.satellite,
                orbits: () => [{
                    ...orbit.orbitalElements(),
                    ...inputSystem
                }],
                toString: () => inputSystem.toString() + '\n\n' + orbit.toString()
            });

        }

        let body = orbit.main();

        let queue = [inputSystem];

        let labels = [inputSystem.center().name()];

        while (queue.length > 0) {

            let v = queue.splice(0, 1)[0];

            if (v!.center().name() === body.name()) {

                return NestedSystem(orbits.slice(1), {
                    center: inputSystem.center,
                    orbits: () => inputSystem.orbits().concat({
                        ...orbitToSystemOrbit(orbit),
                    }),
                    toString: () => inputSystem.toString() + '\n\n' + orbit.toString()
                });

            }

            for (let w of v!.orbits()) {
                if (labels.includes(v!.center().name())) {
                    labels.push(w!.center().name());
                    queue.push(w);
                }
            }

        }

        throw new Error('Unable to find root');
    }

};

export type BodyTree = {
    [name: string]: IOrbit<IBody, IBody> | [BodyTree, IOrbit<IBody, IBody>];
};

export type ISystem = {
    // bodies: IBody[];
    // orbits: (IOrbitalSkeleton & { mainName: () => string, satelliteName: () => string; })[];
    orbits: () => IOrbit<IBody, IBody>[];
    bodies: () => IBody[];
    bodyDictionary: () => { [name: string]: IBody; };
    bodyTree: () => BodyTree;
    getBody: (name: string) => IBody;
    getRadialBody: (name: string) => (IBody & { radius: () => Length; });
    findSatellites: (name: string) => IOrbit<IBody, IBody>[];
    findParents: (name: string) => IOrbit<IBody, IBody>[];
    changeBody: (name: string, body: IBody) => ISystem;
    map: (callbackfn: (value: IOrbit<IBody, IBody>, index: number, array: IOrbit<IBody, IBody>[]) => IOrbit<IBody, IBody>, thisArg?: any) => ISystem;
    addTime: (time: Time) => ISystem;
    orbitCoordinates: (time?: Time) => { [name: string]: [Length, Length, Length]; };
    toGraphViz: () => string;
    /**
     * Function returning string representation
     *
     * @returns {string} String
     */
    toString: () => string;
};

export const System = (orbits: IOrbit<IBody, IBody>[]): ISystem => {
    return {
        orbits: () => orbits,
        bodies: () => {
            let out: { [name: string]: IBody; } = {};
            for (let o of orbits) {
                out[o.main().name()] = o.main();
                out[o.satellite().name()] = o.satellite();
            }
            return Object.values(out);
        },
        bodyDictionary: () => {
            let out: { [name: string]: IBody; } = {};
            for (let o of orbits) {
                out[o.main().name()] = o.main();
                out[o.satellite().name()] = o.satellite();
            }
            return out;
        },
        bodyTree: () => {
        },
        getBody: (name: string) => {
            for (let o of orbits) {
                if (o.main().name() === name)
                    return o.main();
                else if (o.satellite().name() === name)
                    return o.satellite();
            }
            throw new Error('Name not found');
        },
        getRadialBody: (name: string) => {
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
        findSatellites: (name: string) => {
            let out: IOrbit<IBody, IBody>[] = [];
            for (let o of orbits)
                if (o.main().name() === name)
                    out.push(o);
            return out;
        },
        findParents: (name: string) => {
            let out: IOrbit<IBody, IBody>[] = [];
            for (let o of orbits)
                if (o.satellite().name() === name)
                    out.push(o);
            return out;
        },
        changeBody: (name: string, body: IBody) => {
            let out: IOrbit<IBody, IBody>[] = [];
            for (let o of orbits) {
                if (o.main().name() === name || o.satellite().name() === name) {
                    let newO = o;
                    if (o.main().name() === name)
                        newO = o.changeMain(body);
                    if (o.satellite().name() === name)
                        newO = o.changeSatellite(body);
                    out.push(newO);
                } else
                    out.push(o);
            }
            return System(out);
        },
        map: (callbackfn: (value: IOrbit<IBody, IBody>, index: number, array: IOrbit<IBody, IBody>[]) => IOrbit<IBody, IBody>, thisArg?: any) => System(orbits.map(callbackfn, thisArg)),
        addTime: (time: Time) => {
            return System(orbits.map(x => x.addTime(time)));
        },
        orbitCoordinates: (time?: Time) => {
            const addCoord = (input: [Length, Length, Length], addend: [Length, Length, Length]) => {
                return [input[0].plus(addend[0]), input[1].plus(addend[1]), input[2].plus(addend[2])];
            };
            let self;
            if (time)
                self = System(orbits.map(x => x.addTime(time)));
            else
                self = System(orbits);
            let visited = {};
            for (let o of orbits) {
                visited[o.satellite().name()] = o.orbitCoordinates();
                self.findSatellites(o.satellite().name()).forEach(s => {
                    visited[s.satellite().name()] = addCoord(visited[o.satellite().name()], s.orbitCoordinates());
                });
            }
            return visited;
        },
        toGraphViz: () => 'digraph G {\n' + orbits.map(o => `\t"${titleCase(o.main().name())}" -> "${titleCase(o.satellite().name())}" [ label=<${o.orbitDistance().in(astronomicalUnits, rounder(1))}<br/>${o.orbitalPeriod().in(days, rounder(1))}> ];`).join('\n') + '\n}',
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

const generateTree = <T>(input: T[], a: (x: T) => string, b: (x: T) => string) => {
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
    console.log(indegrees);
    console.log(outdegrees);
    console.log(queue);
    // while (queue.length > 0) {
    //     let curr_node = queue.shift()!;
    //     for (let neighbor of outdegrees[curr_node]) {
    //         if (indegrees[neighbor] === 1) {
    //             queue.push(neighbor);
    //         } else {
    //             indegrees[neighbor]--;
    //             outdegrees[curr_node].splice(outdegrees[curr_node].indexOf(neighbor), 1);
    //         }
    //     }
    // }

    return trees;
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
], (x: string[]) => x[0], (x: string[]) => x[1]));


export const SimpleOrbit = <A extends IBasicBody, B extends IBasicBody>(
    main: A,
    orbit: B,
    a: number,
    e: number,
    i: number,
    Ω: number,
    ω: number,
    θ: number,
): IOrbit<A, B> => {
    return Orbit(
        main, orbit,
        Measure.of(a, astronomicalUnits),
        Measure.dimensionless(e),
        Measure.of(i, degrees),
        Measure.of(Ω, degrees),
        Measure.of(ω, degrees),
        Measure.of(θ, degrees)
    );
};

/**
 * https://ssd.jpl.nasa.gov/planets/approx_pos.html
 */
export const APPOrbit = <A extends IBasicBody, B extends IBasicBody>(
    main: A,
    orbit: B,
    a: number,
    e: number,
    i: number,
    L: number,
    ϖ: number,
    Ω: number
): IOrbit<A, B> => {
    return Orbit(
        main, orbit,
        Measure.of(a, astronomicalUnits),
        Measure.dimensionless(e),
        Measure.of(i, degrees),
        Measure.of(Ω, degrees),
        Measure.of(ϖ - Ω, degrees),
        Measure.of(L - ϖ, degrees)
    );
};

export const orbitToSystemOrbit = (orbit: IOrbit<IBasicBody, IBasicBody>): IOrbitalElements & INestedSystem => {
    return {
        center: orbit.satellite,
        orbits: () => [],
        ...orbit.orbitalElements()
    };
};

export const solarSystem = System([
    APPOrbit(
        sun, earth,
        1.00000261,
        0.01671123,
        -0.00001531,
        100.46457166,
        102.93768193,
        0.0
    ),
    SimpleOrbit( //TODO: Fix Moon Elements
        earth, moon,
        0.00256955529,
        0.0549,
        5.145 * (Math.PI / 180),
        0,
        0,
        0,
    ),
    APPOrbit(
        sun, mercury,
        0.38709927,
        0.20563593,
        7.00497902,
        252.25032350,
        77.45779628,
        48.33076593
    ),
    APPOrbit(
        sun, venus,
        0.72333566,
        0.00677672,
        3.39467605,
        181.97909950,
        131.60246718,
        76.67984255
    ),
    APPOrbit(
        sun, mars,
        1.52371034,
        0.09339410,
        1.84969142,
        -4.55343205,
        -23.94362959,
        49.55953891
    ),
    APPOrbit(
        sun, jupiter,
        5.20288700,
        0.04838624,
        1.30439695,
        34.39644051,
        14.72847983,
        100.47390909
    ),
    APPOrbit(
        sun, saturn,
        9.53667594,
        0.05386179,
        2.48599187,
        49.95424423,
        92.59887831,
        113.66242448
    ),
    APPOrbit(
        sun, uranus,
        19.18916464,
        0.04725744,
        0.77263783,
        313.23810451,
        170.95427630,
        74.01692503
    ),
    APPOrbit(
        sun, neptune,
        30.06992276,
        0.00859048,
        1.77004347,
        -55.12002969,
        44.96476227,
        131.78422574
    )
]);

//console.log(solarSystem.toString());

//console.log(solarSystem.toGraphViz());

console.log(Object.keys(solarSystem.orbitCoordinates()).map(k => {
    return titleCase(k) + ' ' + solarSystem.orbitCoordinates()[k].map(x => x.in(astronomicalUnits, rounder())).join(', ');
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
            array[randomIndex], array[currentIndex]];
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

export const ab: IBinaryStar = BinaryStar(
    SimpleOrbit(a, b, 0.2731 /* Not Real */, 0.4178, 0, 0, 0, 0),
);

console.log(ab.a().name());

console.log(solarSystem.orbitCoordinates().earth[0].in(astronomicalUnits).slice(0, -3));

// export type System = {
//     main: Star | Planet | BinaryStar | BinaryPlanet;
//     orbits: Orbit[];
// };

export function trueAnomaly(input: SystemPair, epoch: Time): Angle {
    let mean = meanAnomaly(input, epoch) * (Math.PI / 180);
    let iter = mean;
    for (var i = 0; i < 100; i++) {
        iter = mean + input.orbit.e * Math.sin(iter);
    }
    const out = ((((2 * Math.atan(Math.pow((1 + input.orbit.e) / (1 - input.orbit.e), 1 / 2) * Math.tan(iter / 2))) * (180 / Math.PI)) % 360) + 360) % 360;
    return out * (Math.PI / 180);
}

////SUCKS + DOESN'T WORK + BAD
export function unrestrictedTrueAnomaly(input: SystemPair, epoch: Time): Angle {
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

export function meanAnomaly(input: SystemPair, epoch: Time): Angle {
    return (epoch / planetaryYear(input)) * 360;
}

export function planetaryYear(input: SystemPair): Time {
    return Math.sqrt((input.orbit.a ** 3) / ((mass(input.main) / 332967.75)));
}
// sqrt(0.00256955529 ** 3 / (1 / x)) = 0.07480519764
// 0.00256955529 ** 3 / (1 / x) = 0.07480519764 ** 2
// 0.00256955529 ** 3 * x / 1 = 0.07480519764 ** 2
//console.log(((0.07480233042 ** 2) * 1) / (0.00256955529 ** 3));
//console.log(Math.sqrt(0.00256955529 ** 3 / (1 / 333030)));

export function orbitDistance(input: SystemPair, epoch: Time): Angle {
    return (input.orbit.a * (1 - input.orbit.e)) / (1 + input.orbit.e * Math.cos(trueAnomaly(input, epoch)));
}

export function systemPairs(input: System): SystemPair[] {
    return input.orbits.map((orbit) => {
        return {
            main: input.main,
            orbit: orbit
        };
    });
}

export function orbitCoordinates(inp: System, epoch: Time): [number, number, number][] {
    return systemPairs(inp).map((input): [number, number, number][] => {

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
        const satellites = relativeSatellites.map((sat): [number, number, number] => {
            return [sat[0] + x, sat[1] + y, sat[2] + z];
        });

        return [[x, y, z], ...satellites];
    }).flat();
}

export function kmToAU(km: Radius) {
    return km / 149700598.8024;
}

export function angularDiameter(origin: [number, number, number], body: [number, number, number], radius: Radius) {
    return 2 * Math.atan(kmToAU(radius) / Math.sqrt((body[0] - origin[0]) ** 2 + (body[1] - origin[1]) ** 2 + (body[2] - origin[2]) ** 2));
}

export const ssystem: System = {
    main: ab,
    orbits: [{
        body: {
            main: giant,
            orbits: [{
                body: {
                    main: nine,
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
export const solarSystemL: System = {
    main: sun,
    orbits: [{
        body: {
            main: earth,
            orbits: [{
                body: {
                    main: moon,
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
