import huecleanerImage from './assets/huecleaner.jpeg'

export const Header = () => {
  return (
    <header>
      <h1><span className='hue'>hue</span> Cleaner</h1>
      <img src={huecleanerImage} className="logo" alt="Hue Cleaner" />
    </header>
  )
}

export const Footer = () => {
  return (
    <footer>
      <p>Made by <a target="_blank" href="https://simonerescio.it">Simone Rescio</a>, source on <a target="_blank" href="https://github.com/srescio/hue-cleaner">GitHub</a></p>
    </footer>
  )
}