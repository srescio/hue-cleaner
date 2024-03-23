import { Header, HubIpInput, ConnectionCheck, Footer, ApiKey, Clean } from './Components'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <section>
        <HubIpInput />
        <ConnectionCheck />
        <ApiKey />
        <Clean />
      </section>
      <Footer />
    </>
  )
}

export default App
