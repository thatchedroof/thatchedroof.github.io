import { Length, Time, Mass, VolumeDensity, Dimensionless, PlaneAngle } from "safe-units";
import * as u from "safe-units";
export declare type IPlanet = {
    name: () => string;
    mass: () => Mass;
    radius: () => Length;
    density: () => VolumeDensity;
};
export declare const Planet: (n: string, m: u.GenericMeasure<number, {
    mass: "1";
}>, r: u.GenericMeasure<number, {
    length: "1";
}>) => IPlanet;
export declare const earthMasses: any;
export declare const solarMasses: any;
export declare const astronomicalUnits: any;
export declare type IStar = {
    name: () => string;
    mass: () => Mass;
    radius: () => Length;
};
export declare const Star: (n: string, m: u.GenericMeasure<number, {
    mass: "1";
}>) => IStar;
export declare const giant: IPlanet;
export declare const nine: IPlanet;
export declare const earth: IPlanet;
export declare const moon: IPlanet;
export declare const a: IStar;
export declare const b: IStar;
export declare const sun: IStar;
export declare type IOrbitalElements = {
    a: () => Length;
    e: () => Dimensionless;
    i: () => PlaneAngle;
    Ω: () => PlaneAngle;
    ω: () => PlaneAngle;
    θ: () => PlaneAngle;
};
export declare type IOrbit = IOrbitalElements & {
    main: () => IPlanet | IStar;
    orbit: () => IPlanet | IStar;
    orbitalPeriod: () => Time;
    orbitalElements: () => IOrbitalElements;
};
export declare const Orbit: (main: IPlanet | IStar, orbit: IPlanet | IStar, a: u.GenericMeasure<number, {
    length: "1";
}>, e: u.GenericMeasure<number, {}>, i: u.GenericMeasure<number, {
    planeAngle: "1";
}>, Ω: u.GenericMeasure<number, {
    planeAngle: "1";
}>, ω: u.GenericMeasure<number, {
    planeAngle: "1";
}>, θ: u.GenericMeasure<number, {
    planeAngle: "1";
}>) => IOrbit;
