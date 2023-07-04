export const Frac = (inp1, inp2) => {
    if (typeof inp1 === 'object' && 'decimal' in inp1) {
        return inp1;
    }
    let value;
    if (typeof inp1 === "string") {
        const splitInp = inp1.split("/").map(x => parseInt(x));
        value = simplify(splitInp[0], splitInp[1]);
    }
    else if (typeof inp1 === "number") {
        value = simplify(inp1, inp2 !== null && inp2 !== void 0 ? inp2 : 1);
    }
    else {
        value = simplify(...inp1);
    }
    const [n, d] = value;
    return {
        value: value,
        decimal: () => n / d,
        toString: () => d === 1 ? `${n}` : `${n}/${d}`,
        add: (x) => {
            if (typeof x === "number") {
                return Frac(n + x * d, d);
            }
            else {
                const [n2, d2] = Frac(x).value;
                return Frac(n * d2 + n2 * d, d * d2);
            }
        },
        multiply: (x) => {
            if (typeof x === "number") {
                return Frac(n * x, d);
            }
            else {
                const [n2, d2] = Frac(x).value;
                return Frac(n * n2, d * d2);
            }
        },
        subtract: (x) => {
            if (typeof x === "number") {
                return Frac(n - x * d, d);
            }
            else {
                const [n2, d2] = Frac(x).value;
                return Frac(n * d2 - n2 * d, d * d2);
            }
        },
        divide: (x) => {
            if (typeof x === "number") {
                return Frac(n, d * x);
            }
            else {
                const [n2, d2] = Frac(x).value;
                return Frac(n * d2, d * n2);
            }
        },
        pow: (x) => {
            if (typeof x === "number") {
                if (Number.isInteger(x)) {
                    let out = Frac(Math.pow(n, Math.abs(x)), Math.pow(d, Math.abs(x)));
                    return x < 0 ? out.reciprocal() : out;
                }
                else {
                    return Math.pow(n / d, x);
                }
            }
            else {
                const num = Frac(x).decimal();
                if (Number.isInteger(num)) {
                    let out = Frac(Math.pow(n, Math.abs(num)), Math.pow(d, Math.abs(num)));
                    return num < 0 ? out.reciprocal() : out;
                }
                else {
                    return Math.pow(n / d, num);
                }
            }
        },
        equals: (x) => {
            const xFrac = Frac(x);
            return xFrac.value[0] === n && xFrac.value[1] === d;
        },
        reciprocal: () => Frac(d, n)
    };
};
export const Cents = (value) => {
    return {
        cents: () => {
            return Cents(value);
        },
        ratio: () => {
            return Ratio(Math.pow(2, value / 1200));
        },
        monzoApproximation: () => {
            return Monzo([Frac(value, 1200)]);
        },
        inverse: () => Cents(-value),
        interval: { type: "cents", value: value },
        concat: (interval) => {
            return Cents(value + interval.cents().interval.value);
        },
        pow: (scalar) => {
            return Cents(value * Frac(scalar).decimal());
        },
        octEquiv: (period) => {
            if (period == null)
                return Cents(value % 1200);
            else
                return Cents(value % period.cents().interval.value);
        },
        toString: () => value.toString(),
        equals: (interval) => {
            return value === interval.cents().interval.value;
        },
        greaterThan: (interval) => {
            return value > interval.cents().interval.value;
        },
        lessThan: (interval) => {
            return value < interval.cents().interval.value;
        },
        numeric: () => {
            return value;
        }
    };
};
export const Ratio = (value) => {
    return {
        cents: () => {
            return Cents(1200 * Math.log2(value));
        },
        ratio: () => {
            return Ratio(value);
        },
        monzoApproximation: () => {
            let [numerator, denominator] = Frac(value).value;
            const primeNumer = primeFactorIndexes(numerator);
            const primeDenom = primeFactorIndexes(denominator);
            let out = [];
            for (let i = 0; i < primeNumer.length; i++) {
                while (out.length <= primeNumer[i]) {
                    out.push(Frac(0));
                }
                out[primeNumer[i]] = out[primeNumer[i]].add(1);
            }
            for (let i = 0; i < primeDenom.length; i++) {
                while (out.length <= primeDenom[i]) {
                    out.push(Frac(0));
                }
                out[primeDenom[i]] = out[primeDenom[i]].subtract(1);
            }
            return Monzo(out);
        },
        inverse: () => Ratio(1 / value),
        interval: { type: "ratio", value: value },
        concat: (interval) => {
            return Ratio(value * interval.ratio().interval.value);
        },
        pow: (scalar) => {
            return Ratio(toNumber(Frac(value).pow(scalar)));
        },
        octEquiv: (period) => {
            let out = value;
            let p = period == null ? 2 : period.ratio().interval.value;
            if (value <= 1) {
                while (out <= 1) {
                    out *= p;
                }
            }
            else if (value > p) {
                while (out > p) {
                    out /= p;
                }
            }
            return Ratio(out);
        },
        toString: () => value.toString(),
        equals: (interval) => {
            return value === interval.ratio().interval.value;
        },
        greaterThan: (interval) => {
            return value > interval.ratio().interval.value;
        },
        lessThan: (interval) => {
            return value < interval.ratio().interval.value;
        },
        numeric: () => {
            return value;
        }
    };
};
export const Monzo = (inp) => {
    let value = [];
    if (Array.isArray(inp)) {
        value = inp.map((x) => typeof x === 'number' || typeof x === 'string' ? Frac(x) : x);
    }
    else {
        let numerator;
        let denominator;
        if (typeof inp === 'string') {
            if (inp.includes("/")) {
                [numerator, denominator] = inp.split("/").map((x) => parseFloat(x));
            }
            else if (inp.includes("\\")) {
                [numerator, denominator] = inp.split("\\").map((x) => parseFloat(x)); // TODO: Fix EDO 1\12 kinda thing
            }
            else {
                [numerator, denominator] = [parseFloat(inp), 1];
            }
        }
        else if (typeof inp === 'number') {
            numerator = inp;
            denominator = 1;
        }
        else {
            [numerator, denominator] = inp.value;
        }
        [numerator, denominator] = simplify(numerator, denominator);
        const primeNumer = primeFactorIndexes(numerator);
        const primeDenom = primeFactorIndexes(denominator);
        let out = [];
        for (let i = 0; i < primeNumer.length; i++) {
            while (out.length <= primeNumer[i]) {
                out.push(Frac(0));
            }
            out[primeNumer[i]] = out[primeNumer[i]].add(1);
        }
        for (let i = 0; i < primeDenom.length; i++) {
            while (out.length <= primeDenom[i]) {
                out.push(Frac(0));
            }
            out[primeDenom[i]] = out[primeDenom[i]].subtract(1);
        }
        value = out;
    }
    return {
        cents: () => Cents(monzoToCents(value)),
        ratio: () => Ratio(monzoToRatio(value).decimal()),
        monzoApproximation: () => {
            return Monzo(value);
        },
        inverse: () => Monzo(value.map((x) => x.multiply(-1))),
        interval: { type: "monzo", value: value },
        //@ts-ignore
        concat: (interval) => {
            if (interval.interval.type === "monzo") {
                const addend = interval.interval.value;
                let out = [];
                for (let i = 0; i < Math.max(value.length, addend.length); i++) {
                    out.push((value === null || value === void 0 ? void 0 : value[i]) == null ? addend[i] : ((addend === null || addend === void 0 ? void 0 : addend[i]) == null ? value[i] : addend[i].add(value[i])));
                }
                return Monzo(out);
            }
            else if (interval.interval.type === "ratio") {
                return Ratio(Monzo(value).ratio().interval.value * interval.interval.value);
            }
            else {
                return Cents(Monzo(value).cents().interval.value + interval.interval.value);
            }
        },
        pow: (scalar) => {
            return Monzo(value.map((x) => x.multiply(scalar)));
        },
        octEquiv: (period) => {
            let out = Monzo(value);
            let p = period == null ? Monzo([1]) : period;
            while (out.ratio().interval.value <= 1) {
                //@ts-ignore
                out = out.concat(p);
            }
            while (out.ratio().interval.value > p.ratio().interval.value) {
                //@ts-ignore
                out = out.concat(p.inverse());
            }
            return out;
        },
        toString: () => `|${value.map((v) => v.toString()).join(' ')}⟩`,
        toFractionString: () => monzoToRatio(value).toString(),
        fraction: () => monzoToRatio(value),
        equals: (interval) => {
            if (interval.interval.type === "monzo") {
                const addend = interval.interval.value;
                for (let i = 0; i < Math.max(value.length, addend.length); i++) {
                    if ((value === null || value === void 0 ? void 0 : value[i]) == null ? !addend[i].equals(0) : ((addend === null || addend === void 0 ? void 0 : addend[i]) == null ? !value[i].equals(0) : !addend[i].equals(value[i]))) {
                        return false;
                    }
                }
                return true;
            }
            else {
                return interval.equals(Monzo(value));
            }
        },
        greaterThan: (interval) => {
            if (interval.interval.type === "cents") {
                return monzoToCents(value) > interval.interval.value;
            }
            else {
                return monzoToRatio(value).decimal() > interval.ratio().interval.value;
            }
        },
        lessThan: (interval) => {
            if (interval.interval.type === "cents") {
                return monzoToCents(value) < interval.interval.value;
            }
            else {
                return monzoToRatio(value).decimal() < interval.ratio().interval.value;
            }
        },
    };
};
export const Scale = (value) => {
    return {
        value: value,
        sorted: () => Scale(value.sort(compareIntervals)),
        append: (inp) => {
            return Scale(value.concat([inp]));
        },
        differences: () => {
            ///@ts-ignore
            return value.slice(0, -1).map((v, i) => value[i + 1].concat(v.inverse()));
        },
        scaleUnits: () => {
            ///@ts-ignore
            let diffs = value.slice(0, -1).map((v, i) => value[i + 1].concat(v.inverse()));
            ///@ts-ignore
            let diffsCopy = [...diffs];
            let out = [];
            let ind = 0;
            for (let i = 0; i < diffs.length; i++) {
                let val = diffsCopy[0];
                ind = diffsCopy.slice(1).findIndex((d) => val.equals(d));
                if (ind === -1) {
                    out.push(val);
                }
                diffsCopy.splice(0, 1);
            }
            return out.sort(compareIntervals);
        },
        toString: () => value.sort(compareIntervals).map((v) => v.toString()).join(', '),
        toFractionString: () => value.sort(compareIntervals).map((v) => 'toFractionString' in v ? v.toFractionString() : v.toString()).join(', ')
    };
};
export const GeneratedScale = (input, count, startAt, period) => {
    let out = [];
    for (let i = 0 + (startAt !== null && startAt !== void 0 ? startAt : 0); i < count + (startAt !== null && startAt !== void 0 ? startAt : 0); i++) {
        out.push(input.pow(i).octEquiv(period));
    }
    return Scale(out).sorted();
};
export const EquivScale = (value, period) => {
    return Object.assign(Object.assign({}, Scale(value)), { at: (index) => {
            function mod(n, m) {
                return ((n % m) + m) % m;
            }
            return value[mod((index - 1), value.length)].concat(period.pow(Math.floor((index - 1) / value.length)));
        }, sorted: () => EquivScale(value.sort(compareIntervals), period), append: (inp) => {
            return EquivScale(value.concat([inp]), period);
        }, 
        // shift: (index: number) => { // TODO: Fix to shift down so first interval doesn't get extra large, and add an AbsoluteScale datatype with Hx root note
        //     let out = value.slice(index % value.length);
        //     out = out.concat(value.slice(0, index % value.length).map((n) => {
        //         return n.concat(period);
        //     })).map((n) => {
        //         return n.concat(period.pow(Math.floor(index / value.length)));
        //     });
        //     return EquivScale(out, period);
        // },
        period: period });
};
export const GeneratedEquivScale = (input, count, period, startAt) => {
    let out = [];
    for (let i = 0 + (startAt !== null && startAt !== void 0 ? startAt : 0); i < count + (startAt !== null && startAt !== void 0 ? startAt : 0); i++) {
        out.push(input.pow(i).octEquiv(period));
    }
    return EquivScale(out, period).sorted();
};
// https://www.w3resource.com/javascript-exercises/javascript-basic-exercise-132.php
export function primeFactorIndexes(num) {
    const result = [];
    const primes = [];
    for (let i = 2; i <= num; i++) {
        const primeness = isPrime(i);
        if (primeness)
            primes.push(i);
        while (primeness && num % i === 0) {
            result.push(primes.indexOf(i));
            num /= i;
        }
    }
    return result;
}
export function primeFactors(num) {
    const result = [];
    for (let i = 2; i <= num; i++) {
        const primeness = isPrime(i);
        while (primeness && num % i === 0) {
            result.push(i);
            num /= i;
        }
    }
    return result;
}
export const monzoToRatio = function (monzo) {
    if (monzo.length === 0) {
        return Frac(1);
    }
    else {
        let x = monzoToRatio(monzo.slice(0, -1));
        return x.multiply(Frac(nthPrime(monzo.length - 1)).pow(monzo[monzo.length - 1]));
    }
};
export const monzoToCents = function (monzo) {
    if (monzo.length === 0) {
        return 0;
    }
    if (monzo.length === 1) {
        return monzo[monzo.length - 1].multiply(1200).decimal();
    }
    else {
        return monzoToCents(monzo.slice(0, -1)) + (1200 * Math.log2(Math.pow(nthPrime(monzo.length - 1), monzo[monzo.length - 1].decimal())));
    }
};
export const nthPrime = function (n) {
    let primes = [2];
    let i = 3;
    while (primes.length <= n) {
        if (isPrime(i)) {
            primes.push(i);
        }
        i++;
    }
    return primes[n];
};
export const isPrime = function (n) {
    for (let i = 2; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            return false;
        }
    }
    return true;
};
// https://stackoverflow.com/questions/586182/how-to-insert-an-item-into-an-array-at-a-specific-index-javascript
export const insert = function (arr, index, ...newItems) {
    return [
        // part of the array before the specified index
        ...arr.slice(0, index),
        // inserted items
        ...newItems,
        // part of the array after the specified index
        ...arr.slice(index)
    ];
};
// https://stackoverflow.com/questions/4652468/is-there-a-javascript-function-that-reduces-a-fraction
export function simplify(n, d) {
    let timeout = 0;
    let numOne = n;
    let numTwo = d;
    while (!Number.isInteger(numOne) && timeout < 1000000) {
        numOne *= 10;
        numTwo *= 10;
        timeout += 1;
    }
    while (!Number.isInteger(numTwo) && timeout < 1000000) {
        numOne *= 10;
        numTwo *= 10;
        timeout += 1;
    }
    const gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    };
    let gcdValue = gcd(numOne, numTwo);
    numOne = numOne / gcdValue;
    numTwo = numTwo / gcdValue;
    if (numTwo < 0) {
        numOne = -numOne;
        numTwo = -numTwo;
    }
    if (timeout >= 1000000) {
        throw new Error(`Timeout reached for ${n}/${d}`);
    }
    return [numOne, numTwo];
}
export const toNumber = (x) => {
    if (typeof x === 'number') {
        return x;
    }
    else {
        return Frac(x).decimal();
    }
};
export const compareIntervals = (a, b) => {
    if (a.equals(b)) {
        return 0;
    }
    else if (a.greaterThan(b)) {
        return 1;
    }
    else if (a.lessThan(b)) {
        return -1;
    }
    else {
        throw new Error(`Comparison Error, ${a.toString()} =? ${b.toString()}`);
    }
};
export const edo = (n) => {
    let out = [];
    for (let i = 1; i <= n; i++) {
        out.push(Monzo([Frac(i, n)]));
    }
    return EquivScale(out, Monzo([1]));
};
// console.log(Ratio(1).concat(Monzo(['-9/12'])).concat(Cents(-1200 * 2)).interval.value as number * 440);
// console.log(edo(12).toString());
