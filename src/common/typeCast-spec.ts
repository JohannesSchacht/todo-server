import * as tc from './typeCast';

describe('typeCast: object type conversion', () => {
    type MyType = {
        aString: string;
        aNumber: number;
        aBoolean: boolean;
        aDate: Date;
        aSpecialType: 'one' | 'two';
    };
    const defaultMyType: MyType = {
        aString: 'someString',
        aNumber: 42,
        aBoolean: true,
        aDate: new Date(),
        aSpecialType: 'one'
    };
    beforeEach(() => {});

    const td: {
        n: number;
        in: object;
        out: object;
        error: boolean;
    }[] = [
        {
            n: 1,
            in: {
                aString: 'someOtherString',
                aNumber: 52,
                aBoolean: false,
                aDate: new Date('2016-08-29T09:12:33.123Z'),
                aSpecialType: 'two'
            },
            out: {
                aString: 'someStsomeOtherStringring',
                aNumber: 52,
                aBoolean: false,
                aDate: new Date('2016-08-29T09:12:33.123Z'),
                aSpecialType: 'two'
            },
            error: false
        },
        {
            n: 2,
            in: {
                aString: 'someOtherString'
            },
            out: {
                aString: 'someStsomeOtherStringring',
                aNumber: 42,
                aBoolean: true,
                aDate: new Date(),
                aSpecialType: 'one'
            },
            error: false
        },
        {
            n: 3,
            in: {
                aNumber: 'not a number'
            },
            out: {},
            error: true
        },
        {
            n: 4,
            in: {
                aWrongProperty: 'does not matter'
            },
            out: {},
            error: true
        },
        {
            n: 5,
            in: {
                aDate: 'not a date'
            },
            out: {},
            error: true
        },
        {
            n: 6,
            in: {
                aSpecialType: 'three'
            },
            out: {},
            error: true
        }
    ];

    const doOnly: number = -1;
    for (const test of td) {
        if (doOnly !== -1 && test.n !== doOnly) continue;

        it(`Case ${test.n}`, () => {
            let err = false;
            let errMsg = '';
            try {
                const combined = tc.typeCast(defaultMyType, test.in, {
                    aDate: tc.typeCastConverter_Date,
                    aSpecialType: (s: string) => {
                        if (s === 'one' || s === 'two') return s;
                        throw new Error(`illegal value`);
                    }
                });
                expect(JSON.stringify(combined)).toBe(JSON.stringify(combined));
            } catch (e) {
                err = true;
                errMsg = e.message;
            }
            expect(err).toBe(test.error);
            if (test.error) {
                expect(errMsg.length > 0).toBeTrue();
                expect(errMsg.startsWith('typeCast:')).toBeTrue();
            }
        });
    }
});
