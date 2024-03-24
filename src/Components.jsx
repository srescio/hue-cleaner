import { useEffect } from 'react'
import useHueContext from './Context'
import { isIpValid } from './utils'
import { invoke } from '@tauri-apps/api'

export const Header = () => {
  return (
    <header>
      <h1><span className='hue'>hue</span> Cleaner</h1>
    </header>
  )
}

export const HubIpInput = () => {
    const { state: { hueIp, canConnect, connectionChecked }, dispatch } = useHueContext()
    const updateHueIp = (e) => {
        const { value } = e.target
        dispatch({ hueIp: value, isManualChange: true })
        if (!isIpValid(value)) return;
        localStorage.setItem('hueIp', value)
    }
    const canConnectFlag = canConnect ? '✅' : '❌';

    return (
        <article>
            <input
                id="hue-ip"
                maxLength="15"
                onChange={updateHueIp}
                placeholder='Set your hue Hub IP'
                defaultValue={hueIp} /> {connectionChecked && <span className="is-valid-flag">{canConnectFlag}</span>}
            {!hueIp && <p>Open the Hue app on your phone, go to settings, and select the Hue Bridge you want to connect to. The IP address will be listed there.</p>}
        </article>
    )
}

export const ConnectionCheck = ({children}) => {
    const { state: {
        hueIp,
        isManualChange,
        connectionChecking,
        connectionChecked,
        dismissConnectionCheck,
        canConnect
    }, dispatch } = useHueContext()

    const hueHubApiUrl = `https://${hueIp}/api`;

    useEffect(() => {
        if (!isManualChange) return;
        dispatch({ dismissConnectionCheck: false, connectionChecked: false, canConnect: false});
    }, [hueIp])

    useEffect(() => {
        check()
    }, [])

    const check = async (e) => {
        e?.preventDefault();
        document.activeElement?.blur();
        if (connectionChecking) return;
        let canConnect = false;
        dispatch({
            connectionChecked: false,
            connectionChecking: true,
            dismissConnectionCheck: false
        });
        const response = await invoke('get_api_key', { hueHubApiUrl });
        try {
            JSON.parse(response);
            canConnect = true;
        } catch (error) {
            console.error(error);
        }
        dispatch({
            connectionChecking: false,
            connectionChecked: true,
            canConnect
        })
        canConnect && setTimeout(() => {
            dispatch({ dismissConnectionCheck: true })
            localStorage.setItem('canConnect', true)
        }, 3500);
    }

    const hideConnectionCheck = !hueIp || !isIpValid(hueIp) || dismissConnectionCheck;

    return (
        <form onSubmit={check}>
            {children}
            {hideConnectionCheck ? null : <>
                {(hueIp && isIpValid(hueIp) && !canConnect) &&  <button id="check-connection" type="submit" disabled={connectionChecking}>Check connection 🛜</button>}
                {connectionChecking && <p>Checking connection to Hue Hub... ⏳</p>}
                {connectionChecked && (canConnect ? <p>Connection to Hue Hub successful! ✅</p> : <>
                    <p>Connection to Hue Hub failed! ❌</p>
                    <p>Make sure your Hue Hub is powered on, connected to your network, and that you have the correct IP address.</p>
                </>)}
            </>}
        </form>
    )
}

export const ApiKey = () => {
    const { state: { hueIp, canConnect, apiKey }, dispatch } = useHueContext()

    const hueHubApiUrl = `https://${hueIp}/api`;

    if (!canConnect) return null;

    const getApiKey = async () => {
        let apiKey = false;
        const response = await invoke('get_api_key', { hueHubApiUrl });
        try {
            const jsonResponse = JSON.parse(response);
            apiKey = jsonResponse?.at(0)?.success?.username;
        } catch (error) {
            console.error(error);
        }
        dispatch({ apiKey })
        localStorage.setItem('apiKey', apiKey)
    }
    
    useEffect(() => {
        const interval = setInterval((canConnect, apiKey) => {
            if (canConnect && !apiKey) {
                getApiKey()
            }
        }, 5000, canConnect, apiKey);
        return () => clearInterval(interval);
    }, [canConnect, apiKey]);

    const noKey = <p>Go to your Hue Hub and press the button on the device</p>;

    return (
        <article>
            {!apiKey && noKey}
        </article>
    )
}

export const Clean = () => {
    const { state: { hueIp, canConnect, apiKey, cleanedCount }, dispatch } = useHueContext()

    const hueHubApiUrl = `https://${hueIp}/clip/v2/resource/entertainment_configuration`;
    const threeHoursInMillis = 3 * 60 * 60 * 1000;

    if (!canConnect || !apiKey) return null;

    const getEntertainmentAreas = async () => {
        let areas = null;
        const response = await invoke('get_entertainment_areas', { hueHubApiUrl, apiKey });
        try {
            const jsonResponse = JSON.parse(response);
            areas = jsonResponse?.data;
        } catch (error) {
            console.error(error);
            dispatch({ apiKey: null })
        }
        console.log(areas)
        return areas;
    }

    useEffect(() => {
        const interval = setInterval(async (canConnect, apiKey) => {
            if (canConnect && apiKey) {
                const entertainmentAreas = await getEntertainmentAreas();
                const trashAreas = entertainmentAreas?.filter(area => area.name.includes('Entertainment area'));

                trashAreas.forEach(async area => {
                    const response = await invoke('delete_entertainment_area', { hueHubApiUrl: `${hueHubApiUrl}/${area.id}`, apiKey });
                    console.log(response)
                })
                const updatedCount = cleanedCount + trashAreas.length;
                dispatch({ cleanedCount: updatedCount });
                sessionStorage.setItem('cleanedCount', updatedCount);
            }
        }, threeHoursInMillis, canConnect, apiKey);
        return () => clearInterval(interval);
    }, [canConnect, apiKey]);

    return (
        <>{(cleanedCount > 1) && <p>✨ "Entertainment Areas" cleaned so far: {cleanedCount} ✨</p>}</>
    )
}

export const Footer = () => {
  return (
    <footer>
      <p>
        Made by <a target="_blank" href="https://simonerescio.it">Simone Rescio</a>,
        source on <a target="_blank" href="https://github.com/srescio/hue-cleaner">GitHub</a>,
        but <a target="_blank" href="https://twitter.com/tweethue/status/1659272590114922503">why?</a>
      </p>
    </footer>
  )
}