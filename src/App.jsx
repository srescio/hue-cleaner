import { Header, HubIpInput, ConnectionCheck, Footer, ApiKey, Clean, Autostart } from './Components'
import useHueContext from './Context'

import './App.css'

function App() {
  const { state: { canConnect, apiKey } } = useHueContext();

  return (
    <>
      <Header />
      <ConnectionCheck>
        <HubIpInput />
      </ConnectionCheck>
      {canConnect && (apiKey ? <Clean /> : <ApiKey />)}
      <Autostart />
      <Footer />
    </>
  )
}

export default App
