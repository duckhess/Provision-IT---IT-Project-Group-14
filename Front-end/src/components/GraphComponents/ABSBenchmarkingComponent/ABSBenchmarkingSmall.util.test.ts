import {describe, it, expect} from 'vitest';
import {getScoreColor} from './ABSBenchmarkingSmall';

describe ('getScoreColor function', () =>{
    it('returns green for score >= 70', () => {
        expect(getScoreColor(100)). toBe("text-green-600");
        expect(getScoreColor(70)).toBe("text-green-600");
    })

    it('returns yellow for score between 50 and 69', ()=>{
        expect(getScoreColor(69)).toBe("text-yellow-500");
        expect(getScoreColor(50)).toBe("text-yellow-500");
    })

    it('return red for score below 50',()=>{
        expect(getScoreColor(49)).toBe("text-red-500");
        expect(getScoreColor(0)).toBe("text-red-500");
    })
})