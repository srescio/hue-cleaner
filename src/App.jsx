import { Header, HueIpInput, ConnectionCheck, Footer } from './Components'
import './App.css'

function App() {
  return (
    <>
      <Header />
      <section>
        <HueIpInput />
        <ConnectionCheck />
      </section>
      <Footer />
    </>
  )
}

export default App
