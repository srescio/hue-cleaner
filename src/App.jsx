import { Header, HubIpInput, ConnectionCheck, Footer, ApiKeyCheck } from './Components'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <section>
        <HubIpInput />
        <ConnectionCheck />
        <ApiKeyCheck />
      </section>
      <Footer />
    </>
  )
}

export default App
