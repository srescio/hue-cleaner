import { useEffect } from 'react'
import huecleanerImage from './assets/huecleaner.jpeg'
import useHueContext from './Context'
import { isIpValid } from './utils'
import { invoke } from '@tauri-apps/api'

export const Header = () => {
  return (
    <header>
      <h1><span className='hue'>hue</span> Cleaner</h1>
      <img src={huecleanerImage} className="logo" alt="Hue Cleaner" />
    </header>
  )
}

export const HueIpInput = () => {
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
                placeholder='Set you hue hub IP'
                defaultValue={hueIp} /> {connectionChecked && <span className="is-valid-flag">{canConnectFlag}</span>}
            {!hueIp && <details>
                <summary>How to get the IP of your Hue Hub</summary>
                <p>Open the Hue app on your phone, go to settings, and select the Hue Bridge you want to connect to. The IP address will be listed there.</p>
            </details>}
        </article>
    )
}

export const ConnectionCheck = () => {
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

    const check = async () => {
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

    if (!hueIp || !isIpValid(hueIp) || dismissConnectionCheck) return null;

    return (
        <article>
            {(hueIp && isIpValid(hueIp) && !canConnect) &&  <button onClick={check}>Check connection</button>}
            {connectionChecking && <p>Checking connection to Hue Hub... ⏳</p>}
            {connectionChecked && (canConnect ? <p>Connection to Hue Hub successful! ✅</p> : <>
                <p>Connection to Hue Hub failed! ❌</p>
                <details>
                    <summary>How to fix connection issues</summary>
                    <p>Make sure your Hue Hub is powered on, connected to your network, and that you have the correct IP address.</p>
                </details>
            </>)}
        </article>
    )
}

export const ApiKeyCheck = () => {
    const { state: { hueIp, canConnect, apiKey, fetchingKey }, dispatch } = useHueContext()

    const hueHubApiUrl = `https://${hueIp}/api`;

    if (!canConnect) return null;

    const getApiKey = async () => {
        dispatch({
            fetchingKey: true
        });
        const apiKey = await invoke('get_api_key', { hueHubApiUrl });
        console.log(apiKey);
        dispatch({
            fetchingKey: false
        })
    }

    const buttonCopy = fetchingKey ? 'Creating API key... ⏳' : 'Create API key';

    const noKey = <>
        <p>Go to your Hue Hub and press the button on the device,<br />
            then click the button below to generate an API key</p>
        <button disabled={fetchingKey} onClick={getApiKey}>{buttonCopy}</button>
    </>;

    return (
        <article>
            {!apiKey && noKey}
        </article>
    )
}

export const Footer = () => {
  return (
    <footer>
      <p>Made by <a target="_blank" href="https://simonerescio.it">Simone Rescio</a>, source on <a target="_blank" href="https://github.com/srescio/hue-cleaner">GitHub</a></p>
    </footer>
  )
}