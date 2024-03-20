import { Header, HueIpInput, ConnectionCheck, Footer, ApiKeyCheck } from './Components'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <section>
        <HueIpInput />
        <ConnectionCheck />
        <ApiKeyCheck />
      </section>
      <Footer />
    </>
  )
}

export default App
