
import { useState } from 'react'
import PenguinMap from './PenguinMap'
import './App.css'



const penguinFacts = [
  "Young emperor penguins spent about 90% of their time outside existing and proposed marine protected areas! EXCUSE ME?! Who's looking after my cousins?!",

  "One of my cousins reached 48.37°S — roughly 600 km farther north than previous records! Someone get that penguin a vacation!",

  "Scientists tracked eight young emperor penguins from Atka Bay, Antarctica! Eight tiny explorers against one HUGE ocean. I'm not crying, YOU'RE crying!",

  "Their journeys spanned a region of about 5.1 MILLION square kilometers! And I thought waddling to the other side of the iceberg was impressive.",

  "All eight youngsters left the proposed Weddell Sea protected area within days! To be fair, penguins can't read maps.",

  "By August, every tracked penguin was outside our species' previously mapped range! Scientists really underestimated our travel plans. 😤",

  "Young emperor penguins are still developing their diving and hunting skills. Basically, we're learning how to adult... except underwater.",

  "Protecting our colonies is great, but we travel WAY beyond them! We need safer oceans too. A penguin's gotta explore!"
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
            For young emperor penguins, leaving the colony
            means venturing into an enormous, unfamiliar
            ocean. For us, it means diving beneath the
            surface of scientific data to uncover the
            stories behind their journeys.
          </p>

          <p>
            Through Waddle We Go?, we invite you to explore
            the Southern Ocean, discover the challenges these
            young penguins face, and see why protecting
            their world matters.
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
