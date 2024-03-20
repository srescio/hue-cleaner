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
    const { state: { hueIp }, dispatch } = useHueContext()
    const updateHueIp = (e) => {
        const { value } = e.target
        dispatch({ hueIp: value })
        if (!isIpValid(value)) return;
        localStorage.setItem('hueIp', value)
    }
    const isIpValudFlag = isIpValid(hueIp) ? '✅' : '❌';

    return (
        <article>
            <input
                id="hue-ip"
                maxLength="15"
                onChange={updateHueIp}
                placeholder='Set you hue hub IP'
                defaultValue={hueIp} /> {!!hueIp && <span className="is-valid-flag">{isIpValudFlag}</span>}
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
        connectionChecking,
        connectionChecked,
        dismissConnectionCheck,
        canConnect
    }, dispatch } = useHueContext()

    const hueHubDebugUrl = `https://${hueIp}/debug/clip.html`;

    useEffect(() => {
        dispatch({ dismissConnectionCheck: false, connectionChecked: false });
    }, [hueIp])

    const check = async () => {
        dispatch({
            connectionChecked: false,
            connectionChecking: true,
            dismissConnectionCheck: false
        });
        const canConnect = await invoke('check_hue_hub_connection', { hueHubDebugUrl });
        dispatch({
            connectionChecking: false,
            connectionChecked: true,
            canConnect
        })
        canConnect && setTimeout(() => dispatch({ dismissConnectionCheck: true }), 3500);
    }

    if (!hueIp || !isIpValid(hueIp) || dismissConnectionCheck) return null;

    return (
        <article>
            {(hueIp && isIpValid(hueIp)) &&  <button onClick={check}>Check connection</button>}
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

export const Footer = () => {
  return (
    <footer>
      <p>Made by <a target="_blank" href="https://simonerescio.it">Simone Rescio</a>, source on <a target="_blank" href="https://github.com/srescio/hue-cleaner">GitHub</a></p>
    </footer>
  )
}