/**
 * ContinuedFraction class represents a continued fraction:
 * 
 *   pd0 + pn1/(pd1 +) pn2/(pd2 +) pn3/(pd3 +) ...
 * 
 * where *pd*s are partial denominators and *pn*s are partial numerators.
 * 
 * ContinuedFraction instances can be created by an anonymous subclass of *ContinuedFraction* class.
 * 
 * Ref: 『Javaによるアルゴリズム事典』 連分数 (continued fraction) EvalFrac.java, ContFrac.java
 */

import { gcd } from "./GCDandLCM";
import { Rational } from "./Rational";

export abstract class ContinuedFraction {

    /** 
     * Return *i*-th partial numerator.
     * If you end up the sequence, return 0.
     */
    abstract partialNumerator(i: number): number;

    /** 
     * Return *i*-th partial denominator.
     * If you end up the sequence, return *Number.POSITIVE_INFINITY*.
     */
    abstract partialDenominator(i: number): number;

    evalUpto(n: number): number {
        let f = 0;
        for(let i = n; i > 0; i--){
            f = this.partialNumerator(i)/(this.partialDenominator(i) + f);
        }
        return this.partialDenominator(0) + f;
    }

    eval(epsilon = 0, nMax = 1000): number {
        let p1 = 1, q1 = 0, p2 = this.partialDenominator(0), q2 = 1;
        let prev = p2;

        for(let i = 1; i < nMax; i++){
            const pn = this.partialNumerator(i);
            const pd = this.partialDenominator(i);

            let t;
            t = p1 * pn + p2 * pd; p1 = p2; p2 = t;
            t = q1 * pn + q2 * pd; q1 = q2; q2 = t;
            if(q2 !== 0){
                p1 /= q2; q1 /= q2; p2 /= q2; q2 = 1;
            }else{
                // TODO
                p2 = p2 >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
            }
            if(Math.abs(prev - p2) <= epsilon) break;
        }
        return p2;
    }
}

/**
 * SimpleContinuedFraction represents a simple continued fraction, whose partial numerators are all 1.
 * 
 *   c0 + 1/(c1 +) 1/(c2 +) 1/(c3 +) ...
 * 
 * SimpleContinuedFraction instances can be created by the static *create*() method of 
 * *SimpleContinuedFraction* class or by an anonymous subclass of *SimpleContinuedFraction* class.
 */
export abstract class SimpleContinuedFraction extends ContinuedFraction{

    /** 
     * Return *i*-th coefficient (partial denominator).
     * If you end up the sequence, return *Number.POSITIVE_INFINITY*
     * Coefficients of negative index are prefered to be 0, but not necessary.
     */
    abstract coefficient(i: number): number;
    partialNumerator(_: number): number { return 1; }
    partialDenominator(i: number): number { return this.coefficient(i); }
    depth(): number { return Number.POSITIVE_INFINITY };

    evalUpto(n: number): number {
        let f = 0;
        for(let i = n; i > 0; i--){
            f = 1/(this.coefficient(i) + f);
        }
        return this.coefficient(0) + f;
    }

    eval(epsilon: number = 0, nMax = 1000): number{
        let p1 = 1, q1 = 0, p2 = this.coefficient(0), q2 = 1;
        let prev = p2;

        for(let i = 1; i < nMax; i++){
            const c = this.coefficient(i);

            let t;
            t = p1 + p2 * c; p1 = p2; p2 = t;
            t = q1 + q2 * c; q1 = q2; q2 = t;
            if(q2 !== 0){
                p1 /= q2; q1 /= q2; p2 /= q2; q2 = 1;
            }else{
                // TODO
                p2 = p2 >= 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
            }
            if(Math.abs(prev - p2) <= epsilon) break;
        }
        return p2;
    }

    /**
     * Return a reduced fraction (rational number) of this continued fraction with the specified depth:
     * 
     *   c(0) + 1/(c(1) +) 1/(c(2) +) 1/(c(1) +) ... 1/(c(*depth*))
     */
    toRational(evalDepth = this.depth()): Rational {
        if(!isFinite(evalDepth)) 
            throw new Error('Infinite depth continued fraction cannot convert to a rational');

        let num = this.coefficient(evalDepth), deno = 1;
        for(let i = evalDepth-1; i >= 0; i--){
            const temp = this.coefficient(i) * num + deno; deno = num; num = temp;
            const d = gcd(num, deno); num /= d; deno /= d;
        }
        return new Rational(num, deno, true);
    }

    static create(c0: number, ...cs: number[]): SimpleContinuedFraction{
        const array = new Array<number>();
        array.push(c0);
        return new ArraySimpleContinuedFraction(array.concat(cs));
    }

    static fromNumber(x: number): SimpleContinuedFraction {
        return new SimpleContinuedFractionFromNumber(x);
    }
}

class ArraySimpleContinuedFraction extends SimpleContinuedFraction{

    constructor(private readonly cs: number[]){
        super();
    }

    depth(): number { return this.cs.length-1; }

    coefficient(i: number): number { 
        if(i < 0)
            return 0;
        else if(i < this.cs.length)
            return this.cs[i];
        else
            return Number.POSITIVE_INFINITY;
    }
}

class SimpleContinuedFractionFromNumber extends SimpleContinuedFraction{

    private coefficients: number[] = new Array<number>();

    constructor(private x: number){
        super();
        this.coefficients.push(Math.floor(x));
    }

    coefficient(i: number): number {
        if(this.coefficients.length <= i){
            for(let j = this.coefficients.length-1; j <= i; j++){
                this.x = 1/(this.x - this.coefficients[j]);
                this.coefficients.push(Math.floor(this.x));
            }
        }
        return this.coefficients[i];
    }

}