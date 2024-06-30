import { describe, it, expect } from 'vitest';
import { isIpValid, wait, hubConnectionCheck, fetchApiKey } from '../utils';
import { mockIPC } from "@tauri-apps/api/mocks";

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
        const delay = 500;
        const startTime = Date.now();
        await wait(delay);
        const endTime = Date.now();
        const elapsedTime = endTime - startTime;
        expect(elapsedTime).toBeGreaterThanOrEqual(delay);
    });
});

describe('hubConnectionCheck', () => {
    it('should return true when Tauri invoke returns a successful response', async () => {
        // GIVEN
        const invokeSuccessResponse = JSON.stringify([{ success: { username : 'succes' } }]);
        const testIp = '11';

        mockIPC((cmd, args) => {
            expect(cmd).toBe('get_api_key');
            expect(args).toEqual({ hueHubApiUrl: `https://${testIp}/api` });
            return invokeSuccessResponse;
          });
        // WHEN
        const result = await hubConnectionCheck(testIp);
        // THEN
        expect(result).toBe(true);
    });

    it('should return true when Tauri invoke returns a specific error code', async () => {
        // GIVEN
        const invokeErrorOkResponse = JSON.stringify([{ error: { type : 101 } }]);
        const testIp = '123';

        mockIPC((cmd, args) => {
            expect(cmd).toBe('get_api_key');
            expect(args).toEqual({ hueHubApiUrl: `https://${testIp}/api` });
            return invokeErrorOkResponse;
          });
        // WHEN
        const result = await hubConnectionCheck(testIp);
        // THEN
        expect(result).toBe(true);
    });

    it('should return false when Tauri invoke cannot parse the response', async () => {
        // GIVEN
        const invokeErrorKoResponse = JSON.stringify('error');
        const testIp = '123';

        mockIPC((cmd, args) => {
            expect(cmd).toBe('get_api_key');
            expect(args).toEqual({ hueHubApiUrl: `https://${testIp}/api` });
            return invokeErrorKoResponse;
          });
        // WHEN
        const result = await hubConnectionCheck(testIp);
        // THEN
        expect(result).toBe(false);
    });
});

describe('fetchApiKey', () => {
    it('should return the API key when Tauri invoke returns a successful response', async () => {
        // GIVEN
        const invokeSuccessResponse = JSON.stringify([{ success: { username: 'api_key' } }]);
        const testIp = '192.168.0.1';
        mockIPC((cmd, args) => {
            expect(cmd).toBe('get_api_key');
            expect(args).toEqual({ hueHubApiUrl: `https://${testIp}/api` });
            return invokeSuccessResponse;
        });
        // WHEN
        const result = await fetchApiKey(testIp);
        // THEN
        expect(result).toBe('api_key');
    });

    it('should return false when Tauri invoke returns an error response', async () => {
        // GIVEN
        const invokeErrorResponse = JSON.stringify([{ error: { type: 101 } }]);
        const testIp = '192.168.0.1';
        mockIPC((cmd, args) => {
            expect(cmd).toBe('get_api_key');
            expect(args).toEqual({ hueHubApiUrl: `https://${testIp}/api` });
            return invokeErrorResponse;
        });
        // WHEN
        const result = await fetchApiKey(testIp);
        // THEN
        expect(result).toBe(false);
    });

    it('should return false when Tauri invoke cannot parse the response', async () => {
        // GIVEN
        const invokeErrorKoResponse = JSON.stringify('error');
        const testIp = '192.168.0.1';
        mockIPC((cmd, args) => {
            expect(cmd).toBe('get_api_key');
            expect(args).toEqual({ hueHubApiUrl: `https://${testIp}/api` });
            return invokeErrorKoResponse;
        });
        // WHEN
        const result = await fetchApiKey(testIp);
        // THEN
        expect(result).toBe(false);
    });
});