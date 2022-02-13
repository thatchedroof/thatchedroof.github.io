export type Mass = number;
export type Radius = number;
export type Density = number;
export type Gravity = number;

export type Length = number;
export type Eccentricity = number;
export type Angle = number;
export type Time = number;

export type Planet = {
    mass: Mass;
    radius: Radius;
};

export function planetDensity(planet: Planet): Density {
    return planet.mass / (planet.radius * planet.radius * planet.radius);
}

export function planetGravity(planet: Planet): Gravity {
    return planet.mass / (planet.radius * planet.radius);
}

export function starRadius(star: Star): Radius {// * 695508
    return ((star.mass / 332967.75) ** 0.74) * 695508;
}

export const giant: Planet = {
    mass: 594.4858,
    radius: 11.444303
};

export const nine: Planet = { // NOT REAL
    mass: 594.4858,
    radius: 11.444303
};

export const earth: Planet = {
    mass: 1,
    radius: 6378.137
};

export const moon: Planet = {
    mass: 0.0123032,
    radius: 1738.1
};

export type Star = {
    mass: Mass;
};

export const a: Star = {
    mass: 404698.375
};

export const b: Star = {
    mass: 263859.877
};

export const sun: Star = {
    mass: 332967.75
};

export const ab: BinaryStar = {
    starA: a,
    starB: b,
    a: 0.2731, // Not Real
    e: 0.4178,
    i: 0,
    Ω: 0,
    ω: 0,
    θ: 0,
};

export type BinaryStar = OrbitalElements & {
    starA: Star;
    starB: Star;
};

export type BinaryPlanet = OrbitalElements & {
    planetA: Planet;
    planetB: Planet;
};

export type OrbitalElements = {
    a: Length;
    e: Eccentricity;
    i: Angle;
    Ω: Angle;
    ω: Angle;
    θ: Angle;
};

export type Orbit = OrbitalElements & {
    body: System;
};

export type System = {
    main: Star | Planet | BinaryStar | BinaryPlanet;
    orbits: Orbit[];
};

export type SystemPair = {
    main: Star | Planet | BinaryStar | BinaryPlanet;
    orbit: Orbit;
};

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

export const system: System = {
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
