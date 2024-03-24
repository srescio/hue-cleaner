import { Header, HubIpInput, ConnectionCheck, Footer, ApiKey, Clean } from './Components'
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
      <Footer />
    </>
  )
}

export default App
