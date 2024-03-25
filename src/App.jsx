import { Header, HubIpInput, ConnectionCheck, Footer, ApiKey, Clean, Autostart } from './Components'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <ConnectionCheck>
        <HubIpInput />
      </ConnectionCheck>
      <ApiKey />
      <Clean />
      <Autostart />
      <Footer />
    </>
  )
}

export default App
