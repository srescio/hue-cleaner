import { useState } from 'react'
import useHueContext from './Context'
import { isIpValid } from './utils'
import huecleaner from './assets/huecleaner.jpeg'
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

  return (
    <>
      <header>
        <h1><span className='hue'>hue</span> Cleaner</h1>
        <img src={huecleaner} className="logo" alt="Hue Cleaner" />
      </header>
      <section>
        <input onChange={updateHueIp} placeholder='Set you hue hub IP' defaultValue={hueIp} /> {!!hueIp && (isIpValid(hueIp) ? '✅' : '❌') }
      </section>
      <footer>
        Made by <a target="_blank" href="https://simonerescio.it">Simone Rescio</a>
      </footer>
    </>
  )
}

export default App
