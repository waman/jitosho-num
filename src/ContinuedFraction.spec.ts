import { assert } from 'chai';
import { ContinuedFraction, SimpleContinuedFraction } from './ContinuedFraction';

describe('ContinuedFraction', () => {

    describe('#evalUpto()', () => {

        it('should return', () => {
            const x = Math.random() * 2 * Math.PI;
            const cf = new class extends ContinuedFraction {
                partialNumerator(i: number): number {
                    if(i === 1) return x;
                    else        return -x * x;
                }
                partialDenominator(i: number): number {
                    if(i === 0) return 0;
                    else        return 2 * i - 1;
                }
            }();
            assert.approximately(cf.evalUpto(20), Math.tan(x), 1e-8);
        });
    });
});

describe('SimpleContinuedFraction', () => {

    const sqrt2 = new class extends SimpleContinuedFraction{
        /** [1, 2, 2, 2, 2,...] */
        coefficient(i: number): number {
            if(i === 0) return 1;
            else        return 2;
        }
    }

    it('#evalUpto()', () => {
        const finiteCF = new class extends SimpleContinuedFraction{
            /** [1, 2, 2, 2, 2, POSITIVE_INFINITY,...] */
            coefficient(i: number): number {
                if(i === 0) return 1;
                else if(i < 5) return 2;
                else return Number.POSITIVE_INFINITY;
            }
        }

        assert.equal(finiteCF.evalUpto(0), 1, 'upto 0');
        assert.equal(finiteCF.evalUpto(1), 1+1/2, 'upto 1');
        assert.equal(finiteCF.evalUpto(2), 1+1/(2+1/2), 'upto 2');
        assert.equal(finiteCF.evalUpto(3), 1+1/(2+1/(2+1/2)), 'upto 3');
        assert.equal(finiteCF.evalUpto(4), 1+1/(2+1/(2+1/(2+1/2))), 'upto 4');
        assert.equal(finiteCF.evalUpto(5), 1+1/(2+1/(2+1/(2+1/2))), 'upto 5');
        assert.equal(finiteCF.evalUpto(6), 1+1/(2+1/(2+1/(2+1/2))), 'upto 6');
    })

    it('#eval()', () => {
        assert.approximately(sqrt2.eval(), Math.SQRT2, 1e-8);
    });

    it('#evalWith(cond)', () => {
        const result = sqrt2.evalWith((prev, current) => Math.abs(prev - current) <= 1e-6);
        assert(result !== Math.SQRT2);
        assert.approximately(result, Math.SQRT2, 1e-6);
    });

    describe('#toRational', () => {

        it('should throw an error if SimpleContinuedFraction has infinit depth', () => {
            assert.throw(() => { sqrt2.toRational() });
        });

        it('should return a reduced rational number (fraction)', () => {
            const scf = SimpleContinuedFraction.create(1, 2, 3, 4);
            const r = scf.toRational();
            assert.equal(r.numerator(), 43);
            assert.equal(r.denominator(), 30);
            assert.equal(r.toNumber(), 1+1/(2+1/(3+1/4)));
        });

        it('should return a reduced rational number with the specified depth when depth is passed', () => {
            const scf = SimpleContinuedFraction.create(1, 2, 3, 4, 5, 6, 7);
            const r = scf.toRational(3);
            assert.equal(r.numerator(), 43);
            assert.equal(r.denominator(), 30);
            assert.equal(r.toNumber(), 1+1/(2+1/(3+1/4)));

            assert.equal(scf.toRational().toNumber(), 1+1/(2+1/(3+1/(4+1/(5+1/(6+1/7))))));
        });
    });

    // static factory methods
    it('#create()', () => {
        const scf = SimpleContinuedFraction.create(1, 2, 3, 4);
        assert.equal(scf.depth(), 3);
        assert.equal(scf.coefficient(0), 1);
        assert.equal(scf.coefficient(1), 2);
        assert.equal(scf.coefficient(2), 3);
        assert.equal(scf.coefficient(3), 4);

        assert(!isFinite(scf.coefficient(4)));
        assert(!isFinite(scf.coefficient(5)));

        assert.equal(scf.coefficient(-1), 0);
    });

    it('#fromNumber()', () => {
        const sqrt2 = SimpleContinuedFraction.fromNumber(Math.SQRT2);
        assert(sqrt2.coefficient(0) === 1)
        for(let i = 1; i < 20; i++){
            assert(sqrt2.coefficient(i) === 2, `fail at i=${i}`);
        }
    });
});