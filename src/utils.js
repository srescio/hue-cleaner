import { invoke } from '@tauri-apps/api'

export const isIpValid = (ip) => !!ip?.match(/^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/);

export const hubConnectionCheck = async (hueIp) => {
    const hueHubApiUrl = `https://${hueIp}/api`;
    const response = await invoke('get_api_key', { hueHubApiUrl });
    try {
        const jsonResponse = JSON.parse(response);
        return jsonResponse.at(0).error.type === 101 || !!jsonResponse.at(0).success.username;
    } catch (error) {
        console.error(error);
    }
    return false;
}