export declare type Mass = number;
export declare type Radius = number;
export declare type Density = number;
export declare type Gravity = number;
export declare type Length = number;
export declare type Eccentricity = number;
export declare type Angle = number;
export declare type Time = number;
export declare type Planet = {
    mass: Mass;
    radius: Radius;
};
export declare function planetDensity(planet: Planet): Density;
export declare function planetGravity(planet: Planet): Gravity;
export declare function starRadius(star: Star): Radius;
export declare const giant: Planet;
export declare const nine: Planet;
export declare const earth: Planet;
export declare const moon: Planet;
export declare type Star = {
    mass: Mass;
};
export declare const a: Star;
export declare const b: Star;
export declare const sun: Star;
export declare const ab: BinaryStar;
export declare type BinaryStar = OrbitalElements & {
    starA: Star;
    starB: Star;
};
export declare type BinaryPlanet = OrbitalElements & {
    planetA: Planet;
    planetB: Planet;
};
export declare type OrbitalElements = {
    a: Length;
    e: Eccentricity;
    i: Angle;
    Ω: Angle;
    ω: Angle;
    θ: Angle;
};
export declare type Orbit = OrbitalElements & {
    body: System;
};
export declare type System = {
    main: Star | Planet | BinaryStar | BinaryPlanet;
    orbits: Orbit[];
};
export declare type SystemPair = {
    main: Star | Planet | BinaryStar | BinaryPlanet;
    orbit: Orbit;
};
export declare function mass(input: Star | Planet | BinaryStar | BinaryPlanet): Mass;
export declare function trueAnomaly(input: SystemPair, epoch: Time): Angle;
export declare function unrestrictedTrueAnomaly(input: SystemPair, epoch: Time): Angle;
export declare function meanAnomaly(input: SystemPair, epoch: Time): Angle;
export declare function planetaryYear(input: SystemPair): Time;
export declare function orbitDistance(input: SystemPair, epoch: Time): Angle;
export declare function systemPairs(input: System): SystemPair[];
export declare function orbitCoordinates(inp: System, epoch: Time): [number, number, number][];
export declare function kmToAU(km: Radius): number;
export declare function angularDiameter(origin: [number, number, number], body: [number, number, number], radius: Radius): number;
export declare const system: System;
export declare const earthMoonSystem: System;
export declare const solarSystem: System;
