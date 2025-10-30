import {describe, it, expect} from 'vitest';
import getScoreColour from './getScoreColour';

describe ('getScoreColor function', () =>{
    it('returns green for score >= 75', () => {
        expect(getScoreColour(100)). toBe("text-green-600");
        expect(getScoreColour(75)).toBe("text-green-600");
    })

    it('returns yellow for score between 50 and 74', ()=>{
        expect(getScoreColour(74)).toBe("text-yellow-500");
        expect(getScoreColour(50)).toBe("text-yellow-500");
    })

    it('return red for score below 50',()=>{
        expect(getScoreColour(49)).toBe("text-red-500");
        expect(getScoreColour(0)).toBe("text-red-500");
    })
})