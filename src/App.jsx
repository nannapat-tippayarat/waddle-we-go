
import { useState } from 'react'
import PenguinMap from './PenguinMap'
import './App.css'

const penguinFacts = [
  "Scientists tracked eight juvenile emperor penguins during their first journeys at sea!",
  "The penguins were around six months old when researchers began tracking them.",
  "Emperor penguins depend on Antarctic sea ice for breeding and raising their chicks.",
  "The tracking study followed penguins from 2019 into 2020.",
  "A penguin's location doesn't tell us whether it was swimming or resting on sea ice!",
  "Studying young penguins helps scientists understand where they travel and which ocean habitats they use."
]

function App() {
  const [page, setPage] = useState('home')
  const [factIndex, setFactIndex] = useState(0)

  function showPage(nextPage) {
    setPage(nextPage)
    window.scrollTo(0, 0)
  }

  function nextFact() {
    setFactIndex((current) => (current + 1) % penguinFacts.length)
  }

  return (
    <div className="site-shell">

      {/* Navigation */}
      <header className="site-header">
        <button
          className="site-logo"
          onClick={() => showPage('home')}
        >
          🐧 waddle we go?
        </button>

        <nav className="site-nav" aria-label="Main navigation">
          <button onClick={() => showPage('home')}>
            Home
          </button>

          <button onClick={() => showPage('about')}>
            About Us
          </button>

          <a
            className="nav-explore research-link"
            href="https://royalsocietypublishing.org/rsos/article/9/8/211708/96648/Juvenile-emperor-penguin-range-calls-for-extended"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read the Research ↗
          </a>

        </nav>
      </header>

      {/* Homepage */}
      {page === 'home' && (
        <main className="new-homepage">
          <section className="hero-card">

            <div className="hero-text">
              <p className="hero-eyebrow">
                ✦ BIG SCIENCE, LITTLE PENGUINS ✦
              </p>

              <h1>
                little penguins.
                <br />
                <span>big journeys.</span>
              </h1>

              <p className="hero-description">
                Meet eight young emperor penguins
                exploring the Southern Ocean.
                Discover their real journeys,
                understand the science, and learn
                why protecting Antarctic wildlife matters.
              </p>

              <button
                className="hero-cta"
                onClick={() => showPage('map')}
              >
                explore their journeys →
              </button>

              <p className="hero-footnote">
                ♡ Based on real research from 2019–2020
              </p>
            </div>

            <div className="hero-visual">
              <div className="hero-picture">
                <span className="hero-sparkle">✧ ✦ ✧</span>

                <img
                  src="/penguin.png"
                  alt="Emperor penguin illustration"
                  className="hero-penguin"
                />

                <p>your adventure starts here! ♡</p>
              </div>
            </div>

          </section>

          <section className="home-bottom">
            <p>✧ explore • discover • protect ✧</p>
          </section>
        </main>
      )}

      {/* About page */}
      {page === 'about' && (
        <main className="about-page">
          <p className="hero-eyebrow">
            ✦ THE STORY BEHIND THE WADDLE ✦
          </p>

          <h1>about us 🐧</h1>

          <p>
            Waddle We Go? is a student-built project
            that makes penguin research more accessible,
            engaging, and personal.
          </p>

          <p>
            Using real satellite-tracking data from
            juvenile emperor penguins, we turn scientific
            research into interactive maps and stories
            that help people connect with Antarctic
            wildlife and understand why conservation matters.
          </p>

          <button
            className="hero-cta"
            onClick={() => showPage('map')}
          >
            explore the research →
          </button>
        </main>
      )}

      {/* Your existing map */}
      {page === 'map' && (
        <div className="map-section">
          <PenguinMap />
        </div>
      )}

      {/* Clickable penguin fact buddy */}
      
    {page !== 'map' && (
      <div className="fact-buddy">
        <div className="fact-bubble" aria-live="polite">
          <p>{penguinFacts[factIndex]}</p>
          <span>click me for another fact! ↓</span>
        </div>

        <button
          className="fact-penguin"
          onClick={nextFact}
          aria-label="Show another penguin research fact"
          title="Click for a penguin fact!"
        >
          🐧
        </button>
      </div>
    )}


    </div>
  )
}

export default App
