import { describe, it, expect } from 'vitest';
import { isIpValid, wait, hubConnectionCheck } from '../utils';

describe('isIpValid', () => {
    it('should return true for a valid IP address', () => {
        const validIp = '192.168.0.1';
        expect(isIpValid(validIp)).toBe(true);
    });

    it('should return false for an invalid IP address', () => {
        const invalidIp = '256.0.0.1';
        expect(isIpValid(invalidIp)).toBe(false);
    });

    it('should return false for an empty IP address', () => {
        const emptyIp = '';
        expect(isIpValid(emptyIp)).toBe(false);
    });
});

describe('wait', () => {
    it('should wait for the specified time', async () => {
        const delay = 1000;
        const startTime = Date.now();
        await wait(delay);
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        expect(elapsedTime).toBeGreaterThanOrEqual(delay);
    });
});