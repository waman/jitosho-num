/**
 * Return the GCD (greatest common divisor) of the two argument numbers.
 * 
 * Ref: 『Javaによるアルゴリズム事典』 最大公約数 (greatest common divisor) GCD.java
 */
export function gcd(a: number, b: number): number {
    return Math.abs(gcdSigned(a, b));
}

function gcdSigned(a: number, b: number): number {
    if(b === 0) return a;
    else return gcdSigned(b, a % b);
}

/**
 * Return the GCD (greatest common divisor) of the one or more argument numbers.
 * 
 * Ref: 『Javaによるアルゴリズム事典』 最大公約数 (greatest common divisor) GCD.java
 */
export function ngcd(a: number, ...bs: number[]): number {
    let d = a;
    for(let i = 0; i < bs.length && d !== 1; i++){
        d = gcdSigned(bs[i], d);
    }
    return Math.abs(d);
}

/**
 * Return the LCM (least common multiplier) of the two argument numbers.
 * 
 * Ref: 『Javaによるアルゴリズム事典』 最大公約数 (greatest common divisor) GCD.java
 */
export function lcm(a: number, b: number): number {
    if(a === 0 && b === 0) return 0;
    return Math.abs((a / gcdSigned(a, b)) * b);
}

/**
 * Return the LCM of the one or more argument numbers.
 */
export function nlcm(a: number, ...bs: number[]): number {
    let d = a;
    for(let i = 0; i < bs.length && d !== 1; i++){
        d = lcm(bs[i], d);
    }
    return Math.abs(d);
}

/**
 * The argument numbers *a*, *b* must be positive.
 * 
 * Ref: 『Javaによるアルゴリズム事典』 最大公約数 (greatest common divisor) GCDandLCM.java
 */
export function binaryGCD(a: number, b: number): number {
    if(a <= 0 || b <= 0) throw new Error(`The argument must be positive: ${a}, ${b}`);
    if(a === 1 || b === 1) return 1;

    let u = a, v = b, d = 1;
    while((u & 1) === 0 && (v & 1) === 0){
        d <<= 1; u >>= 1; v >>= 1;
    }

    let t = (u & 1) === 0 ? u : -v;

    while(t !== 0){
        if(t > 0){
            while((t & 1) === 0) t >>= 1;
            u = t;
        }else{
            let s = -t;
            while((s & 1) === 0) s >>= 1;
            v = s;
        }
        t = u - v;
    }

    return u * d;
}