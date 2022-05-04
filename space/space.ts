import { Measure, Length, Time, Mass, VolumeDensity, Dimensionless, PlaneAngle, kilograms, meters, kilo, seconds, degrees } from "safe-units";

import * as u from "safe-units"; // REMEMBER TO COMMENT OUT WHEN DONE

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
};

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
    };
};

export const earthMasses = Measure.of(5.9722e+24, kilograms, 'M🜨');

export const solarMasses = Measure.of(332967.75, earthMasses, 'M☉');

export const astronomicalUnits = Measure.of(149597870691, meters, 'AU');

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
    //density: () => VolumeDensity;
};

/**
 * Constructor for IStar
 *
 * @param {string} name Star's name
 * @param {Mass} mass Stellar mass
 * @returns {IStar} IStar
 */
export const Star = (name: string, mass: Mass): IStar => {
    return {
        name: () => name,
        mass: () => mass,
        radius: () => Measure.of((Number(mass.in(solarMasses).slice(0, -2)) ** 0.74) * 695508, kilo(meters))
        //density: () => m.over(r.cubed()),
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
    };
};

// export function starRadius(star: Star): Radius {// * 695508
//     return ((star.mass / 332967.75) ** 0.74) * 695508;
// }

export const giant = Planet('giant', Measure.of(594.4858, earthMasses), Measure.of(11.444303, kilo(meters))); // Kilometers are broken?

export const nine = Planet('nine', Measure.of(594.4858, earthMasses), Measure.of(11.444303, kilo(meters))); // NOT REAL

export const earth = Planet('earth', Measure.of(1, earthMasses), Measure.of(6371.000, kilo(meters)));

export const moon = Planet('moon', Measure.of(0.0123032, earthMasses), Measure.of(1738.1, kilo(meters)));

export const a = Star('a', Measure.of(404698.375, earthMasses));

export const b = Star('b', Measure.of(263859.877, earthMasses));

export const sun = Star('sun', Measure.of(332967.75, earthMasses));

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

export type IOrbit<A extends IBasicBody, B extends IBasicBody> = IOrbitalElements & {
    main: () => A,
    satellite: () => B,
    orbitalPeriod: () => Time,
    orbitalElements: () => IOrbitalElements,
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
    return {
        main: () => main,
        satellite: () => orbit,
        a: () => a,
        e: () => e,
        i: () => i,
        Ω: () => Ω,
        ω: () => ω,
        θ: () => θ,
        orbitalPeriod: () => Measure.sqrt(
            a.cubed().div(
                main.mass().plus(orbit.mass())
                    .times(
                        Measure.of(6.6743015e-11,
                            meters.cubed()
                                .times(kilograms.inverse())
                                .times(seconds.squared().inverse())
                        )
                    )
            )
        ).scale(2 * Math.PI),
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

export const testOrbit = Orbit(
    sun, earth,
    Measure.of(1, astronomicalUnits),
    Measure.dimensionless(0.0167),
    Measure.of(0, degrees),
    Measure.of(100.46457166, degrees),
    Measure.of(102.93768193, degrees),
    Measure.of(0, degrees)
);

export type ISystem = {
    center: () => IBasicBody;
    orbits: () => (IOrbitalElements & ISystem)[];
};

export const System = (
    orbits: IOrbit<IBasicBody, IBasicBody>[],
    inputSystem?: ISystem
): ISystem => {

    if (orbits.length === 0) {
        return inputSystem;
    }

    if (inputSystem === undefined) {

        return System(orbits.slice(1), {
            center: () => orbits[0].main(),
            orbits: () => [
                {
                    center: () => orbits[0].satellite(),
                    orbits: () => [],
                    ...orbits[0].orbitalElements()
                }
            ]
        });

    }

    const orbit = orbits[0];

    if (inputSystem.center().name() === orbit.satellite().name()) {

        return System(orbits.slice(1), {
            center: orbit.satellite,
            orbits: () => [{
                ...orbit.orbitalElements(),
                ...inputSystem
            }]
        });

    }

    let body = orbit.main();

    let queue = [];

    while (true) {

        if (inputSystem.center().name() === body.name()) {

            return System(orbits.slice(1), {
                center: inputSystem.center,
                orbits: () => inputSystem.orbits().concat({
                    ...orbitToSystemOrbit(orbit),
                })
            });

        }

    }

};

export const EasyOrbit = <A extends IBasicBody, B extends IBasicBody>(
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

export const orbitToSystemOrbit = (orbit: IOrbit<IBasicBody, IBasicBody>): IOrbitalElements & ISystem => {
    return {
        center: orbit.satellite,
        orbits: () => [],
        ...orbit.orbitalElements()
    };
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

export const ab: IBinaryStar = BinaryStar(
    EasyOrbit(a, b, 0.2731 /* Not Real */, 0.4178, 0, 0, 0, 0),
);

console.log(ab.a().name());

// export type System = {
//     main: Star | Planet | BinaryStar | BinaryPlanet;
//     orbits: Orbit[];
// };7

export function mass(input: Star | Planet | BinaryStar | BinaryPlanet): Mass {
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

export const earthMoonSystem: System = {
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
        Ω: 0,
        ω: 0,
        θ: 0,
    }]
};

// 0.38709927 0.20563593
// 7.00497902
// 252.25032350 77.45779628 48.33076593
export const solarSystem: System = {
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
