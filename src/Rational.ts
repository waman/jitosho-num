import { gcd } from "./GCDandLCM";

export class Rational{

    private readonly n: number;
    private readonly d: number;

    constructor(numerator: number, denominator: number, isRedeced = false){
        if(denominator === 0) throw new Error('Denominator must not be 0.')

        let num: number, deno: number;
        if(denominator < 0){
            num = -numerator; deno = -denominator;
        }else{
            num = numerator; deno = denominator;
        }

        if(isRedeced){
            this.n = num;
            this.d = deno;
        }else{
            const g = gcd(num, deno);
            this.n = num/g;
            this.d = deno/g;
        }
    }

    numerator(): number { return this.n; }
    denominator(): number { return this.d; }

    toNumber(): number { return this.n/this.d; }
}