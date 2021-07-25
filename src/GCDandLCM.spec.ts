import { assert } from 'chai';
import { binaryGCD, gcd, lcm, ngcd, nlcm } from './GCDandLCM';

function repeat(n: number, f: () => void){
    for(let i = 0; i < n; i++)f();
}

function irand(): number{
    const x =  Math.floor(Math.random() * 20000 - 10000);
    if(x === 0) return irand();
    else        return x;
}

describe('gcd', () => {

    it('should return the gcd of two numbers which include 0 or 1', () => {
        assert.equal(gcd(1, 13), 1);
        assert.equal(gcd(0, 13), 13);
        
        assert.equal(gcd(102, 1), 1);
        assert.equal(gcd(102, 0), 102);

        assert.equal(gcd(1, 1), 1);
        assert.equal(gcd(0, 1), 1);
        assert.equal(gcd(1, 0), 1);
        assert.equal(gcd(0, 0), 0);
    });

    it('should return the gcd of the two positive argument', () => {

        repeat(3000, () => {
            const a = irand(), b = irand();
            const d = gcd(a, b);
            assert(d > 0, `gcd is not positive`);  // 0 is excluded in the argument

            assert.equal(a % d, 0);
            assert.equal(b % d, 0);
            assert.equal(gcd(a/d, b/d), 1);
        });
    });
});

describe('ngcd', () => {

    it('should return the gcd of one or more numbers', () => {
        assert.equal(ngcd(9*3, 9*7, 9*21), 9);
        assert.equal(ngcd(13*2, 13*10, 13*99, 13*3), 13);
        assert.equal(ngcd(13*2, 13*3), 13);
        assert.equal(ngcd(13), 13);

        assert.equal(ngcd(9*3, -9*7, 9*21), 9);
        assert.equal(ngcd(-13), 13);
    });
})

describe('lcm', () => {

    it('should return the lcm of two numbers which include 0 or 1', () => {
        assert.equal(lcm(1, 13), 13);
        assert.equal(lcm(0, 13), 0);
        
        assert.equal(lcm(102, 1), 102);
        assert.equal(lcm(102, 0), 0);

        assert.equal(lcm(1, 1), 1);
        assert.equal(lcm(0, 1), 0);
        assert.equal(lcm(1, 0), 0);
        assert.equal(lcm(0, 0), 0);
    });

    it('should return the lcm of the two positive argument', () => {

        repeat(3000, () => {
            const a = irand(), b = irand();
            const d = lcm(a, b);
            assert(d > 0, `lcm is not positive`);  // 0 is excluded in the argument

            assert.equal(d % a, 0);
            assert.equal(d % b, 0);
            assert.equal(gcd(d/a, d/b), 1);
        });
    });
});

describe('nlcm', () => {

    it('should return the lcm of one or more numbers', () => {
        assert.equal(nlcm(9*3, 9*7, 9*21), 9*21);
        assert.equal(nlcm(13*2, 13*10, 13*99, 13*3), 13*990);
        assert.equal(nlcm(13*2, 13*3), 13*6);
        assert.equal(nlcm(13), 13);

        assert.equal(nlcm(9*3, -9*7, 9*21), 9*21);
        assert.equal(nlcm(-13), 13);
    });
})

describe('binaryGCD', () => {

    it('should throw an error when the arguments include non-positive number', () => {
        assert.throw(() => { binaryGCD( 0,  2) });
        assert.throw(() => { binaryGCD( 1,  0) });
        assert.throw(() => { binaryGCD( 0,  0) });

        assert.throw(() => { binaryGCD(-1,  2) });
        assert.throw(() => { binaryGCD( 1, -2) });
        assert.throw(() => { binaryGCD(-1, -2) });
        
        assert.throw(() => { binaryGCD( 0, -2) });
        assert.throw(() => { binaryGCD(-1,  0) });
    });

    it('should return 1 when the argument include 1', () => {
        assert.equal(binaryGCD(1, 13), 1);
        assert.equal(binaryGCD(13, 1), 1);
    });

    it('should return the gcd of the two positive argument', () => {
        function positiveInteger(){
            return Math.round(Math.random() * 10000 + 1);
        }

        repeat(1000, () => {
            const a = positiveInteger(), b = positiveInteger();
            assert.equal(binaryGCD(a, b), gcd(a, b));
        });
    });
});