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

  return (
    <>
      <Header />
      <section>
        <input onChange={updateHueIp} placeholder='Set you hue hub IP' defaultValue={hueIp} /> {!!hueIp && (isIpValid(hueIp) ? '✅' : '❌') }
      </section>
      <Footer />
    </>
  )
}

export default App
