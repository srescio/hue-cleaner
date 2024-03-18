import huecleanerImage from './assets/huecleaner.jpeg'
import useHueContext from './Context'
import { isIpValid } from './utils'


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

export const Footer = () => {
  return (
    <footer>
      <p>Made by <a target="_blank" href="https://simonerescio.it">Simone Rescio</a>, source on <a target="_blank" href="https://github.com/srescio/hue-cleaner">GitHub</a></p>
    </footer>
  )
}