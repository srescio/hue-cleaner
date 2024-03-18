import { useState } from 'react'
import useHueContext from './Context'
import { isIpValid } from './utils'
import { Header, Footer } from './Components'
import './App.css'

function App() {
  const { state, dispatch } = useHueContext()
  const { hueIp } = state
  
  const hueHubUrl = `https://${hueIp}`;
  // const [appKey, setAppKey] = useState(localStorage.getItem('appKey'))

  const updateHueIp = (e) => {
    const { value } = e.target
    dispatch({ hueIp: value })
    if (!isIpValid(value)) return;
    localStorage.setItem('hueIp', value)
  }

  const isIpValudFlag = isIpValid(hueIp) ? '✅' : '❌';

  return (
    <>
      <Header />
      <section>
        <input
          id="hue-ip"
          maxlength="15"
          onChange={updateHueIp}
          placeholder='Set you hue hub IP'
          defaultValue={hueIp} /> {!!hueIp && <span className="is-valid-flag">{isIpValudFlag}</span>}
        {!hueIp && <details>
          <summary>How to get the IP of your Hue Hub</summary>
          <p>Open the Hue app on your phone, go to settings, and select the Hue Bridge you want to connect to. The IP address will be listed there.</p>
        </details>}
      </section>
      <Footer />
    </>
  )
}

export default App
