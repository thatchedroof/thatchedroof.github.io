type Mass = number;
type Radius = number;
type Density = number;
type Gravity = number;

type Length = number;
type Eccentricity = number;
type Angle = number;
type Time = number;

type Planet = {
    mass: Mass;
    radius: Radius;
};

export function planetDensity(planet: Planet): Density {
    return planet.mass / (planet.radius * planet.radius * planet.radius);
}

export function planetGravity(planet: Planet): Gravity {
    return planet.mass / (planet.radius * planet.radius);
}

const giant: Planet = {
    mass: 594.4858,
    radius: 11.444303
};

const nine: Planet = { // NOT REAL
    mass: 594.4858,
    radius: 11.444303
};

const earth: Planet = {
    mass: 1,
    radius: 6378.137
};

const moon: Planet = {
    mass: 0.0123032,
    radius: 1738.1
};

type Star = {
    mass: Mass;
};

const a: Star = {
    mass: 404698.375
};

const b: Star = {
    mass: 263859.877
};

const sun: Star = {
    mass: 333030
};

const ab: BinaryStar = {
    starA: a,
    starB: b,
    a: 0.2731, // Not Real
    e: 0.4178,
    i: 0,
    Ω: 0,
    ω: 0,
    θ: 0,
};

type BinaryStar = OrbitalElements & {
    starA: Star;
    starB: Star;
};

type BinaryPlanet = OrbitalElements & {
    planetA: Planet;
    planetB: Planet;
};

type OrbitalElements = {
    a: Length;
    e: Eccentricity;
    i: Angle;
    Ω: Angle;
    ω: Angle;
    θ: Angle;
};

type Orbit = OrbitalElements & {
    body: System;
};

type System = {
    main: Star | Planet | BinaryStar | BinaryPlanet;
    orbits: Orbit[];
};

type SystemPair = {
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
}

export function trueAnomaly(input: SystemPair, epoch: Time): Angle {
    let mean = meanAnomaly(input, epoch);
    let iter = mean * (Math.PI / 180);
    for (var i = 0; i < 100; i++) {
        iter = mean * (Math.PI / 180) + input.orbit.e * Math.sin(iter);
    }
    const out = ((((2 * Math.atan(Math.pow((1 + input.orbit.e) / (1 - input.orbit.e), 1 / 2) * Math.tan(iter / 2))) * (180 / Math.PI)) % 360) + 360) % 360;
    return out * (Math.PI / 180);
}

export function meanAnomaly(input: SystemPair, epoch: Time): Angle {
    return (epoch / planetaryYear(input)) * 360;
}

export function planetaryYear(input: SystemPair): Time {
    return Math.sqrt(input.orbit.a ** 3 / (mass(input.main)));
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

export let auScale = 40;

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
                a: 0.00826651492403 * auScale,
                e: 0.00074,
                i: 33.7 * (Math.PI / 180),
                Ω: 0,
                ω: 0,
                θ: 0,
            }]
        },
        a: 1.1106 * auScale,
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
                a: 0.00256955529 * auScale,
                e: 0.0549,
                i: 5.145 * (Math.PI / 180),
                Ω: 0,
                ω: 0,
                θ: 0,
            }]
        },
        a: 1 * auScale,
        e: 0.0167,
        i: 0,
        Ω: 0,
        ω: 0,
        θ: 0,
    }]
};

for (let i = 0; i < 100; i++) {
    console.log(systemPairs(system).map((input) => { return trueAnomaly(input, i / 100); })[0]);
    //console.log(systemPairs(system).map((input) => { return orbitDistance(input, i / 100); })[0]);
}
console.log(systemPairs(systemPairs(earthMoonSystem)[0].orbit.body)[0]);
console.log(planetaryYear(systemPairs(systemPairs(earthMoonSystem)[0].orbit.body)[0]));
