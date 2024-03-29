import { Header, HubIpInput, ConnectionCheck, Footer, ApiKey, Clean, Autostart } from './Components'
import useHueContext from './Context'

import './App.css'

function App() {
  const { state: { hueIp, canConnect, apiKey }, dispatch } = useHueContext();
  console.log('App', { hueIp, canConnect, apiKey });

  return (
    <>
      <Header />
      <ConnectionCheck>
        <HubIpInput />
      </ConnectionCheck>
      {(canConnect && !apiKey) && <ApiKey />}
      {(canConnect && apiKey) && <Clean />}
      <Autostart />
      <Footer />
    </>
  )
}

export default App
