import { Header, HueIpInput, Footer } from './Components'
import './App.css'

function App() {
  
  // const hueHubUrl = `https://${hueIp}`;

  return (
    <>
      <Header />
      <section>
        <HueIpInput />
      </section>
      <Footer />
    </>
  )
}

export default App
